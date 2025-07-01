
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Calendar, MapPin, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PatientDetail = ({ patient, onBack, onEdit, onCreateMedicalRecord }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isReceptionist = location.pathname.includes('/receptionist');
  return (
    <div className="max-w-4xl mx-auto">
      <Button onClick={onBack} variant="outline" className="mb-6">
        ← Quay Lại
      </Button>

      <Card className="p-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{patient.name}</h2>
            <Badge className="bg-green-100 text-green-800 mb-4">
              Bệnh nhân
            </Badge>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông Tin Liên Hệ</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{patient.address || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Sinh: {patient.birthdate || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Thống Kê Khám Bệnh</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{patient.visitCount}</div>
                  <div className="text-sm text-gray-600">Hồ sơ bệnh án</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-600">{patient.lastVisit}</div>
                  <div className="text-sm text-gray-600">Lần khám cuối</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tiền Sử Bệnh</h3>
              <p className="text-gray-600 leading-relaxed">
                {patient.medicalHistory || 'Chưa có thông tin tiền sử bệnh'}
              </p>
            </div>

            <div className="flex gap-2 pt-4 flex-wrap">
              <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Chỉnh sửa Thông Tin
              </Button>

              {/* Chỉ hiển thị nếu không phải lễ tân */}
              {!isReceptionist && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/medical-record/")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Xem Hồ Sơ Y Tế
                </Button>

              )}

              {/* Hiển thị nút tạo hồ sơ nếu chưa có */}
              {isReceptionist && !patient.hasMedicalRecord && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onCreateMedicalRecord(patient.id)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Tạo Hồ Sơ Bệnh Án
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PatientDetail;
