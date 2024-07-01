import oracledb from "oracledb";
import { Constants } from "../../constants/Constants.js";

export const updateConfigValuesData = async (valoresConfig) => {
  let connection;
  const sql = Constants.sqlUpdateConfigValue;
  const consultData = {
    valoresConfig: {
      dir: oracledb.BIND_IN,
      type: "valores_config_tab_t",
      val: valoresConfig,
    },
    errorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    errorMessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
  };

  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT, // transforma la respuesta de array a objeto
    autoCommit: true, //Siempre colocar en Updates o Insert, esta opción hace que después de completar un statement haga commit automaticamente
  };

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING,
    });

    const result = await connection.execute(sql, consultData, options);
    const errCode = result.outBinds.errorCode;
    const errMsg = result.outBinds.errorMessage;

    if (errCode) {
      throw errMsg;
    }
  } catch (err) {
    console.error(err);
    return Constants.requestParamsError;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    } else {
      return Constants.databaseConectionError;
    }
  }
  return Constants.successMessage;
};

export default updateConfigValuesData;
