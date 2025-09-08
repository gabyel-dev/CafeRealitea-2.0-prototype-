import { useState, useEffect } from "react";
import { Sidebar } from "../SidePanel/RetractingSidebar";
import Loader from "../components/UI/loaders/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy } from "react";

// Lazy load components
const Dashboard = lazy(() => import("../pages/dashboard/MainDashboard"));
const ViewAllData = lazy(() => import("../pages/dashboard/view_all_data"));
const SalesHistory = lazy(() => import("../pages/sales/SalesHistory"));
const OrderManagementAdmin = lazy(() => import("../pages/orders/orders"));
const UsersManagement = lazy(() => import("../pages/members/members"));
const ProductPage = lazy(() => import("../pages/products/products"));
const Profile = lazy(() => import("../pages/profile/profile"));
const memberProfile = lazy(() => import("../pages/profile/members_profile"));
const MemberProfileWrapper = lazy(() => import("../pages/profile/MemberProfileWrapper"));


export default function MainLayout() {
  const [socketConnected, setSocketConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userData, setUserData] = useState(null);
  const [loadedTabs, setLoadedTabs] = useState(new Set(["Dashboard"])); // Track loaded tabs
  const navigate = useNavigate();

  // Function to handle tab changes
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    
    // Add the tab to loaded tabs if it hasn't been loaded yet
    if (!loadedTabs.has(tabName)) {
      setLoadedTabs(prev => new Set([...prev, tabName]));
    }
  };

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

        socket.on("notification", (data) => {
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
        console.log(res.data.role);
        
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

  // Render component only if it's loaded (active or previously loaded)
  const renderComponent = (tabName, Component) => {
    
    return (
      <div style={{ display: activeTab === tabName ? "block" : "none" }}>
        <Component setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 bg-indigo-50">
          <ToastContainer />
          
          <Suspense fallback={<Loader />}>
            {renderComponent("Dashboard", Dashboard)}
            {renderComponent("View All", ViewAllData)}
            {renderComponent("Sales", SalesHistory)}
            {renderComponent("Orders", OrderManagementAdmin)}
            {renderComponent("Profile", Profile)}
            {renderComponent("Products", ProductPage)}

            <MemberProfileWrapper activeTab={activeTab} setActiveTab={setActiveTab} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}