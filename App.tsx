
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  CreditCard, 
  MessageSquare, 
  Monitor, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ShieldCheck,
  ArrowLeftCircle,
  Loader2,
  Heart
} from 'lucide-react';

import { ViewState, User, Tenant } from './types';
import { DashboardView } from './components/DashboardView';
import { MembersView } from './components/MembersView';
import { VisitorsView } from './components/VisitorsView';
import { FinanceView } from './components/FinanceView';
import { BulkSmsView } from './components/BulkSmsView';
import { AttendanceView } from './components/AttendanceView';
import { NotificationsView } from './components/NotificationsView';
import { LoginView } from './components/LoginView';
import { SettingsView } from './components/SettingsView';
import { EquipmentView } from './components/EquipmentView';
import { ReportsView } from './components/ReportsView';
import { OnboardingView } from './components/OnboardingView';
import { SuperAdminView } from './components/SuperAdminView';
import { SplashScreen } from './components/SplashScreen';
import { SoulTrackingView } from './components/SoulTrackingView';
import { logAction } from './services/auditService';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Loading States
  const [showSplash, setShowSplash] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // Multi-Tenancy State
  const [isSystemInitialized, setIsSystemInitialized] = useState(false);
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    // Simulate initial system boot
    const timer = setTimeout(() => {
      const initialized = storageService.isInitialized();
      setIsSystemInitialized(initialized);
      setShowSplash(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // Authentication Handlers
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'SUPER_ADMIN') {
      setCurrentView(ViewState.SUPER_ADMIN);
    } else {
      setCurrentView(ViewState.DASHBOARD);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      logAction(user, 'LOGOUT', 'AUTH', 'User signed out');
      setUser(null);
      setActiveTenant(null);
      setCurrentView(ViewState.DASHBOARD); // Will show login since user is null
    }
  };

  // Onboarding Completion
  const handleOnboardingComplete = (superAdmin: User) => {
    setIsSystemInitialized(true);
    setUser(superAdmin);
    setCurrentView(ViewState.SUPER_ADMIN);
  };

  // Super Admin Actions
  const handleTenantSelect = (tenant: Tenant) => {
    setIsNavigating(true);
    setTimeout(() => {
      setActiveTenant(tenant);
      setCurrentView(ViewState.DASHBOARD);
      setIsNavigating(false);
      logAction(user, 'ACCESS_TENANT', 'SYSTEM', `Super Admin accessed ${tenant.name}`);
    }, 800);
  };

  const handleReturnToSuperAdmin = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setActiveTenant(null);
      setCurrentView(ViewState.SUPER_ADMIN);
      setIsNavigating(false);
    }, 600);
  };

  const handleNavigate = (view: ViewState, label: string) => {
    if (currentView === view) {
      setIsSidebarOpen(false);
      return;
    }
    setIsNavigating(true);
    setIsSidebarOpen(false);
    
    // Simulate network latency for smoother feel
    setTimeout(() => {
      setCurrentView(view);
      setIsNavigating(false);
      logAction(user, 'NAVIGATE', 'UI', `Accessed ${label} view`);
    }, 500);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => handleNavigate(view, label)}
      className={`flex items-center w-full px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
        currentView === view
          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-900/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${currentView === view ? 'text-white' : 'text-slate-400'}`} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (currentView) {
      case ViewState.SUPER_ADMIN:
        if (user?.role !== 'SUPER_ADMIN') return <div className="p-8 text-red-500">Access Denied</div>;
        return <SuperAdminView user={user} onSelectTenant={handleTenantSelect} onLogout={handleLogout} />;
      case ViewState.DASHBOARD:
        return <DashboardView />;
      case ViewState.MEMBERS:
        return <MembersView />;
      case ViewState.VISITORS:
        return <VisitorsView />;
      case ViewState.SOUL_TRACKING:
        return <SoulTrackingView />;
      case ViewState.FINANCE:
        return <FinanceView />;
      case ViewState.BULK_SMS:
        return <BulkSmsView />;
      case ViewState.ATTENDANCE:
        return <AttendanceView />;
      case ViewState.NOTIFICATIONS:
        return <NotificationsView />;
      case ViewState.EQUIPMENT:
        return <EquipmentView />;
      case ViewState.REPORTS:
        return <ReportsView />;
      case ViewState.SETTINGS:
        return <SettingsView currentUser={user} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400 animate-fade-in">
            <Settings className="w-16 h-16 mb-4 text-slate-200" />
            <h2 className="text-xl font-semibold text-slate-600">Under Development</h2>
            <p>The {currentView} module is coming soon.</p>
          </div>
        );
    }
  };

  // --------------------------------------------------------------------------
  // 0. Splash Screen
  // --------------------------------------------------------------------------
  if (showSplash) {
    return <SplashScreen />;
  }

  // --------------------------------------------------------------------------
  // 1. Check Initialization (Onboarding)
  // --------------------------------------------------------------------------
  if (!isSystemInitialized) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  // --------------------------------------------------------------------------
  // 2. Check Authentication
  // --------------------------------------------------------------------------
  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  // --------------------------------------------------------------------------
  // 3. Check View Mode (Super Admin vs Tenant App)
  // --------------------------------------------------------------------------

  // If we are in Super Admin View, render the full page component (it has its own layout)
  if (currentView === ViewState.SUPER_ADMIN) {
    return (
      <div className="relative">
        {isNavigating && (
          <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-3" />
              <p className="text-slate-600 font-medium animate-pulse">Loading Workspace...</p>
            </div>
          </div>
        )}
        {renderContent()}
      </div>
    );
  }

  // Otherwise, we are in Tenant/App Mode (Standard Layout)
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-green-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Ecclesia<span className="text-emerald-500">Pro</span></span>
          </div>
          {activeTenant && (
             <div className="text-xs text-slate-400 mt-2 font-mono bg-slate-800 p-1 rounded px-2 truncate border border-slate-700">
               DB: {activeTenant.name}
             </div>
          )}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-6 right-4 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {user.role === 'SUPER_ADMIN' && (
             <button 
               onClick={handleReturnToSuperAdmin}
               className="w-full mb-6 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center text-sm font-bold transition-colors shadow-lg shadow-indigo-900/20"
             >
               <ArrowLeftCircle className="w-5 h-5 mr-2" />
               Back to Admin
             </button>
          )}

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">Main Menu</div>
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={ViewState.NOTIFICATIONS} icon={Bell} label="Notifications" />
          <NavItem view={ViewState.MEMBERS} icon={Users} label="Members" />
          <NavItem view={ViewState.VISITORS} icon={UserPlus} label="Visitors" />
          <NavItem view={ViewState.ATTENDANCE} icon={CalendarCheck} label="Attendance" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8">Ministry</div>
          <NavItem view={ViewState.SOUL_TRACKING} icon={Heart} label="Track Soul" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8">Management</div>
          <NavItem view={ViewState.FINANCE} icon={CreditCard} label="Finance" />
          <NavItem view={ViewState.BULK_SMS} icon={MessageSquare} label="Communications" />
          <NavItem view={ViewState.EQUIPMENT} icon={Monitor} label="Equipment" />
          <NavItem view={ViewState.REPORTS} icon={FileText} label="Reports" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8">System</div>
          <NavItem view={ViewState.SETTINGS} icon={Settings} label="System & Security" />
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Navigation Loading Overlay */}
        {isNavigating && (
          <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-3 shadow-lg"></div>
              <p className="text-emerald-800 font-bold animate-pulse tracking-wide">Loading...</p>
            </div>
          </div>
        )}

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-2 mr-2 rounded-md text-slate-500 hover:bg-slate-100"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center text-slate-500 text-sm">
              <span className="font-medium text-slate-900">{activeTenant ? activeTenant.name : 'Ecclesia Manager'}</span>
              <span className="mx-2 text-slate-300">|</span>
              <span>{user.role === 'SUPER_ADMIN' ? 'Impersonation Mode' : 'Admin Portal'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView(ViewState.NOTIFICATIONS)}
              className={`relative p-2 transition-colors ${currentView === ViewState.NOTIFICATIONS ? 'text-emerald-600 bg-emerald-50 rounded-full' : 'text-slate-400 hover:text-emerald-600'}`}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-emerald-600 font-bold">{user.role}</p>
              </div>
              <img 
                src={user.avatar || "https://ui-avatars.com/api/?name=Admin"} 
                alt="User Profile" 
                className="w-9 h-9 rounded-full border-2 border-slate-100 shadow-sm object-cover" 
              />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
