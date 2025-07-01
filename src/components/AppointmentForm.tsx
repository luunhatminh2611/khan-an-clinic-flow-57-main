
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const AppointmentForm = ({ appointment, patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    patientName: patient?.name || appointment?.patientName || '',
    email: patient?.email || appointment?.email || '',
    phone: patient?.phone || appointment?.phone || '',
    date: appointment?.date || '',
    time: appointment?.time || '',
    symptoms: appointment?.symptoms || '',
    doctor: appointment?.doctor || '',
    room: appointment?.room || ''
  });
  const { toast } = useToast();

  const doctors = [
    { id: 'dr1', name: 'BS. Nguyễn Văn An', room: 'Phòng khám 1' },
    { id: 'dr2', name: 'BS. Trần Thị Bình', room: 'Phòng khám 2' },
    { id: 'dr3', name: 'BS. Lê Văn Cường', room: 'Phòng khám 3' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: `${appointment ? 'Cập nhật' : 'Tạo'} lịch hẹn thành công!`,
      description: `Lịch hẹn cho ${formData.patientName} đã được ${appointment ? 'cập nhật' : 'tạo'}.`,
    });
  };

  const handleDoctorChange = (doctorId) => {
    const selectedDoctor = doctors.find(d => d.id === doctorId);
    setFormData({
      ...formData,
      doctor: selectedDoctor.name,
      room: selectedDoctor.room
    });
  };

  return (
    <Card className="p-6 max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">
        {appointment ? 'Chỉnh Sửa' : 'Tạo'} Lịch Hẹn Khám
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientName">Tên bệnh nhân *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              placeholder="Nhập tên bệnh nhân"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="0912345678"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="example@gmail.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Ngày khám *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Giờ khám *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="doctor">Chọn bác sĩ</Label>
          <Select onValueChange={handleDoctorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn bác sĩ khám" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map(doctor => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="symptoms">Triệu chứng</Label>
          <Textarea
            id="symptoms"
            value={formData.symptoms}
            onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
            placeholder="Mô tả triệu chứng..."
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {appointment ? 'Cập Nhật' : 'Tạo Mới'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AppointmentForm;
