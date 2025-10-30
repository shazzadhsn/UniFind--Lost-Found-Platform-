import { useState, useEffect } from 'react';
import { Notification } from '../../types';
import { User } from '../../App';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, AlertCircle, Bell, Check } from 'lucide-react';

interface NotificationsProps {
  currentUser: User;
}

export function Notifications({ currentUser }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, [currentUser.id]);

  const loadNotifications = () => {
    const allNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = allNotifications
      .filter(n => n.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotifications(userNotifications);
  };

  const markAsRead = (notificationId: string) => {
    const allNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = allNotifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
    loadNotifications();
  };

  const markAllAsRead = () => {
    const allNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = allNotifications.map(n =>
      n.userId === currentUser.id ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
    loadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejection':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'claim':
      case 'found':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'approval':
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'rejection':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900 mb-2">Notifications</h2>
          <p className="text-gray-600">Stay updated on your reports and claims</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${getNotificationBg(notification.type)} ${
                !notification.read ? 'border-2' : 'border'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-gray-900">{notification.message}</p>
                      {!notification.read && (
                        <Badge variant="secondary" className="ml-2">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2"
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
