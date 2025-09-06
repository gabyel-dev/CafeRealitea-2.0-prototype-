import { useState, useEffect, lazy, Suspense } from "react";
import Loader from "../../components/UI/loaders/Loader"; // Adjust path as needed
import ProductPage from "../products/products";

const ViewAll = lazy(() => import("./view_all_data"))
const Dashboard = lazy(() => import("./dashboard"))

export default function MainDashboard({ activeTab, setActiveTab }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadedTabs, setLoadedTabs] = useState(new Set(["Dashboard"])); // Track loaded tabs

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    
    // Add the tab to loaded tabs if it hasn't been loaded yet
    if (!loadedTabs.has(tabName)) {
      setLoadedTabs(prev => new Set([...prev, tabName]));
    }
  };

  const renderComponent = (tabName, Component) => {
    
    return (
      <div style={{ display: activeTab === tabName ? "block" : "none" }}>
        <Component setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
    );
  };

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
          <Suspense fallback={<Loader />}>
            {renderComponent('Dashboard', Dashboard)}
            {renderComponent('View All', ViewAll)}
          </Suspense>

          
        </main>
    </div>
  );
}