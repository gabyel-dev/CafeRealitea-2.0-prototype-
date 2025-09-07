import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUsers, FaUser, FaSearch, FaCrown, FaUserShield, FaUserTie, FaUserPlus,
  FaEye, FaEdit, FaTrash, FaEllipsisV, FaSort, FaPlus
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DeleteUser from "../../component/DeleteUserModal";
import { io } from "socket.io-client";
import EditUserRole from "../../component/EditUserRoleModal";
import CreateUserModal from "../../component/CreateUserModal";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentUser, setCurrentUser] = useState(null);
  const [isOnline, setIsOnline] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFormDelete, setShowFormDelete] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false)
  const [onlineStatusError, setOnlineStatusError] = useState(false);
  const [role, setRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const socketRef = useRef(null);
  const navigate = useNavigate();

  // -------------------- CHECK LOGIN --------------------
  useEffect(() => {
    axios.get('https://caferealitea.onrender.com/user', { withCredentials: true })
      .then(res => {
        const { logged_in, role, id } = res.data;
        setRole(role);
        if (!logged_in || !role) navigate('/');
        else setCurrentUser({ id, role });
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  // -------------------- SOCKET + FETCH USERS --------------------
  useEffect(() => {
  if (!currentUser) return;

  console.log("Initializing socket connection for user:", currentUser.id);
  
  const socket = io('https://caferealitea.onrender.com', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });
  socketRef.current = socket;

  // Add error handling for socket connection
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    setOnlineStatusError(true);
  });

  socket.on('connect', () => {
    console.log("Socket connected, emitting user_online");
    socket.emit('user_online', { user_id: String(currentUser.id) }); // Ensure user_id is string
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  const fetchUsers = async () => {
  setIsLoading(true);
  try {
    const [usersRes, onlineRes] = await Promise.all([
      axios.get('https://caferealitea.onrender.com/users_account', { withCredentials: true }),
      axios.get('https://caferealitea.onrender.com/online_users', { withCredentials: true })
    ]);

    const usersData = usersRes.data;
    setUsers(usersData);
    setFilteredUsers(usersData);

    // ✅ Corrected online status map
    const onlineMap = {};
    usersData.forEach(u => {
      onlineMap[u.id] = onlineRes.data.online_users.includes(String(u.id));
    });
    setIsOnline(onlineMap);

    setIsLoading(false);
    setOnlineStatusError(false);
  } catch (err) {
    console.error('Error fetching users or online status:', err);
    setIsLoading(false);
    setOnlineStatusError(true);
  }
};

  fetchUsers();

  // Visibility change handling
  const handleVisibilityChange = () => {
    if (!socketRef.current) return;
    if (document.visibilityState === "visible") {
      socketRef.current.emit('user_online', { user_id: currentUser.id });
      setIsOnline(prev => ({ ...prev, [currentUser.id]: true }));
    } else {
      socketRef.current.emit('user_offline', { user_id: currentUser.id });
      setIsOnline(prev => ({ ...prev, [currentUser.id]: false }));
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Cleanup function (single return)
   return () => {   
    if (socket) {
      socket.emit('user_offline', { user_id: currentUser.id });
      socket.disconnect();
    }
  };
}, [currentUser]);


  // -------------------- FILTER & SORT --------------------
  useEffect(() => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter(u => 
        u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter);
    if (statusFilter !== 'all') result = result.filter(u => 
      statusFilter === 'online' ? isOnline[u.id] ?? false : !(isOnline[u.id] ?? false)
    );

    result.sort((a, b) => {
      let aVal, bVal;
      switch(sortBy) {
        case 'name':
          aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
          bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'role':
          aVal = a.role;
          bVal = b.role;
          break;
        case 'status':
          aVal = isOnline[a.id] ? 1 : 0;
          bVal = isOnline[b.id] ? 1 : 0;
          break;
        default:
          aVal = a[sortBy];
          bVal = b[sortBy];
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder, isOnline]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleUserDeleted = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setFilteredUsers(prev => prev.filter(u => u.id !== id));
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

  const getStatusColor = (online) => online ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-800 border border-gray-200";

  return (
    <div className="min-h-screen bg-indigo-50 lg:p-4">
      {showFormDelete && selectedUser && (
        <DeleteUser showForm={setShowFormDelete} id={selectedUser.id} onDeleted={handleUserDeleted} />
      )}

      {showFormEdit && selectedUser && (
        <EditUserRole showForm={setShowFormEdit} id={selectedUser.id} />
      )}

      {isModalOpen && (
        <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}


      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 md:p-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold md:mb-4 text-gray-800">User Management</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {/* <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{Object.values(isOnline).filter(Boolean).length} users online</span>
            {onlineStatusError && <span className="text-xs text-orange-500">(Limited status info)</span>} */}
          </div>
        </div>
        
        {/* Desktop Add Button - Hidden on mobile */}
        <div className="hidden md:block mt-4 md:mt-0">
          <button
          onClick={() => setIsModalOpen(true)}
            className={`btn mb-4 gap-2 ${["System Administrator"].includes(role) ? "btn-primary" : "cursor-not-allowed opacity-50"}`}
            disabled={!["System Administrator"].includes(role)}
          >
            <FaUserPlus /> Add New User
          </button>
        </div>
      </div>

      {/* Mobile Add Button - Floating Action Button */}
      {["System Administrator"].includes(role) && (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <button
          onClick={() => setIsModalOpen(true)}
            className="btn btn-circle btn-primary shadow-lg w-14 h-14"
            title="Add New User"
          >
            <FaPlus className="text-xl" />
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`stats shadow cursor-pointer transition-all hover:shadow-md ${
            roleFilter === "all" ? "ring-2 ring-indigo-200 bg-indigo-50" : "bg-white"
          }`}
            onClick={() => setRoleFilter(roleFilter === "all" ? "all" : "all")}>
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
                              <div className="w-[35px] h-[35px] border-1 border-indigo-600 mr-1 p-[1.5px] rounded-full overflow-hidden flex items-center justify-center">
                                <img 
                                  src={`https://caferealitea.onrender.com/profile-image/${user.id}`} 
                                  alt="profile" 
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z' clip-rule='evenodd' /%3E%3C/svg%3E";
                                  }}
                                />
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
                          <div className={`flex items-center w-fit gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(isOnline[user.id] ?? false)}`}>
                            <div className={`w-2 h-2 rounded-full ${isOnline[user.id] ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
                            <span>{isOnline[user.id] ? "Online" : "Offline"}</span>
                            {isOnline[user.id] && <span className="text-xs text-green-600">• Live</span>}
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
                              
                              {showFormEdit || !showFormDelete && ['System Administrator'].includes(role) && (
                                <ul 
                                tabIndex={0} 
                                className="dropdown-content z-[1] menu p-2 shadow-lg bg-white border border-indigo-100 rounded-box w-40"
                                >
                                <li>
                                  <a
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setShowFormEdit(true);
                                  }}
                                  >
                                  <FaEdit className="text-yellow-500" /> Edit Role
                                  </a>
                                </li>
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