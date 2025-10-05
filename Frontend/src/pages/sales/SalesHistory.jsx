import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiCreditCard,
  FiBox,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronRight,
} from "react-icons/fi";
import { useTheme } from "../../Main/ThemeContext";

export default function SalesHistory({
  activeTab,
  setActiveTab,
  setSelectedUserId,
}) {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [dailySalesData, setDailySalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "descending",
  });
  const [filters, setFilters] = useState({
    year: "all",
    month: "all",
  });
  const [expandedMonths, setExpandedMonths] = useState(new Set());
  const { theme } = useTheme();

  useEffect(() => {
    axios
      .get("https://caferealitea.onrender.com/daily-sales")
      .then((res) => {
        // Parse the formatted date strings to extract year and month
        const dataWithDateInfo = res.data.map((item) => {
          const dateInfo = parseFormattedDate(item.order_time);
          return {
            ...item,
            ...dateInfo,
          };
        });

        setDailySalesData(dataWithDateInfo);
        setFilteredData(dataWithDateInfo);
        setLoading(false);

        // Extract available years from the data
        const years = [
          ...new Set(dataWithDateInfo.map((item) => item.year)),
        ].sort((a, b) => b - a);
        setAvailableYears(years);

        // Auto-expand current month and previous month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        const autoExpanded = new Set();
        autoExpanded.add(`${currentYear}-${currentMonth}`);
        autoExpanded.add(`${prevYear}-${prevMonth}`);
        setExpandedMonths(autoExpanded);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = "Café Realitea - Sales History";
    axios
      .get("https://caferealitea.onrender.com/user", { withCredentials: true })
      .then((res) => {
        const { logged_in } = res.data;
        if (!logged_in) {
          navigate("/");
        }
      })
      .catch(() => navigate("/"));
  }, []);

  // Parse the formatted date string (e.g., "Today • 07:27 PM", "Yesterday • 02:15 PM", "Dec 15, 2023 • 11:30 AM")
  const parseFormattedDate = (dateString) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString.includes("Today")) {
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      };
    } else if (dateString.includes("Yesterday")) {
      return {
        year: yesterday.getFullYear(),
        month: yesterday.getMonth() + 1,
        day: yesterday.getDate(),
      };
    } else {
      // Parse dates like "Dec 15, 2023 • 11:30 AM"
      const datePart = dateString.split(" • ")[0];
      const date = new Date(datePart);

      if (!isNaN(date.getTime())) {
        return {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        };
      }

      // Fallback if parsing fails
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      };
    }
  };

  // Apply filters automatically when any filter changes
  useEffect(() => {
    applyFilters();
  }, [
    paymentFilter,
    orderTypeFilter,
    filters,
    searchQuery,
    dailySalesData,
    sortConfig,
  ]);

  const applyFilters = () => {
    let result = [...dailySalesData];

    // Apply payment method filter
    if (paymentFilter !== "all") {
      result = result.filter((item) => item.payment_method === paymentFilter);
    }

    // Apply order type filter
    if (orderTypeFilter !== "all") {
      result = result.filter((item) => item.order_type === orderTypeFilter);
    }

    // Apply year filter
    if (filters.year !== "all") {
      result = result.filter((item) => item.year == filters.year);
    }

    // Apply month filter
    if (filters.month !== "all") {
      result = result.filter((item) => item.month == filters.month);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.payment_method &&
            item.payment_method.toLowerCase().includes(query)) ||
          item.order_time_raw.toString().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // For date sorting, we need to compare the actual dates
        if (sortConfig.key === "order_time") {
          // Create comparable date objects from the extracted year, month, day
          const aDate = new Date(a.year, a.month - 1, a.day);
          const bDate = new Date(b.year, b.month - 1, b.day);

          if (aDate < bDate) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aDate > bDate) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        } else {
          // For other fields, use regular comparison
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
      });
    }

    setFilteredData(result);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setPaymentFilter("all");
    setOrderTypeFilter("all");
    setSearchQuery("");
    setSortConfig({ key: null, direction: "descending" });
    setFilters({
      year: "all",
      month: "all",
    });
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1] || "";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate statistics - using 'total' instead of 'total_amount'
  const totalSales = filteredData.reduce(
    (sum, sale) => sum + parseFloat(sale.total || 0),
    0
  );
  const totalOrders = filteredData.length;
  const cashPayments = filteredData.filter(
    (item) => item.payment_method === "Cash"
  ).length;
  const deliveryOrders = filteredData.filter(
    (item) => item.order_type === "Delivery"
  ).length;
  const gcashPayments = filteredData.filter(
    (item) => item.payment_method === "GCash"
  ).length;
  const dineInOrders = filteredData.filter(
    (item) => item.order_type === "Dine-in"
  ).length;

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <FiChevronUp className="ml-1" />
    ) : (
      <FiChevronDown className="ml-1" />
    );
  };

  // Get available months based on selected year
  const getAvailableMonths = () => {
    if (filters.year === "all") return [];

    const months = [
      ...new Set(
        dailySalesData
          .filter((item) => item.year == filters.year)
          .map((item) => item.month)
      ),
    ].sort((a, b) => a - b);

    return months;
  };

  // Group sales by month
  const groupSalesByMonth = () => {
    const grouped = {};

    filteredData.forEach((sale) => {
      const monthKey = `${sale.year}-${sale.month}`;
      const monthName = getMonthName(sale.month);
      const displayName = `${monthName} ${sale.year}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          displayName,
          month: sale.month,
          year: sale.year,
          sales: [],
          total: 0,
          orderCount: 0,
        };
      }

      grouped[monthKey].sales.push(sale);
      grouped[monthKey].total += parseFloat(sale.total || 0);
      grouped[monthKey].orderCount += 1;
    });

    // Convert to array and sort by year and month (newest first)
    return Object.values(grouped).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  };

  const toggleMonth = (monthKey) => {
    setExpandedMonths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(monthKey)) {
        newSet.delete(monthKey);
      } else {
        newSet.add(monthKey);
      }
      return newSet;
    });
  };

  const toggleAllMonths = () => {
    const groupedData = groupSalesByMonth();
    if (expandedMonths.size === groupedData.length) {
      // Collapse all
      setExpandedMonths(new Set());
    } else {
      // Expand all
      const allMonthKeys = groupedData.map(
        (month) => `${month.year}-${month.month}`
      );
      setExpandedMonths(new Set(allMonthKeys));
    }
  };

  const groupedSales = groupSalesByMonth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(
          "https://caferealitea.onrender.com/user",
          {
            withCredentials: true,
          }
        );

        if (!userRes.data.logged_in || userRes.data.role === "") {
          navigate("/");
          return;
        }
        setRole(userRes.data.role);
      } catch (err) {
        console.error("Data fetch failed:", err);
        navigate("/");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="lg:pt-4 lg:py-4 lg:px-4  min-h-screen">
        <div className="w-full mb-6">
          <h1
            className={`${
              theme === "dark" ? "text-white" : "text-slate-700"
            } text-2xl font-bold `}
          >
            Sales History
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } text-sm  mt-1`}
          >
            View and manage all sales records
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div
            className={`${
              theme === "dark"
                ? "black-card text-color-black"
                : "light-card text-slate-700"
            } rounded-xl shadow-md p-5 `}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
                }`}
              >
                <FiDollarSign className="text-xl text-blue-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } text-sm font-medium `}
                >
                  Total Sales
                </p>
                <h3
                  className={` text-xl font-bold ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  } `}
                >
                  {formatCurrency(totalSales)}
                </h3>
              </div>
            </div>
            <div
              className={`mt-3 pt-3 border-t ${
                theme === "dark" ? "border-slate-700" : "border-gray-100"
              }`}
            >
              <p className="text-xs text-gray-500">
                {totalOrders} transactions
              </p>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "black-card text-color-black"
                : "light-card text-slate-700"
            } rounded-xl shadow-md p-5 `}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-green-900/30" : "bg-green-50"
                }`}
              >
                <FiShoppingBag className="text-xl text-green-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } text-sm font-medium `}
                >
                  Total Orders
                </p>
                <h3
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  } `}
                >
                  {totalOrders}
                </h3>
              </div>
            </div>
            <div
              className={`mt-3 pt-3 border-t ${
                theme === "dark" ? "border-slate-700" : "border-gray-100"
              } flex justify-between`}
            >
              <p className="text-xs text-gray-500">{dineInOrders} Dine-in</p>
              <p className="text-xs text-gray-500">{deliveryOrders} Delivery</p>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "black-card text-color-black"
                : "light-card text-slate-700"
            } rounded-xl shadow-md p-5 `}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-purple-900/20" : "bg-purple-50"
                }`}
              >
                <FiCreditCard className="text-xl text-purple-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } text-sm font-medium `}
                >
                  Payments
                </p>
                <h3
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  } `}
                >
                  {cashPayments + gcashPayments}
                </h3>
              </div>
            </div>
            <div
              className={`mt-3 pt-3 border-t ${
                theme === "dark" ? "border-slate-700" : "border-gray-100 "
              } flex justify-between`}
            >
              <p className="text-xs text-gray-500">{cashPayments} Cash</p>
              <p className="text-xs text-gray-500">{gcashPayments} GCash</p>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "black-card text-color-black"
                : "light-card text-slate-700"
            } rounded-xl shadow-md p-5 `}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-orange-400/10" : "bg-orange-50"
                }`}
              >
                <FiBox className="text-xl text-orange-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } text-sm font-medium `}
                >
                  Delivery Orders
                </p>
                <h3
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  } `}
                >
                  {deliveryOrders}
                </h3>
              </div>
            </div>
            <div
              className={`mt-3 pt-3 border-t ${
                theme === "dark" ? "border-slate-700" : "border-gray-100 "
              }`}
            >
              <p className="text-xs text-gray-500">
                {totalOrders > 0
                  ? ((deliveryOrders / totalOrders) * 100).toFixed(1)
                  : 0}
                % of all orders
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className={`${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          } rounded-xl shadow-md p-5   mb-6`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 ">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiFilter
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } text-sm font-medium  mr-2`}
              />
              <h1
                className={`${
                  theme === "dark" ? "text-gray-200" : "text-gray-600"
                }`}
              >
                Filter
              </h1>
            </h2>

            <div className="relative mt-3 md:mt-0 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 w-full  text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full px-3 py-2  text-slate-700  rounded-lg border border-slate-300"
              >
                <option value="all">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                className="w-full px-3 py-2  text-slate-700  rounded-lg border border-slate-300"
                disabled={filters.year === "all"}
              >
                <option value="all">All Months</option>
                {getAvailableMonths().map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Type
              </label>
              <select
                name="orderType"
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border text-slate-700  rounded-lg focus:ring-2 border border-slate-300"
              >
                <option value="all">All Orders</option>
                <option value="Dine-in">Dine-in</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 border text-slate-700  border-slate-300 rounded-lg "
              >
                <option value="all">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="GCash">GCash</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-slate-300  rounded-lg text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
            >
              <FiRefreshCw className="mr-2" />
              Reset All
            </button>
          </div>
        </div>

        {/* Results Count and Controls */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {dailySalesData.length} records
            {groupedSales.length > 0 && ` across ${groupedSales.length} months`}
          </p>

          <div className="flex items-center space-x-4">
            {filteredData.length > 0 && (
              <p className="text-sm font-medium text-gray-700">
                Total: {formatCurrency(totalSales)}
              </p>
            )}
            {groupedSales.length > 1 && (
              <button
                onClick={toggleAllMonths}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {expandedMonths.size === groupedSales.length
                  ? "Collapse All"
                  : "Expand All"}
              </button>
            )}
          </div>
        </div>

        {/* Sales List with Collapsible Months */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FiCalendar className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No sales records found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {groupedSales.map((monthData) => {
              const monthKey = `${monthData.year}-${monthData.month}`;
              const isExpanded = expandedMonths.has(monthKey);

              return (
                <div
                  key={monthKey}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                  {/* Month Header */}
                  <div
                    className={`px-6 py-4 cursor-pointer transition-colors ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    } border-b border-gray-200`}
                    onClick={() => toggleMonth(monthKey)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {isExpanded ? (
                          <FiChevronDown className="text-gray-500 mr-3" />
                        ) : (
                          <FiChevronRight className="text-gray-500 mr-3" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {monthData.displayName}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>{monthData.orderCount} orders</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(monthData.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Month Content */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSort("order_time");
                              }}
                            >
                              <div className="flex items-center">
                                Date & Time
                                {getSortIndicator("order_time")}
                              </div>
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSort("id");
                              }}
                            >
                              <div className="flex items-center">
                                Order ID
                                {getSortIndicator("id")}
                              </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSort("total");
                              }}
                            >
                              <div className="flex items-center">
                                Amount
                                {getSortIndicator("total")}
                              </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monthData.sales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {sale.order_time}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  #{sale.id}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    sale.order_type === "Dine-in"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {sale.order_type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    sale.payment_method === "Cash"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {sale.payment_method}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">
                                  {formatCurrency(sale.total)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  disabled={
                                    !["System Administrator", "Admin"].includes(
                                      role
                                    )
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUserId(sale.id);
                                    setActiveTab("Order Details");
                                  }}
                                  className="text-blue-600 hover:text-blue-900 flex items-center transition-colors"
                                >
                                  <FiEye className="mr-1" />
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
