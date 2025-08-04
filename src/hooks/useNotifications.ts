import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  ticketId?: string;
  userId: string;
  read: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Ticket Status Updated',
    message: 'Your ticket "WiFi not working" has been assigned to IT Support.',
    type: 'info',
    ticketId: '1',
    userId: '1',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'New Message',
    message: 'IT Support has replied to your ticket.',
    type: 'info',
    ticketId: '2',
    userId: '1',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Ticket Resolved',
    message: 'Your AC repair request has been marked as resolved.',
    type: 'success',
    ticketId: '3',
    userId: '1',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications.filter(n => n.userId === userId));
      setIsLoading(false);
    }, 500);
  }, [userId]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return {
    notifications,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
  };
}