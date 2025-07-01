import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const mockExamResults = [
  {
    type: 'Xét nghiệm máu',
    date: '2024-06-30',
    result: 'Bình thường'
  },
  {
    type: 'Chụp MRI',
    date: '2024-06-30',
    result: 'Không phát hiện bất thường'
  }
];

const TodayVisitResult = ({ patient, onBack, onComplete }) => {
  const [conclusion, setConclusion] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    medicineName: '',
    dosage: '',
    duration: ''
  });

  const addPrescription = () => {
    if (newPrescription.medicineName && newPrescription.dosage && newPrescription.duration) {
      setPrescriptions([...prescriptions, newPrescription]);
      setNewPrescription({ medicineName: '', dosage: '', duration: '' });
    }
  };

  const isCompleted = conclusion.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Kết quả chỉ định */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Kết Quả Chỉ Định Hôm Nay
        </h3>
        {mockExamResults.map((res, i) => (
          <div key={i} className="mb-4 border-l-4 border-blue-400 pl-4">
            <div className="font-semibold">{res.type}</div>
            <div className="text-sm text-gray-600">{res.date}</div>
            <div>{res.result}</div>
          </div>
        ))}
      </Card>

      {/* Kết luận */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Kết Luận Khám
        </h3>
        <Textarea
          placeholder="Nhập kết luận..."
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
          className="mb-3"
        />
        <Textarea
          placeholder="Hướng dẫn sau khám..."
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
        />
      </Card>

      {/* Đơn thuốc */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Đơn Thuốc
        </h3>

        {prescriptions.length > 0 && (
          <ul className="list-disc list-inside text-sm text-gray-700">
            {prescriptions.map((med, idx) => (
              <li key={idx}>
                {med.medicineName} - {med.dosage} - {med.duration}
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Tên thuốc"
            value={newPrescription.medicineName}
            onChange={(e) =>
              setNewPrescription({ ...newPrescription, medicineName: e.target.value })
            }
          />
          <Input
            placeholder="Liều dùng"
            value={newPrescription.dosage}
            onChange={(e) =>
              setNewPrescription({ ...newPrescription, dosage: e.target.value })
            }
          />
          <Input
            placeholder="Thời gian"
            value={newPrescription.duration}
            onChange={(e) =>
              setNewPrescription({ ...newPrescription, duration: e.target.value })
            }
          />
        </div>

        <Button
          variant="outline"
          className="mt-2"
          onClick={addPrescription}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm thuốc
        </Button>
      </Card>

      {/* Hoàn thành khám */}
      {isCompleted && (
        <div className="text-center">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white mt-4"
            onClick={() => {
              onComplete?.();     // gọi callback để cập nhật trạng thái
              onBack?.();         // quay lại màn trước
            }}
          >
            Hoàn Thành Khám
          </Button>
        </div>
      )}
    </div>
  );
};

export default TodayVisitResult;