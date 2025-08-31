import { useState, useEffect } from "react";
import { Sidebar } from "../SidePanel/RetractingSidebar";
import Loader from "../components/UI/loaders/Loader";
import Dashboard from "../pages/dashboard/MainDashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SalesHistory from "../pages/sales/SalesHistory";

export default function MainLayout() {
  const [socketConnected, setSocketConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let socket;

    const initialSocket = () => {
      try {
        socket = io("https://caferealitea.onrender.com", {
          transports: ["polling", "websocket"],
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
          console.log("SocketIO connected successfully");
          setSocketConnected(true);

          if (userData?.id) {
            socket.emit("register_user", { user_id: userData.id });
          }
        });

        socket.on("new_pending_order", (data) => {
          toast.warn(`${data.message}`, {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        });

        socket.on("order_cancelled", (data) => {
          toast.error(`${data.message}`, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        });

        socket.on("order_confirmed", (data) => {
          toast.success(`${data.message}`, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        });
      } catch (error) {
        console.error("Socket initialization error:", error);
        setSocketConnected(false);
      }
    };

    initialSocket();

    // cleanup on unmount or dependency change
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [userData]);

  useEffect(() => {
    document.title = "Café Realitea - Dashboard";

    axios.get("https://caferealitea.onrender.com/user", { withCredentials: true })
      .then((res) => {
        if (!res.data.logged_in || res.data.role === "") {
          navigate("/");
          return;
        }
        setUserData(res.data.user || res.data);
      })
      .catch((err) => {
        console.error("Authentication check failed:", err);
        navigate("/")
      })
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 bg-indigo-50">
          <ToastContainer />
          {/* Show only the active tab */}
          <div className={activeTab === "Dashboard" ? "block" : "hidden"}>
            <Dashboard setActiveTab={setActiveTab} />
          </div>
          <div className={activeTab === "Sales" ? "block" : "hidden"}>
            <SalesHistory />
          </div>
          <div className={activeTab === "Orders" ? "block" : "hidden"}>
            <h1>Orders Content</h1>
          </div>
        </main>
      </div>
    </div>
  );
}