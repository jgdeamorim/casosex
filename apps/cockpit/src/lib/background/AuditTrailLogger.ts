/**
 * AuditTrailLogger: Trilha Auditável B2B sob a doutrina medido=verdade
 */

export interface AuditEntry {
  timestamp: string;
  userRole: string;
  action: string;
  details: string;
}

const auditLog: AuditEntry[] = [];

export function logAudit(userRole: string, action: string, details: string): void {
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    userRole,
    action,
    details
  };

  auditLog.push(entry);
}

export function getAuditLogs(): readonly AuditEntry[] {
  return auditLog;
}
