// pages/admin/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Funnel,
  UserPlus,
  Users,
  UserCheck,
  Clock,
  Lock,
  Pen,
  Trash2,
  X,
  UserCog,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department_type: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  initials: string;
  color: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  _id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
  userCount: number;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  department_type: string;
}

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Helper functions
  const getInitials = (name: string): string => {
    if (!name) return '??';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const getColor = (name: string): string => {
    const colors = ['#0F4C81', '#27B3C9', '#7C3AED', '#059669', '#D97706', '#DC2626', '#2563EB', '#0891B2'];
    if (!name) return colors[0];
    const index = (name.length || 0) % colors.length;
    return colors[index];
  };

  const getRoleDisplay = (role: string): string => {
    const roleMap: Record<string, string> = {
      'admin': 'Administrator',
      'recruiter': 'Recruiter',
      'hr_manager': 'HR Manager',
      'hiring_manager': 'Hiring Manager',
      'super_admin': 'Super Admin',
      'user': 'User'
    };
    return roleMap[role] || role;
  };

  // Only Active or Inactive
  const getUserStatus = (user: User): 'Active' | 'Inactive' => {
    return user.isActive ? 'Active' : 'Inactive';
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; dot: string }> = {
      'Active': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Inactive': { bg: 'rgb(243, 244, 246)', color: 'rgb(107, 114, 128)', dot: 'rgb(107, 114, 128)' }
    };
    return styles[status] || styles['Inactive'];
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      'super_admin': 'rgb(220, 38, 38)',
      'hr_manager': 'rgb(37, 99, 235)',
      'recruiter': 'rgb(124, 58, 237)',
      'hiring_manager': 'rgb(22, 163, 74)',
      'admin': 'rgb(217, 119, 6)',
      'user': 'rgb(107, 114, 128)'
    };
    return colors[role] || 'rgb(96, 27, 128)';
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to fetch roles');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRoles(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch roles');
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to view users');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formattedUsers = response.data.data.map((user: any) => ({
        ...user,
        initials: user.initials || getInitials(user.name),
        color: user.color || getColor(user.name)
      }));

      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const status = getUserStatus(user);
    const roleDisplay = getRoleDisplay(user.role);
    
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roleDisplay.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle delete user
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to delete user');
        return;
      }

      await axios.delete(`${API_URL}/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setSaving(false);
    }
  };

  // Handle edit user
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Add User Modal
  const AddUserModal: React.FC = () => {
    const [formData, setFormData] = useState<UserFormData>({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'user',
      department_type: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        setSaving(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('Please login to add user');
          return;
        }

        const response = await axios.post(`${API_URL}/api/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password || 'password123',
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          department_type: formData.department_type
        });

        const newUser = {
          ...response.data.data,
          initials: getInitials(response.data.data.name),
          color: getColor(response.data.data.name)
        };

        setUsers([...users, newUser]);
        setShowAddModal(false);
        toast.success(`User "${formData.name}" added successfully`);
        
        setFormData({
          name: '',
          email: '',
          password: '',
          phoneNumber: '',
          role: 'user',
          department_type: ''
        });
      } catch (error: any) {
        console.error('Error adding user:', error);
        toast.error(error.response?.data?.message || 'Failed to add user');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
        <div className="rounded-2xl p-4 sm:p-6 w-full max-w-md" style={{ background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px' }}>
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="flex items-center justify-center rounded-xl w-10 h-10" style={{ background: 'rgb(96, 27, 128)' }}>
              <UserPlus size={16} stroke="#fff" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[#0D1117] mb-0.5 text-base sm:text-lg font-bold">
                Add New User
              </h3>
              <p className="text-xs sm:text-[12px] text-[#7B8299] font-medium">
                Create a new user account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input 
                  placeholder="Jane Smith" 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <input 
                  type="email"
                  placeholder="jane.smith@rumax.com" 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Password *
                </label>
                <input 
                  type="password"
                  placeholder="Min 8 characters" 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <input 
                  placeholder="+44 7700 900000" 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Department
                </label>
                <select 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.department_type}
                  onChange={(e) => setFormData({...formData, department_type: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                >
                  <option value="">Select department...</option>
                  <option value="hr">Human Resources</option>
                  <option value="recruitment">Recruitment</option>
                  <option value="technology">Technology</option>
                  <option value="product">Product</option>
                  <option value="operations">Operations</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="it">IT</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Assign Role *
                </label>
                <select 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                  required
                >
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <option key={role._id} value={role.name.toLowerCase().replace(/\s/g, '_')}>
                        {role.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="hr_manager">HR Manager</option>
                      <option value="hiring_manager">Hiring Manager</option>
                      <option value="super_admin">Super Admin</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-5">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                style={{ border: '1.5px solid rgb(228, 233, 244)', cursor: 'pointer', color: 'rgb(123, 130, 153)', background: 'rgb(255, 255, 255)' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ 
                  background: saving ? 'rgb(160, 170, 191)' : 'rgb(96, 27, 128)',
                  cursor: saving ? 'not-allowed' : 'pointer', 
                  border: 'none' 
                }}
              >
                {saving ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit User Modal
  const EditUserModal: React.FC = () => {
    if (!selectedUser) return null;

    const [formData, setFormData] = useState({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      phoneNumber: selectedUser.phoneNumber || '',
      role: selectedUser.role || 'user',
      department_type: selectedUser.department_type || '',
      isActive: selectedUser.isActive !== undefined ? selectedUser.isActive : true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        setSaving(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('Please login to update user');
          return;
        }

        const response = await axios.put(`${API_URL}/api/admin/user/${selectedUser._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const updatedUser = {
          ...response.data.data,
          initials: getInitials(response.data.data.name),
          color: getColor(response.data.data.name)
        };

        setUsers(users.map(u => 
          u._id === selectedUser._id ? updatedUser : u
        ));
        setShowEditModal(false);
        setSelectedUser(null);
        toast.success(`User "${formData.name}" updated successfully`);
      } catch (error: any) {
        console.error('Error updating user:', error);
        toast.error(error.response?.data?.message || 'Failed to update user');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
        <div className="rounded-2xl p-4 sm:p-6 w-full max-w-md" style={{ background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px' }}>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl w-10 h-10" style={{ background: 'rgb(96, 27, 128)' }}>
                <UserCog size={16} stroke="#fff" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[#0D1117] mb-0.5 text-base sm:text-lg font-bold">
                  Edit User
                </h3>
                <p className="text-xs sm:text-[12px] text-[#7B8299] font-medium">
                  Update user information
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              className="w-[30px] h-[30px] rounded-lg flex items-center justify-center"
              style={{ background: 'rgb(244, 246, 252)', border: 'none', cursor: 'pointer' }}
            >
              <X size={15} stroke="#7B8299" strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input 
                  placeholder="Jane Smith" 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <input 
                  type="email"
                  placeholder="jane.smith@rumax.com" 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <input 
                  placeholder="+44 7700 900000" 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Department
                </label>
                <select 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.department_type}
                  onChange={(e) => setFormData({...formData, department_type: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                >
                  <option value="">Select department...</option>
                  <option value="hr">Human Resources</option>
                  <option value="recruitment">Recruitment</option>
                  <option value="technology">Technology</option>
                  <option value="product">Product</option>
                  <option value="operations">Operations</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="it">IT</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Role *
                </label>
                <select 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                  required
                >
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <option key={role._id} value={role.name.toLowerCase().replace(/\s/g, '_')}>
                        {role.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="hr_manager">HR Manager</option>
                      <option value="hiring_manager">Hiring Manager</option>
                      <option value="super_admin">Super Admin</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#7B8299] block mb-1.5 uppercase tracking-wider">
                  Account Status
                </label>
                <select 
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] text-[#0D1117] outline-none"
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                  style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-5">
              <button 
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                style={{ border: '1.5px solid rgb(228, 233, 244)', cursor: 'pointer', color: 'rgb(123, 130, 153)', background: 'rgb(255, 255, 255)' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white"
                style={{ 
                  background: saving ? 'rgb(160, 170, 191)' : 'rgb(96, 27, 128)',
                  cursor: saving ? 'not-allowed' : 'pointer', 
                  border: 'none' 
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Filter dropdowns
  const FilterDropdowns: React.FC = () => {
    const roleOptions = roles.length > 0 
      ? [{ value: 'all', label: 'All Roles' }, ...roles.map(r => ({ 
          value: r.name.toLowerCase().replace(/\s/g, '_'), 
          label: r.name 
        }))]
      : [
          { value: 'all', label: 'All Roles' },
          { value: 'super_admin', label: 'Super Admin' },
          { value: 'admin', label: 'Admin' },
          { value: 'hr_manager', label: 'HR Manager' },
          { value: 'hiring_manager', label: 'Hiring Manager' },
          { value: 'recruiter', label: 'Recruiter' },
          { value: 'user', label: 'User' }
        ];

    // Only Active and Inactive statuses
    const statuses = [
      { value: 'all', label: 'All Status' },
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' }
    ];

    return (
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Role Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowStatusDropdown(false);
            }}
            className="flex items-center justify-between gap-2 px-4 rounded-xl w-full sm:w-auto"
            style={{ height: '40px', background: 'rgb(255, 255, 255)', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(123, 130, 153)', cursor: 'pointer' }}
          >
            <div className="flex items-center gap-2">
              <Funnel size={13} stroke="currentColor" strokeWidth={2} />
              {filterRole === 'all' ? 'Role' : getRoleDisplay(filterRole)}
            </div>
            <ChevronDown size={13} stroke="currentColor" strokeWidth={2} />
          </button>
          {showRoleDropdown && (
            <div 
              className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-10 w-full sm:w-auto min-w-[180px]"
              style={{ 
                background: 'white', 
                border: '1px solid rgb(228, 233, 244)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              {roleOptions.map(role => (
                <button
                  key={role.value}
                  onClick={() => {
                    setFilterRole(role.value);
                    setShowRoleDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-[13px]"
                  style={{ 
                    background: filterRole === role.value ? 'rgb(245, 243, 255)' : 'white',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgb(13, 17, 23)'
                  }}
                >
                  {role.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter - Only Active/Inactive */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowRoleDropdown(false);
            }}
            className="flex items-center justify-between gap-2 px-4 rounded-xl w-full sm:w-auto"
            style={{ height: '40px', background: 'rgb(255, 255, 255)', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(123, 130, 153)', cursor: 'pointer' }}
          >
            <span>{filterStatus === 'all' ? 'Status' : filterStatus}</span>
            <ChevronDown size={13} stroke="currentColor" strokeWidth={2} />
          </button>
          {showStatusDropdown && (
            <div 
              className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-10 w-full sm:w-auto min-w-[160px]"
              style={{ 
                background: 'white', 
                border: '1px solid rgb(228, 233, 244)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              {statuses.map(status => (
                <button
                  key={status.value}
                  onClick={() => {
                    setFilterStatus(status.value);
                    setShowStatusDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-[13px]"
                  style={{ 
                    background: filterStatus === status.value ? 'rgb(245, 243, 255)' : 'white',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgb(13, 17, 23)'
                  }}
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Refresh handler
  const handleRefresh = async () => {
    const toastId = toast.loading('Refreshing data...');
    try {
      await Promise.all([fetchUsers(), fetchRoles()]);
      toast.success('Data refreshed successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to refresh data', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h1 className="text-[#0D1117] mb-0.5 text-xl sm:text-2xl font-bold">
            User Management
          </h1>
          <p className="text-[13px] text-[#7B8299] font-medium">
            {users.length} users across all roles
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
          <div 
            className="flex items-center gap-2 px-3.5 rounded-xl w-full sm:w-[220px]"
            style={{ background: 'rgb(255, 255, 255)', border: '1.5px solid rgb(228, 233, 244)', height: '40px' }}
          >
            <Search size={13} stroke="#A0AABF" strokeWidth={2.2} />
            <input 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none bg-transparent text-[13px] text-[#374151] min-w-0"
            />
          </div>
          <FilterDropdowns />
          <button 
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 rounded-xl h-10"
            style={{ background: 'rgb(255, 255, 255)', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(123, 130, 153)', cursor: 'pointer' }}
          >
            <RefreshCw size={13} stroke="currentColor" strokeWidth={2} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 rounded-xl h-10 text-[13px] font-bold text-white"
            style={{ background: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
          >
            <UserPlus size={14} stroke="currentColor" strokeWidth={2} />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Only Active/Inactive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)', boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' }}>
          <div className="flex items-center justify-center rounded-xl shrink-0 w-10 h-10 sm:w-[44px] sm:h-[44px]" style={{ background: 'rgb(238, 241, 251)' }}>
            <Users size={16} stroke="#601B80" strokeWidth={2} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <div>
            <p className="text-xl sm:text-[22px] font-extrabold text-[#601B80] leading-none">{stats.total}</p>
            <p className="text-[11px] sm:text-xs text-[#7B8299] font-medium mt-0.5">Total Users</p>
          </div>
        </div>
        <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)', boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' }}>
          <div className="flex items-center justify-center rounded-xl shrink-0 w-10 h-10 sm:w-[44px] sm:h-[44px]" style={{ background: 'rgb(240, 253, 244)' }}>
            <UserCheck size={16} stroke="#16A34A" strokeWidth={2} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <div>
            <p className="text-xl sm:text-[22px] font-extrabold text-[#16A34A] leading-none">{stats.active}</p>
            <p className="text-[11px] sm:text-xs text-[#7B8299] font-medium mt-0.5">Active</p>
          </div>
        </div>
        <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)', boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' }}>
          <div className="flex items-center justify-center rounded-xl shrink-0 w-10 h-10 sm:w-[44px] sm:h-[44px]" style={{ background: 'rgb(249, 250, 251)' }}>
            <Lock size={16} stroke="#6B7280" strokeWidth={2} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <div>
            <p className="text-xl sm:text-[22px] font-extrabold text-[#6B7280] leading-none">{stats.inactive}</p>
            <p className="text-[11px] sm:text-xs text-[#7B8299] font-medium mt-0.5">Inactive</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)', boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] min-w-[800px]">
            <thead>
              <tr style={{ background: 'rgb(250, 251, 254)', borderBottom: '1px solid rgb(238, 241, 251)' }}>
                <th className="px-3 sm:px-4 py-3 sm:py-[12px] text-left text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-[12px] text-left text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-[12px] text-left text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-[12px] text-left text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider hidden lg:table-cell">
                  Department
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-[12px] text-left text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-[12px] text-left text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider hidden md:table-cell">
                  Last Active
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-[12px] text-left text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 sm:py-[40px] text-center text-[#7B8299]">
                    <p className="text-base font-semibold">No users found</p>
                    <p className="text-[13px] mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const status = getUserStatus(user);
                  const statusStyle = getStatusStyle(status);
                  const roleColor = getRoleColor(user.role);
                  const roleDisplay = getRoleDisplay(user.role);
                  
                  return (
                    <tr 
                      key={user._id} 
                      className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: '1px solid rgb(238, 241, 251)', background: 'rgb(255, 255, 255)' }}
                    >
                      <td className="px-3 sm:px-4 py-3 sm:py-[13px]">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div 
                            className="flex items-center justify-center rounded-xl shrink-0 w-8 h-8 sm:w-9 sm:h-9 text-[10px] sm:text-[11px] font-extrabold text-white"
                            style={{ background: user.color || getColor(user.name), boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                          >
                            {user.initials || getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-bold text-[#0D1117] text-[12px] sm:text-[13px]">{user.name}</p>
                            <p className="text-[11px] sm:hidden text-[#7B8299]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-[13px] text-[#7B8299] font-medium hidden sm:table-cell">
                        {user.email}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-[13px]">
                        <span 
                          className="rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold whitespace-nowrap"
                          style={{ color: roleColor }}
                        >
                          {roleDisplay}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-[13px] text-[#7B8299] font-medium hidden lg:table-cell">
                        {user.department_type ? user.department_type.charAt(0).toUpperCase() + user.department_type.slice(1) : '-'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-[13px]">
                        <span 
                          className="flex items-center gap-1.5 rounded-full px-2 sm:px-3 py-1 w-fit text-[10px] sm:text-[11px] font-bold whitespace-nowrap"
                          style={{ background: statusStyle.bg, color: statusStyle.color }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: statusStyle.dot }} />
                          {status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-[13px] text-[#A0AABF] text-[11px] sm:text-xs font-medium hidden md:table-cell">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-[13px]">
                        <div className="flex gap-1.5 sm:gap-2">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="flex items-center justify-center rounded-xl w-7 h-7 sm:w-8 sm:h-8"
                            style={{ background: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)', cursor: 'pointer', border: 'none' }}
                            title="Edit User"
                          >
                            <Pen size={12} stroke="currentColor" strokeWidth={2} className="sm:w-[13px] sm:h-[13px]" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="flex items-center justify-center rounded-xl w-7 h-7 sm:w-8 sm:h-8"
                            style={{ background: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', cursor: 'pointer', border: 'none' }}
                            title="Delete User"
                          >
                            <Trash2 size={12} stroke="currentColor" strokeWidth={2} className="sm:w-[13px] sm:h-[13px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && <AddUserModal />}

      {/* Edit User Modal */}
      {showEditModal && <EditUserModal />}
    </div>
  );
};

export default UserManagement;