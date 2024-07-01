import axios from "axios";
import { Constants } from "../../constants/Constants.js";

const insertNotificationData = async (data) => {
  let notification = null;
  await axios
    .post(`${Constants.notificationBaseURL}/InsertNotifications`, data)
    .then((response) => {
      notification = response.data;
      // console.log(response);
    })
    .catch((error) => {
      console.log(error.message);
    });
  return notification;
};

export default insertNotificationData;
