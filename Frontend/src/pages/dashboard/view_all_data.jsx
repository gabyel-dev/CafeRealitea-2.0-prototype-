import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2, FiDollarSign } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { IoIosArrowForward } from "react-icons/io";
import { useTheme } from "../../Main/ThemeContext";

// ----------------- Equipment Modal -----------------
function EquipmentModal({ isOpen, onClose, onSave, editing, theme }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

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
      <div className={`modal-box ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h3 className="font-bold text-lg mb-4">
          {editing ? "Edit Equipment" : "Add Equipment"}
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ name, price: parseFloat(price) || 0 });
        }}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className={`input ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "input-bordered text-white"}`}
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
              className={`input ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "input-bordered text-white"}`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="modal-action">
            <button type="button" className={`btn ${theme === "dark" ? "btn-ghost text-white" : "btn-ghost"}`} onClick={onClose}>
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

// ----------------- Gross Profit Modal -----------------
function GrossProfitModal({ isOpen, onClose, onSave, editing, theme }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setAmount(editing.amount);
    } else {
      setName("");
      setAmount("");
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className={`modal-box ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h3 className="font-bold text-lg mb-4">
          {editing ? "Edit Gross Profit" : "Add Gross Profit"}
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({ name, amount: parseFloat(amount) || 0 });
        }}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className={`input ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "input-bordered text-white"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Amount (₱)</span>
            </label>
            <input
              type="number"
              step="0.01"
              className={`input ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "input-bordered text-white"}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="modal-action">
            <button type="button" className={`btn ${theme === "dark" ? "btn-ghost text-white" : "btn-ghost"}`} onClick={onClose}>
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

