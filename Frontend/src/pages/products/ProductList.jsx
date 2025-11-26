import {
  FiPackage,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiCoffee,
  FiShoppingCart,
  FiAward,
  FiStar,
  FiTrendingDown,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useProductDetailContext } from "../../Main/ProductDetailContext";

export default function ProductsPage({ setActiveTab }) {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setProductID } = useProductDetailContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://caferealitea.onrender.com/top_items",
          { withCredentials: true }
        );

        setProductData(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (fetchError) {
        console.error("Fetch failed:", fetchError);
        setProductData([]);
        setError("Unable to load product rankings right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const topThree = useMemo(() => productData.slice(0, 3), [productData]);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "-";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return value;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null) return "-";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return value;
    return new Intl.NumberFormat("en-PH").format(numericValue);
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-3">
      <div className="max-w-7xl mx-auto px-0 md:px-3">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-4 w-full">
              <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <FiShoppingBag className="text-xl text-indigo-700" />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Product Rankings
                  </h1>
                  {productData.length > 0 && (
                    <span className="text-xs font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      {productData.length} products
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 max-w-2xl">
                  Top performing products based on sales performance and total
                  revenue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Top 3 Products Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {isLoading && (
            <>
              {[1, 2, 3].map((skeleton) => (
                <div
                  key={skeleton}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse"
                >
                  <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
                  <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && productData.length === 0 && (
            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <FiCoffee />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No product data available
              </h3>
              <p className="text-sm text-gray-600">
                Try refreshing the page or check back later when sales data is
                ready.
              </p>
            </div>
          )}

          {!isLoading && productData.length > 0 && (
            <>
              {/* 1st Place */}
              <div
                className="relative cursor-pointer bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg border border-amber-200 p-6"
                onClick={() => {
                  setActiveTab("Product Detail");
                  setProductID(topThree[0]?.item_id);
                }}
              >
                <div className="absolute -top-3 -left-3">
                  <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-amber-100">
                    <FiAward className="text-xl text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Top Product
                    </h3>
                    <p className="text-sm text-gray-600">Best Seller</p>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {topThree[0]?.product_name || "—"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Units Sold</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(topThree[0]?.total_quantity)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Revenue</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(topThree[0]?.total_sales)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2nd Place */}
              <div
                className="relative cursor-pointer bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl shadow-lg border border-gray-200 p-6"
                onClick={() => {
                  setActiveTab("Product Detail");
                  setProductID(topThree[1]?.item_id);
                }}
              >
                <div className="absolute -top-3 -left-3">
                  <div className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-gray-100">
                    <FiStar className="text-xl text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Second Best
                    </h3>
                    <p className="text-sm text-gray-600">Runner Up</p>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {topThree[1]?.product_name || "—"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {topThree[1]?.category || ""}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Units Sold</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(topThree[1]?.total_quantity)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Revenue</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(topThree[1]?.total_sales)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div
                className="relative bg-gradient-to-br cursor-pointer from-orange-50 to-amber-50 rounded-2xl shadow-lg border border-orange-200 p-6"
                onClick={() => {
                  setActiveTab("Product Detail");
                  setProductID(topThree[2]?.item_id);
                }}
              >
                <div className="absolute -top-3 -left-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-orange-100">
                    <FiTrendingUp className="text-xl text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Third Place
                    </h3>
                    <p className="text-sm text-gray-600">Top Performer</p>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {topThree[2]?.product_name || "—"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {topThree[2]?.category || ""}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Units Sold</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(topThree[2]?.total_quantity)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Revenue</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(topThree[2]?.total_sales)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* All Products Ranking Table */}
        <div className="rounded-2xl shadow-lg overflow-hidden border bg-white border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Complete Product Rankings
            </h2>
            <p className="text-sm text-gray-600">
              Sorted by total sales performance
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Units Sold
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      Loading full ranking…
                    </td>
                  </tr>
                )}
                {!isLoading && productData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No products to display.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  productData.slice(3, 20).map((res, index) => (
                    <tr
                      key={res.item_id ?? index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductID(res.item_id);
                        setActiveTab("Product Detail");
                      }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                            {index + 4}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-gray-100 text-gray-500 mr-3">
                            {res.product_status === "inactive" ? (
                              <FiX />
                            ) : (
                              <FiCheckCircle />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {res.product_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {res.item_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(res.product_price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatNumber(res.total_quantity)}
                          </div>
                          <div className="ml-2 text-xs text-gray-500">
                            units
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(res.total_sales)}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
