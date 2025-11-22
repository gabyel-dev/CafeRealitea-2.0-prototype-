import { useState, useEffect, useRef } from "react";
import {
  FiPackage,
  FiAlertTriangle,
  FiFilter,
  FiRefreshCw,
  FiEdit,
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiBox,
  FiShoppingCart,
  FiArchive,
  FiEye,
  FiEyeOff,
  FiShoppingBag,
  FiCoffee,
  FiSave,
  FiX,
  FiMinus,
  FiCheckCircle,
} from "react-icons/fi";

// Sample initial inventory data focused on café ingredients
const initialInventory = [
  {
    id: 1,
    name: "Coffee Beans",
    category: "Coffee",
    currentStock: 20, // 20% remaining
    unit: "kg",
    status: "low",
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    name: "Fresh Milk",
    category: "Dairy",
    currentStock: 80, // 80% remaining
    unit: "liters",
    status: "adequate",
    lastUpdated: "2024-01-18",
  },
  {
    id: 3,
    name: "Sugar",
    category: "Sweeteners",
    currentStock: 0, // 0% remaining
    unit: "kg",
    status: "out",
    lastUpdated: "2024-01-20",
  },
  {
    id: 4,
    name: "Paper Cups",
    category: "Packaging",
    currentStock: 45, // 45% remaining
    unit: "pcs",
    status: "adequate",
    lastUpdated: "2024-01-17",
  },
  {
    id: 5,
    name: "Vanilla Syrup",
    category: "Flavorings",
    currentStock: 15, // 15% remaining
    unit: "bottles",
    status: "low",
    lastUpdated: "2024-01-19",
  },
  {
    id: 6,
    name: "Chocolate Powder",
    category: "Flavorings",
    currentStock: 60, // 60% remaining
    unit: "kg",
    status: "adequate",
    lastUpdated: "2024-01-16",
  },
  {
    id: 7,
    name: "Green Tea Powder",
    category: "Tea",
    currentStock: 30, // 30% remaining
    unit: "kg",
    status: "low",
    lastUpdated: "2024-01-21",
  },
  {
    id: 8,
    name: "Ice Cubes",
    category: "Essentials",
    currentStock: 90, // 90% remaining
    unit: "kg",
    status: "adequate",
    lastUpdated: "2024-01-22",
  },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Coffee",
    currentStock: 100,
    unit: "kg",
  });

  const ITEMS_PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  // Categories for dropdown
  const categories = [
    "Coffee",
    "Tea",
    "Dairy",
    "Sweeteners",
    "Flavorings",
    "Packaging",
    "Essentials",
    "Other",
  ];

  useEffect(() => {
    document.title = "Café Realitea - Inventory";
    // Load inventory from localStorage or use initial data
    const savedInventory = localStorage.getItem("cafeInventory");
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      setInventory(initialInventory);
    }
  }, []);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    if (inventory.length > 0) {
      localStorage.setItem("cafeInventory", JSON.stringify(inventory));
    }
  }, [inventory]);

  // Apply filters automatically when any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, categoryFilter, statusFilter, inventory, sortConfig]);

  const applyFilters = () => {
    let result = [...inventory];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredInventory(result);
    setPage(1);
    setDisplayedItems(result.slice(0, ITEMS_PER_PAGE));
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortConfig({ key: "name", direction: "ascending" });
  };

  const getStockStatus = (stockPercentage) => {
    if (stockPercentage === 0) return "out";
    if (stockPercentage <= 20) return "low";
    if (stockPercentage <= 50) return "medium";
    return "adequate";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "adequate":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "adequate":
        return <FiCheckCircle className="inline mr-1" />;
      case "medium":
        return <FiEye className="inline mr-1" />;
      case "low":
        return <FiAlertTriangle className="inline mr-1" />;
      case "out":
        return <FiEyeOff className="inline mr-1" />;
      default:
        return <FiBox className="inline mr-1" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "adequate":
        return "Good Stock";
      case "medium":
        return "Moderate";
      case "low":
        return "Low Stock";
      case "out":
        return "Out of Stock";
      default:
        return "Unknown";
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <FiChevronUp className="ml-1" />
    ) : (
      <FiChevronDown className="ml-1" />
    );
  };

  const getCategoryIcon = (categoryName) => {
    if (categoryName.includes("Coffee"))
      return <FiCoffee className="text-lg" />;
    if (categoryName.includes("Tea"))
      return <FiShoppingBag className="text-lg" />;
    if (categoryName.includes("Dairy"))
      return <FiPackage className="text-lg" />;
    return <FiBox className="text-lg" />;
  };

  // Calculate inventory stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(
    (item) => item.status === "low"
  ).length;
  const outOfStockItems = inventory.filter(
    (item) => item.status === "out"
  ).length;
  const adequateStockItems = inventory.filter(
    (item) => item.status === "adequate"
  ).length;

  // Modal functions
  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "Coffee",
      currentStock: 100,
      unit: "kg",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      unit: item.unit,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const status = getStockStatus(formData.currentStock);

    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now(),
      status: status,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    if (editingItem) {
      // Update existing item
      const updatedInventory = inventory.map((item) =>
        item.id === editingItem.id ? newItem : item
      );
      setInventory(updatedInventory);
    } else {
      // Add new item
      setInventory((prev) => [...prev, newItem]);
    }

    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const quickUpdateStock = (itemId, change) => {
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(
            0,
            Math.min(100, item.currentStock + change)
          );
          const status = getStockStatus(newStock);
          return {
            ...item,
            currentStock: newStock,
            status: status,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return item;
      });
      return updated;
    });
  };

  const setStockPercentage = (itemId, percentage) => {
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(0, Math.min(100, percentage));
          const status = getStockStatus(newStock);
          return {
            ...item,
            currentStock: newStock,
            status: status,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return item;
      });
      return updated;
    });
  };

  const deleteItem = (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setInventory((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Lazy load more items when sentinel enters viewport
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [displayedItems, filteredInventory]);

  const loadMore = () => {
    const start = page * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const more = filteredInventory.slice(start, end);
    if (more.length > 0) {
      setDisplayedItems((prev) => [...prev, ...more]);
      setPage((prev) => prev + 1);
    }
  };

  const getStockLevelColor = (percentage) => {
    if (percentage === 0) return "bg-red-500";
    if (percentage <= 20) return "bg-yellow-500";
    if (percentage <= 50) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="lg:pt-4 lg:py-4 lg:px-4 bg-indigo-50 min-h-screen">
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-700">
                  {editingItem ? "Update Stock Level" : "Add New Ingredient"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ingredient Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
                    placeholder="Enter ingredient name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
                    >
                      <option value="kg">Kilograms</option>
                      <option value="g">Grams</option>
                      <option value="liters">Liters</option>
                      <option value="ml">Milliliters</option>
                      <option value="bottles">Bottles</option>
                      <option value="pcs">Pieces</option>
                      <option value="boxes">Boxes</option>
                      <option value="packs">Packs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stock Level: {formData.currentStock}%
                  </label>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      name="currentStock"
                      value={formData.currentStock}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="5"
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        getStockStatus(formData.currentStock)
                      )} px-2 py-1 rounded`}
                    >
                      {getStatusText(getStockStatus(formData.currentStock))}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <FiSave className="mr-2" />
                    {editingItem ? "Update" : "Add"} Ingredient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-700">
            Ingredient Status
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and update ingredient stock levels
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn btn-primary md:block items-center hidden"
        >
          <div className="flex items-center">
            <FiPlus className="mr-2" />
            Add Ingredient
          </div>
        </button>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <FiPackage className="text-xl text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">
                Total Ingredients
              </p>
              <h3 className="text-xl font-bold text-slate-800">{totalItems}</h3>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">All ingredients</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <FiCheckCircle className="text-xl text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Good Stock</p>
              <h3 className="text-xl font-bold text-slate-800">
                {adequateStockItems}
              </h3>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">Above 50%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-50">
              <FiAlertTriangle className="text-xl text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Low Stock</p>
              <h3 className="text-xl font-bold text-slate-800">
                {lowStockItems}
              </h3>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">Below 20%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50">
              <FiArchive className="text-xl text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Out of Stock</p>
              <h3 className="text-xl font-bold text-slate-800">
                {outOfStockItems}
              </h3>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">0% remaining</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center">
            <FiFilter className="mr-2 text-slate-500" />
            Filters & Search
          </h2>

          <div className="relative mt-3 md:mt-0 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ingredients..."
              className="pl-10 pr-4 py-2 w-full text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-slate-700 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Stock Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-slate-700 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="adequate">Good Stock</option>
              <option value="medium">Moderate</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-600">
            Showing {displayedItems.length} of {filteredInventory.length}{" "}
            ingredients
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
          >
            <FiRefreshCw className="mr-2" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Inventory List */}
      {displayedItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-slate-200">
          <FiPackage className="text-4xl text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            No ingredients found
          </h3>
          <p className="text-slate-500 mb-4">
            {inventory.length === 0
              ? "Get started by adding your first ingredient!"
              : "Try adjusting your filters."}
          </p>
          {inventory.length === 0 && (
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Your First Ingredient
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Ingredient
                      {getSortIndicator("name")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {getSortIndicator("category")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("currentStock")}
                  >
                    <div className="flex items-center">
                      Stock Level
                      {getSortIndicator("currentStock")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quick Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {displayedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {item.unit} • Updated:{" "}
                            {new Date(item.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700">
                              {item.currentStock}%
                            </span>
                            <span className="text-slate-500">
                              {getStatusText(item.status)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getStockLevelColor(
                                item.currentStock
                              )}`}
                              style={{ width: `${item.currentStock}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors flex items-center"
                        >
                          <FiEdit className="mr-1" />
                          Update
                        </button>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => quickUpdateStock(item.id, -10)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            disabled={item.currentStock <= 0}
                          >
                            <FiMinus size={14} />
                          </button>
                          <button
                            onClick={() => quickUpdateStock(item.id, 10)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            disabled={item.currentStock >= 100}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div ref={loadMoreRef} className="h-4"></div>
            {displayedItems.length < filteredInventory.length && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Add Button */}
      <button
        onClick={openAddModal}
        className="btn btn-neutral fixed bottom-6 right-6 rounded-full p-4 shadow-lg md:hidden z-10"
      >
        <FiPlus className="text-xl" />
      </button>
    </div>
  );
}
