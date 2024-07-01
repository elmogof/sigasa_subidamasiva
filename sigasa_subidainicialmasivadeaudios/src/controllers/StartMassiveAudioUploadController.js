import SubidaInicialMasivaDeAudios from '../audio_actions/masssive/MassiveUploadMain.js'

const StartMassiveAudioUploadController = async (req, res) => {
    try {
        console.log("Iniciando proceso de carga masiva de audios");
        const date = await SubidaInicialMasivaDeAudios();
        res.status(200).json({
            message: "Procesado correctamente",
            date: date
        });
    } catch (error) {
        res.status(200).json({
            error: error.message
        });
    }
}

export default StartMassiveAudioUploadController;