import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiShoppingCart,
  FiTag,
  FiBox,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiEdit,
  FiCoffee,
  FiShoppingBag,
} from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import ProductUpdate from "./product_update";
import { useTheme } from "../../Main/ThemeContext";
import { useProductDetailContext } from "../../Main/ProductDetailContext";

export default function ProductPage({ setActiveTab, activeTab }) {
  const { setProductID } = useProductDetailContext();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "descending",
  });
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { theme } = useTheme();

  const PRODUCTS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://caferealitea.onrender.com/items")
      .then((res) => {
        setCategories(res.data);

        const products = res.data.flatMap((category) =>
          category.items.map((item) => ({
            ...item,
            category: category.category_name,
            category_id: category.category_id,
          }))
        );

        setAllProducts(products);
        setFilteredProducts(products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = "Café Realitea - Products";
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

  // Apply filters automatically when any filter changes
  useEffect(() => {
    applyFilters();
  }, [categoryFilter, searchQuery, allProducts, sortConfig]);

  const applyFilters = () => {
    let result = [...allProducts];

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.price && item.price.toString().includes(query))
      );
    }

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

    setFilteredProducts(result);
    setPage(1);
    setDisplayedProducts(result.slice(0, PRODUCTS_PER_PAGE));
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setCategoryFilter("all");
    setSearchQuery("");
    setSortConfig({ key: null, direction: "descending" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalProducts = filteredProducts.length;
  const uniqueCategories = [
    ...new Set(filteredProducts.map((item) => item.category)),
  ].length;
  const averagePrice =
    totalProducts > 0
      ? filteredProducts.reduce(
          (sum, product) => sum + parseFloat(product.price || 0),
          0
        ) / totalProducts
      : 0;

  const getCategoryIcon = (categoryName) => {
    if (categoryName.includes("Coffee")) return <FiCoffee />;
    if (categoryName.includes("Milktea")) return <FiShoppingBag />;
    return <FiBox />;
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <FiChevronUp className="ml-1" />
    ) : (
      <FiChevronDown className="ml-1" />
    );
  };

  // Lazy load more products when sentinel enters viewport
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
  }, [displayedProducts, filteredProducts]);

  const loadMore = () => {
    const start = page * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const more = filteredProducts.slice(start, end);
    if (more.length > 0) {
      setDisplayedProducts((prev) => [...prev, ...more]);
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      {selectedProduct && visible && (
        <ProductUpdate
          product_id={selectedProduct.id}
          product_name={selectedProduct.product_name}
          setVisible={setVisible}
          theme={theme}
        />
      )}
      <div
        className={`lg:pt-4 lg:py-4 lg:px-4 min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-indigo-50"
        }`}
      >
        <div className="w-full mb-6 flex justify-between items-center">
          <div>
            <h1
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Product Menu
            </h1>
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Browse and manage all products in your menu
            </p>
          </div>
          <button className="btn btn-primary md:block items-center hidden">
            <div className="flex items-center">
              <FiPlus className="mr-2" />
              Add New Product
            </div>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <div
            className={`rounded-xl shadow-md p-5 ${
              theme === "dark"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white text-gray-800"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
                }`}
              >
                <FiBox
                  className={`text-xl ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Products
                </p>
                <h3
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {totalProducts}
                </h3>
              </div>
            </div>
            <div
              className={`mt-3 pt-3 border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {uniqueCategories} categories
              </p>
            </div>
          </div>

          <div
            className={`rounded-xl shadow-md p-5 ${
              theme === "dark"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white text-gray-800"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-purple-900/20" : "bg-purple-50"
                }`}
              >
                <FiShoppingCart
                  className={`text-xl ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Categories
                </p>
                <h3
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {categories.length}
                </h3>
              </div>
            </div>
            <div
              className={`mt-3 pt-3 border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Menu categories
              </p>
            </div>
          </div>

          <div
            className={`rounded-xl shadow-md p-5 ${
              theme === "dark"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white text-gray-800"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-orange-900/20" : "bg-orange-50"
                }`}
              >
                <FiCoffee
                  className={`text-xl ${
                    theme === "dark" ? "text-orange-400" : "text-orange-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Coffee Items
                </p>
                <h3
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {
                    allProducts.filter((p) => p.category.includes("Coffee"))
                      .length
                  }
                </h3>
              </div>
            </div>
            <div
              className={`mt-3 pt-3 border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Hot & Cold coffee
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div
          className={`rounded-xl shadow-md p-5 mb-6 ${
            theme === "dark"
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-white text-gray-800"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
            <h2
              className={`text-lg font-semibold flex items-center ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              <FiFilter
                className={`mr-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              Filters
            </h2>

            <div className="relative mt-3 md:mt-0 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className={`pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                    : "bg-white text-slate-700 border-slate-300 placeholder-gray-500"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Category
              </label>
              <select
                name="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_name}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className={`px-4 py-2 border rounded-lg flex items-center transition-colors ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-slate-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiRefreshCw className="mr-2" />
              Reset All
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Showing {displayedProducts.length} of {allProducts.length} products
          </p>

          <button className="btn btn-sm btn-neutral block items-center md:hidden text-white-600 text-sm">
            <div className="flex items-center gap-2">
              <FiPlus className="translate-y-0 font-semibold" />
              <h1 className="pr-2">Add Product</h1>
            </div>
          </button>
        </div>

        {/* Product List */}
        {loading ? (
          <div
            className={`flex justify-center items-center h-64 rounded-xl shadow-md border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                theme === "dark" ? "border-blue-400" : "border-blue-500"
              }`}
            ></div>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div
            className={`rounded-xl shadow-lg p-8 text-center ${
              theme === "dark"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white text-gray-700"
            }`}
          >
            <FiBox className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or add new products.
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
          <div
            className={`rounded-xl shadow-md overflow-hidden border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
                >
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div
                        className={`flex items-center ${
                          theme === "dark" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Product Name
                        {getSortIndicator("name")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div
                        className={`flex items-center ${
                          theme === "dark" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Category
                        {getSortIndicator("category")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div
                        className={`flex items-center ${
                          theme === "dark" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Price
                        {getSortIndicator("price")}
                      </div>
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === "dark" ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    theme === "dark"
                      ? "divide-gray-700 bg-gray-800"
                      : "divide-gray-200 bg-white"
                  }`}
                >
                  {displayedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-750"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductID(product.id);
                        setActiveTab("Product Detail");
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                              theme === "dark"
                                ? "bg-indigo-900/30"
                                : "bg-indigo-200"
                            }`}
                          >
                            {getCategoryIcon(product.category)}
                          </div>
                          <div className="ml-4">
                            <div
                              className={`text-sm font-medium ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {product.name}
                            </div>
                            <div
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              ID: {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            theme === "dark"
                              ? "bg-blue-900/30 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatCurrency(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              /* setSelectedProduct(product); */
                              /* setVisible(true); */
                              setActiveTab("Product Detail");
                              setProductID(product.id);
                            }}
                            className="text-white bg-indigo-500 px-5 py-1 rounded-md flex items-center justify-center hover:text-indigo-900 transition-colors"
                          >
                            <FiEdit className="inline mr-1" />
                            View Product
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={loadMoreRef} className="h-4"></div>
              {displayedProducts.length < filteredProducts.length && (
                <div className="flex justify-center py-4">
                  <div
                    className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
                      theme === "dark" ? "border-blue-400" : "border-blue-500"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Cards View */}
        <div className="mt-8">
          <h2
            className={`text-xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category) => (
              <div
                key={category.category_id}
                className={`rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border border-gray-700 hover:border-gray-600"
                    : "bg-white text-gray-800 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
                    }`}
                  >
                    {getCategoryIcon(category.category_name)}
                  </div>
                  <div className="ml-4">
                    <h3
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {category.category_name}
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {category.items.length} items
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {category.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span
                        className={`truncate ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                  {category.items.length > 3 && (
                    <div className="text-sm text-blue-600 font-medium text-center mt-2">
                      +{category.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
