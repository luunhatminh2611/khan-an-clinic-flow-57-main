import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const mockExamResults = [
  {
    type: 'Xét nghiệm máu',
    date: '2024-06-30',
    result: 'Bình thường',
  },
  {
    type: 'Chụp MRI',
    date: '2024-06-30',
    result: 'Không phát hiện bất thường',
  },
];

const neurologyMedicines = [
  'Paracetamol',
  'Amitriptyline',
  'Gabapentin',
  'Levetiracetam',
  'Pregabalin',
  'Topiramate',
  'Donepezil',
  'Memantine',
];

const durationOptions = ['3 ngày', '5 ngày', '7 ngày', '10 ngày', '14 ngày', '30 ngày'];

const TodayVisitResult = ({ patient, onBack, onComplete }) => {
  const [conclusion, setConclusion] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    medicineName: '',
    dosage: '',
    duration: '',
    note: '',
  });

  const addPrescription = () => {
    const { medicineName, dosage, duration } = newPrescription;
    if (medicineName && dosage && duration) {
      setPrescriptions([...prescriptions, newPrescription]);
      setNewPrescription({ medicineName: '', dosage: '', duration: '', note: '' });
    }
  };

  const removePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const isCompleted = conclusion.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Kết quả khám bệnh</h2>
        <Button variant="outline" onClick={onBack}>
          Quay lại
        </Button>
      </div>

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

      {/* Kết luận khám */}
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

        {/* Danh sách thuốc đã thêm */}
        {prescriptions.length > 0 && (
          <ul className="space-y-2">
            {prescriptions.map((med, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm text-gray-700">
                <span>
                  {med.medicineName} - {med.dosage} - {med.duration}
                  {med.note && <em className="text-gray-500"> ({med.note})</em>}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => removePrescription(idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        {/* Form nhập đơn thuốc */}
        <div className="grid grid-cols-3 gap-2">
          {/* Dropdown thuốc */}
          <select
            className="border rounded px-3 py-2 text-sm"
            value={newPrescription.medicineName}
            onChange={(e) => setNewPrescription({ ...newPrescription, medicineName: e.target.value })}
          >
            <option value="">Chọn thuốc</option>
            {neurologyMedicines.map((med, index) => (
              <option key={index} value={med}>
                {med}
              </option>
            ))}
          </select>

          {/* Liều dùng */}
          <Input
            placeholder="VD: 2 viên/ngày"
            value={newPrescription.dosage}
            onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
          />

          {/* Dropdown thời gian */}
          <select
            className="border rounded px-3 py-2 text-sm"
            value={newPrescription.duration}
            onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
          >
            <option value="">Thời gian dùng</option>
            {durationOptions.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn ghi chú uống trước/sau ăn */}
        <div className="flex items-center gap-4 mt-2 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="note"
              value="Trước ăn"
              checked={newPrescription.note === 'Trước ăn'}
              onChange={(e) => setNewPrescription({ ...newPrescription, note: e.target.value })}
            />
            Trước ăn
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="note"
              value="Sau ăn"
              checked={newPrescription.note === 'Sau ăn'}
              onChange={(e) => setNewPrescription({ ...newPrescription, note: e.target.value })}
            />
            Sau ăn
          </label>
        </div>

        {/* Nút thêm thuốc */}
        <Button variant="outline" className="mt-2" onClick={addPrescription}>
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
              const data = {
                patientId: patient?.id,
                conclusion,
                recommendation,
                prescriptions,
              };
              console.log('Lưu dữ liệu khám:', data);
              onComplete?.();
              onBack?.();
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
