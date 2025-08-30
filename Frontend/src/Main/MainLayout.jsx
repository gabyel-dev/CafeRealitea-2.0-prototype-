import { useState } from "react";
import { Sidebar } from "../SidePanel/RetractingSidebar";
import Loader from "../components/UI/loaders/Loader";
import Dashboard from "../pages/dashboard/MainDashboard";


export default function MainLayout() {
  // define the state here
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex">
      {/* pass props down */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 bg-indigo-50">
        {/* Show only the active tab */}
        <div className={activeTab === "Dashboard" ? "block bg-indigo-50 w-full h-screen" : "hidden"}>
          
          <Dashboard  />
        </div>
        <div className={activeTab === "Sales" ? "block" : "hidden"}>
          <h1>Sales Content</h1>
        </div>
        <div className={activeTab === "Orders" ? "block" : "hidden"}>
          <h1>Orders Content</h1>
        </div>
        {/* etc. */}  
      </main>
    </div>
  );
}
