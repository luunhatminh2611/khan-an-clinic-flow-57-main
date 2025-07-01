import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Calendar } from 'lucide-react';

const VisitDetail = ({ visit }) => {
  return (
    <div className="space-y-6">
      {/* Chẩn đoán */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800">Chẩn Đoán</h3>
        </div>
        <p className="text-lg text-gray-700">{visit.diagnosis}</p>
      </Card>

      {/* Kết quả khám */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Kết Quả Khám</h3>
        </div>
        <div className="space-y-6">
          {visit.examResults.map((result, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4 space-y-2">
              <div className="font-semibold text-gray-800">{result.type}</div>
              <div className="text-sm text-gray-600">{result.date}</div>
              <div className="text-gray-700 mb-2">{result.result}</div>
              {result.attachments?.length > 0 && result.attachments.map((file, i) => (
                <div key={i}>
                  <div className="text-sm italic">{file.description}</div>
                  {file.type.startsWith("image/") ? (
                    <img src={file.url} alt={file.description} className="rounded shadow border" />
                  ) : (
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      Xem tài liệu ({file.type})
                    </a>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      {/* Kết quả xét nghiệm */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-800">Kết Quả Xét Nghiệm</h3>
        </div>
        {visit.labResults.map((result, index) => (
          <div key={index} className="border-l-4 border-orange-500 pl-4 mb-3">
            <div className="font-semibold">{result.type}</div>
            <div className="text-sm text-gray-600">{result.date}</div>
            <div>{result.result}</div>
          </div>
        ))}
      </Card>

      {/* Kết luận */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-teal-600" />
          <h3 className="text-xl font-bold text-gray-800">Kết Luận Sau Khám</h3>
        </div>
        <p><strong>Tóm tắt:</strong> {visit.conclusion.summary}</p>
        <p><strong>Hướng dẫn:</strong> {visit.conclusion.recommendation}</p>
      </Card>

      {/* Đơn thuốc */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-gray-800">Đơn Thuốc</h3>
        </div>
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">STT</th>
              <th className="border px-2 py-1">Tên thuốc</th>
              <th className="border px-2 py-1">Liều dùng</th>
              <th className="border px-2 py-1">Số lượng</th>
              <th className="border px-2 py-1">Cách dùng</th>
              <th className="border px-2 py-1">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {visit.prescription.map((med, index) => (
              <tr key={index}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1">
                  <div className="font-semibold">{med.medicineName}</div>
                  <div className="text-xs text-gray-500">
                    {med.activeIngredient} • {med.strength} • {med.form}
                  </div>
                </td>
                <td className="border px-2 py-1">{med.dosage} • {med.frequency} • {med.duration}</td>
                <td className="border px-2 py-1 text-center">{med.quantity}</td>
                <td className="border px-2 py-1">{med.route}</td>
                <td className="border px-2 py-1">{med.usageNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default VisitDetail;