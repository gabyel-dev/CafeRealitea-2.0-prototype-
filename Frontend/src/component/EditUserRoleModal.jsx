import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function EditUserRole({ showForm, id }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [details, setDetails] = useState(null);
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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

    // Fetch user details
    useEffect(() => {
        if (id) {
            setIsLoading(true);
            axios.get(`https://caferealitea.onrender.com/api/users/${id}`)
                .then((res) => {
                    setDetails(res.data);
                    setRole(res.data.role || "Staff");
                })
                .catch((err) => {
                    console.error("Error fetching user details:", err);
                    setError("Failed to load user details");
                })
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!role) {
            setError("Please select a role");
            return;
        }
        
        setIsSubmitting(true);
        setError("");
        
        try {
            await axios.post(`https://caferealitea.onrender.com/update_role`, {
                id: id,
                role: role
            }, { withCredentials: true });
            
            setSuccess(true);
            setTimeout(() => {
                showForm(false);
            }, 1500);
        } catch (error) {
            console.error("Update error:", error);
            setError(error.response?.data?.message || "Failed to update user role");
        } finally {
            setIsSubmitting(false);
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
                    onClick={() => !isSubmitting && showForm(false)}
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
                            <span className="loading loading-spinner loading-lg text-primary"></span>

                        </div>
                    ) : success ? (
                        <motion.div 
                            className="text-center py-6"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <motion.svg 
                                    className="w-8 h-8 text-green-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </motion.svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Role Updated Successfully!</h2>
                            <p className="text-gray-600">The user's role has been updated.</p>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div 
                                className="flex items-center mb-4"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Edit User Role</h2>
                                    <p className="text-gray-600 text-sm">{details?.name || details?.email}</p>
                                </div>
                            </motion.div>
                            
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
                            
                            <form onSubmit={handleSubmit}>
                                <motion.div 
                                    className="mb-6"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                                    <div className="space-y-2">
                                        {["Staff", "Admin", "System Administrator"].map((roleOption, index) => (
                                            <motion.div 
                                                key={roleOption} 
                                                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                            >
                                                <input
                                                    id={`role-${roleOption}`}
                                                    type="radio"
                                                    name="role"
                                                    value={roleOption}
                                                    checked={role === roleOption}
                                                    onChange={() => setRole(roleOption)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <label htmlFor={`role-${roleOption}`} className="ml-3 block text-sm font-medium text-gray-700">
                                                    {roleOption}
                                                </label>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    className="flex justify-end space-x-3"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <button 
                                        type="button"
                                        onClick={() => showForm(false)}
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Role"
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
