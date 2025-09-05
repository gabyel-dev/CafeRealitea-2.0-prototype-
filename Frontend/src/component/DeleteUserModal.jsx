import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteUser({ showForm, id, onDeleted }) {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [details, setDetails] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Auth check
        axios.get('https://caferealitea.onrender.com/user', { withCredentials: true })
            .then((res) => {
                if (!res.data.logged_in || res.data.role === "") {
                    navigate('/');
                    showForm(false);
                } 
            });
    }, []);

    // Fetch details if not already passed
    useEffect(() => {
        if (id) {
            setIsLoading(true);
            axios.get(`https://caferealitea.onrender.com/api/users/${id}`)
                .then((res) => {
                    setDetails(res.data);
                    setError("");
                })
                .catch((err) => {
                    console.error("Error fetching user details:", err);
                    setError("Failed to load user details");
                })
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        setError("");
        
        try {
            await axios.post(`https://caferealitea.onrender.com/delete/${id}`, {}, { withCredentials: true });
            if (onDeleted) onDeleted(id);
            showForm(false);
        } catch (error) {
            console.error("Delete error:", error);
            setError(error.response?.data?.message || "Failed to delete user");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <motion.div 
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    onClick={() => !isDeleting && showForm(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                ></motion.div>
                
                <motion.div 
                    className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    {isLoading ? (
                        <div className="py-8 flex flex-col items-center">
                            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                            <p className="text-center text-gray-600">Loading account details...</p>
                        </div>
                    ) : (
                        <>
                            <motion.div 
                                className="flex justify-center mb-4"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <motion.svg 
                                        className="w-8 h-8 text-red-600" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </motion.svg>
                                </div>
                            </motion.div>
                            
                            <motion.h2 
                                className="text-2xl font-bold text-center text-gray-800 mb-2"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Delete Account
                            </motion.h2>
                            
                            <motion.p 
                                className="text-gray-600 text-center mb-6"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Are you sure you want to delete this account? This action cannot be undone.
                            </motion.p>
                            
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        <p className="text-red-700">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <motion.div 
                                className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="font-medium text-red-800 mb-2">Account Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex">
                                        <span className="text-gray-600 w-24">Name:</span>
                                        <span className="font-medium text-slate-700">{details?.first_name} {details?.last_name}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-600 w-24">Username:</span>
                                        <span className="font-medium text-slate-700">{details?.username}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-600 w-24">Email:</span>
                                        <span className="font-medium text-slate-700">{details?.email}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-gray-600 w-24">Role:</span>
                                        <span className="font-medium text-slate-700">{details?.role?.toUpperCase()}</span>
                                    </div>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="flex justify-end space-x-3"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <button 
                                    onClick={() => showForm(false)}
                                    disabled={isDeleting}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <motion.button 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Terminating...
                                        </>
                                    ) : (
                                        "Terminate Account"
                                    )}
                                </motion.button>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}