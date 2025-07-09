import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Clock, Stethoscope, Package } from 'lucide-react';

const PatientCallDisplay = ({ currentCall, onCallComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (currentCall) {
      setIsVisible(true);
      setIsBlinking(true);
      
      // Dừng nhấp nháy sau 3 giây
      const blinkTimer = setTimeout(() => {
        setIsBlinking(false);
      }, 3000);

      return () => clearTimeout(blinkTimer);
    } else {
      setIsVisible(false);
      setIsBlinking(false);
    }
  }, [currentCall]);

  if (!isVisible || !currentCall) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl p-8 text-center ${isBlinking ? 'animate-pulse' : ''}`}>
        <div className="space-y-6">
          {/* Icon và tiêu đề */}
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <Bell className="w-12 h-12 text-red-600 animate-bounce" />
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">
              GỌI BỆNH NHÂN
            </h1>
            <p className="text-lg text-gray-600">
              Vui lòng đến quầy lễ tân để được hướng dẫn
            </p>
          </div>

          {/* Thông tin bệnh nhân */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-800">
                  {currentCall.patientName}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-lg">
                <div className="flex items-center justify-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold">{currentCall.room}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Stethoscope className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold">{currentCall.doctor}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Số thứ tự: {currentCall.queueNumber}</span>
              </div>
            </div>
          </div>

          {/* Nút hoàn thành */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setIsVisible(false);
                onCallComplete?.(currentCall.id);
              }}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Hoàn Thành Gọi
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PatientCallDisplay; 