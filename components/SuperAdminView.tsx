
import React, { useState, useEffect } from 'react';
import { 
  Server, Database, Plus, Users, Activity, Settings, 
  Search, ExternalLink, MoreVertical, ShieldAlert, LogOut,
  HardDrive
} from 'lucide-react';
import { Tenant, User } from '../types';
import { storageService } from '../services/storageService';

interface SuperAdminViewProps {
  user: User;
  onSelectTenant: (tenant: Tenant) => void;
  onLogout: () => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({ user, onSelectTenant, onLogout }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Form State
  const [newTenantData, setNewTenantData] = useState({
    name: '',
    adminEmail: ''
  });

  useEffect(() => {
    setTenants(storageService.getTenants());
  }, []);

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant: Tenant = {
      id: `t${Date.now()}`,
      name: newTenantData.name,
      slug: newTenantData.name.toLowerCase().replace(/\s+/g, '-'),
      adminEmail: newTenantData.adminEmail,
      status: 'Active',
      createdAt: new Date().toISOString(),
      memberCount: 0,
      lastActive: 'Never'
    };
    
    storageService.addTenant(newTenant);
    setTenants(storageService.getTenants());
    setShowCreateModal(false);
    setNewTenantData({ name: '', adminEmail: '' });
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMembers = tenants.reduce((acc, t) => acc + t.memberCount, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Super Admin Header */}
      <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 shadow-lg sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
             <Server className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Ecclesia<span className="text-emerald-400">Core</span></span>
          <span className="px-2 py-0.5 bg-slate-700 rounded text-xs font-mono text-slate-300">SUPER_ADMIN</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-slate-400 hover:text-red-400" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div className="p-4 bg-blue-50 rounded-full mr-4">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase">Active Databases</p>
              <h3 className="text-3xl font-bold text-slate-900">{tenants.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div className="p-4 bg-emerald-50 rounded-full mr-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase">Total Members</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalMembers.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div className="p-4 bg-purple-50 rounded-full mr-4">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase">System Health</p>
              <h3 className="text-3xl font-bold text-slate-900">99.9%</h3>
            </div>
          </div>
        </div>

        {/* Tenant Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Tenant Databases</h2>
              <p className="text-sm text-slate-500">Manage church instances and access dashboards.</p>
            </div>
            
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search churches..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Database
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left">Organization Name</th>
                  <th className="px-6 py-4 text-left">Admin Contact</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Members</th>
                  <th className="px-6 py-4 text-center">Storage</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-slate-50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                          {tenant.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{tenant.name}</p>
                          <p className="text-xs text-slate-500 font-mono">ID: {tenant.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {tenant.adminEmail}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${tenant.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-sm">
                      {tenant.memberCount}
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-slate-500">
                      {(Math.random() * 2).toFixed(2)} GB
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                         <button 
                           onClick={() => onSelectTenant(tenant)}
                           className="flex items-center px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-md text-xs font-bold transition-all shadow-sm"
                         >
                           Manage <ExternalLink className="w-3 h-3 ml-1" />
                         </button>
                         <button className="p-1.5 text-slate-400 hover:text-slate-600">
                           <Settings className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTenants.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No databases found matching your search.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="flex justify-center">
           <button 
             onClick={() => {
               if(confirm("Are you sure you want to reset the entire system? All data will be lost.")) {
                 storageService.resetSystem();
               }
             }}
             className="text-red-500 text-sm flex items-center hover:underline opacity-60 hover:opacity-100"
           >
             <ShieldAlert className="w-4 h-4 mr-1" /> System Factory Reset
           </button>
        </div>
      </div>

      {/* Create Tenant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Provision New Database</h3>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Church Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
                  placeholder="e.g. Highland Baptist"
                  value={newTenantData.name}
                  onChange={e => setNewTenantData({...newTenantData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
                  placeholder="admin@church.com"
                  value={newTenantData.adminEmail}
                  onChange={e => setNewTenantData({...newTenantData, adminEmail: e.target.value})}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-xl shadow-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
