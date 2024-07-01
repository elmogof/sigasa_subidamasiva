import axios from "axios";
import { Constants } from "../../constants/Constants.js";

const insertClientListData = async (data) => {
  let client = null;
  await axios
    .post(`${Constants.clientBaseURL}/InsertClientList`, data)
    .then((response) => {
      client = response.data;
    })
    .catch((error) => {
        console.log(error.message);
    });
  return client;
};

export default insertClientListData;
