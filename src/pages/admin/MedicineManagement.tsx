import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, Search } from 'lucide-react';

const mockMedicines = [
  {
    id: 'MED001',
    name: 'Paracetamol',
    unit: 'Viên',
    defaultDosage: 500,
    defaultDosageUnit: 'mg',
    defaultFrequency: 3,
    defaultFrequencyUnit: 'lần/ngày',
    defaultDuration: 5,
    defaultDurationUnit: 'ngày',
    description: 'Thuốc giảm đau, hạ sốt.'
  },
  {
    id: 'MED002',
    name: 'Amoxicillin',
    unit: 'Viên',
    defaultDosage: 250,
    defaultDosageUnit: 'mg',
    defaultFrequency: 2,
    defaultFrequencyUnit: 'lần/ngày',
    defaultDuration: 7,
    defaultDurationUnit: 'ngày',
    description: 'Kháng sinh phổ rộng.'
  },
  {
    id: 'MED003',
    name: 'Vitamin C',
    unit: 'Viên',
    defaultDosage: 1000,
    defaultDosageUnit: 'mg',
    defaultFrequency: 1,
    defaultFrequencyUnit: 'lần/ngày',
    defaultDuration: 10,
    defaultDurationUnit: 'ngày',
    description: 'Tăng sức đề kháng.'
  }
];

const emptyMedicine = {
  id: '',
  name: '',
  unit: '',
  defaultDosage: '',
  defaultDosageUnit: '',
  defaultFrequency: '',
  defaultFrequencyUnit: '',
  defaultDuration: '',
  defaultDurationUnit: '',
  description: ''
};

const unitOptions = ['Viên', 'Ống', 'Gói', 'Chai', 'Vỉ', 'ml', 'mg', 'g'];
const dosageUnitOptions = ['mg', 'ml', 'viên', 'g'];
const frequencyUnitOptions = ['lần/ngày', 'lần/tuần', 'lần/tháng'];
const durationUnitOptions = ['ngày', 'tuần', 'tháng'];

