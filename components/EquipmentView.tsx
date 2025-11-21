
import React, { useState } from 'react';
import { 
  Monitor, Mic, Speaker, Video, Music, Wifi, Box, 
  Search, Filter, Plus, Wrench, AlertTriangle, CheckCircle, 
  MoreHorizontal, Calendar, DollarSign, MapPin, User, ArrowUpRight
} from 'lucide-react';
import { EquipmentItem, EquipmentCategory, EquipmentStatus } from '../types';

// Mock Data
const MOCK_EQUIPMENT: EquipmentItem[] = [
  { 
    id: 'eq1', name: 'Shure SM58 Microphone', category: 'Audio', serialNumber: 'SH-58-001', 
    purchaseDate: '2022-05-10', cost: 99.00, status: 'Available', location: 'Audio Closet A', 
    condition: 'Good', nextMaintenance: '2024-05-10' 
  },
  { 
    id: 'eq2', name: 'Behringer X32 Mixer', category: 'Audio', serialNumber: 'BH-X32-992', 
    purchaseDate: '2021-08-15', cost: 2400.00, status: 'In Use', location: 'Main Sanctuary Booth', 
    condition: 'Excellent', nextMaintenance: '2023-11-15' 
  },
  { 
    id: 'eq3', name: 'Sony A7III Camera', category: 'Video', serialNumber: 'SNY-A7-445', 
    purchaseDate: '2023-01-20', cost: 1998.00, status: 'In Use', location: 'Main Sanctuary Tripod 1', 
    assignedTo: 'Media Team', condition: 'Excellent' 
  },
  { 
    id: 'eq4', name: 'Nord Stage 3 Keyboard', category: 'Instruments', serialNumber: 'ND-ST3-88', 
    purchaseDate: '2020-11-05', cost: 4500.00, status: 'Maintenance', location: 'Repair Shop', 
    condition: 'Fair', lastMaintenance: '2023-10-25', notes: 'Broken key (middle C)' 
  },
  { 
    id: 'eq5', name: 'Projector - Epson Pro', category: 'Video', serialNumber: 'EPS-L1500', 
    purchaseDate: '2019-03-12', cost: 8000.00, status: 'Available', location: 'Storage Room B', 
    condition: 'Good', nextMaintenance: '2024-01-01' 
  },
  { 
    id: 'eq6', name: 'Drums - DW Collector', category: 'Instruments', serialNumber: 'DW-COL-5pc', 
    purchaseDate: '2018-06-20', cost: 3500.00, status: 'In Use', location: 'Main Sanctuary Stage', 
    condition: 'Good'
  },
  { 
    id: 'eq7', name: 'Admin Laptop - MacBook Pro', category: 'IT', serialNumber: 'APL-MBP-16', 
    purchaseDate: '2023-05-01', cost: 2499.00, status: 'In Use', location: 'Office 102', 
    assignedTo: 'Sarah Smith', condition: 'Excellent' 
  }
];

const CategoryIcon = ({ category }: { category: EquipmentCategory }) => {
  switch (category) {
    case 'Audio': return <Mic className="w-4 h-4" />;
    case 'Video': return <Video className="w-4 h-4" />;
    case 'Lighting': return <Box className="w-4 h-4" />; // Using Box as generic for now, could be Lightbulb if available
    case 'Instruments': return <Music className="w-4 h-4" />;
    case 'IT': return <Wifi className="w-4 h-4" />;
    default: return <Monitor className="w-4 h-4" />;
  }
};

export const EquipmentView: React.FC = () => {
  const [inventory, setInventory] = useState<EquipmentItem[]>(MOCK_EQUIPMENT);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = inventory.reduce((sum, item) => sum + item.cost, 0);
  const maintenanceCount = inventory.filter(i => i.status === 'Maintenance').length;
  const availableCount = inventory.filter(i => i.status === 'Available').length;

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-800';
      case 'In Use': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-amber-100 text-amber-800';
      case 'Retired': return 'bg-slate-100 text-slate-600';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Equipment Inventory</h2>
          <p className="text-slate-500 text-sm">Manage assets, track maintenance, and monitor value.</p>
        </div>
        <button className="flex items-center bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Asset Value</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">${totalValue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
             <ArrowUpRight className="w-4 h-4 mr-1" /> +$4,500 this year
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">In Maintenance</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{maintenanceCount}</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Wrench className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-amber-600 font-medium">
             Requires Action
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Available Items</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{availableCount}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
             Ready for checkout
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Next Audit</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Nov 15</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
             Quarterly check
          </div>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {['All', 'Audio', 'Video', 'Instruments', 'IT'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filterCategory === cat 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4 text-left">Item Name</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Location / Assigned</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Condition</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
                        <CategoryIcon category={item.category} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500 font-mono">SN: {item.serialNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {item.location}
                    </div>
                    {item.assignedTo && (
                      <div className="text-xs text-emerald-600 flex items-center mt-1">
                        <User className="w-3 h-3 mr-1" />
                        {item.assignedTo}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.status === 'Maintenance' && item.notes && (
                      <div className="flex items-center text-xs text-amber-600 mt-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {item.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                     {item.condition}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
