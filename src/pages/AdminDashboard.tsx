
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  User, 
  Settings,
  Plus,
  Edit,
  Eye,
  Trash,
  Search,
  FileText,
  Building
} from 'lucide-react';
import UserForm from '@/components/UserForm';
import PatientForm from '@/components/PatientForm';
import PatientDetail from '@/components/PatientDetail';
import RoomForm from '@/components/RoomForm';

// Mock data
const initialUsers = {
  doctors: [
    { id: 1, name: 'BS. Nguyễn Văn An', email: 'bacsi1@clinic.com', phone: '0987654321', status: 'active' },
    { id: 2, name: 'BS. Trần Thị Bình', email: 'bacsi2@clinic.com', phone: '0987654322', status: 'active' }
  ],
  receptionists: [
    { id: 1, name: 'Nguyễn Thị Lễ Tân', email: 'letan@clinic.com', phone: '0987654323', status: 'active' }
  ],
  technicians: [
    { id: 1, name: 'Nguyễn Văn Kỹ Thuật', email: 'kythuat@clinic.com', phone: '0987654324', status: 'active' }
  ]
};

const initialPatients = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'patient1@gmail.com',
    phone: '0901234567',
    visitCount: 3,
    lastVisit: '2024-01-10',
    birthdate: '1990-05-15',
    gender: 'male',
    address: 'Hà Nội',
    medicalHistory: 'Tiền sử đau đầu, mất ngủ'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'patient2@gmail.com',
    phone: '0912345678',
    visitCount: 1,
    lastVisit: '2024-01-15',
    birthdate: '1985-08-20',
    gender: 'female',
    address: 'Hồ Chí Minh',
    medicalHistory: 'Không có tiền sử bệnh đặc biệt'
  }
];

