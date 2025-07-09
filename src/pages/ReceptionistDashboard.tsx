import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  User,
  Search,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  X,
  Clock,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientForm from "@/components/PatientForm";
import PatientDetail from "@/components/PatientDetail";
import AppointmentForm from "@/components/AppointmentForm";
import InvoiceModal from "@/components//InvoiceModal";
import DoctorAssignModal, { Doctor } from "@/components/DoctorAssignModal";

// Mock data
const mockPatients = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    birthDate: "1980-01-15",
    gender: "Nam",
    address: "Hà Nội",
    hasMedicalRecord: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    birthDate: "1990-05-20",
    gender: "Nữ",
    address: "Hồ Chí Minh",
    hasMedicalRecord: false,
  },
];

const mockAppointments = [
  {
    id: 1,
    patientName: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    time: "08:00",
    date: new Date().toISOString().split("T")[0],
    symptoms: "Đau đầu, chóng mặt",
    status: "waiting-for-confirmation",
    assignedDoctor: undefined,
    room: undefined,
    visitId: undefined,
    visitStatus: undefined,
    queueNumber: undefined,
    requestedDoctor: undefined,
  },
  {
    id: 2,
    patientName: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    time: "09:00",
    date: new Date().toISOString().split("T")[0],
    symptoms: "Mất ngủ",
    status: "waiting-for-check-in",
    assignedDoctor: undefined,
    room: undefined,
    visitId: undefined,
    visitStatus: undefined,
    queueNumber: undefined,
    requestedDoctor: undefined,
  },
  {
    id: 3,
    patientName: "Phạm Văn C",
    email: "phamvanc@gmail.com",
    phone: "0988888888",
    time: "10:00",
    date: new Date().toISOString().split("T")[0],
    symptoms: "Tê tay, đau vai gáy",
    status: "checked-in",
    assignedDoctor: "BS. Nguyễn Văn An",
    room: "Phòng 1",
    visitId: undefined,
    visitStatus: undefined,
    queueNumber: undefined,
    requestedDoctor: undefined,
  },
  {
    id: 4,
    patientName: "Lê Thị D",
    email: "lethid@gmail.com",
    phone: "0933333333",
    time: "11:00",
    date: new Date().toISOString().split("T")[0],
    symptoms: "Khó thở",
    status: "in-progress",
    assignedDoctor: "BS. Trần Thị Bình",
    room: "Phòng 2",
    visitId: 1703123456789,
    visitStatus: "in-examination",
    queueNumber: 1,
    requestedDoctor: undefined,
  },
  {
    id: 5,
    patientName: "Ngô Thị Y",
    email: "ngothiy@gmail.com",
    phone: "0977123456",
    time: "14:00",
    date: new Date().toISOString().split("T")[0],
    symptoms: "Cảm cúm, đau họng",
    status: "pending",
    assignedDoctor: "BS. Lê Quang Huy",
    room: "Phòng 3",
    visitId: 1703123456790,
    visitStatus: "pending",
    queueNumber: 2,
    requestedDoctor: undefined,
    services: [
      { name: "Chụp CT", price: 500000 },
      { name: "Điện não đồ", price: 400000 },
    ],
  },
];

const mockDoctorsToday = [
  { id: 1, name: "BS. Nguyễn Thị Hạnh", room: "Phòng 1" },
  { id: 2, name: "BS. Trần Văn Nam", room: "Phòng 2" },
  { id: 3, name: "BS. Lê Quang Huy", room: "Phòng 3" },
];

