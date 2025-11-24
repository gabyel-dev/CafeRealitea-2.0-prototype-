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
  FiTrendingUp,
  FiInfo,
  FiLayers,
  FiPercent,
  FiShoppingBag,
} from "react-icons/fi";
import { useTheme } from "../../Main/ThemeContext";
import { useProductDetailContext } from "../../Main/ProductDetailContext";
import ProductUpdate from "./product_update";

export default function ProductDetail({ setActiveTab, activeTab }) {
  const { productID } = useProductDetailContext();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const { theme } = useTheme();
  const [open, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [updatedPrice, setUpdatedPrice] = useState(null);

  const handlePriceUpdate = (productId, newPrice) => {
    if (productId === productID) {
      setUpdatedPrice(newPrice);
    }
  };

  const getDisplayPrice = () => {
    return updatedPrice !== null ? updatedPrice : product?.price;
  };

  useEffect(() => {
    setUpdatedPrice(null);
  }, [productID]);

  function generateProductCode(productId, categoryName) {
    const prefix = categoryName?.slice(0, 3).toUpperCase();
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
      const res = await axios.get(
        `https://caferealitea.onrender.com/products/${productID}`
      );
      setSelectedProduct(res.data);
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
        color: "bg-emerald-500/10 text-emerald-700 border border-emerald-200",
        icon: FiCheckCircle,
        text: "Active",
      },
      inactive: {
        color: "bg-rose-500/10 text-rose-700 border border-rose-200",
        icon: FiAlertCircle,
        text: "Inactive",
      },
      low_stock: {
        color: "bg-amber-500/10 text-amber-700 border border-amber-200",
        icon: FiAlertCircle,
        text: "Low Stock",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${config.color}`}
      >
        <IconComponent className="mr-1.5" size={14} />
        {config.text}
      </span>
    );
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

  // Loading Skeleton
  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-0 md:px-3">
          {/* Header Skeleton */}
          <div className="flex items-center space-x-4 mb-8">
            <div
              className={`w-10 h-10 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-white"
              }`}
            ></div>
            <div>
              <div
                className={`h-7 w-48 rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                } mb-2`}
              ></div>
              <div
                className={`h-4 w-32 rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                }`}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`rounded-xl p-6 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div
                    className={`h-6 w-40 rounded mb-6 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j}>
                        <div
                          className={`h-4 w-24 rounded mb-2 ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        ></div>
                        <div
                          className={`h-6 w-32 rounded ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`rounded-xl p-6 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div
                    className={`h-6 w-32 rounded mb-6 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="space-y-4">
                    {[1, 2].map((j) => (
                      <div
                        key={j}
                        className="flex justify-between items-center"
                      >
                        <div
                          className={`h-4 w-20 rounded ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        ></div>
                        <div
                          className={`h-6 w-16 rounded ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        } py-3`}
      >
        <div className="text-center max-w-md mx-auto p-8 ">
          <div className="bg-rose-500/10 text-rose-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Unable to Load Product
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {error}. Please check your connection and try again.
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={fetchProductDetails}
              className="btn btn-primary px-6 py-2.5"
            >
              Retry
            </button>
            <button
              onClick={() => setActiveTab("Products")}
              className="btn btn-outline px-6 py-2.5"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        } py-3`}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-amber-500/10 text-amber-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FiPackage size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Product Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            The product you're looking for doesn't exist or may have been
            removed from our inventory.
          </p>
          <button
            onClick={() => setActiveTab("Products")}
            className="btn btn-primary px-6 py-2.5"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
      } py-3`}
    >
      <div className="max-w-7xl mx-auto px-0 md:px-3">
        {selectedProduct && open && (
          <ProductUpdate
            product_id={selectedProduct.product_id}
            product_name={selectedProduct.product_name}
            setVisible={setEditOpen}
            onPriceUpdate={handlePriceUpdate}
            theme={theme}
          />
        )}
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-4 w-full">
              <button
                onClick={() => setActiveTab("Products")}
                className={`mt-1 p-2.5 rounded-xl transition-all duration-200 ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white shadow-sm"
                }`}
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-2 ">
                  <h1
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <span className="mr-3">{product?.product_name}</span>
                    {getStatusBadge(product?.product_status)}
                  </h1>
                </div>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Product ID:{" "}
                  {generateProductCode(
                    product?.category_id,
                    product?.category_name
                  )}{" "}
                  • Last updated: Recently
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Product Overview Card */}
            <div
              className={`rounded-2xl p-6 shadow-sm border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Image */}
                <div className="lg:w-1/3">
                  <div
                    className={`rounded-xl border-2 p-4 ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    {product?.image_url ? (
                      <img
                        src={product?.image_url}
                        alt={product?.product_name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <div
                        className={`w-full h-64 rounded-lg flex flex-col items-center justify-center ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <FiPackage
                          className={`${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          } mb-3`}
                          size={48}
                        />
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          No image available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="lg:w-2/3">
                  <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <FiPackage
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }
                    />
                    <span>Product Overview</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Category
                      </label>
                      <div className="flex items-center space-x-2 p-2">
                        <FiTag className="text-gray-500" size={16} />
                        <span className="font-medium">
                          {product?.category_name}
                        </span>
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
                        className={`px-3 py-1.5 rounded-lg text-sm font-mono ${
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
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Description
                      </label>
                      <p
                        className={`text-sm leading-relaxed p-3 rounded-lg ${
                          theme === "dark"
                            ? "text-gray-300 bg-gray-700"
                            : "text-gray-600 bg-gray-50"
                        }`}
                      >
                        {product?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Selling Price */}
              <div
                className={`rounded-2xl p-5 shadow-sm border ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FiDollarSign className="text-blue-600" size={20} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Selling Price
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-1`}
                >
                  {formatCurrency(getDisplayPrice())}
                </p>
                <p className="text-xs text-gray-500">Current market price</p>
              </div>

              {/* Cost Price */}
              <div
                className={`rounded-2xl p-5 shadow-sm border ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <FiShoppingCart className="text-emerald-600" size={20} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Cost Price
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-1`}
                >
                  {formatCurrency(
                    Number(product?.packaging_cost) +
                      Number(product?.gross_profit)
                  )}
                </p>
                <p className="text-xs text-gray-500">Production cost</p>
              </div>

              {/* Profit Margin */}
              <div
                className={`rounded-2xl p-5 shadow-sm border ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <FiTrendingUp className="text-indigo-600" size={20} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Profit Margin
                  </span>
                </div>
                <p className={`text-2xl font-bold text-indigo-600 mb-1`}>
                  {product.profit_margin_percentage?.substring(0, 5)}%
                </p>
                <p className="text-xs text-gray-500">Net profit percentage</p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Sales Performance */}
            <div
              className={`rounded-2xl p-6 shadow-sm border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                <FiBarChart2
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                />
                <span>Sales Analytics</span>
              </h3>

              <div className="space-y-4">
                <div
                  className={`flex justify-between items-center py-3 border-b ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FiShoppingBag className="text-gray-500" size={16} />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Units Sold
                    </span>
                  </div>
                  <span className="font-semibold text-lg">
                    {product?.total_quantity || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="text-gray-500" size={16} />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Revenue
                    </span>
                  </div>
                  <span className="font-semibold text-lg text-green-600">
                    {formatCurrency(product?.total_sales || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {["System Administrator", "Admin"].includes(role) && (
              <div
                className={`rounded-2xl p-6 shadow-sm border ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setEditOpen(true);
                      setSelectedProduct(selectedProduct);
                    }}
                    className="w-full btn btn-outline flex items-center space-x-2 justify-center py-2.5"
                  >
                    <FiEdit size={18} />
                    <span>Edit Product</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full btn btn-error flex items-center space-x-2 justify-center py-2.5"
                  >
                    <FiTrash2 size={18} />
                    <span>Delete Product</span>
                  </button>
                </div>
              </div>
            )}

            {/* Product Status */}
            <div
              className={`rounded-2xl p-6 shadow-sm border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">Product Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Status
                  </span>
                  {getStatusBadge(product?.product_status)}
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Visibility
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    Public
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