const initialRooms = {
  examination: [
    { id: 1, name: 'Phòng khám 1', status: 'available', description: 'Phòng khám tổng quát với đầy đủ thiết bị' },
    { id: 2, name: 'Phòng khám 2', status: 'occupied', description: 'Phòng khám chuyên khoa thần kinh' }
  ],
  laboratory: [
    { id: 1, name: 'Phòng CT', status: 'available', description: 'Máy CT 64 lát cắt hiện đại' },
    { id: 2, name: 'Phòng siêu âm', status: 'maintenance', description: 'Máy siêu âm 4D chất lượng cao' }
  ]
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // State for data
  const [users, setUsers] = useState(initialUsers);
  const [patients, setPatients] = useState(initialPatients);
  const [rooms, setRooms] = useState(initialRooms);

  const handleLogout = () => {
    console.log('Đăng xuất thành công');
    window.location.href = '/';
  };

  const handleSaveUser = (userType, userData) => {
    if (editingItem) {
      // Update existing user
      setUsers(prev => ({
        ...prev,
        [userType]: prev[userType].map(user => 
          user.id === editingItem.id ? { ...userData, id: editingItem.id } : user
        )
      }));
    } else {
      // Add new user
      const newId = Math.max(...users[userType].map(u => u.id), 0) + 1;
      setUsers(prev => ({
        ...prev,
        [userType]: [...prev[userType], { ...userData, id: newId }]
      }));
    }
    setShowForm(null);
    setEditingItem(null);
  };

  const handleDeleteUser = (userType, userId) => {
    setUsers(prev => ({
      ...prev,
      [userType]: prev[userType].filter(user => user.id !== userId)
    }));
  };

  const handleSavePatient = (patientData) => {
    if (editingItem) {
      // Update existing patient
      setPatients(prev => prev.map(patient => 
        patient.id === editingItem.id ? { ...patientData, id: editingItem.id, visitCount: patient.visitCount, lastVisit: patient.lastVisit } : patient
      ));
    } else {
      // Add new patient
      const newId = Math.max(...patients.map(p => p.id), 0) + 1;
      setPatients(prev => [...prev, { ...patientData, id: newId, visitCount: 0, lastVisit: 'Chưa khám' }]);
    }
    setShowForm(null);
    setEditingItem(null);
  };

  const handleSaveRoom = (roomType, roomData) => {
    if (editingItem) {
      // Update existing room
      setRooms(prev => ({
        ...prev,
        [roomType]: prev[roomType].map(room => 
          room.id === editingItem.id ? { ...roomData, id: editingItem.id } : room
        )
      }));
    } else {
      // Add new room
      const newId = Math.max(...rooms[roomType].map(r => r.id), 0) + 1;
      setRooms(prev => ({
        ...prev,
        [roomType]: [...prev[roomType], { ...roomData, id: newId }]
      }));
    }
    setShowForm(null);
    setEditingItem(null);
  };

  const handleDeleteRoom = (roomType, roomId) => {
    setRooms(prev => ({
      ...prev,
      [roomType]: prev[roomType].filter(room => room.id !== roomId)
    }));
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomStatusText = (status) => {
    switch (status) {
      case 'available': return 'Sẵn sàng';
      case 'occupied': return 'Đang sử dụng';
      case 'maintenance': return 'Bảo trì';
      default: return status;
    }
  };

  // Show forms
  if (showForm?.startsWith('user-')) {
    const userType = showForm.split('-')[1];
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <UserForm
            userType={userType}
            user={editingItem}
            onSave={(userData) => handleSaveUser(userType, userData)}
            onCancel={() => { setShowForm(null); setEditingItem(null); }}
          />
        </div>
      </div>
    );
  }

  if (showForm === 'patient') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <PatientForm
            patient={editingItem}
            onSave={handleSavePatient}
            onCancel={() => { setShowForm(null); setEditingItem(null); }}
          />
        </div>
      </div>
    );
  }

  if (showForm?.startsWith('room-')) {
    const roomType = showForm.split('-')[1];
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <RoomForm
            roomType={roomType}
            room={editingItem}
            onSave={(roomData) => handleSaveRoom(roomType, roomData)}
            onCancel={() => { setShowForm(null); setEditingItem(null); }}
          />
        </div>
      </div>
    );
  }

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <PatientDetail
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
          onEdit={() => {
            setEditingItem(selectedPatient);
            setSelectedPatient(null);
            setShowForm('patient');
          } } onCreateMedicalRecord={undefined}        />
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
              <h1 className="text-2xl font-bold text-gray-800">Dashboard - Quản Trị Viên</h1>
              <p className="text-gray-600">Quản lý hệ thống toàn diện</p>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Quản Lý Tài Khoản
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Quản Lý Bệnh Nhân
            </TabsTrigger>
            <TabsTrigger value="clinic" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Quản Lý Phòng Khám
            </TabsTrigger>
          </TabsList>

          {/* Accounts Management Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Doctors */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Bác Sĩ</h3>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowForm('user-doctors')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                </div>
                <div className="space-y-2">
                  {users.doctors.map((doctor) => (
                    <div key={doctor.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{doctor.name}</div>
                        <div className="text-xs text-gray-500">{doctor.email}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1"
                          onClick={() => {
                            setEditingItem(doctor);
                            setShowForm('user-doctors');
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1 text-red-600"
                          onClick={() => handleDeleteUser('doctors', doctor.id)}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Receptionists */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Lễ Tân</h3>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowForm('user-receptionists')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                </div>
                <div className="space-y-2">
                  {users.receptionists.map((receptionist) => (
                    <div key={receptionist.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{receptionist.name}</div>
                        <div className="text-xs text-gray-500">{receptionist.email}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1"
                          onClick={() => {
                            setEditingItem(receptionist);
                            setShowForm('user-receptionists');
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1 text-red-600"
                          onClick={() => handleDeleteUser('receptionists', receptionist.id)}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Technicians */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Kỹ Thuật Viên</h3>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowForm('user-technicians')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm
                  </Button>
                </div>
                <div className="space-y-2">
                  {users.technicians.map((technician) => (
                    <div key={technician.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{technician.name}</div>
                        <div className="text-xs text-gray-500">{technician.email}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1"
                          onClick={() => {
                            setEditingItem(technician);
                            setShowForm('user-technicians');
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1 text-red-600"
                          onClick={() => handleDeleteUser('technicians', technician.id)}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Patients Management Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Quản Lý Hồ Sơ Bệnh Nhân</h2>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowForm('patient')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm Bệnh Nhân
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm bệnh nhân..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              {patients
                .filter(patient => 
                  patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.phone.includes(searchTerm)
                )
                .map((patient) => (
                <Card key={patient.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>Email: {patient.email}</div>
                        <div>SĐT: {patient.phone}</div>
                        <div>Số lượt khám: {patient.visitCount}</div>
                        <div>Lần khám cuối: {patient.lastVisit}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem Chi Tiết
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        Hồ Sơ Y Tế
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingItem(patient);
                          setShowForm('patient');
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Chỉnh Sửa
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Clinic Management Tab */}
          <TabsContent value="clinic" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Examination Rooms */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Phòng Khám Tổng Quát</h3>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowForm('room-examination')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm Phòng
                  </Button>
                </div>
                <div className="space-y-2">
                  {rooms.examination.map((room) => (
                    <div key={room.id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{room.name}</div>
                        <Badge className={getRoomStatusColor(room.status)}>
                          {getRoomStatusText(room.status)}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1"
                          onClick={() => {
                            setEditingItem(room);
                            setShowForm('room-examination');
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1 text-red-600"
                          onClick={() => handleDeleteRoom('examination', room.id)}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Laboratory Rooms */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Phòng Xét Nghiệm</h3>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowForm('room-laboratory')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm Phòng
                  </Button>
                </div>
                <div className="space-y-2">
                  {rooms.laboratory.map((room) => (
                    <div key={room.id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{room.name}</div>
                        <Badge className={getRoomStatusColor(room.status)}>
                          {getRoomStatusText(room.status)}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1"
                          onClick={() => {
                            setEditingItem(room);
                            setShowForm('room-laboratory');
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="p-1 text-red-600"
                          onClick={() => handleDeleteRoom('laboratory', room.id)}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Services Management */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Quản Lý Dịch Vụ</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Dịch Vụ
                </Button>
              </div>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tính năng quản lý dịch vụ sẽ được phát triển</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
