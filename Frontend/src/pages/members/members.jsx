import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaUsers, 
  FaUser, 
  FaSearch, 
  FaCrown, 
  FaUserShield, 
  FaUserTie, 
  FaPlus, 
  FaEye,
  FaUserPlus,
  FaCircle,
  FaFilter,
  FaSort,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaCalendar
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DeleteUser from "../../component/DeleteUserModal";

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(null);
    const [showFormDelete, setShowFormDelete] = useState(false)
    const [userDetails, setUserDetails] = useState({});


    const handleUserDeleted = (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setFilteredUsers((prev) => prev.filter((u) => u.id !== id));
    };


    // Check session/role
    useEffect(() => {
        axios.get('https://caferealitea.onrender.com/user', { withCredentials: true })
            .then((res) => {
                const { logged_in, role } = res.data;
                if (!logged_in || role === "") {
                    navigate('/');
                } else {
                    setRole(res.data.role)
                }
            })
            .catch(() => navigate('/'));
    }, [navigate]);

    

    // Fetch all users
    useEffect(() => {
        document.title = "Café Realitea - User Management";
        setIsLoading(true);
        axios.get('https://caferealitea.onrender.com/users_account', { withCredentials: true })
            .then((res) => {
                setUsers(res.data);
                setFilteredUsers(res.data);
                
                const status = {};
                res.data.forEach(user => {
                  status[user.id] = user.token !== null;
                });
                setIsOnline(status);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    // Filter and sort users
    useEffect(() => {
        let result = [...users];
        
        // Apply search filter
        if (searchTerm) {
            result = result.filter(user => 
                user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply role filter
        if (roleFilter !== "all") {
            result = result.filter(user => user.role === roleFilter);
        }
        
        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(user => 
                statusFilter === "online" ? isOnline[user.id] : !isOnline[user.id]
            );
        }
        
        // Apply sorting
        result.sort((a, b) => {
            let aValue, bValue;
            
            switch(sortBy) {
                case "name":
                    aValue = `${a.first_name} ${a.last_name}`;
                    bValue = `${b.first_name} ${b.last_name}`;
                    break;
                case "role":
                    aValue = a.role;
                    bValue = b.role;
                    break;
                case "status":
                    aValue = isOnline[a.id] ? 1 : 0;
                    bValue = isOnline[b.id] ? 1 : 0;
                    break;
                case "date":
                    aValue = new Date(a.created_at || 0);
                    bValue = new Date(b.created_at || 0);
                    break;
                default:
                    aValue = a[sortBy];
                    bValue = b[sortBy];
            }
            
            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        
        setFilteredUsers(result);
    }, [searchTerm, roleFilter, statusFilter, sortBy, sortOrder, users, isOnline]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const getRoleIcon = (role) => {
        switch(role) {
            case "Admin": return <FaUserTie className="text-blue-500" />;
            case "System Administrator": return <FaUserShield className="text-indigo-600" />;
            default: return <FaCrown className="text-purple-500" />;
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case "Admin": return "bg-blue-100 text-blue-800";
            case "System Administrator": return "bg-indigo-100 text-indigo-800";
            default: return "bg-purple-100 text-purple-800";
        }
    };

    const getStatusColor = (isOnline) => {
        return isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-indigo-50 lg:p-4 ">

            {showFormDelete && (
                <DeleteUser showForm={setShowFormDelete} id={selectedUser.id} onDeleted={handleUserDeleted} />
            )}
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your team members and their permissions</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                    <button
                        className={`btn gap-2 ${["System Administrator"].includes(role) 
                            ? "btn-primary" 
                            : "cursor-not-allowed"}`}
                    >
                        <FaUserPlus />
                        Add New User
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className={`stats shadow cursor-pointer transition-all hover:shadow-md ${
                        roleFilter === "all" ? "ring-2 ring-indigo-200 bg-indigo-50" : "bg-white"
                    }`}
                    onClick={() => setRoleFilter(roleFilter === "Staff" ? "all" : "Staff")}>
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaUsers className="text-2xl" />
                        </div>
                        <div className="stat-title text-slate-700">Total Users</div>
                        <div className="stat-value text-primary">{users.length}</div>
                    </div>
                </div>

                <div 
                    className={`stats shadow cursor-pointer transition-all hover:shadow-md ${
                        roleFilter === "Staff" ? "ring-2 ring-purple-400 bg-purple-50" : "bg-white"
                    }`}
                    onClick={() => setRoleFilter(roleFilter === "Staff" ? "all" : "Staff")}
                >
                    <div className="stat">
                        <div className="stat-figure text-purple-500">
                            <FaCrown className="text-xl" />
                        </div>
                        <div className="stat-title text-slate-700">Staff Members</div>
                        <div className="stat-value text-purple-500">
                            {users.filter(user => user.role === "Staff").length}
                        </div>
                    </div>
                </div>

                <div 
                    className={`stats shadow cursor-pointer transition-all hover:shadow-md ${
                        roleFilter === "Admin" ? "ring-2 ring-blue-400 bg-blue-50" : "bg-white"
                    }`}
                    onClick={() => setRoleFilter(roleFilter === "Admin" ? "all" : "Admin")}
                >
                    <div className="stat">
                        <div className="stat-figure text-blue-500">
                            <FaUserTie className="text-xl" />
                        </div>
                        <div className="stat-title text-slate-700">Administrators</div>
                        <div className="stat-value text-blue-500">
                            {users.filter(user => user.role === "Admin").length}
                        </div>
                    </div>
                </div>

                <div 
                    className={`stats shadow cursor-pointer transition-all hover:shadow-md ${
                        roleFilter === "System Administrator" ? "ring-2 ring-indigo-400 bg-indigo-50" : "bg-white"
                    }`}
                    onClick={() => setRoleFilter(roleFilter === "System Administrator" ? "all" : "System Administrator")}
                >
                    <div className="stat">
                        <div className="stat-figure text-indigo-500">
                            <FaUserShield className="text-xl" />
                        </div>
                        <div className="stat-title text-slate-700">System Admins</div>
                        <div className="stat-value text-indigo-500">
                            {users.filter(user => user.role === "System Administrator").length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card bg-white shadow-md mb-6">
                <div className="card-body p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="input input-bordered border-1 border-gray-200 bg-white flex items-center gap-2">
                                <FaSearch className="text-slate-700" />
                                <input 
                                    type="text" 
                                    className="grow text-slate-700" 
                                    placeholder="Search users by name, email..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                    
                                />
                                {searchTerm && (
                                    <button 
                                        className="cursor-pointer hover:bg-gray-100 text-slate-700 btn-xs btn-circle"
                                        onClick={() => setSearchTerm("")}
                                    >
                                        ✕
                                    </button>
                                )}
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <select 
                                className="select select-bordered cursor-pointer bg-white text-slate-700 border border-slate-300"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                                <option value="System Administrator">System Admin</option>
                            </select>

                            <select 
                                className="select select-bordered cursor-pointer bg-white text-slate-700 border-slate-300"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* User List */}
            <div className="card bg-white shadow-lg">
                <div className="card-body p-0">
                    <div className="flex justify-between items-center p-4 md:p-6 border-b">
                        <h2 className="card-title text-lg md:text-xl text-slate-700">User Accounts</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{filteredUsers.length} results</span>
                            <div className="dropdown dropdown-bottom dropdown-end">
                                <div tabIndex={0} role="button" className="flex items-center cursor-pointer gap-2">
                                    <FaSort />
                                    Sort
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2  bg-white border border-slate-300 shadow-lg rounded-box w-52">
                                    <li><a onClick={() => handleSort("name")}>Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}</a></li>
                                    <li><a onClick={() => handleSort("role")}>Role {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}</a></li>
                                    <li><a onClick={() => handleSort("status")}>Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}</a></li>
                                    <li><a onClick={() => handleSort("date")}>Date Added {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="mt-4 text-gray-500">Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                                <FaUser className="text-gray-400 text-xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No users found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Try adjusting your search or filter criteria
                            </p>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                    setSearchTerm("");
                                    setRoleFilter("all");
                                    setStatusFilter("all");
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table text-slate-700">
                                <thead className="text-slate-700">
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredUsers.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="hover:bg-indigo-50"
                                            >
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="">
                                                            <div className=" rounded-full w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center  justify-center">

                                                                    <FaUser className="text-xl " />

                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">
                                                                {user.first_name} {user.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`flex items-center w-fit gap-2 px-2 py-2 lg:px-3 lg:py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                        {getRoleIcon(user.role)}
                                                        <span className="hidden lg:block">{user.role}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`flex items-center w-fit gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(isOnline[user.id])}`}>
                                                        <FaCircle className={isOnline[user.id] ? "text-green-500 text-xs" : "text-gray-400 text-xs"} />
                                                        {isOnline[user.id] ? "Online" : "Offline"}
                                                    </div>
                                                </td>
    
                                                <td>
                                                    <div className="flex gap-2 items-center">
                                                        <Link
                                                            to={
                                                                ["Admin", "System Administrator"].includes(role)
                                                                    ? `user?id=${user.id}&role=${user.role}`
                                                                    : "#"
                                                            }
                                                            className="btn btn-ghost btn-sm"
                                                            onClick={(e) => {
                                                                if (!["Admin", "System Administrator"].includes(role))
                                                                    e.preventDefault();
                                                            }}
                                                        >
                                                            <FaEye />
                                                            View
                                                        </Link>
                                                       <td>
    
    {/* Dropdown Menu */}
    <div className="dropdown dropdown-left">
      <div 
        tabIndex={0} 
        role="button" 
        className={`btn btn-ghost btn-sm ${['Admin', 'Staff'].includes(role) ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={(e) => {
          if (['Admin', 'Staff'].includes(role)) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <FaEllipsisV />
      </div>
      
      {!['Admin', 'Staff'].includes(role) && (
        <ul 
          tabIndex={0} 
          className="dropdown-content z-[1] menu p-2 shadow-lg bg-white border border-indigo-100 rounded-box w-40"
        >
          <li><a><FaEdit className="text-yellow-500" /> Edit Role</a></li>
          <li>
            <a 
              className="text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(user);
                setShowFormDelete(true);
              }}
            >
              <FaTrash /> Delete
            </a>
          </li>
        </ul>
      )}
    </div>
  
</td>

                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}