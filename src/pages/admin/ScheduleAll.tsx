import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Mock data
const mockDoctorSchedule = {
  '2025-07-01': [
    { name: 'BS. Nguyễn Văn A', specialty: 'Thần kinh' },
    { name: 'BS. Trần Thị B', specialty: 'Tâm thần' }
  ],
  '2025-07-02': [{ name: 'BS. Nguyễn Văn A', specialty: 'Thần kinh' }],
  '2025-07-04': [{ name: 'BS. Lê Văn C', specialty: 'Thần kinh' }],
  '2025-07-06': [{ name: 'BS. Trần Thị B', specialty: 'Tâm thần' }]
};

// Trả về array gồm 7 ngày từ thứ 2 đến chủ nhật của tuần chứa ngày đầu vào
const getWeekDates = (anyDate) => {
  const d = new Date(anyDate);
  const day = d.getDay(); // CN = 0
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
};

// Tạo các tuần mẫu cho dropdown
const generateWeekOptions = () => {
  const weeks = [];
  const start = new Date(2025, 6, 1); // tháng 7 (0-based)
  for (let i = 0; i < 5; i++) {
    const monday = new Date(start);
    monday.setDate(start.getDate() + i * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    weeks.push({
      label: `Tuần ${i + 1} (${format(monday, 'dd/MM')} - ${format(sunday, 'dd/MM')})`,
      value: monday.toISOString()
    });
  }
  return weeks;
};

const WeeklyDoctorAvailability = () => {
  const weekOptions = generateWeekOptions();
  const [selectedWeekStart, setSelectedWeekStart] = useState(weekOptions[0].value);
  const weekDates = getWeekDates(selectedWeekStart);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Lịch Làm Việc Bác Sĩ Theo Tuần</h1>
        <Select value={selectedWeekStart} onValueChange={setSelectedWeekStart}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Chọn tuần" />
          </SelectTrigger>
          <SelectContent>
            {weekOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekDates.map((date) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const doctors = mockDoctorSchedule[dateKey] || [];
          return (
            <Card key={dateKey} className="p-4">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                {format(date, 'EEEE - dd/MM/yyyy', { locale: vi })}
              </h2>
              {doctors.length > 0 ? (
                <ul className="space-y-1">
                  {doctors.map((doctor, index) => (
                    <li key={index} className="text-sm text-gray-800">
                      {doctor.name} <span className="text-gray-500">({doctor.specialty})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">Không có bác sĩ trực</div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyDoctorAvailability;