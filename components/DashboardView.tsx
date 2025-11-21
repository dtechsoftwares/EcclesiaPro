import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, DollarSign, Calendar, TrendingUp, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { generateAiInsight } from '../services/geminiService';

const data = [
  { name: 'Jan', attendance: 400, giving: 24000 },
  { name: 'Feb', attendance: 300, giving: 13980 },
  { name: 'Mar', attendance: 200, giving: 9800 },
  { name: 'Apr', attendance: 278, giving: 19080 },
  { name: 'May', attendance: 189, giving: 14800 },
  { name: 'Jun', attendance: 239, giving: 18000 },
  { name: 'Jul', attendance: 349, giving: 23000 },
];

const StatCard = ({ title, value, trend, icon: Icon, trendUp }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-green-50 rounded-lg">
        <Icon className="w-6 h-6 text-emerald-600" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trendUp ? (
        <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
      )}
      <span className={`text-sm font-medium ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend}
      </span>
      <span className="text-xs text-slate-400 ml-2">vs last month</span>
    </div>
  </div>
);

export const DashboardView: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleGetInsight = async () => {
    setLoadingAi(true);
    const context = JSON.stringify(data);
    const insight = await generateAiInsight(
      "Analyze the attendance and giving trends for the last 6 months. Are there correlations? What strategic advice would you give?",
      context
    );
    setAiInsight(insight);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value="1,248" 
          trend="+12%" 
          trendUp={true} 
          icon={Users} 
        />
        <StatCard 
          title="Monthly Giving" 
          value="$42,500" 
          trend="+8.2%" 
          trendUp={true} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Avg. Attendance" 
          value="856" 
          trend="-2.4%" 
          trendUp={false} 
          icon={Calendar} 
        />
        <StatCard 
          title="New Visitors" 
          value="45" 
          trend="+15%" 
          trendUp={true} 
          icon={TrendingUp} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Financial & Attendance Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorGiving" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="giving" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorGiving)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold">Ministry AI Assistant</h3>
            </div>
            
            {!aiInsight ? (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Use Gemini AI to analyze your church's growth patterns and financial health.
                </p>
                <button 
                  onClick={handleGetInsight}
                  disabled={loadingAi}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 flex justify-center items-center"
                >
                  {loadingAi ? (
                    <span className="animate-pulse">Analyzing data...</span>
                  ) : (
                    "Generate Strategic Insight"
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg text-sm text-slate-100 leading-relaxed h-48 overflow-y-auto custom-scrollbar">
                  {aiInsight}
                </div>
                <button 
                  onClick={() => setAiInsight('')}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Clear Insight
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};