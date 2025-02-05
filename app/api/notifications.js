import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://192.168.0.103:8000/notifications"; // URL-ul API-ului backend

// Creează o notificare
export const createNotification = async (userId, type, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, {
      userId,
      type,  // Include tipul notificării
      data   // Include datele flexibile pentru notificare
    });
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Obține notificările unui utilizator
export const fetchNotifications = async (userId, unreadOnly = false) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`, {
      params: { unreadOnly }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Marchează o notificare ca citită
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Șterge o notificare
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/${notificationId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Marchează toate notificările unui utilizator ca citite
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/${userId}/markAllRead`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};
