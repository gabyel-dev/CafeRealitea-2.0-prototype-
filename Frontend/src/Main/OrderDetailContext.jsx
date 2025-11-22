import { createContext, useContext } from "react";
import { useState } from "react";

const OrderDetailsContext = createContext();

export function OrderContext({ children }) {
  const [orderID, setOrderID] = useState(null);
  return (
    <OrderDetailsContext.Provider value={{ orderID, setOrderID }}>
      {children}
    </OrderDetailsContext.Provider>
  );
}

export function useOrderContext() {
  return useContext(OrderDetailsContext);
}
