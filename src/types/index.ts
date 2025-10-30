export type ReportStatus = 'pending' | 'approved' | 'claimed' | 'found' | 'completed' | 'rejected';
export type ReportType = 'lost' | 'found';
export type Category = 'stationary' | 'electronics' | 'books' | 'id-cards' | 'bags' | 'accessories' | 'clothing' | 'other';

export interface Report {
  id: string;
  userId: string;
  userName: string;
  userType: 'student' | 'faculty';
  type: ReportType;
  itemName: string;
  category: Category;
  description: string;
  dateLost?: string;
  foundLocation?: string;
  photoUrl?: string;
  status: ReportStatus;
  createdAt: string;
  claimRequests?: ClaimRequest[];
  foundNotifications?: FoundNotification[];
}

export interface ClaimRequest {
  id: string;
  userId: string;
  userName: string;
  requestedAt: string;
}

export interface FoundNotification {
  id: string;
  userId: string;
  userName: string;
  notifiedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'approval' | 'rejection' | 'claim' | 'found' | 'completed';
  message: string;
  reportId?: string;
  createdAt: string;
  read: boolean;
}
