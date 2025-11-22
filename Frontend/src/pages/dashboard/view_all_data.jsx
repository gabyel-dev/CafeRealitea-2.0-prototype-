import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiCalendar,
  FiPackage,
  FiChevronDown,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IoIosArrowForward } from "react-icons/io";
import { useTheme } from "../../Main/ThemeContext";
import * as XLSX from "xlsx";

// ----------------- Equipment Modal -----------------
function EquipmentModal({ isOpen, onClose, onSave, editing, theme }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        console.log("Escape pressed - closing modal");
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(editing.price);
    } else {
      setName("");
      setPrice("");
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div
        className={`modal-box ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="font-bold text-lg mb-4">
          {editing ? "Edit Equipment" : "Add Equipment"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name, price: parseFloat(price) || 0 });
          }}
        >
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className={`input ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "input-bordered text-white"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Price (₱)</span>
            </label>
            <input
              type="number"
              step="0.01"
              className={`input ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "input-bordered text-white"
              }`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="modal-action">
            <button
              type="button"
              className={`btn ${
                theme === "dark" ? "btn-ghost text-white" : "btn-ghost"
              }`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- Product Gross Profit Modal -----------------
function ProductGrossProfitModal({ isOpen, onClose, onSave, editing, theme }) {
  const [grossProfit, setGrossProfit] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        console.log("Escape pressed - closing modal");
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (editing) {
      setGrossProfit(editing.gross_profit || "");
    } else {
      setGrossProfit("");
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div
        className={`modal-box ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="font-bold text-lg mb-4">
          {editing
            ? `Edit Gross Profit - ${editing.product_name}`
            : "Add Gross Profit"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              product_id: editing?.product_id,
              gross_profit: parseFloat(grossProfit) || 0,
            });
          }}
        >
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Gross Profit Per Unit (₱)</span>
            </label>
            <input
              type="number"
              step="0.01"
              className={`input ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "input-bordered text-white"
              }`}
              value={grossProfit}
              onChange={(e) => setGrossProfit(e.target.value)}
              required
            />
            <label className="label">
              <span className="label-text-alt">
                This is the profit amount per unit sold
              </span>
            </label>
          </div>
          <div className="modal-action">
            <button
              type="button"
              className={`btn ${
                theme === "dark" ? "btn-ghost text-white" : "btn-ghost"
              }`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- Bulk Product Gross Profit Modal -----------------
function BulkProductGrossProfitModal({
  isOpen,
  onClose,
  onSave,
  products,
  theme,
}) {
  const [productProfits, setProductProfits] = useState({});

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        console.log("Escape pressed - closing modal");
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (products && isOpen) {
      const initialProfits = {};
      products.forEach((product) => {
        initialProfits[product.product_id] = product.gross_profit || 0;
      });
      setProductProfits(initialProfits);
    }
  }, [products, isOpen]);

  const handleProfitChange = (productId, value) => {
    setProductProfits((prev) => ({
      ...prev,
      [productId]: parseFloat(value) || 0,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div
        className={`modal-box max-w-4xl ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="font-bold text-lg mb-4">
          Bulk Update Product Gross Profits
        </h3>
        <div className="max-h-96 overflow-y-auto mb-6">
          <table className="table table-sm w-full">
            <thead>
              <tr className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"}>
                <th>Product</th>
                <th>Price</th>
                <th>Gross Profit</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>
                    <div>
                      <div className="font-medium">{product.product_name}</div>
                    </div>
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(product.product_price || 0)}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-sm input-bordered w-32 ${
                        theme === "dark" ? "bg-gray-700" : "bg-white"
                      }`}
                      value={productProfits[product.product_id] || 0}
                      onChange={(e) =>
                        handleProfitChange(product.product_id, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className={`btn ${
              theme === "dark" ? "btn-ghost text-white" : "btn-ghost"
            }`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const updates = Object.entries(productProfits).map(
                ([product_id, gross_profit]) => ({
                  product_id: parseInt(product_id),
                  gross_profit: parseFloat(gross_profit) || 0,
                })
              );
              onSave(updates);
            }}
          >
            Update All
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------- Packaging Modal -----------------
function PackagingModal({ isOpen, onClose, onSave, category, costs, theme }) {
  const [localCosts, setLocalCosts] = useState({});
  const [savingPackaging, setSavingPackaging] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        console.log("Escape pressed - closing modal");
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (costs) setLocalCosts(costs);
  }, [costs, isOpen]);

  if (!isOpen) return null;

  const itemsPerCategory = {
    Milktea: ["Cup", "Straw", "Logo", "Paper"],
    "Coffee Hot": ["Cup", "Lid"],
    "Coffee Cold": ["Cup", "Straw"],
    "Fruit Soda": ["Cup", "Lid"],
    pastil: ["Container", "Spoon"],
  };

  const handleChange = (item, value) => {
    setLocalCosts((prev) => ({ ...prev, [item]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavingPackaging(true);
    onSave(category, localCosts);
  };

  return (
    <div className="modal modal-open">
      <div
        className={`modal-box  ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } `}
      >
        <h3 className="font-bold text-lg mb-4">{category} Packaging Costs</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-6">
            {itemsPerCategory[category].map((item) => (
              <div key={item} className="form-control">
                <label className="label">
                  <span className="label-text">{item} Cost (₱)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className={`input ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "input-bordered text-white"
                  }`}
                  value={localCosts[item] || 0}
                  onChange={(e) => handleChange(item, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
          <div className="modal-action">
            <button
              type="button"
              className={`btn ${
                theme === "dark" ? "btn-ghost text-white" : "btn-ghost"
              }`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingPackaging}
            >
              {savingPackaging ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------- Custom Tooltip -----------------
const CustomTooltip = ({ active, payload, label, formatCurrency, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`custom-tooltip p-3 border rounded shadow-md ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-slate-700"
        }`}
      >
        <p className="font-semibold">{`Period: ${label}`}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="intro"
            style={{ color: entry.color }}
          >
            {`${entry.name.toUpperCase()}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ----------------- Time Range Selector Component -----------------
function TimeRangeSelector({
  timeRange,
  setTimeRange,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  availableMonths,
  availableYears,
  theme,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const monthNames = [
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

  const getDisplayText = () => {
    if (timeRange === "daily" && selectedMonth && selectedYear) {
      return `${monthNames[selectedMonth - 1]} ${selectedYear} (Daily)`;
    } else if (timeRange === "monthly" && selectedYear) {
      return `${selectedYear} (Monthly)`;
    } else if (timeRange === "yearly") {
      return "All Years (Yearly)";
    }
    return "Select Time Range";
  };

  return (
    <div className="relative">
      {/* Compact Dropdown Trigger */}
      <div className="dropdown dropdown-bottom">
        <label
          tabIndex={0}
          className={`btn btn-sm flex items-center gap-2 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          } border`}
        >
          <FiCalendar className="text-sm" />
          <span className="text-xs font-medium">{getDisplayText()}</span>
          <FiChevronDown className="text-xs" />
        </label>

        <div
          tabIndex={0}
          className={`dropdown-content menu p-2 shadow-lg rounded-box w-64 z-50 ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-900"
          }`}
        >
          {/* Time Range Selection */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2 px-2">Time Range</h4>
            <div className="grid grid-cols-3 gap-1">
              {[
                { value: "daily", label: "Daily" },
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`btn btn-xs ${
                    timeRange === option.value
                      ? "btn-primary text-white"
                      : theme === "dark"
                      ? "btn-ghost text-gray-300 hover:bg-gray-700"
                      : "btn-ghost text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setTimeRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year Selection */}
          <div className="mb-3">
            <label className="label py-1">
              <span className="label-text font-medium text-sm">Year</span>
            </label>
            <select
              className={`select select-sm select-bordered w-full ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selection (only for daily and monthly views) */}
          {timeRange !== "yearly" && (
            <div className="mb-3">
              <label className="label py-1">
                <span className="label-text font-medium text-sm">
                  {timeRange === "daily" ? "Month" : "Start Month"}
                </span>
              </label>
              <select
                className={`select select-sm select-bordered w-full ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                disabled={!selectedYear}
              >
                <option value="">Select Month</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {monthNames[month - 1]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-2 mt-2 border-gray-600">
            <div className="flex justify-between">
              <button
                type="button"
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  const currentDate = new Date();
                  setSelectedYear(currentDate.getFullYear());
                  setSelectedMonth(currentDate.getMonth() + 1);
                  setTimeRange("daily");
                }}
              >
                This Month
              </button>
              <button
                type="button"
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  const currentDate = new Date();
                  setSelectedYear(currentDate.getFullYear());
                  setTimeRange("monthly");
                }}
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- Main Component -----------------
export default function ViewAllData({ setActiveTab, activeTab, onDataUpdate }) {
  const [timeRange, setTimeRange] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [productGrossProfits, setProductGrossProfits] = useState([]);
  const [packagingCosts, setPackagingCosts] = useState({
    Milktea: { Cup: 5, Straw: 2, Logo: 1, Paper: 0.5 },
    "Coffee Hot": { Cup: 6, Lid: 1.5 },
    "Coffee Cold": { Cup: 7, Straw: 2 },
    "Fruit Soda": { Cup: 5, Lid: 2 },
    pastil: { Container: 8, Spoon: 1 },
  });
  const [netProfit, setNetProfit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [equipmentModal, setEquipmentModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const [productGrossModal, setProductGrossModal] = useState(false);
  const [bulkProductGrossModal, setBulkProductGrossModal] = useState(false);
  const [editingProductGross, setEditingProductGross] = useState(null);

  const [packagingModal, setPackagingModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { theme } = useTheme();

  const api = import.meta.env.VITE_SERVER_API_NAME;

  // Get current date for default selections
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Fetch all sales data to get available months and years
  useEffect(() => {
    const fetchAvailablePeriods = async () => {
      try {
        const res = await axios.get(`${api}/summaries/daily`);
        if (Array.isArray(res.data)) {
          // Extract unique years and months
          const years = new Set();
          const months = new Set();

          res.data.forEach((item) => {
            if (item.day) {
              const date = new Date(item.day);
              years.add(date.getFullYear());
              months.add(date.getMonth() + 1);
            }
          });

          const sortedYears = Array.from(years).sort((a, b) => b - a);
          const sortedMonths = Array.from(months).sort((a, b) => a - b);

          setAvailableYears(sortedYears);
          setAvailableMonths(sortedMonths);

          // Set default selections
          if (!selectedYear && sortedYears.length > 0) {
            setSelectedYear(sortedYears[0]);
          }
          if (!selectedMonth && sortedMonths.length > 0) {
            setSelectedMonth(sortedMonths[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching available periods:", err);
      }
    };

    fetchAvailablePeriods();
  }, []);

  // Fetch sales data based on selected time range and period
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = `${api}/summaries/${timeRange}`;

        // Add query parameters for filtering
        const params = new URLSearchParams();

        if (timeRange === "daily" && selectedMonth && selectedYear) {
          params.append("month", selectedMonth);
          params.append("year", selectedYear);
        } else if (timeRange === "monthly" && selectedYear) {
          params.append("year", selectedYear);
        }

        const url = params.toString()
          ? `${endpoint}?${params.toString()}`
          : endpoint;

        const res = await axios.get(url);
        const filteredData = Array.isArray(res.data) ? res.data : [];

        setSalesData(filteredData);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError("Failed to load sales data");
        setSalesData([]);
      } finally {
        setLoading(false);
      }
    };

    if (
      (timeRange === "daily" && selectedMonth && selectedYear) ||
      (timeRange === "monthly" && selectedYear) ||
      timeRange === "yearly"
    ) {
      fetchSales();
    }
  }, [timeRange, selectedMonth, selectedYear]);

  // Fetch equipment costs (all data, not filtered by time)
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await axios.get(`${api}/equipment`);
        const equipmentData = Array.isArray(res.data)
          ? res.data.map((item) => ({
              ...item,
              price: parseFloat(item.price) || 0,
            }))
          : [];
        setEquipment(equipmentData);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setEquipment([]);
      }
    };
    fetchEquipment();
  }, []);

  // Fetch product gross profits
  useEffect(() => {
    const fetchProductGrossProfits = async () => {
      try {
        const res = await axios.get(`${api}/product-gross-profit`);
        const productGrossProfitData = Array.isArray(res.data)
          ? res.data.map((item) => ({
              ...item,
              gross_profit: parseFloat(item.gross_profit) || 0,
              product_price: parseFloat(item.product_price) || 0,
            }))
          : [];
        setProductGrossProfits(productGrossProfitData);
      } catch (err) {
        console.error("Error fetching product gross profits:", err);
        setProductGrossProfits([]);
      }
    };
    fetchProductGrossProfits();
  }, []);

  // Fetch packaging costs
  useEffect(() => {
    const fetchPackagingCosts = async () => {
      try {
        const res = await axios.get(`${api}/packaging-costs`);
        if (Array.isArray(res.data)) {
          const transformedCosts = {};
          res.data.forEach((item) => {
            if (!transformedCosts[item.category]) {
              transformedCosts[item.category] = {};
            }
            transformedCosts[item.category][item.item] =
              parseFloat(item.cost) || 0;
          });
          setPackagingCosts(transformedCosts);
        }
      } catch (err) {
        console.error("Error fetching packaging costs:", err);
      }
    };
    fetchPackagingCosts();
  }, []);

  // Calculate net profit with time-range specific filtering
  useEffect(() => {
    const calculateNetProfit = () => {
      if (!salesData.length) return [];

      // Get total equipment cost (global, not filtered)
      const totalEquipment = equipment.reduce(
        (sum, e) => sum + (parseFloat(e.price) || 0),
        0
      );

      return salesData.map((sale) => {
        // Gross profit is now calculated automatically from product gross profits
        // and included in the salesData from the backend
        const periodGrossProfit = parseFloat(sale.gross_profit) || 0;

        return {
          ...sale,
          gross_profit: periodGrossProfit,
          net_profit:
            (sale.revenue || 0) -
            totalEquipment -
            periodGrossProfit -
            (sale.packaging_cost || 0),
        };
      });
    };

    setNetProfit(calculateNetProfit());
  }, [salesData, equipment, timeRange]);

  // Generate Excel report
  const generateExcelReceipt = () => {
    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ["FINANCIAL REPORT - SUMMARY"],
      ["Generated Date:", new Date().toLocaleDateString()],
      ["Time Range:", timeRange.charAt(0).toUpperCase() + timeRange.slice(1)],
      timeRange === "daily" ? ["Month:", selectedMonth] : [],
      timeRange !== "yearly" ? ["Year:", selectedYear] : [],
      [],
      ["FINANCIAL OVERVIEW", ""],
      ["Total Sales:", totalSales],
      ["Net Profit:", totalNetProfit],
      ["Total Equipment Costs:", totalEquipmentCost],
      ["Total Gross Profit:", totalGrossProfit],
      ["Total Packaging Costs:", totalPackagingCost],
      [
        "Profit Margin:",
        totalSales > 0
          ? `${((totalNetProfit / totalSales) * 100).toFixed(2)}%`
          : "0%",
      ],
      [],
      ["DETAILED BREAKDOWN", ""],
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

    // Sales Data Sheet
    if (salesData.length > 0) {
      const salesHeaders =
        timeRange === "daily"
          ? ["Day", "Revenue", "Packaging Cost", "Gross Profit", "Net Profit"]
          : timeRange === "monthly"
          ? [
              "Month",
              "Year",
              "Revenue",
              "Packaging Cost",
              "Gross Profit",
              "Net Profit",
            ]
          : ["Year", "Revenue", "Packaging Cost", "Gross Profit", "Net Profit"];

      const salesSheetData = [
        ["SALES DATA"],
        [],
        salesHeaders,
        ...salesData.map((sale) =>
          timeRange === "daily"
            ? [
                sale.day,
                sale.revenue || 0,
                sale.packaging_cost || 0,
                sale.gross_profit || 0,
                sale.revenue -
                  totalEquipmentCost -
                  (sale.gross_profit || 0) -
                  (sale.packaging_cost || 0),
              ]
            : timeRange === "monthly"
            ? [
                sale.month,
                sale.year,
                sale.revenue || 0,
                sale.packaging_cost || 0,
                sale.gross_profit || 0,
                sale.revenue -
                  totalEquipmentCost -
                  (sale.gross_profit || 0) -
                  (sale.packaging_cost || 0),
              ]
            : [
                sale.year,
                sale.revenue || 0,
                sale.packaging_cost || 0,
                sale.gross_profit || 0,
                sale.revenue -
                  totalEquipmentCost -
                  (sale.gross_profit || 0) -
                  (sale.packaging_cost || 0),
              ]
        ),
      ];

      const salesWorksheet = XLSX.utils.aoa_to_sheet(salesSheetData);
      XLSX.utils.book_append_sheet(workbook, salesWorksheet, "Sales Data");
    }

    // Equipment Costs Sheet
    if (equipment.length > 0) {
      const equipmentData = [
        ["EQUIPMENT COSTS"],
        [],
        ["Name", "Price", "Date Added"],
        ...equipment.map((item) => [
          item.name,
          item.price || 0,
          new Date(item.created_at).toLocaleDateString(),
        ]),
      ];

      const equipmentWorksheet = XLSX.utils.aoa_to_sheet(equipmentData);
      XLSX.utils.book_append_sheet(workbook, equipmentWorksheet, "Equipment");
    }

    // Product Gross Profit Sheet
    if (productGrossProfits.length > 0) {
      const productGrossProfitData = [
        ["PRODUCT GROSS PROFITS"],
        [],
        [
          "Product Name",
          "Selling Price",
          "Gross Profit Per Unit",
          "Profit Margin",
        ],
        ...productGrossProfits.map((item) => [
          item.product_name,
          item.product_price || 0,
          item.gross_profit || 0,
          item.product_price > 0
            ? `${((item.gross_profit / item.product_price) * 100).toFixed(1)}%`
            : "0%",
        ]),
      ];

      const productGrossProfitWorksheet = XLSX.utils.aoa_to_sheet(
        productGrossProfitData
      );
      XLSX.utils.book_append_sheet(
        workbook,
        productGrossProfitWorksheet,
        "Product Gross Profit"
      );
    }

    // Packaging Costs Sheet
    const packagingData = [
      ["PACKAGING COSTS"],
      [],
      ["Category", "Item", "Cost"],
      ...Object.entries(packagingCosts).flatMap(([category, costs]) =>
        Object.entries(costs).map(([item, cost]) => [category, item, cost])
      ),
    ];

    const packagingWorksheet = XLSX.utils.aoa_to_sheet(packagingData);
    XLSX.utils.book_append_sheet(workbook, packagingWorksheet, "Packaging");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const periodInfo =
      timeRange === "daily"
        ? `${selectedYear}-${selectedMonth}`
        : timeRange === "monthly"
        ? selectedYear
        : "all";
    const filename = `Financial_Report_${timeRange}_${periodInfo}_${timestamp}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
  };

  // Handlers for saving and deleting data
  const saveEquipment = async (item) => {
    try {
      if (editingEquipment) {
        const res = await axios.put(
          `${api}/equipment/${editingEquipment.id}`,
          item
        );
        setEquipment(
          equipment.map((e) =>
            e.id === editingEquipment.id
              ? { ...res.data, price: parseFloat(res.data.price) || 0 }
              : e
          )
        );
      } else {
        const res = await axios.post(`${api}/equipment`, item);
        setEquipment([
          ...equipment,
          { ...res.data, price: parseFloat(res.data.price) || 0 },
        ]);
      }
      setEquipmentModal(false);
      setEditingEquipment(null);
    } catch (err) {
      console.error("Error saving equipment:", err);
    }
  };

  const deleteEquipment = async (id) => {
    try {
      await axios.delete(`${api}/equipment/${id}`);
      setEquipment(equipment.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Error deleting equipment:", err);
    }
  };

  const saveProductGrossProfit = async (item) => {
    try {
      const res = await axios.put(
        `${api}/product-gross-profit/${item.product_id}`,
        item
      );

      setProductGrossProfits(
        productGrossProfits.map((p) =>
          p.product_id === item.product_id
            ? {
                ...res.data,
                gross_profit: parseFloat(res.data.gross_profit) || 0,
              }
            : p
        )
      );

      setProductGrossModal(false);
      setEditingProductGross(null);
    } catch (err) {
      console.error("Error saving product gross profit:", err);
    }
  };

  const saveBulkProductGrossProfit = async (updates) => {
    try {
      const res = await axios.post(`${api}/product-gross-profit/bulk-update`, {
        updates,
      });

      if (Array.isArray(res.data)) {
        setProductGrossProfits(
          res.data.map((item) => ({
            ...item,
            gross_profit: parseFloat(item.gross_profit) || 0,
            product_price: parseFloat(item.product_price) || 0,
          }))
        );
      }

      setBulkProductGrossModal(false);
    } catch (err) {
      console.error("Error saving bulk product gross profits:", err);
    }
  };

  const savePackaging = async (category, costs) => {
    try {
      const res = await axios.post(`${api}/packaging-costs/update`, {
        category: category,
        costs: costs,
      });

      if (res.status === 200) {
        setPackagingCosts((prev) => ({ ...prev, [category]: costs }));
        setPackagingModal(false);
        setEditingCategory(null);
        alert("Packaging costs updated successfully!");
      } else {
        throw new Error("Failed to update packaging costs");
      }
    } catch (err) {
      console.error("Error saving packaging:", err);
      alert("Failed to save packaging costs. Please try again.");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount || 0);
  };

  // Calculate totals
  const totalEquipmentCost = useMemo(() => {
    // Equipment is global, not filtered by time
    return equipment.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0),
      0
    );
  }, [equipment]);

  const totalGrossProfit = useMemo(() => {
    // This is now properly filtered by the backend
    return salesData.reduce(
      (sum, sale) => sum + (parseFloat(sale.gross_profit) || 0),
      0
    );
  }, [salesData]);

  const totalPackagingCost = useMemo(() => {
    // This is now properly filtered by the backend
    return salesData.reduce(
      (sum, sale) => sum + (parseFloat(sale.packaging_cost) || 0),
      0
    );
  }, [salesData]);

  const totalSales = useMemo(() => {
    // This is now properly filtered by the backend
    return salesData.reduce(
      (sum, sale) => sum + (parseFloat(sale.revenue) || 0),
      0
    );
  }, [salesData]);

  const totalNetProfit = useMemo(() => {
    return (
      totalSales - totalEquipmentCost - totalGrossProfit - totalPackagingCost
    );
  }, [totalSales, totalEquipmentCost, totalGrossProfit, totalPackagingCost]);

  // Prepare data for Recharts chart
  const chartData = netProfit.map((item) => {
    let name;
    if (timeRange === "daily") {
      const date = new Date(item.day);
      name = `Day ${date.getDate()}`;
    } else if (timeRange === "monthly") {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      name = monthNames[item.month - 1];
    } else {
      name = `Year ${item.year}`;
    }

    return {
      name,
      revenue: parseFloat(item.revenue) || 0,
      packaging_cost: parseFloat(item.packaging_cost) || 0,
      gross_profit: parseFloat(item.gross_profit) || 0,
      net_profit: parseFloat(item.net_profit) || 0,
    };
  });

  // Update parent component with data
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        totalSales,
        totalNetProfit,
        totalEquipmentCost,
        totalGrossProfit,
        totalPackagingCost,
      });
    }
  }, [
    totalSales,
    totalNetProfit,
    totalEquipmentCost,
    totalGrossProfit,
    totalPackagingCost,
    onDataUpdate,
  ]);

  // Month names for display
  const monthNames = [
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

  if (loading) {
    return (
      <div className={`p-6 min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`lg:p-4 min-h-screen `}>
      {error && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="">
          <div className="flex items-center">
            <div
              onClick={() => setActiveTab("Dashboard")}
              className="cursor-pointer transition-colors duration-200 rounded-md hover:opacity-80"
            >
              <h1
                className={`text-lg lg:text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-slate-700"
                }`}
              >
                Dashboard Overview
              </h1>
            </div>
            <div
              className={`mx-2 translate-y-0.5 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <IoIosArrowForward />
            </div>
            <h2 className="text-xs lg:text-lg font-medium translate-y-0.5 text-blue-600">
              Financial Overview
            </h2>
          </div>

          <div className="flex items-center mt-0">
            <p
              className={`text-xs sm:text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Administrator view of all financial metrics
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center mt-4">
          {/* Enhanced Time Range Selector */}
          <TimeRangeSelector
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableMonths={availableMonths}
            availableYears={availableYears}
            theme={theme}
          />

          <button
            onClick={generateExcelReceipt}
            className="btn btn-success btn-sm text-white text-xs"
          >
            <FiDollarSign className="mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Period Info */}
      <div className="mb-6">
        <div
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Showing data for:{" "}
          <span className="font-semibold">
            {timeRange === "daily" && selectedMonth && selectedYear
              ? `${monthNames[selectedMonth - 1]} ${selectedYear} (Daily View)`
              : timeRange === "monthly" && selectedYear
              ? `${selectedYear} (Monthly View)`
              : timeRange === "yearly"
              ? "All Years (Yearly View)"
              : "Select a period to view data"}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Sales",
            value: totalSales,
            icon: <FiDollarSign className="text-blue-600" />,
            bg: "blue",
          },
          {
            title: "Net Profit",
            value: totalNetProfit,
            icon: <FiDollarSign className="text-green-600" />,
            bg: "green",
          },
          {
            title: "Total Costs",
            value: totalEquipmentCost + totalGrossProfit + totalPackagingCost,
            icon: <FiDollarSign className="text-red-600" />,
            bg: "red",
          },
          {
            title: "Profit Margin",
            value:
              totalSales > 0
                ? `${((totalNetProfit / totalSales) * 100).toFixed(1)}%`
                : "0%",
            icon: <FiDollarSign className="text-purple-600" />,
            bg: "purple",
          },
        ].map((card, index) => (
          <div
            key={index}
            className={`card shadow ${
              theme === "dark"
                ? "black-card text-color-black"
                : "light-card text-slate-700"
            } }`}
          >
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p className="text-xl font-bold mt-1">
                    {card.title === "Profit Margin"
                      ? card.value
                      : formatCurrency(card.value)}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    theme === "dark" ? `bg-${card.bg}-900` : `bg-${card.bg}-100`
                  }`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className={`card shadow mb-6 ${
          theme === "dark"
            ? "black-card text-color-black"
            : "light-card text-slate-700"
        }`}
      >
        <div className="card-body px-0 py-4">
          <h3 className="card-title text-lg mb-4 px-4">
            Financial Overview -{" "}
            {timeRange === "daily" && selectedMonth && selectedYear
              ? `${monthNames[selectedMonth - 1]} ${selectedYear}`
              : timeRange === "monthly" && selectedYear
              ? selectedYear
              : "All Years"}
          </h3>

          {/* Mobile-friendly chart container */}
          <div className="relative">
            {/* Horizontal scroll container for mobile */}
            <div className="lg:hidden overflow-x-auto">
              <div className="min-w-[600px]">
                {" "}
                {/* Minimum width to ensure chart is readable */}
                <div className="h-80 min-h-[320px]">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      className="outline-none"
                    >
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme === "dark" ? "#4B5563" : "#E5E7EB"}
                        />
                        <XAxis
                          dataKey="name"
                          stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            `₱${value.toLocaleString()}`
                          }
                          stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        />
                        <Tooltip
                          content={
                            <CustomTooltip
                              formatCurrency={formatCurrency}
                              theme={theme}
                            />
                          }
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                          name="Revenue"
                        />
                        <Line
                          type="monotone"
                          dataKey="net_profit"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          name="Net Profit"
                        />
                        <Line
                          type="monotone"
                          dataKey="gross_profit"
                          stroke="#ffc658"
                          strokeWidth={2}
                          name="Gross Profit"
                        />
                        <Line
                          type="monotone"
                          dataKey="packaging_cost"
                          stroke="#ff7300"
                          strokeWidth={2}
                          name="Packaging Cost"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FiCalendar className="text-4xl text-gray-400 mb-2 mx-auto" />
                        <p className="text-sm">
                          {!selectedMonth || !selectedYear
                            ? "Please select a month and year to view data"
                            : "No data available for the selected period"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop version (no horizontal scroll) */}
            <div className="hidden lg:block">
              <div className="h-80 min-h-[320px] min-w-[300px] relative">
                {chartData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    className="outline-none"
                  >
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#4B5563" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="name"
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                      />
                      <YAxis
                        tickFormatter={(value) => `₱${value.toLocaleString()}`}
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                      />
                      <Tooltip
                        content={
                          <CustomTooltip
                            formatCurrency={formatCurrency}
                            theme={theme}
                          />
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                        name="Revenue"
                      />
                      <Line
                        type="monotone"
                        dataKey="net_profit"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Net Profit"
                      />
                      <Line
                        type="monotone"
                        dataKey="gross_profit"
                        stroke="#ffc658"
                        strokeWidth={2}
                        name="Gross Profit"
                      />
                      <Line
                        type="monotone"
                        dataKey="packaging_cost"
                        stroke="#ff7300"
                        strokeWidth={2}
                        name="Packaging Cost"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FiCalendar className="text-4xl text-gray-400 mb-2 mx-auto" />
                      <p className="text-sm">
                        {!selectedMonth || !selectedYear
                          ? "Please select a month and year to view data"
                          : "No data available for the selected period"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile scroll hint */}
          <div className="lg:hidden text-center mt-2">
            <p className="text-xs text-gray-500">
              ← Scroll horizontally to view full chart →
            </p>
          </div>
        </div>
      </div>

      {/* Cost Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Equipment Costs */}
        <div
          className={`card shadow h-fit ${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          }`}
        >
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Equipment Costs</h3>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setEquipmentModal(true)}
              >
                <FiPlus className="mr-1" /> Add
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="min-h-80 max-h-100 overflow-y-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr
                      className={`${
                        theme === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-slate-700"
                      }`}
                    >
                      <th>Name</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map((e) => (
                      <tr key={e.id}>
                        <td>{e.name}</td>
                        <td>{formatCurrency(parseFloat(e.price) || 0)}</td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-xs btn-warning"
                              onClick={() => {
                                setEditingEquipment(e);
                                setEquipmentModal(true);
                              }}
                            >
                              <FiEdit />
                            </button>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() => deleteEquipment(e.id)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {equipment.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          No equipment added
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-2 border-t border-gray-200">
                <p className="font-semibold">
                  Total: {formatCurrency(totalEquipmentCost)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Gross Profit Items */}
        <div
          className={`card shadow h-fit ${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          }`}
        >
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Product Gross Profits</h3>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setBulkProductGrossModal(true)}
                >
                  <FiPackage className="mr-1" /> Bulk Edit
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-100 min-h-80 overflow-y-auto">
                <table className="table table-sm w-full">
                  <thead
                    className={`${
                      theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-slate-700"
                    }`}
                  >
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Gross Profit</th>
                      <th>Margin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productGrossProfits.map((product) => (
                      <tr key={product.product_id}>
                        <td>
                          <div>
                            <div className="font-medium">
                              {product.product_name}
                            </div>
                          </div>
                        </td>
                        <td>{formatCurrency(product.product_price || 0)}</td>
                        <td>{formatCurrency(product.gross_profit || 0)}</td>
                        <td>
                          {product.product_price > 0
                            ? `${(
                                (product.gross_profit / product.product_price) *
                                100
                              ).toFixed(1)}%`
                            : "0%"}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-xs btn-warning"
                              onClick={() => {
                                setEditingProductGross(product);
                                setProductGrossModal(true);
                              }}
                            >
                              <FiEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {productGrossProfits.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No product gross profits configured
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-200">
              <p className="font-semibold">
                Total Gross Profit from Sales:{" "}
                {formatCurrency(totalGrossProfit)}
              </p>
              <p className="text-sm text-gray-500">
                Calculated automatically from product sales
              </p>
            </div>
          </div>
        </div>

        {/* Packaging Costs */}
        <div
          className={`card shadow ${
            theme === "dark"
              ? "black-card text-color-black"
              : "light-card text-slate-700"
          }`}
        >
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Packaging Costs</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(packagingCosts).map(([category, costs]) => (
                <div
                  key={category}
                  className={`border rounded-lg p-3 ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{category}</h4>
                    <button
                      className="btn btn-xs btn-ghost"
                      onClick={() => {
                        setEditingCategory(category);
                        setPackagingModal(true);
                      }}
                    >
                      <FiEdit />
                    </button>
                  </div>
                  <div className="space-y-1 text-sm">
                    {Object.entries(costs).map(([item, cost]) => (
                      <div key={item} className="flex justify-between">
                        <span className="capitalize">{item}:</span>
                        <span>{formatCurrency(parseFloat(cost) || 0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="font-medium text-right">
                      Total:{" "}
                      {formatCurrency(
                        Object.values(costs).reduce(
                          (sum, cost) => sum + (parseFloat(cost) || 0),
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2 border-t border-gray-200">
              <p className="font-semibold">
                Overall Total: {formatCurrency(totalPackagingCost)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EquipmentModal
        isOpen={equipmentModal}
        onClose={() => {
          setEquipmentModal(false);
          setEditingEquipment(null);
        }}
        onSave={saveEquipment}
        editing={editingEquipment}
        theme={theme}
      />

      <ProductGrossProfitModal
        isOpen={productGrossModal}
        onClose={() => {
          setProductGrossModal(false);
          setEditingProductGross(null);
        }}
        onSave={saveProductGrossProfit}
        editing={editingProductGross}
        theme={theme}
      />

      <BulkProductGrossProfitModal
        isOpen={bulkProductGrossModal}
        onClose={() => {
          setBulkProductGrossModal(false);
        }}
        onSave={saveBulkProductGrossProfit}
        products={productGrossProfits}
        theme={theme}
      />

      <PackagingModal
        isOpen={packagingModal}
        onClose={() => {
          setPackagingModal(false);
          setEditingCategory(null);
        }}
        onSave={savePackaging}
        category={editingCategory}
        costs={packagingCosts[editingCategory]}
      />
    </div>
  );
}
