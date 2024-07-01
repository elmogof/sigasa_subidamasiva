import axios from 'axios';
import ErrorNotification from '../email/ErrorNotification.js';
import FinishedNotification from '../email/FinishedNotification.js';
import { MassiveUploadCronTask } from '../cron/MassiveUploadCronTask.js';

const ExecMassiveUpload = async () => {
    try {
        const { data } = await axios.get('http://localhost:3006/StartMassiveAudioUpload');
        console.log(data);

        if(data.error){
            MassiveUploadCronTask.stop();
            await ErrorNotification(data.error);
            MassiveUploadCronTask.start();
        }

        if (data.date === process.env.END_UPLOAD_DATE) {
            MassiveUploadCronTask.stop();
            await FinishedNotification();
            console.log('Stopping task...');
            process.exit(0);
        }
    } catch (error) {
       console.error(error.message);
    }
}

export default ExecMassiveUpload;