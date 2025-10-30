import { Report, Notification } from '../../types';
import { User } from '../../App';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, Calendar, User as UserIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReportDetailsDialogProps {
  report: Report;
  currentUser: User;
  open: boolean;
  onClose: () => void;
  isMyReport?: boolean;
}

export function ReportDetailsDialog({ report, currentUser, open, onClose, isMyReport }: ReportDetailsDialogProps) {
  const handleClaim = () => {
    // Add claim request to report
    const reports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = reports.map(r => {
      if (r.id === report.id) {
        const claimRequests = r.claimRequests || [];
        // Check if already claimed
        if (claimRequests.some(cr => cr.userId === currentUser.id)) {
          toast.error('You have already sent a claim request for this item');
          return r;
        }
        return {
          ...r,
          status: 'claimed' as const,
          claimRequests: [
            ...claimRequests,
            {
              id: `claim-${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              requestedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return r;
    });
    localStorage.setItem('reports', JSON.stringify(updatedReports));

    // Notify report creator
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: report.userId,
      type: 'claim',
      message: `${currentUser.name} has claimed your found item: ${report.itemName}`,
      reportId: report.id,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Notify admin
    const adminNotification: Notification = {
      id: `notif-${Date.now() + 1}`,
      userId: 'admin-001',
      type: 'claim',
      message: `Claim request for "${report.itemName}" by ${currentUser.name}`,
      reportId: report.id,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification, adminNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success('Claim request sent successfully!');
    onClose();
  };

  const handleFound = () => {
    // Add found notification to report
    const reports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = reports.map(r => {
      if (r.id === report.id) {
        const foundNotifications = r.foundNotifications || [];
        // Check if already notified
        if (foundNotifications.some(fn => fn.userId === currentUser.id)) {
          toast.error('You have already sent a found notification for this item');
          return r;
        }
        return {
          ...r,
          status: 'found' as const,
          foundNotifications: [
            ...foundNotifications,
            {
              id: `found-${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              notifiedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return r;
    });
    localStorage.setItem('reports', JSON.stringify(updatedReports));

    // Notify report creator
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: report.userId,
      type: 'found',
      message: `${currentUser.name} has found your lost item: ${report.itemName}`,
      reportId: report.id,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Notify admin
    const adminNotification: Notification = {
      id: `notif-${Date.now() + 1}`,
      userId: 'admin-001',
      type: 'found',
      message: `Found notification for "${report.itemName}" by ${currentUser.name}`,
      reportId: report.id,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification, adminNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    toast.success('Found notification sent successfully!');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex gap-2 mb-2">
            <Badge variant={report.type === 'lost' ? 'destructive' : 'default'}>
              {report.type.toUpperCase()}
            </Badge>
            <Badge variant="outline">{report.category.replace('-', ' ')}</Badge>
          </div>
          <DialogTitle>{report.itemName}</DialogTitle>
          <DialogDescription>Report details and information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {report.photoUrl && (
            <div className="w-full">
              <img
                src={report.photoUrl}
                alt={report.itemName}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h4 className="text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{report.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <UserIcon className="w-4 h-4" />
                  <span>
                    Posted by: <span className="text-gray-900">{report.userName}</span> ({report.userType})
                  </span>
                </div>

                {report.type === 'lost' && report.dateLost && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Lost on: <span className="text-gray-900">{new Date(report.dateLost).toLocaleDateString()}</span>
                    </span>
                  </div>
                )}

                {report.type === 'found' && report.foundLocation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      Found at: <span className="text-gray-900">{report.foundLocation}</span>
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Posted: {new Date(report.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Status: <span className="text-gray-900">{report.status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Claim/Found Requests Info */}
          {report.claimRequests && report.claimRequests.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Claim Requests ({report.claimRequests.length})
              </h4>
              <div className="space-y-2">
                {report.claimRequests.map((claim) => (
                  <p key={claim.id} className="text-sm text-blue-800">
                    {claim.userName} - {new Date(claim.requestedAt).toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          )}

          {report.foundNotifications && report.foundNotifications.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Found Notifications ({report.foundNotifications.length})
              </h4>
              <div className="space-y-2">
                {report.foundNotifications.map((found) => (
                  <p key={found.id} className="text-sm text-green-800">
                    {found.userName} - {new Date(found.notifiedAt).toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons (only if not the report creator) */}
          {!isMyReport && report.userId !== currentUser.id && (
            <div className="flex gap-3 pt-4 border-t">
              {report.type === 'found' && (
                <Button onClick={handleClaim} className="flex-1">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Claim This Item
                </Button>
              )}
              {report.type === 'lost' && (
                <Button onClick={handleFound} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I Found This Item
                </Button>
              )}
            </div>
          )}

          {isMyReport && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                This is your report. Other users can send you claim/found notifications.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
