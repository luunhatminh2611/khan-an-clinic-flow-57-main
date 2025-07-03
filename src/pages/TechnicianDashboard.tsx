import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  FileText,
  Upload,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUploadForm from '@/components/FileUploadForm';
import PatientDetail from '@/components/PatientDetail';

// Mock data
const mockLabTests = [
  {
    id: 1,
    patientName: 'Nguyễn Văn A',
    testType: 'Chụp CT não',
    orderTime: '08:30',
    status: 'waiting',
    doctorName: 'BS. Nguyễn Văn An',
    room: 'Phòng CT',
    resultData: null,

  },
  {
    id: 2,
    patientName: 'Trần Thị B',
    testType: 'Siêu âm Doppler',
    orderTime: '09:00',
    status: 'completed',
    doctorName: 'BS. Trần Thị Bình',
    room: 'Phòng siêu âm',
    resultData: {
      files: [],
      results: 'Không có bất thường',
      notes: 'Bệnh nhân cần theo dõi thêm',
    },
  },
];

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [labTests, setLabTests] = useState(mockLabTests);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const updateTestStatus = (id, status) => {
    setLabTests(labTests.map(test =>
      test.id === id ? { ...test, status } : test
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending-payment': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting': return 'Đang chờ';
      case 'in-progress': return 'Đang gọi';
      case 'completed': return 'Hoàn thành';
      case 'pending-payment': return 'Chờ thanh toán';
      default: return status;
    }
  };

  const handleUploadResults = (test) => {
    setSelectedTest(test);
    setShowUploadForm(true);
  };

  const handleUploadSave = (uploadData) => {
    console.log('Upload data saved:', uploadData);
    setLabTests((prevTests) =>
      prevTests.map((test) =>
        test.id === selectedTest.id
          ? {
            ...test,
            resultData: uploadData,
            status: 'completed',
          }
          : test
      )
    );
    setShowUploadForm(false);
    setSelectedTest(null);
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (showUploadForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <FileUploadForm
            test={selectedTest}
            initialData={selectedTest?.resultData || null}  // <-- Truyền dữ liệu có sẵn nếu có
            onSave={handleUploadSave}
            onCancel={() => {
              setShowUploadForm(false);
              setSelectedTest(null);
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
              <h1 className="text-2xl font-bold text-gray-800">Dashboard - Kỹ Thuật Viên</h1>
              <p className="text-gray-600">Quản lý xét nghiệm và kết quả</p>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Thông Tin Của Tôi
            </TabsTrigger>
            <TabsTrigger value="lab-tests" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Lịch Xét Nghiệm
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông Tin Cá Nhân</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <Input defaultValue="Nguyễn Văn Kỹ Thuật" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <Input type="date" defaultValue="1985-08-20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <Input defaultValue="Nam" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input defaultValue="kythuat@khanhanclinic.com" />
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

          {/* Lab Tests Tab */}
          <TabsContent value="lab-tests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Danh Sách Xét Nghiệm - Hôm Nay</h2>
              <div className="text-sm text-gray-600">Phòng CT & Siêu âm</div>
            </div>

            <div className="grid gap-4">
              {labTests.map((test) => (
                <Card key={test.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{test.patientName}</h3>
                        <Badge className={getStatusColor(test.status)}>
                          {getStatusText(test.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Giờ chỉ định: {test.orderTime}
                        </div>
                        <div>Loại XN: {test.testType}</div>
                        <div>Bác sĩ chỉ định: {test.doctorName}</div>
                        <div>Phòng: {test.room}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {test.status === 'waiting' && (
                        <Button
                          size="sm"
                          onClick={() => updateTestStatus(test.id, 'in-progress')}
                        >
                          Gọi bệnh nhân
                        </Button>
                      )}

                      {test.status === 'pending-payment' && (
                        <span className="text-sm text-red-600 italic">Đang chờ thanh toán</span>
                      )}

                      {test.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleUploadResults(test)}
                        >
                          Upload Kết Quả
                        </Button>
                      )}

                      {test.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUploadResults(test)} 
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem / Chỉnh sửa Kết Quả
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
