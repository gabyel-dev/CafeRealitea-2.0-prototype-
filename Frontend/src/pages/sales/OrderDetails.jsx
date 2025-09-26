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

export default function OrderDetails({ setActiveTab, activeTab, orderID }) {
  const [orderDetails, setOrderDetails] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [errorAppear, setErrorAppear] = useState(false);
  const id = orderID;
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();

  useEffect(() => {
    axios
      .get(`https://caferealitea.onrender.com/api/order/${id}`)
      .then((res) => {
        setOrderDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch order details");
        setLoading(false);
        console.error(err);
      });
  }, [id]);

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
      });
  }, []);

  const delete_order = async (e) => {
    const res = axios
      .post(`https://caferealitea.onrender.com/api/delete/${id}`, {
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
      <div className="flex flex-col justify-center items-center h-screen bg-indigo-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-700 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {visible && (
        <DeleteModal
          orderID={id}
          setVisible={setVisible}
          orderNumber={selectedOrder.order_id}
          setActiveTab={setActiveTab}
        />
      )}
      <div className="min-h-screen  bg-indigo-50 flex pt-0 lg:pt-0 ">
        <div className="lg:pt-4 lg:py-4 lg:px-4  min-h-screen w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-700">
                Order Details
              </h1>
              <p className="text-sm  mt-1 text-gray-500">
                Complete information for order #{orderDetails.order_id}
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab("Sales");
              }}
              className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white hover:border-slate-400 transition-colors mt-4 sm:mt-0"
            >
              <FiArrowLeft className="mr-2" />
              Back to Sales
            </button>
          </div>

          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Main Order Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <FaReceipt className="text-indigo-600 mr-3" />
                  Order #{orderDetails.order_id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    orderDetails.order_type === "Dine-in"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {orderDetails.order_type}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <FiUser className="text-indigo-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Customer</p>
                    <p className="font-semibold text-slate-800">
                      {orderDetails.customer_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <FiCreditCard className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Payment Method</p>
                    <p className="font-semibold text-slate-800">
                      {orderDetails.payment_method}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <FiTag className="text-emerald-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Amount</p>
                    <p className="font-semibold text-slate-800">
                      ₱{orderDetails.total?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                    <FiUser className="text-cyan-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      {orderDetails.confirmed_by
                        ? "Confirmed By"
                        : "Created By"}
                    </p>
                    <p className="font-semibold text-slate-800">
                      {orderDetails.confirmed_by || orderDetails.created_by}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <FiCalendar className="text-slate-500 mr-3" size={18} />
                    <span className="text-slate-700">Order Date</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {orderDetails.order_time
                      ? new Date(orderDetails.order_time).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <FaStore className="text-slate-500 mr-3" size={18} />
                    <span className="text-slate-700">Status</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      orderDetails.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : orderDetails.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {orderDetails.status || "Completed"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <FiShoppingCart className="text-slate-500 mr-3" size={18} />
                    <span className="text-slate-700">Items Count</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {orderDetails.items.length} items
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <FiShoppingCart className="text-indigo-600 mr-2" />
                Order Items
              </h3>
              <div className="text-sm text-slate-600">
                Total: {orderDetails.items.length} items
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left py-3 px-4 text-slate-700 font-semibold text-sm">
                      Item
                    </th>
                    <th className="text-center py-3 px-4 text-slate-700 font-semibold text-sm">
                      Price
                    </th>
                    <th className="text-center py-3 px-4 text-slate-700 font-semibold text-sm">
                      Quantity
                    </th>
                    <th className="text-right py-3 px-4 text-slate-700 font-semibold text-sm">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            <FiCoffee className="text-indigo-600" size={14} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {item.name}
                            </div>
                            {item.description && (
                              <div className="text-xs text-slate-500">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4 text-slate-700 font-medium">
                        ₱{item.price?.toFixed(2)}
                      </td>
                      <td className="text-center py-4 px-4 text-slate-700 font-medium">
                        {item.quantity}
                      </td>
                      <td className="text-right py-4 px-4 text-slate-800 font-semibold">
                        ₱{item.subtotal?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100">
                    <td
                      colSpan="3"
                      className="text-right py-4 px-4 font-bold text-slate-800 text-lg"
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
            <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 cursor-pointer hover:bg-white hover:border-slate-400 transition-colors">
              <FiDownload className="mr-2" />
              Export Receipt
            </button>

            <button
              onClick={() => {
                setErrorAppear(true);
                setVisible(true);
                setSelectedOrder(orderDetails);
              }}
              className="flex items-center px-4 py-2 border border-red-300 rounded-lg text-slate-100 bg-red-500 hover:bg-red-700 cursor-pointer  hover:border-red-400 transition-colors"
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
