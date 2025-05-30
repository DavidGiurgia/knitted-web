import { createNotification, deleteNotification, fetchNotifications, markNotificationAsRead } from "../api/notifications";

// Creează o notificare
export const sendNotification = async (userId, message, type, sender) => {
  try {
    const notification = await createNotification(userId, message, type, sender);
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
};

export const getNotificationsForUser = async (userId, unreadOnly = false) => {
  try {
    // Fetch toate notificările
    const notifications = await fetchNotifications(userId, unreadOnly);

    return notifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
};


// Marchează o notificare ca citită
export const markNotificationAsReadById = async (notificationId) => {
  try {
    return await markNotificationAsRead(notificationId);
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};

// Șterge o notificare
export const removeNotificationById = async (notificationId) => {
  try {
    return await deleteNotification(notificationId);
  } catch (error) {
    console.error("Failed to delete notification:", error);
    throw error;
  }
};
