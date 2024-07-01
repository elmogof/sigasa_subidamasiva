import { dbPromise } from '../dbPromise.js';

const UpdateLocalDBData = async (configValues = []) => {
    try {
        const db = await dbPromise;

        // Función para insertar o actualizar registros en la tabla
        const insertOrUpdate = async (nombre, valor) => {
            await db.run(`
                INSERT INTO GEA_Valores_Configuracion (nombre, valor)
                VALUES ($nombre, $valor)
                ON CONFLICT(nombre) DO UPDATE SET valor = excluded.valor
            `, { $nombre: nombre, $valor: valor });
        };

        for (const configValue of configValues) {
            await insertOrUpdate(configValue.nombre, configValue.valor);
        }

    } catch (error) {
        console.error(error.message);
    }
};

export default UpdateLocalDBData;