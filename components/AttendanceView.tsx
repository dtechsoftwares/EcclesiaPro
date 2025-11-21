
import React, { useState, useEffect } from 'react';
import { 
  Calendar, QrCode, Smartphone, Users, Clock, 
  CheckCircle, AlertCircle, Search, ArrowRight, 
  MoreHorizontal, UserX, Send, Plus
} from 'lucide-react';
import { AttendanceSession, AttendanceRecord } from '../types';
import { draftSmsContent } from '../services/geminiService';

// Mock Data for Attendance
const MOCK_SESSIONS: AttendanceSession[] = [
  { id: 's1', date: '2023-10-29', serviceName: 'Sunday Morning Service', attendees: 142, visitors: 8, status: 'Completed' },
  { id: 's2', date: '2023-10-22', serviceName: 'Sunday Morning Service', attendees: 135, visitors: 5, status: 'Completed' },
  { id: 's3', date: '2023-10-15', serviceName: 'Sunday Morning Service', attendees: 128, visitors: 12, status: 'Completed' },
];

// Mock Member DB for lookup
const MOCK_MEMBERS_DB = [
  { id: '1', name: 'John Doe', avatar: 'https://picsum.photos/id/1005/200/200', status: 'Active' },
  { id: '2', name: 'Sarah Smith', avatar: 'https://picsum.photos/id/1011/200/200', status: 'Active' },
  { id: '3', name: 'Michael Brown', avatar: 'https://picsum.photos/id/1012/200/200', status: 'Inactive' },
  { id: '4', name: 'Emily Davis', avatar: '', status: 'Active' },
  { id: '5', name: 'David Wilson', avatar: '', status: 'Active' },
];

