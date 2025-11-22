import { useState, lazy, Suspense } from "react";
import Loader from "../../components/UI/loaders/Loader";
import SalesHistory from "./SalesHistory";
import OrderDetails from "./OrderDetails";
import { useOrderContext } from "../../Main/OrderDetailContext";

export default function SalesDashboard({ activeTab, setActiveTab }) {
  const { orderID, setOrderID } = useOrderContext();

  return (
    <div className="bg-indigo-50 w-full  ">
      <main>
        {activeTab === "Sales" && (
          <SalesHistory
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            setSelectedUserId={setOrderID}
          />
        )}

        {activeTab === "Order Details" && (
          <OrderDetails
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            orderID={orderID}
          />
        )}
      </main>
    </div>
  );
}
