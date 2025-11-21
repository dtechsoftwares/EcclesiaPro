
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Transaction, DonationCampaign, RecurringDonation, Pledge, BudgetCategory, ExpenseRequest, FinancialReport } from '../types';
import { 
  DollarSign, TrendingUp, CreditCard, Download, Target, 
  Users, RefreshCw, FileText, ShieldCheck, Plus, CreditCard as CardIcon,
  Landmark, Wallet, Calendar, ArrowUpRight, HandHeart, AlertTriangle, CheckCircle, XCircle,
  FileCheck, PieChart as PieIcon, FileBarChart, Filter, MoreHorizontal
} from 'lucide-react';

const mockTransactions: Transaction[] = [
  { id: 'T001', date: '2023-10-25', description: 'Sunday Tithe - Online', amount: 1500.00, type: 'Income', category: 'Tithes', status: 'Completed', method: 'Stripe' },
  { id: 'T002', date: '2023-10-24', description: 'Audio Equipment Repair', amount: 350.00, type: 'Expense', category: 'Equipment', status: 'Completed', method: 'Bank Transfer' },
  { id: 'T003', date: '2023-10-24', description: 'Youth Ministry Snacks', amount: 75.50, type: 'Expense', category: 'Ministries', status: 'Pending', method: 'Cash' },
  { id: 'T004', date: '2023-10-23', description: 'Building Fund Donation', amount: 5000.00, type: 'Income', category: 'Projects', status: 'Completed', method: 'Stripe', campaignId: 'c1' },
  { id: 'T005', date: '2023-10-22', description: 'Utility Bill - Electricity', amount: 420.00, type: 'Expense', category: 'Utilities', status: 'Completed', method: 'Bank Transfer' },
];

const mockCampaigns: DonationCampaign[] = [
  { id: 'c1', name: 'Building Expansion Fund', targetAmount: 500000, raisedAmount: 325000, deadline: '2024-12-31', color: 'bg-blue-500', status: 'Active' },
  { id: 'c2', name: 'Global Missions 2024', targetAmount: 50000, raisedAmount: 42000, deadline: '2024-06-30', color: 'bg-emerald-500', status: 'Active' },
  { id: 'c3', name: 'Youth Camp Sponsorship', targetAmount: 15000, raisedAmount: 15000, color: 'bg-purple-500', status: 'Completed' },
];

const mockRecurring: RecurringDonation[] = [
  { id: 'r1', donorName: 'John Doe', amount: 150, frequency: 'Monthly', nextDate: '2023-11-01', status: 'Active', paymentMethod: 'Visa •••• 4242' },
  { id: 'r2', donorName: 'Sarah Smith', amount: 50, frequency: 'Weekly', nextDate: '2023-10-30', status: 'Active', paymentMethod: 'Mastercard •••• 8888' },
  { id: 'r3', donorName: 'Michael Brown', amount: 200, frequency: 'Monthly', nextDate: '2023-11-05', status: 'Paused', paymentMethod: 'Bank Transfer' },
];

const mockPledges: Pledge[] = [
  { id: 'p1', memberId: '1', memberName: 'John Doe', campaignId: 'c1', campaignName: 'Building Expansion Fund', amountPledged: 10000, amountFulfilled: 7500, status: 'Active', startDate: '2023-01-01', endDate: '2024-12-31' },
  { id: 'p2', memberId: '2', memberName: 'Sarah Smith', campaignId: 'c1', campaignName: 'Building Expansion Fund', amountPledged: 5000, amountFulfilled: 1000, status: 'Behind', startDate: '2023-01-01', endDate: '2024-12-31' },
  { id: 'p3', memberId: '3', memberName: 'Michael Brown', campaignId: 'c2', campaignName: 'Global Missions 2024', amountPledged: 1200, amountFulfilled: 1200, status: 'Fulfilled', startDate: '2023-01-01', endDate: '2023-12-31' },
];

const mockBudgets: BudgetCategory[] = [
  { id: 'b1', name: 'Salaries & Stipends', department: 'HR', allocated: 120000, spent: 45000 },
  { id: 'b2', name: 'Facilities & Utilities', department: 'Operations', allocated: 30000, spent: 12500 },
  { id: 'b3', name: 'Worship & Tech', department: 'Ministry', allocated: 15000, spent: 8000 },
  { id: 'b4', name: 'Youth Ministry', department: 'Ministry', allocated: 8000, spent: 2500 },
  { id: 'b5', name: 'Outreach & Missions', department: 'Missions', allocated: 25000, spent: 18000 },
];

