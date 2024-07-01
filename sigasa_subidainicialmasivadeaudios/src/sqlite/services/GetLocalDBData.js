import { dbPromise } from "../dbPromise.js";

const GetLocalDBData = async () => {
    const configValues = {};
    try {
        const db = await dbPromise;
        await db.each("SELECT nombre, valor FROM GEA_Valores_Configuracion", (err, row) => {
            configValues[row.nombre] = {
                name: row.nombre,
                value: row.valor
            };
            if (err) {
                console.error(err.message);
            }
        });

        return configValues;
    } catch (error) {
        console.error(error.message);
        return configValues;
    }
}

export default GetLocalDBData;