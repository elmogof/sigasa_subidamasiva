import axios from "axios";
import { Constants } from "../../constants/Constants.js";

const insertMassiveNotificationData = async (data) => {
  let notification = null;
  await axios
    .post(`${Constants.notificationBaseURL}/InsertMassiveNotifications`, data)
    .then((response) => {
      notification = response.data;
      // console.log(response);
    })
    .catch((error) => {
      console.log(error.message);
    });
  return notification;
};

export default insertMassiveNotificationData;
