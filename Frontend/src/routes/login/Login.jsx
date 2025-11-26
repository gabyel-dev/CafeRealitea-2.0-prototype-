import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Loading from "../../components/UI/loaders/Loading";
import { default as Button } from "../../components/UI/buttons/button";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useForm } from "react-hook-form";

const api_name = import.meta.env.VITE_SERVER_API_NAME;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Proper useForm implementation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const showPass = (e) => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
  };

  const handleBlur = (field) => {
    setIsFocused({ ...isFocused, [field]: false });
  };

  // This function will receive the form data automatically
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${api_name}/login`, data, {
        withCredentials: true,
      });

      console.log("Login successful", response.data);
      nav("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error_msg || "Login failed. Please try again."
      );
      setTimeout(() => {
        setError("");
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  //check user role and if user is loggedin
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${api_name}/user`, {
          withCredentials: true,
        });

        if (response.data.logged_in && response.data.role !== "") {
          nav("/dashboard");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuthStatus();
  }, [nav]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to continue to your account
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-lg py-8 px-6 shadow-xl rounded-2xl border border-white/20">
          {/* Use handleSubmit from react-hook-form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative mt-1">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  className="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-700"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  tabIndex={-1}
                  href="#"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1 flex">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  className="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-700"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={showPass}
                  tabIndex={-1}
                  className="text-indigo-600 absolute right-3 top-[13px] text-lg font-bold px-3 py-1 hover:bg-indigo-50 cursor-pointer rounded-md"
                >
                  {!showPassword ? <BsEye /> : <BsEyeSlash />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="w-full">
                    <Loading text={"Signing in...."} />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      type="submit"
                      loading={isLoading}
                      variant="primary"
                      size="md"
                      className="w-full py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      Sign in
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Cafe Realitea. All rights
            reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center justify-center"
    >
      <div className="grid size-12 shrink-0 place-content-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
        <img src="/Logo.jpg" alt="Logo" className="rounded-xl " />
      </div>
      <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Cafe Realitea
      </span>
    </motion.div>
  );
};

export default LoginPage;
