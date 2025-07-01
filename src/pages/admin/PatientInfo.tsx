import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { useState } from 'react';
import PatientDetail from '@/components/PatientDetail';


const mockPatients = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0901234567',
        birthDate: '1980-01-15',
        gender: 'Nam',
        address: 'Hà Nội',
        hasMedicalRecord: true
    },
    {
        id: 2,
        name: 'Trần Thị B',
        email: 'tranthib@gmail.com',
        phone: '0912345678',
        birthDate: '1990-05-20',
        gender: 'Nữ',
        address: 'Hồ Chí Minh',
        hasMedicalRecord: false
    },
];

const PatientList = () => {
    const [patients, setPatients] = useState(mockPatients);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientDetail, setShowPatientDetail] = useState(false);


    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
        setShowPatientDetail(true);
    };
    if (showPatientDetail) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="container mx-auto">
                    <PatientDetail
                        patient={selectedPatient}
                        onBack={() => {
                            setShowPatientDetail(false);
                            setSelectedPatient(null);
                        }}
                        onEdit={() => { }}
                        onCreateMedicalRecord={() => { }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Danh Sách Bệnh Nhân</h2>

            <Card className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Họ tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Số điện thoại</TableHead>
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead>Giới tính</TableHead>
                            <TableHead>Địa chỉ</TableHead>
                            <TableHead>Bệnh án</TableHead>
                            <TableHead>Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockPatients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.email}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{patient.birthDate}</TableCell>
                                <TableCell>{patient.gender}</TableCell>
                                <TableCell>{patient.address}</TableCell>
                                <TableCell>
                                    {patient.hasMedicalRecord ? (
                                        <Badge className="bg-green-100 text-green-800">Đã có</Badge>
                                    ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800">Chưa có</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleViewPatient(patient)}
                                        variant="outline" size="sm">Xem</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};
export default PatientList;
