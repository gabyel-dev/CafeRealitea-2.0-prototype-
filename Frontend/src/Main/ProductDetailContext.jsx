import { createContext, useContext } from "react";
import { useState } from "react";

const ProductDetailContext = createContext();

export function ProductDetailProvider({ children }) {
  const [productID, setProductID] = useState(null);
  return (
    <ProductDetailContext.Provider value={{ productID, setProductID }}>
      {children}
    </ProductDetailContext.Provider>
  );
}

export function useProductDetailContext() {
  return useContext(ProductDetailContext);
}
