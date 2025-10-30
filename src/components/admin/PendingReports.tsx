import { useState, useEffect } from 'react';
import { Report, Notification } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Eye, MapPin, Calendar, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';

export function PendingReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const allReports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const pendingReports = allReports.filter(r => r.status === 'pending');
    setReports(pendingReports);
  };

  const handleApprove = (reportId: string) => {
    const allReports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = allReports.map(r =>
      r.id === reportId ? { ...r, status: 'approved' as const } : r
    );
    localStorage.setItem('reports', JSON.stringify(updatedReports));

    // Create notification for user
    const report = allReports.find(r => r.id === reportId);
    if (report) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: report.userId,
        type: 'approval',
        message: `Your ${report.type} report for "${report.itemName}" has been approved and is now visible to everyone.`,
        reportId: report.id,
        createdAt: new Date().toISOString(),
        read: false,
      };

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    toast.success('Report approved successfully!');
    setSelectedReport(null);
    loadReports();
  };

  const handleReject = (reportId: string) => {
    const allReports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = allReports.map(r =>
      r.id === reportId ? { ...r, status: 'rejected' as const } : r
    );
    localStorage.setItem('reports', JSON.stringify(updatedReports));

    // Create notification for user
    const report = allReports.find(r => r.id === reportId);
    if (report) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: report.userId,
        type: 'rejection',
        message: `Your ${report.type} report for "${report.itemName}" has been rejected. Please contact admin for more information.`,
        reportId: report.id,
        createdAt: new Date().toISOString(),
        read: false,
      };

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    toast.success('Report rejected.');
    setSelectedReport(null);
    loadReports();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Pending Reports</h2>
        <p className="text-gray-600">Review and approve or reject submitted reports</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pending reports to review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">Pending Review</Badge>
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
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{report.userName} ({report.userType})</span>
                  </div>
                  {report.type === 'lost' && report.dateLost && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Lost: {new Date(report.dateLost).toLocaleDateString()}</span>
                    </div>
                  )}
                  {report.type === 'found' && report.foundLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{report.foundLocation}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => handleApprove(report.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    className="flex-1"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(report.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedReport.itemName}</DialogTitle>
              <DialogDescription>Review report details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedReport.photoUrl && (
                <img
                  src={selectedReport.photoUrl}
                  alt={selectedReport.itemName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900 ml-2">{selectedReport.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-900 ml-2">{selectedReport.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Posted by:</span>
                  <span className="text-gray-900 ml-2">{selectedReport.userName}</span>
                </div>
                <div>
                  <span className="text-gray-600">User type:</span>
                  <span className="text-gray-900 ml-2">{selectedReport.userType}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={() => handleApprove(selectedReport.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Report
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => handleReject(selectedReport.id)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
