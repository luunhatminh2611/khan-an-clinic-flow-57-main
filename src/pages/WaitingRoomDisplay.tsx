import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Stethoscope, Package, Bell } from 'lucide-react';

// Mock data - đồng bộ với ReceptionistDashboard
const mockQueue = [
  {
    id: 1,
    queueNumber: 1,
    patientName: "Nguyễn Văn A",
    room: "Phòng 1",
    doctor: "BS. Nguyễn Văn An",
    status: "waiting",
    time: "08:00" // Đồng bộ với thời gian từ ReceptionistDashboard
  },
  {
    id: 2,
    queueNumber: 2,
    patientName: "Trần Thị B",
    room: "Phòng 2",
    doctor: "BS. Trần Thị Bình",
    status: "waiting",
    time: "09:00"
  },
  {
    id: 3,
    queueNumber: 3,
    patientName: "Lê Văn C",
    room: "Phòng 1",
    doctor: "BS. Nguyễn Văn An",
    status: "waiting",
    time: "10:00"
  },
  {
    id: 4,
    queueNumber: 4,
    patientName: "Phạm Thị D",
    room: "Phòng 3",
    doctor: "BS. Lê Minh Châu",
    status: "waiting",
    time: "11:00"
  },
  {
    id: 5,
    queueNumber: 5,
    patientName: "Hoàng Văn E",
    room: "Phòng 2",
    doctor: "BS. Trần Thị Bình",
    status: "waiting",
    time: "14:00"
  }
];

const WaitingRoomDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [queue, setQueue] = useState(mockQueue);
  const [currentCall, setCurrentCall] = useState(null);

  // Cập nhật thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mô phỏng gọi bệnh nhân
  useEffect(() => {
    const callTimer = setInterval(() => {
      const waitingPatients = queue.filter(p => p.status === "waiting");
      if (waitingPatients.length > 0) {
        const randomPatient = waitingPatients[Math.floor(Math.random() * waitingPatients.length)];
        setCurrentCall(randomPatient);
        
        // Cập nhật trạng thái
        setQueue(prev => prev.map(p => 
          p.id === randomPatient.id ? { ...p, status: "called" } : p
        ));

        // Ẩn thông báo sau 10 giây
        setTimeout(() => {
          setCurrentCall(null);
        }, 10000);
      }
    }, 15000); // Gọi mỗi 15 giây

    return () => clearInterval(callTimer);
  }, [queue]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting": return "bg-yellow-100 text-yellow-800";
      case "called": return "bg-red-100 text-red-800";
      case "in-examination": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "waiting": return "Đang chờ";
      case "called": return "Đã gọi";
      case "in-examination": return "Đang khám";
      case "completed": return "Hoàn thành";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          PHÒNG KHÁM NỘI THẦN KINH KHÁNH AN
        </h1>
        <div className="flex justify-center items-center gap-8 text-xl">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">{formatTime(currentTime)}</span>
          </div>
          <div className="text-gray-600">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

      {/* Current Call Display */}
      {currentCall && (
        <div className="mb-8">
          <Card className="bg-red-50 border-red-200 p-8 text-center animate-pulse">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <Bell className="w-12 h-12 text-red-600 animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              GỌI BỆNH NHÂN
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl font-bold text-blue-800 mb-2">
                {currentCall.patientName}
              </div>
              <div className="grid grid-cols-2 gap-4 text-xl">
                <div className="flex items-center justify-center gap-2">
                  <Package className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold">{currentCall.room}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Stethoscope className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold">{currentCall.doctor}</span>
                </div>
              </div>
              <div className="mt-4 text-2xl font-bold text-blue-600">
                Số thứ tự: {currentCall.queueNumber}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Queue Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Waiting Queue */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            DANH SÁCH CHỜ KHÁM
          </h2>
          <div className="space-y-4">
            {queue
              .filter(patient => patient.status === "waiting")
              .slice(0, 8)
              .map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-blue-600">
                      #{patient.queueNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{patient.patientName}</div>
                      <div className="text-sm text-gray-600">
                        {patient.room} - {patient.doctor}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(patient.status)}>
                    {getStatusText(patient.status)}
                  </Badge>
                </div>
              ))}
          </div>
        </Card>

        {/* Called Patients */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
            BỆNH NHÂN ĐÃ GỌI
          </h2>
          <div className="space-y-4">
            {queue
              .filter(patient => patient.status === "called")
              .slice(0, 4)
              .map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-red-600">
                      #{patient.queueNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{patient.patientName}</div>
                      <div className="text-sm text-gray-600">
                        {patient.room} - {patient.doctor}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    Đã gọi
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p className="text-lg">
          Vui lòng chú ý theo dõi màn hình để biết khi nào đến lượt khám
        </p>
        <p className="text-sm mt-2">
          Nếu có thắc mắc, vui lòng liên hệ quầy lễ tân
        </p>
      </div>
    </div>
  );
};

export default WaitingRoomDisplay; 