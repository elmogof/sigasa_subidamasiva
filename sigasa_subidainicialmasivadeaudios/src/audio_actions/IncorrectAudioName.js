import insertMassiveNotificationData from "../api/notifications/insertMassiveNotificationData.js";
import insertNotificationData from "../api/notifications/insertNotificationData.js";

const IncorrectAudioName = async (incorrectAudioNames, isMassiveUpload = false) => {
  let notifications = [];
  for (const audioName of incorrectAudioNames) {
    const notificationObject = {
      id_usuario: 5,
      titulo: "Error en formato de nombre de audio",
      descripcion: `El audio ${audioName} tiene un formato de nombre inválido.`,
      fecha: new Date().getTime(),
      tipo: 1,
      audio_name: audioName,
    };
    notifications.push(notificationObject);
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
    Promise.all(insertPromises).then(() => {
      console.log("Inserción de notificaciones completada en segundo plano.");
    }).catch((error) => {
      console.error("Error al insertar notificaciones:", error);
    });
  }
}

export default IncorrectAudioName;
