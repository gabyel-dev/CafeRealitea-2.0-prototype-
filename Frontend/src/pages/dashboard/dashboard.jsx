import React, { useState, useEffect, useRef } from "react";
import Profit from "../../components/UI/Charts/PieChart";
import Title from "../../components/UI/Title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  FiBox,
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiAlertTriangle,
  FiClock,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useTheme } from "../../Main/ThemeContext";
import Loader from "../../components/UI/loaders/Loader";
import { useOrderContext } from "../../Main/OrderDetailContext";
import { useProductDetailContext } from "../../Main/ProductDetailContext";
import { useNotificationContext } from "../../Main/NotificationContext";

// Skeleton Loader Components
const StatCardSkeleton = ({ theme }) => (
  <div
    className={`card shadow-lg animate-pulse ${
      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
    }`}
  >
    <div className="card-body p-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2 flex-1">
          <div
            className={`h-4 rounded w-1/2 ${
              theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-6 rounded w-3/4 ${
              theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-3 rounded w-2/3 ${
              theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            }`}
          ></div>
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${
            theme === "dark" ? "bg-gray-600" : "bg-gray-300"
          }`}
        ></div>
      </div>
    </div>
  </div>
);

const TopItemsSkeleton = ({ theme }) => (
  <div
    className={`card shadow-lg animate-pulse ${
      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
    }`}
  >
    <div className="card-body">
      <div
        className={`h-6 rounded w-1/3 mb-6 ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-300"
        }`}
      ></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg ${
                theme === "dark" ? "bg-gray-600" : "bg-gray-300"
              }`}
            ></div>
            <div className="flex-1 space-y-2">
              <div
                className={`h-4 rounded ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`h-3 rounded w-1/2 ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RecentOrdersSkeleton = ({ theme }) => (
  <div
    className={`card shadow-lg animate-pulse ${
      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
    }`}
  >
    <div className="card-body">
      <div
        className={`h-6 rounded w-1/4 mb-6 ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-300"
        }`}
      ></div>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              ></div>
              <div className="space-y-2">
                <div
                  className={`h-4 rounded w-20 ${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`h-3 rounded w-16 ${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            </div>
            <div
              className={`h-4 rounded w-12 ${
                theme === "dark" ? "bg-gray-600" : "bg-gray-300"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Enhanced Stat Card Component
function StatCard({ title, value, change, icon, theme }) {
  const isPositive = change >= 0;

  return (
    <div
      className={`card compact shadow-lg hover:shadow-xl transition-all duration-200 ${
        theme === "dark" ? "black-card" : "light-card"
      }`}
    >
      <div className="card-body p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p
              className={`text-xs sm:text-sm font-medium mb-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {title}
            </p>
            <p className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{value}</p>
            <div
              className={`flex items-center gap-1 text-xs ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <FiTrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>{Math.abs(change).toFixed(1)}%</span>
              <span
                className={theme === "dark" ? "text-gray-500" : "text-gray-400"}
              >
                vs last month
              </span>
            </div>
          </div>
          <div
            className={`p-2 sm:p-3 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-primary/10"
            }`}
          >
            {React.cloneElement(icon, {
              className: "w-4 h-4 sm:w-5 sm:h-5 text-primary",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Top Item Card Component
function TopItemCard({ item, index, theme, role, onItemClick }) {
  const rankColors = [
    "from-yellow-400 to-amber-500",
    "from-gray-400 to-gray-500",
    "from-amber-600 to-amber-700",
    "from-blue-400 to-blue-500",
    "from-green-400 to-green-500",
  ];

  return (
    <div
      onClick={onItemClick}
      className={`group flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        theme === "dark"
          ? "bg-gray-900 hover:bg-gray-700"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm bg-gradient-to-r ${
            rankColors[index] || rankColors[3]
          }`}
        >
          #{index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{item.product_name}</p>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {item.total_quantity} sold
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-primary text-sm">₱{item.total_sales}</p>
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
  const { setOrderID } = useOrderContext();
  const { setProductID } = useProductDetailContext();
  const { notifLength } = useNotificationContext();

  // State variables
  const [topItems, setTopItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [percentChange, setPercentChange] = useState({
    sales: 0,
    orders: 0,
    avgOrder: 0,
  });
  const [recentOrder, setRecentOrder] = useState([]);
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [profitData, setProfitData] = useState({
    gross: 0,
    net: 0,
    equipments: 0,
    packaging_cost: 0,
  });

  const { theme, setTheme } = useTheme();

  // Data fetching effects
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
        setUser(
          userRes.data.user.first_name + " " + userRes.data.user.last_name
        );
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

  // Loading State
  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 min-h-screen">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div
            className={`h-8 rounded w-1/3 mb-2 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-4 rounded w-1/2 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[1, 2, 3, 4].map((item) => (
            <StatCardSkeleton key={item} theme={theme} />
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="xl:col-span-2">
            <div
              className={`card shadow-lg animate-pulse ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <div className="card-body">
                <div
                  className={`h-6 rounded w-1/4 mb-6 ${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`h-64 rounded ${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-1">
            <TopItemsSkeleton theme={theme} />
          </div>
        </div>

        {/* Bottom Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <RecentOrdersSkeleton theme={theme} />
          <RecentOrdersSkeleton theme={theme} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 min-h-screen">
      {/* Header Section - Compact */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome Back{" "}
              <span className="font-bold bg-gradient-to-r from-violet-500 via-blue-400 to-indigo-600 bg-clip-text text-transparent">
                {user}!
              </span>
            </h1>
            <p
              className={`text-xs sm:text-sm mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Dashboard Overview
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title="Monthly Sales"
          value={`₱${summary?.sales?.toLocaleString() ?? "0"}`}
          change={percentChange.sales}
          icon={<FiDollarSign />}
          theme={theme}
        />

        <StatCard
          title="Total Orders"
          value={summary?.orders?.toLocaleString() ?? "0"}
          change={percentChange.orders}
          icon={<FiShoppingCart />}
          theme={theme}
        />

        <StatCard
          title="Avg. Order"
          value={`₱${summary?.avgOrder?.toFixed(0) ?? "0"}`}
          change={percentChange.avgOrder}
          icon={<FiTrendingUp />}
          theme={theme}
        />
      </div>

      {/* Main Content Grid - Optimized for Mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Profit Overview */}
        <div className="xl:col-span-2">
          <div
            className={`card compact shadow-lg ${
              theme === "dark" ? "black-card" : "light-card"
            }`}
          >
            <div className="card-body p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-0">
                  Profit Overview
                </h3>
                <div className="flex gap-1 sm:gap-2 text-xs"></div>
              </div>
              <div className="h-fit sm:h-fit">
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

        {/* Top Performing Products - Compact */}
        <div className="xl:col-span-1">
          <div
            className={`card compact shadow-lg h-full ${
              theme === "dark" ? "black-card" : "light-card"
            }`}
          >
            <div className="card-body p-3 sm:p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Top Items</h3>
                <FiBox className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>

              <div className="flex-1 space-y-2 sm:space-y-3">
                {topItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <div
                      className={`p-3 rounded-full mb-3 ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <FiPackage className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">
                      No sales data
                    </h3>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Top products will appear here
                    </p>
                  </div>
                ) : (
                  topItems.slice(0, 4).map((item, index) => (
                    <TopItemCard
                      key={item.item_id}
                      item={item}
                      index={index}
                      theme={theme}
                      role={role}
                      onItemClick={() => {
                        if (!["Staff"].includes(role)) {
                          setProductID(item.item_id);
                          setActiveTab("Product Detail");
                        }
                      }}
                    />
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  if (!["Staff"].includes(role)) {
                    setActiveTab("Product Rank");
                  }
                }}
                className={`btn btn-sm btn-outline mt-4 ${
                  ["Staff"].includes(role) ? "btn-disabled" : ""
                }`}
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Compact Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders - Compact */}
        <div
          className={`card compact shadow-lg ${
            theme === "dark" ? "black-card" : "light-card"
          }`}
        >
          <div className="card-body p-3 sm:p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Recent Orders</h3>
              <span
                className={`badge badge-sm ${
                  theme === "dark"
                    ? "bg-gray-700 "
                    : "bg-gray-100 text-slate-700"
                }`}
              >
                {recentOrder.length}
              </span>
            </div>

            <div className="space-y-2">
              {recentOrder.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  onClick={() => {
                    setOrderID(order.id);
                    setActiveTab("Order Details");
                  }}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                    theme === "dark"
                      ? "bg-gray-900 hover:bg-gray-700"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-primary/10"
                      }`}
                    >
                      <FiUsers className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">
                        #{order.id}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {order.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">
                      ₱{order.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats - Compact Grid */}
        <div
          className={`card compact shadow-lg ${
            theme === "dark" ? "black-card" : "light-card"
          }`}
        >
          <div className="card-body p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Store Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`text-center p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-blue-50"
                }`}
              >
                <FiShoppingCart
                  className={`w-5 h-5 mx-auto mb-1 ${
                    theme === "dark" ? "text-blue-600" : "text-blue-500"
                  }`}
                />
                <p className="text-lg font-bold">{totals?.todayOrders || 0}</p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Today
                </p>
              </div>

              <div
                className={`text-center p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-amber-50"
                }`}
              >
                <FiAlertTriangle
                  className={`w-5 h-5 mx-auto mb-1 ${
                    theme === "dark" ? "text-amber-400" : "text-amber-500"
                  }`}
                />
                <p className="text-lg font-bold">{totals?.lowStock || 0}</p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Low Stock
                </p>
              </div>

              <div
                className={`text-center p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-green-50"
                }`}
                onClick={() => {
                  if (!["Staff"].includes(role)) {
                    setActiveTab("Products");
                  }
                }}
              >
                <FiPackage
                  className={`w-5 h-5 mx-auto mb-1 ${
                    theme === "dark" ? "text-green-400" : "text-green-500"
                  }`}
                />
                <p className="text-lg font-bold">{productCount}</p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Products
                </p>
              </div>

              <div
                className={`text-center p-3 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-purple-50"
                }`}
              >
                <FiClock
                  className={`w-5 h-5 mx-auto mb-1 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-500"
                  }`}
                />
                <p className="text-lg font-bold">{notifLength}</p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Pending
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View All Button - Conditionally Rendered */}
      {!["Staff", "Admin"].includes(role) && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setActiveTab("View All")}
            className="btn btn-neutral btn-sm sm:btn-md"
          >
            View Full Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
