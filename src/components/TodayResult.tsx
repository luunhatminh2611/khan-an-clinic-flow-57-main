import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

// Kết quả chỉ định mẫu
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

// Danh sách thuốc nội thần kinh
const neurologyMedicines = [
  'Paracetamol',
  'Amitriptyline',
  'Gabapentin',
  'Levetiracetam',
  'Pregabalin',
  'Topiramate',
  'Donepezil',
  'Memantine',
  // Bổ sung 10 thuốc thần kinh phổ biến:
  'Carbamazepine',        // Thuốc chống động kinh
  'Valproic acid',        // Thuốc chống động kinh, phòng ngừa đau đầu migraine
  'Phenytoin',            // Thuốc chống động kinh
  'Lamotrigine',          // Thuốc chống động kinh
  'Clonazepam',           // Thuốc an thần, chống co giật
  'Diazepam',             // Thuốc an thần, giãn cơ
  'Piracetam',            // Thuốc tăng tuần hoàn não
  'Cinnarizine',          // Thuốc tăng tuần hoàn não, chóng mặt
  'Aspirin',              // Thuốc kháng tiểu cầu, phòng ngừa đột quỵ
  'Vitamin B1',           // Hỗ trợ thần kinh
  'Vitamin B6',           // Hỗ trợ thần kinh
  'Vitamin B12',          // Hỗ trợ thần kinh
];


// Thời gian dùng thuốc
const durationOptions = ['3 ngày', '5 ngày', '7 ngày', '10 ngày', '14 ngày', '30 ngày'];

// Component Autocomplete input chọn thuốc
const AutocompleteDrugInput = ({ value, onChange, medicines }) => {
  const [search, setSearch] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = medicines.filter((drug) =>
    drug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (drug) => {
    setSearch(drug);
    setShowDropdown(false);
    onChange(drug);
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder="Nhập tên thuốc"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
          onChange(e.target.value);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
        autoComplete="off"
      />
      {showDropdown && search && filtered.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border rounded shadow z-20 max-h-40 overflow-auto">
          {filtered.map((drug, idx) => (
            <div
              key={idx}
              className="p-2 cursor-pointer hover:bg-blue-100"
              onMouseDown={() => handleSelect(drug)}
            >
              {drug}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TodayVisitResult = ({ patient, onBack, onComplete, onCompleteSchedule }) => {
  const [conclusion, setConclusion] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    medicineName: '',
    dosage: '',
    duration: '',
    note: '',
  });

  // Lấy kết quả assignment từ examinationForm
  const assignmentResults = patient?.examinationForm?.labTests || [];

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
        {assignmentResults.length > 0 ? (
          assignmentResults.map((assignment, i) => (
            <div key={i} className="mb-4 border-l-4 border-blue-400 pl-4">
              <div className="font-semibold">{assignment.room}</div>
              <div className="text-sm text-gray-600">
                Dịch vụ: {assignment.services.join(", ")}
              </div>
              <div className="text-sm text-gray-600">
                Trạng thái: {assignment.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
              </div>
              {assignment.status === "completed" && (
                <div className="mt-2 p-2 bg-green-50 rounded">
                  <div className="font-medium text-green-800">Kết quả:</div>
                  <div className="text-sm text-green-700">
                    {assignment.resultData?.results || "Kết quả bình thường"}
                  </div>
                  {assignment.resultData?.notes && (
                    <div className="text-sm text-green-600 mt-1">
                      Ghi chú: {assignment.resultData.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">Chưa có chỉ định xét nghiệm nào</div>
        )}
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
          {/* Autocomplete tên thuốc */}
          <AutocompleteDrugInput
            value={newPrescription.medicineName}
            onChange={(val) =>
              setNewPrescription({ ...newPrescription, medicineName: val })
            }
            medicines={neurologyMedicines}
          />

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
        <div className="text-center space-x-2">
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
          <Button
            className=" text-white mt-4"
            onClick={() => {
              
              onCompleteSchedule?.();
              onBack?.();
            }}
          >
            Đặt lịch tái khám
          </Button>
        </div>
      )}
    </div>
  );
};

export default TodayVisitResult;
