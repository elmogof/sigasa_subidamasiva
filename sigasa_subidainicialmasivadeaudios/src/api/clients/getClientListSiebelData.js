import axios from "axios";
import { Constants } from "../../constants/Constants.js";

// Función para dividir un array en partes más pequeñas
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const getClientListSiebelData = async ({ phoneNumberList }) => {
  const chunkSize = 10; // Tamaño del grupo de números de teléfono
  const phoneChunks = chunkArray(phoneNumberList.split(','), chunkSize);

  // Array para almacenar todas las promesas de solicitud
  const promises = phoneChunks.map(chunk => (
    axios.get(`${Constants.clientBaseURL}/GetClientListSiebel`, {
      params: {
        phoneNumberList: chunk.join(','),
      },
    })
  ));

  let clientList = [];

  try {
    // Esperar a que todas las solicitudes se completen usando Promise.all
    const responses = await Promise.all(promises);

    // Procesar cada respuesta
    responses.forEach(response => {
      if (response.data && response.data.objectList) {
        clientList = clientList.concat(response.data.objectList);
      }
    });
  } catch (error) {
    console.log("Error en alguna de las solicitudes:", error.message);
  }

  return clientList;
};

export default getClientListSiebelData;
