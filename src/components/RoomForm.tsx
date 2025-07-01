
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'; // Nếu dùng hệ thống modal riêng
import { Textarea } from '@/components/ui/textarea';

const RoomForm = ({ roomType, room, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: room?.name || '',
    status: room?.status || 'available',
    description: room?.description || '',
    services: room?.services || []

  });
  const [services, setServices] = useState(room?.services || []);
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });
  const [showAddService, setShowAddService] = useState(false);

  const { toast } = useToast();

  const handleAddService = () => {
    if (newService.name && newService.price) {
      setServices([...services, newService]);
      setNewService({ name: '', price: '', description: '' });
      setShowAddService(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      ...(roomType === 'laboratory' && { services }),
    };
    onSave(dataToSave);
    toast({
      title: `${room ? 'Cập nhật' : 'Thêm'} phòng thành công!`,
      description: `Phòng đã được ${room ? 'cập nhật' : 'thêm'} vào hệ thống.`,
    });
  };

  const getRoomTypeDisplay = (type) => {
    switch (type) {
      case 'examination': return 'Phòng Khám Tổng Quát';
      case 'laboratory': return 'Phòng Xét Nghiệm';
      default: return type;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {room ? 'Chỉnh Sửa' : 'Thêm'} {getRoomTypeDisplay(roomType)}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Tên phòng *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên phòng"
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Sẵn sàng</SelectItem>
              <SelectItem value="occupied">Đang sử dụng</SelectItem>
              <SelectItem value="maintenance">Bảo trì</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Mô tả</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả thiết bị, chức năng..."
          />
        </div>
        {roomType === 'laboratory' && (
          <div>
            <Label>Dịch vụ phòng xét nghiệm</Label>

            <ul className="mb-2">
              {services.map((s, idx) => (
                <li key={idx} className="flex justify-between items-center p-2 border rounded mb-2">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-gray-600">Giá: {s.price}₫</div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Chi tiết</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h4 className="text-lg font-semibold mb-2">{s.name}</h4>
                      <p className="text-sm text-gray-700">Giá tiền: {s.price}₫</p>
                      <p className="text-sm text-gray-600 mt-2">Mô tả: {s.description}</p>
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddService(true)}
            >
              Thêm Dịch Vụ
            </Button>

            {showAddService && (
              <div className="border p-4 mt-3 space-y-2 rounded">
                <Input
                  placeholder="Tên dịch vụ"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
                <Input
                  placeholder="Giá tiền"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
                <Textarea
                  placeholder="Mô tả"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button type="button" onClick={handleAddService}>Lưu</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowAddService(false)}>Hủy</Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {room ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RoomForm;
