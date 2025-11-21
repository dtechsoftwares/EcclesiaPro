import React, { useState } from 'react';
import { 
  Bell, Cake, Heart, Award, Calendar, Clock, 
  Check, X, MessageSquare, Settings, Sparkles, 
  RefreshCw, Send
} from 'lucide-react';
import { draftSmsContent } from '../services/geminiService';

// Mock Notification Types
type NotificationType = 'BIRTHDAY' | 'ANNIVERSARY' | 'MILESTONE' | 'FOLLOW_UP' | 'EVENT';

interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: string; // Due date or Event date
  memberId?: string;
  memberName?: string;
  avatar?: string;
  status: 'UNREAD' | 'READ' | 'ACTIONED';
  priority: 'HIGH' | 'NORMAL';
}

// Mock Data for Notifications
const MOCK_NOTIFICATIONS: SystemNotification[] = [
  { 
    id: 'n1', type: 'BIRTHDAY', title: 'Birthday Today', 
    description: 'John Doe turns 34 today.', 
    date: new Date().toISOString().split('T')[0], 
    memberId: '1', memberName: 'John Doe', avatar: 'https://picsum.photos/id/1005/200/200',
    status: 'UNREAD', priority: 'HIGH'
  },
  { 
    id: 'n2', type: 'ANNIVERSARY', title: 'Wedding Anniversary', 
    description: 'Sarah & Robert Smith celebrate 10 years tomorrow.', 
    date: 'Tomorrow', 
    memberId: '2', memberName: 'Sarah Smith', avatar: 'https://picsum.photos/id/1011/200/200',
    status: 'UNREAD', priority: 'NORMAL'
  },
  { 
    id: 'n3', type: 'MILESTONE', title: '1 Year Membership', 
    description: 'Michael Brown joined 1 year ago on Friday.', 
    date: 'In 2 days', 
    memberId: '3', memberName: 'Michael Brown', avatar: 'https://picsum.photos/id/1012/200/200',
    status: 'READ', priority: 'NORMAL'
  },
  { 
    id: 'n4', type: 'FOLLOW_UP', title: 'Absent for 3 Weeks', 
    description: 'Emily Davis has missed the last 3 Sunday services.', 
    date: 'Today', 
    memberId: '4', memberName: 'Emily Davis', avatar: '',
    status: 'UNREAD', priority: 'HIGH'
  },
  {
    id: 'n5', type: 'EVENT', title: 'Leadership Meeting',
    description: 'Monthly sync scheduled for 6:00 PM.',
    date: 'Today, 6:00 PM',
    status: 'UNREAD', priority: 'NORMAL'
  }
];

interface AutomationRule {
  id: string;
  label: string;
  enabled: boolean;
  icon: any;
  color: string;
}

