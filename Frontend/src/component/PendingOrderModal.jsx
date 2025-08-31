import { useState, useEffect } from "react";
import { FaTimes, FaCheck,  FaUser, FaReceipt, FaCreditCard, FaCalendar } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

export default function PendingOrdersModal({ onClose, notifications }) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://caferealitea.onrender.com/pending-orders', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPendingOrders(data);
      } else {
        console.error('Expected array but got:', data);
        setPendingOrders([]);
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      setError(error.message);
      setPendingOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`https://caferealitea.onrender.com/pending-orders/${orderId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Error loading order details');
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      const response = await fetch(`https://caferealitea.onrender.com/pending-orders/${orderId}/confirm`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('Order confirmed successfully!');
        setSelectedOrder(null);
        fetchPendingOrders();
      } else {
        throw new Error('Failed to confirm order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Error confirming order');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`https://caferealitea.onrender.com/pending-orders/${orderId}/cancel`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('Order cancelled successfully!');
        setSelectedOrder(null);
        fetchPendingOrders();
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <AnimatePresence>
      <motion.div 
      initial={{ opacity: 0, y: 10}}
      animate={{ opacity: 1, y: 0}}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}

      className="bg-indigo-50 text-slate-700 rounded-lg p-6 w-full lg:w-[30%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-indigo-200">
          <h2 className="text-2xl font-bold text-slate-800">Pending Orders</h2>
          <div className="flex gap-2">
            <button 
              onClick={fetchPendingOrders}
              className="p-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
              title="Refresh"
            >
             <FiRefreshCw />

            </button>
            <button 
              onClick={onClose} 
              className="p-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
            >
              
              <FaTimes />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="loading loading-spinner loading-lg text-indigo-600 mb-4"></div>
            <p className="text-slate-600">Loading pending orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <p>Error loading orders: {error}</p>
            </div>
            <button 
              onClick={fetchPendingOrders}
              className="btn btn-primary bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : selectedOrder ? (
          // Order Details View
          <AnimatePresence>
          <motion.div
          initial={{ opacity: 0, y: 10}}
      animate={{ opacity: 1, y: 0}}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
           className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-3 flex items-center gap-2">
              <FaReceipt className="text-indigo-600" />
              Order #{selectedOrder.id}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaUser className="text-indigo-600" />
                  <div>
                    <p className="text-sm text-slate-500">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaReceipt className="text-indigo-600" />
                  <div>
                    <p className="text-sm text-slate-500">Order Type</p>
                    <p className="font-medium">{selectedOrder.order_type}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaCreditCard className="text-indigo-600" />
                  <div>
                    <p className="text-sm text-slate-500">Payment Method</p>
                    <p className="font-medium">{selectedOrder.payment_method}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-indigo-600" />
                  <div>
                    <p className="text-sm text-slate-500">Created</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-indigo-100 last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">₱{item.price} × {item.quantity || 1}</p>
                    </div>
                    <span className="font-semibold">₱{(item.price || 0) * (item.quantity || 1)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-indigo-200">
                <p className="text-lg font-bold text-slate-800">Total</p>
                <p className="text-xl font-bold text-indigo-700">₱{selectedOrder.total}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => confirmOrder(selectedOrder.id)}
                className="btn btn-success bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaCheck />
                Confirm Order
              </button>
              <button 
                onClick={() => cancelOrder(selectedOrder.id)}
                className="btn btn-error bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                Cancel Order
              </button>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="btn btn-outline border-indigo-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Back to List
              </button>
            </div>
          </motion.div>
          </AnimatePresence>
        ) : (
          // Orders List View
          <div>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FaReceipt className="inline-block text-4xl text-indigo-300 mb-4" />
                <p className="text-slate-500 text-lg">No pending orders</p>
                <p className="text-slate-400 text-sm mt-1">New orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-indigo-100"
                    onClick={() => viewOrderDetails(order.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-800">Order #{order.id}</h4>
                          <span className="badge badge-info bg-indigo-100 text-indigo-700 border-0">
                            {order.order_type}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                          <FaUser className="text-indigo-500" />
                          <span>{order.customer_name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <FaCalendar className="text-indigo-400" />
                          <span>{new Date(order.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-indigo-700">₱{order.total}</p>
                        <div className="badge badge-outline border-indigo-200 text-indigo-600 mt-1">
                          {order.payment_method}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
      </AnimatePresence>
      
    </div>
  );
}