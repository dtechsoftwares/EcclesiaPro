
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { User } from '../types';
import { logAction } from '../services/auditService';
import { storageService } from '../services/storageService';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'CREDENTIALS' | '2FA'>('CREDENTIALS');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Use Storage Service for lookup
    setTimeout(() => {
      const user = storageService.verifyLogin(email, password);
      
      if (user) {
        setTempUser(user);
        setStep('2FA');
        setIsLoading(false);
      } else {
        setError('Invalid email or password.');
        logAction(null, 'LOGIN_FAILED', 'AUTH', `Failed login attempt for ${email}`, 'WARNING');
        setIsLoading(false);
      }
    }, 1500); // Increased delay to show off the spinner
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // For prototype, accept '123456'
      if (otp === '123456' && tempUser) {
        const updatedUser = { ...tempUser, lastLogin: new Date().toISOString() };
        // Note: In real app, we would update the lastLogin in DB here
        logAction(updatedUser, 'LOGIN_SUCCESS', 'AUTH', 'User logged in successfully', 'INFO');
        onLogin(updatedUser);
      } else {
        setError('Invalid authentication code.');
        logAction(null, '2FA_FAILED', 'AUTH', `Failed 2FA attempt for ${email}`, 'WARNING');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Ecclesia<span className="text-emerald-200">Pro</span></h1>
          <p className="text-emerald-100 text-sm mt-1">Secure Ministry Management</p>
        </div>

        {/* Form Area */}
        <div className="p-8 flex-1">
          {step === 'CREDENTIALS' ? (
            <form onSubmit={handleCredentialSubmit} className="space-y-6 animate-fade-in">
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1" htmlFor="email">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                      <input 
                        id="email"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white text-slate-900"
                        placeholder="admin@church.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1" htmlFor="password">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                      <input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white text-slate-900"
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
               </div>

               {error && (
                 <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center">
                   <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                   {error}
                 </div>
               )}

               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition-all flex items-center justify-center disabled:opacity-70"
               >
                 {isLoading ? (
                   <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                   </>
                 ) : (
                   <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                   </>
                 )}
               </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in">
               <div className="text-center mb-6">
                 <h3 className="font-bold text-slate-800">Two-Factor Authentication</h3>
                 <p className="text-sm text-slate-500 mt-1">Enter the code sent to your device ending in **88</p>
               </div>

               <div className="flex justify-center">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    className="text-center text-2xl tracking-[0.5em] font-mono font-bold w-full p-4 border-2 border-emerald-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none bg-white text-slate-900"
                    placeholder="••••••"
                    maxLength={6}
                    autoFocus
                  />
               </div>

               {error && (
                 <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center justify-center">
                   <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                   {error}
                 </div>
               )}

               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-100 transition-all flex items-center justify-center disabled:opacity-70"
               >
                 {isLoading ? (
                   <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Authenticating...
                   </>
                 ) : (
                   <>
                    Verify Code
                    <Check className="w-4 h-4 ml-2" />
                   </>
                 )}
               </button>

               <button 
                 type="button" 
                 onClick={() => setStep('CREDENTIALS')}
                 className="w-full text-slate-500 text-sm hover:text-slate-700"
               >
                 Back to Login
               </button>
               
               <p className="text-center text-xs text-slate-400 mt-4">
                 Use code <span className="font-mono bg-slate-100 px-1 rounded">123456</span>
               </p>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
          <p>Protected by EcclesiaGuard™ Security</p>
          <p className="mt-1">Version 2.5.0 • Multi-Tenant Enabled</p>
        </div>
      </div>
    </div>
  );
};
