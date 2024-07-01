import oracledb from 'oracledb';
import { Constants } from '../../constants/Constants.js';

const getConfigValuesData = async () => {
    let connection;
    let response = [];
    const sql = Constants.sqlGetConfigValues;
    const consultData = {
        result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
    };
    const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,  // transforma la respuesta de array a objeto
        autoCommit: true
    };
    try {
        connection = await oracledb.getConnection(
            {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectionString: process.env.DB_CONNECTION_STRING
            }
        );

        const result = await connection.execute(sql, consultData, options);
        const resultSet = result.outBinds.result;
        const configValueResult = await resultSet.getRows();
        await resultSet.close();

        response = configValueResult;

    } catch (err) {
        console.error(err.message);
        console.log(Constants.requestParamsError);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err.message);
            }
        } else {
            console.log(Constants.databaseConectionError);
        }
    }
    return response;
}

export default getConfigValuesData;