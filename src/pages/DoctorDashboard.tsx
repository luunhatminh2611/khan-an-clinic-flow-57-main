import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Plus,
  Eye,
  Upload,
  Edit,
  Trash,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScheduleForm from '@/components/ScheduleForm';
import ExaminationForm from '@/components/ExaminationForm';
import PatientDetail from '@/components/PatientDetail';
import WeeklyScheduleGrid from '@/components/WeeklyScheduleGrid';
import TodayVisitResult from '@/components/TodayResult';
import AppointmentForm from '@/components/AppointmentForm';


// Mock data with updated structure
const mockSchedule = [
  {
    id: 1,
    date: '2024-01-15',
    dayOfWeek: 'monday',
    status: 'có mặt',
    room: 'Phòng 1',
    timeSlots: [
      { time: '08:00-12:00', room: 'Phòng 1' }
    ]
  },
  {
    id: 2,
    date: '2024-01-16',
    dayOfWeek: 'tuesday',
    status: 'nghỉ',
    room: 'Phòng 2',
    timeSlots: [
      { time: '14:00-17:00', room: 'Phòng 2' }
    ]
  }
];

const mockQueue = [
  {
    id: 1,
    patientName: 'Nguyễn Văn A',
    queueNumber: 1,
    symptoms: 'Đau đầu, chóng mặt',
    status: 'waiting',
    time: '08:00'
  },
  {
    id: 2,
    patientName: 'Trần Thị B',
    queueNumber: 2,
    symptoms: 'Mất ngủ',
    status: 'called',
    time: '08:30'
  }
];
const mockAppointments = [
  {
    id: 1,
    patientName: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0901234567',
    time: '08:00',
    date: '2024-01-15',
    symptoms: 'Đau đầu, chóng mặt',
    status: 'pending'
  },
  {
    id: 2,
    patientName: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    phone: '0912345678',
    time: '09:00',
    date: '2024-01-15',
    symptoms: 'Mất ngủ',
    status: 'checked-in'
  },
  {
    id: 3,
    patientName: 'Phạm Văn C',
    email: 'phamvanc@gmail.com',
    phone: '0988888888',
    time: '10:00',
    date: '2024-01-15',
    symptoms: 'Tê tay, đau vai gáy',
    status: 'payment-required',
    services: [
      { name: 'Chụp CT', price: 500000 },
      { name: 'Điện não đồ', price: 400000 },
    ]
  }
];

