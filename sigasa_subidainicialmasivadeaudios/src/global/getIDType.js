export const getIDType = (IDType) => { 
    if (!IDType){
        return "E";
    } 
    const tildesMap = {
        'á': 'a',
        'é': 'e',
        'í': 'i',
        'ó': 'o',
        'ú': 'u',
        'Á': 'A',
        'É': 'E',
        'Í': 'I',
        'Ó': 'O',
        'Ú': 'U'
    };

    const tipo_identificacion = {
        'FISICA': 'F',
        'JURIDICA': 'J',
        'RESIDENCIA': 'R',
        'PASAPORTE': 'P'
    }

    const normalizaedIDType = IDType.replace(/[áéíóúÁÉÍÓÚ]/g, match => tildesMap[match]).toUpperCase();

    return tipo_identificacion[normalizaedIDType];
}