import axios from "axios";
import { Constants } from "../../constants/Constants.js";

const insertClientData = async (data) => {
  let client = null;
  await axios
    .post(`${Constants.clientBaseURL}/InsertClient`, data)
    .then((response) => {
      client = response.data;
    })
    .catch((error) => {
        console.log(error.message);
    });
  return client?.data?.objectList;
};

export default insertClientData;
