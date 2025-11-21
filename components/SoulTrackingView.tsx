
import React, { useState } from 'react';
import { 
  User, Phone, MessageSquare, Heart, Shield, 
  TrendingUp, BookOpen, Lock, Plus, Search, 
  Filter, ArrowRight, CheckCircle, Calendar,
  MoreHorizontal, AlertCircle, UserCheck, X,
  Briefcase, Loader2, Clock, Mic, Save, ChevronLeft
} from 'lucide-react';
import { Soul, Shepherd, SpiritualMilestone, SoulNote } from '../types';

// Mock Shepherds (Initial State)
const INITIAL_SHEPHERDS: Shepherd[] = [
  { id: 'sh1', name: 'Pastor John', activeSouls: 12 },
  { id: 'sh2', name: 'Elder Sarah', activeSouls: 8 },
  { id: 'sh3', name: 'Deacon Mike', activeSouls: 15 },
];

// Mock Souls (Initial State)
const INITIAL_SOULS: Soul[] = [
  { 
    id: 's1', firstName: 'David', lastName: 'King', phone: '(555) 123-4567', status: 'Growing', 
    spiritualStage: 'Discipleship', assignedShepherdId: 'sh1', lastContactDate: '2023-10-28',
    attendanceRate: 85,
    milestones: [
      { id: 'm1', title: 'Salvation', isCompleted: true, completedDate: '2023-01-15', category: 'Foundation' },
      { id: 'm2', title: 'Water Baptism', isCompleted: true, completedDate: '2023-02-20', category: 'Sacrament' },
      { id: 'm3', title: 'Foundation Class', isCompleted: false, category: 'Foundation' },
      { id: 'm4', title: 'Join Workforce', isCompleted: false, category: 'Service' },
    ],
    notes: [
      { id: 'n1', date: '2023-10-28', content: 'Called to check on family. Doing well.', type: 'Check-up', author: 'Pastor John', isPrivate: false },
      { id: 'n2', date: '2023-10-15', content: 'Struggling with consistency in prayer.', type: 'Confession', author: 'Pastor John', isPrivate: true },
    ]
  },
  { 
    id: 's2', firstName: 'Ruth', lastName: 'Green', phone: '(555) 987-6543', status: 'New Convert', 
    spiritualStage: 'Salvation', assignedShepherdId: 'sh2', lastContactDate: '2023-10-25',
    attendanceRate: 100,
    milestones: [
      { id: 'm1', title: 'Salvation', isCompleted: true, completedDate: '2023-10-01', category: 'Foundation' },
      { id: 'm2', title: 'Water Baptism', isCompleted: false, category: 'Sacrament' },
      { id: 'm3', title: 'Foundation Class', isCompleted: false, category: 'Foundation' },
      { id: 'm4', title: 'Join Workforce', isCompleted: false, category: 'Service' },
    ],
    notes: []
  },
  { 
    id: 's3', firstName: 'Peter', lastName: 'Rock', phone: '(555) 444-3333', status: 'Backslidden', 
    spiritualStage: 'Discipleship', assignedShepherdId: 'sh1', lastContactDate: '2023-09-15',
    attendanceRate: 20,
    milestones: [
      { id: 'm1', title: 'Salvation', isCompleted: true, completedDate: '2022-05-01', category: 'Foundation' },
      { id: 'm2', title: 'Water Baptism', isCompleted: false, category: 'Sacrament' },
      { id: 'm3', title: 'Foundation Class', isCompleted: false, category: 'Foundation' },
      { id: 'm4', title: 'Join Workforce', isCompleted: false, category: 'Service' },
    ],
    notes: [
       { id: 'n1', date: '2023-09-15', content: 'Visited home. He was not around.', type: 'Check-up', author: 'Pastor John', isPrivate: false },
    ]
  }
];

const EMPTY_MILESTONES: SpiritualMilestone[] = [
  { id: 'm1', title: 'Salvation', isCompleted: false, category: 'Foundation' },
  { id: 'm2', title: 'Water Baptism', isCompleted: false, category: 'Sacrament' },
  { id: 'm3', title: 'Foundation Class', isCompleted: false, category: 'Foundation' },
  { id: 'm4', title: 'Join Workforce', isCompleted: false, category: 'Service' },
];

