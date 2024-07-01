import axios from "axios";
import { Constants } from "../../constants/Constants.js";

const getClientData = async ({ identificacion }) => {
  let client = null;
  await axios
    .get(`${Constants.clientBaseURL}/GetClient`, {
      params: {
        identificacion: identificacion,
      },
    })
    .then((response) => {
      client = response.data;
    })
    .catch((error) => {
        console.log(error.message);
    });
  return client?.data?.objectList;
};

export default getClientData;
