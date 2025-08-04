import { useState, useEffect } from 'react';

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  ticketId?: string;
  entityType: 'ticket' | 'user' | 'system';
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

const mockLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'ticket_created',
    description: 'New ticket created: WiFi not working in Library',
    userId: '1',
    userName: 'Rahul Sharma',
    ticketId: '1',
    entityType: 'ticket',
    entityId: '1',
    metadata: { category: 'IT', priority: 'high' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    action: 'ticket_assigned',
    description: 'Ticket assigned to IT Support Team',
    userId: '3',
    userName: 'Admin User',
    ticketId: '2',
    entityType: 'ticket',
    entityId: '2',
    metadata: { assignedTo: '2', assignedToName: 'IT Support Team' },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    action: 'status_changed',
    description: 'Ticket status changed from "open" to "in-progress"',
    userId: '2',
    userName: 'IT Support Team',
    ticketId: '2',
    entityType: 'ticket',
    entityId: '2',
    metadata: { oldStatus: 'open', newStatus: 'in-progress' },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    action: 'user_created',
    description: 'New user account created',
    userId: '3',
    userName: 'Admin User',
    entityType: 'user',
    entityId: '4',
    metadata: { newUserName: 'Priya Patel', role: 'student' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    action: 'message_added',
    description: 'New message added to ticket',
    userId: '2',
    userName: 'IT Support Team',
    ticketId: '1',
    entityType: 'ticket',
    entityId: '1',
    metadata: { messageType: 'public' },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export function useActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLogs(mockLogs);
      setIsLoading(false);
    }, 800);
  }, []);

  const addLog = (log: Omit<ActivityLog, 'id' | 'createdAt'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const getLogsByTicket = (ticketId: string) => {
    return logs.filter(log => log.ticketId === ticketId);
  };

  const getLogsByUser = (userId: string) => {
    return logs.filter(log => log.userId === userId);
  };

  const getLogsByEntityType = (entityType: ActivityLog['entityType']) => {
    return logs.filter(log => log.entityType === entityType);
  };

  const getRecentLogs = (limit: number = 10) => {
    return logs.slice(0, limit);
  };

  const getActionIcon = (action: string): string => {
    switch (action) {
      case 'ticket_created': return '🎫';
      case 'ticket_assigned': return '👤';
      case 'status_changed': return '🔄';
      case 'user_created': return '👥';
      case 'message_added': return '💬';
      case 'file_uploaded': return '📎';
      case 'priority_changed': return '⚡';
      case 'ticket_resolved': return '✅';
      case 'ticket_closed': return '🔒';
      default: return '📝';
    }
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'ticket_created': return 'text-blue-600';
      case 'ticket_assigned': return 'text-purple-600';
      case 'status_changed': return 'text-orange-600';
      case 'user_created': return 'text-green-600';
      case 'message_added': return 'text-blue-500';
      case 'file_uploaded': return 'text-gray-600';
      case 'priority_changed': return 'text-red-600';
      case 'ticket_resolved': return 'text-green-500';
      case 'ticket_closed': return 'text-gray-500';
      default: return 'text-gray-600';
    }
  };

  return {
    logs,
    isLoading,
    addLog,
    getLogsByTicket,
    getLogsByUser,
    getLogsByEntityType,
    getRecentLogs,
    getActionIcon,
    getActionColor,
  };
}