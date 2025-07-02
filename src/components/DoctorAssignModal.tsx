import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

// Define type for doctor
export interface Doctor {
  id: number;
  name: string;
  room: string;
}

interface DoctorAssignModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (doctor: Doctor) => void;
  doctors: Doctor[];
}

const DoctorAssignModal: React.FC<DoctorAssignModalProps> = ({ open, onClose, onAssign, doctors }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chọn bác sĩ phụ trách</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] pr-2 space-y-3">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer"
              onClick={() => onAssign(doctor)}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.room}</p>
                </div>
              </div>
              <Button size="sm" className="text-white bg-blue-600 hover:bg-blue-700">
                Chọn
              </Button>
            </Card>
          ))}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorAssignModal;
