
import React from 'react';
import { RefreshCw, Calendar, Clock, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleItem {
  id: number;
  day: string;
  date: string;
  shift: 'morning' | 'afternoon';
  shiftTime: string;
  room: string;
  doctorName: string;
  doctorId: number;
  status: 'assigned' | 'free';
}

interface ScheduleSwapModalProps {
  fromSchedule: ScheduleItem;
  toSchedule: ScheduleItem;
  currentDoctorName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ScheduleSwapModal: React.FC<ScheduleSwapModalProps> = ({
  fromSchedule,
  toSchedule,
  currentDoctorName,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Xác nhận đổi lịch</h2>
          <p className="text-gray-600 mt-2">
            Bạn có chắc chắn muốn gửi yêu cầu đổi lịch không?
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Lịch hiện tại */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Lịch của bạn
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center text-green-700">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{fromSchedule.day} ({fromSchedule.date})</span>
              </div>
              <div className="flex items-center text-green-700">
                <Clock className="w-4 h-4 mr-2" />
                <span>{fromSchedule.shift === 'morning' ? 'Ca sáng' : 'Ca chiều'} - {fromSchedule.shiftTime}</span>
              </div>
              <div className="flex items-center text-green-700">
                <Building className="w-4 h-4 mr-2" />
                <span>{fromSchedule.room}</span>
              </div>
            </div>
          </div>

          {/* Mũi tên đổi */}
          <div className="text-center">
            <RefreshCw className="w-6 h-6 text-gray-400 mx-auto" />
            <span className="text-sm text-gray-500">Đổi với</span>
          </div>

          {/* Lịch muốn đổi */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Lịch của {toSchedule.doctorName}
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center text-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{toSchedule.day} ({toSchedule.date})</span>
              </div>
              <div className="flex items-center text-blue-700">
                <Clock className="w-4 h-4 mr-2" />
                <span>{toSchedule.shift === 'morning' ? 'Ca sáng' : 'Ca chiều'} - {toSchedule.shiftTime}</span>
              </div>
              <div className="flex items-center text-blue-700">
                <Building className="w-4 h-4 mr-2" />
                <span>{toSchedule.room}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Yêu cầu đổi lịch sẽ được gửi đến {toSchedule.doctorName}. 
            Việc đổi lịch chỉ được thực hiện khi đối phương chấp nhận.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Gửi yêu cầu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSwapModal;