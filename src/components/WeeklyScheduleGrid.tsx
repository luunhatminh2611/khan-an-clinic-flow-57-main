
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

const WeeklyScheduleGrid = ({ schedules, onCreateSchedule, onEditSchedule }) => {
  const [hoveredSchedule, setHoveredSchedule] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const weekDays = [
    { key: 'monday', label: 'Thứ 2 09/06' },
    { key: 'tuesday', label: 'Thứ 3 10/06' },
    { key: 'wednesday', label: 'Thứ 4 11/06' },
    { key: 'thursday', label: 'Thứ 5 12/06' },
    { key: 'friday', label: 'Thứ 6 13/06' },
    { key: 'saturday', label: 'Thứ 7 14/06' },
    { key: 'sunday', label: 'CN 15/06' },
  ];

  const getScheduleForSlot = (day, time) => {
    return schedules.find(s => 
      s.dayOfWeek === day && 
      s.timeSlots.some(slot => {
        const [start, end] = slot.time.split('-');
        return time >= start && time < end;
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'có mặt': return 'bg-green-100 text-green-800';
      case 'nghỉ': return 'bg-red-100 text-red-800';
      case 'bận': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMouseEnter = (schedule, event) => {
    setHoveredSchedule(schedule);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredSchedule(null);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800">Có mặt</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">Nghỉ</Badge>
          <Badge className="bg-red-100 text-red-800">Bận</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Xem theo tuần</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={onCreateSchedule}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm lịch
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 bg-gray-50 border-r text-sm font-medium"></div>
          {weekDays.map(day => (
            <div key={day.key} className="p-2 bg-blue-500 text-white text-center text-sm font-medium border-r">
              {day.label}
            </div>
          ))}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map(time => (
            <div key={time} className="grid grid-cols-8 border-b hover:bg-gray-50">
              <div className="p-2 bg-gray-50 border-r text-xs text-gray-600 font-medium">
                {time}
              </div>
              {weekDays.map(day => {
                const schedule = getScheduleForSlot(day.key, time);
                return (
                  <div 
                    key={day.key} 
                    className="border-r h-12 relative cursor-pointer"
                    onMouseEnter={(e) => schedule && handleMouseEnter(schedule, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {schedule && (
                      <div 
                        className={`absolute inset-1 rounded text-xs p-1 ${getStatusColor(schedule.status)}`}
                        onClick={() => onEditSchedule(schedule)}
                      >
                        {schedule.room}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Hover tooltip */}
      {hoveredSchedule && (
        <div 
          className="fixed z-50 bg-white border rounded-lg shadow-lg p-3 max-w-xs"
          style={{ 
            left: hoverPosition.x + 10, 
            top: hoverPosition.y - 10,
            pointerEvents: 'none'
          }}
        >
          <div className="space-y-1 text-sm">
            <div><strong>Phòng:</strong> {hoveredSchedule.room}</div>
            <div><strong>Trạng thái:</strong> 
              <Badge className={`ml-2 ${getStatusColor(hoveredSchedule.status)}`}>
                {hoveredSchedule.status}
              </Badge>
            </div>
            <div><strong>Giờ:</strong> {hoveredSchedule.timeSlots[0]?.time}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleGrid;
