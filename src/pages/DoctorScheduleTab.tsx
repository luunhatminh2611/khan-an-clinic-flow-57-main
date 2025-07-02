import React, { useState } from 'react';
import WeeklyScheduleGrid from '../components/WeeklyScheduleGrid';
import { toast } from '@/hooks/use-toast';

// Mock data cho lịch làm việc
const mockScheduleData = [
  {
    id: 1,
    day: 'monday',
    date: '2025-06-23',
    shift: 'morning' as const,
    shiftTime: '8:00 - 12:00',
    room: 'Phòng A',
    doctorName: 'BS. Nguyễn Văn An',
    doctorId: 1,
    status: 'assigned' as const
  },
  {
    id: 2,
    day: 'monday',
    date: '2025-06-23',
    shift: 'afternoon' as const,
    shiftTime: '13:30 - 17:30',
    room: 'Phòng B',
    doctorName: 'BS. Trần Thị Bình',
    doctorId: 2,
    status: 'assigned' as const
  },
  {
    id: 3,
    day: 'tuesday',
    date: '2025-06-24',
    shift: 'morning' as const,
    shiftTime: '8:00 - 12:00',
    room: 'Phòng C',
    doctorName: 'BS. Lê Văn Cường',
    doctorId: 3,
    status: 'assigned' as const
  },
  {
    id: 4,
    day: 'wednesday',
    date: '2025-06-25',
    shift: 'afternoon' as const,
    shiftTime: '13:30 - 17:30',
    room: 'Phòng A',
    doctorName: 'BS. Nguyễn Văn An',
    doctorId: 1,
    status: 'assigned' as const
  },
  {
    id: 5,
    day: 'thursday',
    date: '2025-06-26',
    shift: 'morning' as const,
    shiftTime: '8:00 - 12:00',
    room: 'Phòng D',
    doctorName: 'BS. Phạm Thị Dung',
    doctorId: 4,
    status: 'assigned' as const
  },
  {
    id: 6,
    day: 'friday',
    date: '2025-06-27',
    shift: 'afternoon' as const,
    shiftTime: '13:30 - 17:30',
    room: 'Phòng B',
    doctorName: 'BS. Trần Thị Bình',
    doctorId: 2,
    status: 'assigned' as const
  }
];

// Mock data cho yêu cầu đổi lịch
const mockSwapRequests = [
  {
    id: 1,
    requesterId: 2,
    requesterName: 'BS. Trần Thị Bình',
    targetDoctorId: 1,
    fromSchedule: {
      day: 'monday',
      shift: 'afternoon',
      room: 'Phòng B'
    },
    toSchedule: {
      day: 'monday',
      shift: 'morning',
      room: 'Phòng A'
    },
    status: 'pending',
    createdAt: '2025-06-22T10:00:00Z'
  }
];

const DoctorScheduleTab: React.FC = () => {
  const [schedules, setSchedules] = useState(mockScheduleData);
  const [swapRequests, setSwapRequests] = useState(mockSwapRequests);
  
  // Thông tin bác sĩ hiện tại (trong thực tế sẽ lấy từ authentication)
  const currentDoctorId = 1;
  const currentDoctorName = 'BS. Nguyễn Văn An';

  const handleScheduleSwap = (fromSchedule: any, toSchedule: any) => {
    // Tạo yêu cầu đổi lịch mới
    const newSwapRequest = {
      id: Date.now(),
      requesterId: currentDoctorId,
      requesterName: currentDoctorName,
      targetDoctorId: toSchedule.doctorId,
      fromSchedule: {
        day: fromSchedule.day,
        shift: fromSchedule.shift,
        room: fromSchedule.room
      },
      toSchedule: {
        day: toSchedule.day,
        shift: toSchedule.shift,
        room: toSchedule.room
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setSwapRequests(prev => [...prev, newSwapRequest]);
    
    toast({
      title: "Yêu cầu đổi lịch đã được gửi",
      description: `Đã gửi yêu cầu đổi lịch đến ${toSchedule.doctorName}`,
    });
  };

  const handleSwapRequestResponse = (requestId: number, accepted: boolean) => {
    const request = swapRequests.find(req => req.id === requestId);
    if (!request) return;

    if (accepted) {
      // Thực hiện đổi lịch
      setSchedules(prev => {
        const newSchedules = [...prev];
        
        // Tìm và đổi lịch
        const fromScheduleIndex = newSchedules.findIndex(s => 
          s.day === request.fromSchedule.day && 
          s.shift === request.fromSchedule.shift && 
          s.doctorId === request.requesterId
        );
        
        const toScheduleIndex = newSchedules.findIndex(s => 
          s.day === request.toSchedule.day && 
          s.shift === request.toSchedule.shift && 
          s.doctorId === currentDoctorId
        );

        if (fromScheduleIndex !== -1 && toScheduleIndex !== -1) {
          // Đổi thông tin bác sĩ và phòng
          const tempDoctor = newSchedules[fromScheduleIndex].doctorName;
          const tempDoctorId = newSchedules[fromScheduleIndex].doctorId;
          const tempRoom = newSchedules[fromScheduleIndex].room;
          
          newSchedules[fromScheduleIndex].doctorName = newSchedules[toScheduleIndex].doctorName;
          newSchedules[fromScheduleIndex].doctorId = newSchedules[toScheduleIndex].doctorId;
          newSchedules[fromScheduleIndex].room = newSchedules[toScheduleIndex].room;
          
          newSchedules[toScheduleIndex].doctorName = tempDoctor;
          newSchedules[toScheduleIndex].doctorId = tempDoctorId;
          newSchedules[toScheduleIndex].room = tempRoom;
        }
        
        return newSchedules;
      });

      toast({
        title: "Đã chấp nhận đổi lịch",
        description: `Lịch làm việc đã được cập nhật thành công`,
      });
    } else {
      toast({
        title: "Đã từ chối đổi lịch",
        description: `Yêu cầu đổi lịch đã được từ chối`,
        variant: "destructive"
      });
    }

    // Cập nhật trạng thái yêu cầu
    setSwapRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: accepted ? 'accepted' : 'rejected' }
          : req
      )
    );
  };

  return (
    <WeeklyScheduleGrid
      schedules={schedules}
      currentDoctorId={currentDoctorId}
      currentDoctorName={currentDoctorName}
      onScheduleSwap={handleScheduleSwap}
      swapRequests={swapRequests}
      onSwapRequestResponse={handleSwapRequestResponse}
    />
  );
};

export default DoctorScheduleTab;