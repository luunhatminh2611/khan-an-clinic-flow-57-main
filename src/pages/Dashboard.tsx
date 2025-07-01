
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  UserCheck,
  Stethoscope
} from 'lucide-react';

// Mock data for demonstration
const mockAppointments = [
  {
    id: 1,
    patientName: 'Nguyễn Văn A',
    time: '08:00',
    doctor: 'BS. Nguyễn Văn An',
    status: 'pending',
    symptoms: 'Đau đầu, chóng mặt'
  },
  {
    id: 2,
    patientName: 'Trần Thị B',
    time: '08:30',
    doctor: 'BS. Trần Thị Bình',
    status: 'checked-in',
    symptoms: 'Mất ngủ'
  },
  {
    id: 3,
    patientName: 'Lê Văn C',
    time: '09:00',
    doctor: 'BS. Lê Minh Châu',
    status: 'in-progress',
    symptoms: 'Đau thần kinh'
  }
];

const Dashboard = () => {
  const [userRole] = useState('receptionist'); // This would come from auth context
  const [appointments, setAppointments] = useState(mockAppointments);

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ Check-in';
      case 'checked-in': return 'Đã Check-in';
      case 'in-progress': return 'Đang Khám';
      case 'completed': return 'Hoàn Thành';
      case 'canceled': return 'Đã Hủy';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard - {userRole === 'receptionist' ? 'Lễ Tân' : 'Hệ Thống'}
              </h1>
              <p className="text-gray-600">Quản lý lịch hẹn và bệnh nhân</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">
                Trực tuyến
              </Badge>
              <Button variant="outline">
                Đăng Xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Lịch Hẹn
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Bệnh Nhân
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hàng Đợi
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Cá Nhân
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lịch Hẹn Hôm Nay</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Tạo Lịch Hẹn Mới
              </Button>
            </div>

            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Stethoscope className="w-4 h-4" />
                          {appointment.doctor}
                        </div>
                      </div>
                      
                      <p className="text-gray-600">{appointment.symptoms}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'canceled')}
                          >
                            Hủy
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'checked-in')}
                          >
                            Check-in
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'checked-in' && (
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                        >
                          Khám Luôn
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Danh Sách Bệnh Nhân</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Thêm Bệnh Nhân Mới
              </Button>
            </div>

            <Card className="p-6">
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tính năng quản lý bệnh nhân sẽ được phát triển</p>
              </div>
            </Card>
          </TabsContent>

          {/* Queue Tab */}
          <TabsContent value="queue" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Hàng Đợi Khám</h2>
            </div>

            <Card className="p-6">
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Hệ thống hàng đợi sẽ được phát triển</p>
              </div>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-xl font-semibold">Thông Tin Cá Nhân</h2>

            <Card className="p-6">
              <div className="text-center py-12 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tính năng quản lý thông tin cá nhân sẽ được phát triển</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
