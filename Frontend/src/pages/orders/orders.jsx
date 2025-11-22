import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaPlus,
  FaMinus,
  FaTimes,
  FaShoppingCart,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";
import { io } from "socket.io-client";
import PendingOrdersModal from "../../component/PendingOrderModal";
import { useTheme } from "../../Main/ThemeContext";

export default function OrderManagementAdmin({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [itemsAdded, setItemsAdded] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme } = useTheme();

  const socketRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    axios
      .get("https://caferealitea.onrender.com/items")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Initialize user data & authentication
  useEffect(() => {
    document.title = "Café Realitea - Order Management";
    setLoading(true);

    axios
      .get("https://caferealitea.onrender.com/user", { withCredentials: true })
      .then((res) => {
        if (!res.data.logged_in || !res.data.role) {
          navigate("/");
          return;
        }
        setUserData(res.data);
      })
      .catch((err) => {
        console.error("Authentication check failed:", err);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Fetch initial pending orders count and set up Socket.IO
  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const res = await fetch(
          "https://caferealitea.onrender.com/pending-orders",
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setNotifications(data.length);
        }
      } catch (err) {
        console.error("Error fetching initial notifications:", err);
      }
    };

    fetchInitialNotifications();

    // Initialize socket
    socketRef.current = io("https://caferealitea.onrender.com", {
      withCredentials: true,
    });

    const updateNotifications = (data, increment = 0) => {
      if (typeof data.count === "number") setNotifications(data.count);
      else setNotifications((prev) => prev + increment);
    };

    socketRef.current.on("new_pending_order", (data) =>
      updateNotifications(data, 1)
    );
    socketRef.current.on("order_cancelled", (data) =>
      updateNotifications(data, -1)
    );
    socketRef.current.on("order_confirmed", (data) =>
      updateNotifications(data, -1)
    );

    // Cleanup
    return () => socketRef.current.disconnect();
  }, []);

  const viewPendingOrders = () => setShowNotifications(true);

  if (loading) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        }`}
      >
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p
          className={`mt-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Loading order management...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
      }`}
    >
      <div className="w-full md:pt-4 lg:px-4">
        {/* Header with Notification Bell */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8">
          <div className="flex-1">
            <h1
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Order Management
            </h1>
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Create and manage customer orders
            </p>
          </div>

          {(userData?.role === "Admin" ||
            userData?.role === "System Administrator") && (
            <div className="hidden md:block">
              <button
                onClick={() => setShowNotifications(true)}
                className="btn btn-primary gap-2 mt-3 sm:mt-0 flex items-center"
              >
                <FaBell />
                View Pending Orders
                {notifications > 0 && (
                  <div className="badge badge-neutral ml-2">
                    {notifications}
                  </div>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6 pb-6 lg:pb-8">
          <CreateOrder
            categories={categories}
            setItemsAdded={setItemsAdded}
            itemsAdded={itemsAdded}
            theme={theme}
          />
          <OrderSummary
            itemsAdded={itemsAdded}
            setItemsAdded={setItemsAdded}
            theme={theme}
          />
        </div>

        {/* Pending Orders Modal */}
        {showNotifications && (
          <PendingOrdersModal
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}

// Enhanced CreateOrder Component
function CreateOrder({ categories, setItemsAdded, itemsAdded, theme }) {
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addItem = (item) => {
    // Check if item already exists in cart
    const existingItemIndex = itemsAdded.findIndex((i) => i.id === item.id);

    if (existingItemIndex >= 0) {
      // If exists, increase quantity
      setItemsAdded((prev) =>
        prev.map((i, index) =>
          index === existingItemIndex
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        )
      );
      setToast(`Increased quantity of ${item.name}!`);
    } else {
      // If new, add with quantity 1
      setItemsAdded((prev) => [...prev, { ...item, quantity: 1 }]);
      setToast(`${item.name} added!`);
    }

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // Filter items based on search term
  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div
      className={`w-full shadow-md rounded-lg relative ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <header
        className={`w-full border-b p-6 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h1
          className={`font-semibold text-xl ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Create New Order
        </h1>
        <p
          className={`text-sm mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Select items to add to order
        </p>
      </header>

      <div className="p-6">
        {/* Category Tabs */}
        <div
          className={`tabs tabs-boxed mb-6 flex overflow-x-auto rounded-lg w-fit ${
            theme === "dark" ? "bg-gray-700" : "bg-indigo-50"
          }`}
        >
          <button
            className={`tab ${!activeCategory ? "tab-active" : ""}`}
            onClick={() => setActiveCategory(null)}
            style={{
              color: !activeCategory
                ? "white"
                : theme === "dark"
                ? "#d1d5db"
                : "#1e293b",
              backgroundColor: !activeCategory ? "#4f46e5" : "transparent",
            }}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              className={`tab ${
                activeCategory === cat.category_id ? "tab-active" : ""
              }`}
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat.category_id ? null : cat.category_id
                )
              }
              style={{
                color:
                  activeCategory === cat.category_id
                    ? "white"
                    : theme === "dark"
                    ? "#d1d5db"
                    : "#1e293b",
                backgroundColor:
                  activeCategory === cat.category_id
                    ? "#4f46e5"
                    : "transparent",
              }}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories
            .filter(
              (cat) => !activeCategory || cat.category_id === activeCategory
            )
            .map((cat) => (
              <div key={cat.category_id} className="space-y-4">
                <h2
                  className={`font-semibold text-lg pb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {cat.category_name}
                </h2>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`card shadow-sm cursor-pointer border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-500"
                          : "bg-white-100 border-gray-200 hover:bg-blue-100 hover:border-blue-700"
                      }`}
                      onClick={() => addItem(item)}
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                          <h3
                            className={`card-title text-sm font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <span className="font-semibold text-primary">
                            ₱{item.price}
                          </span>
                        </div>
                        <div className="card-actions justify-end mt-2">
                          <button className="btn btn-primary btn-sm">
                            <FaPlus className="h-3 w-3" />
                            Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {filteredCategories.length === 0 && (
          <div
            className={`text-center py-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-400"
            }`}
          >
            <FaShoppingCart className="h-12 w-12 mx-auto mb-2" />
            <p>No items found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="toast toast-bottom toast-end z-50"
          >
            <div className="alert alert-success">
              <span>{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced OrderSummary Component
function OrderSummary({ itemsAdded, setItemsAdded, theme }) {
  const [customerMoney, setCustomerMoney] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customerName, setCustomerName] = useState("Walk-in customer");
  const [orderType, setOrderType] = useState("Dine-in");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = itemsAdded.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const change = customerMoney
    ? (parseFloat(customerMoney) - total).toFixed(2)
    : 0;

  const handleSavePending = async () => {
    const orderData = {
      customer_name: customerName,
      order_type: orderType,
      payment_method: paymentMethod,
      total: total,
      items: itemsAdded.map((item) => ({
        id: item.id,
        quantity: item.quantity || 1,
        price: item.price,
      })),
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(
        "https://caferealitea.onrender.com/orders/pending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save pending order");
      }

      const data = await response.json();
      // Show success toast instead of alert

      // Clear the cart after successful submission
      setItemsAdded([]);
      setCustomerMoney("");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOrder = async () => {
    const orderData = {
      customer_name: customerName,
      order_type: orderType,
      payment_method: paymentMethod,
      total: total,
      items: itemsAdded.map((item) => ({
        id: item.id,
        quantity: item.quantity || 1,
        price: item.price,
      })),
    };

    try {
      setIsSubmitting(true);
      const response = await fetch("https://caferealitea.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save order");
      }

      const data = await response.json();
      // Show success toast instead of alert

      // Clear the cart after successful submission
      setItemsAdded([]);
      setCustomerMoney("");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeItem = (index) => {
    setItemsAdded((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(index);
      return;
    }

    setItemsAdded((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div
      className={`w-full h-fit lg:w-[40%] shadow-md rounded-lg sticky top-0 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <header
        className={`w-full border-b p-6 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h1
          className={`font-semibold text-xl ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Order Summary
        </h1>
        <p
          className={`text-sm mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Review and complete order
        </p>
      </header>

      <div className="p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="form-control">
            <label className="label">
              <span
                className={`label-text font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Customer Name
              </span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`input ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-slate-700 border-gray-300"
              } input-primary`}
              placeholder="Customer name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span
                  className={`label-text font-semibold ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Order Type
                </span>
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className={`select ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-slate-700 border-gray-300"
                } select-primary`}
              >
                <option value="Dine-in">Dine-in</option>
                <option value="Delivery">Delivery</option>
                <option value="Takeaway">Takeaway</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span
                  className={`label-text font-semibold ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Payment Method
                </span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`select ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-slate-700 border-gray-300"
                } select-primary`}
              >
                <option value="Cash">Cash</option>
                <option value="GCash">G-Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span
                className={`label-text font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Customer Money
              </span>
            </label>
            <label className="input-group">
              <span
                className={
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-white text-slate-700"
                }
              >
                ₱
              </span>
              <input
                type="text"
                value={customerMoney}
                onChange={(e) => setCustomerMoney(e.target.value)}
                className={`input w-full ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-slate-700 border-gray-300"
                } input-primary`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </label>
          </div>
        </div>

        <div
          className={`divider ${
            theme === "dark" ? "before:bg-gray-600 after:bg-gray-600" : ""
          }`}
        >
          Order Items
        </div>

        <div className="max-h-64 overflow-y-auto mb-6">
          {itemsAdded.length === 0 ? (
            <div
              className={`text-center py-8 ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
            >
              <FaShoppingCart className="h-12 w-12 mx-auto mb-2" />
              <p>No items added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {itemsAdded.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ₱{item.price} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className={`btn btn-xs btn-square ${
                        theme === "dark" ? "bg-gray-600 border-gray-500" : ""
                      }`}
                      onClick={() =>
                        updateQuantity(i, (item.quantity || 1) - 1)
                      }
                    >
                      <FaMinus className="h-3 w-3" />
                    </button>
                    <span
                      className={`px-2 font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.quantity || 1}
                    </span>
                    <button
                      className={`btn btn-xs btn-square ${
                        theme === "dark" ? "bg-gray-600 border-gray-500" : ""
                      }`}
                      onClick={() =>
                        updateQuantity(i, (item.quantity || 1) + 1)
                      }
                    >
                      <FaPlus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      ₱{(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                    <button
                      className="btn btn-xs btn-ghost text-error"
                      onClick={() => removeItem(i)}
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`space-y-4 border-t pt-4 ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex justify-between text-lg">
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Total
            </span>
            <span className="font-bold text-primary">₱{total.toFixed(2)}</span>
          </div>

          {customerMoney && (
            <div className="flex justify-between">
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Change
              </span>
              <span className={change >= 0 ? "text-success" : "text-error"}>
                ₱{Math.abs(change).toFixed(2)} {change < 0 ? "due" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleCompleteOrder}
            disabled={
              isSubmitting ||
              itemsAdded.length === 0 ||
              !customerMoney ||
              change < 0
            }
            className={`btn w-full gap-2 ${
              isSubmitting ||
              itemsAdded.length === 0 ||
              !customerMoney ||
              change < 0
                ? theme === "dark"
                  ? "btn-outline bg-gray-700 text-gray-400"
                  : "btn-outline bg-gray-200 text-gray-500"
                : "btn-neutral"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <FaMoneyBillWave />
                Complete Order
              </>
            )}
          </button>

          <button
            onClick={handleSavePending}
            disabled={isSubmitting || itemsAdded.length === 0}
            className={`btn btn-outline w-full gap-2 ${
              theme === "dark"
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <FaCreditCard />
                Save as Pending
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
