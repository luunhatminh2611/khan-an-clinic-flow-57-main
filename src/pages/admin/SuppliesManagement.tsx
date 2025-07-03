import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, AlertTriangle, Edit2, Truck, DollarSign, RefreshCw, FileX, CheckCircle, Clock, Edit, Search, ChevronDown, ChevronUp } from 'lucide-react';

const mockRooms = ['Phòng 1', 'Phòng 2', 'Phòng 3', 'Phòng cấp cứu', 'Phòng xét nghiệm'];

interface Batch {
    id: string;
    batchNumber: string;
    purchasePrice: number;
    quantity: number;
    defectiveQuantity: number;
    expiryDate: string;
    purchaseDate: string;
    purchaseTime: string;
    supplier: string;
}

interface Material {
    id: number;
    name: string;
    unit: string;
    totalQuantity: number;
    availableQuantity: number;
    description: string;
    category: string;
    minStockAlert: number;
    roomAllocations: Record<string, number>;
    batches: Batch[];
    totalValue: number;
    averagePrice: number;
}

interface DefectiveReturnOrder {
    id: string;
    materialId: number;
    materialName: string;
    batchId: string;
    batchNumber: string;
    quantity: number;
    reason: string;
    status: 'pending' | 'completed' | 'rejected';
    createdDate: string;
    supplierName: string;
    estimatedValue: number;
    note?: string;
}

interface DistributionOrder {
    id: string;
    materialId: number;
    materialName: string;
    materialUnit: string;
    distributions: Record<string, number>;
    totalQuantity: number;
    status: 'pending' | 'completed' | 'rejected';
    createdDate: string;
    createdBy: string;
    note?: string;
}

const mockMaterials: Material[] = [
    {
        id: 1,
        name: 'Găng tay y tế',
        unit: 'hộp',
        totalQuantity: 1000,
        availableQuantity: 650,
        description: 'Găng tay cao su dùng 1 lần',
        category: 'Bảo hộ',
        minStockAlert: 100,
        roomAllocations: {
            'Phòng 1': 200,
            'Phòng 2': 150,
            'Phòng 3': 0,
            'Phòng cấp cứu': 0,
            'Phòng xét nghiệm': 0
        },
        batches: [
            {
                id: 'batch1',
                batchNumber: 'LOT-2024-001',
                purchasePrice: 50000,
                quantity: 500,
                defectiveQuantity: 10,
                expiryDate: '2025-12-31',
                purchaseDate: '2024-01-15',
                purchaseTime: '09:30',
                supplier: 'Công ty ABC'
            },
            {
                id: 'batch2',
                batchNumber: 'LOT-2024-002',
                purchasePrice: 52000,
                quantity: 500,
                defectiveQuantity: 5,
                expiryDate: '2025-06-30',
                purchaseDate: '2024-02-20',
                purchaseTime: '14:15',
                supplier: 'Công ty XYZ'
            }
        ],
        totalValue: 51000000,
        averagePrice: 51000
    },
    {
        id: 2,
        name: 'Máy đo huyết áp',
        unit: 'máy',
        totalQuantity: 10,
        availableQuantity: 6,
        description: 'Máy đo huyết áp điện tử',
        category: 'Thiết bị',
        minStockAlert: 2,
        roomAllocations: {
            'Phòng 1': 2,
            'Phòng 2': 2,
            'Phòng 3': 0,
            'Phòng cấp cứu': 0,
            'Phòng xét nghiệm': 0
        },
        batches: [
            {
                id: 'batch3',
                batchNumber: 'BP-2024-001',
                purchasePrice: 1500000,
                quantity: 10,
                defectiveQuantity: 0,
                expiryDate: '2027-01-01',
                purchaseDate: '2024-01-10',
                purchaseTime: '10:45',
                supplier: 'Medical Equipment Co.'
            }
        ],
        totalValue: 15000000,
        averagePrice: 1500000
    }
];

