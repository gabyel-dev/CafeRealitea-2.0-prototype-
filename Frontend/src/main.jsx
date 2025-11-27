import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import App from "./App.jsx";
import { UserProvider } from "./Main/UserContext.jsx";
import { ThemeContextProvider } from "./Main/ThemeContext.jsx";
import { OrderContext } from "./Main/OrderDetailContext.jsx";
import { ProductDetailProvider } from "./Main/ProductDetailContext.jsx";
import { NotificationProvider } from "./Main/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <NotificationProvider>
    <ProductDetailProvider>
      <OrderContext>
        <ThemeContextProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </ThemeContextProvider>
      </OrderContext>
    </ProductDetailProvider>
  </NotificationProvider>
);
