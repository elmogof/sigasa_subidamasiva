import nodemailer from 'nodemailer';
import * as dotenv from "dotenv";

dotenv.config();

const SendEmailNotification = async (subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: parseInt(process.env.EMAIL_PORT), // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: subject,
            text: message,
        };

        console.log(mailOptions);

        const { response } = await transporter.sendMail(mailOptions);
        console.log("Email response: ", response);
    } catch (error) {
        console.error(error.message);
    }
}

export default SendEmailNotification;