export const NotificationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'SETTINGS'>('ALERTS');
  const [notifications, setNotifications] = useState<SystemNotification[]>(MOCK_NOTIFICATIONS);
  const [draftingId, setDraftingId] = useState<string | null>(null);
  const [draftedMessage, setDraftedMessage] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const [rules, setRules] = useState<AutomationRule[]>([
    { id: 'r1', label: 'Birthday Reminders', enabled: true, icon: Cake, color: 'text-pink-500' },
    { id: 'r2', label: 'Anniversary Alerts', enabled: true, icon: Heart, color: 'text-red-500' },
    { id: 'r3', label: 'Membership Milestones', enabled: true, icon: Award, color: 'text-yellow-500' },
    { id: 'r4', label: 'Absence Follow-ups (3+ weeks)', enabled: true, icon: Clock, color: 'text-purple-500' },
    { id: 'r5', label: 'Event Reminders', enabled: false, icon: Calendar, color: 'text-blue-500' },
  ]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = async (notification: SystemNotification) => {
    if (draftingId === notification.id) {
      setDraftingId(null);
      return;
    }
    
    setDraftingId(notification.id);
    setDraftedMessage('');
    
    if (notification.type === 'BIRTHDAY' || notification.type === 'ANNIVERSARY' || notification.type === 'MILESTONE' || notification.type === 'FOLLOW_UP') {
      setLoadingAi(true);
      const topic = `${notification.title} for ${notification.memberName}. Details: ${notification.description}`;
      const msg = await draftSmsContent(topic, notification.memberName || 'Member');
      setDraftedMessage(msg);
      setLoadingAi(false);
    }
  };

  const handleSendMessage = (id: string) => {
    alert(`Message sent: "${draftedMessage}"`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'ACTIONED' } : n));
    setDraftingId(null);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'BIRTHDAY': return <Cake className="w-5 h-5 text-pink-500" />;
      case 'ANNIVERSARY': return <Heart className="w-5 h-5 text-red-500" />;
      case 'MILESTONE': return <Award className="w-5 h-5 text-yellow-500" />;
      case 'FOLLOW_UP': return <RefreshCw className="w-5 h-5 text-purple-500" />;
      case 'EVENT': return <Calendar className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Notification Center</h2>
          <p className="text-slate-500 text-sm">Manage automated alerts and reminders.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('ALERTS')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ALERTS' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Alerts ({notifications.length})
          </button>
          <button 
             onClick={() => setActiveTab('SETTINGS')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'SETTINGS' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'ALERTS' && (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
              <Check className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
              <p className="text-slate-500">No pending notifications at the moment.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-xl border p-4 shadow-sm transition-all duration-200 ${notification.status === 'ACTIONED' ? 'opacity-50 border-slate-100' : 'border-slate-200 hover:shadow-md'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Avatar/Icon */}
                    <div className="relative">
                      {notification.avatar ? (
                        <img src={notification.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" alt="" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                          {notification.memberName ? notification.memberName[0] : <Bell className="w-6 h-6" />}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                        {getIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-semibold text-slate-800">{notification.title}</h4>
                        {notification.priority === 'HIGH' && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-full">High Priority</span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mt-0.5">{notification.description}</p>
                      <div className="flex items-center mt-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {notification.date}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {notification.status !== 'ACTIONED' && (
                      <button 
                        onClick={() => handleAction(notification)}
                        className={`p-2 rounded-lg transition-colors ${draftingId === notification.id ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-emerald-50 text-emerald-600'}`}
                        title="Draft Message"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDismiss(notification.id)}
                      className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* AI Draft Area */}
                {draftingId === notification.id && (
                  <div className="mt-4 pl-16 animate-fade-in-up">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 relative">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-bold text-purple-700 uppercase">AI Suggestion</span>
                      </div>
                      
                      {loadingAi ? (
                        <div className="h-16 flex items-center justify-center text-slate-400 text-sm">
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          Drafting personal message...
                        </div>
                      ) : (
                        <>
                          <textarea 
                            value={draftedMessage}
                            onChange={(e) => setDraftedMessage(e.target.value)}
                            className="w-full bg-white p-3 border border-slate-200 rounded-md text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                            rows={3}
                          />
                          <div className="mt-3 flex justify-end space-x-3">
                            <button 
                              onClick={() => setDraftingId(null)}
                              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleSendMessage(notification.id)}
                              className="px-4 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-bold hover:bg-emerald-700 flex items-center"
                            >
                              <Send className="w-3 h-3 mr-2" />
                              Send Wish
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Automation Rules</h3>
            <p className="text-sm text-slate-500">Configure which events trigger automatic notifications.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-slate-100 ${rule.enabled ? rule.color : 'text-slate-400'}`}>
                    <rule.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`font-medium ${rule.enabled ? 'text-slate-800' : 'text-slate-400'}`}>{rule.label}</p>
                    <p className="text-xs text-slate-400">
                      {rule.enabled ? 'Active' : 'Disabled'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleRule(rule.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${rule.enabled ? 'bg-emerald-600' : 'bg-slate-200'}`}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-6' : 'translate-x-1'}`} 
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100">
             <div className="flex items-start space-x-3 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 text-sm">
                <Settings className="w-5 h-5 flex-shrink-0" />
                <p>
                  <strong>Advanced Config:</strong> Custom SMS templates and timing preferences (e.g., "Send at 9:00 AM") can be configured in the main System Settings.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};