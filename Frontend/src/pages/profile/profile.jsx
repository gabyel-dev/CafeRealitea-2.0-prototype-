import { useState } from "react";
import { FaUser, FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";


export default function Profile({ setActiveTab }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Café Street, City, State 12345",
    role: "Manager",
    joinDate: "January 15, 2023"
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real application, you would save the data to your backend here
    console.log("Saving profile data:", profileData);
    if (profileImage) {
      console.log("New profile image selected");
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original values
    setProfileData({
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Café Street, City, State 12345",
      role: "Manager",
      joinDate: "January 15, 2023"
    });
    setProfileImage(null);
    setPreviewImage(null);
    setIsEditing(false);
  };

  return (
    <div className="md:p-4 pt-4 md:pt-4 bg-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="cursor-pointer mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account information and preferences</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              className="btn btn-primary gap-2"
              onClick={() => setIsEditing(true)}
            >
              <FaUser className="h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                className="btn btn-success gap-2"
                onClick={handleSave}
              >
                <FaSave className="h-4 w-4" />
                Save Changes
              </button>
              <button 
                className="btn btn-outline gap-2"
                onClick={handleCancel}
              >
                <FaTimes className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-md sticky top-4 text-slate-700">
            <div className="card-body items-center text-center">
              {/* Profile Image */}
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="h-16 w-16 text-indigo-400" />
                  )}
                </div>
                
                {isEditing && (
                  <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-600 transition-colors">
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
              
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-indigo-600 font-medium">{profileData.role}</p>
              <p className="text-sm text-gray-500">Member since {profileData.joinDate}</p>
              
              <div className="divider my-4"></div>
              
              <div className="w-full text-left space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="text-gray-400" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="text-gray-400" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <span>{profileData.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card bg-white shadow-md text-slate-700">
            <div className="card-body">
              <h2 className="card-title text-xl mb-6">Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control text-slate-700">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="input input-bordered bg-white text-slate-700 border-1 border-slate-300"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="input input-bordered bg-white text-slate-700 border-1 border-slate-300"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="input input-bordered bg-white text-slate-700 border-1 border-slate-300"
                    disabled={!isEditing}
                  />
                </div>
                
            
              </div>
              
              <div className="divider my-6"></div>
              
              <h2 className="card-title text-xl mb-6">Security</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Current Password</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered bg-white text-slate-700 border-1 border-slate-300"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">New Password</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered bg-white text-slate-700 border-1 border-slate-300"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Confirm New Password</span>
                  </label>
                  <input
                    type="password"
                    className="input input-bordered bg-white text-slate-700 border-1 border-slate-300"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end mt-8 gap-4">
                  <button 
                    className="btn btn-success gap-2"
                    onClick={handleSave}
                  >
                    <FaSave className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button 
                    className="btn btn-outline gap-2"
                    onClick={handleCancel}
                  >
                    <FaTimes className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
    
        </div>
      </div>
    </div>
  );
}