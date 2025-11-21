
import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, Filter, PieChart, 
  TrendingUp, Users, DollarSign, Clock, CheckCircle, 
  AlertCircle, FileSpreadsheet, Printer, Share2, MoreHorizontal 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

// Mock Data
const RECENT_REPORTS = [
  { id: 'r1', name: 'October 2023 Financial Statement', type: 'Finance', date: 'Oct 31, 2023', author: 'Rev. Admin', format: 'PDF', size: '2.4 MB', status: 'Ready' },
  { id: 'r2', name: 'Q3 Attendance Analysis', type: 'Attendance', date: 'Oct 15, 2023', author: 'System', format: 'XLSX', size: '850 KB', status: 'Ready' },
  { id: 'r3', name: 'Volunteer Roster - Nov', type: 'Membership', date: 'Nov 01, 2023', author: 'Sarah Smith', format: 'PDF', size: '1.2 MB', status: 'Ready' },
  { id: 'r4', name: 'Year-End Giving Projection', type: 'Finance', date: 'Nov 02, 2023', author: 'Rev. Admin', format: 'PDF', size: '3.1 MB', status: 'Processing' },
  { id: 'r5', name: 'New Visitor Follow-up Log', type: 'Visitors', date: 'Nov 05, 2023', author: 'Sarah Smith', format: 'CSV', size: '45 KB', status: 'Ready' },
];

const ATTENDANCE_DATA = [
  { name: 'Week 1', adults: 120, kids: 45, online: 30 },
  { name: 'Week 2', adults: 132, kids: 48, online: 25 },
  { name: 'Week 3', adults: 105, kids: 35, online: 40 },
  { name: 'Week 4', adults: 145, kids: 55, online: 20 },
];

export const ReportsView: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
          <p className="text-slate-500 text-sm">Generate insights, export data, and view historical records.</p>
        </div>
        <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70"
        >
          {isGenerating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
          ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate New Report
              </>
          )}
        </button>
      </div>

      {/* Analytics Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Attendance Growth */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-semibold text-slate-800 flex items-center">
                 <Users className="w-5 h-5 mr-2 text-blue-500" />
                 Monthly Attendance Trends
               </h3>
               <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700">
                 <option>Last 30 Days</option>
                 <option>Last Quarter</option>
               </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="adults" name="Adults" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="kids" name="Kids" fill="#60a5fa" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="online" name="Online" fill="#93c5fd" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Giving Analysis */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-semibold text-slate-800 flex items-center">
                 <DollarSign className="w-5 h-5 mr-2 text-emerald-500" />
                 Giving vs Budget
               </h3>
               <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700">
                 <option>This Year</option>
               </select>
            </div>
            <div className="h-64">
               {/* Mock Line Chart */}
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={[
                   { month: 'Jan', budget: 4000, actual: 4200 },
                   { month: 'Feb', budget: 4000, actual: 3800 },
                   { month: 'Mar', budget: 4000, actual: 4500 },
                   { month: 'Apr', budget: 4200, actual: 4300 },
                   { month: 'May', budget: 4200, actual: 4100 },
                   { month: 'Jun', budget: 4200, actual: 4600 },
                 ]}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                   <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                   <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                   <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                   <Line type="monotone" dataKey="budget" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                   <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} activeDot={{r: 6, fill: '#10b981', strokeWidth: 0}} dot={{fill: '#10b981', strokeWidth: 0}} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Quick Actions */}
         <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
               <h3 className="font-semibold text-slate-800 mb-4">Report Templates</h3>
               <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-emerald-200 transition-all flex items-center group">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-100">
                        <FileSpreadsheet className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-slate-800">Weekly Tithe Report</p>
                        <p className="text-xs text-slate-500">Financial breakdown by category</p>
                     </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-emerald-200 transition-all flex items-center group">
                     <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mr-3 group-hover:bg-purple-100">
                        <Users className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-slate-800">New Member List</p>
                        <p className="text-xs text-slate-500">Joined in last 30 days</p>
                     </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-emerald-200 transition-all flex items-center group">
                     <div className="p-2 bg-orange-50 text-orange-600 rounded-lg mr-3 group-hover:bg-orange-100">
                        <AlertCircle className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-slate-800">Absence Report</p>
                        <p className="text-xs text-slate-500">Missed 3+ consecutive services</p>
                     </div>
                  </button>
               </div>
            </div>

            <div className="bg-indigo-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Clock className="w-24 h-24" />
               </div>
               <div className="relative z-10">
                 <h3 className="font-semibold mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Scheduled Reports
                 </h3>
                 <p className="text-indigo-100 text-sm mb-4">
                    3 reports are scheduled to run automatically every Monday at 8:00 AM.
                 </p>
                 <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors">
                    Manage Schedule
                 </button>
               </div>
            </div>
         </div>

         {/* Recent Files */}
         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-semibold text-slate-800">Recent Documents</h3>
               <button className="text-slate-400 hover:text-emerald-600">
                  <Filter className="w-5 h-5" />
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                     <tr>
                        <th className="px-6 py-4 text-left">Report Name</th>
                        <th className="px-6 py-4 text-left">Type</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {RECENT_REPORTS.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50">
                           <td className="px-6 py-4">
                              <div className="flex items-center">
                                 <FileText className="w-4 h-4 text-slate-400 mr-3" />
                                 <div>
                                    <p className="text-sm font-medium text-slate-800">{report.name}</p>
                                    <p className="text-xs text-slate-500">{report.format} • {report.size}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                 {report.type}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-slate-600">{report.date}</td>
                           <td className="px-6 py-4">
                              {report.status === 'Ready' ? (
                                 <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Ready
                                 </span>
                              ) : (
                                 <span className="inline-flex items-center text-xs font-medium text-blue-600">
                                    <Clock className="w-3 h-3 mr-1" /> Processing
                                 </span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Download">
                                 <Download className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};
