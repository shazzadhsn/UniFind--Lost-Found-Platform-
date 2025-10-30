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

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: User) => void;
}

export function RegisterPage({ onNavigate, onLogin }: RegisterPageProps) {
  const [userType, setUserType] = useState<'student' | 'faculty'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [facultyCode, setFacultyCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      type: userType,
      ...(userType === 'student' ? { universityId } : { facultyCode })
    };

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    toast.success('Registration successful! Welcome to UniFind!');
    onLogin(newUser);
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
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Join UniFind to report and find lost items</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>Register As</Label>
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-blue-600 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}