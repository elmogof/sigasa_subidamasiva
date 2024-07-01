import updateConfigValuesData from "../api/configs/updateConfigValuesData.js";

export const updateConfigValues = async (valoresConfig) => {
    try {
        await updateConfigValuesData(valoresConfig);
    } catch (error) {
        console.error(error);
    }
};
