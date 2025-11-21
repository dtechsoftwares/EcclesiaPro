
import React, { useState, useRef } from 'react';
import { 
  Search, Filter, MoreHorizontal, UserPlus, Mail, Phone, 
  ArrowLeft, Camera, Save, FileText, Upload, Trash2, Plus,
  MapPin, Calendar, Shield, Download, X, AlertCircle, Check, User,
  GitCommit, Clock, CheckCircle, ArrowRightCircle, RefreshCw, Loader2
} from 'lucide-react';
import { Member, MemberDocument, CustomField, EmergencyContact, MemberStatus, LifecycleEvent, OnboardingTask } from '../types';

// Default Onboarding Template
const DEFAULT_ONBOARDING_TASKS: OnboardingTask[] = [
  { id: 't1', label: 'First Visit Welcome', completed: false },
  { id: 't2', label: 'Pastor Introduction', completed: false },
  { id: 't3', label: 'Membership Class (101)', completed: false },
  { id: 't4', label: 'Signed Statement of Faith', completed: false },
  { id: 't5', label: 'Baptism Verification', completed: false },
  { id: 't6', label: 'Right Hand of Fellowship', completed: false },
];

// Extended Mock Data
const mockMembers: Member[] = [
  { 
    id: '1', 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john@example.com', 
    phone: '(555) 123-4567', 
    address: '123 Grace Ave, Springfield, IL 62704',
    status: 'Active', 
    joinDate: '2022-01-15', 
    avatar: 'https://picsum.photos/id/1005/200/200',
    emergencyContact: { name: 'Jane Doe', relation: 'Spouse', phone: '(555) 999-8888' },
    customFields: [{ id: 'cf1', label: 'Baptism Date', value: '2022-02-20' }],
    documents: [
      { id: 'd1', name: 'Membership_Agreement.pdf', type: 'PDF', date: '2022-01-15', size: '2.4 MB' },
      { id: 'd2', name: 'Baptism_Certificate.jpg', type: 'IMAGE', date: '2022-02-20', size: '1.1 MB' }
    ],
    lifecycleEvents: [
      { id: 'e1', date: '2022-01-15', type: 'Status Change', description: 'Status changed from New to Active', metadata: 'Joined' },
      { id: 'e2', date: '2023-01-15', type: 'Renewal', description: 'Annual Membership Renewal confirmed' }
    ],
    onboardingTasks: DEFAULT_ONBOARDING_TASKS.map(t => ({ ...t, completed: true, completedDate: '2022-01-15' })),
    lastRenewalDate: '2023-01-15'
  },
  { 
    id: '2', 
    firstName: 'Sarah', 
    lastName: 'Smith', 
    email: 'sarah@example.com', 
    phone: '(555) 987-6543', 
    address: '456 Hope St, Springfield, IL 62704',
    status: 'New', 
    joinDate: '2023-11-20', 
    avatar: 'https://picsum.photos/id/1011/200/200',
    emergencyContact: { name: 'Robert Smith', relation: 'Father', phone: '(555) 111-2222' },
    customFields: [],
    documents: [],
    lifecycleEvents: [
      { id: 'e1', date: '2023-11-20', type: 'Status Change', description: 'Profile created as New Visitor' }
    ],
    onboardingTasks: DEFAULT_ONBOARDING_TASKS.map((t, i) => i === 0 ? { ...t, completed: true, completedDate: '2023-11-20' } : t)
  },
  { 
    id: '3', 
    firstName: 'Michael', 
    lastName: 'Brown', 
    email: 'mike@example.com', 
    phone: '(555) 456-7890', 
    address: '789 Faith Blvd, Springfield, IL 62704',
    status: 'Inactive', 
    joinDate: '2021-06-10', 
    avatar: 'https://picsum.photos/id/1012/200/200',
    emergencyContact: { name: 'Lisa Brown', relation: 'Sister', phone: '(555) 333-4444' },
    customFields: [{ id: 'cf2', label: 'Ministry Interest', value: 'Choir' }],
    documents: [],
    lifecycleEvents: [
        { id: 'e1', date: '2021-06-10', type: 'Status Change', description: 'Joined as Active Member' },
        { id: 'e2', date: '2023-05-01', type: 'Status Change', description: 'Changed to Inactive due to relocation' }
    ],
    onboardingTasks: DEFAULT_ONBOARDING_TASKS
  },
];

