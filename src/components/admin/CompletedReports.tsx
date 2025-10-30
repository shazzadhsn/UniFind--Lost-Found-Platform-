import { useState, useEffect } from 'react';
import { Report } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CheckCircle, XCircle, Eye, MapPin, Calendar, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

export function CompletedReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<'completed' | 'rejected'>('completed');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const allReports: Report[] = JSON.parse(localStorage.getItem('reports') || '[]');
    const finalReports = allReports.filter(
      r => r.status === 'completed' || r.status === 'rejected'
    );
    setReports(finalReports);
  };

  const completedReports = reports.filter(r => r.status === 'completed');
  const rejectedReports = reports.filter(r => r.status === 'rejected');

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={report.status === 'completed' ? 'default' : 'destructive'}>
            {report.status === 'completed' ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Rejected
              </>
            )}
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
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="sm"
          variant="outline"
          onClick={() => setSelectedReport(report)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Completed & Rejected Reports</h2>
        <p className="text-gray-600">View archived reports</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'completed' | 'rejected')}>
        <TabsList>
          <TabsTrigger value="completed">
            Completed ({completedReports.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="mt-6">
          {completedReports.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No completed reports</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedReports.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No rejected reports</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReport.itemName}</DialogTitle>
              <DialogDescription>Report details</DialogDescription>
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
                  <Badge variant={selectedReport.status === 'completed' ? 'default' : 'destructive'}>
                    {selectedReport.status}
                  </Badge>
                </div>
              </div>

              {selectedReport.status === 'completed' && (
                <>
                  {selectedReport.claimRequests && selectedReport.claimRequests.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-blue-900 mb-2">Claim Requests</h4>
                      <div className="space-y-1">
                        {selectedReport.claimRequests.map((claim) => (
                          <p key={claim.id} className="text-sm text-blue-800">
                            {claim.userName} - {new Date(claim.requestedAt).toLocaleString()}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReport.foundNotifications && selectedReport.foundNotifications.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="text-green-900 mb-2">Found Notifications</h4>
                      <div className="space-y-1">
                        {selectedReport.foundNotifications.map((found) => (
                          <p key={found.id} className="text-sm text-green-800">
                            {found.userName} - {new Date(found.notifiedAt).toLocaleString()}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
