import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiBox,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiShoppingCart,
  FiBarChart2,
} from "react-icons/fi";
import { useTheme } from "../../Main/ThemeContext";
import { useProductDetailContext } from "../../Main/ProductDetailContext";

export default function ProductDetail({ setActiveTab, activeTab }) {
  const { productID } = useProductDetailContext();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const { theme } = useTheme();

  function generateProductCode(productId, categoryName) {
    const prefix = categoryName?.slice(0, 3).toUpperCase();
    // Make a simple numeric part based on productId + random
    const randomPart = Math.floor(1000 + ((productId * 7) % 9000));
    return `${prefix}-${randomPart}`;
  }

  useEffect(() => {
    document.title = product
      ? `Café Realitea - ${product?.name}`
      : "Café Realitea - Product Details";
    checkAuthentication();
    fetchProductDetails();
  }, [productID]);

  const checkAuthentication = async () => {
    try {
      const userRes = await axios.get(
        "https://caferealitea.onrender.com/user",
        { withCredentials: true }
      );

      if (!userRes.data.logged_in || userRes.data.role === "") {
        navigate("/");
        return;
      }
      setRole(userRes.data.role);
    } catch (err) {
      console.error("Authentication check failed:", err);
      navigate("/");
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    setError("");
    try {
      // Replace with your actual API endpoint
      const res = await axios.get(
        `https://caferealitea.onrender.com/products/${productID}`
      );
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800",
        icon: FiCheckCircle,
        text: "Active",
      },
      inactive: {
        color: "bg-red-100 text-red-800",
        icon: FiAlertCircle,
        text: "Inactive",
      },
      low_stock: {
        color: "bg-yellow-100 text-yellow-800",
        icon: FiAlertCircle,
        text: "Low Stock",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <IconComponent className="mr-1" size={14} />
        {config.text}
      </span>
    );
  };

  const handleEdit = () => {
    setSelectedProductId(productID);
    setActiveTab("Edit Product");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(
        `https://caferealitea.onrender.com/products/${productID}`
      );
      navigate("/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        <div className="text-center">
          <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {error}
          </h3>
          <button
            onClick={() => setActiveTab("Products")}
            className="btn btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        }`}
      >
        <div className="text-center">
          <FiAlertCircle className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Product not found
          </h3>
          <button
            onClick={() => setActiveTab("Products")}
            className="btn btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`lg:pt-4 lg:py-4 lg:px-4 min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
      }`}
    >
      {/* Header */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <button
                onClick={() => setActiveTab("Products")}
                className={`mr-3 p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                }`}
              >
                <FiArrowLeft size={20} />
              </button>
              <h1
                className={` ${
                  theme === "dark" ? "text-white" : "text-slate-700"
                }`}
              >
                <span className="text-2xl font-bold">
                  {product?.product_name}
                </span>
              </h1>
              <div className="ml-4">{getStatusBadge(product?.status)}</div>
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } ml-12`}
            >
              Product details and information
            </p>
          </div>

          {/* Action Buttons */}
          {["System Administrator", "Admin"].includes(role) && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="btn btn-primary flex items-center"
              >
                <FiEdit className="mr-2" />
                Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error flex items-center"
              >
                <FiTrash2 className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div
            className={`rounded-xl border shadow-md p-6 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-slate-700"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiPackage
                className={`mr-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Product Name
                </label>
                <p className="text-lg font-semibold">{product?.product_name}</p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Category
                </label>
                <div className="flex items-center">
                  <FiTag className="mr-2 text-gray-400" size={16} />
                  <span>{product?.category_name}</span>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Product Code
                </label>
                <code
                  className={`px-2 py-1 rounded text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {generateProductCode(
                    product?.category_id,
                    product?.category_name
                  )}
                </code>
              </div>
            </div>

            {product?.description && (
              <div className="mt-4">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Description
                </label>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {product?.description}
                </p>
              </div>
            )}
          </div>

          {/* Pricing & Inventory Card */}
          <div
            className={`rounded-xl border shadow-md p-6 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-slate-700"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiDollarSign
                className={`mr-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Card */}
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
                }`}
              >
                <div className="flex items-center mb-2">
                  <FiDollarSign className="text-blue-600 mr-2" />
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Selling Price
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {formatCurrency(product?.price)}
                </p>
              </div>

              {/* Cost Card */}
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-green-900/20" : "bg-green-50"
                }`}
              >
                <div className="flex items-center mb-2">
                  <FiShoppingCart className="text-green-600 mr-2" />
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Cost Price
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {formatCurrency(
                    Number(product?.packaging_cost) +
                      Number(product?.gross_profit)
                  )}
                </p>
              </div>
            </div>

            {/* Additional Pricing Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Profit Margin
                </label>
                <p className="text-lg font-semibold text-green-600">
                  {product.profit_margin_percentage?.substring(0, 5)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div
            className={`rounded-xl border shadow-md p-6 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-slate-700"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiBarChart2
                className={`mr-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              Sales Performance
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Sold
                </span>
                <span className="font-semibold">
                  {product?.total_quantity || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Revenue
                </span>
                <span className="font-semibold">
                  {formatCurrency(product?.total_sales || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Product Image Card */}
          <div
            className={`rounded-xl border shadow-md p-6 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-slate-700"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Product Image</h2>

            <div className="flex justify-center">
              {product?.image_url ? (
                <img
                  src={product?.image_url}
                  alt={product?.name}
                  className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div
                  className={`w-48 h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-400"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <FiPackage size={48} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
