import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUser, FaCamera, FaEnvelope, FaPhone, FaSave, FaTimes, 
  FaLock, FaCheckCircle, FaExclamationTriangle, FaEdit 
} from "react-icons/fa";
import Loader from "../../components/UI/loaders/Loader";

export default function Profile({ setActiveTab }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone_number: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [originalProfileData, setOriginalProfileData] = useState(null);
  const [getId, setGetId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [checkIfHasProfile, setCheckIfHasProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const api = import.meta.env.VITE_SERVER_API_NAME;
        const res = await axios.get(`${api}/user`, { withCredentials: true });
        setProfileData(res.data.user || res.data);
        setOriginalProfileData(res.data.user || res.data);
        setGetId(res.data.user?.id || res.data.id);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveImage = async () => {
    if (!profileImage) return;

    setIsLoading(true);
    const api = import.meta.env.VITE_SERVER_API_NAME;
    const formData = new FormData();
    formData.append('profile_image', profileImage);
    
    try {
      await axios.post(`${api}/update/profile_picture`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage({ type: 'success', text: 'Profile image updated successfully!' });
      setProfileImage(null);
      setPreviewImage(null);
      
      // Refresh user data to get updated image
      const res = await axios.get(`${api}/user`, { withCredentials: true });
      setProfileData(res.data.user || res.data);
    } catch (err) { 
      console.error("Failed to update profile image:", err);
      setMessage({ type: 'error', text: 'Failed to update profile image' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'Image must be less than 5MB' });
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const api = import.meta.env.VITE_SERVER_API_NAME;
      await axios.post(`${api}/update/account`, profileData, { withCredentials: true });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Update original data
      setOriginalProfileData({...profileData});
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalProfileData) {
      setProfileData(originalProfileData);
    }
    setProfileImage(null);
    setPreviewImage(null);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (isLoading && !profileData.first_name) {
    return (
      <Loader />
    );
  }

  return (
    <div className=" bg-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold text-slate-700">Profile</h1>
          <p className="text-sm text-slate-700 opacity-70 mt-1">
            Manage your account information and preferences
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              className="btn btn-primary gap-2"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit className="h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button 
                className="btn btn-success gap-2"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <FaSave className="h-4 w-4" />
                )}
                Save Changes
              </button>
              <button 
                className="btn btn-outline gap-2"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <FaTimes className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
          {message.type === 'success' ? (
            <FaCheckCircle className="h-5 w-5" />
          ) : (
            <FaExclamationTriangle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-xl sticky top-4">
            <div className="card-body items-center text-center">
              {/* Profile Image */}
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://caferealitea.onrender.com/profile-image/${getId}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z' clip-rule='evenodd' /%3E%3C/svg%3E";
                      }}
                    />
                  )}
                </div>
                
                {isEditing && (
                  <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-primary text-primary-content p-3 rounded-full cursor-pointer hover:bg-primary-focus transition-all shadow-md">
                    <FaCamera className="h-4 w-4" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-slate-700">
                {profileData.first_name} {profileData.last_name}
              </h2>
              <div className="badge badge-primary  badge-lg">{profileData.role}</div>
              <p className="text-sm  text-slate-700 opacity-70">
                Member since {new Date(profileData.joined_on).toLocaleDateString()}
              </p>
              
              <div className="divider my-4 text-slate-700"></div>
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 text-sm p-2 bg-indigo-100  rounded-lg">
                  <FaEnvelope className=" opacity-70  text-slate-700" />
                  <span className=" text-slate-700">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-2 bg-indigo-100 rounded-lg">
                  <FaPhone className=" text-slate-700 opacity-70" />
                  <span className=" text-slate-700">{profileData.phone_number || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-2 bg-indigo-100 rounded-lg">
                  <FaUser className=" text-slate-700 opacity-70" />
                  <span className=" text-slate-700">{profileData.username}</span>
                </div>
              </div>
              
              {isEditing && profileImage && (
                <div className="w-full mt-4">
                  <button 
                    className="btn btn-accent btn-sm w-full gap-2"
                    onClick={handleSaveImage}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <FaSave className="h-3 w-3" />
                    )}
                    Save Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 rounded-md">
          <div className="card bg-base-100 shadow-xl rounded-md">
            <div className="card-body bg-white  text-slate-700 rounded-md">
              <h2 className="card-title text-2xl">Account Information</h2>
              <p className=" text-slate-700 opacity-70 mb-6">Update your personal information</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control flex flex-col w-full">
                  <label className="label">
                    <span className="label-text font-semibold">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profileData.first_name || ''}
                    onChange={handleInputChange}
                    className="input input-bordered bg-indigo-100"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-control flex flex-col w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profileData.last_name || ''}
                    onChange={handleInputChange}
                    className="input input-bordered bg-indigo-100"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-control md:col-span-2 flex flex-col ">
                  <label className="label">
                    <span className="label-text font-semibold">Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email || ''}
                    onChange={handleInputChange}
                    className="input input-bordered bg-indigo-100  "
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-control flex flex-col w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Username</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username || ''}
                    onChange={handleInputChange}
                    className="input input-bordered bg-indigo-100"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-control flex flex-col w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Phone Number</span>
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={profileData.phone_number || ''}
                    onChange={handleInputChange}
                    className="input input-bordered bg-indigo-100"
                    disabled={!isEditing}
                    placeholder="Add phone number"
                  />
                </div>
              </div>
              
              <div className="divider my-6"></div>
              
              <h2 className="card-title text-2xl">Security</h2>
              <p className="text-slate-700 opacity-70 mb-6">Change your password</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Current Password</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 opacity-50" />
                    <input
                      type="password"
                      className="input input-bordered pl-10 bg-indigo-100"
                      disabled={!isEditing}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">New Password</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 opacity-50" />
                    <input
                      type="password"
                      className="input input-bordered pl-10 bg-indigo-100"
                      disabled={!isEditing}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Confirm New Password</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 opacity-50" />
                    <input
                      type="password"
                      className="input input-bordered pl-10 bg-indigo-100"
                      disabled={!isEditing}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}