// ----------------- Packaging Modal -----------------
function PackagingModal({ isOpen, onClose, onSave, category, costs, theme }) {
  const [localCosts, setLocalCosts] = useState({});
  const [savingPackaging, setSavingPackaging] = useState(false);

  useEffect(() => {
    if (costs) setLocalCosts(costs);
  }, [costs, isOpen]);

  if (!isOpen) return null;

  const itemsPerCategory = {
    Milktea: ["Cup", "Straw", "Logo", "Paper"],
    "Coffee Hot": ["Cup", "Lid"],
    "Coffee Cold": ["Cup", "Straw"],
    "Fruit Soda": ["Cup", "Lid"]
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
      <div className={`modal-box ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h3 className="font-bold text-lg mb-4">{category} Packaging Costs</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-6">
            {itemsPerCategory[category]?.map((item) => (
              <div key={item} className="form-control">
                <label className="label">
                  <span className="label-text">{item} Cost (₱)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className={`input ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "input-bordered text-white"}`}
                  value={localCosts[item] || 0}
                  onChange={(e) => handleChange(item, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
          <div className="modal-action">
            <button type="button" className={`btn ${theme === "dark" ? "btn-ghost text-white" : "btn-ghost"}`} onClick={onClose}>
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
      <div className={`custom-tooltip p-3 border rounded shadow-md ${
        theme === "dark" 
          ? "bg-gray-800 border-gray-700 text-white" 
          : "bg-white border-gray-200 text-slate-700"
      }`}>
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

// ----------------- Main Component -----------------
export default function ViewAllData({ setActiveTab, activeTab, onDataUpdate }) {
  const [timeRange, setTimeRange] = useState("monthly");
  const [salesData, setSalesData] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [grossProfit, setGrossProfit] = useState([]);
  const [packagingCosts, setPackagingCosts] = useState({
    Milktea: { Cup: 5, Straw: 2, Logo: 1, Paper: 0.5 },
    "Coffee Hot": { Cup: 6, Lid: 1.5 },
    "Coffee Cold": { Cup: 7, Straw: 2 },
    "Fruit Soda": { Cup: 5, Lid: 2 }
  });
  const [netProfit, setNetProfit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [equipmentModal, setEquipmentModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const [grossModal, setGrossModal] = useState(false);
  const [editingGross, setEditingGross] = useState(null);

  const [packagingModal, setPackagingModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { theme } = useTheme();

  const api = import.meta.env.VITE_SERVER_API_NAME;

  // Fetch sales data
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = `${api}/summaries/${timeRange}`;
        const res = await axios.get(endpoint);
        setSalesData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError("Failed to load sales data");
        setSalesData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [timeRange]);

  // Fetch equipment costs (filtered)
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await axios.get(`${api}/equipment/${timeRange}`);
        const equipmentData = Array.isArray(res.data)
          ? res.data.map((item) => ({
              ...item,
              price: parseFloat(item.price) || 0
            }))
          : [];
        setEquipment(equipmentData);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setEquipment([]);
      }
    };
    fetchEquipment();
  }, [timeRange]);

  // Fetch gross profit (filtered)
  useEffect(() => {
    const fetchGrossProfit = async () => {
      try {
        const res = await axios.get(`${api}/gross-profit/${timeRange}`);
        const grossProfitData = Array.isArray(res.data)
          ? res.data.map((item) => ({
              ...item,
              amount: parseFloat(item.amount) || 0
            }))
          : [];
        setGrossProfit(grossProfitData);
      } catch (err) {
        console.error("Error fetching gross profit:", err);
        setGrossProfit([]);
      }
    };
    fetchGrossProfit();
  }, [timeRange]);

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
      
      return salesData.map((sale) => {
        // Filter equipment costs by date if needed
        const totalEquipment = equipment.reduce(
          (sum, e) => sum + (parseFloat(e.price) || 0),
          0
        );

        // Filter gross profit by the same time period as the sale
        let periodGrossProfit = 0;
        
        if (timeRange === "daily") {
          const saleDateStr = sale.day;
          
          periodGrossProfit = grossProfit
            .filter(g => {
              const gDate = new Date(g.created_at || g.updated_at);
              const gDateStr = gDate.toISOString().split('T')[0];
              return gDateStr === saleDateStr;
            })
            .reduce((sum, g) => sum + (parseFloat(g.amount) || 0), 0);
        }
        else if (timeRange === "monthly") {
          const saleDate = new Date(sale.year, sale.month - 1);
          periodGrossProfit = grossProfit
            .filter(g => {
              const gDate = new Date(g.created_at || g.updated_at);
              return gDate.getFullYear() === saleDate.getFullYear() && 
                     gDate.getMonth() === saleDate.getMonth();
            })
            .reduce((sum, g) => sum + (parseFloat(g.amount) || 0), 0);
        }
        else if (timeRange === "yearly") {
          periodGrossProfit = grossProfit
            .filter(g => new Date(g.created_at || g.updated_at).getFullYear() === sale.year)
            .reduce((sum, g) => sum + (parseFloat(g.amount) || 0), 0);
        }

        return {
          ...sale,
          gross_profit: periodGrossProfit,
          net_profit: (sale.revenue || 0) - totalEquipment - periodGrossProfit - (sale.packaging_cost || 0)
        };
      });
    };

    setNetProfit(calculateNetProfit());
  }, [salesData, equipment, grossProfit, timeRange]);

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
          { ...res.data, price: parseFloat(res.data.price) || 0 }
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

  const saveGross = async (item) => {
    try {
      if (editingGross) {
        const res = await axios.put(
          `${api}/gross-profit/${editingGross.id}`,
          item
        );
        setGrossProfit(
          grossProfit.map((g) =>
            g.id === editingGross.id
              ? { ...res.data, amount: parseFloat(res.data.amount) || 0 }
              : g
          )
        );
      } else {
        const res = await axios.post(`${api}/gross-profit`, item);
        setGrossProfit([
          ...grossProfit,
          { ...res.data, amount: parseFloat(res.data.amount) || 0 }
        ]);
      }
      setGrossModal(false);
      setEditingGross(null);
    } catch (err) {
      console.error("Error saving gross profit:", err);
    }
  };

  const savePackaging = async (category, costs) => {
    try {
      const res = await axios.post(`${api}/packaging-costs/update`, {
        category: category,
        costs: costs
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

  const deleteGrossProfit = async (id) => {
    try {
      await axios.delete(`${api}/gross-profit/${id}`);
      setGrossProfit(grossProfit.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Error deleting gross profit:", err);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
    }).format(amount || 0);
  };

  // Calculate totals with time-range filtering
  const totalEquipmentCost = useMemo(() => {
    return equipment.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0),
      0
    );
  }, [equipment]);

  const totalGrossProfit = useMemo(() => {
    if (timeRange === "daily") {
      const salesDates = salesData.map(sale => sale.day);
      return grossProfit
        .filter(g => {
          const gDate = new Date(g.created_at || g.updated_at);
          const gDateStr = gDate.toISOString().split('T')[0];
          return salesDates.includes(gDateStr);
        })
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    }
    else if (timeRange === "monthly") {
      const salesMonths = salesData.map(sale => `${sale.year}-${sale.month}`);
      return grossProfit
        .filter(g => {
          const gDate = new Date(g.created_at || g.updated_at);
          const gMonth = `${gDate.getFullYear()}-${gDate.getMonth() + 1}`;
          return salesMonths.includes(gMonth);
        })
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    }
    else if (timeRange === "yearly") {
      const salesYears = salesData.map(sale => sale.year);
      return grossProfit
        .filter(g => {
          const gYear = new Date(g.created_at || g.updated_at).getFullYear();
          return salesYears.includes(gYear);
        })
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    }
    
    return grossProfit.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
  }, [grossProfit, timeRange, salesData]);

  const totalPackagingCost = useMemo(() => {
    return salesData.reduce(
      (sum, sale) => sum + (parseFloat(sale.packaging_cost) || 0),
      0
    );
  }, [salesData]);

  const totalSales = useMemo(() => {
    return salesData.reduce(
      (sum, sale) => sum + (parseFloat(sale.revenue) || 0),
      0
    );
  }, [salesData]);

  const totalNetProfit = useMemo(() => {
    return totalSales - totalEquipmentCost - totalGrossProfit - totalPackagingCost;
  }, [totalSales, totalEquipmentCost, totalGrossProfit, totalPackagingCost]);

  // Prepare data for Recharts chart
  const chartData = netProfit.map((item) => ({
    name:
      timeRange === "daily"
        ? `Day ${item.day}`
        : timeRange === "monthly"
        ? `Month ${item.month}`
        : `Year ${item.year}`,
    revenue: parseFloat(item.revenue) || 0,
    packaging_cost: parseFloat(item.packaging_cost) || 0,
    gross_profit: parseFloat(item.gross_profit) || 0,
    net_profit: parseFloat(item.net_profit) || 0
  }));

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
  }, [totalSales, totalNetProfit, totalEquipmentCost, totalGrossProfit, totalPackagingCost, onDataUpdate]);

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
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <h1 className={`text-lg lg:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-700"}`}>Dashboard Overview</h1>
            </div>
            <div className={`mx-2 translate-y-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              <IoIosArrowForward />
            </div>
            <h2 className="text-xs lg:text-lg font-medium translate-y-0.5 text-blue-600">Financial Overview</h2>
          </div>
          
          <div className="flex items-center mt-0">
            <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Administrator view of all financial metrics</p>
          </div>
        </div>

        <select 
          className={`select select-sm text-white mt-4 md:mt-0 ${
            theme === "dark" 
              ? "bg-gray-700 text-white border-gray-600" 
              : "select-bordered"
          }`} 
          value={timeRange} 
          onChange={e => setTimeRange(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Sales", value: totalSales, icon: <FiDollarSign className="text-blue-600" />, bg: "blue" },
          { title: "Net Profit", value: totalNetProfit, icon: <FiDollarSign className="text-green-600" />, bg: "green" },
          { title: "Total Costs", value: totalEquipmentCost + totalGrossProfit + totalPackagingCost, icon: <FiDollarSign className="text-red-600" />, bg: "red" },
          { title: "Profit Margin", value: totalSales > 0 ? ((totalNetProfit / totalSales) * 100).toFixed(1) + '%' : '0%', icon: <FiDollarSign className="text-purple-600" />, bg: "purple" }
        ].map((card, index) => (
          <div key={index} className={`card shadow ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-slate-700"
          }`}>
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{card.title}</h3>
                  <p className="text-xl font-bold mt-1">
                    {card.title === "Profit Margin" ? card.value : formatCurrency(card.value)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${theme === "dark" ? `bg-${card.bg}-900` : `bg-${card.bg}-100`}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className={`card shadow mb-6 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-slate-700"
      }`}>
        <div className="card-body px-0 py-4">
          <h3 className="card-title text-lg mb-4 px-4">Financial Overview</h3>
          <div className="h-80 min-h-[320px] min-w-[300px] relative">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" className="outline-none">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#4B5563" : "#E5E7EB"} />
                  <XAxis dataKey="name" stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"} />
                  <YAxis 
                    tickFormatter={(value) => `₱${value.toLocaleString()}`}
                    stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                  <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} theme={theme} />} />
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
                  <div className="loading loading-spinner text-primary mb-2"></div>
                  <p className="text-sm">Loading chart data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cost Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Equipment Costs */}
        <div className={`card shadow h-fit ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-slate-700"
        }`}>
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
              <table className="table table-sm w-full">
                <thead >
                  <tr className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-slate-700"}`}>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map(e => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{formatCurrency(parseFloat(e.price) || 0)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-xs btn-warning"
                            onClick={() => { setEditingEquipment(e); setEquipmentModal(true); }}
                          >
                            <FiEdit/>
                          </button>
                          <button 
                            className="btn btn-xs btn-error"
                            onClick={() => deleteEquipment(e.id)}
                          >
                            <FiTrash2/>
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
              <p className="font-semibold">Total: {formatCurrency(totalEquipmentCost)}</p>
            </div>
          </div>
        </div>

        {/* Gross Profit Items */}
        <div className={`card shadow h-fit ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-slate-700"
        }`}>
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Gross Profit Items</h3>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => setGrossModal(true)}
              >
                <FiPlus className="mr-1" /> Add
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-slate-700"}`}>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grossProfit.map(g => (
                    <tr key={g.id}>
                      <td>{g.name}</td>
                      <td>{formatCurrency(parseFloat(g.amount) || 0)}</td>
                      <td>{new Date(g.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-xs btn-warning"
                            onClick={() => { setEditingGross(g); setGrossModal(true); }}
                          >
                            <FiEdit/>
                          </button>
                          <button 
                            className="btn btn-xs btn-error"
                            onClick={() => deleteGrossProfit(g.id)}
                          >
                            <FiTrash2/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {grossProfit.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No gross profit items for selected period
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-2 border-t border-gray-200">
              <p className="font-semibold">Total: {formatCurrency(totalGrossProfit)}</p>
              <p className="text-sm">
                Filtered by: {timeRange === "daily" ? "daily" : timeRange === "monthly" ? "This Month" : "This Year"}
              </p>
            </div>
          </div>
        </div>

        {/* Packaging Costs */}
        <div className={`card shadow ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-slate-700"
        }`}>
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Packaging Costs</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(packagingCosts).map(([category, costs]) => (
                <div key={category} className={`border rounded-lg p-3 ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}>
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
                      Total: {formatCurrency(Object.values(costs).reduce((sum, cost) => sum + (parseFloat(cost) || 0), 0))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-2 border-t border-gray-200">
              <p className="font-semibold">Overall Total: {formatCurrency(totalPackagingCost)}</p>
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

      <GrossProfitModal
        isOpen={grossModal}
        onClose={() => {
          setGrossModal(false);
          setEditingGross(null);
        }}
        onSave={saveGross}
        editing={editingGross}
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