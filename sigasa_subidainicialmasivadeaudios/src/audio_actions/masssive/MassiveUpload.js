import GetAudioListS3 from "../../services_s3/GetAudioListS3.js";
import { checkAudioNameIsCorrect } from "../../global/checkAudioNameIsCorrect.js";
import CorrectAudioName from "../CorrectAudioName.js";
import IncorrectAudioName from "../IncorrectAudioName.js";

const MassiveUpload = async (sourcePath = "", startAfter = "", datePrefix) => {
  if (!datePrefix) {
    throw new Error('datePrefix is required');
  }

  const correctAudioNames = [];
  const incorrectAudioNames = [];
  let audioList = [];
  
  try {
    audioList = await GetAudioListS3(
      "audiosice",
      `${sourcePath}/${datePrefix}`,
      startAfter
    );
  } catch (error) {
    console.log(`Error al obtener la lista de audios ${sourcePath}/${datePrefix}`);
    console.log(`Mensaje: `, error.message);
  }

  console.log(`Audios encontrados ${sourcePath}`, audioList.length);

  for (const audio of audioList) {
    if (audio.size > 0) {
      const audioName = audio.name.split("/").at(-1); //at(-1) accede al último elemento del array
      if (checkAudioNameIsCorrect(audioName)) {
        correctAudioNames.push(audioName);
      } else {
        incorrectAudioNames.push(audioName);
      }
    }
  }

  let lastAudioFileName = "";

  if (correctAudioNames.length > 0) {
    lastAudioFileName = await CorrectAudioName(correctAudioNames, sourcePath, true);
  }

  if (incorrectAudioNames.length > 0) {
    IncorrectAudioName(incorrectAudioNames, true);
  }

  return lastAudioFileName;
};

export default MassiveUpload;
