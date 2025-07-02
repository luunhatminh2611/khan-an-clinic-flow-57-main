import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type LabTest = {
  id: number;
  room: string;
  services: string[];
  status: string;
  order: number;
};

type Room = {
  id: string;
  name: string;
  services: string[];
};

type EditLabTestModalProps = {
  visible: boolean;
  onClose: () => void;
  test: LabTest | null;
  rooms: Room[];
  onSave: (updatedTest: LabTest) => void;
};

const EditLabTestModal = ({
  visible,
  onClose,
  test,
  rooms,
  onSave,
}: EditLabTestModalProps) => {
  const [roomId, setRoomId] = useState('');
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Khi mở modal, nếu có test thì khởi tạo
  useEffect(() => {
    if (test) {
      const room = rooms.find((r) => r.name === test.room);
      if (room) {
        setRoomId(room.id);
        setAvailableServices(room.services);
      }
      setSelectedServices(test.services);
    }
  }, [test, rooms]);

  // Khi chọn phòng thì cập nhật dịch vụ tương ứng
  useEffect(() => {
    const room = rooms.find((r) => r.id === roomId);
    setAvailableServices(room?.services || []);
    setSelectedServices([]); // reset dịch vụ khi đổi phòng
  }, [roomId, rooms]);

  const handleToggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSave = () => {
    if (!test) return;
    const updatedTest: LabTest = {
      ...test,
      room: rooms.find((r) => r.id === roomId)?.name || '',
      services: selectedServices,
    };
    onSave(updatedTest);
    onClose();
  };

  if (!visible || !test) return null;

  return (
    <Dialog open={visible} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <Dialog.Title className="text-lg font-bold">
            Chỉnh sửa chỉ định #{test.order}
          </Dialog.Title>

          <div className="space-y-2">
            <Label>Phòng xét nghiệm</Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableServices.length > 0 && (
            <div className="space-y-2">
              <Label>Dịch vụ</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableServices.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={() => handleToggleService(service)}
                    />
                    <Label htmlFor={service} className="text-sm">{service}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button
              className="bg-blue-600 text-white"
              onClick={handleSave}
              disabled={!roomId || selectedServices.length === 0}
            >
              Lưu
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditLabTestModal;
