// components/admin/settings/RolesPermissions.tsx
import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  UserCog,
  Search,
  ClipboardList,
  Users,
  Plus,
  Check,
  Minus,
  X,
  Lock,
  UserPlus,
  Trash2,
  Edit,
  RefreshCw,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

interface Role {
  _id: string;
  name: string;
  description: string;
  color: string;
  userCount: number;
  isActive: boolean;
  isDefault: boolean;
  permissions: Permission[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const RolesPermissions = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    color: '#2563EB',
    permissions: [] as Permission[]
  });

  const modules = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'recruitment_pipeline', label: 'Recruitment Pipeline' },
    { id: 'jobs_vacancies', label: 'Jobs & Vacancies' },
    { id: 'employees', label: 'Employees' },
    { id: 'reports_analytics', label: 'Reports & Analytics' },
    { id: 'user_management', label: 'User Management' },
    { id: 'roles_permissions', label: 'Roles & Permissions' },
    { id: 'settings', label: 'Settings' }
  ];

  const colorOptions = [
    { color: '#DC2626', label: 'Red' },
    { color: '#2563EB', label: 'Blue' },
    { color: '#7C3AED', label: 'Purple' },
    { color: '#16A34A', label: 'Green' },
    { color: '#D97706', label: 'Amber' },
    { color: '#EC4899', label: 'Pink' },
    { color: '#0891B2', label: 'Cyan' },
    { color: '#6B7280', label: 'Gray' }
  ];

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view roles');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRoles(response.data.data);

      // Select first role by default
      if (response.data.data.length > 0 && !selectedRole) {
        setSelectedRole(response.data.data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Initialize default roles
  const initializeDefaultRoles = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/admin/roles/initialize`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Default roles initialized successfully');
      fetchRoles();
    } catch (error: any) {
      console.error('Error initializing roles:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize roles');
    } finally {
      setSaving(false);
    }
  };

  // Get default permissions for a module
  const getDefaultPermissions = (moduleId: string): Permission => {
    return {
      module: moduleId,
      view: false,
      create: false,
      edit: false,
      delete: false,
      export: false
    };
  };

  // Toggle permission
  const togglePermission = (moduleId: string, action: keyof Permission) => {
    if (!selectedRole) return;

    const updatedPermissions = selectedRole.permissions.map((perm) => {
      if (perm.module === moduleId) {
        return { ...perm, [action]: !perm[action] };
      }
      return perm;
    });

    // If module doesn't have permissions, add it
    if (!updatedPermissions.find((p) => p.module === moduleId)) {
      const newPerm = getDefaultPermissions(moduleId);
      newPerm[action] = true;
      updatedPermissions.push(newPerm);
    }

    setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
  };

  // Save permissions
  const savePermissions = async () => {
    if (!selectedRole) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/admin/roles/${selectedRole._id}/permissions`,
        {
          permissions: selectedRole.permissions
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Permissions updated successfully');
      fetchRoles();
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast.error(error.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  // Create role
  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      // Add default permissions for all modules
      const permissions = modules.map((module) => ({
        module: module.id,
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false
      }));

      const response = await axios.post(
        `${API_URL}/api/admin/roles`,
        {
          name: newRole.name,
          description: newRole.description,
          color: newRole.color,
          permissions
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(`Role "${newRole.name}" created successfully!`);
      setShowCreateModal(false);
      setNewRole({ name: '', description: '', color: '#2563EB', permissions: [] });
      fetchRoles();
    } catch (error: any) {
      console.error('Error creating role:', error);
      toast.error(error.response?.data?.message || 'Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  // Delete role
  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Role deleted successfully');
      if (selectedRole?._id === roleId) {
        setSelectedRole(null);
      }
      fetchRoles();
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast.error(error.response?.data?.message || 'Failed to delete role');
    } finally {
      setSaving(false);
    }
  };

  // Edit role
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowEditModal(true);
  };

  // Save edited role
  const handleSaveEdit = async () => {
    if (!editingRole) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      await axios.put(
        `${API_URL}/api/admin/roles/${editingRole._id}`,
        {
          name: editingRole.name,
          description: editingRole.description,
          color: editingRole.color
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Role updated successfully');
      setShowEditModal(false);
      setEditingRole(null);
      fetchRoles();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  // Edit Role Modal
  const EditRoleModal = () => {
    if (!editingRole) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
        <div className="w-full max-w-[420px]" style={{ background: 'rgb(255, 255, 255)', borderRadius: '16px', padding: '24px sm:28px', boxShadow: 'rgba(0, 0, 0, 0.18) 0px 12px 48px' }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-base sm:text-[16px] font-extrabold text-[#0D1117]">Edit Role</p>
            <button
              onClick={() => setShowEditModal(false)}
              className="p-1 text-[#A0AABF] hover:text-[#7B8299]"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} stroke="currentColor" strokeWidth={2} />
            </button>
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              Role Name
            </label>
            <input
              placeholder="e.g. Compliance Manager"
              value={editingRole.name}
              onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] text-[#0D1117] outline-none"
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
            />
          </div>

          <div className="mb-5">
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <input
              placeholder="Brief description of this role"
              value={editingRole.description || ''}
              onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] text-[#0D1117] outline-none"
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
            />
          </div>

          <div className="mb-6">
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-2.5 uppercase tracking-wider">
              Role Color
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  onClick={() => setEditingRole({ ...editingRole, color: option.color })}
                  title={option.label}
                  className="w-8 h-8 rounded-lg shrink-0 transition-all"
                  style={{
                    background: option.color,
                    border: editingRole.color === option.color ? '3px solid rgb(13, 17, 23)' : '3px solid transparent',
                    cursor: 'pointer',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 sm:px-[18px] py-2 sm:py-[9px] rounded-lg text-[13px] font-bold"
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(255, 255, 255)', color: 'rgb(123, 130, 153)', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="flex items-center justify-center gap-1.5 px-5 sm:px-[20px] py-2 sm:py-[9px] rounded-lg text-[13px] font-bold"
              style={{
                background: saving ? 'rgb(228, 233, 244)' : 'rgb(96, 27, 128)',
                color: saving ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)',
                cursor: saving ? 'not-allowed' : 'pointer',
                border: 'none'
              }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Create Role Modal
  const CreateRoleModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-[420px]" style={{ background: 'rgb(255, 255, 255)', borderRadius: '16px', padding: '24px sm:28px', boxShadow: 'rgba(0, 0, 0, 0.18) 0px 12px 48px' }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-base sm:text-[16px] font-extrabold text-[#0D1117]">Create New Role</p>
          <button
            onClick={() => setShowCreateModal(false)}
            className="p-1 text-[#A0AABF] hover:text-[#7B8299]"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} stroke="currentColor" strokeWidth={2} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
            Role Name *
          </label>
          <input
            placeholder="e.g. Compliance Manager"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] text-[#0D1117] outline-none"
            style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
          />
        </div>

        <div className="mb-5">
          <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
            Description
          </label>
          <input
            placeholder="Brief description of this role"
            value={newRole.description}
            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] text-[#0D1117] outline-none"
            style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)' }}
          />
        </div>

        <div className="mb-6">
          <label className="text-[11px] font-bold text-[#A0AABF] block mb-2.5 uppercase tracking-wider">
            Role Color
          </label>
          <div className="flex gap-2.5 flex-wrap">
            {colorOptions.map((option) => (
              <button
                key={option.color}
                onClick={() => setNewRole({ ...newRole, color: option.color })}
                title={option.label}
                className="w-8 h-8 rounded-lg shrink-0 transition-all"
                style={{
                  background: option.color,
                  border: newRole.color === option.color ? '3px solid rgb(13, 17, 23)' : '3px solid transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-4 sm:px-[18px] py-2 sm:py-[9px] rounded-lg text-[13px] font-bold"
            style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(255, 255, 255)', color: 'rgb(123, 130, 153)', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateRole}
            disabled={saving || !newRole.name.trim()}
            className="flex items-center justify-center gap-1.5 px-5 sm:px-[20px] py-2 sm:py-[9px] rounded-lg text-[13px] font-bold"
            style={{
              background: saving || !newRole.name.trim() ? 'rgb(228, 233, 244)' : 'rgb(96, 27, 128)',
              color: saving || !newRole.name.trim() ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)',
              cursor: saving || !newRole.name.trim() ? 'not-allowed' : 'pointer',
              border: 'none'
            }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
            {saving ? 'Creating...' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  // Get selected role data
  const getSelectedRoleData = () => {
    if (selectedRole) return selectedRole;
    return roles.find(r => r.name === 'HR Manager') || roles[0];
  };

  const currentRole = getSelectedRoleData();

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <h1 className="text-[#0D1117] mb-0.5 text-xl sm:text-2xl font-bold">
              Roles & Permissions
            </h1>
            <p className="text-[13px] text-[#7B8299] font-medium">
              {roles.length} roles configured across all modules
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={initializeDefaultRoles}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-4 rounded-xl h-10 text-[13px]"
              style={{
                background: 'rgb(255, 255, 255)',
                border: '1.5px solid rgb(228, 233, 244)',
                color: 'rgb(123, 130, 153)',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={saving ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Initialize Default</span>
              <span className="sm:hidden">Init Default</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-4 rounded-xl h-10 text-[13px] font-bold text-white"
              style={{ background: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none', borderRadius: '8px' }}
            >
              <Plus size={14} stroke="currentColor" strokeWidth={2} />
              <span className="hidden sm:inline">Create Role</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {roles.map((role) => {
            const isActive = selectedRole?._id === role._id;
            return (
              <button
                key={role._id}
                onClick={() => setSelectedRole(role)}
                className="rounded-2xl p-4 sm:p-5 text-left transition-all relative overflow-hidden group w-full"
                style={{
                  background: 'rgb(255, 255, 255)',
                  border: isActive ? `2px solid ${role.color}` : '1.5px solid rgb(228, 233, 244)',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: isActive ? `rgba(0, 0, 0, 0.12) 0px 4px 20px` : 'rgba(0, 0, 0, 0.04) 0px 1px 4px',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  transition: '0.2s'
                }}
              >
                <div className="relative">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      {role.name === 'Super Admin' && <ShieldAlert size={20} stroke={isActive ? role.color : '#DC2626'} strokeWidth={1.8} className="sm:w-[22px] sm:h-[22px]" />}
                      {role.name === 'HR Manager' && <UserCog size={20} stroke={isActive ? role.color : '#2563EB'} strokeWidth={1.8} className="sm:w-[22px] sm:h-[22px]" />}
                      {role.name === 'Recruiter' && <Search size={20} stroke={isActive ? role.color : '#7C3AED'} strokeWidth={1.8} className="sm:w-[22px] sm:h-[22px]" />}
                      {role.name === 'Hiring Manager' && <ClipboardList size={20} stroke={isActive ? role.color : '#16A34A'} strokeWidth={1.8} className="sm:w-[22px] sm:h-[22px]" />}
                      {!['Super Admin', 'HR Manager', 'Recruiter', 'Hiring Manager'].includes(role.name) && (
                        <Shield size={20} stroke={isActive ? role.color : '#6B7280'} strokeWidth={1.8} className="sm:w-[22px] sm:h-[22px]" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 rounded-full px-1.5 sm:px-2 py-0.5" style={{
                      background: isActive ? `${role.color}15` : 'rgb(243, 244, 246)'
                    }}>
                      <Users size={9} stroke={isActive ? role.color : '#6B7280'} strokeWidth={2} className="sm:w-[10px] sm:h-[10px]" />
                      <span className="text-[9px] sm:text-[10px] font-bold" style={{ color: isActive ? role.color : '#6B7280' }}>
                        {role.userCount || 0}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] sm:text-[13.5px] font-extrabold mb-0.5 sm:mb-1" style={{
                    color: isActive ? role.color : 'rgb(13, 17, 23)'
                  }}>
                    {role.name}
                  </p>
                  <p className="text-[11px] sm:text-[11.5px] leading-relaxed" style={{
                    color: isActive ? role.color : 'rgb(123, 130, 153)',
                    fontWeight: isActive ? 600 : 500
                  }}>
                    {role.description || 'No description'}
                  </p>
                  {role.isDefault && (
                    <span className="text-[9px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded mt-2 inline-block">
                      Default
                    </span>
                  )}
                </div>
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditRole(role);
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Edit Role"
                  >
                    <Edit size={13} stroke="#6B7280" className="sm:w-[14px] sm:h-[14px]" />
                  </button>
                  {!role.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role._id);
                      }}
                      className="p-1 rounded hover:bg-red-50"
                      title="Delete Role"
                    >
                      <Trash2 size={13} stroke="#DC2626" className="sm:w-[14px] sm:h-[14px]" />
                    </button>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Permission Matrix */}
        {currentRole && (
          <div className="rounded-2xl overflow-hidden" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(228, 233, 244)',
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px'
          }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0" style={{ borderBottom: '1px solid rgb(238, 241, 251)', background: 'rgb(250, 251, 254)' }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-xl w-9 h-9" style={{
                  background: currentRole.color || '#2563EB',
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px'
                }}>
                  <Shield size={16} stroke="#fff" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-[#0D1117] mb-0.5 text-[14px] sm:text-[15px] font-bold">
                    Permission Matrix
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-[#7B8299] font-medium">
                    Access level for <span style={{
                      color: currentRole.color || '#2563EB',
                      fontWeight: 700
                    }}>{currentRole.name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={savePermissions}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl w-full sm:w-auto text-[11px] sm:text-[12px] font-bold"
                style={{
                  background: saving ? 'rgb(228, 233, 244)' : 'rgb(96, 27, 128)',
                  color: saving ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {saving ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px] min-w-[600px]">
                <thead>
                  <tr style={{ background: 'rgb(250, 251, 254)', borderBottom: '1px solid rgb(238, 241, 251)' }}>
                    <th className="px-4 sm:px-5 py-2.5 sm:py-[11px] text-left text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider min-w-[120px] sm:min-w-[150px]">
                      Module
                    </th>
                    <th className="px-2 sm:px-4 py-2.5 sm:py-[11px] text-center text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                      View
                    </th>
                    <th className="px-2 sm:px-4 py-2.5 sm:py-[11px] text-center text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                      Create
                    </th>
                    <th className="px-2 sm:px-4 py-2.5 sm:py-[11px] text-center text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                      Edit
                    </th>
                    <th className="px-2 sm:px-4 py-2.5 sm:py-[11px] text-center text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                      Delete
                    </th>
                    <th className="px-2 sm:px-4 py-2.5 sm:py-[11px] text-center text-[11px] font-bold text-[#A0AABF] uppercase tracking-wider">
                      Export
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module, idx) => {
                    const isEven = idx % 2 === 0;
                    const permission = currentRole.permissions?.find(p => p.module === module.id) || {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                      export: false
                    };

                    return (
                      <tr key={idx} style={{
                        borderBottom: idx === modules.length - 1 ? 'none' : '1px solid rgb(238, 241, 251)',
                        background: isEven ? 'rgb(255, 255, 255)' : 'rgb(250, 251, 254)',
                        transition: 'background 0.12s'
                      }}>
                        <td className="px-4 sm:px-5 py-3 sm:py-[13px] font-bold text-[#0D1117] text-[12px] sm:text-[13px]">
                          {module.label}
                        </td>
                        {['view', 'create', 'edit', 'delete', 'export'].map((action) => {
                          const hasPermission = permission[action as keyof Permission];
                          return (
                            <td key={action} className="px-2 sm:px-4 py-3 sm:py-[13px] text-center">
                              <button
                                onClick={() => togglePermission(module.id, action as keyof Permission)}
                                className="flex items-center justify-center mx-auto transition-all hover:scale-110 w-8 h-8 rounded-lg"
                                style={{
                                  background: hasPermission ? 'rgb(240, 253, 244)' : 'rgb(254, 242, 242)',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                {hasPermission ? (
                                  <Check size={13} stroke="#16A34A" strokeWidth={2.5} className="sm:w-[14px] sm:h-[14px]" />
                                ) : (
                                  <Minus size={13} stroke="#DC2626" strokeWidth={2.5} className="sm:w-[14px] sm:h-[14px]" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreateRoleModal />}
      {showEditModal && <EditRoleModal />}
    </>
  );
};

export default RolesPermissions;