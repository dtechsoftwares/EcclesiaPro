
import React, { useState } from 'react';
import { 
  Users, UserPlus, TrendingUp, Calendar, Search, 
  Filter, Phone, Mail, ArrowRight, CheckCircle, 
  Clock, MoreHorizontal, MessageSquare 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Visitor } from '../types';
import { draftSmsContent } from '../services/geminiService';

const mockVisitors: Visitor[] = [
  { 
    id: 'v1', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', phone: '(555) 123-4567', 
    visitDate: '2023-10-29', status: 'New', source: 'Website', assignedTo: 'Sarah Smith', followUpStatus: 'Pending' 
  },
  { 
    id: 'v2', firstName: 'Bob', lastName: 'Williams', email: 'bob@example.com', phone: '(555) 234-5678', 
    visitDate: '2023-10-29', status: 'New', source: 'Friend', assignedTo: 'John Doe', followUpStatus: 'Pending' 
  },
  { 
    id: 'v3', firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', phone: '(555) 345-6789', 
    visitDate: '2023-10-22', status: 'Follow-up', source: 'Event', assignedTo: 'Sarah Smith', followUpStatus: 'Overdue' 
  },
  { 
    id: 'v4', firstName: 'Diana', lastName: 'Miller', email: 'diana@example.com', phone: '(555) 456-7890', 
    visitDate: '2023-10-15', status: 'Converted', source: 'Website', assignedTo: 'Pastor John', followUpStatus: 'Completed' 
  },
  { 
    id: 'v5', firstName: 'Evan', lastName: 'Wilson', email: 'evan@example.com', phone: '(555) 567-8901', 
    visitDate: '2023-10-08', status: 'Cold', source: 'Walk-in', assignedTo: 'Unassigned', followUpStatus: 'Pending' 
  },
];

const visitorTrends = [
  { name: 'Aug', visitors: 24 },
  { name: 'Sep', visitors: 35 },
  { name: 'Oct', visitors: 42 },
  { name: 'Nov', visitors: 28 }, // Current partial month
];

export const VisitorsView: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [aiMessage, setAiMessage] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredVisitors = visitors.filter(v => 
    v.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDraftFollowUp = async (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setLoadingAi(true);
    const msg = await draftSmsContent(
      `Thanks for visiting last Sunday. We'd love to see you again.`, 
      visitor.firstName
    );
    setAiMessage(msg);
    setLoadingAi(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Follow-up': return 'bg-yellow-100 text-yellow-800';
      case 'Converted': return 'bg-emerald-100 text-emerald-800';
      case 'Cold': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visitor Management</h2>
          <p className="text-slate-500 text-sm">Track first-time guests and manage follow-ups.</p>
        </div>
        <button className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
          <UserPlus className="w-4 h-4 mr-2" />
          <span>Register Visitor</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Visitors (Oct)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">42</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-500 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" /> +12% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">18%</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Visitors becoming members
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Follow-ups</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">8</h3>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-red-500 font-medium">
             2 Overdue
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Retention</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">3.2 wks</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
             Visits before joining
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-semibold text-slate-800">Visitor Directory</h3>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search name..." 
                  className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 bg-white text-slate-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 bg-white">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Visit Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Assigned To</th>
                  <th className="px-6 py-3 text-left">Follow-up</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{visitor.firstName} {visitor.lastName}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                         {visitor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{visitor.visitDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(visitor.status)}`}>
                        {visitor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                       {visitor.assignedTo || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4">
                       {visitor.followUpStatus === 'Pending' && <span className="text-xs text-yellow-600 font-medium flex items-center"><Clock className="w-3 h-3 mr-1"/> Pending</span>}
                       {visitor.followUpStatus === 'Overdue' && <span className="text-xs text-red-600 font-medium flex items-center"><Clock className="w-3 h-3 mr-1"/> Overdue</span>}
                       {visitor.followUpStatus === 'Completed' && <span className="text-xs text-emerald-600 font-medium flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Done</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDraftFollowUp(visitor)}
                          className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100" 
                          title="Quick Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Trends & Quick Actions */}
        <div className="space-y-6">
          {/* AI Action Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-emerald-400" />
              Follow-up Assistant
            </h3>
            {selectedVisitor ? (
               <div className="animate-fade-in">
                  <p className="text-xs text-slate-300 mb-3">Drafting for <span className="font-bold text-white">{selectedVisitor.firstName}</span>:</p>
                  {loadingAi ? (
                    <div className="h-24 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                       <span className="text-sm text-slate-300 animate-pulse">Generating warm welcome...</span>
                    </div>
                  ) : (
                    <>
                      <textarea 
                        value={aiMessage}
                        onChange={(e) => setAiMessage(e.target.value)}
                        className="w-full bg-white border border-transparent rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3 h-24 resize-none"
                        placeholder="Message draft..."
                      />
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-bold transition-colors">
                          Send SMS
                        </button>
                         <button onClick={() => setSelectedVisitor(null)} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
               </div>
            ) : (
              <div>
                <p className="text-slate-300 text-sm mb-4">Select a visitor from the list to draft a personalized follow-up message instantly.</p>
                <div className="p-3 bg-white/5 rounded-lg border border-dashed border-white/10 text-center text-xs text-slate-400">
                   No visitor selected
                </div>
              </div>
            )}
          </div>

          {/* Growth Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-semibold text-slate-800 mb-4">Visitor Growth</h3>
             <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitorTrends}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisitors)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
