export default function OrderSummary({ itemsAdded, setItemsAdded }) {
  const [customerMoney, setCustomerMoney] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customerName, setCustomerName] = useState("Walk-in customer");
  const [orderType, setOrderType] = useState("Dine-in");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const total = itemsAdded.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const change = customerMoney ? (parseFloat(customerMoney) - total).toFixed(2) : 0;

  const handleSavePending = async () => {
    const orderData = {
      customer_name: customerName,
      order_type: orderType,
      payment_method: paymentMethod,
      total: total,
      items: itemsAdded.map(item => ({
        id: item.id,
        quantity: item.quantity || 1,
        price: item.price
      }))
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('https://caferealitea.onrender.com/orders/pending', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save pending order');
      }

      const data = await response.json();
      // Show success toast instead of alert
      
      // Clear the cart after successful submission
      setItemsAdded([]);
      setCustomerMoney("");
      
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOrder = async () => {
    const orderData = {
      customer_name: customerName,
      order_type: orderType,
      payment_method: paymentMethod,
      total: total,
      items: itemsAdded.map(item => ({
        id: item.id,
        quantity: item.quantity || 1,
        price: item.price
      }))
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('https://caferealitea.onrender.com/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save order');
      }
      
      const data = await response.json();
      // Show success toast instead of alert
      
      // Clear the cart after successful submission
      setItemsAdded([]);
      setCustomerMoney("");
      
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeItem = (index) => {
    setItemsAdded(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    setItemsAdded(prev => prev.map((item, i) => 
      i === index ? {...item, quantity: newQuantity} : item
    ));
  };

  return (
    <div className="w-full lg:w-[40%] bg-white shadow-md rounded-lg sticky top-4">
      <header className="w-full border-b border-gray-200 p-6">
        <h1 className="text-gray-800 font-semibold text-xl">
          Order Summary
        </h1>
        <p className="text-gray-500 text-sm mt-1">Review and complete order</p>
      </header>

      <div className="p-6 text-gray-800">
        <div className="flex flex-col gap-4 mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Customer Name</span>
            </label>
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input input-bordered"
              placeholder="Customer name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Order Type</span>
              </label>
              <select 
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="select select-bordered"
              >
                <option value="Dine-in">Dine-in</option>
                <option value="Delivery">Delivery</option>
                <option value="Takeaway">Takeaway</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Payment Method</span>
              </label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="select select-bordered"
              >
                <option value="Cash">Cash</option>
                <option value="GCash">G-Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Customer Money</span>
            </label>
            <label className="input-group">
              <span className="bg-primary text-primary-content">₱</span>
              <input 
                type="number" 
                value={customerMoney}
                onChange={(e) => setCustomerMoney(e.target.value)}
                className="input input-bordered w-full"
                placeholder="0.00"
              />
            </label>
          </div>
        </div>

        <div className="divider">Order Items</div>
        
        <div className="max-h-64 overflow-y-auto mb-6">
          {itemsAdded.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>No items added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {itemsAdded.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">₱{item.price} each</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      className="btn btn-xs btn-square"
                      onClick={() => updateQuantity(i, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity || 1}</span>
                    <button 
                      className="btn btn-xs btn-square"
                      onClick={() => updateQuantity(i, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="ml-4 flex items-center gap-2">
                    <span className="font-semibold">₱{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    <button 
                      className="btn btn-xs btn-ghost text-error"
                      onClick={() => removeItem(i)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-primary">₱{total.toFixed(2)}</span>
          </div>
          
          {customerMoney && (
            <div className="flex justify-between">
              <span className="font-medium">Change</span>
              <span className={change >= 0 ? "text-success" : "text-error"}>
                ₱{Math.abs(change).toFixed(2)} {change < 0 ? "due" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button 
            onClick={handleCompleteOrder}
            disabled={isSubmitting || itemsAdded.length === 0 || !customerMoney || change < 0}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              "Complete Order"
            )}
          </button>

          <button
            onClick={handleSavePending}
            disabled={isSubmitting || itemsAdded.length === 0}
            className="btn btn-outline w-full"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              "Save as Pending"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}