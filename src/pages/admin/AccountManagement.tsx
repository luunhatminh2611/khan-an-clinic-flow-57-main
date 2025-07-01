
import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, Trash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import UserForm from '@/components/UserForm';

const initialUsers = {
  doctors: [
    { id: 1, name: 'BS. Nguyễn Văn An', email: 'bacsi1@clinic.com', phone: '0987654321', status: 'active' },
    { id: 2, name: 'BS. Trần Thị Bình', email: 'bacsi2@clinic.com', phone: '0987654322', status: 'active' }
  ],
  receptionists: [
    { id: 1, name: 'Nguyễn Thị Lễ Tân', email: 'letan@clinic.com', phone: '0987654323', status: 'active' }
  ],
  technicians: [
    { id: 1, name: 'Nguyễn Văn Kỹ Thuật', email: 'kythuat@clinic.com', phone: '0987654324', status: 'active' }
  ]
};

const AccountManagement: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(null);


  const handleSaveUser = (userType, userData) => {
    if (editingItem) {
      // Update existing user
      setUsers(prev => ({
        ...prev,
        [userType]: prev[userType].map(user =>
          user.id === editingItem.id ? { ...userData, id: editingItem.id } : user
        )
      }));
    } else {
      // Add new user
      const newId = Math.max(...users[userType].map(u => u.id), 0) + 1;
      setUsers(prev => ({
        ...prev,
        [userType]: [...prev[userType], { ...userData, id: newId }]
      }));
    }
    setShowForm(null);

    setEditingItem(null);
  };

  const handleDeleteUser = (userType, userId) => {
    setUsers(prev => ({
      ...prev,
      [userType]: prev[userType].filter(user => user.id !== userId)
    }));
  };

  if (showForm?.startsWith('user-')) {
    const userType = showForm.split('-')[1];
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <UserForm
            userType={userType}
            user={editingItem}
            onSave={(userData) => handleSaveUser(userType, userData)}
            onCancel={() => { setShowForm(null); setEditingItem(null); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-clinic-navy mb-2">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600">
            Tạo và quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
      </div>


      {/* User Table */}
      <div className="grid grid-cols-3 gap-6">
        {/* Doctors */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Bác Sĩ</h3>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowForm('user-doctors')}

            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
          <div className="space-y-2">
            {users.doctors.map((doctor) => (
              <div key={doctor.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{doctor.name}</div>
                  <div className="text-xs text-gray-500">{doctor.email}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1"
                    onClick={() => {
                      setEditingItem(doctor);
                      setShowForm('user-doctors');
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1 text-red-600"
                    onClick={() => handleDeleteUser('doctors', doctor.id)}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Receptionists */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Lễ Tân</h3>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowForm('user-receptionists')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
          <div className="space-y-2">
            {users.receptionists.map((receptionist) => (
              <div key={receptionist.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{receptionist.name}</div>
                  <div className="text-xs text-gray-500">{receptionist.email}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1"
                    onClick={() => {
                      setEditingItem(receptionist);
                      setShowForm('user-receptionists');
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1 text-red-600"
                    onClick={() => handleDeleteUser('receptionists', receptionist.id)}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Technicians */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Kỹ Thuật Viên</h3>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowForm('user-technicians')}
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </div>
          <div className="space-y-2">
            {users.technicians.map((technician) => (
              <div key={technician.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{technician.name}</div>
                  <div className="text-xs text-gray-500">{technician.email}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1"
                    onClick={() => {
                      setEditingItem(technician);
                      setShowForm('user-technicians');
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1 text-red-600"
                    onClick={() => handleDeleteUser('technicians', technician.id)}
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

export default AccountManagement;
