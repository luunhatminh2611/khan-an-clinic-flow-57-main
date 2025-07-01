
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ScheduleForm = ({ schedule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: schedule?.date || '',
    dayOfWeek: schedule?.dayOfWeek || '',
    startTime: schedule?.timeSlots?.[0]?.time?.split('-')[0] || '',
    endTime: schedule?.timeSlots?.[0]?.time?.split('-')[1] || '',
    room: schedule?.timeSlots?.[0]?.room || '',
    status: schedule?.status || 'có mặt'
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduleData = {
      ...formData,
      timeSlots: [{
        time: `${formData.startTime}-${formData.endTime}`,
        room: formData.room
      }]
    };
    onSave(scheduleData);
    toast({
      title: `${schedule ? 'Cập nhật' : 'Tạo'} lịch làm thành công!`,
      description: `Lịch làm đã được ${schedule ? 'cập nhật' : 'tạo'} cho ${formData.dayOfWeek}.`,
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {schedule ? 'Chỉnh Sửa' : 'Tạo'} Lịch Làm
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Ngày *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dayOfWeek">Thứ trong tuần *</Label>
          <Select value={formData.dayOfWeek} onValueChange={(value) => setFormData({...formData, dayOfWeek: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn thứ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monday">Thứ Hai</SelectItem>
              <SelectItem value="tuesday">Thứ Ba</SelectItem>
              <SelectItem value="wednesday">Thứ Tư</SelectItem>
              <SelectItem value="thursday">Thứ Năm</SelectItem>
              <SelectItem value="friday">Thứ Sáu</SelectItem>
              <SelectItem value="saturday">Thứ Bảy</SelectItem>
              <SelectItem value="sunday">Chủ Nhật</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Giờ bắt đầu *</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="endTime">Giờ kết thúc *</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="room">Phòng khám *</Label>
          <Select value={formData.room} onValueChange={(value) => setFormData({...formData, room: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phòng khám" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Phòng 1">Phòng 1</SelectItem>
              <SelectItem value="Phòng 2">Phòng 2</SelectItem>
              <SelectItem value="Phòng 3">Phòng 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Trạng thái *</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="có mặt">Có mặt</SelectItem>
              <SelectItem value="nghỉ">Nghỉ</SelectItem>
              <SelectItem value="bận">Bận</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {schedule ? 'Cập Nhật' : 'Tạo Mới'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ScheduleForm;
