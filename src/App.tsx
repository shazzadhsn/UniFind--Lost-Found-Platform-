import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { RegisterPage } from './components/RegisterPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { initializeSampleData } from './utils/sampleData';

export type UserType = 'student' | 'faculty' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  universityId?: string;
  facultyCode?: string;
  isBanned?: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize sample data and check if user is logged in on mount
  useEffect(() => {
    initializeSampleData();
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      const user = JSON.parse(savedUser);
      if (user.type === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('user-dashboard');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.type === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('user-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'admin-login':
        return <AdminLoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'user-dashboard':
        return <UserDashboard user={currentUser!} onLogout={handleLogout} />;
      case 'admin-dashboard':
        return <AdminDashboard user={currentUser!} onLogout={handleLogout} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      <Toaster />
    </div>
  );
}