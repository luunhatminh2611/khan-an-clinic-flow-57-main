
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ExaminationForm = ({ patient, onSave, onCancel, onStatusChange  }) => {
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  });
  
  const [labTests, setLabTests] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  
  const { toast } = useToast();

  const rooms = [
    { id: 'ct', name: 'Phòng CT', services: ['Chụp CT não', 'Chụp CT cột sống', 'Chụp CT ngực'] },
    { id: 'ultrasound', name: 'Phòng Siêu âm', services: ['Siêu âm Doppler', 'Siêu âm tim', 'Siêu âm bụng'] },
    { id: 'xray', name: 'Phòng X-quang', services: ['X-quang ngực', 'X-quang cột sống', 'X-quang khớp'] }
  ];

  const handleAddLabTest = () => {
    if (selectedRoom && selectedServices.length > 0) {
      const room = rooms.find(r => r.id === selectedRoom);
      const newTest = {
        id: Date.now(),
        room: room.name,
        services: selectedServices,
        status: 'pending',
        order: labTests.length + 1
      };
      setLabTests([...labTests, newTest]);
      setSelectedRoom('');
      setSelectedServices([]);
          onStatusChange?.('doing');

      toast({
        title: 'Thêm chỉ định xét nghiệm thành công!',
        description: `Đã thêm chỉ định cho ${room.name}`,
      });
    }
  };

  const handleServiceChange = (service, checked) => {
    if (checked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter(s => s !== service));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, labTests });
    toast({
      title: 'Tạo phiếu khám thành công!',
      description: 'Phiếu khám đã được tạo và gửi tới các phòng xét nghiệm.',
    });
  };

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">Tạo Phiếu Khám - {patient?.name}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="symptoms">Triệu chứng</Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              placeholder="Mô tả triệu chứng của bệnh nhân..."
            />
          </div>
          <div>
            <Label htmlFor="diagnosis">Chẩn đoán sơ bộ</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              placeholder="Chẩn đoán sơ bộ..."
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Chỉ Định Xét Nghiệm</h4>
          <div className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Chọn phòng xét nghiệm</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedRoom && (
              <div>
                <Label>Chọn dịch vụ</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {rooms.find(r => r.id === selectedRoom)?.services.map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={(checked) => handleServiceChange(service, checked)}
                      />
                      <Label htmlFor={service} className="text-sm">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              type="button" 
              onClick={handleAddLabTest}
              disabled={!selectedRoom || selectedServices.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Thêm Chỉ Định
            </Button>
          </div>
        </div>

        {labTests.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Danh Sách Chỉ Định (Thứ tự thực hiện)</h4>
            <div className="space-y-2">
              {labTests.map((test, index) => (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">#{index + 1} - {test.room}</span>
                    <div className="text-sm text-gray-600">
                      Dịch vụ: {test.services.join(', ')}
                    </div>
                  </div>
                  <Button 
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setLabTests(labTests.filter(t => t.id !== test.id))}
                  >
                    Xóa
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="treatment">Điều trị</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) => setFormData({...formData, treatment: e.target.value})}
              placeholder="Phương pháp điều trị..."
            />
          </div>
          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Ghi chú thêm..."
            />
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Tạo Phiếu Khám
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExaminationForm;
