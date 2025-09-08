import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCalendar, FaUserTag, FaIdBadge 
} from "react-icons/fa";
import Loader from "../../components/UI/loaders/Loader";


export default function MemberProfile({ setActiveTab, activeTab, userId }) {
  const [memberData, setMemberData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone_number: '',
    role: '',
    joined_on: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      setIsLoading(true);
      try {
        const api = import.meta.env.VITE_SERVER_API_NAME;
        // Fetch member data by ID
        const res = await axios.get(`${api}/api/users/${userId}`, { 
          withCredentials: true 
        });
        
        if (res.data) {
          setMemberData(res.data);
          
          // Try to load profile image
          try {
            const imageRes = await axios.get(`${api}/profile-image/${userId}`, {
              responseType: 'blob',
              withCredentials: true
            });
            if (imageRes.data) {
              const imageUrl = URL.createObjectURL(imageRes.data);
              setProfileImage(imageUrl);
            }
          } catch (imageError) {
            console.log("No profile image found for this user");
          }
        }
      } catch (err) {
        console.error("Failed to fetch member data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchMemberData();
    }
  }, [userId]);


  if (isLoading) {
    <Loader />
  }


  return (
    <div className="bg-indigo-50 min-h-screen p-0 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-xl md:2xl font-bold text-slate-700">Member Profile</h1>
          <p className="text-sm text-slate-600 mt-1">
            Viewing profile of {memberData.first_name} {memberData.last_name}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            className="btn btn-outline btn-primary gap-2"
            onClick={() => setActiveTab("Members")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Members
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-xl">
            <div className="card-body items-center text-center">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center overflow-hidden ring-4 ring-indigo-200">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                      <FaUser className="h-16 w-16 text-indigo-400" />
                    </div>
                  )}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-700">
                {memberData.first_name} {memberData.last_name}
              </h2>
              
              <div className="badge badge-primary badge-lg mt-2">
                {memberData.role}
              </div>
              
              <p className="text-sm text-slate-600 mt-2">
                <FaCalendar className="inline mr-1 mb-1" />
                Member since {new Date(memberData.joined_on).toLocaleDateString()}
              </p>
              
              <div className="divider my-6"></div>
              
              {/* Quick Stats (if available) */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-indigo-600">24</div>
                  <div className="text-xs text-slate-600">Orders</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-indigo-600">₱1,240</div>
                  <div className="text-xs text-slate-600">Total Spent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card bg-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-slate-700 mb-6">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                    <FaIdBadge className="mr-2 text-indigo-500" />
                    Basic Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">
                        Full Name
                      </label>
                      <div className="bg-indigo-50 rounded-lg p-3 text-slate-700">
                        {memberData.first_name} {memberData.last_name}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">
                        Username
                      </label>
                      <div className="bg-indigo-50 rounded-lg p-3 text-slate-700 flex items-center">
                        <FaUserTag className="mr-2 text-indigo-400" />
                        {memberData.username}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">
                        Role
                      </label>
                      <div className="bg-indigo-50 rounded-lg p-3 text-slate-700">
                        <span className="badge badge-primary">{memberData.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                    <FaEnvelope className="mr-2 text-indigo-500" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">
                        Email Address
                      </label>
                      <div className="bg-indigo-50 rounded-lg p-3 text-slate-700 flex items-center">
                        <FaEnvelope className="mr-2 text-indigo-400" />
                        {memberData.email}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-1">
                        Phone Number
                      </label>
                      <div className="bg-indigo-50 rounded-lg p-3 text-slate-700 flex items-center">
                        <FaPhone className="mr-2 text-indigo-400" />
                        {memberData.phone_number || 'Not provided'}
                      </div>
                    </div>
                    
                    {memberData.address && (
                      <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">
                          Address
                        </label>
                        <div className="bg-indigo-50 rounded-lg p-3 text-slate-700 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-indigo-400" />
                          {memberData.address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Additional Information Section */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">
                  Additional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-700 mb-2">Member Status</h4>
                    <span className="badge badge-success">Active</span>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-700 mb-2">Last Activity</h4>
                    <p className="text-slate-600">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Card */}
          <div className="card bg-white shadow-xl mt-6">
            <div className="card-body">
              <h3 className="card-title text-xl text-slate-700 mb-4">
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Placed an order</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-indigo-600">₱245.50</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Updated profile</p>
                      <p className="text-xs text-slate-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <button className="btn btn-ghost btn-sm text-indigo-600">
                  View Full Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}