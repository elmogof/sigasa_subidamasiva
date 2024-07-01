import SendEmailNotification from "./SendEmailNotification.js";

const ErrorNotification = async (errorMessage) => {
    const subject = 'Error en la subida masiva de audios';
    const message = `Ocurrió un error en la subida masiva de audios: ${errorMessage}. Se retomará la carga masiva de audios desde la última fecha registrada.`;
    await SendEmailNotification(subject, message);
}

export default ErrorNotification;