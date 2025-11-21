
import { Tenant, User, SystemConfig } from '../types';

const KEYS = {
  CONFIG: 'ecclesia_config',
  USERS: 'ecclesia_users',
  TENANTS: 'ecclesia_tenants',
};

// Initial Seed Data
const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't1',
    name: 'Grace Community Church',
    slug: 'grace-community',
    adminEmail: 'pastor@grace.com',
    status: 'Active',
    createdAt: new Date().toISOString(),
    memberCount: 1248,
    lastActive: 'Just now'
  },
  {
    id: 't2',
    name: 'River Valley Chapel',
    slug: 'river-valley',
    adminEmail: 'admin@rivervalley.com',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    memberCount: 450,
    lastActive: '2 days ago'
  }
];

export const storageService = {
  // System Initialization
  isInitialized: (): boolean => {
    const config = localStorage.getItem(KEYS.CONFIG);
    return !!config;
  },

  initSystem: (superAdmin: User) => {
    const config: SystemConfig = {
      isInitialized: true,
      superAdminId: superAdmin.id,
      version: '2.5.0',
      lastBackup: new Date().toISOString(),
    };
    
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
    localStorage.setItem(KEYS.USERS, JSON.stringify([superAdmin]));
    localStorage.setItem(KEYS.TENANTS, JSON.stringify(INITIAL_TENANTS));
  },

  // User Management
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  verifyLogin: (email: string, password: string): User | null => {
    // In a real app, we'd hash passwords. For mock prototype, we trust the email lookup
    // and assume 'password' is the password for everyone except the super admin setup
    const users = storageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) return null;
    
    // For prototype simplicity:
    // If it's the super admin created during onboarding, any password works for now
    // unless we stored it. But let's keep it simple.
    return user;
  },

  // Tenant Management
  getTenants: (): Tenant[] => {
    const data = localStorage.getItem(KEYS.TENANTS);
    return data ? JSON.parse(data) : [];
  },

  addTenant: (tenant: Tenant) => {
    const tenants = storageService.getTenants();
    tenants.push(tenant);
    localStorage.setItem(KEYS.TENANTS, JSON.stringify(tenants));
  },

  updateTenant: (updatedTenant: Tenant) => {
    const tenants = storageService.getTenants();
    const index = tenants.findIndex(t => t.id === updatedTenant.id);
    if (index !== -1) {
      tenants[index] = updatedTenant;
      localStorage.setItem(KEYS.TENANTS, JSON.stringify(tenants));
    }
  },
  
  resetSystem: () => {
    localStorage.removeItem(KEYS.CONFIG);
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.TENANTS);
    window.location.reload();
  }
};
