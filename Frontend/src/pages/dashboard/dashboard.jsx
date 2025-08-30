import { useState } from "react";
import Profit from "../../components/UI/Charts/PieChart"
import Title from "../../components/UI/Title";

// Main Dashboard Component
export default function Dashboard({ setActiveTab }) {
  // Sample data
  const [timeRange, setTimeRange] = useState("monthly");
  const topItems = [
    { name: "Wireless Headphones", sales: 124, revenue: "$4,980" },
    { name: "Smart Watch", sales: 98, revenue: "$8,820" },
    { name: "Phone Case", sales: 210, revenue: "$2,310" }
  ];

  return (
    <div className="p-6 bg-indigo-50  min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div onClick={() => setActiveTab("Dashboard")} className="cursor-pointer mb-4 md:mb-0">
          <Title titleName={"Dashboard Overview"} />
          <p className="text-sm text-gray-500 mt-1">Track your store performance and metrics</p>
        </div>
        <div className="lg:flex lg:flex-row flex md:flex-col flex-row  gap-2">
          <div className="form-control">
            <select className="select select-bordered select-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <button className="btn btn-sm btn-primary gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stat Card 1 */}
        <div className="card bg-white shadow-md">
          <div className="card-body p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Monthly Sales</h3>
                <p className="text-2xl font-bold mt-1 text-gray-700">$15,230</p>
              </div>
              <div className="badge badge-lg badge-success gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +12.5%
              </div>
            </div>
            <div className="flex items-baseline mt-4">
              <div className="text-xs text-gray-500">vs previous month</div>
            </div>
          </div>    
        </div>

        {/* Stat Card 2 */}
        <div className="card bg-white shadow-md">
          <div className="card-body p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                <p className="text-2xl font-bold mt-1 text-gray-700">284</p>
              </div>
              <div className="badge badge-lg badge-success gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +8.2%
              </div>
            </div>
            <div className="flex items-baseline mt-4">
              <div className="text-xs text-gray-500">vs previous month</div>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="card bg-white shadow-md">
          <div className="card-body p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
                <p className="text-2xl font-bold mt-1 text-gray-700">$53.62</p>
              </div>
              <div className="badge badge-lg badge-success gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +3.7%
              </div>
            </div>
            <div className="flex items-baseline mt-4">
              <div className="text-xs text-gray-500">vs previous month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3  gap-6">
        {/* Profit Chart */}
            <div className="lg:col-span-2">
            <div className="card bg-white shadow-md">
                <div className="card-body text-slate-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h3 className="text-lg font-semibold">Profit Overview</h3>
                </div>
                <div className="h-fit">
                    <Profit className="text-slate-700" />
                </div>
                </div>
            </div>
            </div>


        {/* Top Items */}
        <div className="card bg-white h-fit text-slate-700  shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg mb-6">Top Selling Items</h3>
            <div className="space-y-5">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-blue-100 text-blue-600' : 
                      index === 1 ? 'bg-purple-100 text-purple-600' : 
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.sales} sold</p>
                    </div>
                  </div>
                  <span className="font-semibold">{item.revenue}</span>
                </div>
              ))}
            </div>
            <div className="divider my-4"></div>
            <button className="btn btn-primary btn-sm gap-2 self-center">
              View All Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Orders */}
        <div className="card bg-white text-slate-500 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg mb-6">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-sm">
                <thead>
                  <tr className="text-slate-700" >
                    <th >Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                  <tbody className="[&>tr:nth-child(even)]:bg-slate-100 [&>tr:nth-child(odd)]:bg-white">
                  <tr>
                    <td>#ORD-7829</td>
                    <td>John Smith</td>
                    <td>$245.50</td>
                  </tr>
                  <tr>
                    <td>#ORD-7828</td>
                    <td>Sarah Johnson</td>
                    <td>$87.99</td>
      
                  </tr>
                  <tr>
                    <td>#ORD-7827</td>
                    <td>Michael Brown</td>
                    <td>$152.75</td>

                  </tr>
                  <tr>
                    <td>#ORD-7826</td>
                    <td>Emily Davis</td>
                    <td>$499.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* View All Link */}
      <div className="mt-8 text-center">
        <button 
          onClick={() => setActiveTab("View All")} 
          className="btn btn-outline btn-wide"
        >
          View Full Dashboard
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}