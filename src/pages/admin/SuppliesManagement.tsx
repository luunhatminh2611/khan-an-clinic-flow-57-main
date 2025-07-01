import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const mockRooms = ['Phòng 1', 'Phòng 2', 'Phòng 3'];
const mockMaterials = [
    {
        id: 1,
        name: 'Găng tay y tế',
        unit: 'hộp',
        totalQuantity: 1000,
        description: 'Găng tay cao su dùng 1 lần',
        roomAllocations: {
            'Phòng 1': 200,
            'Phòng 2': 150,
            'Phòng 3': 0
        }
    },
    {
        id: 2,
        name: 'Máy đo',
        unit: 'máy',
        totalQuantity: 1000,
        description: 'máy đo huyết áp',
        roomAllocations: {
            'Phòng 1': 200,
            'Phòng 2': 150,
            'Phòng 3': 0
        }
    }
    // Thêm vật tư khác nếu cần
];

const MaterialManagementPage = () => {
    const [materials, setMaterials] = useState(mockMaterials);
    const [formData, setFormData] = useState({
        name: '',
        unit: '',
        totalQuantity: '',
        description: '',
        roomAllocations: {}
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const roomAllocations = mockRooms.reduce((acc, room) => {
            acc[room] = 0;
            return acc;
        }, {});

        const newMaterial = {
            id: Date.now(),
            name: formData.name,
            unit: formData.unit,
            totalQuantity: parseInt(formData.totalQuantity),
            description: formData.description,
            roomAllocations
        };

        setMaterials(prev => [...prev, newMaterial]);

        setFormData({
            name: '',
            unit: '',
            totalQuantity: '',
            description: '',
            roomAllocations: {}
        });
    };
    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý vật tư</h1>

            {/* Form thêm vật tư */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Thêm vật tư mới</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <Input
                        placeholder="Tên vật tư"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Đơn vị (hộp, chai...)"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        required
                    />
                    <Input
                        type="number"
                        placeholder="Tổng số lượng"
                        value={formData.totalQuantity}
                        onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                        required
                    />
                    <Textarea
                        placeholder="Mô tả"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <Button type="submit" className="col-span-2 mt-4 bg-blue-600 text-white">Thêm vật tư</Button>
                </form>
            </Card>

            {/* Danh sách vật tư */}
            <Card className="p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-4">Danh sách vật tư</h2>
                {materials.map((item) => (
                    <div key={item.id} className="border p-4 rounded">
                        <div className="font-bold text-lg text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                        <div className="text-sm mt-1">Đơn vị: {item.unit}</div>
                        <div className="text-sm">Tổng số lượng: {item.totalQuantity}</div>
                        <div className="mt-2 text-sm">
                            <strong>Phân bổ theo phòng:</strong>
                            <ul className="list-disc list-inside">
                                {mockRooms.map((room) => (
                                    <li key={room}>
                                        {room}: {item.roomAllocations[room] || 0} {item.unit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};

export default MaterialManagementPage;