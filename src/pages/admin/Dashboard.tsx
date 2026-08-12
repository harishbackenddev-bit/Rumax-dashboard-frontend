// pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Star,
  ClipboardList,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Funnel,
  Download,
  RefreshCw,
  ArrowUpRight,
  Eye,
  Pen,
  Trash2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '@/components/admin/candidate/ProfileSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardStats {
  totalApplicants: number;
  activeApplicants: number;
  pendingReviews: number;
  activeVacancies: number;
  applicantsGrowth: number;
  activeGrowth: number;
  pendingGrowth: number;
  vacanciesGrowth: number;
}

interface ChartData {
  month: string;
  activeLeads: number;
  converted: number;
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
  initials: string;
  color: string;
}

interface Candidate {
  id: string;
  name: string;
  role: string;
  source: string;
  time: string;
  status: 'New' | 'Contacted' | 'Qualified';
  initials: string;
  color: string;
  _id?: string;
  email?: string;
  phone?: string;
  location?: string;
  availability?: string;
  score?: number;
  createdAt?: string;
  updatedAt?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalApplicants: 0,
    activeApplicants: 0,
    pendingReviews: 0,
    activeVacancies: 0,
    applicantsGrowth: 0,
    activeGrowth: 0,
    pendingGrowth: 0,
    vacanciesGrowth: 0
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        
        setStats({
          totalApplicants: data.totalApplicants || 0,
          activeApplicants: data.activeApplicants || 0,
          pendingReviews: data.pendingReviews || 0,
          activeVacancies: data.activeVacancies || 0,
          applicantsGrowth: data.applicantsGrowth || 0,
          activeGrowth: data.activeGrowth || 0,
          pendingGrowth: data.pendingGrowth || 0,
          vacanciesGrowth: data.vacanciesGrowth || 0
        });

        setChartData(data.chartData || []);
        setPieData(data.pieData || []);
        setTotalCandidates(data.totalCandidates || 0);
        setUsers(data.users || []);
        setCandidates(data.candidates || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardStats();
  };

  // Handle view profile
  const handleViewProfile = (candidate: Candidate) => {
    // Convert dashboard candidate to full candidate object
    const fullCandidate = {
      _id: candidate.id || candidate._id,
      id: candidate.id || candidate._id,
      firstName: candidate.name?.split(' ')[0] || '',
      lastName: candidate.name?.split(' ').slice(1).join(' ') || '',
      name: candidate.name || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      role: candidate.role || '',
      positionAppliedFor: candidate.role || '',
      location: candidate.location || '',
      preferredLocations: candidate.location ? [candidate.location] : [],
      availability: candidate.availability || 'N/A',
      workPreference: candidate.availability || 'N/A',
      appliedDate: candidate.createdAt || new Date().toISOString(),
      score: candidate.score || 0,
      status: candidate.status as any || 'Pending',
      initials: candidate.initials || '',
      color: candidate.color || '#0F4C81',
      createdAt: candidate.createdAt || '',
      updatedAt: candidate.updatedAt || ''
    };
    
    setSelectedCandidate(fullCandidate as any);
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedCandidate(null);
  };

