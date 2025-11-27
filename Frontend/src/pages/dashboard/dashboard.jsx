import { useState, useEffect, useRef } from "react";
import Profit from "../../components/UI/Charts/PieChart";
import Title from "../../components/UI/Title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  FiBox,
  FiPlus,
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
} from "react-icons/fi";
import { useTheme } from "../../Main/ThemeContext";
import Loader from "../../components/UI/loaders/Loader";
import { useOrderContext } from "../../Main/OrderDetailContext";
import { useProductDetailContext } from "../../Main/ProductDetailContext";
import { useNotificationContext } from "../../Main/NotificationContext";

// Stat Card Component for better reusability
function StatCard({ title, value, change, icon, theme }) {
  const isPositive = change >= 0;

  return (
    <div
      className={`${
        theme === "dark"
          ? "black-card text-color-black"
          : "light-card text-slate-700"
      } card shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="card-body p-4 md:p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-primary/10"
              }`}
            >
              {icon}
            </div>
            <div>
              <h3
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {title}
              </h3>
              <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
          </div>
          <div
            className={`badge badge-lg gap-1 ${
              isPositive ? "badge-success" : "badge-error"
            }`}
          >
            {isPositive ? (
              <FiTrendingUp className="w-3 h-3" />
            ) : (
              <FiTrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>
        <div
          className={`text-xs ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          } mt-2`}
        >
          vs previous month
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard({
  setActiveTab,
  activeTab,
  totals,
  financialData,
}) {
  const navigate = useNavigate();

  const { setOrderID, orderID } = useOrderContext();
  const { setProductID, productID } = useProductDetailContext();
  const { notifLength } = useNotificationContext();

  // State variables
  const [timeRange, setTimeRange] = useState("monthly");
  const [topItems, setTopItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [percentChange, setPercentChange] = useState({
    sales: 0,
    orders: 0,
    avgOrder: 0,
  });
  const [recentOrder, setRecentOrder] = useState([]);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingOrder, setPendingOrder] = useState(0);
  const socketRef = useRef(null);
  const [productCount, setProductCount] = useState();

  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const [profitData, setProfitData] = useState({
    gross: 0,
    net: 0,
    equipments: 0,
    packaging_cost: 0,
  });

  useEffect(() => {
    axios
      .get("https://caferealitea.onrender.com/products", {
        withCredentials: true,
      })
      .then((res) => setProductCount(res.data.length));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [recentOrderRes, userRes] = await Promise.all([
          axios.get("https://caferealitea.onrender.com/recent-order", {
            withCredentials: true,
          }),
          axios.get("https://caferealitea.onrender.com/user", {
            withCredentials: true,
          }),
        ]);

        setRecentOrder(recentOrderRes.data);

        if (!userRes.data.logged_in || userRes.data.role === "") {
          navigate("/");
          return;
        }
        setRole(userRes.data.role);
      } catch (err) {
        console.error("Data fetch failed:", err);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (financialData) {
      setProfitData({
        gross: financialData.totalGrossProfit,
        net: financialData.totalNetProfit,
        equipments: financialData.totalEquipmentCost,
        packaging_cost: financialData.totalPackagingCost,
      });
    }
  }, [financialData]);

  // Check authentication and role
  useEffect(() => {
    document.title = "Café Realitea - Dashboard";
  }, []);

  // Helper function to calculate percentage change
  function getPercentageChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  // Fetch dashboard data
  useEffect(() => {
    const api = import.meta.env.VITE_SERVER_API_NAME;

    const fetchDashboardData = async () => {
      try {
        const [topItemsRes, ordersRes] = await Promise.all([
          axios.get(`${api}/top_items`),
          axios.get(`${api}/orders/months`),
        ]);

        setTopItems(topItemsRes.data);

        const data = ordersRes.data.sort((a, b) =>
          a.year === b.year ? a.month - b.month : a.year - b.year
        );

        const latest = data[data.length - 1];
        const prev = data.length > 1 ? data[data.length - 2] : null;

        if (latest) {
          setSummary({
            sales: latest.total_sales,
            orders: latest.total_orders,
            avgOrder: latest.total_sales / latest.total_orders,
          });

          if (prev) {
            setPercentChange({
              sales: getPercentageChange(latest.total_sales, prev.total_sales),
              orders: getPercentageChange(
                latest.total_orders,
                prev.total_orders
              ),
              avgOrder: getPercentageChange(
                latest.total_sales / latest.total_orders,
                prev.total_sales / prev.total_orders
              ),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`md:p-4 pt-0 md:pt-4 min-h-screen`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 md:p-0">
        <div
          onClick={() => setActiveTab("Dashboard")}
          className="cursor-pointer"
        >
          <Title titleName={"Dashboard Overview"} />
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } mt-1`}
          >
            Track your store performance and metrics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="flex gap-2">
            <select
              className={`select select-sm ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "select-bordered text-white border-gray-300"
              } flex-1`}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>

            <button className="btn btn-primary btn-sm gap-2 whitespace-nowrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </button>
          </div>

          <label className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg">
            <span
              className={
                theme === "dark" ? "text-gray-300" : "text-slate-700 text-sm"
              }
            >
              Dark
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={theme === "dark"}
              onChange={() => toggleTheme()}
            />
          </label>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:px-0">
        <StatCard
          title="Monthly Sales"
          value={`₱${summary?.sales?.toLocaleString() ?? "0"}`}
          change={percentChange.sales}
          icon={<FiDollarSign className="w-5 h-5 text-primary" />}
          theme={theme}
        />

        <StatCard
          title="Total Orders"
          value={summary?.orders ?? "0"}
          change={percentChange.orders}
          icon={<FiShoppingCart className="w-5 h-5 text-primary" />}
          theme={theme}
        />

        <StatCard
          title="Avg. Order Value"
          value={`₱${summary?.avgOrder?.toFixed(2) ?? "0"}`}
          change={percentChange.avgOrder}
          icon={<FiTrendingUp className="w-5 h-5 text-primary" />}
          theme={theme}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6  md:px-0">
        {/* Profit Chart - Full width on mobile, 2/3 on desktop */}
        <div className="xl:col-span-2">
          <div
            className={`${
              theme === "dark"
                ? "black-card text-color-black"
                : "light-card text-slate-700"
            } card shadow-lg h-full`}
          >
            <div className="card-body">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-semibold">Profit Overview</h3>
              </div>
              <div className="h-64 sm:h-80">
                <Profit
                  gross={profitData.gross}
                  net={profitData.net}
                  equipments={profitData.equipments}
                  packaging_cost={profitData.packaging_cost}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Items - Full width on mobile, 1/3 on desktop */}
        <div className="xl:col-span-1">
          <div
            className={`${
              theme === "dark"
                ? "black-card text-color-black"
                : "light-card text-slate-700"
            } card shadow-lg h-full`}
          >
            <div className="card-body flex flex-col">
              <h3 className="card-title text-lg mb-6">Top Selling Items</h3>

              {topItems.length <= 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                  <div
                    className={`mb-4 p-4 rounded-full ${
                      theme === "dark" ? "bg-blue-900" : "bg-blue-50"
                    }`}
                  >
                    <FiBox className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    No top items yet
                  </h3>
                  <p
                    className={`max-w-md mb-4 text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    When you start making sales, your top performing items will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="flex-1 space-y-4 pb-4">
                  {topItems.slice(0, 4).map((item, index) => (
                    <div
                      onClick={() => {
                        if (!["Staff"].includes(role)) {
                          setProductID(item.item_id);
                          setActiveTab("Product Detail");
                        }
                      }}
                      key={item.item_id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            index === 0
                              ? "bg-blue-100 text-blue-600"
                              : index === 1
                              ? "bg-purple-100 text-purple-600"
                              : index === 2
                              ? "bg-amber-100 text-amber-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="max-w-[120px] sm:max-w-none">
                          <p className="font-medium truncate">
                            {item.product_name}
                          </p>
                          <p
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {item.total_quantity} sold
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">
                        ₱{item.total_sales}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  if (!["Staff"].includes(role)) {
                    setActiveTab("Product Rank");
                  }
                }}
                className={`btn  btn-sm gap-2 mt-auto ${
                  !["Staff"].includes(role)
                    ? "btn-primary"
                    : "btn-disabled cursor-not-allowed"
                }`}
              >
                View All Products
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6  md:px-0">
        {/* Recent Orders */}
        <div
          className={`
    rounded-xl border border-gray-200 shadow-lg
    ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700 text-white"
        : "bg-white text-slate-700"
    }
  `}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <span
                className={`
          text-sm px-2 py-1 rounded-full
          ${
            theme === "dark"
              ? "text-gray-400 bg-gray-700"
              : "text-gray-500 bg-gray-100"
          }
        `}
              >
                {recentOrder.length} orders
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`
              border-b
              ${
                theme === "dark"
                  ? "border-gray-700 text-gray-400"
                  : "border-gray-200 text-gray-600"
              }
            `}
                  >
                    <th className="text-left py-3 px-2 font-medium">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-2 font-medium">
                      Customer
                    </th>
                    <th className="text-left py-3 px-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrder.slice(0, 5).map((order, index) => (
                    <tr
                      key={order.id}
                      className={`
                  transition-colors duration-200 cursor-pointer
                  ${
                    index % 2 === 0
                      ? theme === "dark"
                        ? "bg-gray-750 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                      : theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-100"
                  }
                  ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
                `}
                      onClick={() => {
                        setOrderID(order.id);
                        if (orderID) {
                          setActiveTab("Order Details");
                        }
                      }}
                    >
                      <td className="py-3 px-2 font-mono text-sm">
                        #ORD-{order.id}
                      </td>
                      <td className="py-3 px-2 max-w-[100px] truncate">
                        {order.customer_name}
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        ₱{order.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          className={`
    rounded-xl border border-gray-200 shadow-lg
    ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700 text-white"
        : "bg-white text-slate-700"
    }
  `}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Quick Stats</h3>
              <FiPackage
                className={`w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
            <div className="space-y-3">
              {/* Total Products */}
              <div
                className={`
          flex justify-between items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer
          ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-50 hover:bg-gray-100"
          }
        `}
                onClick={() => {
                  if (!["Staff"].includes(role)) {
                    setActiveTab("Products");
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                    }`}
                  ></div>
                  Total Products
                </span>
                <span className="font-semibold">{productCount}</span>
              </div>

              {/* Low Stock Items */}
              <div
                className={`
          flex justify-between items-center p-3 rounded-lg transition-colors duration-200
          ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-50 hover:bg-gray-100"
          }
        `}
              >
                <span className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      theme === "dark" ? "bg-yellow-400" : "bg-yellow-500"
                    }`}
                  ></div>
                  Low Stock Items
                </span>
                <span
                  className={`font-semibold ${
                    theme === "dark" ? "text-yellow-300" : "text-yellow-600"
                  }`}
                >
                  {totals?.lowStock || 0}
                </span>
              </div>

              {/* Today's Orders */}
              <div
                className={`
          flex justify-between items-center p-3 rounded-lg transition-colors duration-200
          ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-50 hover:bg-gray-100"
          }
        `}
              >
                <span className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      theme === "dark" ? "bg-green-400" : "bg-green-500"
                    }`}
                  ></div>
                  Today's Orders
                </span>
                <span className="font-semibold">
                  {totals?.todayOrders || 0}
                </span>
              </div>

              {/* Pending Orders */}
              <div
                className={`
          flex justify-between items-center p-3 rounded-lg transition-colors duration-200
          ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-50 hover:bg-gray-100"
          }
        `}
              >
                <span className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      theme === "dark" ? "bg-cyan-400" : "bg-cyan-500"
                    }`}
                  ></div>
                  Pending Orders
                </span>
                <span
                  className={`font-semibold ${
                    theme === "dark" ? "text-cyan-300" : "text-cyan-600"
                  }`}
                >
                  {notifLength}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View All Link */}
      <div
        className={`${
          role === "Admin" ? "hidden" : "block"
        } mt-8 text-center px-4 md:px-0`}
      >
        <button
          disabled={!["System Administrator"].includes(role)}
          onClick={() => setActiveTab("View All")}
          className="btn btn-neutral btn-wide"
        >
          View Full Dashboard
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
