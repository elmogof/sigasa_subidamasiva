import axios from "axios";
import { Constants } from "../../constants/Constants.js";

const getClientListData = async ({ identificaciones }) => {
  let client = null;
  await axios
    .get(`${Constants.clientBaseURL}/GetClientList`, {
      params: {
        identificaciones: identificaciones,
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

export default getClientListData;