  const statCards = [
    {
      title: "Total Applicants",
      value: stats.totalApplicants.toLocaleString(),
      change: `${stats.applicantsGrowth > 0 ? '+' : ''}${stats.applicantsGrowth}%`,
      isPositive: stats.applicantsGrowth >= 0,
      icon: Users,
      bgColor: "rgb(96, 27, 128)",
      valueColor: "rgb(96, 27, 128)"
    },
    {
      title: "Active Applicants",
      value: stats.activeApplicants.toLocaleString(),
      change: `${stats.activeGrowth > 0 ? '+' : ''}${stats.activeGrowth}%`,
      isPositive: stats.activeGrowth >= 0,
      icon: Star,
      bgColor: "rgb(27, 34, 128)",
      valueColor: "rgb(27, 34, 128)"
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews.toLocaleString(),
      change: `${stats.pendingGrowth > 0 ? '+' : ''}${stats.pendingGrowth}%`,
      isPositive: stats.pendingGrowth >= 0,
      icon: ClipboardList,
      bgColor: "rgb(217, 119, 6)",
      valueColor: "rgb(217, 119, 6)"
    },
    {
      title: "Active Vacancies",
      value: stats.activeVacancies.toLocaleString(),
      change: `${stats.vacanciesGrowth > 0 ? '+' : ''}${stats.vacanciesGrowth}%`,
      isPositive: stats.vacanciesGrowth >= 0,
      icon: Briefcase,
      bgColor: "rgb(5, 150, 105)",
      valueColor: "rgb(5, 150, 105)"
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: 'rgb(236, 253, 245)', color: 'rgb(5, 150, 105)' };
      case 'Inactive':
        return { bg: 'rgb(243, 244, 246)', color: 'rgb(156, 163, 175)' };
      case 'New':
        return { bg: 'rgb(238, 244, 255)', color: 'rgb(59, 130, 246)' };
      case 'Contacted':
        return { bg: 'rgb(255, 251, 235)', color: 'rgb(217, 119, 6)' };
      case 'Qualified':
        return { bg: 'rgb(236, 253, 245)', color: 'rgb(5, 150, 105)' };
      default:
        return { bg: 'rgb(243, 244, 246)', color: 'rgb(156, 163, 175)' };
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-gray-600">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Welcome back 👋 Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2.5 bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 transition-colors"
          >
            <RefreshCw size={15} stroke="currentColor" strokeWidth={2} />
            Refresh
          </button>
          <button
            className="flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2.5 border border-gray-200 bg-white text-sm text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <Download size={15} stroke="currentColor" strokeWidth={2} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="rounded-2xl p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center rounded-xl w-11 h-11"
                style={{ background: stat.bgColor }}
              >
                <stat.icon size={18} stroke="#fff" strokeWidth={2} />
              </div>
              <span
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                style={{
                  background: stat.isPositive ? 'rgb(236, 253, 245)' : 'rgb(254, 242, 242)',
                  color: stat.isPositive ? 'rgb(5, 150, 105)' : 'rgb(220, 38, 38)'
                }}
              >
                {stat.isPositive ? (
                  <TrendingUp size={10} stroke="currentColor" strokeWidth={2} />
                ) : (
                  <TrendingDown size={10} stroke="currentColor" strokeWidth={2} />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold leading-none tracking-tight" style={{ color: stat.valueColor }}>
              {stat.value}
            </p>
            <p className="text-sm font-bold text-gray-900 mt-1.5">
              {stat.title}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-5">
        {/* Lead Conversion Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-5 gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Lead Conversion Overview
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Showing data for last 12 months
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-none border-none cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  Active Leads
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-none border-none cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  Converted
                </button>
              </div>
              <button className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 border border-gray-200 text-xs font-semibold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">
                <Funnel size={11} stroke="currentColor" strokeWidth={2} />
                Filter
              </button>
            </div>
          </div>
          <div className="w-full h-[200px] sm:h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convertedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#A0AABF' }}
                  axisLine={{ stroke: '#F0F2F9' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#A0AABF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="converted"
                  stroke="#10B981"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#convertedGrad)"
                  name="Converted"
                />
                <Area
                  type="monotone"
                  dataKey="activeLeads"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#activeGrad)"
                  name="Active Leads"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Pipeline Funnel
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Candidate status overview
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              <Funnel size={16} />
              Filter
            </button>
          </div>

          <div className="relative flex justify-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <h2 className="text-4xl font-extrabold text-gray-900">
                {totalCandidates}
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Total Candidates
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {pieData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgb(255, 255, 255)',
        border: '1px solid rgb(228, 233, 244)',
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px'
      }}>
        <div className="px-4 sm:px-6 pt-5 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                User Management
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Active users
              </p>
            </div>
            <button 
              onClick={() => navigate('/admin/user-management')}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight size={13} stroke="currentColor" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'rgb(250, 251, 254)', borderBottom: '1px solid rgb(238, 241, 251)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  NAME
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  USERNAME
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  EMAIL
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  ROLE
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  DEPARTMENT
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  STATUS
                </th>
                {/* <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  ACTIONS
                </th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const statusStyle = getStatusStyle(user.status);
                return (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: index === users.length - 1 ? 'none' : '1px solid rgb(238, 241, 251)',
                      background: 'rgb(255, 255, 255)',
                      transition: 'background 0.12s'
                    }}
                    className="hover:bg-gray-50"
                  >
                    <td style={{ padding: '13px 16px' }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-xl shrink-0"
                          style={{ width: '34px', height: '34px', background: user.color, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                        >
                          <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>
                            {user.initials}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontWeight: 700, color: 'rgb(13, 17, 23)' }}>
                            {user.name}
                          </span>
                          <div style={{ fontSize: '11px', color: 'rgb(160, 170, 191)', fontWeight: 500 }}>
                            ID: #{user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                      {user.username}
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontWeight: 700, color: 'rgb(13, 17, 23)' }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                      {user.department}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span
                        className="rounded-full px-3 py-1 w-fit inline-flex"
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    {/* <td style={{ padding: '13px 16px' }}>
                      <div className="flex gap-1.5">
                        <button
                          className="flex items-center justify-center rounded-xl"
                          title="View"
                          style={{ width: '30px', height: '30px', background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
                        >
                          <Eye size={13} stroke="currentColor" strokeWidth={2} />
                        </button>
                        <button
                          className="flex items-center justify-center rounded-xl"
                          title="Edit"
                          style={{ width: '30px', height: '30px', background: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)', cursor: 'pointer', border: 'none' }}
                        >
                          <Pen size={13} stroke="currentColor" strokeWidth={2} />
                        </button>
                        <button
                          className="flex items-center justify-center rounded-xl"
                          title="Delete"
                          style={{ width: '30px', height: '30px', background: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', cursor: 'pointer', border: 'none' }}
                        >
                          <Trash2 size={13} stroke="currentColor" strokeWidth={2} />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Candidates Table */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgb(255, 255, 255)',
        border: '1px solid rgb(228, 233, 244)',
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px'
      }}>
        <div className="px-4 sm:px-6 pt-5 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Recent Candidates
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Latest incoming applicants
              </p>
            </div>
            <button 
              onClick={() => navigate('/admin/candidates')}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight size={13} stroke="currentColor" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'rgb(250, 251, 254)', borderBottom: '1px solid rgb(238, 241, 251)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  NAME
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  ROLE
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  SOURCE
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  TIME
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  STATUS
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => {
                const statusStyle = getStatusStyle(candidate.status);
                return (
                  <tr
                    key={candidate.id}
                    style={{
                      borderBottom: index === candidates.length - 1 ? 'none' : '1px solid rgb(238, 241, 251)',
                      background: 'rgb(255, 255, 255)',
                      transition: 'background 0.12s'
                    }}
                    className="hover:bg-gray-50"
                  >
                    <td style={{ padding: '13px 16px' }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-xl shrink-0"
                          style={{ width: '34px', height: '34px', background: candidate.color, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                        >
                          <span style={{ color: '#0F4C81', fontSize: '11px', fontWeight: 800 }}>
                            {candidate.initials}
                          </span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'rgb(13, 17, 23)' }}>
                          {candidate.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                      {candidate.role}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span className="rounded-lg px-2.5 py-1" style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        background: 'rgb(238, 241, 251)',
                        color: 'rgb(96, 27, 128)'
                      }}>
                        {candidate.source}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', color: 'rgb(160, 170, 191)', fontSize: '12px', fontWeight: 500 }}>
                      {candidate.time}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span
                        className="rounded-full px-3 py-1 w-fit inline-flex"
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div className="flex gap-1.5">
                        <button
                          className="flex items-center justify-center rounded-xl"
                          title="View Profile"
                          style={{ width: '30px', height: '30px', background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
                          onClick={() => handleViewProfile(candidate)}
                        >
                          <Eye size={13} stroke="currentColor" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar
        candidate={selectedCandidate}
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        onStatusUpdate={() => {
          // Refresh dashboard data after status update
          fetchDashboardStats();
        }}
      />
    </div>
  );
};

export default AdminDashboard;