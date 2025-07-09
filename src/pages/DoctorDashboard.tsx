import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Calendar, FileText, Clock, Package,
  Upload, Stethoscope, Eye
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DoctorScheduleTab from './DoctorScheduleTab';
import TodayVisitResult from "@/components/TodayResult";
import PatientDetail from "@/components/PatientDetail";
import ExaminationForm from "@/components/ExaminationForm";
import AppointmentForm from "@/components/AppointmentForm";

// Mock data
const mockQueue = [
  {
    id: 1,
    queueNumber: 1,
    patientName: "Nguyễn Văn A",
    time: "08:00", // Sửa thành 08:00 để đồng bộ với các dashboard khác
    symptoms: "Đau đầu, chóng mặt",
    status: "waiting", // Bước 1: Chờ y tá gọi
  },
  {
    id: 2,
    queueNumber: 2,
    patientName: "Trần Thị B",
    time: "09:00",
    symptoms: "Mất ngủ, lo âu",
    status: "in-examination", // Đang khám
    examinationForm: {
      diagnosis: "Thiếu máu não",
      note: "Cần nghỉ ngơi",
      doctor: "BS. Nguyễn Văn An"
    }
  },
  {
    id: 3,
    queueNumber: 3,
    patientName: "Lê Văn C",
    time: "09:30",
    symptoms: "Kiểm tra định kỳ",
    status: "pending", // Chờ thanh toán sau khi tạo chỉ định
    examinationForm: {
      diagnosis: "Cần xét nghiệm thêm",
      note: "Đã tạo chỉ định xét nghiệm",
      doctor: "BS. Nguyễn Văn An",
      labTests: [
        { id: 1, room: "Phòng CT", services: ["Chụp CT não"], status: "pending" },
        { id: 2, room: "Phòng Siêu âm", services: ["Siêu âm Doppler"], status: "pending" }
      ]
    }
  },
  {
    id: 4,
    queueNumber: 4,
    patientName: "Phạm Thị D",
    time: "10:00",
    symptoms: "Tê tay, đau vai gáy",
    status: "in-laboratory", // Đang đi xét nghiệm
    examinationForm: {
      diagnosis: "Đã hoàn thành xét nghiệm",
      note: "Chờ kết quả",
      doctor: "BS. Nguyễn Văn An",
      labTests: [
        { id: 3, room: "Phòng CT", services: ["Chụp CT cột sống"], status: "completed" },
        { id: 4, room: "Phòng X-quang", services: ["X-quang cột sống"], status: "completed" }
      ]
    }
  },
  {
    id: 5,
    queueNumber: 5,
    patientName: "Hoàng Văn E",
    time: "10:30",
    symptoms: "Khó thở, đau ngực",
    status: "returning", // Trở lại gặp bác sĩ
    examinationForm: {
      diagnosis: "Kết quả xét nghiệm bình thường",
      note: "Cần theo dõi thêm",
      doctor: "BS. Nguyễn Văn An",
      labTests: [
        { id: 5, room: "Phòng CT", services: ["Chụp CT ngực"], status: "completed" }
      ]
    }
  }
];

const mockAppointments = [
  {
    id: 1,
    patientName: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    time: "08:00",
    date: "2024-01-15",
    symptoms: "Đau đầu, chóng mặt",
    status: "pending",
  },
  {
    id: 2,
    patientName: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    time: "09:00",
    date: "2024-01-15",
    symptoms: "Mất ngủ",
    status: "checked-in",
  },
  {
    id: 3,
    patientName: "Phạm Văn C",
    email: "phamvanc@gmail.com",
    phone: "0988888888",
    time: "10:00",
    date: "2024-01-15",
    symptoms: "Tê tay, đau vai gáy",
    status: "payment-required",
    services: [
      { name: "Chụp CT", price: 500000 },
      { name: "Điện não đồ", price: 400000 },
    ],
  },
];

