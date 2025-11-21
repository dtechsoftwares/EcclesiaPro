
import { AuditLogEntry, User } from '../types';

// Mock storage for audit logs
let auditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    userId: 'u1',
    userName: 'Rev. Admin',
    action: 'SYSTEM_STARTUP',
    module: 'SYSTEM',
    details: 'System initialized successfully',
    ipAddress: '192.168.1.1',
    severity: 'INFO'
  }
];

export const logAction = (
  user: User | null,
  action: string,
  module: string,
  details: string,
  severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO'
) => {
  const newLog: AuditLogEntry = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    userId: user?.id || 'system',
    userName: user?.name || 'System',
    action,
    module,
    details,
    ipAddress: '192.168.1.1', // Simulated IP
    severity
  };
  
  auditLogs = [newLog, ...auditLogs];
  console.log(`[AUDIT] ${module}: ${action} - ${details}`);
};

export const getAuditLogs = (): AuditLogEntry[] => {
  return auditLogs;
};

export const clearLogs = () => {
  // In a real app, this would likely only be archival, not delete
  auditLogs = [];
};
