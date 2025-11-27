import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiCoffee,
  FiCreditCard,
  FiTag,
  FiShoppingCart,
  FiCalendar,
  FiDownload,
  FiCheckCircle,
  FiTrash,
} from "react-icons/fi";

import { FaReceipt, FaStore } from "react-icons/fa";
import DeleteModal from "./DeleteModal";
import { useTheme } from "../../Main/ThemeContext";

export default function OrderDetails({ setActiveTab, activeTab, orderID }) {
  const [orderDetails, setOrderDetails] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [errorAppear, setErrorAppear] = useState(false);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();
  const [role, setRole] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    axios
      .get(`https://caferealitea.onrender.com/api/order/${orderID}`)
      .then((res) => {
        setOrderDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch order details");
        setLoading(false);
        console.error(err);
      });
  }, [orderID]);

  useEffect(() => {
    document.title = "Café Realitea - Order Details";

    axios
      .get("https://caferealitea.onrender.com/user", { withCredentials: true })
      .then((res) => {
        if (!res.data.logged_in || res.data.role === "") {
          navigate("/");
          return;
        }
        setUserData(res.data);
        setRole(res.data?.role);
      });
  }, []);

  const delete_order = async (e) => {
    const res = axios
      .post(`https://caferealitea.onrender.com/api/delete/${orderID}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setActiveTab("Sales");
      })
      .catch(setErrorMsg(""));
  };

  if (loading) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        }`}
      >
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${
              theme === "dark"
                ? "border-gray-700 border-t-indigo-500"
                : "border-indigo-200 border-t-indigo-600"
            }`}
          ></div>
          <p
            className={`font-medium ${
              theme === "dark" ? "text-gray-300" : "text-slate-700"
            }`}
          >
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        }`}
      >
        <div
          className={`border rounded-lg p-6 max-w-md ${
            theme === "dark"
              ? "bg-red-900/20 border-red-800"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                theme === "dark" ? "bg-red-800" : "bg-red-100"
              }`}
            >
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-red-300" : "text-red-600"
                }`}
              >
                !
              </span>
            </div>
            <span
              className={theme === "dark" ? "text-red-300" : "text-red-700"}
            >
              {error}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {visible && (
        <DeleteModal
          orderID={orderID}
          setVisible={setVisible}
          orderNumber={selectedOrder.order_id}
          setActiveTab={setActiveTab}
          theme={theme}
        />
      )}
      <div
        className={`min-h-screen flex pt-0 lg:pt-0 ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        }`}
      >
        <div className="lg:pt-4 lg:py-4 lg:px-4 min-h-screen w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-slate-700"
                }`}
              >
                Order Details
              </h1>
              <p
                className={`text-sm mt-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Complete information for order #{orderDetails.order_id}
              </p>
            </div>
            <button
              onClick={() => {
                if (!["Staff"].includes(role)) {
                  setActiveTab("Sales");
                } else {
                  setActiveTab("Dashboard");
                }
              }}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors mt-4 sm:mt-0 ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                  : "border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
              }`}
            >
              <FiArrowLeft className="mr-2" />
              Back to Sales
            </button>
          </div>

          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Main Order Card */}
            <div
              className={`rounded-xl shadow-sm border p-6 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className={`text-xl font-semibold flex items-center ${
                    theme === "dark" ? "text-white" : "text-slate-800"
                  }`}
                >
                  <FaReceipt className="text-indigo-600 mr-3" />
                  Order #{orderDetails.order_id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    orderDetails.order_type === "Dine-in"
                      ? theme === "dark"
                        ? "bg-indigo-900/30 text-indigo-300"
                        : "bg-indigo-100 text-indigo-800"
                      : theme === "dark"
                      ? "bg-purple-900/30 text-purple-300"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {orderDetails.order_type}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`flex items-center p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-100"
                    }`}
                  >
                    <FiUser className="text-indigo-600" size={18} />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      Customer
                    </p>
                    <p
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {orderDetails.customer_name}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      theme === "dark" ? "bg-purple-900/30" : "bg-purple-100"
                    }`}
                  >
                    <FiCreditCard className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      Payment Method
                    </p>
                    <p
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {orderDetails.payment_method}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      theme === "dark" ? "bg-emerald-900/30" : "bg-emerald-100"
                    }`}
                  >
                    <FiTag className="text-emerald-600" size={18} />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      Total Amount
                    </p>
                    <p
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-slate-800"
                      }`}
                    >
                      ₱{orderDetails.total?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      theme === "dark" ? "bg-cyan-900/30" : "bg-cyan-100"
                    }`}
                  >
                    <FiUser className="text-cyan-600" size={18} />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-slate-600"
                      }`}
                    >
                      {orderDetails.confirmed_by
                        ? "Confirmed By"
                        : "Created By"}
                    </p>
                    <p
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {orderDetails.confirmed_by || orderDetails.created_by}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div
              className={`rounded-xl shadow-sm border p-6 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-slate-800"
                }`}
              >
                Additional Information
              </h3>
              <div className="space-y-4">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center">
                    <FiCalendar
                      className={`mr-3 ${
                        theme === "dark" ? "text-gray-400" : "text-slate-500"
                      }`}
                      size={18}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }
                    >
                      Order Date
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {orderDetails.order_time
                      ? new Date(orderDetails.order_time).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center">
                    <FaStore
                      className={`mr-3 ${
                        theme === "dark" ? "text-gray-400" : "text-slate-500"
                      }`}
                      size={18}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }
                    >
                      Status
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      orderDetails.status === "completed"
                        ? theme === "dark"
                          ? "bg-green-900/30 text-green-300"
                          : "bg-green-100 text-green-800"
                        : orderDetails.status === "pending"
                        ? theme === "dark"
                          ? "bg-yellow-900/30 text-yellow-300"
                          : "bg-yellow-100 text-yellow-800"
                        : theme === "dark"
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {orderDetails.status || "Completed"}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center">
                    <FiShoppingCart
                      className={`mr-3 ${
                        theme === "dark" ? "text-gray-400" : "text-slate-500"
                      }`}
                      size={18}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }
                    >
                      Items Count
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {orderDetails.items.length} items
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div
            className={`rounded-xl shadow-sm border p-6 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-lg font-semibold flex items-center ${
                  theme === "dark" ? "text-white" : "text-slate-800"
                }`}
              >
                <FiShoppingCart className="text-indigo-600 mr-2" />
                Order Items
              </h3>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Total: {orderDetails.items.length} items
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={
                      theme === "dark" ? "bg-gray-700" : "bg-slate-100"
                    }
                  >
                    <th
                      className={`text-left py-3 px-4 font-semibold text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Item
                    </th>
                    <th
                      className={`text-center py-3 px-4 font-semibold text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Price
                    </th>
                    <th
                      className={`text-center py-3 px-4 font-semibold text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Quantity
                    </th>
                    <th
                      className={`text-right py-3 px-4 font-semibold text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b transition-colors ${
                        theme === "dark"
                          ? "border-gray-700 hover:bg-gray-750"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                              theme === "dark"
                                ? "bg-indigo-900/30"
                                : "bg-indigo-100"
                            }`}
                          >
                            <FiCoffee className="text-indigo-600" size={14} />
                          </div>
                          <div>
                            <div
                              className={`font-medium ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-slate-800"
                              }`}
                            >
                              {item.name}
                            </div>
                            {item.description && (
                              <div
                                className={`text-xs ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className={`text-center py-4 px-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-slate-700"
                        }`}
                      >
                        ₱{item.price?.toFixed(2)}
                      </td>
                      <td
                        className={`text-center py-4 px-4 font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-slate-700"
                        }`}
                      >
                        {item.quantity}
                      </td>
                      <td
                        className={`text-right py-4 px-4 font-semibold ${
                          theme === "dark" ? "text-white" : "text-slate-800"
                        }`}
                      >
                        ₱{item.subtotal?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr
                    className={
                      theme === "dark" ? "bg-gray-700" : "bg-slate-100"
                    }
                  >
                    <td
                      colSpan="3"
                      className={`text-right py-4 px-4 font-bold text-lg ${
                        theme === "dark" ? "text-white" : "text-slate-800"
                      }`}
                    >
                      Total Amount
                    </td>
                    <td className="text-right py-4 px-4 font-bold text-indigo-600 text-lg">
                      ₱{orderDetails.total?.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center md:justify-end gap-3 mt-6">
            <button
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                  : "border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
              }`}
            >
              <FiDownload className="mr-2" />
              Export Receipt
            </button>

            <button
              disabled={!["System Administrator"].includes(role)}
              onClick={() => {
                setErrorAppear(true);
                setVisible(true);
                setSelectedOrder(orderDetails);
              }}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                theme === "dark"
                  ? "border-red-700 bg-red-600 text-white hover:bg-red-700 hover:border-red-600"
                  : "border-red-300 bg-red-500 text-white hover:bg-red-600 hover:border-red-400"
              } ${
                !["System Administrator"].includes(role)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <FiTrash className="mr-2" />
              Delete Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
