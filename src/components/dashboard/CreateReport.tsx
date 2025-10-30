import { useState } from 'react';
import { User } from '../../App';
import { Report, Category, ReportType } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreateReportProps {
  currentUser: User;
  onSuccess: () => void;
}

export function CreateReport({ currentUser, onSuccess }: CreateReportProps) {
  const [reportType, setReportType] = useState<ReportType>('lost');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [description, setDescription] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: Report = {
      id: `report-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userType: currentUser.type as 'student' | 'faculty',
      type: reportType,
      itemName,
      category,
      description,
      ...(reportType === 'lost' ? { dateLost } : { foundLocation }),
      ...(photoUrl ? { photoUrl } : {}),
      status: 'pending',
      createdAt: new Date().toISOString(),
      claimRequests: [],
      foundNotifications: [],
    };

    const reports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    reports.push(newReport);
    localStorage.setItem('reports', JSON.stringify(reports));

    // Create notification for admin
    const adminNotification = {
      id: `notif-${Date.now()}`,
      userId: 'admin-001',
      type: 'claim' as const,
      message: `New ${reportType} report submitted by ${currentUser.name}: ${itemName}`,
      reportId: newReport.id,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(adminNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success('Report submitted successfully! Waiting for admin approval.');
    
    // Reset form
    setItemName('');
    setCategory('other');
    setDescription('');
    setDateLost('');
    setFoundLocation('');
    setPhotoUrl('');
    
    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Create Report</h2>
        <p className="text-gray-600">Report a lost or found item on campus</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>Fill in the information about the item</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="lost">Lost Item</TabsTrigger>
              <TabsTrigger value="found">Found Item</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  placeholder="e.g., Black Laptop, Student ID Card"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stationary">Stationary</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="id-cards">ID Cards</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the item..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <TabsContent value="lost" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="dateLost">Date Lost *</Label>
                  <Input
                    id="dateLost"
                    type="date"
                    value={dateLost}
                    onChange={(e) => setDateLost(e.target.value)}
                    required={reportType === 'lost'}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="found" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="foundLocation">Found Location *</Label>
                  <Input
                    id="foundLocation"
                    placeholder="e.g., Library 2nd Floor, Main Building Cafeteria"
                    value={foundLocation}
                    onChange={(e) => setFoundLocation(e.target.value)}
                    required={reportType === 'found'}
                  />
                </div>
              </TabsContent>

              <div className="space-y-2">
                <Label htmlFor="photoUrl">Photo URL (Optional)</Label>
                <Input
                  id="photoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Paste a link to a photo of the item (helps with identification)
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setItemName('');
                  setCategory('other');
                  setDescription('');
                  setDateLost('');
                  setFoundLocation('');
                  setPhotoUrl('');
                }}>
                  Clear Form
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="text-blue-900 mb-2">Important Notes</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>All reports require admin approval before being published</li>
            <li>Provide accurate and detailed information to help others identify the item</li>
            <li>You'll receive notifications about your report status</li>
            <li>Photos greatly increase the chances of successful matches</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
