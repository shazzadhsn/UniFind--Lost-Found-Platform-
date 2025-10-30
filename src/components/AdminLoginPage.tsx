import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { User } from '../App';
import { toast } from 'sonner@2.0.3';

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: User) => void;
}

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@bubt.edu.bd',
  password: 'admin123'
};

export function AdminLoginPage({ onNavigate, onLogin }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Admin',
        email: ADMIN_CREDENTIALS.email,
        type: 'admin'
      };
      toast.success('Admin login successful!');
      onLogin(adminUser);
    } else {
      toast.error('Invalid admin credentials!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="secondary"
          onClick={() => onNavigate('home')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-2xl border-gray-700 bg-white">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Admin Portal</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bubt.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In as Admin
              </Button>
            </form>

            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                Demo credentials:<br />
                <span className="text-gray-900">admin@bubt.edu.bd / admin123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
