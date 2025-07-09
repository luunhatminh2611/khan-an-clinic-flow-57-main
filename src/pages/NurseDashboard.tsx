import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Calendar, FileText, Clock, Package,
  Upload, Stethoscope, Eye, Users, Bell, CheckCircle, X,
  AlertTriangle, Plus, Minus, RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import PatientCallDisplay from '@/components/PatientCallDisplay';

// Mock data cho hàng chờ bệnh nhân (từ ReceptionistDashboard)
// Dữ liệu này sẽ được đồng bộ với appointments từ ReceptionistDashboard
const mockQueue = [
  {
    id: 1,
    visitId: 1703123456789,
    queueNumber: 1,
    patientName: "Nguyễn Văn A",
    time: "08:00",
    symptoms: "Đau đầu, chóng mặt",
    status: "waiting", // Bước 1: Chờ y tá gọi
    room: "Phòng 1",
    doctor: "BS. Nguyễn Văn An",
    email: "nguyenvana@gmail.com",
    phone: "0901234567"
  },
  {
    id: 2,
    visitId: 1703123456790,
    queueNumber: 2,
    patientName: "Trần Thị B",
    time: "09:00",
    symptoms: "Mất ngủ, lo âu",
    status: "in-examination", // Đang khám
    room: "Phòng 2",
    doctor: "BS. Trần Thị Bình",
    email: "tranthib@gmail.com",
    phone: "0912345678"
  },
  {
    id: 3,
    visitId: 1703123456791,
    queueNumber: 3,
    patientName: "Lê Văn C",
    time: "09:30",
    symptoms: "Kiểm tra định kỳ",
    status: "pending", // Chờ thanh toán
    room: "Phòng 1",
    doctor: "BS. Nguyễn Văn An",
    email: "levanc@gmail.com",
    phone: "0923456789"
  },
  {
    id: 4,
    visitId: 1703123456792,
    queueNumber: 4,
    patientName: "Phạm Thị D",
    time: "10:00",
    symptoms: "Tê tay, đau vai gáy",
    status: "in-laboratory", // Đang đi xét nghiệm
    room: "Phòng 3",
    doctor: "BS. Lê Minh Châu",
    email: "phamthid@gmail.com",
    phone: "0934567890"
  },
  {
    id: 5,
    visitId: 1703123456793,
    queueNumber: 5,
    patientName: "Hoàng Văn E",
    time: "10:30",
    symptoms: "Khó thở, đau ngực",
    status: "returning", // Trở lại gặp bác sĩ
    room: "Phòng 2",
    doctor: "BS. Trần Thị Bình",
    email: "hoangvane@gmail.com",
    phone: "0945678901"
  }
];

