import { useState, useEffect } from 'react';
import { Report, Category } from '../../types';
import { User } from '../../App';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Search, Eye, MapPin, Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { ReportDetailsDialog } from './ReportDetailsDialog';

interface MyReportsProps {
  currentUser: User;
}

export function MyReports({ currentUser }: MyReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports();
  }, [currentUser.id]);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, categoryFilter, statusFilter]);

  const loadReports = () => {
    const allReports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const myReports = allReports.filter(r => r.userId === currentUser.id);
    setReports(myReports);
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(r => r.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const getCategoryColor = (category: Category) => {
    const colors: Record<Category, string> = {
      'stationary': 'bg-blue-100 text-blue-700',
      'electronics': 'bg-purple-100 text-purple-700',
      'books': 'bg-green-100 text-green-700',
      'id-cards': 'bg-red-100 text-red-700',
      'bags': 'bg-yellow-100 text-yellow-700',
      'accessories': 'bg-pink-100 text-pink-700',
      'clothing': 'bg-indigo-100 text-indigo-700',
      'other': 'bg-gray-100 text-gray-700',
    };
    return colors[category];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { icon: any; variant: any; label: string }> = {
      pending: { icon: Clock, variant: 'secondary' as const, label: 'Pending Approval' },
      approved: { icon: CheckCircle, variant: 'default' as const, label: 'Active' },
      claimed: { icon: AlertCircle, variant: 'default' as const, label: 'Claim Request' },
      found: { icon: AlertCircle, variant: 'default' as const, label: 'Found Notification' },
      completed: { icon: CheckCircle, variant: 'default' as const, label: 'Completed' },
      rejected: { icon: XCircle, variant: 'destructive' as const, label: 'Rejected' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">My Reports</h2>
        <p className="text-gray-600">View and manage all your lost and found reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Active</SelectItem>
              <SelectItem value="claimed">Claimed</SelectItem>
              <SelectItem value="found">Found</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              {reports.length === 0 
                ? "You haven't created any reports yet." 
                : "No reports match your filters."}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(report.category)}>
                    {report.category.replace('-', ' ')}
                  </Badge>
                  <Badge variant={report.type === 'lost' ? 'destructive' : 'default'}>
                    {report.type.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1">{report.itemName}</CardTitle>
                <CardDescription className="line-clamp-2">{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.photoUrl && (
                  <img 
                    src={report.photoUrl} 
                    alt={report.itemName} 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                
                <div className="space-y-2 text-sm text-gray-600">
                  {report.type === 'lost' && report.dateLost && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Lost on {new Date(report.dateLost).toLocaleDateString()}</span>
                    </div>
                  )}
                  {report.type === 'found' && report.foundLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{report.foundLocation}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  {getStatusBadge(report.status)}
                </div>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Report Details Dialog */}
      {selectedReport && (
        <ReportDetailsDialog
          report={selectedReport}
          currentUser={currentUser}
          open={!!selectedReport}
          onClose={() => {
            setSelectedReport(null);
            loadReports();
          }}
          isMyReport={true}
        />
      )}
    </div>
  );
}
