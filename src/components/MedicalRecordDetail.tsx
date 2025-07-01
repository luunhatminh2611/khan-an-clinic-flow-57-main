import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText } from 'lucide-react';
import VisitDetail from './VisitDetail';

const mockVisits = [
  {
    date: '2024-01-15',
    doctor: 'BS. Nguyễn Văn An',
    diagnosis: 'Đau đầu mạn tính',
    details: {
      examResults: [
        {
          type: 'Khám lâm sàng',
          date: '2024-01-15',
          result: 'Đau đầu nhẹ, không có dấu hiệu thần kinh nặng'
        },
        {
          type: 'Điện não đồ',
          date: '2024-01-15',
          result: 'Không có dấu hiệu bất thường',
          attachments: [{
            type: 'image/jpeg',
            url: 'https://cdn.com/eeg001.jpg',
            description: 'Sóng điện não vùng trán'
          }]
        },
      ],
      labResults: [
        {
          type: 'Xét nghiệm máu',
          date: '2024-01-15',
          result: 'Bình thường'
        }
      ],
      conclusion: {
        summary: 'Chẩn đoán đau đầu mạn tính không rõ nguyên nhân.',
        recommendation: 'Tái khám sau 7 ngày, tránh thức khuya.'
      },
      prescription: [
        {
          medicineName: 'Paracetamol 500mg',
          activeIngredient: 'Paracetamol',
          form: 'Viên nén',
          strength: '500mg',
          route: 'Uống',
          dosage: '1 viên/lần',
          frequency: '3 lần/ngày',
          duration: '7 ngày',
          quantity: 21,
          usageNote: 'Sau khi ăn'
        }
      ]
    }
  }
];

const MedicalRecordPage = () => {
  const [showDetail, setShowDetail] = useState(false); // chỉ cần toggle true/false

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Hồ Sơ Bệnh Án</h1>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Lịch sử khám bệnh</h2>
        <ul className="space-y-3">
          {mockVisits.map((visit, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <div className="text-gray-800 font-medium">{visit.date}</div>
                <div className="text-sm text-gray-600">{visit.doctor} • {visit.diagnosis}</div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDetail(!showDetail)}
              >
                <FileText className="w-4 h-4 mr-2" />
                {showDetail ? 'Ẩn chi tiết' : 'Xem chi tiết'}
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Nếu bật showDetail thì hiển thị VisitDetail với dữ liệu demo */}
      {showDetail && (
        <VisitDetail visit={{ ...mockVisits[0].details, diagnosis: mockVisits[0].diagnosis }} />
      )}
    </div>
  );
};

export default MedicalRecordPage;