const MedicineManagement: React.FC = () => {
  const [medicines, setMedicines] = useState(mockMedicines);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<any>(emptyMedicine);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const openAdd = () => {
    setSelected(emptyMedicine);
    setEditMode(false);
    setShowModal(true);
  };
  const openEdit = (med: any) => {
    setSelected(med);
    setEditMode(true);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelected(emptyMedicine);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelected({ ...selected, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected({ ...selected, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    if (editMode) {
      setMedicines(medicines.map(m => m.id === selected.id ? selected : m));
    } else {
      setMedicines([...medicines, { ...selected, id: 'MED' + (Math.floor(Math.random()*900)+100) }]);
    }
    closeModal();
  };
  const confirmDelete = (id: string) => setDeleteId(id);
  const handleDelete = () => {
    setMedicines(medicines.filter(m => m.id !== deleteId));
    setDeleteId(null);
  };

  // Lọc danh sách theo tìm kiếm
  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(search.toLowerCase()) ||
    med.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8">
      <h1 className="text-5xl font-bold mb-8 text-blue-700 text-center tracking-tight w-full">Quản lý danh mục thuốc</h1>
      <div className="w-full flex justify-center mb-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-semibold shadow flex items-center gap-3 text-2xl transition" onClick={openAdd}>
          <Plus size={28} /> Thêm thuốc mới
        </button>
      </div>
      {/* Thanh tìm kiếm */}
      <div className="w-full flex justify-start mb-6 px-8">
        <div className="relative w-full max-w-xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
            <Search size={22} />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc mã thuốc…"
            className="w-full pl-12 pr-4 py-2 rounded-2xl border border-blue-300 text-xl focus:outline-none focus:border-blue-500 shadow-sm bg-white"
          />
        </div>
      </div>
      <div className="w-full bg-white rounded-none shadow-none border border-gray-200 p-8 flex flex-col items-center" style={{minHeight: '60vh'}}>
        <table className="w-full text-xl text-left">
          <thead className="bg-blue-100 text-blue-800 text-xl">
            <tr>
              <th className="px-5 py-4 text-center font-bold">Mã thuốc</th>
              <th className="px-5 py-4 text-center font-bold">Tên thuốc</th>
              <th className="px-5 py-4 text-center font-bold">Đơn vị</th>
              <th className="px-5 py-4 text-center font-bold">Liều dùng</th>
              <th className="px-5 py-4 text-center font-bold">Đơn vị liều</th>
              <th className="px-5 py-4 text-center font-bold">Số lần/ngày</th>
              <th className="px-5 py-4 text-center font-bold">Đơn vị số lần</th>
              <th className="px-5 py-4 text-center font-bold">Số ngày</th>
              <th className="px-5 py-4 text-center font-bold">Đơn vị số ngày</th>
              <th className="px-5 py-4 text-center font-bold">Mô tả</th>
              <th className="px-5 py-4 text-center font-bold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((med) => (
              <tr key={med.id} className="border-b last:border-b-0 hover:bg-blue-50 transition">
                <td className="px-5 py-3 text-center font-semibold">{med.id}</td>
                <td className="px-5 py-3 text-center">{med.name}</td>
                <td className="px-5 py-3 text-center">{med.unit}</td>
                <td className="px-5 py-3 text-center">{med.defaultDosage}</td>
                <td className="px-5 py-3 text-center">{med.defaultDosageUnit}</td>
                <td className="px-5 py-3 text-center">{med.defaultFrequency}</td>
                <td className="px-5 py-3 text-center">{med.defaultFrequencyUnit}</td>
                <td className="px-5 py-3 text-center">{med.defaultDuration}</td>
                <td className="px-5 py-3 text-center">{med.defaultDurationUnit}</td>
                <td className="px-5 py-3 max-w-xs text-center align-top">
                  <span className="line-clamp-4" title={med.description}>{med.description}</span>
                </td>
                <td className="px-5 py-3 text-center">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <button className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-lg hover:bg-yellow-400 hover:text-white transition flex items-center gap-2 text-base font-semibold shadow-sm border border-yellow-300" onClick={() => openEdit(med)}>
                      <Edit size={18} /> Sửa
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-500 hover:text-white transition flex items-center gap-2 text-base font-semibold shadow-sm border border-red-200" onClick={() => confirmDelete(med.id)}>
                      <Trash2 size={18} /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl relative animate-fade-in mx-4">
            <div className="flex items-center gap-4 mb-8">
              <Plus size={32} className={editMode ? 'hidden' : 'text-blue-600'} />
              <Edit size={28} className={!editMode ? 'hidden' : 'text-yellow-500'} />
              <h2 className="text-3xl font-bold text-blue-700">{editMode ? 'Sửa thuốc' : 'Thêm thuốc mới'}</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-lg">Tên thuốc</label>
                <input name="name" value={selected.name} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl" />
              </div>
              <div>
                <label className="block font-medium mb-2 text-lg">Đơn vị</label>
                <select
                  name="unit"
                  value={selected.unit}
                  onChange={handleSelectChange}
                  className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl bg-white"
                >
                  <option value="">Chọn đơn vị</option>
                  {unitOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2 text-lg">Liều dùng</label>
                <input name="defaultDosage" value={selected.defaultDosage} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl" />
              </div>
              <div>
                <label className="block font-medium mb-2 text-lg">Đơn vị liều</label>
                <select
                  name="defaultDosageUnit"
                  value={selected.defaultDosageUnit}
                  onChange={handleSelectChange}
                  className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl bg-white"
                >
                  <option value="">Chọn đơn vị liều</option>
                  {dosageUnitOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2 text-lg">Số lần/ngày</label>
                <input name="defaultFrequency" value={selected.defaultFrequency} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl" />
              </div>
              <div>
                <label className="block font-medium mb-2 text-lg">Đơn vị số lần</label>
                <select
                  name="defaultFrequencyUnit"
                  value={selected.defaultFrequencyUnit}
                  onChange={handleSelectChange}
                  className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl bg-white"
                >
                  <option value="">Chọn đơn vị số lần</option>
                  {frequencyUnitOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2 text-lg">Số ngày</label>
                <input name="defaultDuration" value={selected.defaultDuration} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl" />
              </div>
              <div>
                <label className="block font-medium mb-2 text-lg">Đơn vị số ngày</label>
                <select
                  name="defaultDurationUnit"
                  value={selected.defaultDurationUnit}
                  onChange={handleSelectChange}
                  className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl bg-white"
                >
                  <option value="">Chọn đơn vị số ngày</option>
                  {durationUnitOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-medium mb-2 text-lg">Mô tả</label>
                <textarea name="description" value={selected.description} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500 text-xl line-clamp-4" />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-8 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-xl" onClick={closeModal}>Hủy</button>
              <button className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xl" onClick={handleSave}>{editMode ? 'Lưu' : 'Thêm'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg relative animate-fade-in mx-4">
            <div className="flex flex-col items-center mb-6">
              <AlertTriangle size={40} className="text-red-500 mb-3" />
              <h2 className="text-2xl font-bold text-red-600">Xác nhận xóa thuốc</h2>
            </div>
            <p className="text-center mb-8 text-xl">Bạn có chắc chắn muốn xóa thuốc này không?</p>
            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-8 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-xl" onClick={() => setDeleteId(null)}>Hủy</button>
              <button className="px-8 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xl" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineManagement; 