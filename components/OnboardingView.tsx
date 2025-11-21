
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle, Server, Lock, Loader2 } from 'lucide-react';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface OnboardingViewProps {
  onComplete: (user: User) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing with delay
    setTimeout(() => {
      const superAdmin: User = {
        id: 'sa-1',
        name: formData.name,
        email: formData.email,
        role: 'SUPER_ADMIN',
        avatar: '',
        twoFactorEnabled: true,
        lastLogin: new Date().toISOString()
      };

      storageService.initSystem(superAdmin);
      onComplete(superAdmin);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel (Visual) */}
        <div className="md:w-5/12 bg-gradient-to-br from-emerald-600 to-green-700 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <Server className="w-full h-full" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Ecclesia<span className="text-emerald-200">Pro</span></h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome, Super Admin.</h2>
            <p className="text-emerald-100 leading-relaxed">
              You are about to initialize the master control node for the Ecclesia Multi-Church Management System.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold">1</div>
              <p className="font-medium">System Initialization</p>
            </div>
            <div className="flex items-center space-x-3 opacity-70">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">2</div>
              <p className="font-medium">Create Admin Account</p>
            </div>
            <div className="flex items-center space-x-3 opacity-70">
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">3</div>
              <p className="font-medium">Database Setup</p>
            </div>
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="md:w-7/12 p-10">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800">Create Master Account</h3>
              <p className="text-slate-500 mt-2">This account will have full access to all tenant databases and system settings.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900 placeholder-slate-400"
                  placeholder="e.g. System Administrator"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Master Email</label>
                <input 
                  type="email"
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900 placeholder-slate-400"
                  placeholder="admin@master-system.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password"
                      required
                      className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900 placeholder-slate-400"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm</label>
                  <input 
                    type="password"
                    required
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900 placeholder-slate-400"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Initializing System...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-slate-400 mt-4">
                By proceeding, you agree to the Master Service Agreement and Data Processing Addendum.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
