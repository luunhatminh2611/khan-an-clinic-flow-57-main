import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ExaminationForm = ({
  patient,
  onSave,
  onCancel,
  onStatusChange,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    notes: "",
  });

  const [labTests, setLabTests] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Các state cho chỉnh sửa ---
  const [editingTest, setEditingTest] = useState(null);
  const [editRoom, setEditRoom] = useState("");
  const [editServices, setEditServices] = useState([]);

  const { toast } = useToast();

  // Khi có initialData thì gán vào form
  useEffect(() => {
    if (initialData) {
      setFormData({
        symptoms: initialData.symptoms || "",
        diagnosis: initialData.diagnosis || "",
        notes: initialData.notes || "",
      });
      setLabTests(initialData.labTests || []);
      setIsSubmitted(true);
    }
  }, [initialData]);

  const rooms = [
    {
      id: "ct",
      name: "Phòng CT",
      services: ["Chụp CT não", "Chụp CT cột sống", "Chụp CT ngực"],
    },
    {
      id: "ultrasound",
      name: "Phòng Siêu âm",
      services: ["Siêu âm Doppler", "Siêu âm tim", "Siêu âm bụng"],
    },
    {
      id: "xray",
      name: "Phòng X-quang",
      services: ["X-quang ngực", "X-quang cột sống", "X-quang khớp"],
    },
  ];

  const handleAddLabTest = () => {
    if (selectedRoom && selectedServices.length > 0) {
      const room = rooms.find((r) => r.id === selectedRoom);
      const newTest = {
        id: Date.now(),
        room: room.name,
        services: selectedServices,
        status: "pending",
        order: labTests.length + 1,
      };
      setLabTests([...labTests, newTest]);
      setSelectedRoom("");
      setSelectedServices([]);
      toast({
        title: "Thêm chỉ định xét nghiệm thành công!",
        description: `Đã thêm chỉ định cho ${room.name}`,
      });
    }
  };

  const handleServiceChange = (service, checked) => {
    setSelectedServices((prev) =>
      checked ? [...prev, service] : prev.filter((s) => s !== service)
    );
  };

  const handleSubmit = () => {
    const fullData = { ...formData, labTests };
    onSave(fullData);
    setIsSubmitted(true);
    
    // Nếu có chỉ định xét nghiệm, chuyển sang trạng thái pending (chờ thanh toán)
    if (labTests.length > 0) {
      onStatusChange?.("pending");
      toast({
        title: "Tạo phiếu khám thành công!",
        description: "Đã tạo chỉ định xét nghiệm. Bệnh nhân cần thanh toán trước khi thực hiện xét nghiệm.",
      });
    } else {
      // Nếu không có chỉ định, chuyển sang trạng thái in-examination (đang khám)
      onStatusChange?.("in-examination");
      toast({
        title: "Tạo phiếu khám thành công!",
        description: "Phiếu khám đã được tạo.",
      });
    }
  };

  // --- Xử lý chỉnh sửa chỉ định ---
  const handleEditClick = (test) => {
    setEditingTest(test);
    const editRoomObj = rooms.find((r) => r.name === test.room);
    setEditRoom(editRoomObj ? editRoomObj.id : "");
    setEditServices(test.services);
  };

  const handleEditSave = () => {
    if (editRoom && editServices.length > 0) {
      const updatedRoom = rooms.find((r) => r.id === editRoom);
      const updatedTest = {
        ...editingTest,
        room: updatedRoom.name,
        services: editServices,
      };
      setLabTests(labTests.map(t => t.id === editingTest.id ? updatedTest : t));
      setEditingTest(null);
      setEditRoom("");
      setEditServices([]);
      toast({
        title: "Đã cập nhật chỉ định!",
        description: "Chỉ định xét nghiệm đã được cập nhật.",
      });
    }
  };

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">
        {isSubmitted ? "Xem / Cập Nhật Phiếu Khám" : "Tạo Phiếu Khám"} -{" "}
        {patient?.name}
      </h3>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="symptoms">Triệu chứng</Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) =>
                setFormData({ ...formData, symptoms: e.target.value })
              }
              placeholder="Mô tả triệu chứng của bệnh nhân..."
            />
          </div>
          <div>
            <Label htmlFor="diagnosis">Chẩn đoán sơ bộ</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({ ...formData, diagnosis: e.target.value })
              }
              placeholder="Chẩn đoán sơ bộ..."
            />
          </div>
        </div>

        {!isSubmitted && (
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
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedRoom && (
                <div>
                  <Label>Chọn dịch vụ</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {rooms
                      .find((r) => r.id === selectedRoom)
                      ?.services.map((service) => (
                        <div
                          key={service}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={(checked) =>
                              handleServiceChange(service, checked)
                            }
                          />
                          <Label htmlFor={service} className="text-sm">
                            {service}
                          </Label>
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
        )}

        {labTests.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">
              Danh Sách Chỉ Định (Thứ tự thực hiện)
            </h4>
            <div className="space-y-2">
              {labTests.map((test, index) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <span className="font-medium">
                      #{index + 1} - {test.room}
                    </span>
                    <div className="text-sm text-gray-600">
                      Dịch vụ: {test.services.join(", ")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClick(test)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        setLabTests(labTests.filter((t) => t.id !== test.id))
                      }
                    >
                      Xoá
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="notes">Ghi chú</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Ghi chú thêm..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          {!isSubmitted ? (
            <>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tạo Phiếu Khám
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Hủy
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                onSave({ ...formData, labTests });
                toast({
                  title: "Cập nhật phiếu khám thành công!",
                  description: "Các thay đổi đã được lưu.",
                });
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Cập Nhật Phiếu Khám
            </Button>
          )}
        </div>
      </form>

      {/* Popup chỉnh sửa chỉ định */}
      {editingTest && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[350px]">
            <h4 className="font-bold mb-4">Chỉnh sửa chỉ định</h4>
            {/* Chọn lại phòng */}
            <div className="mb-4">
              <Label>Chọn phòng xét nghiệm</Label>
              <Select value={editRoom} onValueChange={setEditRoom}>
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
            {/* Chọn lại dịch vụ */}
            {editRoom && (
              <div className="mb-4">
                <Label>Chọn dịch vụ</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {rooms
                    .find((r) => r.id === editRoom)
                    ?.services.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${service}`}
                          checked={editServices.includes(service)}
                          onCheckedChange={(checked) =>
                            setEditServices((prev) =>
                              checked
                                ? [...prev, service]
                                : prev.filter((s) => s !== service)
                            )
                          }
                        />
                        <Label htmlFor={`edit-${service}`} className="text-sm">
                          {service}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setEditingTest(null)}>
                Hủy
              </Button>
              <Button
                onClick={handleEditSave}
                disabled={!editRoom || editServices.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Lưu chỉ định
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ExaminationForm;