export const AttendanceView: React.FC = () => {
  const [mode, setMode] = useState<'DASHBOARD' | 'KIOSK' | 'REPORT'>('DASHBOARD');
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<AttendanceRecord[]>([]);
  const [checkInSearch, setCheckInSearch] = useState('');
  const [absenceMessage, setAbsenceMessage] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Generate simulated check-ins when a session starts
  useEffect(() => {
    if (activeSession) {
      setRecentCheckIns([
        { id: 'r1', memberId: '1', memberName: 'John Doe', avatar: 'https://picsum.photos/id/1005/200/200', checkInTime: '08:45 AM', method: 'Mobile', status: 'Present' },
        { id: 'r2', memberId: '2', memberName: 'Sarah Smith', avatar: 'https://picsum.photos/id/1011/200/200', checkInTime: '08:50 AM', method: 'QR', status: 'Present' },
      ]);
    }
  }, [activeSession]);

  const handleStartSession = () => {
    const newSession: AttendanceSession = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      serviceName: 'Sunday Service',
      attendees: 0,
      visitors: 0,
      status: 'Active'
    };
    setActiveSession(newSession);
    setMode('KIOSK');
  };

  const handleManualCheckIn = (member: typeof MOCK_MEMBERS_DB[0]) => {
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      memberId: member.id,
      memberName: member.name,
      avatar: member.avatar,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: 'Manual',
      status: 'Present'
    };
    setRecentCheckIns(prev => [newRecord, ...prev]);
    setCheckInSearch('');
  };

  const handleGenerateAbsenceMsg = async () => {
    setLoadingAi(true);
    const msg = await draftSmsContent('We missed you at church today', 'Absent Members');
    setAbsenceMessage(msg);
    setLoadingAi(false);
  };

  // ---------------------------------------------------------------------------
  // KIOSK MODE (Live Check-in)
  // ---------------------------------------------------------------------------
  if (mode === 'KIOSK' && activeSession) {
    const filteredMembers = MOCK_MEMBERS_DB.filter(m => 
      m.name.toLowerCase().includes(checkInSearch.toLowerCase()) &&
      !recentCheckIns.find(r => r.memberId === m.id) // Exclude already checked in
    );

    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in">
        {/* Kiosk Header */}
        <div className="bg-slate-800 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Live Check-in</h2>
              <p className="text-slate-400 text-sm">{activeSession.serviceName} • {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <button 
            onClick={() => setMode('DASHBOARD')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            End Session
          </button>
        </div>

        {/* Kiosk Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left: Input Area */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-center items-center border-r border-slate-700/50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6">
              <h3 className="text-2xl font-bold text-slate-800">Scan to Check In</h3>
              
              {/* QR Code Simulation */}
              <div className="bg-white border-2 border-slate-100 p-4 rounded-xl inline-block">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EcclesiaCheckIn" 
                  alt="Check-in QR" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                <Smartphone className="w-4 h-4" />
                <span>Open Camera or Church App</span>
              </div>

              <div className="relative w-full pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">Or Search Name</p>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    placeholder="Type member name..."
                    value={checkInSearch}
                    onChange={(e) => setCheckInSearch(e.target.value)}
                  />
                </div>
                {checkInSearch && (
                  <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-48 overflow-y-auto z-10">
                    {filteredMembers.map(m => (
                      <button 
                        key={m.id}
                        onClick={() => handleManualCheckIn(m)}
                        className="w-full p-3 text-left hover:bg-emerald-50 flex items-center space-x-3 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                          {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : <span className="text-xs font-bold">{m.name[0]}</span>}
                        </div>
                        <span className="text-slate-800 font-medium">{m.name}</span>
                      </button>
                    ))}
                    {filteredMembers.length === 0 && (
                      <div className="p-3 text-sm text-slate-400">No member found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Live Feed */}
          <div className="lg:w-1/2 bg-slate-800/50 p-8 overflow-hidden flex flex-col">
             <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-white">Live Activity</h3>
                <div className="text-emerald-400 font-mono text-3xl font-bold">
                  {recentCheckIns.length} <span className="text-sm text-slate-400 font-normal">Checked In</span>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                {recentCheckIns.map((record) => (
                  <div key={record.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between animate-fade-in-up">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 overflow-hidden bg-slate-700 flex items-center justify-center">
                         {record.avatar ? (
                           <img src={record.avatar} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-white font-bold">{record.memberName[0]}</span>
                         )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg">{record.memberName}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <span>{record.checkInTime}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            {record.method === 'QR' ? <QrCode className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                            {record.method}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-emerald-500/20 p-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ABSENCE REPORT MODE
  // ---------------------------------------------------------------------------
  if (mode === 'REPORT') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => setMode('DASHBOARD')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 rotate-180 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Absence Report</h2>
            <p className="text-slate-500 text-sm">Identify and follow up with missing members.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Absent Members */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Absent Last 2 Weeks</h3>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">3 Members</span>
            </div>
            <div className="divide-y divide-slate-100">
              {MOCK_MEMBERS_DB.slice(2, 5).map(member => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-500">Last seen: 3 weeks ago</p>
                      </div>
                   </div>
                   <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                     View Profile
                   </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <UserX className="w-5 h-5 mr-2 text-red-400" />
                  Re-engagement Action
                </h3>
                <p className="text-slate-300 text-sm mb-4">Draft a warm message to checking on absent members.</p>
                
                {absenceMessage ? (
                  <div className="bg-white/10 p-3 rounded-lg mb-4">
                    <p className="text-xs text-slate-200 italic">"{absenceMessage}"</p>
                  </div>
                ) : (
                  <button 
                    onClick={handleGenerateAbsenceMsg}
                    disabled={loadingAi}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors mb-4"
                  >
                    {loadingAi ? "Generating..." : "Draft with AI"}
                  </button>
                )}

                <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Send className="w-4 h-4 mr-2" />
                  Send SMS Blast
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD MODE (Default)
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance System</h2>
          <p className="text-slate-500 text-sm">Track services, manage check-ins, and analyze growth.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setMode('REPORT')}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            <UserX className="w-4 h-4 mr-2 text-red-500" />
            <span>Absences</span>
          </button>
          <button 
            onClick={handleStartSession}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Start Check-in</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Avg. Attendance</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">135</h3>
            <p className="text-green-600 text-xs mt-1 font-medium flex items-center">
              <ArrowRight className="w-3 h-3 rotate-[-45deg] mr-1" /> +5% vs last month
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
           <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Retention Rate</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">92%</h3>
            <p className="text-slate-400 text-xs mt-1">Returning visitors</p>
          </div>
           <div className="p-3 bg-purple-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
           <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Absences (2 wks)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">12</h3>
            <p className="text-red-500 text-xs mt-1 font-medium">Requires attention</p>
          </div>
           <div className="p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-slate-400" />
            Recent Services
          </h3>
          <button className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Service Name</th>
                <th className="px-6 py-4 text-center">Attendees</th>
                <th className="px-6 py-4 text-center">Visitors</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_SESSIONS.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    {session.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{session.serviceName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                      {session.attendees}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">{session.visitors}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-emerald-600">
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
