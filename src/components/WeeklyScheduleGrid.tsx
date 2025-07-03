
import React, { useState } from 'react';
import { Calendar, Clock, User, Building, RefreshCw, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ScheduleSwapModal from './ScheduleSwapModal';

interface ScheduleItem {
  id: number;
  day: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'evening';
  shiftTime: string;
  room: string;
  doctorName: string;
  doctorId: number;
  status: 'assigned' | 'free';
}

interface WeeklyScheduleGridProps {
  schedules: ScheduleItem[];
  currentDoctorId: number;
  currentDoctorName: string;
  onScheduleSwap: (fromSchedule: ScheduleItem, toSchedule: ScheduleItem) => void;
  swapRequests: any[];
  onSwapRequestResponse: (requestId: number, accepted: boolean) => void;
}

const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({
  schedules,
  currentDoctorId,
  currentDoctorName,
  onScheduleSwap,
  swapRequests,
  onSwapRequestResponse
}) => {
  const [selectedFromSchedule, setSelectedFromSchedule] = useState<ScheduleItem | null>(null);
  const [selectedToSchedule, setSelectedToSchedule] = useState<ScheduleItem | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const weekDays = [
    { id: 'monday', name: 'Thứ 2', date: '2025-06-23' },
    { id: 'tuesday', name: 'Thứ 3', date: '2025-06-24' },
    { id: 'wednesday', name: 'Thứ 4', date: '2025-06-25' },
    { id: 'thursday', name: 'Thứ 5', date: '2025-06-26' },
    { id: 'friday', name: 'Thứ 6', date: '2025-06-27' },
    { id: 'saturday', name: 'Thứ 7', date: '2025-06-28' },
    { id: 'sunday', name: 'Chủ nhật', date: '2025-06-29' }
  ];

  const shifts = [
    { id: 'morning', name: 'Ca sáng', time: '8:00 - 12:00' },
    { id: 'afternoon', name: 'Ca chiều', time: '13:30 - 17:30' },
    { id: 'evening', name: 'Ca tối', time: '18:00 - 22:00' }
  ];

  const getSchedulesForDayShift = (day: string, shift: string) => {
    return schedules.filter(s => s.day === day && s.shift === shift);
  };

  const handleScheduleClick = (schedule: ScheduleItem) => {
    if (schedule.doctorId === currentDoctorId && schedule.status === 'assigned') {
      // Chọn lịch hiện tại của mình
      setSelectedFromSchedule(schedule);
      setSelectedToSchedule(null);
    } else if (selectedFromSchedule && schedule.status === 'assigned' && schedule.doctorId !== currentDoctorId) {
      // Chọn lịch muốn đổi
      setSelectedToSchedule(schedule);
    }
  };

  const handleSwapClick = () => {
    if (selectedFromSchedule && selectedToSchedule) {
      setShowSwapModal(true);
    }
  };

  const handleConfirmSwap = () => {
    if (selectedFromSchedule && selectedToSchedule) {
      onScheduleSwap(selectedFromSchedule, selectedToSchedule);
      setSelectedFromSchedule(null);
      setSelectedToSchedule(null);
      setShowSwapModal(false);
    }
  };

  const resetSelection = () => {
    setSelectedFromSchedule(null);
    setSelectedToSchedule(null);
  };

  // Lọc các yêu cầu đổi lịch cho bác sĩ hiện tại
  const pendingSwapRequests = swapRequests.filter(
    req => req.targetDoctorId === currentDoctorId && req.status === 'pending'
  );

  return (
    <div className="space-y-6">
      {/* Thông báo yêu cầu đổi lịch */}
      {pendingSwapRequests.length > 0 && (
        <Card className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            Yêu cầu đổi lịch ({pendingSwapRequests.length})
          </h3>
          <div className="space-y-3">
            {pendingSwapRequests.map((request) => (
              <div key={request.id} className="bg-white p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {request.requesterName} muốn đổi lịch
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.fromSchedule.day} - {request.fromSchedule.shift === 'morning' ? 'Ca sáng' : request.fromSchedule.shift === 'afternoon' ? 'Ca chiều' : 'Ca tối'} 
                      - {request.fromSchedule.room}
                    </p>
                    <p className="text-sm text-gray-600">
                      ↔ {request.toSchedule.day} - {request.toSchedule.shift === 'morning' ? 'Ca sáng' : request.toSchedule.shift === 'afternoon' ? 'Ca chiều' : 'Ca tối'} 
                      - {request.toSchedule.room}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600"
                      onClick={() => onSwapRequestResponse(request.id, true)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Chấp nhận
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600"
                      onClick={() => onSwapRequestResponse(request.id, false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Lịch làm việc tuần</h2>
          
          {selectedFromSchedule && selectedToSchedule && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={resetSelection}
              >
                Hủy chọn
              </Button>
              <Button
                onClick={handleSwapClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Đổi lịch
              </Button>
            </div>
          )}
        </div>

        {/* Hướng dẫn */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Hướng dẫn:</strong> Chọn lịch hiện tại của bạn (màu xanh), sau đó chọn lịch muốn đổi (màu khác) để tạo yêu cầu đổi lịch.
          </p>
        </div>

        {/* Lưới lịch làm việc */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-2 min-w-full">
            {/* Header */}
            <div className="p-3 font-semibold text-center bg-gray-100 rounded">
              Ca / Ngày
            </div>
            {weekDays.map(day => (
              <div key={day.id} className="p-3 font-semibold text-center bg-gray-100 rounded">
                <div>{day.name}</div>
                <div className="text-xs text-gray-500">{day.date}</div>
              </div>
            ))}

            {/* Lịch theo ca */}
            {shifts.map(shift => (
              <React.Fragment key={shift.id}>
                <div className="p-3 font-medium bg-gray-50 rounded flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-600" />
                  <div>
                    <div className="font-semibold">{shift.name}</div>
                    <div className="text-xs text-gray-500">{shift.time}</div>
                  </div>
                </div>
                
                {weekDays.map(day => {
                  const dayShiftSchedules = getSchedulesForDayShift(day.id, shift.id);

                  return (
                    <div key={`${day.id}-${shift.id}`} className="p-2">
                      {dayShiftSchedules.length > 0 ? (
                        <div className="space-y-2">
                          {dayShiftSchedules.map(schedule => {
                            const isSelected = selectedFromSchedule?.id === schedule.id || selectedToSchedule?.id === schedule.id;
                            const isMySchedule = schedule.doctorId === currentDoctorId;
                            const canSelect = schedule.status === 'assigned' && 
                              ((isMySchedule && !selectedFromSchedule) || 
                               (!isMySchedule && selectedFromSchedule && !selectedToSchedule));

                            return (
                              <div
                                key={schedule.id}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'border-blue-500 bg-blue-100 shadow-md'
                                    : isMySchedule
                                      ? 'border-green-500 bg-green-50 hover:bg-green-100'
                                      : canSelect
                                        ? 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                        : 'border-gray-200 bg-gray-50'
                                } ${canSelect ? 'hover:shadow-md' : ''}`}
                                onClick={() => canSelect ? handleScheduleClick(schedule) : undefined}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center text-xs">
                                    <User className="w-3 h-3 mr-1" />
                                    <span className={isMySchedule ? 'font-bold text-green-700' : 'text-gray-700'}>
                                      {schedule.doctorName}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-600">
                                    <Building className="w-3 h-3 mr-1" />
                                    <span>{schedule.room}</span>
                                  </div>
                                  {isMySchedule && (
                                    <Badge className="text-xs bg-green-100 text-green-800">
                                      Lịch của tôi
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                          <div className="text-center text-gray-400 text-xs">
                            Trống
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Thông tin lựa chọn */}
        {(selectedFromSchedule || selectedToSchedule) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Thông tin đổi lịch:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedFromSchedule && (
                <div className="p-3 bg-green-100 rounded border-l-4 border-green-500">
                  <h4 className="font-medium text-green-800">Lịch hiện tại của tôi:</h4>
                  <p className="text-sm text-green-700">
                    {selectedFromSchedule.day} - {selectedFromSchedule.shift === 'morning' ? 'Ca sáng' : selectedFromSchedule.shift === 'afternoon' ? 'Ca chiều' : 'Ca tối'} - {selectedFromSchedule.room}
                  </p>
                </div>
              )}
              {selectedToSchedule && (
                <div className="p-3 bg-blue-100 rounded border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800">Lịch muốn đổi:</h4>
                  <p className="text-sm text-blue-700">
                    {selectedToSchedule.day} - {selectedToSchedule.shift === 'morning' ? 'Ca sáng' : selectedToSchedule.shift === 'afternoon' ? 'Ca chiều' : 'Ca tối'} - {selectedToSchedule.room}
                  </p>
                  <p className="text-sm text-blue-700">BS: {selectedToSchedule.doctorName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Modal xác nhận đổi lịch */}
      {showSwapModal && selectedFromSchedule && selectedToSchedule && (
        <ScheduleSwapModal
          fromSchedule={selectedFromSchedule}
          toSchedule={selectedToSchedule}
          currentDoctorName={currentDoctorName}
          onConfirm={handleConfirmSwap}
          onCancel={() => setShowSwapModal(false)}
        />
      )}
    </div>
  );
};

export default WeeklyScheduleGrid;