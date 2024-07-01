import axios from "axios";
import { Constants } from "../../constants/Constants.js";

const getClienteSiebelData = async ({ phoneNumber }) => {
  let client = null;
  await axios
    .get(`${Constants.clientBaseURL}/GetClientSiebel`, {
      params: {
        phoneNumber: phoneNumber,
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

export default getClienteSiebelData;
