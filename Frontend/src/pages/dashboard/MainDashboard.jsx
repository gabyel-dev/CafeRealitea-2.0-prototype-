import { useState, useEffect } from "react";
import Loader from "../../components/UI/loaders/Loader"; // Adjust path as needed
import Dashboard from "./dashboard";
import ViewAll from "./view_all_data";
import ProductPage from "../products/products";

export default function MainDashboard({ activeTab, setActiveTab }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Replace with a   ctual data fetching
        const mockData = {
          message: "Dashboard data loaded successfully",
          stats: { users: 150, orders: 320, revenue: "$15,230" }
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-indigo-50 w-full min-h-screen ">

        <main>
          <div className={activeTab === "Dashboard" ? "block bg-indigo-50 w-full h-screen" : "hidden"}>
            <Dashboard setActiveTab={setActiveTab} />
          </div>

          <div 
          className={activeTab === "View All" ? "block bg-indigo-50 w-full h-screen" : "hidden"}>
            <ViewAll setActiveTab={setActiveTab} />
          </div>

          {/* <div className={activeTab === "Products" ? "block" : "hidden"}>
            <ProductPage />
          </div> */}

          
        </main>
    </div>
  );
}