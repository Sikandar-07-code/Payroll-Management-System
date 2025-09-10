import Notification from "../models/Notification.js";

export const sendNotification = async (userId, message) => {
  try {
    await Notification.create({ user: userId, message });
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};
