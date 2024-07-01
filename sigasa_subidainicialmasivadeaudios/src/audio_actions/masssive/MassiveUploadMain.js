import { getNextDayPrefix } from "../../global/getNextDayPrefix.js";
import { updateConfigValues } from "../../global/updateConfigValues.js";
import GetLocalDBData from "../../sqlite/services/GetLocalDBData.js";
import UpdateLocalDBData from "../../sqlite/services/UpdateLocalDBData.js";
import MassiveUpload from "./MassiveUpload.js";

const SubidaInicialMasivaDeAudios = async () => {
    let lastSavedDatePrefix = "";
    try {
        const timeID = new Date().getTime();
        console.time(`Tiempo total de subida inicial masiva de audios ${timeID}`);
        const configValues = await GetLocalDBData();

        // console.log("Valores de configuración: ", configValues);

        const carga_inicial_ejecutada = configValues.carga_inicial_ejecutada;
        const ultimo_archivo_procesado_ventas = configValues.ultimo_archivo_procesado_ventas;
        const ultimo_archivo_procesado_retencion = configValues.ultimo_archivo_procesado_retencion;
        const ultimo_archivo_procesado_operaciones = configValues.ultimo_archivo_procesado_operaciones;
        const existe_carga_ejecutandose = configValues.existe_carga_ejecutandose;
        const ultima_fecha_carga_masiva = configValues.ultima_fecha_carga_masiva;

        lastSavedDatePrefix = ultima_fecha_carga_masiva.value === "" ? process.env.START_UPLOAD_DATE : ultima_fecha_carga_masiva.value;

        if (carga_inicial_ejecutada.value === "true") {
            console.log("Carga inicial YA ejecutada");
            return lastSavedDatePrefix;
        }

        if (existe_carga_ejecutandose.value === "true") {
            console.log("Ya existe una carga ejecutandose");
            return lastSavedDatePrefix;
        }

        const uploadStarted = [{
            nombre: existe_carga_ejecutandose.name,
            valor: "true"
        }];

        //Se actualiza la configuración para indicar que se está ejecutando la carga
        await updateConfigValues(uploadStarted);
        await UpdateLocalDBData(uploadStarted);

        if (!ultimo_archivo_procesado_operaciones || !ultimo_archivo_procesado_retencion || !ultimo_archivo_procesado_ventas) {
            console.log("Las columnas ultimo_archivo_procesado_operaciones, ultimo_archivo_procesado_retencion y ultimo_archivo_procesado_ventas son requeridas");
            return;
        }

        const startAfterVentas = ultimo_archivo_procesado_ventas.value ?? "";
        const startAfterRetencion = ultimo_archivo_procesado_retencion.value ?? "";
        const startAfterOperaciones = ultimo_archivo_procesado_operaciones.value ?? "";

        console.log("Subiendo audios para el mes: ", lastSavedDatePrefix);

        const [lastAudioFileVentas, lastAudioFileRetencion, lastAudioFileOperaciones] = await Promise.all([
            MassiveUpload("Ventas", startAfterVentas, lastSavedDatePrefix),
            MassiveUpload("Retencion", startAfterRetencion, lastSavedDatePrefix),
            MassiveUpload("Operaciones", startAfterOperaciones, lastSavedDatePrefix)
        ]);

        const configValuesUpdated = [
            { nombre: existe_carga_ejecutandose.name, valor: "false" },
            { nombre: ultimo_archivo_procesado_ventas.name, valor: lastAudioFileVentas === "" ? startAfterVentas : lastAudioFileVentas },
            { nombre: ultimo_archivo_procesado_retencion.name, valor: lastAudioFileRetencion === "" ? startAfterRetencion : lastAudioFileRetencion },
            { nombre: ultimo_archivo_procesado_operaciones.name, valor: lastAudioFileOperaciones === "" ? startAfterOperaciones : lastAudioFileOperaciones }
        ]

        const endDate = process.env.END_UPLOAD_DATE;
        if (lastSavedDatePrefix === endDate) {
            configValuesUpdated.push({ nombre: carga_inicial_ejecutada.name, valor: "true" });
            console.log("Carga inicial ejecutada");
        }

        await updateConfigValues(configValuesUpdated);

        configValuesUpdated.push({ nombre: ultima_fecha_carga_masiva.name, valor: lastSavedDatePrefix === endDate ? lastSavedDatePrefix : getNextDayPrefix(lastSavedDatePrefix) });

        await UpdateLocalDBData(configValuesUpdated);
        console.timeEnd(`Tiempo total de subida inicial masiva de audios ${timeID}`);
    } catch (error) {
        const configValuesUpdated = [{
            nombre: "existe_carga_ejecutandose",
            valor: "false"
        }];
        await updateConfigValues(configValuesUpdated);
        await UpdateLocalDBData(configValuesUpdated);
        console.log(error.message);
        throw new Error(error.message);
    }

    return lastSavedDatePrefix;
};

export default SubidaInicialMasivaDeAudios;
