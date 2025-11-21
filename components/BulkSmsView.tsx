
import React, { useState } from 'react';
import { Send, Sparkles, Users, Clock, MessageSquare, Search, Plus, Heart, Hash, Paperclip, MoreVertical, CheckCircle } from 'lucide-react';
import { draftSmsContent } from '../services/geminiService';
import { ChatMessage, PrayerRequest, ChatChannel } from '../types';

const mockChannels: ChatChannel[] = [
  { id: 'c1', name: 'General Leadership', type: 'Group', lastMessage: 'Meeting at 5pm confirmed.', lastTime: '10:30 AM', unreadCount: 2 },
  { id: 'c2', name: 'Worship Team', type: 'Group', lastMessage: 'Setlist for Sunday is up.', lastTime: 'Yesterday', unreadCount: 0 },
  { id: 'c3', name: 'Pastor John', type: 'Direct', lastMessage: 'Can we sync tomorrow?', lastTime: 'Yesterday', unreadCount: 0 },
];

const mockPrayerRequests: PrayerRequest[] = [
  { id: 'pr1', requesterName: 'Sarah Smith', request: 'Please pray for my mother\'s surgery on Tuesday.', date: '2023-10-28', isAnonymous: false, status: 'Open', responses: 5 },
  { id: 'pr2', requesterName: 'Anonymous', request: 'Struggling with job loss. Need guidance.', date: '2023-10-27', isAnonymous: true, status: 'Prayed For', responses: 12 },
];

const mockChatMessages: ChatMessage[] = [
  { id: 'm1', senderId: 'u2', senderName: 'Sarah Jones', content: 'Has everyone seen the updated schedule?', timestamp: '10:00 AM', isRead: true },
  { id: 'm2', senderId: 'u1', senderName: 'Rev. Admin', content: 'Yes, looks good to me.', timestamp: '10:05 AM', isRead: true },
  { id: 'm3', senderId: 'u3', senderName: 'Mike Brown', content: 'I might be 10 mins late.', timestamp: '10:15 AM', isRead: false },
];

