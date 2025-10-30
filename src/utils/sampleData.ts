import { Report, Notification } from '../types';
import { User } from '../App';

// Sample users for testing
export const sampleUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@student.bubt.edu.bd',
    type: 'student',
    universityId: '20231001234',
    isBanned: false,
  },
  {
    id: 'user-2',
    name: 'Fatima Khan',
    email: 'fatima.khan@student.bubt.edu.bd',
    type: 'student',
    universityId: '20231005678',
    isBanned: false,
  },
  {
    id: 'user-3',
    name: 'Dr. Mohammad Ali',
    email: 'mohammad.ali@faculty.bubt.edu.bd',
    type: 'faculty',
    facultyCode: 'FAC001',
    isBanned: false,
  },
];

// Sample reports for testing
export const sampleReports: Report[] = [
  {
    id: 'report-1',
    userId: 'user-1',
    userName: 'Ahmed Rahman',
    userType: 'student',
    type: 'lost',
    itemName: 'Black Laptop Bag',
    category: 'bags',
    description: 'Lost my black laptop bag in the library on the 3rd floor. Contains a Dell laptop and some important documents.',
    dateLost: '2025-10-28',
    status: 'approved',
    createdAt: '2025-10-28T10:30:00.000Z',
    claimRequests: [],
    foundNotifications: [],
  },
  {
    id: 'report-2',
    userId: 'user-2',
    userName: 'Fatima Khan',
    userType: 'student',
    type: 'found',
    itemName: 'Student ID Card',
    category: 'id-cards',
    description: 'Found a student ID card near the cafeteria. ID number starts with 2023...',
    foundLocation: 'Main Building Cafeteria',
    photoUrl: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=400',
    status: 'approved',
    createdAt: '2025-10-29T14:15:00.000Z',
    claimRequests: [],
    foundNotifications: [],
  },
  {
    id: 'report-3',
    userId: 'user-3',
    userName: 'Dr. Mohammad Ali',
    userType: 'faculty',
    type: 'lost',
    itemName: 'Red Umbrella',
    category: 'other',
    description: 'Lost my red umbrella in Room 305 after the morning class.',
    dateLost: '2025-10-29',
    status: 'approved',
    createdAt: '2025-10-29T11:00:00.000Z',
    claimRequests: [],
    foundNotifications: [],
  },
  {
    id: 'report-4',
    userId: 'user-1',
    userName: 'Ahmed Rahman',
    userType: 'student',
    type: 'found',
    itemName: 'USB Flash Drive',
    category: 'electronics',
    description: 'Found a 32GB SanDisk USB drive in Computer Lab 2.',
    foundLocation: 'Computer Lab 2, 2nd Floor',
    status: 'approved',
    createdAt: '2025-10-30T09:45:00.000Z',
    claimRequests: [],
    foundNotifications: [],
  },
];

// Initialize sample data if localStorage is empty
export function initializeSampleData() {
  // Only initialize if there's no data
  if (!localStorage.getItem('dataInitialized')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
    localStorage.setItem('reports', JSON.stringify(sampleReports));
    localStorage.setItem('notifications', JSON.stringify([]));
    localStorage.setItem('dataInitialized', 'true');
  }
}