export const SoulTrackingView: React.FC = () => {
  // Main Data State
  const [souls, setSouls] = useState<Soul[]>(INITIAL_SOULS);
  const [shepherds, setShepherds] = useState<Shepherd[]>(INITIAL_SHEPHERDS);

  // View State
  const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL' | 'SHEPHERDS'>('LIST');
  const [selectedSoul, setSelectedSoul] = useState<Soul | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'JOURNEY' | 'NOTES'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [showAddSoulModal, setShowAddSoulModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState<{ type: 'VISIT' | 'PRAYER' | 'TESTIMONY' | 'SMS', title: string } | null>(null);
  const [actionNote, setActionNote] = useState('');

  // Form States
  const [newSoulData, setNewSoulData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    status: 'New Convert' as Soul['status'],
    shepherdId: ''
  });
  
  const [newShepherdName, setNewShepherdName] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);

  // --- Handlers: Navigation & Selection ---

  const handleViewSoul = (soul: Soul) => {
    setSelectedSoul(soul);
    setViewMode('DETAIL');
    setActiveTab('OVERVIEW');
  };

  const handleBackToList = () => {
    setSelectedSoul(null);
    setViewMode('LIST');
  };

  // --- Handlers: Shepherds ---

  const handleAddShepherd = () => {
    if (!newShepherdName.trim()) return;
    const newShepherd: Shepherd = {
      id: `sh${Date.now()}`,
      name: newShepherdName,
      activeSouls: 0
    };
    setShepherds([...shepherds, newShepherd]);
    setNewShepherdName('');
  };

  const handleAssignShepherd = (soulId: string, shepherdId: string) => {
    setSouls(prev => prev.map(s => s.id === soulId ? { ...s, assignedShepherdId: shepherdId } : s));
    
    // Update active counts (simplified logic)
    setShepherds(prev => prev.map(sh => {
      if (sh.id === shepherdId) return { ...sh, activeSouls: sh.activeSouls + 1 };
      // Note: Ideally we'd decrement the old shepherd's count too
      return sh;
    }));

    if (selectedSoul && selectedSoul.id === soulId) {
      setSelectedSoul(prev => prev ? { ...prev, assignedShepherdId: shepherdId } : null);
    }
  };

  // --- Handlers: Souls ---

  const handleAddSoul = (e: React.FormEvent) => {
    e.preventDefault();
    const newSoul: Soul = {
      id: `s${Date.now()}`,
      firstName: newSoulData.firstName,
      lastName: newSoulData.lastName,
      phone: newSoulData.phone,
      status: newSoulData.status,
      spiritualStage: 'Salvation',
      assignedShepherdId: newSoulData.shepherdId || undefined,
      lastContactDate: new Date().toISOString().split('T')[0],
      attendanceRate: 0,
      milestones: [...EMPTY_MILESTONES], // Deep copy
      notes: []
    };

    setSouls([newSoul, ...souls]);
    
    if (newSoulData.shepherdId) {
       setShepherds(prev => prev.map(sh => sh.id === newSoulData.shepherdId ? { ...sh, activeSouls: sh.activeSouls + 1 } : sh));
    }

    setShowAddSoulModal(false);
    setNewSoulData({ firstName: '', lastName: '', phone: '', status: 'New Convert', shepherdId: '' });
  };

  // --- Handlers: Actions & Notes ---

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleQuickActionSubmit = () => {
    if (!selectedSoul || !showActionModal || !actionNote) return;

    const typeMap: Record<string, SoulNote['type']> = {
      'VISIT': 'Check-up',
      'PRAYER': 'Prayer',
      'TESTIMONY': 'General',
      'SMS': 'General'
    };

    const newNote: SoulNote = {
      id: `n${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: showActionModal.type === 'SMS' ? `Sent SMS: "${actionNote}"` : actionNote,
      type: typeMap[showActionModal.type],
      author: 'Me',
      isPrivate: false
    };

    const updatedSoul = {
      ...selectedSoul,
      notes: [newNote, ...selectedSoul.notes],
      lastContactDate: new Date().toISOString().split('T')[0]
    };

    // Update state
    setSouls(prev => prev.map(s => s.id === selectedSoul.id ? updatedSoul : s));
    setSelectedSoul(updatedSoul);
    
    // Reset
    setShowActionModal(null);
    setActionNote('');
    if (showActionModal.type === 'SMS') alert("SMS Sent Successfully!");
    else alert(`${showActionModal.title} Recorded!`);
  };

  const handleAddManualNote = () => {
    if (!selectedSoul || !noteInput.trim()) return;
    const newNote: SoulNote = {
      id: `n${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: noteInput,
      type: 'Check-up',
      author: 'Me',
      isPrivate: isPrivateNote
    };

    const updatedSoul = { ...selectedSoul, notes: [newNote, ...selectedSoul.notes] };
    setSouls(prev => prev.map(s => s.id === selectedSoul.id ? updatedSoul : s));
    setSelectedSoul(updatedSoul);
    setNoteInput('');
    setIsPrivateNote(false);
  };

  const handleToggleMilestone = (soulId: string, milestoneId: string) => {
    const toggler = (s: Soul) => ({
      ...s,
      milestones: s.milestones.map(m => m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted, completedDate: !m.isCompleted ? new Date().toISOString().split('T')[0] : undefined } : m)
    });
    
    setSouls(prev => prev.map(s => s.id === soulId ? toggler(s) : s));
    if (selectedSoul && selectedSoul.id === soulId) {
      setSelectedSoul(prev => prev ? toggler(prev) : null);
    }
  };

  // --- Filter Logic ---
  const filteredSouls = souls.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShepherds = shepherds.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --------------------------------------------------------------------------
  // RENDER: LIST VIEW
  // --------------------------------------------------------------------------
  if (viewMode === 'LIST') {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Track Soul</h2>
            <p className="text-slate-500 text-sm">Monitor spiritual growth, assign shepherds, and care for the flock.</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setViewMode('SHEPHERDS')}
              className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              <span>Shepherds</span>
            </button>
            <button 
              onClick={() => setShowAddSoulModal(true)}
              className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Add New Soul</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm bg-white text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['All Status', 'New Convert', 'Backslidden', 'Growing'].map(filter => (
               <button key={filter} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 whitespace-nowrap bg-white">
                 {filter}
               </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSouls.map(soul => {
            const shepherd = shepherds.find(sh => sh.id === soul.assignedShepherdId);
            return (
              <div key={soul.id} onClick={() => handleViewSoul(soul)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  soul.status === 'New Convert' ? 'bg-blue-500' : 
                  soul.status === 'Backslidden' ? 'bg-red-500' : 
                  'bg-emerald-500'
                }`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200">
                      {soul.firstName[0]}{soul.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{soul.firstName} {soul.lastName}</h3>
                      <p className="text-xs text-slate-500">{soul.status}</p>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Spiritual Stage</span>
                    <span className="font-medium text-slate-800">{soul.spiritualStage}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Shepherd</span>
                    {shepherd ? (
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700">{shepherd.name}</span>
                    ) : (
                      <span className="text-xs text-amber-500 font-medium flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Unassigned</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                   <span className="text-xs text-slate-400">Last Contact: {soul.lastContactDate}</span>
                   <div className="flex space-x-2">
                      <button onClick={(e) => { e.stopPropagation(); handleCall(soul.phone); }} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleViewSoul(soul); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ADD SOUL MODAL */}
        {showAddSoulModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                   <h3 className="text-lg font-bold text-white flex items-center">
                     <UserCheck className="w-5 h-5 mr-2 text-emerald-400" />
                     Add New Soul
                   </h3>
                   <button onClick={() => setShowAddSoulModal(false)} className="text-slate-400 hover:text-white">
                     <X className="w-5 h-5" />
                   </button>
                </div>
                <form onSubmit={handleAddSoul} className="p-6 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                         <input 
                           required type="text" className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
                           value={newSoulData.firstName} onChange={e => setNewSoulData({...newSoulData, firstName: e.target.value})}
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                         <input 
                           required type="text" className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
                           value={newSoulData.lastName} onChange={e => setNewSoulData({...newSoulData, lastName: e.target.value})}
                         />
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                      <input 
                        required type="tel" className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
                        value={newSoulData.phone} onChange={e => setNewSoulData({...newSoulData, phone: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                      <select 
                         className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
                         value={newSoulData.status} 
                         onChange={e => setNewSoulData({...newSoulData, status: e.target.value as Soul['status']})}
                      >
                        <option value="New Convert">New Convert</option>
                        <option value="Growing">Growing</option>
                        <option value="Backslidden">Backslidden</option>
                        <option value="Restored">Restored</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign Shepherd (Optional)</label>
                      <select 
                         className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
                         value={newSoulData.shepherdId} 
                         onChange={e => setNewSoulData({...newSoulData, shepherdId: e.target.value})}
                      >
                        <option value="">-- Select Leader --</option>
                        {shepherds.map(sh => (
                          <option key={sh.id} value={sh.id}>{sh.name} ({sh.activeSouls} active)</option>
                        ))}
                      </select>
                   </div>
                   <div className="pt-4">
                      <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">
                         Register Soul
                      </button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: SHEPHERD DIRECTORY
  // --------------------------------------------------------------------------
  if (viewMode === 'SHEPHERDS') {
    return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex items-center space-x-4 mb-6">
            <button onClick={handleBackToList} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
               <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
               <h2 className="text-2xl font-bold text-slate-800">Shepherd Directory</h2>
               <p className="text-slate-500 text-sm">Manage pastors, leaders, and workers.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Shepherd Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-emerald-600" />
                  Register New Leader
               </h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Leader Name</label>
                     <input 
                        type="text" 
                        placeholder="e.g. Deacon James"
                        className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={newShepherdName}
                        onChange={(e) => setNewShepherdName(e.target.value)}
                     />
                  </div>
                  <button 
                     onClick={handleAddShepherd}
                     disabled={!newShepherdName.trim()}
                     className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50"
                  >
                     Add to Directory
                  </button>
               </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700">Active Shepherds ({filteredShepherds.length})</h3>
                  <div className="relative">
                     <Search className="absolute left-3 top-2 text-slate-400 w-4 h-4" />
                     <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>
               <div className="divide-y divide-slate-100">
                  {filteredShepherds.map(sh => (
                     <div key={sh.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                              {sh.name[0]}
                           </div>
                           <div>
                              <p className="font-bold text-slate-800">{sh.name}</p>
                              <p className="text-xs text-slate-500">Discipling {sh.activeSouls} souls</p>
                           </div>
                        </div>
                        <button className="text-slate-400 hover:text-emerald-600">
                           <MoreHorizontal className="w-5 h-5" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: DETAIL VIEW
  // --------------------------------------------------------------------------
  if (!selectedSoul) return null;

  const assignedShepherd = shepherds.find(s => s.id === selectedSoul.assignedShepherdId);
  const completedMilestones = selectedSoul.milestones.filter(m => m.isCompleted).length;
  const totalMilestones = selectedSoul.milestones.length;
  const progress = Math.round((completedMilestones / Math.max(totalMilestones, 1)) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation */}
      <button onClick={handleBackToList} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-2" /> Back to Soul Directory
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-3xl font-bold border-4 border-white shadow-lg">
            {selectedSoul.firstName[0]}{selectedSoul.lastName[0]}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{selectedSoul.firstName} {selectedSoul.lastName}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                selectedSoul.status === 'Growing' ? 'bg-emerald-100 text-emerald-800' : 
                selectedSoul.status === 'Backslidden' ? 'bg-red-100 text-red-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {selectedSoul.status}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-slate-500">
              <span className="flex items-center"><Phone className="w-4 h-4 mr-1"/> {selectedSoul.phone}</span>
              <span className="flex items-center"><Shield className="w-4 h-4 mr-1"/> {assignedShepherd ? assignedShepherd.name : 'No Shepherd'}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleCall(selectedSoul.phone)} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm font-medium transition-colors">
              <Phone className="w-4 h-4 mr-2" /> Call
            </button>
            <button onClick={() => setShowActionModal({ type: 'SMS', title: 'Send Message' })} className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" /> SMS
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between items-end mb-2">
            <h3 className="font-semibold text-slate-700 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-500" /> Spiritual Journey
            </h3>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{progress}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           {/* Tabs */}
           <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-6 pt-4">
              {['OVERVIEW', 'JOURNEY', 'NOTES'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`mr-8 pb-4 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>

           <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-slate-100 p-6 min-h-[400px]">
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-6">
                   {/* Shepherd Assignment Card */}
                   <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                      <div className="flex items-center">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 mr-3 shadow-sm">
                            <Shield className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-700">Assigned Shepherd</p>
                            <p className="text-sm text-slate-600">{assignedShepherd ? assignedShepherd.name : 'Unassigned'}</p>
                         </div>
                      </div>
                      <div className="relative group">
                         <button className="text-xs font-bold text-emerald-600 hover:underline">Change</button>
                         <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block z-10">
                            <div className="p-2 text-xs text-slate-400 font-bold uppercase bg-slate-50">Select Leader</div>
                            {shepherds.map(sh => (
                              <button key={sh.id} onClick={() => handleAssignShepherd(selectedSoul.id, sh.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">
                                {sh.name}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div>
                      <h4 className="font-bold text-slate-800 mb-3">Recent Notes</h4>
                      <div className="space-y-3">
                         {selectedSoul.notes.slice(0, 3).map(note => (
                            <div key={note.id} className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                               <div className={`mt-1.5 w-2 h-2 rounded-full mr-3 flex-shrink-0 ${note.type === 'Check-up' ? 'bg-blue-500' : note.type === 'Prayer' ? 'bg-purple-500' : 'bg-slate-400'}`}></div>
                               <div>
                                  <p className="text-sm text-slate-800">{note.content}</p>
                                  <p className="text-xs text-slate-400 mt-1">{note.date} • {note.type}</p>
                               </div>
                            </div>
                         ))}
                         {selectedSoul.notes.length === 0 && <p className="text-slate-400 text-sm italic">No activity recorded yet.</p>}
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'JOURNEY' && (
                 <div className="space-y-4">
                    {selectedSoul.milestones.map(milestone => (
                       <div 
                         key={milestone.id} 
                         onClick={() => handleToggleMilestone(selectedSoul.id, milestone.id)}
                         className={`p-4 rounded-xl border flex items-center cursor-pointer transition-all ${
                            milestone.isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200 hover:bg-slate-50'
                         }`}
                       >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                             milestone.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                          }`}>
                             {milestone.isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1">
                             <h5 className={`font-bold ${milestone.isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>{milestone.title}</h5>
                             <span className="text-xs px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">{milestone.category}</span>
                          </div>
                          {milestone.completedDate && <span className="text-xs font-bold text-emerald-600">{milestone.completedDate}</span>}
                       </div>
                    ))}
                 </div>
              )}

              {activeTab === 'NOTES' && (
                 <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <h4 className="font-bold text-slate-700 mb-2">Add Note</h4>
                       <textarea 
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          placeholder="Type your observation or report here..."
                          className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3 h-24 resize-none"
                       />
                       <div className="flex justify-between items-center">
                          <label className="flex items-center cursor-pointer text-sm text-slate-600">
                             <input type="checkbox" className="mr-2" checked={isPrivateNote} onChange={() => setIsPrivateNote(!isPrivateNote)} />
                             <span className={isPrivateNote ? 'text-red-600 font-bold flex items-center' : ''}>
                                {isPrivateNote && <Lock className="w-3 h-3 mr-1" />} Private
                             </span>
                          </label>
                          <button onClick={handleAddManualNote} disabled={!noteInput.trim()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50">
                             Save Note
                          </button>
                       </div>
                    </div>
                    <div className="space-y-4">
                       {selectedSoul.notes.map(note => (
                          <div key={note.id} className={`p-4 rounded-xl border ${note.isPrivate ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
                             <div className="flex justify-between mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                                   note.type === 'Prayer' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'
                                }`}>{note.type}</span>
                                <span className="text-xs text-slate-400">{note.date}</span>
                             </div>
                             <p className="text-slate-800 text-sm">{note.content}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* Right Sidebar (Quick Actions) */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                 <button 
                    onClick={() => setShowActionModal({ type: 'VISIT', title: 'Schedule Visit' })}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-100 hover:border-emerald-200 transition-all group"
                 >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">Schedule Visit</span>
                    <Calendar className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                 </button>
                 <button 
                    onClick={() => setShowActionModal({ type: 'TESTIMONY', title: 'Record Testimony' })}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-all group"
                 >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Share Testimony</span>
                    <Mic className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                 </button>
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center mb-4">
                 <Heart className="w-5 h-5 text-pink-400 mr-2" />
                 <h3 className="font-bold">Prayer Focus</h3>
              </div>
              <p className="text-sm text-indigo-200 italic mb-4">"Pray without ceasing." - 1 Thess 5:17</p>
              <button 
                onClick={() => setShowActionModal({ type: 'PRAYER', title: 'Log Prayer Request' })}
                className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-bold transition-colors"
              >
                 Add Prayer Request
              </button>
           </div>
        </div>
      </div>

      {/* GENERIC ACTION MODAL */}
      {showActionModal && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
               <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">{showActionModal.title}</h3>
                  <button onClick={() => setShowActionModal(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="p-6 space-y-4">
                  <p className="text-sm text-slate-500">
                     {showActionModal.type === 'VISIT' ? 'Enter details for the upcoming visit:' :
                      showActionModal.type === 'SMS' ? 'Draft your message below:' : 
                      `Record the ${showActionModal.type.toLowerCase()} details below:`}
                  </p>
                  <textarea 
                     className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 h-32 resize-none"
                     placeholder="Type here..."
                     value={actionNote}
                     onChange={(e) => setActionNote(e.target.value)}
                     autoFocus
                  />
                  <button 
                     onClick={handleQuickActionSubmit}
                     disabled={!actionNote.trim()}
                     className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                     {showActionModal.type === 'SMS' ? 'Send Message' : 'Save Record'}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
