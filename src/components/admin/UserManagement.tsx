import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Ban, Search, User as UserIcon, Mail, Hash } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = () => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers);
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.universityId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.facultyCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleBanToggle = (userId: string) => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, isBanned: !u.isBanned } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      toast.success(user.isBanned ? `${user.name} has been unbanned` : `${user.name} has been banned`);
    }
    
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">View and manage registered users</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {users.length === 0 ? 'No registered users yet' : 'No users match your search'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>ID/Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.type === 'student' ? 'default' : 'secondary'}>
                          {user.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          {user.universityId || user.facultyCode || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.isBanned ? (
                          <Badge variant="destructive">Banned</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={user.isBanned ? 'outline' : 'destructive'}
                          onClick={() => handleBanToggle(user.id)}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Total Users: {users.length} | Banned: {users.filter(u => u.isBanned).length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
