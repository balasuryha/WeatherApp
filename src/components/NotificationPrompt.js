// src/components/NotificationPrompt.js

import React, { useEffect, useState } from "react";
import messaging from "../firebase-config";
import { getToken, onMessage } from "firebase/messaging";

const NotificationPrompt = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        const fcmToken = await getToken(messaging, {
          vapidKey: "YOUR_PUBLIC_VAPID_KEY"
        });

        if (fcmToken) {
          console.log("✅ FCM Token:", fcmToken);
        }
      }
    } catch (err) {
      console.error("❌ Error getting push token:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      alert(payload?.notification?.title || "Weather Notification!");
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {permission !== "granted" ? (
        <button onClick={requestPermission}>Enable Daily Weather Alerts</button>
      ) : (
        <p>✅ Notifications enabled</p>
      )}
    </div>
  );
};

export default NotificationPrompt;
