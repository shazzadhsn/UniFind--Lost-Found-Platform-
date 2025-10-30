import { useState, useEffect } from 'react';
import { Report, Notification } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, Eye, MapPin, Calendar, User, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';

export function ApprovedReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const allReports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const activeReports = allReports.filter(
      r => r.status === 'approved' || r.status === 'claimed' || r.status === 'found'
    );
    setReports(activeReports);
  };

  const handleMarkComplete = (reportId: string) => {
    const allReports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = allReports.map(r =>
      r.id === reportId ? { ...r, status: 'completed' as const } : r
    );
    localStorage.setItem('reports', JSON.stringify(updatedReports));

    // Create notification for user
    const report = allReports.find(r => r.id === reportId);
    if (report) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: report.userId,
        type: 'completed',
        message: `Your ${report.type} report for "${report.itemName}" has been marked as completed.`,
        reportId: report.id,
        createdAt: new Date().toISOString(),
        read: false,
      };

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    toast.success('Report marked as completed!');
    setSelectedReport(null);
    loadReports();
  };

  const getStatusBadge = (report: Report) => {
    if (report.status === 'claimed') {
      return (
        <Badge className="bg-blue-100 text-blue-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          Has Claims ({report.claimRequests?.length || 0})
        </Badge>
      );
    }
    if (report.status === 'found') {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Found Notifications ({report.foundNotifications?.length || 0})
        </Badge>
      );
    }
    return <Badge variant="secondary">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Approved Reports</h2>
        <p className="text-gray-600">Manage active reports and mark them as completed</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No approved reports</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  {getStatusBadge(report)}
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

                <Button
                  className="w-full"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View & Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReport.itemName}</DialogTitle>
              <DialogDescription>Manage report and interactions</DialogDescription>
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
                  <span className="text-gray-600">Status:</span>
                  <span className="text-gray-900 ml-2">{selectedReport.status}</span>
                </div>
              </div>

              {/* Claim Requests */}
              {selectedReport.claimRequests && selectedReport.claimRequests.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-blue-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Claim Requests ({selectedReport.claimRequests.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedReport.claimRequests.map((claim) => (
                      <div key={claim.id} className="bg-white p-2 rounded text-sm">
                        <p className="text-gray-900">{claim.userName}</p>
                        <p className="text-gray-600">{new Date(claim.requestedAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Found Notifications */}
              {selectedReport.foundNotifications && selectedReport.foundNotifications.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Found Notifications ({selectedReport.foundNotifications.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedReport.foundNotifications.map((found) => (
                      <div key={found.id} className="bg-white p-2 rounded text-sm">
                        <p className="text-gray-900">{found.userName}</p>
                        <p className="text-gray-600">{new Date(found.notifiedAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  className="w-full"
                  onClick={() => handleMarkComplete(selectedReport.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Mark as completed once the item has been physically returned/received
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
