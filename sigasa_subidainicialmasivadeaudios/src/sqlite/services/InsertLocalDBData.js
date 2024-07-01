import { dbPromise } from '../dbPromise.js';
import { getConfigValues } from '../../global/getConfigValues.js';

const InsertLocalDBData = async () => {
    try {
        const db = await dbPromise;
        const configValues = await getConfigValues();

        const carga_inicial_ejecutada = configValues.carga_inicial_ejecutada;
        const ultimo_archivo_procesado_ventas = configValues.ultimo_archivo_procesado_ventas;
        const ultimo_archivo_procesado_retencion = configValues.ultimo_archivo_procesado_retencion;
        const ultimo_archivo_procesado_operaciones = configValues.ultimo_archivo_procesado_operaciones;
        const existe_carga_ejecutandose = configValues.existe_carga_ejecutandose;

        // Función para insertar o actualizar registros en la tabla
        const insertOrUpdate = async (nombre, valor) => {
            await db.run(`
                INSERT INTO GEA_Valores_Configuracion (nombre, valor)
                VALUES ($nombre, $valor)
                ON CONFLICT(nombre) DO UPDATE SET valor = excluded.valor
            `, { $nombre: nombre, $valor: valor });
        };

        await insertOrUpdate(carga_inicial_ejecutada.name, carga_inicial_ejecutada.value);
        await insertOrUpdate(ultimo_archivo_procesado_ventas.name, ultimo_archivo_procesado_ventas.value);
        await insertOrUpdate(ultimo_archivo_procesado_retencion.name, ultimo_archivo_procesado_retencion.value);
        await insertOrUpdate(ultimo_archivo_procesado_operaciones.name, ultimo_archivo_procesado_operaciones.value);
        await insertOrUpdate(existe_carga_ejecutandose.name, existe_carga_ejecutandose.value);

        // Función para verificar si un registro existe
        const recordExists = async (nombre) => {
            const row = await db.get(`
                SELECT 1 FROM GEA_Valores_Configuracion
                WHERE nombre = $nombre
            `, { $nombre: nombre });
            return row !== undefined;
        };

        if (!await recordExists("ultima_fecha_carga_masiva")) {
            await insertOrUpdate("ultima_fecha_carga_masiva", "");
        }
    } catch (error) {
        console.error(error.message);
    }
};

export default InsertLocalDBData;