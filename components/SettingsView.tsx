
import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Database, Eye, FileText, AlertTriangle, 
  CheckCircle, Key, Download, Trash2, RefreshCw, Server,
  Smartphone, Globe
} from 'lucide-react';
import { getAuditLogs, logAction } from '../services/auditService';
import { AuditLogEntry, User } from '../types';

interface SettingsViewProps {
  currentUser: User | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SECURITY' | 'AUDIT'>('SECURITY');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  
  // Mock Settings State
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  useEffect(() => {
    if (activeTab === 'AUDIT') {
      setLogs(getAuditLogs());
    }
  }, [activeTab]);

  const handleRefreshLogs = () => {
    setLogs(getAuditLogs());
  };

  const handleToggleSecurity = (setting: string) => {
    if (setting === 'encryption') {
       setEncryptionEnabled(!encryptionEnabled);
       logAction(currentUser, 'CONFIG_CHANGE', 'SYSTEM', `Encryption At Rest toggled to ${!encryptionEnabled}`);
    }
    if (setting === '2fa') {
       setTwoFactorRequired(!twoFactorRequired);
       logAction(currentUser, 'CONFIG_CHANGE', 'SYSTEM', `Enforce 2FA toggled to ${!twoFactorRequired}`, 'WARNING');
    }
  };

  const handleExportData = () => {
    logAction(currentUser, 'DATA_EXPORT', 'PRIVACY', 'User initiated full system data export');
    alert('Data export started. You will be notified when the encrypted archive is ready.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500 text-sm">Manage security, data policies, and system logs.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
           {['GENERAL', 'SECURITY', 'AUDIT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SECURITY TAB */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6">
          {/* Security Health Score */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                 <div className="p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/50">
                   <Shield className="w-8 h-8 text-emerald-400" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold">Security Status: Strong</h3>
                   <p className="text-slate-400 text-sm">Your system is compliant with current security protocols.</p>
                 </div>
               </div>
               <div className="text-right hidden md:block">
                 <p className="text-3xl font-bold text-emerald-400">94%</p>
                 <p className="text-xs text-slate-500 uppercase">Health Score</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Policies */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-slate-400" />
                Authentication & Access
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                     <p className="text-sm font-medium text-slate-800">Enforce 2FA for Staff</p>
                     <p className="text-xs text-slate-500">Require second factor for Admin/Mod roles</p>
                   </div>
                   <button 
                     onClick={() => handleToggleSecurity('2fa')}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorRequired ? 'bg-emerald-600' : 'bg-slate-300'}`}
                   >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorRequired ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                     <p className="text-sm font-medium text-slate-800">Session Timeout</p>
                     <p className="text-xs text-slate-500">Auto-logout after inactivity</p>
                   </div>
                   <select 
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="text-sm bg-white border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:border-emerald-500"
                   >
                     <option value="15">15 Minutes</option>
                     <option value="30">30 Minutes</option>
                     <option value="60">1 Hour</option>
                   </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                     <p className="text-sm font-medium text-slate-800">Password Rotation</p>
                     <p className="text-xs text-slate-500">Require change every 90 days</p>
                   </div>
                   <div className="flex items-center text-emerald-600 text-xs font-bold">
                     <CheckCircle className="w-4 h-4 mr-1" /> Active
                   </div>
                </div>
              </div>
            </div>

            {/* Data Protection */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-slate-400" />
                Data Protection & GDPR
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                     <p className="text-sm font-medium text-slate-800">Encryption At Rest</p>
                     <p className="text-xs text-slate-500">AES-256 database encryption</p>
                   </div>
                   <button 
                     onClick={() => handleToggleSecurity('encryption')}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${encryptionEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
                   >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${encryptionEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div>
                     <p className="text-sm font-medium text-slate-800">SSL/TLS Encryption</p>
                     <p className="text-xs text-slate-500">Active on all endpoints</p>
                   </div>
                   <div className="flex items-center text-emerald-600 text-xs font-bold">
                     <Lock className="w-4 h-4 mr-1" /> Secured
                   </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleExportData}
                    className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data Archive (GDPR)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT TAB */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <div>
               <h3 className="font-semibold text-slate-800">System Audit Logs</h3>
               <p className="text-sm text-slate-500">Track all user activities and system events.</p>
             </div>
             <button onClick={handleRefreshLogs} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
               <RefreshCw className="w-5 h-5 text-slate-500" />
             </button>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full">
               <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                 <tr>
                   <th className="px-6 py-4 text-left">Timestamp</th>
                   <th className="px-6 py-4 text-left">User</th>
                   <th className="px-6 py-4 text-left">Module</th>
                   <th className="px-6 py-4 text-left">Action</th>
                   <th className="px-6 py-4 text-left">Details</th>
                   <th className="px-6 py-4 text-center">Severity</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {logs.map(log => (
                   <tr key={log.id} className="hover:bg-slate-50 text-sm">
                     <td className="px-6 py-4 text-slate-500 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                     <td className="px-6 py-4 font-medium text-slate-800">{log.userName}</td>
                     <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold">{log.module}</span>
                     </td>
                     <td className="px-6 py-4 text-slate-700">{log.action}</td>
                     <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={log.details}>{log.details}</td>
                     <td className="px-6 py-4 text-center">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                         log.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                         log.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-700' : 
                         'bg-blue-50 text-blue-700'
                       }`}>
                         {log.severity}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
      
      {activeTab === 'GENERAL' && (
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
            <Server className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-800">General Settings</h3>
            <p>System customization options available in future update.</p>
         </div>
      )}
    </div>
  );
};
