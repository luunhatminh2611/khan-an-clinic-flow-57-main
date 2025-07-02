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
    status: "pending",
  },
  {
    id: 2,
    patientName: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    time: "09:00",
    date: new Date().toISOString().split("T")[0],
    symptoms: "Mất ngủ",
    status: "checked-in",
  },
  {
    id: 3,
    patientName: "Phạm Văn C",
    email: "phamvanc@gmail.com",
    phone: "0988888888",
    time: "10:00",
    date: new Date().toISOString().split("T")[0],
    symptoms: "Tê tay, đau vai gáy",
    status: "payment-required",
    services: [
      { name: "Chụp CT", price: 500000 },
      { name: "Điện não đồ", price: 400000 },
    ],
  },
  {
    id: 4,
    patientName: "Lê Thị D",
    email: "lethid@gmail.com",
    phone: "0933333333",
    time: "11:00",
    date: new Date().toISOString().split("T")[0],
    symptoms: "Khó thở",
    status: "waiting-for-confirm",
  },
];

const mockDoctorsToday = [
  { id: 1, name: "BS. Nguyễn Thị Hạnh", room: "Phòng 1" },
  { id: 2, name: "BS. Trần Văn Nam", room: "Phòng 2" },
  { id: 3, name: "BS. Lê Quang Huy", room: "Phòng 3" },
];

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

  const handleAssignDoctor = (doctor: Doctor) => {
    if (!appointmentToAssign) return;

    const updatedAppointments = appointments.map((apt) =>
      apt.id === appointmentToAssign.id
        ? {
            ...apt,
            status: "checked-in",
            assignedDoctor: doctor.name,
            room: doctor.room,
          }
        : apt
    );

    setAppointments(updatedAppointments);
    setShowDoctorAssignModal(false);
    setAppointmentToAssign(null);
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
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "checked-in":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-green-100 text-green-800";
      case "payment-required":
        return "bg-orange-100 text-orange-800";
      case "paid":
        return "bg-teal-100 text-teal-800";
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
      case "waiting-for-confirm":
        return "Chờ xác nhận lịch khám";
      case "pending":
        return "Chờ Check-in";
      case "checked-in":
        return "Đã Check-in";
      case "in-progress":
        return "Đang Khám";
      case "payment-required":
        return "Cần Thanh Toán";
      case "paid":
        return "Đã Thu Tiền";
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
        ? { ...apt, status: "paid", invoiceCreated: true }
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
          <TabsList className="grid w-full grid-cols-4 gap-2">
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
                    apt.status === "waiting-for-confirm" &&
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
                            setAppointmentToAssign(appointment);
                            setShowDoctorAssignModal(true);
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

                      {appointment.status === "pending" && (
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
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment.id,
                              "in-progress"
                            )
                          }
                        >
                          Vào Khám
                        </Button>
                      )}
                      {appointment.status === "payment-required" && (
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

          <DoctorAssignModal
            open={showDoctorAssignModal}
            onClose={() => setShowDoctorAssignModal(false)}
            doctors={mockDoctorsToday}
            onAssign={handleAssignDoctor}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
