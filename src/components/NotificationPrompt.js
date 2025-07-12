import React, { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "../firebase-config";

const NotificationPrompt = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [token, setToken] = useState(null);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        const fcmToken = await getToken(messaging, {
          vapidKey: "YOUR_PUBLIC_VAPID_KEY" // Replace with your Firebase project's Web Push certificate key
        });

        if (fcmToken) {
          console.log("FCM Token:", fcmToken);
          setToken(fcmToken);
          // You can send this token to your backend to schedule push notifications
        }
      }
    } catch (err) {
      console.error("Push notification setup failed:", err);
    }
  };

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Push message received:", payload);
      if (payload?.notification?.title) {
        alert(payload.notification.title);
      }
    });
  }, []);

  return (
    <div className="notification-prompt">
      {permission !== "granted" ? (
        <button onClick={requestPermission}>
          Enable Daily Weather Alerts
        </button>
      ) : (
        <p style={{ fontSize: "0.9rem", color: "green" }}>
          ✅ Notifications enabled
        </p>
      )}
    </div>
  );
};

export default NotificationPrompt;