// --- MODAL CHỌN PHÒNG & BÁC SĨ ---
const RoomAssignModal = ({
  open,
  onClose,
  doctors,
  appointments,
  onAssign,
  roomAssignError,
  setRoomAssignError,
  appointmentToRoomAssign,
}) => {
  if (!open) return null;

  // Đếm số BN đang khám trong phòng
  const getPatientsInRoom = (room) =>
    appointments.filter((a) => a.room === room && a.status === "in-progress")
      .length;

  // Khi bấm "Chọn"
  const handleChoose = (doctor) => {
    if (getPatientsInRoom(doctor.room) >= 1) {
      setRoomAssignError("Phòng đã có người, vui lòng chọn phòng khác");
      return;
    }
    setRoomAssignError("");
    onAssign(doctor);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[600px] max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Chọn phòng khám & bác sĩ</h2>
        {roomAssignError && (
          <div className="mb-4 text-red-600 font-semibold">
            {roomAssignError}
          </div>
        )}
        <table className="w-full text-base mb-6 border">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3 px-3">Phòng</th>
              <th className="py-3 px-3">Bác sĩ</th>
              <th className="py-3 px-3">Số BN trong phòng</th>
              <th className="py-3 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr
                key={doctor.id}
                className={`border-b ${
                  appointmentToRoomAssign?.requestedDoctor === doctor.name
                    ? "bg-blue-50 font-semibold"
                    : ""
                }`}
              >
                <td className="py-3 px-3">{doctor.room}</td>
                <td className="py-3 px-3">
                  {doctor.name}
                  {appointmentToRoomAssign?.requestedDoctor === doctor.name && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-200 text-blue-900">
                      Ưu tiên
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">{getPatientsInRoom(doctor.room)}</td>
                <td className="py-3 px-3">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                    onClick={() => handleChoose(doctor)}
                  >
                    Chọn
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setRoomAssignError("");
              onClose();
            }}
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- END MODAL ---

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  // THÊM STATE cho modal chọn phòng
  const [showRoomAssignModal, setShowRoomAssignModal] = useState(false);
  const [appointmentToRoomAssign, setAppointmentToRoomAssign] = useState(null);
  const [roomAssignError, setRoomAssignError] = useState("");

  const [showDoctorAssignModal, setShowDoctorAssignModal] = useState(false);
  const [appointmentToAssign, setAppointmentToAssign] = useState(null);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const filteredAppointments = appointments.filter(
    (appointment) =>
      (appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.phone.includes(searchTerm)) &&
      appointment.date === selectedDate
  );

  const updateAppointmentStatus = (id, status) => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const handlePatientSave = (patientData) => {
    if (editingPatient) {
      setPatients(
        patients.map((p) =>
          p.id === editingPatient.id ? { ...editingPatient, ...patientData } : p
        )
      );
    } else {
      setPatients([
        ...patients,
        { id: Date.now(), ...patientData, hasMedicalRecord: false },
      ]);
    }
    setShowPatientForm(false);
    setEditingPatient(null);
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

  const handleCreateMedicalRecord = (patientId) => {
    setPatients(
      patients.map((p) =>
        p.id === patientId ? { ...p, hasMedicalRecord: true } : p
      )
    );
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handleCreateAppointment = (patient = null) => {
    setSelectedPatient(patient);
    setShowAppointmentForm(true);
  };

  // XÁC NHẬN CHO LỊCH CHỜ
  const handleAssignDoctor = (doctor) => {
    if (!appointmentToAssign) return;

    const updatedAppointments = appointments.map((apt) =>
      apt.id === appointmentToAssign.id
        ? {
            ...apt,
            status: "waiting-for-check-in",
            assignedDoctor: doctor.name,
            room: doctor.room,
          }
        : apt
    );

    setAppointments(updatedAppointments);
    setShowDoctorAssignModal(false);
    setAppointmentToAssign(null);
  };

  // CHỌN PHÒNG & BÁC SĨ KHI VÀO KHÁM
  // Luồng: Lễ tân bấm "Vào Khám" → Tạo Visit cho y tá quản lý
  const handleAssignRoom = (doctor) => {
    if (!appointmentToRoomAssign) return;

    // Tạo queueNumber dựa trên số bệnh nhân đã có trong phòng
    const patientsInRoom = appointments.filter(
      (apt) => apt.room === doctor.room && apt.status === "in-progress"
    ).length;
    const queueNumber = patientsInRoom + 1;

    const updatedAppointments = appointments.map((apt) =>
      apt.id === appointmentToRoomAssign.id
        ? {
            ...apt,
            status: "in-progress",
            assignedDoctor: doctor.name,
            room: doctor.room,
            visitId: Date.now(),
            visitStatus: "waiting",
            queueNumber: queueNumber, // Sử dụng queueNumber tính toán thay vì random
          }
        : apt
    );

    setAppointments(updatedAppointments);
    setShowRoomAssignModal(false);
    setAppointmentToRoomAssign(null);
  };

  const handleViewPatientInfo = (appointment) => {
    // Find existing patient or create new one from appointment data
    const existingPatient = patients.find(
      (p) =>
        p.name === appointment.patientName ||
        p.email === appointment.email ||
        p.phone === appointment.phone
    );

    if (existingPatient) {
      setSelectedPatient(existingPatient);
      setShowPatientDetail(true);
    } else {
      // Create new patient from appointment data
      const newPatient = {
        id: Date.now(),
        name: appointment.patientName,
        email: appointment.email,
        phone: appointment.phone,
        birthDate: "",
        gender: "",
        address: "",
        hasMedicalRecord: false,
      };
      setPatients([...patients, newPatient]);
      setSelectedPatient(newPatient);
      setShowPatientDetail(true);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting-for-confirmation":
        return "bg-yellow-100 text-yellow-800";
      case "waiting-for-check-in":
        return "bg-blue-100 text-blue-800";
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "waiting-for-confirmation":
        return "Chờ xác nhận lịch khám";
      case "waiting-for-check-in":
        return "Chờ Check-in";
      case "checked-in":
        return "Đã Check-in";
      case "in-progress":
        return "Đang Khám";
      case "pending":
        return "Cần Thanh Toán";
      case "completed":
        return "Hoàn Thành";
      case "canceled":
        return "Đã Hủy";
      default:
        return status;
    }
  };

  const handleShowInvoiceModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowInvoiceModal(true);
  };

  const handleConfirmInvoice = () => {
    if (!selectedAppointment) return;

    const updatedAppointments = appointments.map((apt) =>
      apt.id === selectedAppointment.id
        ? { 
            ...apt, 
            status: "in-progress",
            visitStatus: "in-laboratory"
          }
        : apt
    );

    setAppointments(updatedAppointments);
    setShowInvoiceModal(false);
    setSelectedAppointment(null);
  };

  if (showPatientForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <PatientForm
            patient={editingPatient}
            onSave={handlePatientSave}
            onCancel={() => {
              setShowPatientForm(false);
              setEditingPatient(null);
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
            onEdit={() => handleEditPatient(selectedPatient)}
            onCreateMedicalRecord={handleCreateMedicalRecord}
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
                Dashboard - Lễ Tân
              </h1>
              <p className="text-gray-600">Quản lý bệnh nhân và lịch hẹn</p>
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
          <TabsList className="grid w-full grid-cols-5 gap-2">
            <TabsTrigger
              value="profile"
              className="flex items-center justify-center gap-2 text-sm truncate"
            >
              <User className="w-4 h-4" />
              Thông Tin
            </TabsTrigger>
            <TabsTrigger
              value="patients"
              className="flex items-center justify-center gap-2 text-sm truncate"
            >
              <Users className="w-4 h-4" />
              Bệnh Nhân
            </TabsTrigger>
            <TabsTrigger
              value="waiting"
              className="flex items-center justify-center gap-2 text-sm truncate"
            >
              <Clock className="w-4 h-4" />
              Chờ Xác Nhận
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="flex items-center justify-center gap-2 text-sm truncate"
            >
              <Calendar className="w-4 h-4" />
              Lịch Hẹn Khám
            </TabsTrigger>
            <TabsTrigger
              value="visits"
              className="flex items-center justify-center gap-2 text-sm truncate"
            >
              <Users className="w-4 h-4" />
              Lượt Khám
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
                  <Input defaultValue="Nguyễn Thị Lễ Tân" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <Input type="date" defaultValue="1995-03-15" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <Input defaultValue="Nữ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input defaultValue="letan@khanhanclinic.com" />
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

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Danh Sách Bệnh Nhân</h2>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowPatientForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm Bệnh Nhân Mới
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>Email: {patient.email}</div>
                        <div>SĐT: {patient.phone}</div>
                        <div>Ngày sinh: {patient.birthDate}</div>
                        <div>Giới tính: {patient.gender}</div>
                        <div className="col-span-2">
                          Địa chỉ: {patient.address}
                        </div>
                      </div>
                      {patient.hasMedicalRecord ? (
                        <Badge className="bg-green-100 text-green-800">
                          Có hồ sơ bệnh án
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Chưa có hồ sơ bệnh án
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem Chi Tiết
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPatient(patient)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleCreateAppointment(patient)}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Tạo Lịch Hẹn
                      </Button>
                      {!patient.hasMedicalRecord && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleCreateMedicalRecord(patient.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Tạo Hồ Sơ
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="waiting" className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Lịch Hẹn Chờ Xác Nhận</h2>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[160px]"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên bệnh nhân, email, số điện thoại..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              {appointments
                .filter(
                  (apt) =>
                    apt.status === "waiting-for-confirmation" &&
                    apt.date === selectedDate &&
                    (apt.patientName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                      apt.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      apt.phone.includes(searchTerm))
                )
                .map((appointment) => (
                  <Card key={appointment.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            {appointment.patientName}
                          </h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time} - {appointment.date}
                          </div>
                          <div>Email: {appointment.email}</div>
                          <div>SĐT: {appointment.phone}</div>
                          <div>Triệu chứng: {appointment.symptoms}</div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "canceled")
                          }
                        >
                          <X className="w-4 h-4 mr-1" />
                          Hủy
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            updateAppointmentStatus(appointment.id, "waiting-for-check-in");
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Xác Nhận
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Lịch Hẹn Khám</h2>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-[160px]"
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleCreateAppointment()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo Lịch Hẹn Mới
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên bệnh nhân, email, số điện thoại..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {appointment.patientName}
                        </h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time} - {appointment.date}
                        </div>
                        <div>Email: {appointment.email}</div>
                        <div>SĐT: {appointment.phone}</div>
                        <div>Triệu chứng: {appointment.symptoms}</div>
                        {appointment.requestedDoctor && (
                          <div>
                            <span className="font-semibold text-blue-700">
                              Bác sĩ yêu cầu:
                            </span>{" "}
                            {appointment.requestedDoctor}
                          </div>
                        )}
                        {appointment.room && appointment.assignedDoctor && (
                          <>
                            <div>Phòng: {appointment.room}</div>
                            <div>Bác sĩ: {appointment.assignedDoctor}</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPatientInfo(appointment)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Thông tin Bệnh Nhân
                      </Button>

                      {appointment.status === "waiting-for-check-in" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "canceled"
                              )
                            }
                          >
                            <X className="w-4 h-4 mr-1" />
                            Hủy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "checked-in"
                              )
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Check-in
                          </Button>
                        </>
                      )}

                      {appointment.status === "checked-in" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setAppointmentToRoomAssign(appointment);
                            setShowRoomAssignModal(true);
                          }}
                        >
                          Vào Khám
                        </Button>
                      )}
                      {appointment.status === "in-progress" && (
                        <div className="flex flex-col gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            Đang khám tại {appointment.room} ({appointment.assignedDoctor})
                          </Badge>
                          {appointment.visitId && (
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold">Số thứ tự:</span> #{appointment.queueNumber} | 
                              <span className="font-semibold">Trạng thái Visit:</span> {appointment.visitStatus === "waiting" ? "Chờ y tá gọi" : appointment.visitStatus}
                            </div>
                          )}
                        </div>
                      )}
                      {appointment.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleShowInvoiceModal(appointment)}
                        >
                          💰 Thu Tiền
                        </Button>
                      )}
                      {appointment.status === "paid" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Bạn có thể thay đổi hàm này thành in PDF hoặc mở modal hóa đơn chi tiết
                            alert(`In hóa đơn cho ${appointment.patientName}`);
                          }}
                        >
                          🧾 In Hóa Đơn
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <InvoiceModal
              open={showInvoiceModal}
              onClose={() => setShowInvoiceModal(false)}
              appointment={selectedAppointment}
              onConfirm={handleConfirmInvoice}
            />
          </TabsContent>

          {/* Visits Tab - Hiển thị danh sách lượt khám cho y tá */}
          <TabsContent value="visits" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Danh Sách Lượt Khám Hôm Nay</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tổng lượt khám:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {appointments.filter(apt => apt.visitId).length}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {appointments
                .filter(apt => apt.visitId && apt.status === "in-progress")
                .sort((a, b) => (a.queueNumber || 0) - (b.queueNumber || 0))
                .map((appointment) => (
                  <Card key={appointment.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-blue-600">
                            #{appointment.queueNumber}
                          </div>
                          <h3 className="text-lg font-semibold">
                            {appointment.patientName}
                          </h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            Visit: {appointment.visitStatus || "waiting"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time} - {appointment.date}
                          </div>
                          <div>Email: {appointment.email}</div>
                          <div>SĐT: {appointment.phone}</div>
                          <div>Triệu chứng: {appointment.symptoms}</div>
                          <div>Phòng: {appointment.room}</div>
                          <div>Bác sĩ: {appointment.assignedDoctor}</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Visit ID:</span> {appointment.visitId}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Trạng thái Visit:</span> {appointment.visitStatus || "waiting"}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">Số thứ tự:</span> #{appointment.queueNumber}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              
              {appointments.filter(apt => apt.visitId && apt.status === "in-progress").length === 0 && (
                <Card className="p-6 text-center">
                  <p className="text-gray-600">Chưa có lượt khám nào được tạo</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Lễ tân cần bấm "Vào Khám" để tạo lượt khám cho y tá quản lý
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Bạn vẫn giữ lại DoctorAssignModal nếu cần cho những logic khác */}
          <DoctorAssignModal
            open={showDoctorAssignModal}
            onClose={() => setShowDoctorAssignModal(false)}
            doctors={mockDoctorsToday}
            onAssign={handleAssignDoctor}
          />

          {/* Thêm modal chọn phòng và bác sĩ */}
          <RoomAssignModal
            open={showRoomAssignModal}
            onClose={() => {
              setShowRoomAssignModal(false);
              setRoomAssignError("");
            }}
            doctors={mockDoctorsToday}
            appointments={appointments}
            onAssign={handleAssignRoom}
            roomAssignError={roomAssignError}
            setRoomAssignError={setRoomAssignError}
            appointmentToRoomAssign={appointmentToRoomAssign}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;

/*
📋 TÓM TẮT NHỮNG THAY ĐỔI ĐỂ HỢP LOGIC VỚI Y TÁ:

1. ✅ Thêm thuộc tính Visit vào mockAppointments:
   - visitId: ID duy nhất cho Visit
   - visitStatus: Trạng thái Visit (waiting, in-examination, pending, in-laboratory, returning, completed)
   - queueNumber: Số thứ tự trong hàng chờ

2. ✅ Cập nhật handleAssignRoom():
   - Khi lễ tân bấm "Vào Khám" → Tạo Visit với visitStatus: "waiting"
   - Appointment chuyển sang "in-progress"
   - Y tá sẽ thấy bệnh nhân trong hàng chờ với trạng thái "waiting"

3. ✅ Thêm tab "Lượt Khám" (Visits):
   - Hiển thị danh sách Visit đã được tạo
   - Sắp xếp theo số thứ tự
   - Hiển thị thông tin Visit ID, trạng thái Visit

4. ✅ Cập nhật hiển thị trạng thái:
   - Hiển thị số thứ tự và trạng thái Visit khi appointment đang "in-progress"
   - Giúp y tá biết bệnh nhân đang ở trạng thái nào

5. 🔄 Luồng hoạt động mới:
   Lễ tân: Check-in → "checked-in" → "Vào Khám" → "in-progress" + tạo Visit "waiting"
   Y tá: Thấy Visit "waiting" → Gọi bệnh nhân → Visit "in-examination"
   Bác sĩ: Khám → Tạo chỉ định → Visit "pending" + Assignment "pending"
   Thanh toán → Visit "in-laboratory" + Assignment "waiting"
   Kỹ thuật viên: Thực hiện xét nghiệm → Assignment "completed"
   Tất cả Assignment hoàn thành → Visit "returning"
   Bác sĩ tổng hợp → Visit "completed" + Appointment "completed"
*/
