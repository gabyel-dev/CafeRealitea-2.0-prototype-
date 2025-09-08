import { useState, useEffect, useRef } from "react";
import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiSettings,
  FiShoppingCart,
  FiTag,
  FiUserPlus,
  FiUsers,
  FiUser, 
  FiLogOut,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import logout from "../Utility/logout";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import PendingOrdersModal from "../component/PendingOrderModal";
import { io } from "socket.io-client"
import Loader from "../components/UI/loaders/Loader";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex bg-indigo-50">
      <Sidebar2 activeTab={activeTab} setActiveTab={setActiveTab} />
      <ExampleContent />
    </div>
  );
};

const api_name = import.meta.env.VITE_SERVER_API_NAME;

const Sidebar2 = ({ activeTab, setActiveTab }) => {
  const [open, setOpen] = useState(false); // Default closed on all screens
  const [selected, setSelected] = useState("Dashboard");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const sidebarRef = useRef(null); // 👈 sidebar reference
  const socketRef = useRef(null);


  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);


  useEffect(() => {
  socketRef.current = io("https://caferealitea.onrender.com", {
    withCredentials: true,
  });

  // fetch initial pending orders count
  const fetchInitial = async () => {
    try {
      const res = await fetch("https://caferealitea.onrender.com/pending-orders", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data.length); // set initial count
        }
      }
    } catch (err) {
      console.error("Error fetching initial notifications:", err);
    }
  };

  fetchInitial();

  // listen for new pending order events
  socketRef.current.on("new_pending_order", (data) => {
    console.log("Received socket event:", data);

    // if backend sends the new total count
    if (typeof data.count === "number") {
      setNotifications(data.count);
    } 
    // if backend just emits a message per order
    else {
      setNotifications((prev) => prev + 1);
    }
  });
  
  socketRef.current.on("order_cancelled", (data) => {
    console.log("Received socket event:", data);

    // if backend sends the new total count
    if (typeof data.count === "number") {
      setNotifications(data.count);
    } 
    // if backend just emits a message per order
    else {
      setNotifications((prev) => prev - 1);
    }
  });

  socketRef.current.on("order_confirmed", (data) => {
    console.log("Received socket event:", data);

    // if backend sends the new total count
    if (typeof data.count === "number") {
      setNotifications(data.count);
    } 
    // if backend just emits a message per order
    else {
      setNotifications((prev) => prev - 1);
    }
  });

  // cleanup on unmount
  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };
}, []);


  // Set sidebar state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      // For medium screens and above, open the sidebar by default
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Collapse sidebar if clicking outside (on mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth < 768 && // only mobile
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  //check user role and if user is loggedin
  useEffect(() => {
    axios.get(`${api_name}/user`, { withCredentials: true })
    .then((res) => {
      if (!res.data.logged_in) {
          navigate('/');
      }
      setRole(res.data.role);
    })
  }, [])

  return (
    <>
      {/* Toggle button (only visible on mobile) */}
      <AnimatePresence>
  {!open && (
    <div
      className="fixed top-0 right-0 z-10 m-2 flex h-10 items-center gap-2 rounded-md text-white md:hidden"
    >
      <motion.button 
      initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: -10 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.4 }}
  onClick={() => setShowNotifications(true)}
  className="relative flex items-center text-indigo-600 text-xl "
>
  <FaBell className="" />
  {notifications > 0 && (
    <span className="absolute shadow-md shadow-gray-600/100  -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
      {notifications}
    </span>
  )}
</motion.button>


      {/* Spacer pushes hamburger to the right */}
      <div className="flex-1 " />

      {/* Hamburger Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: -10 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.4 }}
        onClick={() => setOpen(true)}
        className="bg-indigo-600 px-3 py-2 rounded-md shadow-md shadow-gray-600/50 z-20"
      >
        ☰
      </motion.button>
    </div>
  )}
</AnimatePresence>

    {showNotifications && (
      <PendingOrdersModal 
        onClose={() => setShowNotifications(false)} 
        updateNotifications={setNotifications}
      />
    )}


      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-indigo-50 bg-opacity-40 -z-1 md:hidden"
            onClick={() => setOpen(false)}
          ></motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        ref={sidebarRef} // 👈 attach ref
        layout
        className={`fixed md:sticky top-0 h-screen z-40
        shrink-0 border-r border-slate-300 bg-white p-2
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{
          width: open ? "225px" : "fit-content",
        }}
      >
        <TitleSection open={open} setActiveTab={setActiveTab} />

        <div className="space-y-1">
          <Option Icon={FiHome} title="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} open={open} />
          <Option Icon={FiDollarSign} title="Sales" activeTab={activeTab} setActiveTab={setActiveTab} open={open} notifs={3} />
          <Option Icon={FiMonitor} title="Orders" activeTab={activeTab} setActiveTab={setActiveTab} open={open} />
          <Option Icon={FiShoppingCart} title="Products" activeTab={activeTab} setActiveTab={setActiveTab} open={open} />
          <Option Icon={FiUsers} title="Members" activeTab={activeTab} setActiveTab={setActiveTab} open={open} />
        </div>

        <ToggleClose open={open} setOpen={setOpen} />
      </motion.nav>
    </>
  );
};

const Option = ({ Icon, title, activeTab, setActiveTab, open, notifs }) => {
  return (
    <motion.button
      layout
      onClick={() => setActiveTab(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${activeTab === title ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"}`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.span
            key={title}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="text-xs font-medium"
          >
            {title}
          </motion.span>
        )}
      </AnimatePresence>

    </motion.button>
  );
};

const TitleSection = ({ open, setActiveTab }) => {
  const [userFirstname, setFirstname] = useState();
  const [userLastname, setLastname] = useState();
  const [userRole, setUserRole] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState()

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${api_name}/user`, { withCredentials: true })
      .then((res) => {
        setFirstname(res.data.user?.first_name);
        setLastname(res.data.user?.last_name);
        setUserRole(res.data.user?.role);
        setId(res.data.user?.id)
      });
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
    onMouseEnter={() => setMenuOpen(true)}
    className="mb-3 border-b border-slate-300 pb-3" ref={dropdownRef}>
      <div 
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100"
      >
        <div className="flex items-center gap-2">
          <div className="w-[35px] h-[35px] border-1 border-indigo-600 mr-1 p-[1.5px] rounded-full overflow-hidden flex items-center justify-center">
          <img 
            src={`https://caferealitea.onrender.com/profile-image/${id}`} 
            alt="profile" 
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z' clip-rule='evenodd' /%3E%3C/svg%3E";
            }}
          />
        </div>
          {open && (
            <motion.div
              key="user-info"
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <span className="block text-xs font-semibold text-slate-700">{userFirstname || "null user"}&nbsp;{userLastname}</span>
              <span className="block text-xs text-slate-500">{userRole || "null role"}</span>
            </motion.div>
          )}
        </div>
        {open && <FiChevronDown className="mr-2 text-slate-700" />}
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            
            onMouseLeave={() => setMenuOpen(false)}
            key="dropdown"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={open ? "absolute translate-y-0 translate-x-20 mt-2 w-48 bg-white shadow-lg border-1 border-slate-300 p-3 z-50 rounded-xl flex flex-col gap-2" : "absolute translate-y-0 translate-x-0 mt-2 w-48 bg-white shadow-lg p-3 z-50 rounded-xl flex flex-col gap-2"}
          >
            <button 
            onClick={() => setActiveTab("Profile")}
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-indigo-600">
              <FiUser className="w-4 h-4" /> Profile
            </button>
            <button className="flex items-center gap-2 text-sm text-slate-700 hover:text-indigo-600">
              <FiSettings className="w-4 h-4" /> Account Settings
            </button>
            <button 
              onClick={() => logout(navigate, setLoading)}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-red-600"
            >
              <FiLogOut className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg text-slate-500"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        <AnimatePresence>
          {open && (
            <motion.span
              key="hide-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-medium text-slate-500"
            >
              Hide
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

const ExampleContent = () => <div className="h-[200vh] w-full"></div>;
