
export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  SUPER_ADMIN = 'SUPER_ADMIN',
  DASHBOARD = 'DASHBOARD',
  MEMBERS = 'MEMBERS',
  VISITORS = 'VISITORS',
  ATTENDANCE = 'ATTENDANCE',
  FINANCE = 'FINANCE',
  BULK_SMS = 'BULK_SMS',
  EQUIPMENT = 'EQUIPMENT',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SOUL_TRACKING = 'SOUL_TRACKING',
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'VIEWER';

export interface Tenant {
  id: string;
  name: string;
  slug: string; // url-friendly id
  adminEmail: string;
  contactPhone?: string;
  address?: string;
  status: 'Active' | 'Suspended' | 'Trial';
  createdAt: string;
  memberCount: number; // Mock stat
  lastActive: string;
}

export interface SystemConfig {
  isInitialized: boolean;
  superAdminId: string;
  version: string;
  lastBackup?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  tenantId?: string; // Null if Super Admin
}

// ... Existing Interfaces ...

export interface MemberDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export type MemberStatus = 'Active' | 'Inactive' | 'New' | 'Onboarding' | 'Transferred' | 'Under Discipline';

export interface LifecycleEvent {
  id: string;
  date: string;
  type: 'Status Change' | 'Milestone' | 'Renewal' | 'Transfer' | 'Note';
  description: string;
  metadata?: string;
}

export interface OnboardingTask {
  id: string;
  label: string;
  completed: boolean;
  completedDate?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: MemberStatus;
  joinDate: string;
  avatar: string;
  dob?: string;
  weddingAnniversary?: string;
  emergencyContact: EmergencyContact;
  customFields: CustomField[];
  documents: MemberDocument[];
  lifecycleEvents: LifecycleEvent[];
  onboardingTasks: OnboardingTask[];
  lastRenewalDate?: string;
}

export interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  visitDate: string;
  status: 'New' | 'Follow-up' | 'Converted' | 'Cold';
  source: string;
  assignedTo?: string;
  notes?: string;
  followUpStatus: 'Pending' | 'Completed' | 'Overdue';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
  status: 'Completed' | 'Pending';
  method?: string;
  campaignId?: string;
}

export interface DonationCampaign {
  id: string;
  name: string;
  targetAmount: number;
  raisedAmount: number;
  deadline?: string;
  color: string;
  status: 'Active' | 'Completed' | 'Paused';
}

export interface RecurringDonation {
  id: string;
  donorName: string;
  amount: number;
  frequency: 'Weekly' | 'Monthly' | 'Bi-Weekly';
  nextDate: string;
  status: 'Active' | 'Failed' | 'Paused';
  paymentMethod: string;
}

export interface Pledge {
  id: string;
  memberId: string;
  memberName: string;
  campaignId: string;
  campaignName: string;
  amountPledged: number;
  amountFulfilled: number;
  status: 'Active' | 'Fulfilled' | 'Behind';
  startDate: string;
  endDate: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  department: string;
  allocated: number;
  spent: number;
}

export interface ExpenseRequest {
  id: string;
  requesterName: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptUrl?: string;
}

export interface FinancialReport {
  id: string;
  title: string;
  type: 'Monthly' | 'Annual' | 'Custom';
  dateRange: string;
  generatedDate: string;
  status: 'Ready' | 'Processing';
}

export interface AttendanceSession {
  id: string;
  date: string;
  serviceName: string;
  attendees: number;
  visitors: number;
  status: 'Active' | 'Completed';
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  avatar?: string;
  checkInTime: string;
  method: 'QR' | 'Manual' | 'Mobile';
  status: 'Present' | 'Late';
}

export type EquipmentStatus = 'Available' | 'In Use' | 'Maintenance' | 'Retired' | 'Lost';
export type EquipmentCategory = 'Audio' | 'Video' | 'Lighting' | 'Instruments' | 'IT' | 'Furniture';

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  serialNumber: string;
  purchaseDate: string;
  cost: number;
  status: EquipmentStatus;
  location: string;
  assignedTo?: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  lastMaintenance?: string;
  nextMaintenance?: string;
  notes?: string;
}

export interface SmsTemplate {
  id: string;
  name: string;
  content: string;
}

export interface PrayerRequest {
  id: string;
  requesterName: string;
  request: string;
  date: string;
  isAnonymous: boolean;
  status: 'Open' | 'Prayed For' | 'Answered';
  responses: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachment?: { name: string; type: string };
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'Direct' | 'Group';
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  avatar?: string;
}

export interface GeminiResponse {
  text: string;
  loading: boolean;
  error: string | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

// SOUL TRACKING INTERFACES
export interface Shepherd {
  id: string;
  name: string;
  avatar?: string;
  activeSouls: number;
}

export interface SpiritualMilestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedDate?: string;
  category: 'Foundation' | 'Sacrament' | 'Service' | 'Maturity';
}

export interface SoulNote {
  id: string;
  date: string;
  content: string;
  type: 'Check-up' | 'Confession' | 'Prayer' | 'General';
  author: string;
  isPrivate: boolean;
}

export interface Soul {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
  status: 'New Convert' | 'Growing' | 'Mature' | 'Backslidden' | 'Restored';
  spiritualStage: 'Salvation' | 'Baptism' | 'Discipleship' | 'Worker' | 'Leader';
  assignedShepherdId?: string;
  lastContactDate: string;
  attendanceRate: number; // Percentage
  milestones: SpiritualMilestone[];
  notes: SoulNote[];
}
