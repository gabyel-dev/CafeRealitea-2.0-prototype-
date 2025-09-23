import { useState, lazy, Suspense } from "react";
import Loader from "../../components/UI/loaders/Loader";

const SalesHistory = lazy(() => import("./SalesHistory"));
const OrderDetails = lazy(() => import("./OrderDetails"));

export default function SalesDashboard({ activeTab, setActiveTab }) {
  const [orderID, setSelectedOrderID] = useState(null);

  return (
    <div className="bg-indigo-50 w-full  ">
      <main>
        <Suspense>
          {activeTab === "Sales" && (
            <SalesHistory
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              setSelectedUserId={setSelectedOrderID}
            />
          )}

          {activeTab === "Order Details" && (
            <OrderDetails
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              orderID={orderID}
            />
          )}
        </Suspense>
      </main>
    </div>
  );
}
