
const PushNotifications = require("@pusher/push-notifications-server");

const beamsClient = new PushNotifications({
  instanceId: process.env.INSTANCE_ID,
  secretKey: process.env.BEAMS_SECRET_KEY,
});

class BeamsEventPublishService {
  static async publishToUser(userId, notification) {
    try {
      const response = await beamsClient.publishToUsers([userId], {
        fcm: {
          notification: {
            title: notification.title,
            body: notification.body,
          },
        },
        apns: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
          },
        },
        web: {
          notification: {
            title: notification.title,
            body: notification.body,
          },
        },
      });
      console.log("Just published:", response.publishId);
      return response;
    } catch (error) {
      console.error("Error publishing to user:", error);
      throw error;
    }
  }
}

module.exports = BeamsEventPublishService;