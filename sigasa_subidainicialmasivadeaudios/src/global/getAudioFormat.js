export const getAudioFormat = (audio) => {
    const regexFormat = /\.\w+$/;
    const format = audio.match(regexFormat);
    return format ? format[0]?.replace(".", "") : false; 
}