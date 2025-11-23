import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import App from "./App.jsx";
import { UserProvider } from "./Main/UserContext.jsx";
import { ThemeContextProvider } from "./Main/ThemeContext.jsx";
import { OrderContext } from "./Main/OrderDetailContext.jsx";
import { ProductDetailProvider } from "./Main/ProductDetailContext.jsx";

createRoot(document.getElementById("root")).render(
  <ProductDetailProvider>
    <OrderContext>
      <ThemeContextProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeContextProvider>
    </OrderContext>
  </ProductDetailProvider>
);