const MaterialManagementPage = () => {
    const [materials, setMaterials] = useState<Material[]>(mockMaterials);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [showDistributeModal, setShowDistributeModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showDefectiveModal, setShowDefectiveModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [defectiveOrders, setDefectiveOrders] = useState<DefectiveReturnOrder[]>([
        {
            id: 'def-001',
            materialId: 1,
            materialName: 'Găng tay y tế',
            batchId: 'batch1',
            batchNumber: 'LOT-2024-001',
            quantity: 5,
            reason: 'damaged',
            status: 'pending',
            createdDate: '15/12/2024',
            supplierName: 'Công ty ABC',
            estimatedValue: 250000,
            note: 'Găng tay bị rách do vận chuyển không đúng cách'
        },
        {
            id: 'def-002',
            materialId: 1,
            materialName: 'Găng tay y tế',
            batchId: 'batch2',
            batchNumber: 'LOT-2024-002',
            quantity: 3,
            reason: 'quality-issue',
            status: 'completed',
            createdDate: '12/12/2024',
            supplierName: 'Công ty XYZ',
            estimatedValue: 156000,
            note: 'Lỗi chất lượng cao su không đạt tiêu chuẩn'
        },
        {
            id: 'def-003',
            materialId: 2,
            materialName: 'Khẩu trang y tế',
            batchId: 'batch3',
            batchNumber: 'LOT-2024-003',
            quantity: 10,
            reason: 'expired',
            status: 'pending',
            createdDate: '10/12/2024',
            supplierName: 'Công ty DEF',
            estimatedValue: 80000,
            note: 'Hết hạn sử dụng'
        },
        {
            id: 'def-004',
            materialId: 1,
            materialName: 'Găng tay y tế',
            batchId: 'batch4',
            batchNumber: 'LOT-2024-004',
            quantity: 7,
            reason: 'packaging',
            status: 'completed',
            createdDate: '08/12/2024',
            supplierName: 'Công ty ABC',
            estimatedValue: 385000,
            note: 'Bao bì bị hư hỏng trong quá trình vận chuyển'
        }
    ]);
    const [formData, setFormData] = useState({
        name: '',
        unit: '',
        totalQuantity: '',
        description: '',
        category: '',
        minStockAlert: ''
    });

    const [batchData, setBatchData] = useState({
        batchNumber: '',
        purchasePrice: '',
        quantity: '',
        defectiveQuantity: '',
        purchaseDate: '',
        purchaseTime: '',
        expiryDate: '',
        supplier: ''
    });

    const [distributionData, setDistributionData] = useState<Record<string, number>>({});
    
    const [defectiveFormData, setDefectiveFormData] = useState({
        quantity: '',
        reason: '',
        note: '',
        selectedBatchId: ''
    });

    const [distributionOrders, setDistributionOrders] = useState<DistributionOrder[]>([
        {
            id: 'dist-001',
            materialId: 1,
            materialName: 'Găng tay y tế',
            materialUnit: 'hộp',
            distributions: {
                'Phòng 1': 100,
                'Phòng 2': 50,
                'Phòng 3': 0,
                'Phòng cấp cứu': 75,
                'Phòng xét nghiệm': 25
            },
            totalQuantity: 250,
            status: 'pending',
            createdDate: '16/12/2024',
            createdBy: 'Admin',
            note: 'Phân phát cho 4 phòng'
        },
        {
            id: 'dist-002',
            materialId: 2,
            materialName: 'Khẩu trang y tế',
            materialUnit: 'cái',
            distributions: {
                'Phòng 1': 200,
                'Phòng 2': 150,
                'Phòng 3': 100,
                'Phòng cấp cứu': 300,
                'Phòng xét nghiệm': 50
            },
            totalQuantity: 800,
            status: 'completed',
            createdDate: '14/12/2024',
            createdBy: 'Quản lý',
            note: 'Phân phát khẩu trang cho tất cả phòng'
        },
        {
            id: 'dist-003',
            materialId: 3,
            materialName: 'Cồn y tế',
            materialUnit: 'chai',
            distributions: {
                'Phòng 1': 5,
                'Phòng 2': 3,
                'Phòng 3': 2,
                'Phòng cấp cứu': 10,
                'Phòng xét nghiệm': 5
            },
            totalQuantity: 25,
            status: 'pending',
            createdDate: '11/12/2024',
            createdBy: 'Y tá trưởng',
            note: 'Phân phát cồn y tế định kỳ'
        }
    ]);
    const [showEditDefectiveModal, setShowEditDefectiveModal] = useState(false);
    const [showEditDistributionModal, setShowEditDistributionModal] = useState(false);
    const [editingDefectiveOrder, setEditingDefectiveOrder] = useState<DefectiveReturnOrder | null>(null);
    const [editingDistributionOrder, setEditingDistributionOrder] = useState<DistributionOrder | null>(null);
    
    // State cho tìm kiếm theo ngày
    const [defectiveOrderDateFilter, setDefectiveOrderDateFilter] = useState('');
    const [distributionOrderDateFilter, setDistributionOrderDateFilter] = useState('');
    
    // State cho tìm kiếm lô hàng theo vật tư
    const [batchFilters, setBatchFilters] = useState<Record<number, string>>({});
    
    // State cho tìm kiếm danh sách vật tư
    const [materialSearchFilter, setMaterialSearchFilter] = useState('');
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    
    // State cho hiển thị chi tiết phân phối
    const [expandedDistributionDetails, setExpandedDistributionDetails] = useState<Record<string, boolean>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const roomAllocations: Record<string, number> = mockRooms.reduce((acc, room) => {
            acc[room] = 0;
            return acc;
        }, {} as Record<string, number>);

        const newMaterial: Material = {
            id: Date.now(),
            name: formData.name,
            unit: formData.unit,
            totalQuantity: parseInt(formData.totalQuantity),
            availableQuantity: parseInt(formData.totalQuantity),
            description: formData.description,
            category: formData.category,
            minStockAlert: parseInt(formData.minStockAlert),
            roomAllocations,
            batches: [],
            totalValue: 0,
            averagePrice: 0
        };

        setMaterials(prev => [...prev, newMaterial]);

        setFormData({
            name: '',
            unit: '',
            totalQuantity: '',
            description: '',
            category: '',
            minStockAlert: ''
        });
    };

    const handleAddBatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMaterial) return;

        const newBatch: Batch = {
            id: 'batch' + Date.now(),
            batchNumber: batchData.batchNumber,
            purchasePrice: parseFloat(batchData.purchasePrice),
            quantity: parseInt(batchData.quantity),
            defectiveQuantity: parseInt(batchData.defectiveQuantity) || 0,
            expiryDate: batchData.expiryDate,
            purchaseDate: batchData.purchaseDate,
            purchaseTime: batchData.purchaseTime,
            supplier: batchData.supplier
        };

        const updatedMaterials = materials.map(material => {
            if (material.id === selectedMaterial.id) {
                const newBatches = [...material.batches, newBatch];
                const newTotalQuantity = material.totalQuantity + newBatch.quantity;
                const newAvailableQuantity = material.availableQuantity + newBatch.quantity - newBatch.defectiveQuantity;
                const newTotalValue = newBatches.reduce((sum, batch) => sum + (batch.purchasePrice * batch.quantity), 0);
                const newAveragePrice = newTotalValue / newTotalQuantity;

                return {
                    ...material,
                    totalQuantity: newTotalQuantity,
                    availableQuantity: newAvailableQuantity,
                    batches: newBatches,
                    totalValue: newTotalValue,
                    averagePrice: newAveragePrice
                };
            }
            return material;
        });

        setMaterials(updatedMaterials);
        // Tạo số lô mới cho lần nhập tiếp theo
        const nextBatchNumber = generateBatchNumber();
        setBatchData({
            batchNumber: nextBatchNumber,
            purchasePrice: '',
            quantity: '',
            defectiveQuantity: '',
            purchaseDate: '',
            purchaseTime: '',
            expiryDate: '',
            supplier: ''
        });
        setShowBatchModal(false);
    };

    const handleDistribute = () => {
        if (!selectedMaterial) return;

        const totalDistributed = Object.values(distributionData).reduce((sum, qty) => sum + qty, 0);
        
        if (totalDistributed <= 0) {
            alert('Vui lòng nhập số lượng phân phát!');
            return;
        }

        if (totalDistributed > selectedMaterial.availableQuantity) {
            alert('Số lượng phân phát vượt quá số lượng có sẵn!');
            return;
        }

        // Tạo đơn phân phát mới
        const newDistributionOrder: DistributionOrder = {
            id: 'dist-' + Date.now(),
            materialId: selectedMaterial.id,
            materialName: selectedMaterial.name,
            materialUnit: selectedMaterial.unit,
            distributions: { ...distributionData },
            totalQuantity: totalDistributed,
            status: 'pending',
            createdDate: new Date().toLocaleDateString('vi-VN'),
            createdBy: 'Admin',
            note: `Phân phát cho ${Object.keys(distributionData).filter(room => distributionData[room] > 0).length} phòng`
        };

        setDistributionOrders(prev => [...prev, newDistributionOrder]);
        
        // Thông báo thành công
        alert(`📋 Đơn phân phát đã được tạo thành công!\n` +
              `📦 Vật tư: ${selectedMaterial.name}\n` +
              `📊 Tổng số lượng: ${totalDistributed} ${selectedMaterial.unit}\n` +
              `🏥 Số phòng: ${Object.keys(distributionData).filter(room => distributionData[room] > 0).length}\n` +
              `⏳ Trạng thái: Chờ xử lý`);

        setDistributionData({});
        setShowDistributeModal(false);
    };

    const handleCreateDefectiveOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMaterial || !defectiveFormData.selectedBatchId) {
            alert('Vui lòng chọn vật tư và lô hàng!');
            return;
        }

        const selectedBatchForOrder = selectedMaterial.batches.find(b => b.id === defectiveFormData.selectedBatchId);
        if (!selectedBatchForOrder) {
            alert('Lô hàng không hợp lệ!');
            return;
        }

        const quantity = parseInt(defectiveFormData.quantity);
        
        // Tính số lượng hàng lỗi thực tế hiện tại (đã trừ các đơn đã hoàn thành)
        const processedQuantity = defectiveOrders
            .filter(order => 
                order.batchId === selectedBatchForOrder.id && 
                order.status === 'completed'
            )
            .reduce((sum, order) => sum + order.quantity, 0);
        
        const availableDefectiveQuantity = selectedBatchForOrder.defectiveQuantity - processedQuantity;

        if (quantity <= 0 || quantity > availableDefectiveQuantity) {
            alert(`Số lượng không hợp lệ!\nHàng lỗi có sẵn: ${availableDefectiveQuantity} ${selectedMaterial.unit}`);
            return;
        }

        const newOrder: DefectiveReturnOrder = {
            id: 'order-' + Date.now(),
            materialId: selectedMaterial.id,
            materialName: selectedMaterial.name,
            batchId: selectedBatchForOrder.id,
            batchNumber: selectedBatchForOrder.batchNumber,
            quantity: quantity,
            reason: defectiveFormData.reason,
            status: 'pending',
            createdDate: new Date().toLocaleDateString('vi-VN'),
            supplierName: selectedBatchForOrder.supplier,
            estimatedValue: quantity * selectedBatchForOrder.purchasePrice,
            note: defectiveFormData.note
        };

        setDefectiveOrders(prev => [...prev, newOrder]);
        
        // Thông báo thành công
        alert(`📋 Đơn đổi trả đã được tạo thành công!\n` +
              `📦 Vật tư: ${selectedMaterial.name}\n` +
              `📋 Lô hàng: ${selectedBatch.batchNumber}\n` +
              `📊 Số lượng: ${quantity} ${selectedMaterial.unit}\n` +
              `💰 Giá trị: ${formatCurrency(newOrder.estimatedValue)}\n` +
              `⏳ Trạng thái: Chờ xử lý`);
        
        // Reset form
        setDefectiveFormData({
            quantity: '',
            reason: '',
            note: '',
            selectedBatchId: ''
        });
        setShowDefectiveModal(false);
    };

    const updateOrderStatus = (orderId: string, newStatus: DefectiveReturnOrder['status']) => {
        setDefectiveOrders(prev => 
            prev.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );

        // Nếu đơn đổi trả hoàn thành, trừ số lượng hàng lỗi
        if (newStatus === 'completed') {
            const completedOrder = defectiveOrders.find(order => order.id === orderId);
            if (completedOrder) {
                setMaterials(prevMaterials => 
                    prevMaterials.map(material => {
                        if (material.id === completedOrder.materialId) {
                            const updatedBatches = material.batches.map(batch => {
                                if (batch.id === completedOrder.batchId) {
                                    const newDefectiveQuantity = Math.max(0, batch.defectiveQuantity - completedOrder.quantity);
                                    return {
                                        ...batch,
                                        defectiveQuantity: newDefectiveQuantity
                                    };
                                }
                                return batch;
                            });

                            // Tính lại tổng giá trị và giá trung bình
                            const newTotalValue = updatedBatches.reduce((sum, batch) => sum + (batch.purchasePrice * batch.quantity), 0);
                            const newAveragePrice = material.totalQuantity > 0 ? newTotalValue / material.totalQuantity : 0;

                            return {
                                ...material,
                                batches: updatedBatches,
                                totalValue: newTotalValue,
                                averagePrice: newAveragePrice
                            };
                        }
                        return material;
                    })
                );

                // Thông báo hoàn thành
                alert(`✅ Đơn đổi trả hoàn thành!\n` +
                      `📦 Vật tư: ${completedOrder.materialName}\n` +
                      `📋 Lô hàng: ${completedOrder.batchNumber}\n` +
                      `📊 Đã trừ ${completedOrder.quantity} sản phẩm lỗi\n` +
                      `💰 Giá trị: ${formatCurrency(completedOrder.estimatedValue)}`);
            }
        }
    };

    const updateDistributionOrderStatus = (orderId: string, newStatus: DistributionOrder['status']) => {
        setDistributionOrders(prev => 
            prev.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );

        // Nếu đơn phân phát được xác nhận thành công, mới trừ số lượng trong kho
        if (newStatus === 'completed') {
            const completedOrder = distributionOrders.find(order => order.id === orderId);
            if (completedOrder) {
                setMaterials(prevMaterials => 
                    prevMaterials.map(material => {
                        if (material.id === completedOrder.materialId) {
                            const newRoomAllocations = { ...material.roomAllocations };
                            Object.entries(completedOrder.distributions).forEach(([room, quantity]) => {
                                newRoomAllocations[room] = (newRoomAllocations[room] || 0) + quantity;
                            });

                            return {
                                ...material,
                                roomAllocations: newRoomAllocations,
                                availableQuantity: material.availableQuantity - completedOrder.totalQuantity
                            };
                        }
                        return material;
                    })
                );
                
                alert(`✅ Đơn phân phát hoàn thành!\n` +
                      `📦 Vật tư: ${completedOrder.materialName}\n` +
                      `📊 Số lượng: ${completedOrder.totalQuantity} ${completedOrder.materialUnit}\n` +
                      `🏥 Đã phân phát cho ${Object.keys(completedOrder.distributions).filter(room => completedOrder.distributions[room] > 0).length} phòng\n` +
                      `📉 Kho đã được cập nhật số lượng`);
            }
        }
    };

    const openDefectiveModal = (material: Material, batch?: Batch) => {
        setSelectedMaterial(material);
        setSelectedBatch(batch || null);
        
        // Tự động chọn lô hàng nếu chỉ có 1 lô có hàng lỗi
        const availableBatches = material.batches.filter(b => {
            const processedQuantity = defectiveOrders
                .filter(order => order.batchId === b.id && order.status === 'completed')
                .reduce((sum, order) => sum + order.quantity, 0);
            return (b.defectiveQuantity - processedQuantity) > 0;
        });
        
        const initialBatchId = batch?.id || (availableBatches.length === 1 ? availableBatches[0].id : '');
        
        setDefectiveFormData({
            quantity: '',
            reason: '',
            note: '',
            selectedBatchId: initialBatchId
        });
        
        if (initialBatchId) {
            const selectedBatch = material.batches.find(b => b.id === initialBatchId);
            setSelectedBatch(selectedBatch || null);
        }
        
        setShowDefectiveModal(true);
    };

    const getStatusColor = (status: DefectiveReturnOrder['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: DefectiveReturnOrder['status']) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <FileX className="w-4 h-4" />;
            default: return null;
        }
    };

    const getDistributionStatusColor = (status: DistributionOrder['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDistributionStatusIcon = (status: DistributionOrder['status']) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <FileX className="w-4 h-4" />;
            default: return null;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        // Kiểm tra nếu đã là định dạng yyyy-mm-dd thì chuyển sang dd/mm/yyyy
        if (dateString.includes('-') && dateString.length === 10) {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        }
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatNumber = (value: string) => {
        // Chỉ giữ lại số
        const numericValue = value.replace(/[^\d]/g, '');
        if (!numericValue) return '';
        
        // Format với dấu phẩy ngăn cách
        return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
    };

    const parseNumber = (formattedValue: string) => {
        // Chuyển từ format có dấu phẩy về số thuần
        return formattedValue.replace(/[^\d]/g, '');
    };

    // Lọc đơn đổi trả theo ngày
    const filteredDefectiveOrders = defectiveOrders.filter(order => {
        if (!defectiveOrderDateFilter) return true;
        
        // Chuyển đổi ngày từ dd/mm/yyyy sang yyyy-mm-dd để so sánh
        const orderDateParts = order.createdDate.split('/');
        const orderDateFormatted = `${orderDateParts[2]}-${orderDateParts[1].padStart(2, '0')}-${orderDateParts[0].padStart(2, '0')}`;
        
        return orderDateFormatted === defectiveOrderDateFilter;
    });

    // Lọc đơn phân phát theo ngày
    const filteredDistributionOrders = distributionOrders.filter(order => {
        if (!distributionOrderDateFilter) return true;
        
        // Chuyển đổi ngày từ dd/mm/yyyy sang yyyy-mm-dd để so sánh
        const orderDateParts = order.createdDate.split('/');
        const orderDateFormatted = `${orderDateParts[2]}-${orderDateParts[1].padStart(2, '0')}-${orderDateParts[0].padStart(2, '0')}`;
        
        return orderDateFormatted === distributionOrderDateFilter;
    });

    // Lọc danh sách vật tư theo từ khóa tìm kiếm
    const filteredMaterials = materials.filter(material => {
        if (!materialSearchFilter) return true;
        
        const searchTerm = materialSearchFilter.toLowerCase();
        return (
            material.name.toLowerCase().includes(searchTerm) ||
            material.category.toLowerCase().includes(searchTerm) ||
            material.description.toLowerCase().includes(searchTerm) ||
            material.batches.some(batch => 
                batch.batchNumber.toLowerCase().includes(searchTerm) ||
                batch.supplier.toLowerCase().includes(searchTerm)
            )
        );
    });

    const openDistributeModal = (material: Material) => {
        setSelectedMaterial(material);
        setDistributionData({});
        setShowDistributeModal(true);
    };

    const openEditDefectiveModal = (order: DefectiveReturnOrder) => {
        setEditingDefectiveOrder(order);
        // Tìm material và batch tương ứng
        const material = materials.find(m => m.id === order.materialId);
        const batch = material?.batches.find(b => b.id === order.batchId);
        setSelectedMaterial(material || null);
        setSelectedBatch(batch || null);
        
        setDefectiveFormData({
            quantity: order.quantity.toString(),
            reason: order.reason,
            note: order.note || '',
            selectedBatchId: order.batchId
        });
        setShowEditDefectiveModal(true);
    };

    const openEditDistributionModal = (order: DistributionOrder) => {
        setEditingDistributionOrder(order);
        setDistributionData(order.distributions);
        // Tìm material tương ứng để set selectedMaterial
        const material = materials.find(m => m.id === order.materialId);
        setSelectedMaterial(material || null);
        setShowEditDistributionModal(true);
    };

    const handleUpdateDefectiveOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDefectiveOrder) return;

        const quantity = parseInt(defectiveFormData.quantity);
        
        if (quantity <= 0) {
            alert('Số lượng không hợp lệ!');
            return;
        }

        const updatedOrder: DefectiveReturnOrder = {
            ...editingDefectiveOrder,
            quantity: quantity,
            reason: defectiveFormData.reason,
            note: defectiveFormData.note,
            estimatedValue: quantity * (selectedBatch?.purchasePrice || 0)
        };

        setDefectiveOrders(prev => 
            prev.map(order => 
                order.id === editingDefectiveOrder.id ? updatedOrder : order
            )
        );

        alert(`✅ Đơn đổi trả đã được cập nhật!\n` +
              `📦 Vật tư: ${updatedOrder.materialName}\n` +
              `📊 Số lượng: ${quantity}\n` +
              `💰 Giá trị: ${formatCurrency(updatedOrder.estimatedValue)}`);

        setDefectiveFormData({ quantity: '', reason: '', note: '', selectedBatchId: '' });
        setShowEditDefectiveModal(false);
        setEditingDefectiveOrder(null);
    };

    const handleUpdateDistributionOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDistributionOrder) return;

        const totalDistributed = Object.values(distributionData).reduce((sum, qty) => sum + qty, 0);
        
        if (totalDistributed <= 0) {
            alert('Vui lòng nhập số lượng phân phát!');
            return;
        }

        const updatedOrder: DistributionOrder = {
            ...editingDistributionOrder,
            distributions: { ...distributionData },
            totalQuantity: totalDistributed,
            note: `Phân phát cho ${Object.keys(distributionData).filter(room => distributionData[room] > 0).length} phòng (đã chỉnh sửa)`
        };

        setDistributionOrders(prev => 
            prev.map(order => 
                order.id === editingDistributionOrder.id ? updatedOrder : order
            )
        );

        alert(`✅ Đơn phân phát đã được cập nhật!\n` +
              `📦 Vật tư: ${updatedOrder.materialName}\n` +
              `📊 Tổng số lượng: ${totalDistributed} ${updatedOrder.materialUnit}\n` +
              `🏥 Số phòng: ${Object.keys(distributionData).filter(room => distributionData[room] > 0).length}`);

        setDistributionData({});
        setShowEditDistributionModal(false);
        setEditingDistributionOrder(null);
    };

    const generateBatchNumber = () => {
        const currentYear = new Date().getFullYear();
        
        // Thu thập tất cả số lô hiện có trong hệ thống
        const allBatches = materials.flatMap(material => material.batches);
        
        // Tìm số lô lớn nhất theo pattern LOT-YYYY-XXX
        let maxSequence = 0;
        allBatches.forEach(batch => {
            const match = batch.batchNumber.match(/^LOT-(\d{4})-(\d{3})$/);
            if (match && match[1] === currentYear.toString()) {
                const sequence = parseInt(match[2]);
                if (sequence > maxSequence) {
                    maxSequence = sequence;
                }
            }
        });
        
        // Tạo số thứ tự mới (lớn nhất hiện tại + 1)
        const nextSequence = (maxSequence + 1).toString().padStart(3, '0');
        
        return `LOT-${currentYear}-${nextSequence}`;
    };

    const openBatchModal = (material: Material) => {
        setSelectedMaterial(material);
        
        // Tự động tạo số lô mới
        const newBatchNumber = generateBatchNumber();
        setBatchData({
            batchNumber: newBatchNumber,
            purchasePrice: '',
            quantity: '',
            defectiveQuantity: '',
            purchaseDate: new Date().toISOString().split('T')[0], // Ngày hiện tại
            purchaseTime: new Date().toTimeString().slice(0, 5), // Giờ hiện tại HH:MM
            expiryDate: '',
            supplier: ''
        });
        
        setShowBatchModal(true);
    };

    // Function để chọn vật tư từ dropdown
    const handleSelectMaterial = (material: Material) => {
        setMaterialSearchFilter(material.name);
        setShowSearchDropdown(false);
        // Scroll đến vật tư được chọn
        setTimeout(() => {
            const element = document.getElementById(`material-${material.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('ring-2', 'ring-blue-500');
                setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-blue-500');
                }, 2000);
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-8xl mx-auto space-y-10">
                {/* Header với thống kê */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Quản lý vật tư</h1>
                        <p className="text-lg text-gray-600">Theo dõi và quản lý toàn bộ vật tư y tế</p>
                    </div>

                </div>

            {/* Form thêm vật tư */}
                <Card className="p-8 bg-white shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
                        <Plus className="w-6 h-6 mr-3 text-blue-600" />
                        Thêm vật tư mới
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tên vật tư</label>
                    <Input
                                    placeholder="Nhập tên vật tư"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 text-base"
                        required
                    />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Đơn vị</label>
                    <Input
                                    placeholder="VD: hộp, chai, cái..."
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="h-12 text-base"
                        required
                    />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Danh mục</label>
                    <Input
                                    placeholder="VD: Bảo hộ, Thiết bị..."
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="h-12 text-base"
                        required
                    />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Số lượng ban đầu</label>
                                <Input
                                    type="text"
                                    placeholder="VD: 1,000"
                                    value={formData.totalQuantity ? formatNumber(formData.totalQuantity) : ''}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        setFormData({ ...formData, totalQuantity: numericValue });
                                    }}
                                    className="h-12 text-base"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Mức cảnh báo tồn kho</label>
                                <Input
                                    type="text"
                                    placeholder="VD: 100"
                                    value={formData.minStockAlert ? formatNumber(formData.minStockAlert) : ''}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        setFormData({ ...formData, minStockAlert: numericValue });
                                    }}
                                    className="h-12 text-base"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mô tả</label>
                    <Textarea
                                placeholder="Mô tả chi tiết về vật tư..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="text-base min-h-[100px]"
                            />
                        </div>
                        
                        <Button type="submit" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm vật tư
                        </Button>
                </form>
            </Card>

                            {/* Danh sách vật tư */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-900">Danh sách vật tư</h2>
                        <div className="relative flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-500" />
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm vật tư, danh mục, lô hàng..."
                                    value={materialSearchFilter}
                                    onChange={(e) => setMaterialSearchFilter(e.target.value)}
                                    onFocus={() => setShowSearchDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                                    className="w-72"
                                />
                                
                                {/* Dropdown danh sách vật tư */}
                                {showSearchDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                                        {materials.length === 0 ? (
                                            <div className="p-4 text-gray-500 text-center">
                                                Chưa có vật tư nào
                                            </div>
                                        ) : (
                                            <div className="py-1">
                                                {materials
                                                    .filter(material => {
                                                        if (!materialSearchFilter) return true;
                                                        const searchTerm = materialSearchFilter.toLowerCase();
                                                        return (
                                                            material.name.toLowerCase().includes(searchTerm) ||
                                                            material.category.toLowerCase().includes(searchTerm) ||
                                                            material.description.toLowerCase().includes(searchTerm)
                                                        );
                                                    })
                                                    .slice(0, 10) // Giới hạn 10 kết quả
                                                    .map((material) => (
                                                        <div
                                                            key={material.id}
                                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                            onClick={() => handleSelectMaterial(material)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-gray-900">{material.name}</div>
                                                                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                                                                        <span>{material.category}</span>
                                                                        <span>•</span>
                                                                        <span>{material.availableQuantity} {material.unit} có sẵn</span>
                                                                    </div>
                                                                </div>
                                                                {material.availableQuantity <= material.minStockAlert && (
                                                                    <div className="ml-2">
                                                                        <Badge variant="destructive" className="text-xs">
                                                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                                                            Sắp hết
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                
                                                {materials.filter(material => {
                                                    if (!materialSearchFilter) return true;
                                                    const searchTerm = materialSearchFilter.toLowerCase();
                                                    return (
                                                        material.name.toLowerCase().includes(searchTerm) ||
                                                        material.category.toLowerCase().includes(searchTerm) ||
                                                        material.description.toLowerCase().includes(searchTerm)
                                                    );
                                                }).length === 0 && materialSearchFilter && (
                                                    <div className="p-4 text-gray-500 text-center">
                                                        Không tìm thấy vật tư nào với từ khóa "{materialSearchFilter}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {materialSearchFilter && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setMaterialSearchFilter('');
                                        setShowSearchDropdown(false);
                                    }}
                                    className="px-2"
                                >
                                    ✕
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    {filteredMaterials.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {materialSearchFilter ? 
                                `Không tìm thấy vật tư nào với từ khóa "${materialSearchFilter}"` :
                                'Chưa có vật tư nào'
                            }
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredMaterials.map((material) => (
                        <Card key={material.id} id={`material-${material.id}`} className="p-8 bg-white shadow-lg border border-gray-200 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1 pr-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <h3 className="font-bold text-2xl text-gray-900">{material.name}</h3>
                                        <Badge variant="secondary" className="text-sm px-3 py-1">{material.category}</Badge>
                                        {material.availableQuantity <= material.minStockAlert && (
                                            <Badge variant="destructive" className="flex items-center text-sm px-3 py-1">
                                                <AlertTriangle className="w-4 h-4 mr-1" />
                                                Sắp hết
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-base text-gray-600 mb-6 leading-relaxed">{material.description}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-sm text-blue-600 font-medium mb-1">Tổng số lượng</div>
                                            <div className="text-xl font-bold text-blue-900">{material.totalQuantity} {material.unit}</div>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-sm text-blue-600 font-medium mb-1">Có sẵn</div>
                                            <div className="text-xl font-bold text-blue-900">{material.availableQuantity} {material.unit}</div>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-sm text-blue-600 font-medium mb-1">Giá trung bình</div>
                                            <div className="text-lg font-bold text-blue-900">{formatCurrency(material.averagePrice)}</div>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-sm text-blue-600 font-medium mb-1">Tổng giá trị</div>
                                            <div className="text-lg font-bold text-blue-900">{formatCurrency(material.totalValue)}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col space-y-3">
                                    <Button 
                                        size="lg"
                                        variant="outline"
                                        onClick={() => openBatchModal(material)}
                                        className="h-12 px-6 text-base"
                                    >
                                        <Truck className="w-5 h-5 mr-2" />
                                        Nhập hàng
                                    </Button>
                                    <Button 
                                        size="lg"
                                        onClick={() => openDistributeModal(material)}
                                        className="h-12 px-6 text-base bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Package className="w-5 h-5 mr-2" />
                                        Phân phát
                                    </Button>
                                    <Button 
                                        size="lg"
                                        variant="destructive"
                                        onClick={() => openDefectiveModal(material)}
                                        className="h-12 px-6 text-base"
                                        disabled={!material.batches.some(batch => batch.defectiveQuantity > 0)}
                                    >
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        Tạo đơn đổi trả
                                    </Button>
                                </div>
                            </div>

                            {/* Thông tin lô hàng */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-semibold text-gray-900">Thông tin lô hàng</h4>
                                    <div className="flex items-center space-x-2">
                                        <Search className="w-4 h-4 text-gray-500" />
                                        <Input
                                            type="text"
                                            placeholder="Tìm theo số lô..."
                                            value={batchFilters[material.id] || ''}
                                            onChange={(e) => setBatchFilters(prev => ({
                                                ...prev,
                                                [material.id]: e.target.value
                                            }))}
                                            className="w-48"
                                        />
                                        {batchFilters[material.id] && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setBatchFilters(prev => ({
                                                    ...prev,
                                                    [material.id]: ''
                                                }))}
                                                className="px-2"
                                            >
                                                ✕
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {material.batches
                                        .filter(batch => 
                                            !batchFilters[material.id] || 
                                            batch.batchNumber.toLowerCase().includes(batchFilters[material.id].toLowerCase()) ||
                                            batch.supplier.toLowerCase().includes(batchFilters[material.id].toLowerCase())
                                        )
                                        .map((batch) => (
                                        <div key={batch.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-semibold text-base text-gray-900">{batch.batchNumber}</span>
                                                <Badge variant={batch.defectiveQuantity > 0 ? "destructive" : "default"} className="text-sm">
                                                    {batch.quantity - batch.defectiveQuantity}/{batch.quantity}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex justify-between">
                                                    <span>Giá nhập:</span>
                                                    <span className="font-medium">{formatCurrency(batch.purchasePrice)}/{material.unit}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Ngày nhập hàng:</span>
                                                    <span className="font-medium">{formatDate(batch.purchaseDate)} {batch.purchaseTime}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Hạn sử dụng:</span>
                                                    <span className="font-medium">{formatDate(batch.expiryDate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Nhà cung cấp:</span>
                                                    <span className="font-medium">{batch.supplier}</span>
                                                </div>
                                                {batch.defectiveQuantity > 0 && (
                                                    <>
                                                        <div className="flex justify-between text-red-600">
                                                            <span>Hàng lỗi:</span>
                                                            <span className="font-medium">{batch.defectiveQuantity} {material.unit}</span>
                                                        </div>
                                                        <div className="mt-3 text-xs text-gray-500 text-center">
                                                            {(() => {
                                                                const processedQuantity = defectiveOrders
                                                                    .filter(order => 
                                                                        order.batchId === batch.id && 
                                                                        order.status === 'completed'
                                                                    )
                                                                    .reduce((sum, order) => sum + order.quantity, 0);
                                                                const availableDefectiveQuantity = batch.defectiveQuantity - processedQuantity;
                                                                
                                                                return availableDefectiveQuantity > 0 ? 
                                                                    `Có ${availableDefectiveQuantity} lỗi chưa đổi trả` : 
                                                                    'Đã đổi trả hết hàng lỗi';
                                                            })()}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phân bổ theo phòng */}
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-gray-900">Phân bổ theo phòng</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {mockRooms.map((room) => (
                                        <div key={room} className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                                            <div className="font-semibold text-blue-900 mb-2">{room}</div>
                                            <div className="text-xl font-bold text-blue-700">{material.roomAllocations[room] || 0}</div>
                                            <div className="text-sm text-blue-600">{material.unit}</div>
                                        </div>
                                    ))}
                        </div>
                    </div>
                        </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal phân phát vật tư */}
                <Dialog open={showDistributeModal} onOpenChange={setShowDistributeModal}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Phân phát vật tư: {selectedMaterial?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="text-base text-gray-600 bg-blue-50 p-4 rounded-lg">
                                Có sẵn: <span className="font-bold text-blue-900">{selectedMaterial?.availableQuantity} {selectedMaterial?.unit}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mockRooms.map((room) => (
                                    <div key={room} className="space-y-3">
                                        <label className="text-base font-semibold text-gray-900">{room}</label>
                                        <Input
                                            type="text"
                                            placeholder="VD: 1,000"
                                            value={distributionData[room] ? formatNumber(distributionData[room].toString()) : ''}
                                            onChange={(e) => {
                                                const numericValue = parseNumber(e.target.value);
                                                setDistributionData(prev => ({
                                                    ...prev,
                                                    [room]: parseInt(numericValue) || 0
                                                }));
                                            }}
                                            className="h-12 text-base"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-base bg-yellow-50 p-4 rounded-lg">
                                Tổng phân phát: <span className="font-bold text-yellow-900">{Object.values(distributionData).reduce((sum, qty) => sum + qty, 0)} {selectedMaterial?.unit}</span>
                            </div>
                            <Button onClick={handleDistribute} className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700">
                                Xác nhận phân phát
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Modal nhập hàng */}
                <Dialog open={showBatchModal} onOpenChange={setShowBatchModal}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Nhập lô hàng mới: {selectedMaterial?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddBatch} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Số lô</label>
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="VD: LOT-2024-001"
                                        value={batchData.batchNumber}
                                        onChange={(e) => setBatchData(prev => ({ ...prev, batchNumber: e.target.value }))}
                                        className="h-12 text-base flex-1"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setBatchData(prev => ({ ...prev, batchNumber: generateBatchNumber() }))}
                                        className="h-12 px-4"
                                        title="Tạo số lô mới"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    💡 Số lô được tự động tạo theo format LOT-YYYY-XXX. Bạn có thể chỉnh sửa hoặc tạo mới bằng nút 🔄
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Giá nhập (VND)</label>
                                <Input
                                    type="text"
                                    placeholder="VD: 1,500,000"
                                    value={batchData.purchasePrice ? formatNumber(batchData.purchasePrice) : ''}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        setBatchData(prev => ({ ...prev, purchasePrice: numericValue }));
                                    }}
                                    className="h-12 text-base"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-base font-semibold text-gray-900">Số lượng</label>
                                    <Input
                                        type="text"
                                        placeholder="VD: 1,000"
                                        value={batchData.quantity ? formatNumber(batchData.quantity) : ''}
                                        onChange={(e) => {
                                            const numericValue = parseNumber(e.target.value);
                                            setBatchData(prev => ({ ...prev, quantity: numericValue }));
                                        }}
                                        className="h-12 text-base"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-base font-semibold text-gray-900">Số lượng lỗi</label>
                                    <Input
                                        type="text"
                                        placeholder="VD: 100"
                                        value={batchData.defectiveQuantity ? formatNumber(batchData.defectiveQuantity) : ''}
                                        onChange={(e) => {
                                            const numericValue = parseNumber(e.target.value);
                                            setBatchData(prev => ({ ...prev, defectiveQuantity: numericValue }));
                                        }}
                                        className="h-12 text-base"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-base font-semibold text-gray-900">Ngày nhập hàng</label>
                                    <Input
                                        type="date"
                                        value={batchData.purchaseDate}
                                        onChange={(e) => setBatchData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                                        className="h-12 text-base"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-base font-semibold text-gray-900">Giờ nhập hàng</label>
                                    <Input
                                        type="time"
                                        value={batchData.purchaseTime}
                                        onChange={(e) => setBatchData(prev => ({ ...prev, purchaseTime: e.target.value }))}
                                        className="h-12 text-base"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-base font-semibold text-gray-900">Hạn sử dụng</label>
                                    <Input
                                        type="date"
                                        value={batchData.expiryDate}
                                        onChange={(e) => setBatchData(prev => ({ ...prev, expiryDate: e.target.value }))}
                                        className="h-12 text-base"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Nhà cung cấp</label>
                                <Input
                                    placeholder="Tên nhà cung cấp"
                                    value={batchData.supplier}
                                    onChange={(e) => setBatchData(prev => ({ ...prev, supplier: e.target.value }))}
                                    className="h-12 text-base"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-base">
                                <DollarSign className="w-5 h-5 mr-2" />
                                Xác nhận nhập hàng
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal tạo đơn đổi trả hàng lỗi */}
                <Dialog open={showDefectiveModal} onOpenChange={setShowDefectiveModal}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center">
                                <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                                Tạo đơn đổi trả hàng lỗi
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateDefectiveOrder} className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="text-sm text-gray-600">
                                    <strong>Vật tư:</strong> {selectedMaterial?.name}
                                </div>
                                {defectiveFormData.selectedBatchId ? (() => {
                                    const batch = selectedMaterial?.batches.find(b => b.id === defectiveFormData.selectedBatchId);
                                    if (!batch) return null;
                                    
                                    const processedQuantity = defectiveOrders
                                        .filter(order => 
                                            order.batchId === batch.id && 
                                            order.status === 'completed'
                                        )
                                        .reduce((sum, order) => sum + order.quantity, 0);
                                    const availableDefective = batch.defectiveQuantity - processedQuantity;
                                    
                                    return (
                                        <>
                                            <div className="text-sm text-gray-600">
                                                <strong>Lô hàng:</strong> {batch.batchNumber}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <strong>Nhà cung cấp:</strong> {batch.supplier}
                                            </div>
                                            <div className="text-sm text-red-600">
                                                <strong>Hàng lỗi có sẵn:</strong> {availableDefective} {selectedMaterial?.unit}
                                            </div>
                                        </>
                                    );
                                })() : (
                                    <div className="text-sm text-gray-500 italic">
                                        👆 Vui lòng chọn lô hàng bên dưới để xem thông tin chi tiết
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Chọn lô hàng</label>
                                <Select 
                                    value={defectiveFormData.selectedBatchId} 
                                    onValueChange={(value) => {
                                        const batch = selectedMaterial?.batches.find(b => b.id === value);
                                        setSelectedBatch(batch || null);
                                        setDefectiveFormData(prev => ({ 
                                            ...prev, 
                                            selectedBatchId: value,
                                            quantity: '' // Reset quantity khi đổi lô hàng
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="h-12 text-base">
                                        <SelectValue placeholder="Chọn lô hàng có lỗi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedMaterial?.batches
                                            .filter(batch => {
                                                const processedQuantity = defectiveOrders
                                                    .filter(order => 
                                                        order.batchId === batch.id && 
                                                        order.status === 'completed'
                                                    )
                                                    .reduce((sum, order) => sum + order.quantity, 0);
                                                return (batch.defectiveQuantity - processedQuantity) > 0;
                                            })
                                            .map(batch => {
                                                const processedQuantity = defectiveOrders
                                                    .filter(order => 
                                                        order.batchId === batch.id && 
                                                        order.status === 'completed'
                                                    )
                                                    .reduce((sum, order) => sum + order.quantity, 0);
                                                const availableDefective = batch.defectiveQuantity - processedQuantity;
                                                return (
                                                    <SelectItem key={batch.id} value={batch.id}>
                                                        {batch.batchNumber} - {batch.supplier} (Có {availableDefective} lỗi)
                                                    </SelectItem>
                                                );
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Số lượng đổi trả</label>
                                <Input
                                    type="text"
                                    placeholder="VD: 100"
                                    value={defectiveFormData.quantity ? formatNumber(defectiveFormData.quantity) : ''}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        setDefectiveFormData(prev => ({ ...prev, quantity: numericValue }));
                                    }}
                                    className="h-12 text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Lý do đổi trả</label>
                                <Select 
                                    value={defectiveFormData.reason} 
                                    onValueChange={(value) => setDefectiveFormData(prev => ({ ...prev, reason: value }))}
                                >
                                    <SelectTrigger className="h-12 text-base">
                                        <SelectValue placeholder="Chọn lý do" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="damaged">Hàng bị hỏng</SelectItem>
                                        <SelectItem value="expired">Hết hạn sử dụng</SelectItem>
                                        <SelectItem value="wrong-spec">Sai thông số kỹ thuật</SelectItem>
                                        <SelectItem value="quality-issue">Lỗi chất lượng</SelectItem>
                                        <SelectItem value="packaging">Bao bì hư hỏng</SelectItem>
                                        <SelectItem value="other">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Ghi chú thêm</label>
                                <Textarea
                                    placeholder="Mô tả chi tiết về vấn đề..."
                                    value={defectiveFormData.note}
                                    onChange={(e) => setDefectiveFormData(prev => ({ ...prev, note: e.target.value }))}
                                    className="text-base min-h-[100px]"
                                />
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="text-sm text-yellow-800">
                                    <strong>Giá trị ước tính:</strong> {(() => {
                                        const quantity = parseInt(defectiveFormData.quantity) || 0;
                                        const batch = selectedMaterial?.batches.find(b => b.id === defectiveFormData.selectedBatchId);
                                        const price = batch?.purchasePrice || 0;
                                        return formatCurrency(quantity * price);
                                    })()}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 text-base bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                disabled={!defectiveFormData.selectedBatchId}
                            >
                                <FileX className="w-5 h-5 mr-2" />
                                {defectiveFormData.selectedBatchId ? 'Tạo đơn đổi trả' : 'Chọn lô hàng để tiếp tục'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal chỉnh sửa đơn đổi trả */}
                <Dialog open={showEditDefectiveModal} onOpenChange={setShowEditDefectiveModal}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center">
                                <Edit className="w-6 h-6 mr-2 text-blue-600" />
                                Chỉnh sửa đơn đổi trả hàng lỗi
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateDefectiveOrder} className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="text-sm text-gray-600">
                                    <strong>Vật tư:</strong> {editingDefectiveOrder?.materialName}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <strong>Lô hàng:</strong> {editingDefectiveOrder?.batchNumber}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <strong>Nhà cung cấp:</strong> {editingDefectiveOrder?.supplierName}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Số lượng đổi trả</label>
                                <Input
                                    type="text"
                                    placeholder="VD: 100"
                                    value={defectiveFormData.quantity ? formatNumber(defectiveFormData.quantity) : ''}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        setDefectiveFormData(prev => ({ ...prev, quantity: numericValue }));
                                    }}
                                    className="h-12 text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Lý do đổi trả</label>
                                <Select 
                                    value={defectiveFormData.reason} 
                                    onValueChange={(value) => setDefectiveFormData(prev => ({ ...prev, reason: value }))}
                                >
                                    <SelectTrigger className="h-12 text-base">
                                        <SelectValue placeholder="Chọn lý do" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="damaged">Hàng bị hỏng</SelectItem>
                                        <SelectItem value="expired">Hết hạn sử dụng</SelectItem>
                                        <SelectItem value="wrong-spec">Sai thông số kỹ thuật</SelectItem>
                                        <SelectItem value="quality-issue">Lỗi chất lượng</SelectItem>
                                        <SelectItem value="packaging">Bao bì hư hỏng</SelectItem>
                                        <SelectItem value="other">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-base font-semibold text-gray-900">Ghi chú thêm</label>
                                <Textarea
                                    placeholder="Mô tả chi tiết về vấn đề..."
                                    value={defectiveFormData.note}
                                    onChange={(e) => setDefectiveFormData(prev => ({ ...prev, note: e.target.value }))}
                                    className="text-base min-h-[100px]"
                                />
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="text-sm text-yellow-800">
                                    <strong>Giá trị ước tính:</strong> {(() => {
                                        const quantity = parseInt(defectiveFormData.quantity) || 0;
                                        const price = selectedBatch?.purchasePrice || 0;
                                        return formatCurrency(quantity * price);
                                    })()}
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700">
                                <Edit className="w-5 h-5 mr-2" />
                                Cập nhật đơn đổi trả
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Danh sách đơn đổi trả */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                            <RefreshCw className="w-6 h-6 mr-3 text-blue-600" />
                            Đơn đổi trả hàng lỗi
                        </h2>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Tìm theo ngày:</label>
                            <Input
                                type="date"
                                value={defectiveOrderDateFilter}
                                onChange={(e) => setDefectiveOrderDateFilter(e.target.value)}
                                className="w-40"
                                placeholder="Chọn ngày"
                            />
                            {defectiveOrderDateFilter && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setDefectiveOrderDateFilter('')}
                                    className="px-2"
                                >
                                    ✕
                                </Button>
                            )}
                        </div>
                    </div>
                    {filteredDefectiveOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {defectiveOrderDateFilter ? 
                                `Không có đơn đổi trả nào trong ngày ${formatDate(defectiveOrderDateFilter)}` :
                                'Chưa có đơn đổi trả hàng lỗi nào'
                            }
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredDefectiveOrders.map((order) => (
                                <Card key={order.id} className="p-6 bg-white shadow-lg border border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 mb-1">{order.materialName}</h3>
                                            <p className="text-sm text-gray-600">Lô: {order.batchNumber}</p>
                                        </div>
                                        <Badge className={`${getStatusColor(order.status)} flex items-center`}>
                                            {getStatusIcon(order.status)}
                                            <span className="ml-1 font-medium">
                                                {order.status === 'pending' && 'Chờ xử lý'}
                                                {order.status === 'completed' && 'Thành công'}
                                                {order.status === 'rejected' && 'Không thành công'}
                                            </span>
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nhà cung cấp:</span>
                                            <span className="font-medium">{order.supplierName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Số lượng:</span>
                                            <span className="font-medium text-red-600">{order.quantity} sản phẩm</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Lý do:</span>
                                            <span className="font-medium">{
                                                order.reason === 'damaged' ? 'Hàng bị hỏng' :
                                                order.reason === 'expired' ? 'Hết hạn sử dụng' :
                                                order.reason === 'wrong-spec' ? 'Sai thông số' :
                                                order.reason === 'quality-issue' ? 'Lỗi chất lượng' :
                                                order.reason === 'packaging' ? 'Bao bì hư hỏng' : 'Khác'
                                            }</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Giá trị:</span>
                                            <span className="font-medium text-blue-600">{formatCurrency(order.estimatedValue)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ngày tạo:</span>
                                            <span className="font-medium">{order.createdDate}</span>
                                        </div>
                                    </div>

                                    {order.note && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700"><strong>Ghi chú:</strong> {order.note}</p>
                                        </div>
                                    )}

                                    {order.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditDefectiveModal(order)}
                                                className="flex-1 h-9 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                                className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Thành công
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateOrderStatus(order.id, 'rejected')}
                                                className="flex-1 h-9 text-sm border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                <FileX className="w-4 h-4 mr-1" />
                                                Không thành công
                                            </Button>
                                        </div>
                                    )}


            </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Danh sách đơn phân phát */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                            <Package className="w-6 h-6 mr-3 text-green-600" />
                            Đơn phân phát vật tư
                        </h2>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Tìm theo ngày:</label>
                            <Input
                                type="date"
                                value={distributionOrderDateFilter}
                                onChange={(e) => setDistributionOrderDateFilter(e.target.value)}
                                className="w-40"
                                placeholder="Chọn ngày"
                            />
                            {distributionOrderDateFilter && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setDistributionOrderDateFilter('')}
                                    className="px-2"
                                >
                                    ✕
                                </Button>
                            )}
                        </div>
                    </div>
                    {filteredDistributionOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {distributionOrderDateFilter ? 
                                `Không có đơn phân phát nào trong ngày ${formatDate(distributionOrderDateFilter)}` :
                                'Chưa có đơn phân phát vật tư nào'
                            }
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredDistributionOrders.map((order) => (
                                <Card key={order.id} className="p-6 bg-white shadow-lg border border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 mb-1">{order.materialName}</h3>
                                            <p className="text-sm text-gray-600">Tổng: {order.totalQuantity} {order.materialUnit}</p>
                                        </div>
                                        <Badge className={`${getDistributionStatusColor(order.status)} flex items-center`}>
                                            {getDistributionStatusIcon(order.status)}
                                            <span className="ml-1 font-medium">
                                                {order.status === 'pending' && 'Chờ xử lý'}
                                                {order.status === 'completed' && 'Thành công'}
                                                {order.status === 'rejected' && 'Không thành công'}
                                            </span>
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Người tạo:</span>
                                            <span className="font-medium">{order.createdBy}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tổng số lượng:</span>
                                            <span className="font-medium text-blue-600">{formatNumber(order.totalQuantity.toString())} {order.materialUnit}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Số phòng phân phát:</span>
                                            <span className="font-medium">{Object.keys(order.distributions).filter(room => order.distributions[room] > 0).length} phòng</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Chi tiết phân phát:</span>
                                            <button
                                                className="font-medium text-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
                                                onClick={() => setExpandedDistributionDetails(prev => ({
                                                    ...prev,
                                                    [order.id]: !prev[order.id]
                                                }))}
                                            >
                                                Xem chi tiết ({Object.keys(order.distributions).filter(room => order.distributions[room] > 0).length} phòng)
                                                {expandedDistributionDetails[order.id] ? (
                                                    <ChevronUp className="w-4 h-4 ml-1" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 ml-1" />
                                                )}
                                            </button>
                                        </div>
                                        
                                        {/* Chi tiết phân phối khi được mở */}
                                        {expandedDistributionDetails[order.id] && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="text-sm font-medium text-gray-700 mb-2">Phân phối chi tiết:</div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {Object.entries(order.distributions)
                                                        .filter(([_, quantity]) => quantity > 0)
                                                        .map(([room, quantity]) => (
                                                            <div key={room} className="flex justify-between items-center py-1 px-2 bg-white rounded border border-gray-200">
                                                                <span className="text-gray-700 font-medium">{room}</span>
                                                                <span className="text-blue-600 font-semibold">
                                                                    {formatNumber(quantity.toString())} {order.materialUnit}
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ngày tạo:</span>
                                            <span className="font-medium">{order.createdDate}</span>
                                        </div>
                                    </div>

                                    {order.note && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-700"><strong>Ghi chú:</strong> {order.note}</p>
                                        </div>
                                    )}

                                    {order.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditDistributionModal(order)}
                                                className="flex-1 h-9 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => updateDistributionOrderStatus(order.id, 'completed')}
                                                className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Thành công
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateDistributionOrderStatus(order.id, 'rejected')}
                                                className="flex-1 h-9 text-sm border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                <FileX className="w-4 h-4 mr-1" />
                                                Từ chối
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal chỉnh sửa đơn phân phát */}
                <Dialog open={showEditDistributionModal} onOpenChange={setShowEditDistributionModal}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center">
                                <Edit className="w-6 h-6 mr-2 text-green-600" />
                                Chỉnh sửa đơn phân phát: {editingDistributionOrder?.materialName}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateDistributionOrder} className="space-y-6">
                            <div className="text-base text-gray-600 bg-blue-50 p-4 rounded-lg">
                                Đang chỉnh sửa đơn phân phát cho: <span className="font-bold text-blue-900">{editingDistributionOrder?.materialName}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mockRooms.map((room) => (
                                    <div key={room} className="space-y-3">
                                        <label className="text-base font-semibold text-gray-900">{room}</label>
                                        <Input
                                            type="text"
                                            placeholder="VD: 1,000"
                                            value={distributionData[room] ? formatNumber(distributionData[room].toString()) : ''}
                                            onChange={(e) => {
                                                const numericValue = parseNumber(e.target.value);
                                                setDistributionData(prev => ({
                                                    ...prev,
                                                    [room]: parseInt(numericValue) || 0
                                                }));
                                            }}
                                            className="h-12 text-base"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-base bg-yellow-50 p-4 rounded-lg">
                                Tổng phân phát: <span className="font-bold text-yellow-900">{Object.values(distributionData).reduce((sum, qty) => sum + qty, 0)} {editingDistributionOrder?.materialUnit}</span>
                            </div>
                            <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700">
                                <Edit className="w-5 h-5 mr-2" />
                                Cập nhật đơn phân phát
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default MaterialManagementPage;