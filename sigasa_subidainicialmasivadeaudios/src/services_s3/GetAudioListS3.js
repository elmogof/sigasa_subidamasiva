import * as Minio from "minio";

const GetAudioListS3 = async (bucketName, folderName, startAfter = "") => {

  const minioClient = new Minio.Client({
    endPoint: process.env.S3_ENDPOINT_URL,
    port: 443,
    useSSL: true,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
  });

  var stream = minioClient.listObjectsV2(bucketName, folderName, true, startAfter);

  const audioList = [];
  const dataPromise = new Promise((resolve) => {
    stream.on('data', (obj) => {
      audioList.push(obj);
    });

    stream.on('error', (err) => {
      console.log(err);
    });

    stream.on('end', () => {
      resolve(audioList);
    });
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(audioList);
    }, 5000);  // 5 segundos de timeout
  });

  return Promise.race([dataPromise, timeoutPromise]);
};

export default GetAudioListS3;