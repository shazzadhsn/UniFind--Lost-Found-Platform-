import { useState, useEffect } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Search, LogOut, Home, FileText, Bell, PlusCircle } from 'lucide-react';
import { AllReports } from './dashboard/AllReports';
import { MyReports } from './dashboard/MyReports';
import { Notifications } from './dashboard/Notifications';
import { CreateReport } from './dashboard/CreateReport';
import { Notification } from '../types';
import bubtLogo from 'figma:asset/214c4e35fc9a4a250613608e16c49b5b475361e2.png';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'my-reports' | 'notifications' | 'create'>('home');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Count unread notifications
    const notifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = notifications.filter(n => n.userId === user.id && !n.read);
    setUnreadCount(userNotifications.length);
  }, [user.id, activeTab]);

  const navItems = [
    { id: 'home' as const, label: 'All Reports', icon: Home },
    { id: 'my-reports' as const, label: 'My Reports', icon: FileText },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'create' as const, label: 'Create Report', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={bubtLogo} alt="BUBT Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-gray-900">UniFind</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap relative ${
                    activeTab === item.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && <AllReports currentUser={user} />}
        {activeTab === 'my-reports' && <MyReports currentUser={user} />}
        {activeTab === 'notifications' && <Notifications currentUser={user} />}
        {activeTab === 'create' && <CreateReport currentUser={user} onSuccess={() => setActiveTab('my-reports')} />}
      </main>
    </div>
  );
}