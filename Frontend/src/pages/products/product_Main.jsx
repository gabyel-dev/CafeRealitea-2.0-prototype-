import { useProductDetailContext } from "../../Main/ProductDetailContext";
import ProductDetail from "./product_details";
import ProductsPage from "./ProductList";
import ProductPage from "./products";

export default function ProductMain({ activeTab, setActiveTab }) {
  return (
    <div className="bg-indigo-50 w-full  ">
      <main>
        {activeTab === "Products" && (
          <ProductPage setActiveTab={setActiveTab} activeTab={activeTab} />
        )}

        {activeTab === "Product Detail" && (
          <ProductDetail setActiveTab={setActiveTab} activeTab={activeTab} />
        )}

        {activeTab === "Product Rank" && (
          <ProductsPage setActiveTab={setActiveTab} activeTab={activeTab} />
        )}
      </main>
    </div>
  );
}
