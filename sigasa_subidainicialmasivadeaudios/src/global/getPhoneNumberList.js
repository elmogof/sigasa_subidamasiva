export const getPhoneNumberList = (correctAudioNames, batchSize) => {
  // Extrae los números de teléfono de los nombres de audio
  const phoneNumbers = correctAudioNames.map((audioName) => audioName.split("_")[1]);

  // Elimina duplicados
  const uniquePhoneNumbers = [...new Set(phoneNumbers)];

  // Función para dividir en batches
  const processInBatches = (array, batchSize) => {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      // Crea un batch desde el índice i hasta i + batchSize
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  };

  // Función para formatear los números de teléfono en cada batch
  const formatPhoneNumbersBatch = (batch) => {
    return batch.map((audioName) => `'${audioName}'`).join(",");
  };

  // Divide en batches y formatea
  const batches = processInBatches(uniquePhoneNumbers, batchSize);
  return batches.map(formatPhoneNumbersBatch);
};