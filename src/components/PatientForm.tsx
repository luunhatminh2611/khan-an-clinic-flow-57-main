
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const PatientForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    birthdate: patient?.birthdate || '',
    gender: patient?.gender || '',
    address: patient?.address || '',
    medicalHistory: patient?.medicalHistory || ''
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: `${patient ? 'Cập nhật' : 'Thêm'} bệnh nhân thành công!`,
      description: `Thông tin bệnh nhân đã được ${patient ? 'cập nhật' : 'thêm'} vào hệ thống.`,
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {patient ? 'Chỉnh Sửa' : 'Thêm'} Bệnh Nhân
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Tên bệnh nhân *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nhập họ và tên"
              required
            />
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
          
          <div>
            <Label htmlFor="birthdate">Ngày sinh</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="gender">Giới tính</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Địa chỉ hiện tại"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="medicalHistory">Tiền sử bệnh</Label>
          <Textarea
            id="medicalHistory"
            value={formData.medicalHistory}
            onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
            placeholder="Mô tả tiền sử bệnh lý..."
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {patient ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PatientForm;
