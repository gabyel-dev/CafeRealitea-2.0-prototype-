import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import App from "./App.jsx";
import { UserProvider } from "./Main/UserContext.jsx";
import { ThemeContextProvider } from "./Main/ThemeContext.jsx";
import { OrderContext } from "./Main/OrderDetailContext.jsx";

createRoot(document.getElementById("root")).render(
  <OrderContext>
    <ThemeContextProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeContextProvider>
  </OrderContext>
);
