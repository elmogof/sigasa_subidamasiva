export const checkAudioNameIsCorrect = (name) => {
    if (name.length != 28) {
        return false; //Retorna false si la cantidad de caracteres en el nombre de un audio es diferente a 28
    }

    const regexDate = /^(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/; //Valida un formato de fecha tal que yyyyMMdd
    const regexPhoneNumber = /^[1-9]\d{7}$/; // Valida un número de teléfono de 8 dígitos que comience con un número mayor a 0 
    const regexTime = /^([01]\d|2[0-3])([0-5]\d){2}$/; //Valida un formato de hora tal que HHyyss
    const regexFormat = /\.\w+$/;

    const nameWithoutExtension = name.replace(regexFormat, '');
    // console.log(nameWithoutExtension);
    const parts = nameWithoutExtension.split("_");

    const checkDate = regexDate.test(parts[0]);
    const checkPhoneNumber = regexPhoneNumber.test(parts[1]);
    const checkTime = regexTime.test(parts[2]);
    const checkFormat = regexFormat.test(name);

    return checkDate && checkPhoneNumber && checkTime && checkFormat;
}