const mockExpenses: ExpenseRequest[] = [
  { id: 'er1', requesterName: 'Sarah Smith', category: 'Youth Ministry', description: 'Pizza for Youth Night', amount: 145.50, date: '2023-10-26', status: 'Pending' },
  { id: 'er2', requesterName: 'Mike Jones', category: 'Worship & Tech', description: 'New Microphone Cables', amount: 89.99, date: '2023-10-25', status: 'Pending' },
  { id: 'er3', requesterName: 'Rev. Admin', category: 'Facilities & Utilities', description: 'Plumbing Repair', amount: 450.00, date: '2023-10-20', status: 'Approved' },
];

const mockReports: FinancialReport[] = [
  { id: 'rep1', title: 'October 2023 Financial Statement', type: 'Monthly', dateRange: 'Oct 1 - Oct 31, 2023', generatedDate: '2023-11-01', status: 'Ready' },
  { id: 'rep2', title: 'Q3 2023 Department Analysis', type: 'Custom', dateRange: 'Jul 1 - Sep 30, 2023', generatedDate: '2023-10-05', status: 'Ready' },
  { id: 'rep3', title: '2022 Annual Giving Report', type: 'Annual', dateRange: 'Jan 1 - Dec 31, 2022', generatedDate: '2023-01-15', status: 'Ready' },
];

const departmentAnalysisData = [
  { name: 'HR', allocated: 120000, spent: 45000 },
  { name: 'Operations', allocated: 30000, spent: 12500 },
  { name: 'Ministry', allocated: 23000, spent: 10500 },
  { name: 'Missions', allocated: 25000, spent: 18000 },
];

