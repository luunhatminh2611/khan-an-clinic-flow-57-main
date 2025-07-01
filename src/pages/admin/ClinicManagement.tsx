
import React, { useState } from 'react';
import { Building, Plus, Edit, Trash, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import RoomForm from '@/components/RoomForm';

const initialRooms = {
  examination: [
    { id: 1, name: 'Phòng khám 1', status: 'available', description: 'Phòng khám tổng quát với đầy đủ thiết bị' },
    { id: 2, name: 'Phòng khám 2', status: 'occupied', description: 'Phòng khám chuyên khoa thần kinh' }
  ],
  laboratory: [
    { id: 1, name: 'Phòng CT', status: 'available', description: 'Máy CT 64 lát cắt hiện đại' },
    { id: 2, name: 'Phòng siêu âm', status: 'maintenance', description: 'Máy siêu âm 4D chất lượng cao' }
  ]
};
const ClinicManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [rooms, setRooms] = useState(initialRooms);

  const handleSaveRoom = (roomType, roomData) => {
    if (editingItem) {
      // Update existing room
      setRooms(prev => ({
        ...prev,
        [roomType]: prev[roomType].map(room =>
          room.id === editingItem.id ? { ...roomData, id: editingItem.id } : room
        )
      }));
    } else {
      // Add new room
      const newId = Math.max(...rooms[roomType].map(r => r.id), 0) + 1;
      setRooms(prev => ({
        ...prev,
        [roomType]: [...prev[roomType], { ...roomData, id: newId }]
      }));
    }
    setShowForm(null);
    setEditingItem(null);
  };

  const handleDeleteRoom = (roomType, roomId) => {
    setRooms(prev => ({
      ...prev,
      [roomType]: prev[roomType].filter(room => room.id !== roomId)
    }));
  };

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomStatusText = (status) => {
    switch (status) {
      case 'available': return 'Sẵn sàng';
      case 'occupied': return 'Đang sử dụng';
      case 'maintenance': return 'Bảo trì';
      default: return status;
    }
  };

  if (showForm?.startsWith('room-')) {
    const roomType = showForm.split('-')[1];
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <RoomForm
            roomType={roomType}
            room={editingItem}
            onSave={(roomData) => handleSaveRoom(roomType, roomData)}
            onCancel={() => { setShowForm(null); setEditingItem(null); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-clinic-navy mb-2">
          Quản lý phòng khám
        </h1>
        <p className="text-gray-600">
          Quản lý khoa phòng, dịch vụ và cơ sở vật chất
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Examination Rooms */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Phòng Khám Tổng Quát</h3>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowForm('room-examination')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm Phòng
            </Button>
          </div>
          <div className="space-y-2">
            {rooms.examination.map((room) => (
              <div key={room.id} className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{room.name}</div>
                  <Badge className={getRoomStatusColor(room.status)}>
                    {getRoomStatusText(room.status)}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1"
                    onClick={() => {
                      setEditingItem(room);
                      setShowForm('room-examination');
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1 text-red-600"
                    onClick={() => handleDeleteRoom('examination', room.id)}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Laboratory Rooms */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Phòng Xét Nghiệm</h3>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowForm('room-laboratory')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm Phòng
            </Button>
          </div>
          <div className="space-y-2">
            {rooms.laboratory.map((room) => (
              <div key={room.id} className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{room.name}</div>
                  <Badge className={getRoomStatusColor(room.status)}>
                    {getRoomStatusText(room.status)}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1"
                    onClick={() => {
                      setEditingItem(room);
                      setShowForm('room-laboratory');
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1 text-red-600"
                    onClick={() => handleDeleteRoom('laboratory', room.id)}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClinicManagement;
