import { dateAndTimeFromStringToMiliseconds } from "../global/dateAndTimeToMiliseconds.js";
import { getAudioFormat } from "../global/getAudioFormat.js";
import { getIDType } from "../global/getIDType.js";
import { getPhoneNumberList } from "../global/getPhoneNumberList.js";
import { InsertAudioListDB } from "../services/InsertAudioListDB.js";
import getClientListSiebelData from "../api/clients/getClientListSiebelData.js";
import getClientListData from "../api/clients/getClientListData.js";
import insertClientListData from "../api/clients/insertClientListData.js";
import insertMassiveNotificationData from "../api/notifications/insertMassiveNotificationData.js";
import insertNotificationData from "../api/notifications/insertNotificationData.js";


const CorrectAudioName = async (correctAudioNames, sourcePath, isMassiveUpload = false) => {

  const audios = [];
  const notifications = [];
  const clients = [];
  const clientSiebelList = [];

  const tipo = {
    Ventas: "V",
    Retencion: "R",
    Operaciones: "U",
    Pruebas: "P",
  };

  const phoneNumberList = getPhoneNumberList(correctAudioNames, 50);

  const clientSiebelListPromises = phoneNumberList.map(phoneNumbers =>
    getClientListSiebelData({ phoneNumberList: phoneNumbers })
  );

  const clientSiebelLists = await Promise.all(clientSiebelListPromises);

  for (const list of clientSiebelLists) {
    if (list) {
      clientSiebelList.push(...list);
    }
  }

  const DNIList = clientSiebelList.map((client) => client.CEDULA ?? "");
  const clientSigasaList = await getClientListData({ identificaciones: DNIList });

  clientSiebelList.forEach((client) => {
    const clientSigasa = clientSigasaList.find((c) => c.identificacion === client.CEDULA);
    if (!clientSigasa) {
      const clientObject = {
        identificacion: client.CEDULA,
        nombre: client.NOMBRE,
        primer_apellido: client.APELLIDO1 ?? "",
        segundo_apellido: client.APELLIDO2 ?? "",
        tipo_identificacion: getIDType(client.TIPO_CEDULA),
      };
      clients.push(clientObject);
    }
  });

  const uniqueClientsMap = {};
  clients.forEach(client => {
    uniqueClientsMap[client.identificacion] = client;
  });
  const uniqueClients = Object.values(uniqueClientsMap);

  correctAudioNames.forEach((audioName) => {
    const audioNameParts = audioName.split("_");
    const date = audioNameParts[0];
    const phone = audioNameParts[1];
    const time = audioNameParts[2];
    let insertNotification = true;

    for (const client of clientSiebelList) {
      if (client.TELEFONO === phone) {
        const audio = {
          nombre_audio: audioName,
          url_audio: `${sourcePath}/${audioName}`,
          numero_telefono: phone,
          fecha_creacion: dateAndTimeFromStringToMiliseconds(date, time),
          fecha_carga: new Date().getTime(),
          formato: getAudioFormat(audioName),
          tipo: tipo[sourcePath],
          identificacion: client.CEDULA,
        };
        audios.push(audio);
        insertNotification = false;
        break;
      }
    }

    if (insertNotification) {
      const notificacion = {
        titulo: "Cliente no encontrado",
        descripcion: `El número de teléfono ${phone} no se encuentra registrado en la base de datos de Siebel`,
        fecha: new Date().getTime(),
        tipo: 2,
        nombre_audio: audioName,
      };
      notifications.push(notificacion);
    }
  });

  if (uniqueClients.length > 0) {
    const clientResponse = await insertClientListData({ clientes: uniqueClients })
    if (clientResponse.code) {
      const { code, message } = clientResponse;
      console.log(`Error: ${message}`);
      console.log(`Code: ${code}`);
    }
  }

  if (notifications.length > 0) {
    // Dividir el array de notificaciones en grupos de 50
    const notificationGroups = [];
    for (let i = 0; i < notifications.length; i += 50) {
      notificationGroups.push(notifications.slice(i, i + 50));
    }

    // Crear una promesa para cada grupo de notificaciones
    const insertPromises = notificationGroups.map(group => {
      return isMassiveUpload ?
        insertMassiveNotificationData({ notificaciones: group }) :
        insertNotificationData({ notificaciones: group });
    });

    // Esperar a que todas las inserciones se completen
    Promise.all(insertPromises)
      .then(() => {
      })
      .catch((error) => {
        console.error("Error al insertar notificaciones:", error);
      });
  }

  //Guardar nombre del últtimo audio procesado
  let lastAudioFileName = "";

  if (audios.length > 0) {
    const audioResponse = await InsertAudioListDB({ audios });
    if (audioResponse.code) {
      const { code, message } = audioResponse;
      console.log(`Error: ${message}`);
      console.log(`Code: ${code}`);
    }
    lastAudioFileName = audios[audios.length - 1].nombre_audio ?? "";
  }

  return lastAudioFileName;
}

export default CorrectAudioName;
