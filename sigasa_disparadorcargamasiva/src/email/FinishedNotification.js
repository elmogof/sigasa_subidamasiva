import SendEmailNotification from "./SendEmailNotification.js";
import * as dotenv from "dotenv";

dotenv.config();

const FinishedNotification = async () => {
    const year = process.env.END_UPLOAD_DATE.slice(0, 4);
    const subject = `Subida de audios del año ${year} finalizada`;
    const message = `La subida de audios para el año ${year} ha finalizado correctamente.`;
    await SendEmailNotification(subject, message);
}

export default FinishedNotification;