// Mock data cho phòng khám và vật tư
const mockRooms = [
  {
    id: 1,
    name: "Phòng 1",
    doctor: "BS. Nguyễn Văn An",
    status: "available", // Sửa thành available để Nguyễn Văn A có thể vào
    currentPatient: null,
    nextPatient: "Nguyễn Văn A",
    supplies: [
      {
        id: 1,
        name: "Găng tay y tế",
        unit: "hộp",
        currentStock: 15,
        minStock: 5,
        dailyUsage: 8,
        lastUpdated: "2024-01-15",
        status: "normal" // normal, low, critical
      },
      {
        id: 2,
        name: "Khẩu trang y tế",
        unit: "hộp",
        currentStock: 3,
        minStock: 5,
        dailyUsage: 12,
        lastUpdated: "2024-01-15",
        status: "low"
      },
      {
        id: 3,
        name: "Mũ phẫu thuật",
        unit: "hộp",
        currentStock: 20,
        minStock: 3,
        dailyUsage: 5,
        lastUpdated: "2024-01-15",
        status: "normal"
      },
      {
        id: 4,
        name: "Áo choàng y tế",
        unit: "cái",
        currentStock: 1,
        minStock: 2,
        dailyUsage: 3,
        lastUpdated: "2024-01-15",
        status: "critical"
      }
    ]
  },
  {
    id: 2,
    name: "Phòng 2",
    doctor: "BS. Trần Thị Bình",
    status: "available",
    currentPatient: null,
    nextPatient: "Trần Thị B",
    supplies: [
      {
        id: 5,
        name: "Găng tay y tế",
        unit: "hộp",
        currentStock: 8,
        minStock: 5,
        dailyUsage: 6,
        lastUpdated: "2024-01-15",
        status: "normal"
      },
      {
        id: 6,
        name: "Khẩu trang y tế",
        unit: "hộp",
        currentStock: 2,
        minStock: 5,
        dailyUsage: 10,
        lastUpdated: "2024-01-15",
        status: "low"
      },
      {
        id: 7,
        name: "Bông gòn",
        unit: "hộp",
        currentStock: 25,
        minStock: 10,
        dailyUsage: 8,
        lastUpdated: "2024-01-15",
        status: "normal"
      }
    ]
  },
  {
    id: 3,
    name: "Phòng 3",
    doctor: "BS. Lê Minh Châu",
    status: "available",
    currentPatient: null,
    nextPatient: "Phạm Thị D",
    supplies: [
      {
        id: 8,
        name: "Găng tay y tế",
        unit: "hộp",
        currentStock: 12,
        minStock: 5,
        dailyUsage: 7,
        lastUpdated: "2024-01-15",
        status: "normal"
      },
      {
        id: 9,
        name: "Khẩu trang y tế",
        unit: "hộp",
        currentStock: 4,
        minStock: 5,
        dailyUsage: 9,
        lastUpdated: "2024-01-15",
        status: "low"
      },
      {
        id: 10,
        name: "Băng keo y tế",
        unit: "cuộn",
        currentStock: 30,
        minStock: 15,
        dailyUsage: 12,
        lastUpdated: "2024-01-15",
        status: "normal"
      }
    ]
  }
];

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("queue");
  const [queue, setQueue] = useState(mockQueue);
  const [rooms, setRooms] = useState(mockRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [supplySearchTerm, setSupplySearchTerm] = useState("");

  const updateQueueStatus = (id, status) => {
    setQueue(queue.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const handleCallPatient = (patient) => {
    // Kiểm tra xem phòng có đang bận không
    const room = rooms.find(r => r.name === patient.room);
    if (room && room.status === "occupied") {
      toast({
        title: "Phòng đang bận",
        description: "Vui lòng chờ bệnh nhân hiện tại hoàn thành khám",
        variant: "destructive"
      });
      return;
    }

    updateQueueStatus(patient.id, "called");
    setCurrentCall(patient);
    
    // Cập nhật trạng thái phòng
    setRooms(rooms.map(r => 
      r.name === patient.room 
        ? { ...r, status: "occupied", currentPatient: patient.patientName }
        : r
    ));

    toast({
      title: "Đã gọi bệnh nhân",
      description: `Gọi ${patient.patientName} vào ${patient.room}`,
    });
  };

  const handlePatientEnter = (patientId) => {
    const patient = queue.find(p => p.id === patientId);
    updateQueueStatus(patientId, "in-examination");
    
    toast({
      title: "Bệnh nhân đã vào khám",
      description: `${patient.patientName} đã vào phòng khám`,
    });
  };

  const handlePatientComplete = (patientId) => {
    const patient = queue.find(p => p.id === patientId);
    updateQueueStatus(patientId, "completed");
    
    // Cập nhật trạng thái phòng
    setRooms(rooms.map(r => 
      r.name === patient.room 
        ? { ...r, status: "available", currentPatient: null }
        : r
    ));

    toast({
      title: "Hoàn thành khám",
      description: `${patient.patientName} đã hoàn thành khám`,
    });
  };

  const handleCallComplete = (patientId) => {
    setCurrentCall(null);
    toast({
      title: "Đã hoàn thành gọi",
      description: "Màn hình gọi đã được đóng",
    });
  };

  // Hàm cập nhật vật tư
  const updateSupplyStock = (roomId, supplyId, newStock, usage = 0) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          supplies: room.supplies.map(supply => {
            if (supply.id === supplyId) {
              const updatedStock = newStock;
              const updatedUsage = supply.dailyUsage + usage;
              let status = "normal";
              
              if (updatedStock <= supply.minStock) {
                status = "critical";
              } else if (updatedStock <= supply.minStock * 1.5) {
                status = "low";
              }
              
              return {
                ...supply,
                currentStock: updatedStock,
                dailyUsage: updatedUsage,
                lastUpdated: new Date().toISOString().split('T')[0],
                status
              };
            }
            return supply;
          })
        };
      }
      return room;
    }));
  };

  // Hàm reset daily usage
  const resetDailyUsage = () => {
    setRooms(rooms.map(room => ({
      ...room,
      supplies: room.supplies.map(supply => ({
        ...supply,
        dailyUsage: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      }))
    })));
    
    toast({
      title: "Đã reset thống kê ngày",
      description: "Thống kê sử dụng vật tư đã được reset về 0",
    });
  };

  const handleLogout = () => {
    navigate("/");
  };

  const getQueueStatusColor = (status) => {
    switch (status) {
      case "waiting": return "bg-yellow-100 text-yellow-800";
      case "called": return "bg-blue-100 text-blue-800";
      case "in-examination": return "bg-purple-100 text-purple-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "in-laboratory": return "bg-indigo-100 text-indigo-800";
      case "returning": return "bg-pink-100 text-pink-800";
      case "completed": return "bg-green-100 text-green-800";
      case "canceled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getQueueStatusText = (status) => {
    switch (status) {
      case "waiting": return "Đang chờ";
      case "called": return "Đã gọi";
      case "in-examination": return "Đang khám";
      case "pending": return "Chờ thanh toán";
      case "in-laboratory": return "Đang xét nghiệm";
      case "returning": return "Trở lại khám";
      case "completed": return "Hoàn thành";
      case "canceled": return "Đã hủy";
      default: return status;
    }
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "occupied": return "bg-red-100 text-red-800";
      case "maintenance": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoomStatusText = (status) => {
    switch (status) {
      case "available": return "Trống";
      case "occupied": return "Đang khám";
      case "maintenance": return "Bảo trì";
      default: return status;
    }
  };

  const getSupplyStatusColor = (status) => {
    switch (status) {
      case "normal": return "bg-green-100 text-green-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSupplyStatusText = (status) => {
    switch (status) {
      case "normal": return "Đủ";
      case "low": return "Sắp hết";
      case "critical": return "Cần cấp";
      default: return status;
    }
  };

  const filteredQueue = queue.filter(patient =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán thống kê tổng quan
  const totalPatients = queue.length;
  const completedPatients = queue.filter(p => p.status === "completed").length;
  const waitingPatients = queue.filter(p => p.status === "waiting").length;
  const criticalSupplies = rooms.flatMap(room => 
    room.supplies.filter(supply => supply.status === "critical")
  ).length;
  const lowSupplies = rooms.flatMap(room => 
    room.supplies.filter(supply => supply.status === "low")
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Dashboard Y Tá</h1>
                  <p className="text-sm text-gray-600">Quản lý hàng chờ và hỗ trợ khám bệnh</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Y tá</p>
                <p className="font-semibold text-gray-800">Nguyễn Thị Y Tá</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.open('/waiting-room-display', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Màn Hình Chờ
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="queue">Hàng Chờ Bệnh Nhân</TabsTrigger>
            <TabsTrigger value="supplies">Quản Lý Vật Tư Trong Phòng</TabsTrigger>
          </TabsList>

          {/* Hàng Chờ Bệnh Nhân Tab */}
          <TabsContent value="queue" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Hàng Chờ Bệnh Nhân</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    placeholder="Tìm kiếm bệnh nhân, phòng, bác sĩ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredQueue.map((patient) => (
                <Card key={patient.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-blue-600">#{patient.queueNumber}</span>
                          <h3 className="text-lg font-semibold">{patient.patientName}</h3>
                        </div>
                        <Badge className={getQueueStatusColor(patient.status)}>
                          {getQueueStatusText(patient.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {patient.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Stethoscope className="w-4 h-4" />
                          {patient.doctor}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {patient.room}
                        </div>
                        <div>Triệu chứng: {patient.symptoms}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {patient.status === "waiting" && (
                        <Button
                          size="sm"
                          onClick={() => handleCallPatient(patient)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          Gọi Bệnh Nhân
                        </Button>
                      )}

                      {patient.status === "called" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handlePatientEnter(patient.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Bệnh Nhân Vào
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQueueStatus(patient.id, "waiting")}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Hủy Gọi
                          </Button>
                        </>
                      )}

                      {patient.status === "in-examination" && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Đang khám với bác sĩ
                        </Badge>
                      )}

                      {patient.status === "pending" && (
                        <Badge className="bg-orange-100 text-orange-800">
                          Chờ thanh toán
                        </Badge>
                      )}

                      {patient.status === "in-laboratory" && (
                        <Badge className="bg-indigo-100 text-indigo-800">
                          Đang xét nghiệm
                        </Badge>
                      )}

                      {patient.status === "returning" && (
                        <Button
                          size="sm"
                          onClick={() => handleCallPatient(patient)}
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          Gọi Lại Khám
                        </Button>
                      )}

                      {patient.status === "completed" && (
                        <Badge className="bg-green-100 text-green-800">
                          Đã hoàn thành
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quản Lý Vật Tư Trong Phòng Tab */}
          <TabsContent value="supplies" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quản Lý Vật Tư Trong Phòng</h2>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Tìm kiếm vật tư, phòng..."
                  value={supplySearchTerm}
                  onChange={(e) => setSupplySearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetDailyUsage}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Thống Kê Ngày
                </Button>
              </div>
            </div>

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng bệnh nhân</p>
                    <p className="text-2xl font-bold">{totalPatients}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đã hoàn thành</p>
                    <p className="text-2xl font-bold">{completedPatients}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cần cấp vật tư</p>
                    <p className="text-2xl font-bold">{criticalSupplies}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sắp hết vật tư</p>
                    <p className="text-2xl font-bold">{lowSupplies}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Danh sách phòng và vật tư */}
            <div className="grid gap-6">
              {rooms
                .filter(room => 
                  !supplySearchTerm || 
                  room.name.toLowerCase().includes(supplySearchTerm.toLowerCase()) ||
                  room.supplies.some(supply => 
                    supply.name.toLowerCase().includes(supplySearchTerm.toLowerCase())
                  )
                )
                .map((room) => (
                <Card key={room.id} className="p-6">
                  <div className="space-y-4">
                    {/* Header phòng */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{room.name}</h3>
                          <Badge className={getRoomStatusColor(room.status)}>
                            {getRoomStatusText(room.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" />
                            <span className="font-semibold">Bác sĩ:</span> {room.doctor}
                          </div>
                          
                          {room.currentPatient && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="font-semibold">Đang khám:</span> {room.currentPatient}
                            </div>
                          )}
                          
                          {room.nextPatient && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">Tiếp theo:</span> {room.nextPatient}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Danh sách vật tư */}
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-semibold mb-3">Vật tư y tế</h4>
                      <div className="grid gap-3">
                        {room.supplies
                          .filter(supply => 
                            !supplySearchTerm || 
                            supply.name.toLowerCase().includes(supplySearchTerm.toLowerCase())
                          )
                          .map((supply) => (
                          <div key={supply.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h5 className="font-semibold">{supply.name}</h5>
                                <Badge className={getSupplyStatusColor(supply.status)}>
                                  {getSupplyStatusText(supply.status)}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-semibold">Tồn kho:</span> {supply.currentStock} {supply.unit}
                                </div>
                                <div>
                                  <span className="font-semibold">Tối thiểu:</span> {supply.minStock} {supply.unit}
                                </div>
                                <div>
                                  <span className="font-semibold">Dùng hôm nay:</span> {supply.dailyUsage} {supply.unit}
                                </div>
                                <div>
                                  <span className="font-semibold">Cập nhật:</span> {supply.lastUpdated}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newStock = Math.max(0, supply.currentStock - 1);
                                  updateSupplyStock(room.id, supply.id, newStock, 1);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newStock = supply.currentStock + 10;
                                  updateSupplyStock(room.id, supply.id, newStock);
                                }}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Cảnh báo vật tư cần cấp */}
            {(criticalSupplies > 0 || lowSupplies > 0) && (
              <Card className="p-6 border-red-200 bg-red-50">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">Cảnh Báo Vật Tư</h3>
                </div>
                
                <div className="space-y-2">
                  {rooms.map(room => 
                    room.supplies
                      .filter(supply => supply.status === "critical" || supply.status === "low")
                      .map(supply => (
                        <div key={supply.id} className="flex justify-between items-center p-2 bg-white rounded">
                          <div>
                            <span className="font-semibold">{room.name}</span> - {supply.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSupplyStatusColor(supply.status)}>
                              {getSupplyStatusText(supply.status)}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              Còn {supply.currentStock} {supply.unit}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Patient Call Display */}
      <PatientCallDisplay 
        currentCall={currentCall} 
        onCallComplete={handleCallComplete}
      />
    </div>
  );
};

export default NurseDashboard; 