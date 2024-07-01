'use strict';
/*
  Dice San Google: 
    Las últimas versiones de JavaScript ponen en uso la directiva de 'uso estricto'. 
    Esta directiva es para implementar prácticas de codificación seguras
*/
import StartMassiveAudioUploadController from '../controllers/StartMassiveAudioUploadController.js';

const Routes = (app) => {
  app.route('/StartMassiveAudioUpload').get(StartMassiveAudioUploadController);
}

export default Routes;