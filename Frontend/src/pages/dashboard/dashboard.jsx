import { useState, useEffect } from "react";
import Profit from "../../components/UI/Charts/PieChart"
import Title from "../../components/UI/Title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io('https://caferealitea.onrender.com')

// Main Dashboard Component
export default function Dashboard({ setActiveTab }) {
  // Sample data
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState("monthly");
  const [topItems, setTopItems] = useState([])
  const [summary, setSummary] = useState(null);
  const [percentChange, setPercentChange] = useState({
    sales: 0,
    orders: 0,
    avgOrder: 0
  });
  const [recentOrder, setRecentOrder] = useState()
  const [role, setRole] = useState('')

   useEffect(() => {
    document.title = "Café Realitea - Dashboard";

    axios.get("https://caferealitea.onrender.com/user", { withCredentials: true })
      .then((res) => {
        console.log(res.data.role);
        
        if (!res.data.logged_in || res.data.role === "") {
          navigate("/");
          return;
        }
        setRole(res.data.role);
      })
      .catch((err) => {
        console.error("Authentication check failed:", err);
        navigate("/")
      })
   }, [])
  

function getPercentageChange(current, previous) {
  if (!previous || previous === 0) return 0; 
  return ((current - previous) / previous) * 100;
}


    useEffect(() => {
    const api = import.meta.env.VITE_SERVER_API_NAME;

    // fetch top items
    axios.get(`${api}/top_items`)
      .then((result) => setTopItems(result.data));

    // fetch recent orders
    
    

    // fetch orders summary
    axios.get(`${api}/orders/months`)
      .then((res) => {
        const data = res.data;

        // sort by year+month
        data.sort((a, b) =>
          a.year === b.year ? a.month - b.month : a.year - b.year
        );

        const latest = data[data.length - 1];
        const prev = data.length > 1 ? data[data.length - 2] : null;

        if (latest) {
          setSummary({
            sales: latest.total_sales,
            orders: latest.total_orders,
            avgOrder: latest.total_sales / latest.total_orders
          });

          if (prev) {
            setPercentChange({
              sales: getPercentageChange(latest.total_sales, prev.total_sales),
              orders: getPercentageChange(latest.total_orders, prev.total_orders),
              avgOrder: getPercentageChange(
                latest.total_sales / latest.total_orders,
                prev.total_sales / prev.total_orders
              )
            });
          }
        }
      });
  }, []);
  

  return (
    <div className="md:p-4 pt-4 md:pt-4 bg-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8  ">
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
   {/* Stat Card 1 - Monthly Sales */}
<div className="card bg-white shadow-md">
  <div className="card-body p-6">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Monthly Sales</h3>
        <p className="text-2xl font-bold mt-1 text-gray-700">
          ₱{summary?.sales?.toLocaleString() ?? "-"}
        </p>
      </div>
      <div className={`badge badge-lg gap-1 ${percentChange.sales >= 0 ? "badge-success" : "badge-error"}`}>
        {percentChange.sales >= 0 ? "↑" : "↓"} {percentChange.sales.toFixed(1)}%
      </div>
    </div>
    <div className="flex items-baseline mt-4">
      <div className="text-xs text-gray-500">vs previous month</div>
    </div>
  </div>
</div>



        {/* Stat Card 2 - Total Orders */}
<div className="card bg-white shadow-md">
  <div className="card-body p-6">
    <div className="flex justify-between items-start">
      <div className="w-full">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <div
            className={`badge badge-lg gap-1 ${
              percentChange.orders >= 0 ? "badge-success" : "badge-error"
            }`}
          >
            {percentChange.orders >= 0 ? "↑" : "↓"}{" "}
            {percentChange.orders.toFixed(1)}%
          </div>
        </div>
        <p className="text-2xl font-bold mt-1 text-gray-700">
          {summary?.orders ?? "-"}
        </p>
      </div>
    </div>
    <div className="flex items-baseline mt-4">
      <div className="text-xs text-gray-500">vs previous month</div>
    </div>
  </div>
</div>

{/* Stat Card 3 - Avg. Order Value */}


        {/* Stat Card 3 */}
        <div className="card bg-white shadow-md">
          <div className="card-body p-6">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="flex justify-between ">
                  <h3 className="text-sm font-medium text-gray-500">Avg. Order Val</h3> 
                <div className={`badge badge-lg gap-1 ${percentChange.avgOrder >= 0 ? "badge-success" : "badge-error"}`}>
                {percentChange.avgOrder >= 0 ? "↑" : "↓"} {percentChange.avgOrder.toFixed(1)}%
              </div>
                </div>
                
                <p className="text-2xl font-bold mt-1 text-gray-700">
                  
                ₱{summary?.avgOrder?.toFixed(2) ?? "-"}
              </p>
              
              </div>
            </div>
            <div className="flex items-baseline mt-4">
              <div className="text-xs text-gray-500">vs previous month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3    gap-6">
        {/* Profit Chart */}
            <div className="lg:col-span-2">
            <div className="card bg-white shadow-md">
                <div className="card-body text-slate-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h3 className="text-lg font-semibold">Profit Overview</h3>
                    <button className="btn btn-neutral btn-sm">View All Data</button>
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
            <div className="space-y-5 pb-10">
              {topItems.slice(0, 4).map((item, index) => (
                <div key={item.item_id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-blue-100 text-blue-600' : 
                      index === 1 ? 'bg-purple-100 text-purple-600' : 
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-xs text-gray-500">{item.total_quantity} sold</p>
                    </div>
                  </div>
                  <span className="font-semibold">₱ {item.total_sales}</span>
                </div>
              ))}
            </div>
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

        {/* recent activity */}
        <div className="card bg-white text-slate-500 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-lg mb-6">Recent Activity</h3>
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
<div className={`${role === 'Admin' ? "hidden" : "block"} mt-8 text-center`}>
    <button 
      onClick={() => setActiveTab('View All')}
      className="btn btn-neutral btn-wide"
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