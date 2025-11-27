import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifLength, setNotifLength] = useState(0);
  const [userData, setUserData] = useState(null);

  // 1️⃣ Fetch user and initial notifications
  useEffect(() => {
    const init = async () => {
      try {
        // Load user session
        const resUser = await axios.get(
          "https://caferealitea.onrender.com/user",
          { withCredentials: true }
        );

        if (!resUser.data.logged_in || !resUser.data.role) return;

        setUserData(resUser.data.user || resUser.data);

        // Load initial pending orders for "Sales"
        const resNotif = await fetch(
          "https://caferealitea.onrender.com/pending-orders",
          { credentials: "include" }
        );
        if (resNotif.ok) {
          const data = await resNotif.json();
          if (Array.isArray(data)) setNotifLength(data.length);
        }
      } catch (err) {
        console.error("Init load error:", err);
      }
    };

    init();
  }, []);

  // 2️⃣ Setup socket for real-time notifications
  useEffect(() => {
    let socket;

    // Create socket only once
    const initialSocket = () => {
      socket = io("https://caferealitea.onrender.com", {
        transports: ["websocket", "polling"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        console.log("SocketIO connected successfully");
        setSocketConnected(true);
      });

      // Connect and register user
      socket.connect();

      // Listen to real-time notifications
      socket.on("new_pending_order", (data) => {
        setNotifLength((prev) => prev + 1);
      });

      // Cleanup listeners
      return () => {
        socket.disconnect();
      };
    };

    initialSocket();
  }, [userData]);

  return (
    <NotificationContext.Provider value={{ notifLength, setNotifLength }}>
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotificationContext() {
  return useContext(NotificationContext);
}
