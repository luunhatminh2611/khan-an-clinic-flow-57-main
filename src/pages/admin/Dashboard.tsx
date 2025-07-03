import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building, Activity, TrendingUp, DollarSign, AlertTriangle, PieChart, BarChart3, HeartPulse, TestTube, UserCheck, TrendingDown, Zap, Calendar, Clock, Sparkles, Flame, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  const systemStats = [
    { label: 'Tổng người dùng', value: '156', change: '+12', icon: Users, color: 'bg-blue-500' },
    { label: 'Bác sĩ hoạt động', value: '8', change: '+1', icon: Activity, color: 'bg-blue-500' },
    { label: 'Phòng khám', value: '6', change: '0', icon: Building, color: 'bg-blue-500' },
    { label: 'Doanh thu tháng', value: '125M', change: '+8%', icon: DollarSign, color: 'bg-blue-500' }
  ];

  // Thống kê hoạt động phòng khám
  const clinicOperations = [
    { label: 'Lượt khám hôm nay', value: '45', change: '+5', icon: Activity, color: 'bg-blue-500', bgColor: 'bg-white' },
    { label: 'Tỷ lệ đầy phòng', value: '85%', change: '+3%', icon: Building, color: 'bg-blue-500', bgColor: 'bg-white' },
    { label: 'Thời gian chờ TB', value: '12p', change: '-2p', icon: Clock, color: 'bg-blue-500', bgColor: 'bg-white' },
    { label: 'Độ hài lòng', value: '4.7/5', change: '+0.2', icon: HeartPulse, color: 'bg-blue-500', bgColor: 'bg-white' }
  ];

  // Xu hướng 7 ngày qua
  const weeklyTrends = [
    { day: 'T2', patients: 35, revenue: 15.2 },
    { day: 'T3', patients: 42, revenue: 18.5 },
    { day: 'T4', patients: 38, revenue: 16.8 },
    { day: 'T5', patients: 45, revenue: 19.2 },
    { day: 'T6', patients: 52, revenue: 22.1 },
    { day: 'T7', patients: 28, revenue: 12.5 },
    { day: 'CN', patients: 15, revenue: 7.8 }
  ];

  // Top bệnh phổ biến
  const commonDiseases = [
    { disease: 'Cảm cúm, ĐTHB', count: 45, percentage: 28, trend: 'up' },
    { disease: 'Đau đầu, Stress', count: 32, percentage: 20, trend: 'stable' },
    { disease: 'Dạ dày, Tiêu hóa', count: 28, percentage: 17, trend: 'up' },
    { disease: 'Tim mạch', count: 25, percentage: 15, trend: 'down' },
    { disease: 'Da liễu', count: 20, percentage: 12, trend: 'up' },
    { disease: 'Khác', count: 13, percentage: 8, trend: 'stable' }
  ];

  // Xét nghiệm phổ biến
  const commonTests = [
    { test: 'Xét nghiệm máu tổng quát', count: 78, cost: '150K', trend: 'up' },
    { test: 'Siêu âm tổng quát', count: 45, cost: '300K', trend: 'stable' },
    { test: 'X-quang ngực', count: 32, cost: '200K', trend: 'up' },
    { test: 'Điện tim', count: 28, cost: '100K', trend: 'down' },
    { test: 'Test nhanh Covid', count: 25, cost: '50K', trend: 'down' }
  ];

  // Thống kê bác sĩ chi tiết
  const doctorAnalysis = [
    { 
      id: 1,
      name: 'BS. Nguyễn Văn A', 
      specialty: 'Tim mạch',
      hoursWorked: 180, 
      daysWorked: 22, 
      patientsServed: 145,
      efficiency: '98%',
      status: 'excellent'
    },
    { 
      id: 2,
      name: 'BS. Trần Thị B', 
      specialty: 'Nội khoa',
      hoursWorked: 165, 
      daysWorked: 20, 
      patientsServed: 132,
      efficiency: '95%',
      status: 'good'
    },
    { 
      id: 3,
      name: 'BS. Lê Văn C', 
      specialty: 'Ngoại khoa',
      hoursWorked: 195, 
      daysWorked: 24, 
      patientsServed: 98,
      efficiency: '85%',
      status: 'overworked'
    },
    { 
      id: 4,
      name: 'BS. Phạm Thị D', 
      specialty: 'Sản phụ khoa',
      hoursWorked: 140, 
      daysWorked: 18, 
      patientsServed: 89,
      efficiency: '92%',
      status: 'underutilized'
    },
    { 
      id: 5,
      name: 'BS. Hoàng Văn E', 
      specialty: 'Nhi khoa',
      hoursWorked: 175, 
      daysWorked: 21, 
      patientsServed: 156,
      efficiency: '100%',
      status: 'excellent'
    },
    { 
      id: 6,
      name: 'BS. Ngô Thị F', 
      specialty: 'Da liễu',
      hoursWorked: 160, 
      daysWorked: 20, 
      patientsServed: 112,
      efficiency: '88%',
      status: 'good'
    }
  ];

  // Thống kê kỹ thuật viên chi tiết
  const technicianAnalysis = [
    { 
      id: 1,
      name: 'KTV. Đỗ Văn A', 
      specialty: 'Xét nghiệm máu',
      hoursWorked: 185, 
      daysWorked: 23, 
      testsCompleted: 245,
      efficiency: '96%',
      status: 'excellent'
    },
    { 
      id: 2,
      name: 'KTV. Lý Thị B', 
      specialty: 'Siêu âm',
      hoursWorked: 170, 
      daysWorked: 21, 
      testsCompleted: 189,
      efficiency: '92%',
      status: 'good'
    },
    { 
      id: 3,
      name: 'KTV. Trương Văn C', 
      specialty: 'X-quang',
      hoursWorked: 160, 
      daysWorked: 20, 
      testsCompleted: 156,
      efficiency: '88%',
      status: 'good'
    },
    { 
      id: 4,
      name: 'KTV. Nguyễn Thị D', 
      specialty: 'Điện tim',
      hoursWorked: 145, 
      daysWorked: 18, 
      testsCompleted: 134,
      efficiency: '85%',
      status: 'average'
    }
  ];

  // Thống kê lễ tân chi tiết
  const receptionistAnalysis = [
    { 
      id: 1,
      name: 'LT. Võ Thị A', 
      specialty: 'Tiếp đón',
      hoursWorked: 175, 
      daysWorked: 22, 
      appointmentsHandled: 320,
      callsAnswered: 450,
      efficiency: '98%',
      status: 'excellent'
    },
    { 
      id: 2,
      name: 'LT. Bùi Văn B', 
      specialty: 'Hỗ trợ',
      hoursWorked: 165, 
      daysWorked: 21, 
      appointmentsHandled: 285,
      callsAnswered: 380,
      efficiency: '94%',
      status: 'good'
    },
    { 
      id: 3,
      name: 'LT. Phạm Thị C', 
      specialty: 'Thủ tục',
      hoursWorked: 170, 
      daysWorked: 21, 
      appointmentsHandled: 298,
      callsAnswered: 420,
      efficiency: '96%',
      status: 'excellent'
    },
    { 
      id: 4,
      name: 'LT. Hoàng Văn D', 
      specialty: 'Tài chính',
      hoursWorked: 155, 
      daysWorked: 19, 
      appointmentsHandled: 210,
      callsAnswered: 290,
      efficiency: '87%',
      status: 'good'
    },
    { 
      id: 5,
      name: 'LT. Đặng Thị E', 
      specialty: 'Hướng dẫn',
      hoursWorked: 180, 
      daysWorked: 22, 
      appointmentsHandled: 340,
      callsAnswered: 480,
      efficiency: '99%',
      status: 'excellent'
    }
  ];

  // Khuyến nghị tối ưu hóa
  const recommendations = [
    {
      type: 'increase',
      category: 'Nhân sự',
      suggestion: 'Tuyển thêm 2 bác sĩ để giảm thời gian chờ',
      impact: 'Tăng 15% năng suất',
      icon: TrendingUp
    },
    {
      type: 'decrease',
      category: 'Chi phí',
      suggestion: 'Tối ưu hóa hệ thống điện để giảm 20% hóa đơn',
      impact: 'Tiết kiệm 1.7M/tháng',
      icon: TrendingDown
    },
    {
      type: 'optimize',
      category: 'Quy trình',
      suggestion: 'Áp dụng hẹn online để giảm tải lễ tân',
      impact: 'Giảm 25% thời gian chờ',
      icon: Zap
    }
  ];

  const quickActions = [
    {
      icon: Users,
      title: 'Quản lý tài khoản',
      description: 'Tạo và quản lý tài khoản người dùng',
      path: '/admin/accounts',
      color: 'bg-blue-500',
      bgColor: 'bg-white'
    },
    {
      icon: Building,
      title: 'Quản lý phòng khám',
      description: 'Cấu hình phòng ban, dịch vụ, phòng khám',
      path: '/admin/clinic',
      color: 'bg-blue-500',
      bgColor: 'bg-white'
    },
    {
      icon: Activity,
      title: 'Nhật ký hệ thống',
      description: 'Theo dõi hoạt động và bảo mật',
      path: '/admin/logs',
      color: 'bg-blue-500',
      bgColor: 'bg-white'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'CREATE_USER',
      user: 'Admin',
      action: 'Tạo tài khoản bác sĩ mới: BS. Nguyễn Văn X',
      time: '10 phút trước',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'UPDATE_SYSTEM',
      user: 'System',
      action: 'Cập nhật cấu hình hệ thống',
      time: '1 giờ trước',
      icon: Target,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'LOGIN',
      user: 'BS. Trần Thị B',
      action: 'Đăng nhập vào hệ thống',
      time: '2 giờ trước',
      icon: Activity,
      color: 'text-purple-600'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      level: 'warning',
      message: 'Dung lượng ổ cứng sắp đầy (85%)',
      time: '30 phút trước',
      icon: AlertTriangle
    },
    {
      id: 2,
      level: 'info',
      message: 'Backup dữ liệu hoàn thành',
      time: '2 giờ trước',
      icon: Sparkles
    }
  ];

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'warning': return 'bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 border border-yellow-200';
      case 'error': return 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200';
      case 'info': return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  const getDoctorStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-gradient-to-r from-green-50 to-green-100';
      case 'good': return 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100';
      case 'average': return 'text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100';
      case 'overworked': return 'text-red-600 bg-gradient-to-r from-red-50 to-red-100';
      case 'underutilized': return 'text-yellow-600 bg-gradient-to-r from-yellow-50 to-yellow-100';
      default: return 'text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100';
    }
  };

  const getDoctorStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Xuất sắc';
      case 'good': return 'Tốt';
      case 'average': return 'Trung bình';
      case 'overworked': return 'Quá tải';
      case 'underutilized': return 'Chưa tối ưu';
      default: return 'Bình thường';
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'increase': return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50';
      case 'decrease': return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50';
      case 'optimize': return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50';
      default: return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Modern Header with Gradient */}
      <div className="relative bg-gradient-to-r from-clinic-navy via-clinic-blue to-clinic-green p-8 rounded-b-3xl shadow-2xl mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/5 rounded-b-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
      <div>
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight flex items-center">
                <Flame className="w-10 h-10 mr-3 text-yellow-300" />
          Bảng điều khiển quản trị
        </h1>
              <p className="text-blue-100 text-xl font-medium max-w-2xl">
                Tổng quan hệ thống và phân tích hoạt động phòng khám hiện đại
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/30 shadow-xl">
                <div className="text-white/90 text-base font-medium">Hôm nay</div>
                <div className="text-white font-bold text-xl">{new Date().toLocaleDateString('vi-VN')}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/30 shadow-xl">
                <div className="text-white/90 text-base font-medium">Thời gian</div>
                <div className="text-white font-bold text-xl">{new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 space-y-8 pb-8">
        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="text-white" size={28} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                    stat.change.startsWith('+') 
                      ? 'bg-green-100 text-green-700' 
                      : stat.change === '0'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              <div>
                  <p className="text-base font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Daily Operations */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="w-7 h-7 mr-3 text-clinic-blue" />
            Hoạt động phòng khám hôm nay
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {clinicOperations.map((stat, index) => (
              <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <span className={`text-base font-semibold px-3 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 
                    stat.change.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {stat.change}
                  </span>
                </div>
                <p className="text-base font-medium text-gray-600 mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Trends Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-7 h-7 mr-3 text-clinic-green" />
            Xu hướng 7 ngày qua
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  fontSize={14}
                  fontWeight={500}
                />
                <YAxis 
                  yAxisId="patients"
                  orientation="left"
                  stroke="#3b82f6"
                  fontSize={14}
                  fontWeight={500}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="right"
                  stroke="#10b981"
                  fontSize={14}
                  fontWeight={500}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px'
                  }}
                  formatter={(value, name) => [
                    name === 'Số bệnh nhân' ? `${value} bệnh nhân` : `${value} VND`,
                    name
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="patients"
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="Số bệnh nhân"
                />
                <Line 
                  yAxisId="revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                  name="Doanh thu (M)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Chart - Cards Layout */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-7 h-7 mr-3 text-clinic-navy" />
            Bệnh phổ biến tháng này
          </h2>
          
          {/* Ghi chú */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
            <p className="text-base text-gray-700 font-medium mb-2">
              📈 <strong>Ghi chú:</strong> Màu sắc thể hiện xu hướng so với tháng trước
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-base text-gray-600">Xu hướng tăng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-base text-gray-600">Xu hướng giảm</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cảm cúm, ĐTHB - Tăng */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
              <div className="text-center h-12 flex items-center justify-center mb-6">
                <h3 className="font-bold text-blue-900 text-xl leading-tight">Cảm cúm, ĐTHB</h3>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-5xl font-bold text-blue-600 mb-4 leading-none">45</p>
                <p className="text-lg text-blue-700 font-medium mb-6">ca bệnh</p>
                <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">↗️ +8</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                </div>
              </div>
            </div>

            {/* Đau đầu, Stress - Ổn định */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
              <div className="text-center h-12 flex items-center justify-center mb-6">
                <h3 className="font-bold text-blue-900 text-xl leading-tight">Đau đầu, Stress</h3>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-5xl font-bold text-blue-600 mb-4 leading-none">32</p>
                <p className="text-lg text-blue-700 font-medium mb-6">ca bệnh</p>
                <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">➡️ 0</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                </div>
              </div>
            </div>

            {/* Dạ dày, Tiêu hóa - Tăng */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
              <div className="text-center h-12 flex items-center justify-center mb-6">
                <h3 className="font-bold text-blue-900 text-xl leading-tight">Dạ dày, Tiêu hóa</h3>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-5xl font-bold text-blue-600 mb-4 leading-none">28</p>
                <p className="text-lg text-blue-700 font-medium mb-6">ca bệnh</p>
                <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">↗️ +5</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                </div>
              </div>
            </div>

            {/* Tim mạch - Giảm */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
              <div className="text-center h-12 flex items-center justify-center mb-6">
                <h3 className="font-bold text-red-900 text-xl leading-tight">Tim mạch</h3>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-5xl font-bold text-red-600 mb-4 leading-none">25</p>
                <p className="text-lg text-red-700 font-medium mb-6">ca bệnh</p>
                <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-bold text-red-600">↘️ -3</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                </div>
              </div>
            </div>

            {/* Da liễu - Tăng */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
              <div className="text-center h-12 flex items-center justify-center mb-6">
                <h3 className="font-bold text-blue-900 text-xl leading-tight">Da liễu</h3>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-5xl font-bold text-blue-600 mb-4 leading-none">20</p>
                <p className="text-lg text-blue-700 font-medium mb-6">ca bệnh</p>
                <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">↗️ +2</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border-l-4 border-gray-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
              <div className="text-center h-12 flex items-center justify-center mb-6">
                <h3 className="font-bold text-gray-900 text-xl leading-tight">Tổng kết</h3>
              </div>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-5xl font-bold text-gray-700 mb-4 leading-none">163</p>
                <p className="text-lg text-gray-600 font-medium mb-6">tổng ca bệnh</p>
                <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-sm font-bold text-blue-600">Max: 45</span>
                    <span className="text-sm font-bold text-red-600">Min: 20</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">khoảng dao động</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">

          {/* Simple Test Chart - Cards Layout */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <TestTube className="w-7 h-7 mr-3 text-purple-600" />
              Xét nghiệm thường gặp
            </h2>
            
            {/* Ghi chú */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
              <p className="text-base text-gray-700 font-medium mb-2">
                📈 <strong>Ghi chú:</strong> Màu sắc thể hiện xu hướng so với tháng trước
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-base text-gray-600">Xu hướng tăng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-base text-gray-600">Xu hướng giảm</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Xét nghiệm máu */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
                <div className="text-center h-12 flex items-center justify-center mb-6">
                  <h3 className="font-bold text-blue-900 text-xl leading-tight">Xét nghiệm máu</h3>
                </div>
                <div className="text-center flex-1 flex flex-col justify-center">
                  <p className="text-5xl font-bold text-blue-600 mb-4 leading-none">78</p>
                  <p className="text-lg text-blue-700 font-medium mb-6">lần thực hiện</p>
                  <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                    <div className="flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">↗️ +12</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                  </div>
                </div>
              </div>

              {/* Siêu âm */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
                <div className="text-center h-12 flex items-center justify-center mb-6">
                  <h3 className="font-bold text-blue-900 text-xl leading-tight">Siêu âm tổng quát</h3>
                </div>
                <div className="text-center flex-1 flex flex-col justify-center">
                  <p className="text-5xl font-bold text-blue-600 mb-4 leading-none">45</p>
                  <p className="text-lg text-blue-700 font-medium mb-6">lần thực hiện</p>
                  <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                    <div className="flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">➡️ 0</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                  </div>
                </div>
              </div>

              {/* X-quang */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
                <div className="text-center h-12 flex items-center justify-center mb-6">
                  <h3 className="font-bold text-blue-900 text-xl leading-tight">X-quang ngực</h3>
                </div>
                <div className="text-center flex-1 flex flex-col justify-center">
                  <p className="text-5xl font-bold text-blue-600 mb-4 leading-none">32</p>
                  <p className="text-lg text-blue-700 font-medium mb-6">lần thực hiện</p>
                  <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                    <div className="flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">↗️ +8</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                  </div>
                </div>
              </div>

              {/* Điện tim */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
                <div className="text-center h-12 flex items-center justify-center mb-6">
                  <h3 className="font-bold text-red-900 text-xl leading-tight">Điện tim</h3>
                </div>
                <div className="text-center flex-1 flex flex-col justify-center">
                  <p className="text-5xl font-bold text-red-600 mb-4 leading-none">28</p>
                  <p className="text-lg text-red-700 font-medium mb-6">lần thực hiện</p>
                  <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                    <div className="flex items-center justify-center">
                      <span className="text-lg font-bold text-red-600">↘️ -5</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                  </div>
                </div>
              </div>

              {/* Test Covid */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
                <div className="text-center h-12 flex items-center justify-center mb-6">
                  <h3 className="font-bold text-red-900 text-xl leading-tight">Test Covid</h3>
                </div>
                <div className="text-center flex-1 flex flex-col justify-center">
                  <p className="text-5xl font-bold text-red-600 mb-4 leading-none">25</p>
                  <p className="text-lg text-red-700 font-medium mb-6">lần thực hiện</p>
                  <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                    <div className="flex items-center justify-center">
                      <span className="text-lg font-bold text-red-600">↘️ -15</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">so với tháng trước</p>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border-l-4 border-gray-500 hover:shadow-lg transition-all duration-300 h-80 flex flex-col">
                <div className="text-center h-12 flex items-center justify-center mb-6">
                  <h3 className="font-bold text-gray-900 text-xl leading-tight">Tổng kết</h3>
                </div>
                <div className="text-center flex-1 flex flex-col justify-center">
                  <p className="text-5xl font-bold text-gray-700 mb-4 leading-none">208</p>
                  <p className="text-lg text-gray-600 font-medium mb-6">tổng lần thực hiện</p>
                  <div className="bg-white/60 rounded-lg p-4 border border-white/40 h-16 flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-sm font-bold text-blue-600">Max: 78</span>
                      <span className="text-sm font-bold text-red-600">Min: 25</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">khoảng dao động</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Doctor Analysis */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <UserCheck className="w-7 h-7 mr-3 text-clinic-green" />
            Phân tích nhân sự - Thống kê bác sĩ tháng này
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết từng bác sĩ</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {doctorAnalysis.map((doctor, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{doctor.name}</p>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getDoctorStatusColor(doctor.status)}`}>
                        {getDoctorStatusText(doctor.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{doctor.hoursWorked}</div>
                        <div className="text-xs text-gray-500">giờ làm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{doctor.daysWorked}</div>
                        <div className="text-xs text-gray-500">ngày làm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{doctor.patientsServed}</div>
                        <div className="text-xs text-gray-500">bệnh nhân</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Hiệu suất:</span>
                      <span className="font-bold text-gray-900">{doctor.efficiency}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ${
                          parseInt(doctor.efficiency) >= 95 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          parseInt(doctor.efficiency) >= 90 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          parseInt(doctor.efficiency) >= 85 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${parseInt(doctor.efficiency)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Phân bố số bệnh nhân</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '14px'
                      }}
                      formatter={(value, name) => [`${value} bệnh nhân`, name]}
                    />
                    <Pie
                      dataKey="patientsServed"
                      nameKey="name"
                      data={doctorAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      paddingAngle={2}
                      label={({ name, patientsServed }) => `${name.split(' ').slice(-2).join(' ')}: ${patientsServed}`}
                      labelLine={false}
                    >
                      {doctorAnalysis.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Top Performers */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <h4 className="font-bold text-green-900 mb-2">🏆 Xuất sắc nhất tháng</h4>
                <div className="text-sm text-green-700">
                  <div><strong>Nhiều bệnh nhân nhất:</strong> {doctorAnalysis.reduce((max, doctor) => doctor.patientsServed > max.patientsServed ? doctor : max).name} ({doctorAnalysis.reduce((max, doctor) => doctor.patientsServed > max.patientsServed ? doctor : max).patientsServed} BN)</div>
                  <div><strong>Hiệu suất cao nhất:</strong> {doctorAnalysis.reduce((max, doctor) => parseInt(doctor.efficiency) > parseInt(max.efficiency) ? doctor : max).name} ({doctorAnalysis.reduce((max, doctor) => parseInt(doctor.efficiency) > parseInt(max.efficiency) ? doctor : max).efficiency})</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Technician Analysis */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TestTube className="w-7 h-7 mr-3 text-purple-600" />
            Phân tích kỹ thuật viên - Thống kê tháng này
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết từng kỹ thuật viên</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {technicianAnalysis.map((technician, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{technician.name}</p>
                        <p className="text-sm text-gray-600">{technician.specialty}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getDoctorStatusColor(technician.status)}`}>
                        {getDoctorStatusText(technician.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{technician.hoursWorked}</div>
                        <div className="text-xs text-gray-500">giờ làm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{technician.daysWorked}</div>
                        <div className="text-xs text-gray-500">ngày làm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{technician.testsCompleted}</div>
                        <div className="text-xs text-gray-500">xét nghiệm</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Hiệu suất:</span>
                      <span className="font-bold text-gray-900">{technician.efficiency}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ${
                          parseInt(technician.efficiency) >= 95 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          parseInt(technician.efficiency) >= 90 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          parseInt(technician.efficiency) >= 85 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${parseInt(technician.efficiency)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Phân bố số xét nghiệm</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '14px'
                      }}
                      formatter={(value, name) => [`${value} xét nghiệm`, name]}
                    />
                    <Pie
                      dataKey="testsCompleted"
                      nameKey="name"
                      data={technicianAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      paddingAngle={2}
                      label={({ name, testsCompleted }) => `${name.split(' ').slice(-2).join(' ')}: ${testsCompleted}`}
                      labelLine={false}
                    >
                      {technicianAnalysis.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Top Performers */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">🏆 Xuất sắc nhất tháng</h4>
                <div className="text-sm text-purple-700">
                  <div><strong>Nhiều xét nghiệm nhất:</strong> {technicianAnalysis.reduce((max, tech) => tech.testsCompleted > max.testsCompleted ? tech : max).name} ({technicianAnalysis.reduce((max, tech) => tech.testsCompleted > max.testsCompleted ? tech : max).testsCompleted} XN)</div>
                  <div><strong>Hiệu suất cao nhất:</strong> {technicianAnalysis.reduce((max, tech) => parseInt(tech.efficiency) > parseInt(max.efficiency) ? tech : max).name} ({technicianAnalysis.reduce((max, tech) => parseInt(tech.efficiency) > parseInt(max.efficiency) ? tech : max).efficiency})</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Receptionist Analysis */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="w-7 h-7 mr-3 text-orange-600" />
            Phân tích lễ tân - Thống kê tháng này
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết từng lễ tân</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {receptionistAnalysis.map((receptionist, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{receptionist.name}</p>
                        <p className="text-sm text-gray-600">{receptionist.specialty}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getDoctorStatusColor(receptionist.status)}`}>
                        {getDoctorStatusText(receptionist.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{receptionist.hoursWorked}</div>
                        <div className="text-xs text-gray-500">giờ làm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{receptionist.daysWorked}</div>
                        <div className="text-xs text-gray-500">ngày làm</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{receptionist.appointmentsHandled}</div>
                        <div className="text-xs text-gray-500">lịch hẹn</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">{receptionist.callsAnswered}</div>
                        <div className="text-xs text-gray-500">cuộc gọi</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Hiệu suất:</span>
                      <span className="font-bold text-gray-900">{receptionist.efficiency}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ${
                          parseInt(receptionist.efficiency) >= 95 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          parseInt(receptionist.efficiency) >= 90 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          parseInt(receptionist.efficiency) >= 85 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${parseInt(receptionist.efficiency)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Phân bố lịch hẹn xử lý</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '14px'
                      }}
                      formatter={(value, name) => [`${value} lịch hẹn`, name]}
                    />
                    <Pie
                      dataKey="appointmentsHandled"
                      nameKey="name"
                      data={receptionistAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      paddingAngle={2}
                      label={({ name, appointmentsHandled }) => `${name.split(' ').slice(-2).join(' ')}: ${appointmentsHandled}`}
                      labelLine={false}
                    >
                      {receptionistAnalysis.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Top Performers */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <h4 className="font-bold text-orange-900 mb-2">🏆 Xuất sắc nhất tháng</h4>
                <div className="text-sm text-orange-700">
                  <div><strong>Nhiều lịch hẹn nhất:</strong> {receptionistAnalysis.reduce((max, rec) => rec.appointmentsHandled > max.appointmentsHandled ? rec : max).name} ({receptionistAnalysis.reduce((max, rec) => rec.appointmentsHandled > max.appointmentsHandled ? rec : max).appointmentsHandled} LH)</div>
                  <div><strong>Nhiều cuộc gọi nhất:</strong> {receptionistAnalysis.reduce((max, rec) => rec.callsAnswered > max.callsAnswered ? rec : max).name} ({receptionistAnalysis.reduce((max, rec) => rec.callsAnswered > max.callsAnswered ? rec : max).callsAnswered} CG)</div>
                  <div><strong>Hiệu suất cao nhất:</strong> {receptionistAnalysis.reduce((max, rec) => parseInt(rec.efficiency) > parseInt(max.efficiency) ? rec : max).name} ({receptionistAnalysis.reduce((max, rec) => parseInt(rec.efficiency) > parseInt(max.efficiency) ? rec : max).efficiency})</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Recommendations */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-7 h-7 mr-3 text-blue-600" />
            Khuyến nghị tối ưu hóa
          </h2>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className={`border-l-4 ${getRecommendationColor(rec.type)} rounded-r-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        rec.type === 'increase' ? 'bg-blue-100' :
                        rec.type === 'decrease' ? 'bg-blue-100' : 'bg-blue-100'
                      }`}>
                        <rec.icon className={`w-5 h-5 ${
                          rec.type === 'increase' ? 'text-blue-600' :
                          rec.type === 'decrease' ? 'text-blue-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <span className="text-base font-semibold text-gray-600 bg-white/70 px-3 py-1 rounded-full">
                        {rec.category}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 mb-2 text-lg">{rec.suggestion}</p>
                    <p className="text-gray-600 text-base">{rec.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <div
            key={index}
            onClick={() => navigate(action.path)}
              className={`${action.bgColor} rounded-3xl p-8 cursor-pointer hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 group`}
          >
              <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="text-white" size={32} />
            </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
              {action.title}
            </h3>
              <p className="text-gray-600 text-base">{action.description}</p>
          </div>
        ))}
      </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Modern Activities */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="w-7 h-7 mr-3 text-clinic-blue" />
            Hoạt động gần đây
          </h2>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-sm transition-all duration-300">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-base">{activity.action}</p>
                    <p className="text-gray-600 text-base">bởi {activity.user}</p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => navigate('/admin/logs')}
              className="w-full mt-6 bg-gradient-to-r from-clinic-blue to-blue-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-base"
          >
            Xem tất cả nhật ký
          </button>
        </div>

          {/* Modern Alerts */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-7 h-7 mr-3 text-orange-500" />
            Cảnh báo hệ thống
          </h2>
          
            <div className="space-y-4">
            {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-2xl ${getAlertColor(alert.level)} shadow-sm`}>
                  <div className="flex items-start space-x-3">
                    <alert.icon size={20} className="mt-0.5" />
                  <div className="flex-1">
                      <p className="font-semibold text-base">{alert.message}</p>
                      <p className="text-sm opacity-75 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {systemAlerts.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-base">Không có cảnh báo nào</p>
            </div>
          )}
        </div>
      </div>


      </div>
    </div>
  );
};

export default AdminDashboard;
