import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InvoiceModal = ({ open, onClose, appointment, onConfirm }) => {
  if (!appointment || !appointment.services) return null;

  const total = appointment.services.reduce((sum, s) => sum + s.price, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Chi Tiết Hóa Đơn</DialogTitle>

        <div className="space-y-3 text-sm text-gray-700">
          <div><strong>Bệnh nhân:</strong> {appointment.patientName}</div>
          <div><strong>Ngày khám:</strong> {appointment.date}</div>
          <div><strong>Thời gian:</strong> {appointment.time}</div>

          <hr className="my-2" />
          <div>
            <strong>Dịch vụ:</strong>
            <ul className="mt-2 space-y-1">
              {appointment.services.map((service, index) => (
                <li key={index} className="flex justify-between">
                  <span>{service.name}</span>
                  <span>{service.price.toLocaleString()}đ</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-base">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()}đ</span>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={onConfirm}>Tạo Hóa Đơn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
