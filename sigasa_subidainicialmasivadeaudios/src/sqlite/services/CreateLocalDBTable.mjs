import { dbPromise } from "../dbPromise.js";

const CreateLocalDBTable = async () => {
    try {
        const db = await dbPromise;
        await db.exec("CREATE TABLE IF NOT EXISTS GEA_Valores_Configuracion (nombre TEXT PRIMARY KEY, valor TEXT)");
    } catch (error) {

    }
}

export default CreateLocalDBTable;