export const BulkSmsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SMS' | 'PRAYER' | 'CHAT'>('SMS');
  
  // SMS State
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Chat State
  const [selectedChannel, setSelectedChannel] = useState<string>('c1');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);

  // Prayer State
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(mockPrayerRequests);

  const handleAiDraft = async () => {
    if (!topic) return;
    setLoadingAi(true);
    const draft = await draftSmsContent(topic, "Church Members");
    setMessage(draft);
    setLoadingAi(false);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      senderName: 'Rev. Admin',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    setMessages([...messages, newMessage]);
    setChatInput('');
  };

  const handlePray = (id: string) => {
    setPrayerRequests(prev => prev.map(pr => pr.id === id ? { ...pr, responses: pr.responses + 1 } : pr));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Communications Hub</h2>
          <p className="text-slate-500 text-sm">Manage SMS, Prayer Requests, and Team Chat.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button 
             onClick={() => setActiveTab('SMS')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'SMS' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> SMS
          </button>
          <button 
             onClick={() => setActiveTab('PRAYER')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'PRAYER' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Heart className="w-4 h-4 mr-2" /> Prayer Wall
          </button>
          <button 
             onClick={() => setActiveTab('CHAT')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'CHAT' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Hash className="w-4 h-4 mr-2" /> Team Chat
          </button>
        </div>
      </div>

      {/* SMS TAB */}
      {activeTab === 'SMS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Compose Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Compose Broadcast</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded ${message.length > 160 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                  {message.length} / 160 chars
                </span>
              </div>

              {/* AI Assistant Input */}
              <div className="mb-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">AI Writing Assistant</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Men's breakfast reminder this Saturday" 
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button 
                    onClick={handleAiDraft}
                    disabled={loadingAi || !topic}
                    className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                    {loadingAi ? "Drafting..." : "Auto-Draft"}
                  </button>
                </div>
              </div>

              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Type your message here..."
                className="w-full p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none text-slate-700"
              ></textarea>

              <div className="mt-4 flex justify-between items-center">
                 <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-2 text-emerald-600 focus:ring-emerald-500 rounded" />
                      Schedule for later
                    </label>
                 </div>
                 <button className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-transform active:scale-95">
                   <Send className="w-4 h-4 mr-2" />
                   Send Broadcast
                 </button>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Recipient Groups</h3>
              <div className="space-y-3">
                {['All Members (1,248)', 'Leadership Team (24)', 'Youth Ministry (150)', 'Choir (45)'].map((group, idx) => (
                  <div key={idx} className="flex items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{group}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Recent History</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-emerald-500 pl-3">
                  <p className="text-xs text-slate-400">Today, 10:00 AM</p>
                  <p className="text-sm text-slate-700 mt-1 truncate">Reminder: Leadership meeting tonight...</p>
                  <span className="text-xs text-green-600 mt-1 block">Delivered (24/24)</span>
                </div>
                <div className="border-l-2 border-slate-200 pl-3">
                  <p className="text-xs text-slate-400">Yesterday, 4:00 PM</p>
                  <p className="text-sm text-slate-700 mt-1 truncate">Sunday Service time changed to...</p>
                  <span className="text-xs text-green-600 mt-1 block">Delivered (1,200/1,248)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRAYER TAB */}
      {activeTab === 'PRAYER' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Request List */}
             <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="text-lg font-semibold text-slate-800">Prayer Wall</h3>
                   <button className="text-sm bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center hover:bg-emerald-700">
                      <Plus className="w-4 h-4 mr-1" /> New Request
                   </button>
                </div>
                
                {prayerRequests.map(pr => (
                   <div key={pr.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                               {pr.isAnonymous ? <Users className="w-5 h-5 text-slate-400" /> : <span className="font-bold text-slate-600">{pr.requesterName[0]}</span>}
                            </div>
                            <div>
                               <p className="font-semibold text-slate-800">{pr.requesterName}</p>
                               <p className="text-xs text-slate-400">{pr.date}</p>
                            </div>
                         </div>
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${pr.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {pr.status}
                         </span>
                      </div>
                      <p className="text-slate-700 mb-4">{pr.request}</p>
                      <div className="flex items-center space-x-4 pt-4 border-t border-slate-50">
                         <button 
                           onClick={() => handlePray(pr.id)}
                           className="flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors"
                         >
                            <Heart className={`w-4 h-4 mr-1 ${pr.responses > 0 ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                            {pr.responses} Prayed
                         </button>
                         <button className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Share</button>
                      </div>
                   </div>
                ))}
             </div>

             {/* Prayer Stats */}
             <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                   <h3 className="font-semibold mb-1">Prayer Chain</h3>
                   <p className="text-indigo-100 text-sm mb-4">Join 45 others praying right now.</p>
                   <div className="flex -space-x-2 overflow-hidden mb-4">
                      {[1,2,3,4,5].map(i => (
                         <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-white/20"></div>
                      ))}
                   </div>
                   <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
                      Join Prayer Chain
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* CHAT TAB */}
      {activeTab === 'CHAT' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-[600px] flex overflow-hidden animate-fade-in">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-100 bg-slate-50 flex flex-col">
               <div className="p-4 border-b border-slate-200">
                  <div className="relative">
                     <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                     <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none" />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto">
                  <div className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Channels</div>
                  {mockChannels.filter(c => c.type === 'Group').map(c => (
                     <button 
                       key={c.id}
                       onClick={() => setSelectedChannel(c.id)}
                       className={`w-full px-4 py-2 flex justify-between items-center text-sm ${selectedChannel === c.id ? 'bg-white text-emerald-600 border-l-2 border-emerald-500 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                     >
                        <span className="flex items-center"><Hash className="w-4 h-4 mr-2 text-slate-400" /> {c.name}</span>
                        {c.unreadCount > 0 && <span className="bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5">{c.unreadCount}</span>}
                     </button>
                  ))}
                   <div className="px-4 py-3 mt-2 text-xs font-semibold text-slate-500 uppercase">Direct Messages</div>
                   {mockChannels.filter(c => c.type === 'Direct').map(c => (
                     <button 
                       key={c.id}
                       onClick={() => setSelectedChannel(c.id)}
                       className={`w-full px-4 py-2 flex justify-between items-center text-sm ${selectedChannel === c.id ? 'bg-white text-emerald-600 border-l-2 border-emerald-500 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                     >
                        <span className="flex items-center"><Users className="w-4 h-4 mr-2 text-slate-400" /> {c.name}</span>
                     </button>
                  ))}
               </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                  <div className="flex items-center space-x-2">
                     <Hash className="w-5 h-5 text-slate-400" />
                     <h3 className="font-bold text-slate-800">{mockChannels.find(c => c.id === selectedChannel)?.name}</h3>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                  {messages.map(msg => (
                     <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-xl p-3 shadow-sm ${msg.senderId === 'me' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'}`}>
                           {msg.senderId !== 'me' && <p className="text-xs font-bold text-emerald-600 mb-1">{msg.senderName}</p>}
                           <p className="text-sm">{msg.content}</p>
                           <p className={`text-[10px] mt-1 text-right ${msg.senderId === 'me' ? 'text-emerald-200' : 'text-slate-400'}`}>{msg.timestamp}</p>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                     <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Paperclip className="w-5 h-5" /></button>
                     <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder="Type a message..." 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                     />
                     <button 
                        onClick={handleSendChat}
                        className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"
                     >
                        <Send className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
