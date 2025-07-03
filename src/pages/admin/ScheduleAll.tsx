import React, { useState } from 'react';
import { Calendar, Clock, Users, User, Plus, Edit, Save, X, Building } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ScheduleManagement: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'doctors' | 'technicians'>('doctors');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<'morning' | 'afternoon' | null>(null);

  // Mock data for doctors
  const doctors = [
    { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Thần kinh' },
    { id: 2, name: 'BS. Trần Thị B', specialty: 'Tâm lý' },
    { id: 3, name: 'BS. Lê Văn C', specialty: 'Nội thần kinh' },
    { id: 4, name: 'BS. Phạm Thị D', specialty: 'Phục hồi chức năng' },
  ];

  // Mock data for technicians
  const technicians = [
    { id: 1, name: 'KTV. Hoàng Văn E', specialty: 'X-quang' },
    { id: 2, name: 'KTV. Nguyễn Thị F', specialty: 'MRI' },
    { id: 3, name: 'KTV. Trần Văn G', specialty: 'CT Scan' },
    { id: 4, name: 'KTV. Lê Thị H', specialty: 'Siêu âm' },
    { id: 5, name: 'KTV. Phạm Văn I', specialty: 'EEG' },
  ];

  const doctorRooms = ['Phòng 1', 'Phòng 2', 'Phòng 3', 'Phòng 4', 'Phòng 5'];
  const technicianRooms = ['Phòng A', 'Phòng B', 'Phòng C', 'Phòng D', 'Phòng E', 'Phòng F', 'Phòng G'];
  const shifts = [
    { id: 'morning', name: 'Ca sáng', time: '8:00 - 12:00' },
    { id: 'afternoon', name: 'Ca chiều', time: '13:30 - 17:30' }
  ];

  const weekDays = [
    { id: 'monday', name: 'Thứ 2', date: '2025-06-23' },
    { id: 'tuesday', name: 'Thứ 3', date: '2025-06-24' },
    { id: 'wednesday', name: 'Thứ 4', date: '2025-06-25' },
    { id: 'thursday', name: 'Thứ 5', date: '2025-06-26' },
    { id: 'friday', name: 'Thứ 6', date: '2025-06-27' },
    { id: 'saturday', name: 'Thứ 7', date: '2025-06-28' },
    { id: 'sunday', name: 'Chủ nhật', date: '2025-06-29' }
  ];

  // Mock schedule data
  const [schedules, setSchedules] = useState({
    doctors: {
      monday: {
        morning: [
          { staffId: 1, room: 'Phòng 1' },
          { staffId: 2, room: 'Phòng 2' }
        ],
        afternoon: [
          { staffId: 3, room: 'Phòng 1' },
          { staffId: 4, room: 'Phòng 3' }
        ]
      },
      tuesday: {
        morning: [
          { staffId: 1, room: 'Phòng 2' },
          { staffId: 3, room: 'Phòng 4' }
        ],
        afternoon: [
          { staffId: 2, room: 'Phòng 1' }
        ]
      }
    },
    technicians: {
      monday: {
        morning: [
          { staffId: 1, room: 'Phòng A' },
          { staffId: 2, room: 'Phòng B' }
        ],
        afternoon: [
          { staffId: 3, room: 'Phòng C' },
          { staffId: 4, room: 'Phòng D' }
        ]
      }
    }
  });

  const getCurrentStaff = () => activeTab === 'doctors' ? doctors : technicians;
  const getCurrentRooms = () => activeTab === 'doctors' ? doctorRooms : technicianRooms;

  const getScheduleForDay = (day: string, shift: string) => {
    return schedules[activeTab]?.[day]?.[shift] || [];
  };

  const getStaffName = (staffId: number) => {
    const staff = getCurrentStaff().find(s => s.id === staffId);
    return staff ? staff.name : 'Chưa phân công';
  };

  const addSchedule = (day: string, shift: string, staffId: number, room: string) => {
    setSchedules(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [day]: {
          ...prev[activeTab]?.[day],
          [shift]: [
            ...(prev[activeTab]?.[day]?.[shift] || []),
            { staffId, room }
          ]
        }
      }
    }));
  };

  const removeSchedule = (day: string, shift: string, index: number) => {
    setSchedules(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [day]: {
          ...prev[activeTab]?.[day],
          [shift]: prev[activeTab]?.[day]?.[shift]?.filter((_, i) => i !== index) || []
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-clinic-navy mb-2">
            Quản lý lịch làm việc
          </h1>
          <p className="text-gray-600">
            Sắp xếp lịch làm việc cho bác sĩ và kỹ thuật viên
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tuần làm việc
            </label>
            <input
              type="week"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-blue"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="clinic-card">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'doctors'
                ? 'bg-white text-clinic-navy shadow-sm'
                : 'text-gray-600 hover:text-clinic-navy'
            }`}
          >
            <User size={20} />
            <span>Bác sĩ ({doctorRooms.length} phòng)</span>
          </button>
          <button
            onClick={() => setActiveTab('technicians')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'technicians'
                ? 'bg-white text-clinic-navy shadow-sm'
                : 'text-gray-600 hover:text-clinic-navy'
            }`}
          >
            <Users size={20} />
            <span>Kỹ thuật viên ({technicianRooms.length} phòng)</span>
          </button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="clinic-card">
        <h2 className="text-xl font-poppins font-semibold text-clinic-navy mb-4">
          Lịch tuần - {activeTab === 'doctors' ? 'Bác sĩ' : 'Kỹ thuật viên'}
        </h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Thời gian</TableHead>
                {weekDays.map(day => (
                  <TableHead key={day.id} className="text-center min-w-40">
                    <div>
                      <div className="font-semibold">{day.name}</div>
                      <div className="text-xs text-gray-500">{day.date}</div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map(shift => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-clinic-navy" />
                      <div>
                        <div className="font-semibold text-clinic-navy">{shift.name}</div>
                        <div className="text-xs text-gray-500">{shift.time}</div>
                      </div>
                    </div>
                  </TableCell>
                  {weekDays.map(day => (
                    <TableCell key={`${day.id}-${shift.id}`} className="p-2">
                      <div className="space-y-2">
                        {getScheduleForDay(day.id, shift.id).map((assignment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-clinic-blue rounded-lg text-sm"
                          >
                            <div>
                              <div className="font-medium text-clinic-navy text-xs">
                                {getStaffName(assignment.staffId)}
                              </div>
                              <div className="flex items-center space-x-1 text-clinic-navy">
                                <Building size={12} />
                                <span className="text-xs">{assignment.room}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeSchedule(day.id, shift.id, index)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => {
                            setSelectedDay(day.id);
                            setSelectedShift(shift.id as 'morning' | 'afternoon');
                          }}
                          className="w-full flex items-center justify-center space-x-1 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-clinic-blue hover:text-clinic-blue transition-colors"
                        >
                          <Plus size={16} />
                          <span className="text-xs">Thêm</span>
                        </button>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Staff Assignment Modal */}
      {selectedDay && selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-clinic-navy mb-4">
              Phân công {activeTab === 'doctors' ? 'bác sĩ' : 'kỹ thuật viên'}
            </h3>
            <p className="text-gray-600 mb-4">
              {weekDays.find(d => d.id === selectedDay)?.name} - {shifts.find(s => s.id === selectedShift)?.name}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn {activeTab === 'doctors' ? 'bác sĩ' : 'kỹ thuật viên'}
                </label>
                <select
                  id="staff-select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-blue"
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {getCurrentStaff().map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} - {staff.specialty}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn phòng
                </label>
                <select
                  id="room-select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-blue"
                >
                  <option value="">-- Chọn phòng --</option>
                  {getCurrentRooms().map(room => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setSelectedDay(null);
                  setSelectedShift(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const staffSelect = document.getElementById('staff-select') as HTMLSelectElement;
                  const roomSelect = document.getElementById('room-select') as HTMLSelectElement;
                  
                  if (staffSelect.value && roomSelect.value) {
                    addSchedule(selectedDay, selectedShift, parseInt(staffSelect.value), roomSelect.value);
                    setSelectedDay(null);
                    setSelectedShift(null);
                  }
                }}
                className="flex items-center space-x-2 clinic-button-primary"
              >
                <Save size={16} />
                <span>Lưu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="clinic-card text-center">
          <h3 className="text-2xl font-bold text-clinic-navy">
            {getCurrentStaff().length}
          </h3>
          <p className="text-gray-600">
            Tổng {activeTab === 'doctors' ? 'bác sĩ' : 'kỹ thuật viên'}
          </p>
        </div>
        
        <div className="clinic-card text-center">
          <h3 className="text-2xl font-bold text-clinic-navy">
            {getCurrentRooms().length}
          </h3>
          <p className="text-gray-600">Tổng phòng</p>
        </div>
        
        <div className="clinic-card text-center">
          <h3 className="text-2xl font-bold text-clinic-navy">
            {Object.values(schedules[activeTab] || {}).reduce((total, day) => {
              return total + Object.values(day).reduce((dayTotal, shift) => dayTotal + shift.length, 0);
            }, 0)}
          </h3>
          <p className="text-gray-600">Ca làm việc tuần này</p>
        </div>
        
        <div className="clinic-card text-center">
          <h3 className="text-2xl font-bold text-clinic-navy">2</h3>
          <p className="text-gray-600">Ca/ngày</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;