export const Constants = {
  successMessage: "Ejecución exitosa",
  successDBConnection: "Conexión exitosa a la base de datos de Oracle",
  databaseConectionError: {
    code: 503,
    message: "No se pudo establecer la conexión con la base de datos",
  },
  requestParamsError: {
    code: 422,
    message: "Los parámetros recibidos son inválidos",
  },
  sqlInsertAudioList:
    'begin "GEA_INSERTAR_AUDIOS"(:audios,:errorCode,:errorMessage); end;',
  sqlGetConfigValues: 'begin "GEA_OBTENER_VALORES_CONFIG"(:result); end;',
  sqlUpdateConfigValue: 'begin "GEA_ACTUALIZAR_VALORES_CONFIG"(:valoresConfig,:errorCode,:errorMessage); end;',
  clientBaseURL: "http://localhost:3007",
  notificationBaseURL: "http://localhost:3004",
};