const mockRoomMaterials = {
  "Phòng A": [
    { id: 1, name: "Găng tay y tế", quantity: 50, unit: "đôi" },
    { id: 2, name: "Khẩu trang", quantity: 100, unit: "cái" },
    { id: 3, name: "Cồn sát khuẩn", quantity: 5, unit: "chai" },
  ],
  "Phòng B": [
    { id: 4, name: "Bông y tế", quantity: 20, unit: "gói" },
    { id: 5, name: "Băng gạc", quantity: 15, unit: "cuộn" },
  ],
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [queue, setQueue] = useState(mockQueue);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [usedQuantity, setUsedQuantity] = useState("");
  const [roomMaterials, setRoomMaterials] = useState(mockRoomMaterials);
  const [showResultLookup, setShowResultLookup] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [showExaminationForm, setShowExaminationForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [callError, setCallError] = useState("");

  const handleUseMaterial = () => {
    if (!selectedRoom || !selectedMaterial) return;

    const quantity = parseInt(usedQuantity);
    if (isNaN(quantity) || quantity <= 0) return alert("Số lượng không hợp lệ");

    setRoomMaterials((prev) => ({
      ...prev,
      [selectedRoom]: prev[selectedRoom].map((m) =>
        m.id === selectedMaterial.id
          ? { ...m, quantity: Math.max(0, m.quantity - quantity) }
          : m
      ),
    }));

    setShowMaterialModal(false);
    setUsedQuantity("");
    setSelectedMaterial(null);
  };

  const updateQueueStatus = (id, status) => {
    setQueue(queue.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const handleCallPatient = (patient) => {
    const alreadyCalled = queue.some((q) => q.status === "called");
    if (alreadyCalled) {
      setCallError(
        "Trong phòng có người, vui lòng chờ bệnh nhân hiện tại vào khám trước khi gọi tiếp."
      );
      setTimeout(() => setCallError(""), 3000); // Tự động ẩn sau 3 giây
      return;
    }
    setCallError("");
    updateQueueStatus(patient.id, "called");
  };

  const handlePatientArrived = (patientId) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === patientId ? { ...q, status: "doing" } : q))
    );
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
      case "finish": return "bg-red-100 text-red-800";
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
      case "finish": return "Hoàn thành chỉ định";
      default: return status;
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  const handleCreateExamination = (patient) => {
    setSelectedPatient(patient);
    setShowExaminationForm(true);
  };

  const handleExaminationSave = (data) => {
    setQueue((prevQueue) =>
      prevQueue.map((q) =>
        q.id === selectedPatient.id
          ? { ...q, examinationForm: data }
          : q
      )
    );
    setShowExaminationForm(false);
    setSelectedPatient(null);
  };

  const handleCreateAppointment = (patient = null) => {
    setSelectedPatient(patient);
    setShowAppointmentForm(true);
  };

  const handleCompleteExamination = (patientId) => {
    setQueue((prevQueue) =>
      prevQueue.map((p) =>
        p.id === patientId ? { ...p, status: "completed" } : p
      )
    );
  };

  const handleAppointmentSave = (appointmentData) => {
    if (editingAppointment) {
      setAppointments(
        appointments.map((a) =>
          a.id === editingAppointment.id
            ? { ...editingAppointment, ...appointmentData }
            : a
        )
      );
    } else {
      setAppointments([
        ...appointments,
        { id: Date.now(), ...appointmentData, status: "pending" },
      ]);
    }
    setShowAppointmentForm(false);
    setEditingAppointment(null);
    setSelectedPatient(null);
  };

  // Xử lý thanh toán - chuyển từ pending sang in-laboratory
  const handlePaymentComplete = (patientId) => {
    setQueue((prevQueue) =>
      prevQueue.map((q) =>
        q.id === patientId 
          ? { 
              ...q, 
              status: "in-laboratory",
              examinationForm: {
                ...q.examinationForm,
                labTests: q.examinationForm?.labTests?.map(test => ({
                  ...test,
                  status: "waiting" // Assignment chuyển sang waiting
                }))
              }
            }
          : q
      )
    );
  };

  // Xử lý hoàn thành tất cả assignment - chuyển sang returning
  const handleAllAssignmentsComplete = (patientId) => {
    setQueue((prevQueue) =>
      prevQueue.map((q) =>
        q.id === patientId 
          ? { ...q, status: "returning" }
          : q
      )
    );
  };

  // Kiểm tra và tự động chuyển trạng thái khi tất cả assignment hoàn thành
  const checkAndUpdateVisitStatus = (patientId) => {
    const patient = queue.find(q => q.id === patientId);
    if (patient?.examinationForm?.labTests) {
      const allCompleted = patient.examinationForm.labTests.every(test => test.status === "completed");
      if (allCompleted && patient.status === "in-laboratory") {
        handleAllAssignmentsComplete(patientId);
      }
    }
  };

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
            onCompleteSchedule={() => {
              handleCreateAppointment(selectedPatient);
              handleCompleteExamination(selectedPatient.id);
            }} />
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
              console.log("Edit patient");
            }}
            onCreateMedicalRecord
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
            initialData={selectedPatient?.examinationForm || null}

            onSave={handleExaminationSave}
            onCancel={() => {
              setShowExaminationForm(false);
              setSelectedPatient(null);
            }}
            onStatusChange={(newStatus) => {
              setQueue((prevQueue) =>
                prevQueue.map((p) =>
                  p.id === selectedPatient.id ? { ...p, status: newStatus } : p
                )
              );
            }}
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
            appointment={editingAppointment}
            patient={selectedPatient}
            onSave={handleAppointmentSave}
            onCancel={() => {
              setShowAppointmentForm(false);
              setEditingAppointment(null);
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
              <h1 className="text-2xl font-bold text-gray-800">
                Dashboard - Bác Sĩ
              </h1>
              <p className="text-gray-600">Quản lý lịch làm và khám bệnh</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">Trực tuyến</Badge>
              <Button variant="outline" onClick={handleLogout}>
                Đăng Xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Thông Tin Của Tôi
            </TabsTrigger>
            <TabsTrigger
              value="doctor-profile"
              className="flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              Hồ Sơ Bác Sĩ
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Lịch Làm
            </TabsTrigger>
            <TabsTrigger
              value="examinations"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Lịch Khám
            </TabsTrigger>
            <TabsTrigger
              value="room-materials"
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Vật Tư Trong Phòng
            </TabsTrigger>
            <TabsTrigger value="call-board" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Màn Hình Gọi
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>
                  <Input defaultValue="BS. Nguyễn Văn An" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <Input type="date" defaultValue="1980-05-15" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <Input defaultValue="Nam" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input defaultValue="bacsi@khanhanclinic.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <Input defaultValue="0987654321" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên ảnh
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trình độ chuyên môn
                  </label>
                  <Input defaultValue="Thạc sĩ Y khoa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số năm kinh nghiệm
                  </label>
                  <Input defaultValue="15 năm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bằng cấp
                  </label>
                  <Textarea
                    defaultValue="- Bằng Tiến sĩ Y khoa - Đại học Y Hà Nội&#10;- Chứng chỉ chuyên khoa Thần kinh - Bệnh viện Bạch Mai&#10;- Chứng chỉ điều trị đau đầu - Hiệp hội Thần kinh Việt Nam"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button>Cập Nhật Hồ Sơ</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Schedule Tab - Sử dụng component mới */}
          <TabsContent value="schedule" className="space-y-6">
            <DoctorScheduleTab />
          </TabsContent>

          {/* Examinations Tab */}
          <TabsContent value="examinations" className="space-y-6">
            <div className="flex justify-between items-center"></div>
            <h2 className="text-xl font-semibold">Hàng Đợi Khám - Hôm Nay</h2>
            <div className="text-sm text-gray-600">Phòng khám 1</div>

            {/* Thông báo lỗi khi gọi bệnh nhân */}
            {callError && (
              <div className="mb-4 text-red-600 font-semibold">{callError}</div>
            )}

            <div className="grid gap-4">
              {queue.map((patient) => (
                <Card key={patient.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600">
                          #{patient.queueNumber}
                        </span>
                        <h3 className="text-lg font-semibold">
                          {patient.patientName}
                        </h3>
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

                    <div className="flex flex-wrap justify-center gap-2">
                      {["waiting", "finish"].includes(patient.status) && (
                        <Button
                          size="sm"
                          onClick={() => handleCallPatient(patient)}
                        >
                          Gọi Bệnh Nhân
                        </Button>
                      )}

                      {["called",].includes(patient.status) && (

                        <><Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleCreateExamination(patient)}
                        >
                          {patient.examinationForm ? "Chỉnh Sửa Phiếu Khám" : "Tạo Phiếu Khám"}
                        </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem Hồ Sơ
                          </Button></>
                      )}

                      {["in-examination"].includes(patient.status) && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCreateExamination(patient)}
                          >
                            {patient.examinationForm ? "Chỉnh Sửa Phiếu Khám" : "Tạo Phiếu Khám"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem Hồ Sơ
                          </Button>
                        </>
                      )}

                      {["pending", "in-laboratory"].includes(patient.status) && (
                        <>
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
                        </>
                      )}

                      {["returning"].includes(patient.status) && (
                        <>
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowResultLookup(true);
                            }}
                          >
                            Tổng Hợp Kết Quả
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem Hồ Sơ
                          </Button>
                        </>
                      )}

                      {patient.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreateAppointment(patient)}
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

          {/* Room Materials Tab */}
          <TabsContent value="room-materials" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Vật tư tại phòng làm việc
              </h2>
              {Object.entries(roomMaterials).map(([room, materials]) => (
                <div key={room} className="mb-6">
                  <h3 className="text-lg font-bold mb-2">{room}</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {materials.map((material) => (
                      <li
                        key={material.id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {material.name}: {material.quantity} {material.unit}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRoom(room);
                            setSelectedMaterial(material);
                            setShowMaterialModal(true);
                          }}
                        >
                          Sử dụng
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Call Board Tab */}
          <TabsContent value="call-board" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
                Màn Hình Gọi Bệnh Nhân Vào Khám
              </h2>
              <div className="grid gap-4">
                {queue.filter((q) => q.status === "called").length === 0 && (
                  <div className="text-center text-gray-500">
                    Hiện chưa có bệnh nhân nào được gọi.
                  </div>
                )}
                {queue
                  .filter((q) => q.status === "called")
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className="border-l-8 border-blue-600 bg-blue-50 p-4 rounded flex flex-col md:flex-row items-center justify-between shadow"
                    >
                      <div className="flex-1">
                        <span className="block text-lg font-bold text-blue-800 mb-1">
                          Bệnh nhân: {patient.patientName}
                        </span>
                        <span className="block text-gray-700">
                          Số thứ tự:{" "}
                          <b className="text-xl">{patient.queueNumber}</b>
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 mt-2 md:mt-0">
                        <span className="text-blue-700 font-semibold">
                          Bác sĩ: BS. Nguyễn Văn An
                        </span>
                        <span>
                          Phòng: <b className="text-lg">Phòng 1</b>
                        </span>
                        <span className="text-green-700 font-semibold">
                          Vui lòng vào phòng khám
                        </span>

                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Material Usage Modal */}
        {showMaterialModal && selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[300px] space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Sử dụng vật tư
              </h3>
              <p>
                {selectedMaterial.name} ({selectedMaterial.quantity}{" "}
                {selectedMaterial.unit} còn lại)
              </p>
              <Input
                type="number"
                placeholder="Nhập số lượng"
                value={usedQuantity}
                onChange={(e) => setUsedQuantity(e.target.value)}
                min={1}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMaterialModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleUseMaterial}
                  className="bg-blue-600 text-white"
                >
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
