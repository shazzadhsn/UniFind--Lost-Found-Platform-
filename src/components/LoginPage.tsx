import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Search } from 'lucide-react';
import { User } from '../App';
import { toast } from 'sonner@2.0.3';
import bubtLogo from 'figma:asset/214c4e35fc9a4a250613608e16c49b5b475361e2.png';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [userType, setUserType] = useState<'student' | 'faculty'>('student');
  const [email, setEmail] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [facultyCode, setFacultyCode] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - check localStorage for registered users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    let user;
    if (userType === 'student') {
      user = users.find((u: User) => 
        u.type === 'student' && 
        (u.email === email || u.universityId === universityId)
      );
    } else {
      user = users.find((u: User) => 
        u.type === 'faculty' && 
        (u.email === email || u.facultyCode === facultyCode)
      );
    }

    if (user && !user.isBanned) {
      toast.success('Login successful!');
      onLogin(user);
    } else if (user && user.isBanned) {
      toast.error('Your account has been banned. Please contact admin.');
    } else {
      toast.error('Invalid credentials. Please try again or register.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-gray-200">
          <CardHeader className="text-center">
            <img src={bubtLogo} alt="BUBT Logo" className="w-20 h-20 object-contain mx-auto mb-4" />
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your UniFind account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Login As</Label>
                <Select value={userType} onValueChange={(value: 'student' | 'faculty') => setUserType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {userType === 'student' ? (
                <div className="space-y-2">
                  <Label htmlFor="universityId">University ID</Label>
                  <Input
                    id="universityId"
                    placeholder="e.g., 20231234567"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="facultyCode">Faculty Code</Label>
                  <Input
                    id="facultyCode"
                    placeholder="e.g., FAC001"
                    value={facultyCode}
                    onChange={(e) => setFacultyCode(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-blue-600 hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}