const expenseData = [
  { name: 'Salaries', value: 4500 },
  { name: 'Utilities', value: 1200 },
  { name: 'Missions', value: 2500 },
  { name: 'Equipment', value: 800 },
  { name: 'Maintenance', value: 500 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DONATIONS' | 'PLEDGES' | 'EXPENSES' | 'CAMPAIGNS' | 'REPORTS'>('OVERVIEW');
  const [expenseRequests, setExpenseRequests] = useState<ExpenseRequest[]>(mockExpenses);

  // Helper for formatting currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const handleExpenseAction = (id: string, action: 'Approved' | 'Rejected') => {
    setExpenseRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Management</h2>
          <p className="text-slate-500 text-sm">Track finance, manage donations, budgets and expenses.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm overflow-x-auto max-w-full">
          {['OVERVIEW', 'DONATIONS', 'PLEDGES', 'EXPENSES', 'CAMPAIGNS', 'REPORTS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-2 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-fade-in">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl text-white shadow-lg shadow-emerald-200">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-emerald-100 text-sm bg-emerald-800/30 px-2 py-1 rounded">This Month</span>
              </div>
              <p className="text-emerald-100 text-sm">Total Income</p>
              <h3 className="text-3xl font-bold mt-1">$24,500.00</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <CreditCard className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <p className="text-slate-500 text-sm">Total Expenses</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-800">$8,240.00</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-slate-500 text-sm">Net Balance</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-800">+$16,260.00</h3>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions List */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
                <button className="text-emerald-600 text-sm font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-left">Category</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-800">{tx.description}</p>
                          <p className="text-xs text-slate-500">{tx.date} • {tx.method}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                            {tx.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right text-sm font-semibold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expense Breakdown Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Expense Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {expenseData.map((entry, index) => (
                  <div key={entry.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-600">{entry.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">${entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DONATIONS TAB */}
      {activeTab === 'DONATIONS' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                   <div className="flex items-center space-x-2 mb-4 text-slate-500">
                      <RefreshCw className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold uppercase">Recurring Active</span>
                   </div>
                   <h3 className="text-3xl font-bold text-slate-800">$3,450<span className="text-base font-normal text-slate-400">/mo</span></h3>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                  42 active recurring profiles
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                   <div className="flex items-center space-x-2 mb-4 text-slate-500">
                      <ShieldCheck className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-bold uppercase">Gift Aid Claimable</span>
                   </div>
                   <h3 className="text-3xl font-bold text-slate-800">$1,240.50</h3>
                </div>
                <button className="mt-4 w-full py-2 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                   Process Claim
                </button>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                   <div className="flex items-center space-x-2 mb-4 text-slate-500">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-bold uppercase">Donor Statements</span>
                   </div>
                   <p className="text-slate-600 text-sm">2023 Year-End statements are ready for review.</p>
                </div>
                <button className="mt-4 w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center justify-center">
                   <Download className="w-4 h-4 mr-2" />
                   Generate All
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Recurring Profiles */}
             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="text-lg font-semibold text-slate-800">Recurring Donations</h3>
                   <button className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full">
                      <Plus className="w-5 h-5" />
                   </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                         <tr>
                            <th className="px-6 py-3 text-left">Donor</th>
                            <th className="px-6 py-3 text-left">Amount</th>
                            <th className="px-6 py-3 text-left">Frequency</th>
                            <th className="px-6 py-3 text-left">Next Date</th>
                            <th className="px-6 py-3 text-left">Method</th>
                            <th className="px-6 py-3 text-right">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {mockRecurring.map(rec => (
                            <tr key={rec.id} className="hover:bg-slate-50">
                               <td className="px-6 py-4 font-medium text-slate-800">{rec.donorName}</td>
                               <td className="px-6 py-4 text-emerald-600 font-semibold">{formatCurrency(rec.amount)}</td>
                               <td className="px-6 py-4 text-sm text-slate-600">{rec.frequency}</td>
                               <td className="px-6 py-4 text-sm text-slate-600">{rec.nextDate}</td>
                               <td className="px-6 py-4 text-xs text-slate-500">{rec.paymentMethod}</td>
                               <td className="px-6 py-4 text-right">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${rec.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                     {rec.status}
                                  </span>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Payment Methods Config */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-800">Payment Gateways</h3>
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 border border-emerald-200 bg-emerald-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                         <div className="bg-white p-2 rounded shadow-sm">
                            <CardIcon className="w-6 h-6 text-blue-600" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-800">Stripe</p>
                            <p className="text-xs text-emerald-600">Connected</p>
                         </div>
                      </div>
                      <div className="h-3 w-3 bg-emerald-500 rounded-full"></div>
                   </div>

                   <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg opacity-75">
                      <div className="flex items-center space-x-3">
                         <div className="bg-slate-100 p-2 rounded shadow-sm">
                            <Wallet className="w-6 h-6 text-blue-400" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-800">PayPal</p>
                            <p className="text-xs text-slate-500">Not Connected</p>
                         </div>
                      </div>
                      <button className="text-xs bg-slate-900 text-white px-2 py-1 rounded">Connect</button>
                   </div>

                   <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                         <div className="bg-slate-100 p-2 rounded shadow-sm">
                            <Landmark className="w-6 h-6 text-slate-600" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-800">Bank Transfer</p>
                            <p className="text-xs text-slate-500">Manual Reconciliation</p>
                         </div>
                      </div>
                      <div className="h-3 w-3 bg-emerald-500 rounded-full"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* PLEDGES TAB */}
      {activeTab === 'PLEDGES' && (
        <div className="space-y-6 animate-fade-in">
           {/* Pledge Summary Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                       <HandHeart className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Total Pledged</span>
                 </div>
                 <h3 className="text-3xl font-bold text-slate-800">$16,200</h3>
                 <p className="text-slate-500 text-xs mt-1">Across 2 active campaigns</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                       <Target className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Fulfilled</span>
                 </div>
                 <h3 className="text-3xl font-bold text-slate-800">53%</h3>
                 <p className="text-slate-500 text-xs mt-1">$8,700 received</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-red-50 rounded-lg">
                       <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">Outstanding</span>
                 </div>
                 <h3 className="text-3xl font-bold text-slate-800">$7,500</h3>
                 <p className="text-slate-500 text-xs mt-1">Due by year end</p>
              </div>
           </div>

           {/* Pledges List */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-lg font-semibold text-slate-800">Active Pledges</h3>
                 <div className="flex space-x-2">
                    <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center">
                       <Download className="w-4 h-4 mr-2" /> Report
                    </button>
                    <button className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center">
                       <Plus className="w-4 h-4 mr-2" /> New Pledge
                    </button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                       <tr>
                          <th className="px-6 py-3 text-left">Member</th>
                          <th className="px-6 py-3 text-left">Campaign</th>
                          <th className="px-6 py-3 text-left">Progress</th>
                          <th className="px-6 py-3 text-right">Pledged</th>
                          <th className="px-6 py-3 text-right">Fulfilled</th>
                          <th className="px-6 py-3 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {mockPledges.map(pledge => {
                          const percent = calculateProgress(pledge.amountFulfilled, pledge.amountPledged);
                          return (
                             <tr key={pledge.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{pledge.memberName}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{pledge.campaignName}</td>
                                <td className="px-6 py-4">
                                  <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1 text-right">{percent}%</div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium">{formatCurrency(pledge.amountPledged)}</td>
                                <td className="px-6 py-4 text-right text-emerald-600">{formatCurrency(pledge.amountFulfilled)}</td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-slate-400 hover:text-emerald-600">
                                     <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* EXPENSES TAB */}
      {activeTab === 'EXPENSES' && (
        <div className="space-y-6 animate-fade-in">
          {/* Budget Control */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <h3 className="text-lg font-semibold text-slate-800 mb-4">Department Budgets</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockBudgets.map(budget => {
                  const percent = calculateProgress(budget.spent, budget.allocated);
                  return (
                    <div key={budget.id} className="border border-slate-100 rounded-lg p-4">
                       <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase">{budget.department}</span>
                            <h4 className="font-semibold text-slate-800">{budget.name}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{formatCurrency(budget.spent)}</p>
                            <p className="text-xs text-slate-500">of {formatCurrency(budget.allocated)}</p>
                          </div>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${percent > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }}></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Expense Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-lg font-semibold text-slate-800">Expense Requests & Approvals</h3>
               <div className="flex items-center space-x-2">
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">
                     {expenseRequests.filter(r => r.status === 'Pending').length} Pending
                  </span>
               </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                      <tr>
                         <th className="px-6 py-3 text-left">Requester</th>
                         <th className="px-6 py-3 text-left">Category</th>
                         <th className="px-6 py-3 text-left">Description</th>
                         <th className="px-6 py-3 text-right">Amount</th>
                         <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {expenseRequests.map(req => (
                         <tr key={req.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-800">{req.requesterName}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{req.category}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                               {req.description}
                               <p className="text-xs text-slate-400">{req.date}</p>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold">{formatCurrency(req.amount)}</td>
                            <td className="px-6 py-4 text-center">
                               {req.status === 'Pending' ? (
                                  <div className="flex justify-center space-x-2">
                                     <button 
                                       onClick={() => handleExpenseAction(req.id, 'Approved')}
                                       className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Approve"
                                     >
                                        <CheckCircle className="w-5 h-5" />
                                     </button>
                                     <button 
                                       onClick={() => handleExpenseAction(req.id, 'Rejected')}
                                       className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject"
                                     >
                                        <XCircle className="w-5 h-5" />
                                     </button>
                                  </div>
                               ) : (
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                     {req.status}
                                  </span>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {/* CAMPAIGNS TAB */}
      {activeTab === 'CAMPAIGNS' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {mockCampaigns.map(campaign => {
               const percent = calculateProgress(campaign.raisedAmount, campaign.targetAmount);
               return (
                  <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
                     <div className={`absolute top-0 left-0 w-1 h-full ${campaign.color}`}></div>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <span className="text-xs font-bold text-slate-400 uppercase">Campaign</span>
                           <h3 className="text-xl font-bold text-slate-800">{campaign.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                           {campaign.status}
                        </span>
                     </div>
                     
                     <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                           <span className="text-slate-600">Raised: <strong>{formatCurrency(campaign.raisedAmount)}</strong></span>
                           <span className="text-slate-400">Goal: {formatCurrency(campaign.targetAmount)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                           <div className={`h-3 rounded-full ${campaign.color.replace('bg-', 'bg-opacity-90 bg-')}`} style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="mt-2 text-xs text-right text-slate-400">
                           Deadline: {campaign.deadline || 'N/A'}
                        </div>
                     </div>

                     <div className="flex justify-end space-x-2">
                        <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded">Edit</button>
                        <button className="px-3 py-2 text-sm bg-slate-900 text-white rounded hover:bg-slate-800">View Details</button>
                     </div>
                  </div>
               );
            })}
             <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
                <Plus className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="font-semibold text-slate-600">Create New Campaign</h3>
                <p className="text-sm text-slate-400">Set goals and track fundraising</p>
             </div>
         </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'REPORTS' && (
         <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center space-x-3 mb-2">
                     <div className="p-2 bg-blue-50 rounded-lg">
                        <FileBarChart className="w-5 h-5 text-blue-600" />
                     </div>
                     <h3 className="font-semibold text-slate-800">Generate Report</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Create custom financial statements.</p>
                  <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm">Create New</button>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center space-x-3 mb-2">
                     <div className="p-2 bg-purple-50 rounded-lg">
                        <PieIcon className="w-5 h-5 text-purple-600" />
                     </div>
                     <h3 className="font-semibold text-slate-800">Visual Analysis</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">View trends and department breakdowns.</p>
                  <button className="w-full py-2 border border-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-50">View Analytics</button>
               </div>
            </div>

            {/* Department Analysis Chart */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
               <h3 className="text-lg font-semibold text-slate-800 mb-6">Budget vs Actual by Department</h3>
               <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={departmentAnalysisData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="allocated" fill="#cbd5e1" name="Allocated" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="spent" fill="#10b981" name="Spent" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Report List */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Available Reports</h3>
               </div>
               <div className="divide-y divide-slate-100">
                  {mockReports.map(report => (
                     <div key={report.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center space-x-4">
                           <div className="p-2 bg-emerald-50 rounded text-emerald-600">
                              <FileText className="w-5 h-5" />
                           </div>
                           <div>
                              <h4 className="font-medium text-slate-800">{report.title}</h4>
                              <p className="text-xs text-slate-500">{report.dateRange} • Generated {report.generatedDate}</p>
                           </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                           <Download className="w-5 h-5" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
