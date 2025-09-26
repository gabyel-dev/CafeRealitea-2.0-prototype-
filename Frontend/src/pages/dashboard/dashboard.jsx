import { useState, useEffect } from "react";
import Profit from "../../components/UI/Charts/PieChart";
import Title from "../../components/UI/Title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FiBox, FiPlus } from "react-icons/fi";
import { useTheme } from "../../Main/ThemeContext";
const socket = io("https://caferealitea.onrender.com");

// Main Dashboard Component
export default function Dashboard({
  setActiveTab,
  activeTab,
  totals,
  financialData,
}) {
  const navigate = useNavigate();

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
      .get("https://caferealitea.onrender.com/recent-order", {
        withCredentials: true,
      })
      .then((res) => setRecentOrder(res.data));
  }, []);

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

    axios
      .get("https://caferealitea.onrender.com/user", { withCredentials: true })
      .then((res) => {
        console.log(res.data.role);

        if (!res.data.logged_in || res.data.role === "") {
          navigate("/");
          return;
        }
        setRole(res.data.role);
      })
      .catch((err) => {
        console.error("Authentication check failed:", err);
        navigate("/");
      });
  }, []);

  // Helper function to calculate percentage change
  function getPercentageChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  // Fetch dashboard data
  useEffect(() => {
    const api = import.meta.env.VITE_SERVER_API_NAME;

    // Fetch top items
    axios.get(`${api}/top_items`).then((result) => setTopItems(result.data));

    // Fetch orders summary
    axios.get(`${api}/orders/months`).then((res) => {
      const data = res.data;

      // Sort by year + month
      data.sort((a, b) =>
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
            orders: getPercentageChange(latest.total_orders, prev.total_orders),
            avgOrder: getPercentageChange(
              latest.total_sales / latest.total_orders,
              prev.total_sales / prev.total_orders
            ),
          });
        }
      }
    });
  }, []);

  return (
    <div className={` md:p-4 pt-0 md:pt-4 min-h-screen`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div
          onClick={() => setActiveTab("Dashboard")}
          className="cursor-pointer mb-4 md:mb-0"
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
        <div className="lg:flex lg:flex-row flex md:flex-col flex-row gap-2">
          <div className="form-control">
            <select
              className={`select ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "select-bordered text-white"
              } select-sm`}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <button className="btn btn-sm btn-primary gap-2">
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
            Export Report
          </button>

          <label className="flex items-center gap-2">
            <span
              className={theme === "dark" ? "text-gray-300" : "text-slate-700"}
            >
              Dark Mode
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={theme === "dark"}
              onChange={() => toggleTheme()}
            />
          </label>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {/* Stat Card 1 - Monthly Sales */}
        <div
          className={`${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          } card shadow-md`}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Monthly Sales
                </h3>
                <p className="text-2xl font-bold mt-1">
                  ₱{summary?.sales?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div
                className={`badge badge-lg gap-1 ${
                  percentChange.sales >= 0 ? "badge-success" : "badge-error"
                }`}
              >
                {percentChange.sales >= 0 ? "↑" : "↓"}{" "}
                {percentChange.sales.toFixed(1)}%
              </div>
            </div>
            <div className="flex items-baseline mt-4">
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                vs previous month
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 2 - Total Orders */}
        <div
          className={`${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          } card shadow-md`}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="flex justify-between">
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Total Orders
                  </h3>
                  <div
                    className={`badge badge-lg gap-1 ${
                      percentChange.orders >= 0
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {percentChange.orders >= 0 ? "↑" : "↓"}{" "}
                    {percentChange.orders.toFixed(1)}%
                  </div>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {summary?.orders ?? "0"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline mt-4">
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                vs previous month
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 3 - Avg. Order Value */}
        <div
          className={`${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          } card shadow-md`}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="flex justify-between">
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Avg. Order Val
                  </h3>
                  <div
                    className={`badge badge-lg gap-1 ${
                      percentChange.avgOrder >= 0
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {percentChange.avgOrder >= 0 ? "↑" : "↓"}{" "}
                    {percentChange.avgOrder.toFixed(1)}%
                  </div>
                </div>
                <p className="text-2xl font-bold mt-1">
                  ₱{summary?.avgOrder?.toFixed(2) ?? "0"}
                </p>
              </div>
            </div>
            <div className="flex items-baseline mt-4">
              <div
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                vs previous month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profit Chart */}
        <div className="lg:col-span-2">
          <div
            className={`${
              theme === "dark"
                ? "black-card text-color-black"
                : "light-card text-slate-700"
            } card shadow-md`}
          >
            <div className="card-body">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="text-lg font-semibold">Profit Overview</h3>
                <button
                  disabled={["Admin", "Staff"].includes(role)}
                  onClick={() => setActiveTab("View All")}
                  className="btn btn-neutral btn-sm"
                >
                  View All Data
                </button>
              </div>
              <div className="h-fit">
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

        {/* Top Items */}
        <div
          className={`${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          } card h-fit shadow-md`}
        >
          <div className="card-body">
            <h3 className="card-title text-lg mb-6">Top Selling Items</h3>
            {topItems.length <= 0 ? (
              <div
                className={`flex flex-col items-center justify-center py-4 mb-4 px-4 text-center rounded-lg border border-dashed ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
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
                  className={`max-w-md mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  When you start making sales, your top performing items will
                  appear here. Start by adding products to your inventory.
                </p>
              </div>
            ) : (
              <div className="space-y-5 pb-10">
                {topItems.slice(0, 4).map((item, index) => (
                  <div
                    key={item.item_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          index === 0
                            ? "bg-blue-100 text-blue-600"
                            : index === 1
                            ? "bg-purple-100 text-purple-600"
                            : index === 2
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {item.total_quantity} sold
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">₱ {item.total_sales}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setActiveTab("Products")}
              className="btn btn-primary btn-sm gap-2 self-center"
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

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Orders */}
        <div
          className={`${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          } card shadow-md`}
        >
          <div className="card-body">
            <h3 className="card-title text-lg mb-6">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-sm">
                <thead>
                  <tr
                    className={`${
                      theme === "dark" ? " text-color-black" : " text-slate-700"
                    } `}
                  >
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody
                  className={`${
                    theme === "dark"
                      ? "[&>tr:nth-child(even)]:bg-gray-700 [&>tr:nth-child(odd)]:bg-gray-800"
                      : "[&>tr:nth-child(even)]:bg-slate-100 [&>tr:nth-child(odd)]:bg-white"
                  }`}
                >
                  {recentOrder.map((order) => (
                    <tr key={order.id}>
                      <td>#ORD-{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>₱ {order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className={`${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          } card shadow-md`}
        >
          <div className="card-body">
            <h3 className="card-title text-lg mb-6">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-sm">
                <thead>
                  <tr
                    className={`${
                      theme === "dark" ? " text-color-black" : " text-slate-700"
                    } `}
                  >
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody
                  className={`${
                    theme === "dark"
                      ? "[&>tr:nth-child(even)]:bg-gray-700 [&>tr:nth-child(odd)]:bg-gray-800"
                      : "[&>tr:nth-child(even)]:bg-slate-100 [&>tr:nth-child(odd)]:bg-white"
                  }`}
                >
                  <tr>
                    <td>#ORD-7829</td>
                    <td>John Smith</td>
                    <td>$245.50</td>
                  </tr>
                  <tr>
                    <td>#ORD-7828</td>
                    <td>Sarah Johnson</td>
                    <td>$87.99</td>
                  </tr>
                  <tr>
                    <td>#ORD-7827</td>
                    <td>Michael Brown</td>
                    <td>$152.75</td>
                  </tr>
                  <tr>
                    <td>#ORD-7826</td>
                    <td>Emily Davis</td>
                    <td>$499.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View All Link */}
      <div
        className={`${role === "Admin" ? "hidden" : "block"} mt-8 text-center`}
      >
        <button
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
