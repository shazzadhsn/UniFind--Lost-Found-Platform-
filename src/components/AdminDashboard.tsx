import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Shield, LogOut, Clock, CheckCircle, Users, FileCheck } from 'lucide-react';
import { PendingReports } from './admin/PendingReports';
import { ApprovedReports } from './admin/ApprovedReports';
import { UserManagement } from './admin/UserManagement';
import { CompletedReports } from './admin/CompletedReports';
import bubtLogo from 'figma:asset/214c4e35fc9a4a250613608e16c49b5b475361e2.png';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'users' | 'completed'>('pending');

  const navItems = [
    { id: 'pending' as const, label: 'Pending Reports', icon: Clock },
    { id: 'approved' as const, label: 'Approved Reports', icon: CheckCircle },
    { id: 'users' as const, label: 'User Management', icon: Users },
    { id: 'completed' as const, label: 'Completed & Rejected', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-blue-900 text-white border-b border-purple-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={bubtLogo} alt="BUBT Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
              <div>
                <h1>Admin Dashboard</h1>
                <p className="text-sm text-purple-200">UniFind - BUBT</p>
              </div>
            </div>
            <Button variant="secondary" onClick={onLogout}>
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
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === item.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'pending' && <PendingReports />}
        {activeTab === 'approved' && <ApprovedReports />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'completed' && <CompletedReports />}
      </main>
    </div>
  );
}