
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const UserForm = ({ userType, user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    status: user?.status || 'active'
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: `${user ? 'Cập nhật' : 'Thêm'} thành công!`,
      description: `${userType} đã được ${user ? 'cập nhật' : 'thêm'} vào hệ thống.`,
    });
  };

  const getUserTypeDisplay = (type) => {
    switch (type) {
      case 'doctors': return 'Bác Sĩ';
      case 'receptionists': return 'Lễ Tân';
      case 'technicians': return 'Kỹ Thuật Viên';
      default: return type;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {user ? 'Chỉnh Sửa' : 'Thêm'} {getUserTypeDisplay(userType)}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Tên *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Nhập họ và tên"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="example@clinic.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="0987654321"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Tạm nghỉ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {user ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UserForm;
