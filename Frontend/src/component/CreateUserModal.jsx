import { useState } from "react";
import {
  FaTimes,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

export default function CreateUserModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    role: "Staff",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null); // null, 'success', or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      axios
        .post("https://caferealitea.onrender.com/register", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("user registered successfully");
          setStatus(res.data.status === 200 ? "success" : "error");
          setTimeout(onClose(), 1000);
        });
    } catch {
      console.log("Failed to create user");
    }

    // Simulate API call
    setTimeout(() => {
      // Randomly determine success or error for demo
      const isSuccess = Math.random() > 0.3;

      setIsSubmitting(false);

      // Reset form after success
      if (isSuccess) {
        setTimeout(() => {
          setFormData({
            first_name: "",
            last_name: "",
            password: "",
            role: "Staff",
          });
          setStatus(null);
        }, 2000);
      }
    }, 1500);
  };

  const handleClose = () => {
    setStatus(null);
    setFormData({
      first_name: "",
      last_name: "",
      password: "",
      role: "Staff",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-black/30 transition-all duration-300">
        {/* Modal */}
        <div className="flex items-center justify-center min-h-screen p-4 text-slate-700">
          <AnimatePresence>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -10, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                    <FaUserPlus className="text-lg" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Create New User
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Status Messages */}
              {status === "success" && (
                <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <FaCheckCircle className="text-green-500 text-xl mr-3" />
                  <div>
                    <p className="font-medium text-green-800">
                      User created successfully!
                    </p>
                    <p className="text-sm text-green-600">
                      The new user account has been created.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
                  <div>
                    <p className="font-medium text-red-800">
                      Failed to create user
                    </p>
                    <p className="text-sm text-red-600">
                      Please check your information and try again.
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full text-slate-500 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full text-slate-500 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full text-slate-500 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter Username"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10"
                        placeholder="Create a password"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 6 characters
                    </p>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      User Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    >
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                      <option value="System Administrator">
                        System Administrator
                      </option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
