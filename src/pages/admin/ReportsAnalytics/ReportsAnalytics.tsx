// pages/admin/ReportsAnalytics.tsx
import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Target,
  Clock,
  PoundSterling,
  ChartNoAxesColumn,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  UserPlus,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface JobPerformance {
  title: string;
  views: number;
  applications: number;
  hired: number;
  conversion: number;
}

const ReportsAnalytics = () => {
  const [timeRange, setTimeRange] = useState('This Month');

  // Mock data
  const hiringData = [
    { month: 'Jan', hires: 4, leavers: 1 },
    { month: 'Feb', hires: 6, leavers: 0 },
    { month: 'Mar', hires: 3, leavers: 2 },
    { month: 'Apr', hires: 8, leavers: 1 },
    { month: 'May', hires: 5, leavers: 3 },
    { month: 'Jun', hires: 7, leavers: 1 }
  ];

  const sourceData = [
    { name: 'LinkedIn', value: 38, color: '#2563EB' },
    { name: 'Indeed', value: 24, color: '#7C3AED' },
    { name: 'Referral', value: 18, color: '#16A34A' },
    { name: 'Website', value: 12, color: '#D97706' },
    { name: 'Agency', value: 8, color: '#0891B2' }
  ];

  const pageVisitors = [
    { page: 'Google Profile', visitors: 4800 },
    { page: 'Home Page', visitors: 3600 },
    { page: 'Domiciliary', visitors: 2100 },
    { page: 'Clinical Trials', visitors: 1800 },
    { page: 'Supported Living', visitors: 1400 },
    { page: 'Training Services', visitors: 1200 },
    { page: 'Careers', visitors: 950 },
    { page: 'Mobile Res. Nurse', visitors: 750 },
    { page: 'Contact', visitors: 600 },
    { page: 'Testimonials', visitors: 450 }
  ];

  const jobPerformanceData: JobPerformance[] = [
    { title: 'Research Nurse', views: 731, applications: 67, hired: 4, conversion: 6.0 },
    { title: 'Senior Res. Nurse', views: 412, applications: 34, hired: 2, conversion: 5.9 },
    { title: 'Clinical Trials Nur.', views: 344, applications: 28, hired: 2, conversion: 7.1 },
    { title: 'Community Nurse', views: 289, applications: 22, hired: 1, conversion: 4.5 },
    { title: 'Care Coordinator', views: 198, applications: 15, hired: 1, conversion: 6.7 }
  ];

  const stats = [
    {
      title: 'Total Hires YTD',
      value: '39',
      change: '+8 this month',
      trend: 'up',
      icon: Target,
      color: 'rgb(96, 27, 128)',
      valueColor: 'rgb(96, 27, 128)'
    },
    {
      title: 'Avg. Time to Hire',
      value: '18d',
      change: '−3 days vs last Q',
      trend: 'up',
      icon: Clock,
      color: 'rgb(5, 150, 105)',
      valueColor: 'rgb(5, 150, 105)'
    },
    {
      title: 'Cost Per Hire',
      value: '£1,240',
      change: '−£90 vs last month',
      trend: 'up',
      icon: PoundSterling,
      color: 'rgb(124, 58, 237)',
      valueColor: 'rgb(124, 58, 237)'
    },
    {
      title: 'Vacancy Fill Rate',
      value: '72%',
      change: 'Target: 80%',
      trend: 'down',
      icon: ChartNoAxesColumn,
      color: 'rgb(217, 119, 6)',
      valueColor: 'rgb(217, 119, 6)'
    }
  ];

  // Custom tooltip
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

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-xs text-gray-600">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-[#0D1117] mb-0.5 text-xl sm:text-2xl font-bold">
            Reports & Analytics
          </h1>
          <p className="text-[13px] text-[#7B8299] font-medium">
            Analytics & reporting — last 30 days
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
          <button 
            className="flex items-center justify-center gap-2 px-4 rounded-xl h-10"
            style={{ background: 'rgb(255, 255, 255)', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(123, 130, 153)', cursor: 'pointer' }}
          >
            <Calendar size={13} stroke="currentColor" strokeWidth={2} />
            <span className="hidden sm:inline">This Month</span>
            <span className="sm:hidden">Month</span>
          </button>
          <button 
            className="flex items-center justify-center gap-2 px-4 rounded-xl h-10 text-[13px] font-bold text-white"
            style={{ background: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
          >
            <Download size={13} stroke="currentColor" strokeWidth={2} />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="rounded-2xl p-4 sm:p-5"
            style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)', boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' }}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div 
                className="flex items-center justify-center rounded-xl w-10 h-10 sm:w-[44px] sm:h-[44px]"
                style={{ background: stat.color }}
              >
                <stat.icon size={16} stroke="#fff" strokeWidth={2} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <span 
                className="flex items-center gap-1 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold"
                style={{ 
                  background: stat.trend === 'up' ? 'rgb(236, 253, 245)' : 'rgb(254, 242, 242)',
                  color: stat.trend === 'up' ? 'rgb(5, 150, 105)' : 'rgb(220, 38, 38)'
                }}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp size={10} stroke="currentColor" strokeWidth={2} />
                ) : (
                  <TrendingDown size={10} stroke="currentColor" strokeWidth={2} />
                )}
                ↑
              </span>
            </div>
            <p className="text-2xl sm:text-[28px] font-extrabold leading-none mb-1.5" style={{ color: stat.valueColor }}>
              {stat.value}
            </p>
            <p className="text-[13px] font-bold text-[#0D1117] mb-0.5">{stat.title}</p>
            <p className="text-[11px] text-[#A0AABF] font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 margintop40">
        {/* Monthly Hiring Chart */}
        <div className="lg:col-span-2 rounded-2xl p-4 sm:p-5" style={{ 
          background: 'rgb(255, 255, 255)', 
          border: '1px solid rgb(228, 233, 244)', 
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
        }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-5">
            <div>
              <h4 className="text-[#0D1117] mb-0.5 text-sm sm:text-[15px] font-bold">
                Monthly Hiring vs Leavers
              </h4>
              <p className="text-[12px] text-[#7B8299] font-medium">
                6-month comparison
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgb(96, 27, 128)' }} />
                <span className="text-[11px] text-[#7B8299] font-semibold">Hires</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgb(239, 68, 68)' }} />
                <span className="text-[11px] text-[#7B8299] font-semibold">Leavers</span>
              </div>
            </div>
          </div>
          <div className="w-full h-[200px] sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF1FB" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#A0AABF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#A0AABF' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 12]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="hires" 
                  fill="#601B80" 
                  radius={[6, 6, 0, 0]} 
                  barSize={10}
                  name="Hires"
                />
                <Bar 
                  dataKey="leavers" 
                  fill="#EF4444" 
                  radius={[6, 6, 0, 0]} 
                  barSize={10}
                  name="Leavers"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source of Applications */}
        <div className="rounded-2xl p-4 sm:p-5" style={{ 
          background: 'rgb(255, 255, 255)', 
          border: '1px solid rgb(228, 233, 244)', 
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
        }}>
          <div className="mb-3 sm:mb-4">
            <h4 className="text-[#0D1117] mb-0.5 text-sm sm:text-[15px] font-bold">
              Source of Applications
            </h4>
            <p className="text-[12px] text-[#7B8299] font-medium">
              By acquisition channel
            </p>
          </div>
          <div className="w-full h-[140px] sm:h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 mt-2 sm:mt-3">
            {sourceData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 sm:gap-2">
                <div className="rounded shrink-0 w-2 h-2" style={{ background: item.color }} />
                <span className="text-[10px] sm:text-[11px] text-[#7B8299] font-semibold truncate">{item.name}</span>
                <span className="text-[10px] sm:text-[11px] text-[#A0AABF] font-medium ml-auto">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Website Visitors */}
        <div className="rounded-2xl p-4 sm:p-5" style={{ 
          background: 'rgb(255, 255, 255)', 
          border: '1px solid rgb(228, 233, 244)', 
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
        }}>
          <div className="mb-4 sm:mb-5">
            <h4 className="text-[#0D1117] mb-0.5 text-sm sm:text-[15px] font-bold">
              Website Visitors by Page
            </h4>
            <p className="text-[12px] text-[#7B8299] font-medium">
              SEO traffic — last 30 days
            </p>
          </div>
          <div className="w-full h-[350px] sm:h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={pageVisitors} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF1FB" horizontal={false} />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#A0AABF' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 6000]}
                />
                <YAxis 
                  type="category"
                  dataKey="page"
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#7B8299' }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="visitors" 
                  fill="hsl(285, 55%, 40%)" 
                  radius={[0, 8, 8, 0]} 
                  barSize={14}
                  name="Visitors"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Performance */}
        <div className="rounded-2xl p-4 sm:p-5" style={{ 
          background: 'rgb(255, 255, 255)', 
          border: '1px solid rgb(228, 233, 244)', 
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
        }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <div>
              <h4 className="text-[#0D1117] mb-0.5 text-sm sm:text-[15px] font-bold">
                New Staff Added
              </h4>
              <p className="text-[12px] text-[#7B8299] font-medium">
                Research Nurses — this quarter
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="rounded-xl p-2.5 sm:p-3" style={{ background: 'rgb(245, 240, 251)', textAlign: 'center' }}>
              <p className="text-lg sm:text-[20px] font-extrabold text-[#601B80] leading-none">18</p>
              <p className="text-[9px] sm:text-[10.5px] text-[#7B8299] mt-1 sm:mt-[4px] font-semibold leading-tight">
                Research Nurses Added
              </p>
            </div>
            <div className="rounded-xl p-2.5 sm:p-3" style={{ background: 'rgb(240, 253, 244)', textAlign: 'center' }}>
              <p className="text-lg sm:text-[20px] font-extrabold text-[#16A34A] leading-none">+5</p>
              <p className="text-[9px] sm:text-[10.5px] text-[#7B8299] mt-1 sm:mt-[4px] font-semibold leading-tight">
                This Month
              </p>
            </div>
            <div className="rounded-xl p-2.5 sm:p-3" style={{ background: 'rgb(236, 254, 255)', textAlign: 'center' }}>
              <p className="text-lg sm:text-[20px] font-extrabold text-[#0891B2] leading-none">11d</p>
              <p className="text-[9px] sm:text-[10.5px] text-[#7B8299] mt-1 sm:mt-[4px] font-semibold leading-tight">
                Avg. Onboard Time
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h4 className="text-[#0D1117] text-[13px] font-bold">
              Job Performance
            </h4>
          </div>
          <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid rgb(238, 241, 251)' }}>
            <table className="w-full border-collapse text-xs min-w-[500px]">
              <thead>
                <tr style={{ background: 'rgb(250, 251, 254)' }}>
                  <th className="px-2 sm:px-[10px] py-2 sm:py-2.5 text-left text-[10px] font-bold text-[#A0AABF] uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-2 sm:px-[10px] py-2 sm:py-2.5 text-left text-[10px] font-bold text-[#A0AABF] uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-2 sm:px-[10px] py-2 sm:py-2.5 text-left text-[10px] font-bold text-[#A0AABF] uppercase tracking-wider">
                    Apps
                  </th>
                  <th className="px-2 sm:px-[10px] py-2 sm:py-2.5 text-left text-[10px] font-bold text-[#A0AABF] uppercase tracking-wider">
                    Hired
                  </th>
                  <th className="px-2 sm:px-[10px] py-2 sm:py-2.5 text-left text-[10px] font-bold text-[#A0AABF] uppercase tracking-wider">
                    Conv.
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobPerformanceData.map((job, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 transition-colors"
                    style={{ 
                      borderTop: '1px solid rgb(238, 241, 251)', 
                      background: 'rgb(255, 255, 255)'
                    }}
                  >
                    <td className="px-2 sm:px-[10px] py-2 sm:py-[9px] text-[#0D1117] font-semibold text-[11px] sm:text-[12px]">
                      {job.title}
                    </td>
                    <td className="px-2 sm:px-[10px] py-2 sm:py-[9px] text-[#7B8299] font-medium text-[11px] sm:text-[12px]">
                      {job.views}
                    </td>
                    <td className="px-2 sm:px-[10px] py-2 sm:py-[9px] text-[#7B8299] font-medium text-[11px] sm:text-[12px]">
                      {job.applications}
                    </td>
                    <td className="px-2 sm:px-[10px] py-2 sm:py-[9px]">
                      <span className="font-extrabold text-[#16A34A] text-[11px] sm:text-[12px]">
                        {job.hired}
                      </span>
                    </td>
                    <td className="px-2 sm:px-[10px] py-2 sm:py-[9px]">
                      <span 
                        className="rounded-full px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold"
                        style={{ background: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)' }}
                      >
                        {job.conversion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;