const mockRoomMaterials = {
  'Phòng 1': [
    { id: 1, name: 'Găng tay y tế', quantity: 200, unit: 'hộp' },
    { id: 2, name: 'Khẩu trang', quantity: 500, unit: 'cái' },
  ],
  'Phòng 2': [
    { id: 3, name: 'Ống tiêm', quantity: 100, unit: 'ống' },
  ],
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [schedule, setSchedule] = useState(mockSchedule);
  const [queue, setQueue] = useState(mockQueue);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showExaminationForm, setShowExaminationForm] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showResultLookup, setShowResultLookup] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointments, setAppointments] = useState(mockAppointments);


  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [usedQuantity, setUsedQuantity] = useState('');
  const [roomMaterials, setRoomMaterials] = useState(mockRoomMaterials);

  const handleUseMaterial = () => {
    if (!selectedRoom || !selectedMaterial) return;

    const quantity = parseInt(usedQuantity);
    if (isNaN(quantity) || quantity <= 0) return alert('Số lượng không hợp lệ');

    setRoomMaterials(prev => ({
      ...prev,
      [selectedRoom]: prev[selectedRoom].map(m =>
        m.id === selectedMaterial.id
          ? { ...m, quantity: Math.max(0, m.quantity - quantity) }
          : m
      )
    }));

    // Reset
    setShowMaterialModal(false);
    setUsedQuantity('');
    setSelectedMaterial(null);
  };
  const updateQueueStatus = (id, status) => {
    setQueue(queue.map(q =>
      q.id === id ? { ...q, status } : q
    ));
  };

  const handleScheduleSave = (scheduleData) => {
    if (editingSchedule) {
      setSchedule(schedule.map(s =>
        s.id === editingSchedule.id ? { ...editingSchedule, ...scheduleData } : s
      ));
    } else {
      setSchedule([...schedule, { id: Date.now(), ...scheduleData }]);
    }
    setShowScheduleForm(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (id) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  const handleCreateAppointment = (patient = null) => {
    setSelectedPatient(patient);
    setShowAppointmentForm(true);
  };

  const handleExaminationSave = (examinationData) => {
    console.log('Examination data saved:', examinationData);
    setShowExaminationForm(false);
    setSelectedPatient(null);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  const handleCreateExamination = (patient) => {
    setSelectedPatient(patient);
    setShowExaminationForm(true);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const getQueueStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'called': return 'bg-blue-100 text-blue-800';
      case 'doing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQueueStatusText = (status) => {
    switch (status) {
      case 'waiting': return 'Đang chờ';
      case 'called': return 'Đã gọi';
      case 'doing': return 'Đang làm chỉ định';
      case 'completed': return 'Hoàn thành';
      case 'canceled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleCompleteExamination = (patientId) => {
    setQueue(prevQueue =>
      prevQueue.map(p =>
        p.id === patientId ? { ...p, status: 'completed' } : p
      )
    );
  };

  const handleAppointmentSave = (appointmentData) => {

    setAppointments([...appointments, { id: Date.now(), ...appointmentData, status: 'pending' }]);
    setShowAppointmentForm(false);
    setSelectedPatient(null);
  };

  if (showScheduleForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <ScheduleForm
            schedule={editingSchedule}
            onSave={handleScheduleSave}
            onCancel={() => {
              setShowScheduleForm(false);
              setEditingSchedule(null);
            }}
          />
        </div>
      </div>
    );
  }

  if (showExaminationForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <ExaminationForm
            patient={selectedPatient}
            onSave={handleExaminationSave}
            onCancel={() => {
              setShowExaminationForm(false);
              setSelectedPatient(null);
            }}
            onStatusChange={(newStatus) => {
              setQueue(prevQueue =>
                prevQueue.map(p =>
                  p.id === selectedPatient.id ? { ...p, status: newStatus } : p
                )
              );
            }}
          />
        </div>
      </div>
    );
  }

  if (showPatientDetail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <PatientDetail
            patient={selectedPatient}
            onBack={() => {
              setShowPatientDetail(false);
              setSelectedPatient(null);
            }}
            onEdit={() => {
              console.log('Edit patient');
            }}
            onCreateMedicalRecord
          />
        </div>
      </div>
    );
  }

  if (showResultLookup && selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <TodayVisitResult
            patient={selectedPatient}
            onBack={() => {
              setSelectedPatient(null);
            }}
            onComplete={() => handleCompleteExamination(selectedPatient.id)}
          />
        </div>
      </div>
    );
  }

  if (showAppointmentForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <AppointmentForm
            appointment={() => { }}
            patient={selectedPatient}
            onSave={handleAppointmentSave}
            onCancel={() => {
              setShowAppointmentForm(false);
              setSelectedPatient(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard - Bác Sĩ</h1>
              <p className="text-gray-600">Quản lý lịch làm và khám bệnh</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">Trực tuyến</Badge>
              <Button variant="outline" onClick={handleLogout}>Đăng Xuất</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Thông Tin Của Tôi
            </TabsTrigger>
            <TabsTrigger value="doctor-profile" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Hồ Sơ Bác Sĩ
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Lịch Làm
            </TabsTrigger>
            <TabsTrigger value="examinations" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Lịch Khám
            </TabsTrigger>
            <TabsTrigger value="room-materials" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Vật Tư Trong Phòng
            </TabsTrigger>

          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <Input defaultValue="BS. Nguyễn Văn An" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <Input type="date" defaultValue="1980-05-15" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <Input defaultValue="Nam" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input defaultValue="bacsi@khanhanclinic.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <Input defaultValue="0987654321" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <Input defaultValue="Hà Nội, Việt Nam" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button>Cập Nhật Thông Tin</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Doctor Profile Tab */}
          <TabsContent value="doctor-profile" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Hồ Sơ Bác Sĩ</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên ảnh
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ chuyên môn</label>
                  <Input defaultValue="Thạc sĩ Y khoa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số năm kinh nghiệm</label>
                  <Input defaultValue="15 năm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bằng cấp</label>
                  <Textarea defaultValue="- Bằng Tiến sĩ Y khoa - Đại học Y Hà Nội&#10;- Chứng chỉ chuyên khoa Thần kinh - Bệnh viện Bạch Mai&#10;- Chứng chỉ điều trị đau đầu - Hiệp hội Thần kinh Việt Nam" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button>Cập Nhật Hồ Sơ</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <WeeklyScheduleGrid
              schedules={schedule}
              onCreateSchedule={() => setShowScheduleForm(true)}
              onEditSchedule={(scheduleItem) => {
                setEditingSchedule(scheduleItem);
                setShowScheduleForm(true);
              }}
            />
          </TabsContent>

          {/* Examinations Tab */}
          <TabsContent value="examinations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Hàng Đợi Khám - Hôm Nay</h2>
              <div className="text-sm text-gray-600">Phòng khám 1</div>
            </div>

            <div className="grid gap-4">
              {queue.map((patient) => (
                <Card key={patient.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600">#{patient.queueNumber}</span>
                        <h3 className="text-lg font-semibold">{patient.patientName}</h3>
                        <Badge className={getQueueStatusColor(patient.status)}>
                          {getQueueStatusText(patient.status)}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-4 h-4" />
                          Giờ hẹn: {patient.time}
                        </div>
                        <div>Triệu chứng: {patient.symptoms}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {['waiting', 'doing'].includes(patient.status) && (
                        <Button
                          size="sm"
                          onClick={() => updateQueueStatus(patient.id, 'called')}
                        >
                          Gọi Bệnh Nhân
                        </Button>
                      )}

                      {['called', 'doing'].includes(patient.status) && (
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            className="bg-black hover:bg-green-700 text-white"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowResultLookup(true);
                            }}
                          >
                            Xem kết quả
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem Hồ Sơ
                          </Button>

                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCreateExamination(patient)}
                          >
                            Tạo Phiếu Khám
                          </Button>

                        </div>
                      )}
                      {patient.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreateAppointment()}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Đặt Lịch Tái Khám
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="room-materials" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Vật tư tại phòng làm việc</h2>
              {schedule
                .filter(s => s.status === 'có mặt')
                .map((s, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-bold mb-2">{s.room}</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      {(roomMaterials[s.room] || []).map((material) => (
                        <li key={material.id} className="flex justify-between items-center">
                          <span>{material.name}: {material.quantity} {material.unit}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRoom(s.room);
                              setSelectedMaterial(material);
                              setShowMaterialModal(true);
                            }}
                          >
                            Sử dụng
                          </Button>
                        </li>
                      ))}

                      {(!mockRoomMaterials[s.room] || mockRoomMaterials[s.room].length === 0) && (
                        <li className="text-gray-500">Không có vật tư</li>
                      )}
                    </ul>
                  </div>
                ))}
            </Card>
          </TabsContent>

        </Tabs>
        {showMaterialModal && selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[300px] space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Sử dụng vật tư</h3>
              <p>{selectedMaterial.name} ({selectedMaterial.quantity} {selectedMaterial.unit} còn lại)</p>
              <Input
                type="number"
                placeholder="Nhập số lượng"
                value={usedQuantity}
                onChange={(e) => setUsedQuantity(e.target.value)}
                min={1}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMaterialModal(false)}>Hủy</Button>
                <Button onClick={handleUseMaterial} className="bg-blue-600 text-white">
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
