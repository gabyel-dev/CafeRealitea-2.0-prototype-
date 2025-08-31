export default function CreateOrder({ categories, setItemsAdded, itemsAdded }) {
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const addItem = (item) => {
    setItemsAdded((prev) => [...prev, item]);
    setToast(`${item.name} added!`);

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg relative">
      <header className="w-full border-b border-gray-200 p-6">
        <h1 className="text-gray-800 font-semibold text-xl">
          Create New Order
        </h1>
        <p className="text-gray-500 text-sm mt-1">Select items to add to order</p>
      </header>

      <div className="p-6 text-gray-800">
        {/* Category Tabs */}
        <div className="tabs tabs-boxed bg-gray-100 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              className={`tab ${activeCategory === cat.category_id ? 'tab-active' : ''}`}
              onClick={() => setActiveCategory(
                activeCategory === cat.category_id ? null : cat.category_id
              )}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories
            .filter(cat => !activeCategory || cat.category_id === activeCategory)
            .map((cat) => (
              <div key={cat.category_id} className="space-y-4">
                <h2 className="font-semibold text-lg text-gray-700 border-b pb-2">
                  {cat.category_name}
                </h2>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="card bg-base-100 shadow-sm cursor-pointer border border-gray-200"
                      onClick={() => addItem(item)}
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="card-title text-sm font-medium">{item.name}</h3>
                          <span className="font-semibold text-primary">₱{item.price}</span>
                        </div>
                        <div className="card-actions justify-end mt-2">
                          <button className="btn btn-primary btn-sm">
                            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                            Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="toast toast-bottom toast-end z-50"
          >
            <div className="alert alert-success">
              <span>{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}