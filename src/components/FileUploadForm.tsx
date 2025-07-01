
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileImage, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FileUploadForm = ({ test, onSave, onCancel }) => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: fileType,
        size: file.size,
        url: URL.createObjectURL(file)
      };
      setFiles([...files, newFile]);
      toast({
        title: 'Tải file thành công!',
        description: `Đã thêm ${fileType === 'image' ? 'hình ảnh' : 'file PDF'}: ${file.name}`,
      });
    }
  };

  const removeFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ files, results, notes });
    toast({
      title: 'Hoàn thành xét nghiệm!',
      description: 'Kết quả xét nghiệm đã được lưu và gửi về bác sĩ.',
    });
  };

  return (
    <Card className="p-6 max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">
        Tải Kết Quả Xét Nghiệm - {test?.testType}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="text-base font-medium">Tải lên file kết quả</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <FileImage className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Tải ảnh kết quả</span>
                </div>
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'image')}
              />
            </div>
            
            <div>
              <Label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Tải file PDF</span>
                </div>
              </Label>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'pdf')}
              />
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div>
            <Label className="text-base font-medium">File đã tải lên</Label>
            <div className="space-y-2 mt-2">
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {file.type === 'image' ? (
                      <FileImage className="w-5 h-5 text-blue-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="results">Kết quả xét nghiệm</Label>
          <Textarea
            id="results"
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="Mô tả kết quả xét nghiệm..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="notes">Ghi chú</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú thêm..."
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Upload className="w-4 h-4 mr-2" />
            Hoàn Thành Xét Nghiệm
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FileUploadForm;