const emptyMember: Member = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  status: 'New',
  joinDate: new Date().toISOString().split('T')[0],
  avatar: '', 
  emergencyContact: { name: '', relation: '', phone: '' },
  customFields: [],
  documents: [],
  lifecycleEvents: [],
  onboardingTasks: DEFAULT_ONBOARDING_TASKS
};

export const MembersView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewMember = (member: Member) => {
    setSelectedMemberId(member.id);
    setViewMode('DETAIL');
  };

  const handleCreateMember = () => {
    setSelectedMemberId(null); // Null ID indicates new member
    setViewMode('DETAIL');
  };

  const handleSaveMember = (updatedMember: Member) => {
    if (selectedMemberId) {
      // Update existing
      setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    } else {
      // Create new
      const newMember = { ...updatedMember, id: Math.random().toString(36).substr(2, 9) };
      // Add initial creation event
      newMember.lifecycleEvents.push({
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        type: 'Status Change',
        description: 'Profile Created'
      });
      setMembers(prev => [newMember, ...prev]);
    }
    setViewMode('LIST');
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
      setViewMode('LIST');
    }
  };

  const selectedMember = selectedMemberId 
    ? members.find(m => m.id === selectedMemberId) 
    : emptyMember;

  if (viewMode === 'DETAIL' && selectedMember) {
    return (
      <MemberDetailView 
        member={selectedMember} 
        isNew={!selectedMemberId}
        onBack={() => setViewMode('LIST')} 
        onSave={handleSaveMember}
        onDelete={selectedMemberId ? () => handleDeleteMember(selectedMemberId) : undefined}
      />
    );
  }

  const filteredMembers = members.filter(m => 
    m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Onboarding': return 'bg-purple-100 text-purple-800';
      case 'Transferred': return 'bg-amber-100 text-amber-800';
      case 'Inactive': return 'bg-slate-100 text-slate-800';
      case 'Under Discipline': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Member Directory</h2>
          <p className="text-slate-500 text-sm">Manage profiles, roles, and membership status.</p>
        </div>
        <button 
          onClick={handleCreateMember}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search members by name..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-sm">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr 
                  key={member.id} 
                  onClick={() => handleViewMember(member)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      {member.avatar ? (
                         <img src={member.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:border-emerald-400 transition-colors" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200 group-hover:border-emerald-400 transition-colors">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-slate-500">ID: #{member.id.padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-3 h-3 mr-2 text-slate-400" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-3 h-3 mr-2 text-slate-400" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-emerald-600 p-2 rounded-full hover:bg-slate-100">
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

// ----------------------------------------------------------------------
// Detail View Component
// ----------------------------------------------------------------------

interface DetailViewProps {
  member: Member;
  isNew: boolean;
  onBack: () => void;
  onSave: (member: Member) => void;
  onDelete?: () => void;
}

const MemberDetailView: React.FC<DetailViewProps> = ({ member, isNew, onBack, onSave, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'DOCUMENTS' | 'LIFECYCLE'>('PROFILE');
  const [isEditing, setIsEditing] = useState(isNew); 
  const [formData, setFormData] = useState<Member>(member);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Handlers for form inputs
  const handleChange = (field: keyof Member, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (newStatus: MemberStatus) => {
    if (newStatus === formData.status) return;
    
    const event: LifecycleEvent = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      type: 'Status Change',
      description: `Status updated from ${formData.status} to ${newStatus}`,
    };

    setFormData(prev => ({
      ...prev,
      status: newStatus,
      lifecycleEvents: [event, ...prev.lifecycleEvents]
    }));
  };

  const handleEmergencyChange = (field: keyof EmergencyContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  const handleCustomFieldChange = (id: string, key: 'label' | 'value', newVal: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.map(f => f.id === id ? { ...f, [key]: newVal } : f)
    }));
  };

  const addCustomField = (label = 'New Field') => {
    const newField: CustomField = {
      id: Math.random().toString(36).substr(2, 9),
      label,
      value: ''
    };
    setFormData(prev => ({ ...prev, customFields: [...prev.customFields, newField] }));
  };

  const removeCustomField = (id: string) => {
    setFormData(prev => ({ ...prev, customFields: prev.customFields.filter(f => f.id !== id) }));
  };

  const toggleOnboardingTask = (taskId: string) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      onboardingTasks: prev.onboardingTasks.map(t => {
        if (t.id === taskId) {
          const isCompleted = !t.completed;
          return { ...t, completed: isCompleted, completedDate: isCompleted ? new Date().toISOString().split('T')[0] : undefined };
        }
        return t;
      })
    }));
  };

  const handleRenewal = () => {
    const today = new Date().toISOString().split('T')[0];
    const event: LifecycleEvent = {
      id: Math.random().toString(36).substr(2, 9),
      date: today,
      type: 'Renewal',
      description: 'Membership Renewed',
    };
    setFormData(prev => ({
      ...prev,
      lastRenewalDate: today,
      lifecycleEvents: [event, ...prev.lifecycleEvents]
    }));
    alert('Membership Renewed!');
  };

  const handleTransfer = () => {
     const dest = prompt("Enter the name of the church transferring to/from:");
     if (!dest) return;
     const event: LifecycleEvent = {
       id: Math.random().toString(36).substr(2, 9),
       date: new Date().toISOString().split('T')[0],
       type: 'Transfer',
       description: `Transfer initiated: ${dest}`,
     };
      setFormData(prev => ({
      ...prev,
      status: 'Transferred',
      lifecycleEvents: [event, ...prev.lifecycleEvents]
    }));
  };

  // Mock File Uploads
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: MemberDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };
      setFormData(prev => ({ ...prev, documents: [...prev.documents, newDoc] }));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName) {
      alert("First Name and Last Name are required.");
      return;
    }
    setIsSaving(true);
    // Simulate async save
    setTimeout(() => {
      onSave(formData);
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const hasAvatar = Boolean(formData.avatar && formData.avatar !== '');

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleDocumentUpload} 
      />
       <input 
        type="file" 
        ref={photoInputRef} 
        accept="image/*"
        className="hidden" 
        onChange={handleAvatarUpload} 
      />

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Directory
        </button>
        <div className="flex space-x-3">
          {isEditing ? (
             <>
              <button 
                onClick={() => {
                  if (isNew) onBack();
                  else {
                    setFormData(member); // Reset
                    setIsEditing(false);
                  }
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isNew ? 'Create Member' : 'Save Changes'}
                  </>
                )}
              </button>
             </>
          ) : (
            <>
              {onDelete && (
                <button 
                  onClick={onDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              )}
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-500 to-green-600 z-0"></div>
            
            <div className="relative z-10 mt-12">
              <div className="relative inline-block group">
                <div 
                  className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-slate-50 
                    ${isEditing ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                  onClick={() => isEditing && photoInputRef.current?.click()}
                >
                  {hasAvatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      {formData.firstName || formData.lastName ? (
                         <span className="text-3xl font-bold text-slate-400 uppercase">
                            {(formData.firstName?.[0] || '')}{(formData.lastName?.[0] || '')}
                         </span>
                      ) : (
                         <User className="w-12 h-12 mb-1 opacity-50" />
                      )}
                      {isEditing && !hasAvatar && <span className="text-[10px] font-semibold uppercase tracking-wider mt-1 text-emerald-600">Add Photo</span>}
                    </div>
                  )}

                  {/* Overlay for changing existing photo */}
                  {isEditing && hasAvatar && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-xs text-white font-medium">Change</span>
                    </div>
                  )}
                </div>
                
                {/* Floating Upload Button */}
                {isEditing && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      photoInputRef.current?.click();
                    }}
                    className="absolute bottom-1 right-1 p-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-700 shadow-lg transition-colors z-20 border-2 border-white"
                    title="Upload Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}` : 'New Member'}
              </h2>
              <p className="text-slate-500 text-sm">Member since {new Date(formData.joinDate).getFullYear()}</p>
              
              <div className="mt-4 flex justify-center space-x-2">
                {isEditing ? (
                  <select 
                    className="text-xs px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.status}
                    onChange={(e) => handleStatusChange(e.target.value as MemberStatus)}
                  >
                    <option value="Active">Active</option>
                    <option value="New">New</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Under Discipline">Under Discipline</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${formData.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                      formData.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                      formData.status === 'Onboarding' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'}`}>
                    {formData.status}
                  </span>
                )}
              </div>

              <div className="mt-8 flex justify-center space-x-4 border-t border-slate-100 pt-6">
                <button className="flex flex-col items-center text-slate-500 hover:text-emerald-600 transition-colors">
                  <div className="p-2 bg-slate-50 rounded-full mb-1 hover:bg-emerald-50">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xs">Email</span>
                </button>
                 <button className="flex flex-col items-center text-slate-500 hover:text-emerald-600 transition-colors">
                  <div className="p-2 bg-slate-50 rounded-full mb-1 hover:bg-emerald-50">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-xs">Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats or Info */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 shadow-lg">
             <h3 className="text-white font-semibold mb-4 flex items-center">
               <Shield className="w-4 h-4 mr-2 text-emerald-400" />
               Administrative Notes
             </h3>
             <div className="space-y-3 text-sm">
               <div className="flex justify-between">
                 <span>Attendance Rate</span>
                 <span className="text-white">--</span>
               </div>
               <div className="flex justify-between">
                 <span>Last Renewal</span>
                 <span className="text-white">{formData.lastRenewalDate || 'N/A'}</span>
               </div>
               <div className="flex justify-between">
                 <span>Volunteer Group</span>
                 <span className="text-white">None</span>
               </div>
             </div>
          </div>
        </div>

        {/* Right Content: Details */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex space-x-6 border-b border-slate-200 mb-6 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('PROFILE')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'PROFILE' 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Profile Details
            </button>
            <button 
              onClick={() => setActiveTab('LIFECYCLE')}
               className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'LIFECYCLE' 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Membership Lifecycle
            </button>
            <button 
              onClick={() => setActiveTab('DOCUMENTS')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'DOCUMENTS' 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Documents & Files
            </button>
          </div>

          {activeTab === 'PROFILE' && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-emerald-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">First Name *</label>
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Last Name *</label>
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email Address</label>
                    <input 
                      disabled={!isEditing}
                      type="email" 
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Phone Number</label>
                    <input 
                      disabled={!isEditing}
                      type="tel" 
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Home Address</label>
                    <div className="relative">
                      <MapPin className="absolute top-3 left-3 w-4 h-4 text-slate-400" />
                      <textarea 
                        disabled={!isEditing}
                        rows={2}
                        className="w-full pl-10 p-2 border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 resize-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-500" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Contact Name</label>
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      value={formData.emergencyContact?.name || ''}
                      onChange={(e) => handleEmergencyChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Relation</label>
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      value={formData.emergencyContact?.relation || ''}
                      onChange={(e) => handleEmergencyChange('relation', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Emergency Phone</label>
                    <input 
                      disabled={!isEditing}
                      type="tel" 
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                      value={formData.emergencyContact?.phone || ''}
                      onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-purple-500" />
                    Custom Fields
                  </h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                       <div className="hidden md:flex space-x-1 mr-2">
                         {['Baptism Date', 'Ministry', 'Marital Status'].map(suggestion => (
                           <button 
                              key={suggestion}
                              onClick={() => addCustomField(suggestion)}
                              className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                           >
                             + {suggestion}
                           </button>
                         ))}
                       </div>
                       <button onClick={() => addCustomField()} className="text-xs flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                        <Plus className="w-3 h-3 mr-1" /> Add Custom
                      </button>
                    </div>
                  )}
                </div>
                
                {formData.customFields.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <p className="text-sm text-slate-400">No custom fields configured.</p>
                    {isEditing && <p className="text-xs text-slate-400 mt-1">Add fields like "Baptism Date" or "Ministry Interest"</p>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.customFields.map((field) => (
                      <div key={field.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <input 
                          disabled={!isEditing}
                          type="text"
                          className="w-1/3 bg-transparent text-xs font-semibold text-slate-500 uppercase focus:outline-none border-b border-transparent focus:border-emerald-300"
                          value={field.label}
                          onChange={(e) => handleCustomFieldChange(field.id, 'label', e.target.value)}
                        />
                        <input 
                          disabled={!isEditing}
                          type="text"
                          className="flex-1 bg-white p-1 border border-slate-200 rounded text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange(field.id, 'value', e.target.value)}
                        />
                        {isEditing && (
                          <button onClick={() => removeCustomField(field.id)} className="text-slate-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'LIFECYCLE' && (
            <div className="space-y-6">
               {/* Onboarding Tracker */}
               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                      New Member Onboarding
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                       {Math.round((formData.onboardingTasks.filter(t => t.completed).length / Math.max(formData.onboardingTasks.length, 1)) * 100)}% Complete
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div 
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${(formData.onboardingTasks.filter(t => t.completed).length / Math.max(formData.onboardingTasks.length, 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.onboardingTasks.map(task => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleOnboardingTask(task.id)}
                        className={`p-3 rounded-lg border flex items-start space-x-3 transition-all 
                          ${isEditing ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'}
                          ${task.completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200'}
                        `}
                      >
                         <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}
                         `}>
                            {task.completed && <Check className="w-3 h-3 text-white" />}
                         </div>
                         <div>
                           <p className={`text-sm font-medium ${task.completed ? 'text-slate-800' : 'text-slate-500'}`}>{task.label}</p>
                           {task.completed && <p className="text-xs text-emerald-600 mt-1">Completed: {task.completedDate}</p>}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Lifecycle Actions */}
               {isEditing && (
                 <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <GitCommit className="w-5 h-5 mr-2 text-blue-500" />
                      Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                       <button 
                          onClick={handleRenewal}
                          className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors text-sm font-medium"
                       >
                         <RefreshCw className="w-4 h-4 mr-2" />
                         Renew Membership
                       </button>
                       <button 
                         onClick={handleTransfer}
                         className="flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors text-sm font-medium"
                       >
                         <ArrowRightCircle className="w-4 h-4 mr-2" />
                         Transfer Out
                       </button>
                    </div>
                 </div>
               )}

               {/* Status Timeline */}
               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-slate-400" />
                    Status History & Timeline
                  </h3>
                  
                  <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pl-8 pb-2">
                    {formData.lifecycleEvents && formData.lifecycleEvents.length > 0 ? (
                      formData.lifecycleEvents.map(event => (
                        <div key={event.id} className="relative">
                           <div className={`absolute -left-[41px] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center
                             ${event.type === 'Status Change' ? 'bg-blue-500' : 
                               event.type === 'Renewal' ? 'bg-green-500' : 'bg-slate-400'}
                           `}></div>
                           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                              <div className="flex justify-between items-start mb-1">
                                 <span className="font-bold text-slate-800 text-sm">{event.type}</span>
                                 <span className="text-xs text-slate-500 font-mono">{event.date}</span>
                              </div>
                              <p className="text-slate-600 text-sm">{event.description}</p>
                              {event.metadata && <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-200">{event.metadata}</p>}
                           </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm italic">No history recorded yet.</p>
                    )}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-6">
              {/* Documents Tab */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Member Documents</h3>
                    <p className="text-sm text-slate-500">Certificates, agreements, and other files.</p>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </button>
                </div>

                {formData.documents.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No documents attached yet</p>
                    <p className="text-xs text-slate-400 mt-1">Upload PDF, JPG, or PNG files (Max 10MB)</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors group bg-white shadow-sm">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setFormData(prev => ({...prev, documents: prev.documents.filter(d => d.id !== doc.id)}))}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
