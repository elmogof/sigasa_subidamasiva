import getConfigValuesData from "../api/configs/getConfigValuesData.js";

export const getConfigValues = async () => {
    try {
        const configValues = {};
        const configValuesRaw = await getConfigValuesData();

        configValuesRaw.forEach((element) => {
            configValues[element.nombre] = {
                name: element.nombre,
                value: element.valor
            };
        });
        return configValues;

    } catch (error) {
        console.log(error.message)
        return {}
    }
}

