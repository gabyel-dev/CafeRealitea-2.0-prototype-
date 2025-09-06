// logout.js
import axios from "axios";
import Loader from "../components/UI/loaders/Loader";

const logout = async (navigate, setLoading) => {
  try {
    const api_name = import.meta.env.VITE_SERVER_API_NAME;
    const res = await axios.post(`${api_name}/logout`, {}, { 
      withCredentials: true 
    });
       
    console.log('Logged out successfully');
    <Loader />
    
    // Clear any client-side storage
    sessionStorage.clear();
    setLoading(true)
    
    // Navigate to login page
    navigate('/');
  } catch (error) {
    console.log('Error during logout:', error);
    // Still clear client-side data and redirect even if server call fails
    sessionStorage.clear();
    navigate('/');
  } finally {
    setLoading(false)
  }
};

export default logout;