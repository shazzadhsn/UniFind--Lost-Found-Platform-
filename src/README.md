# UniFind - BUBT Lost & Found Application

## ✅ Complete HTML5, CSS3 (Tailwind), and Vanilla JavaScript Implementation

### ⭐ Key Features Implemented:

1. **✅ User Registration with Admin Approval** 
   - New users register and their account status is set to "pending"
   - Users CANNOT login until admin approves their account
   - Admin receives notification of new registration
   - Admin can approve or reject from "Pending Users" tab

2. **✅ Admin Dashboard** 
   - Pending Users Tab (NEW!) - Approve/Reject new registrations
   - Pending Reports - Approve/Reject submitted reports
   - Approved Reports - View active reports and mark complete
   - All Users - View all users, ban/unban functionality
   - Completed - Archive of completed and rejected reports

3. **✅ User Dashboard** 
   - All Reports - Browse approved lost/found items with filters
   - My Reports - View your own submissions with status tracking
   - Notifications - Real-time updates (green for approvals, red for rejections)
   - Create Report - Submit lost or found items

4. **✅ Complete Authentication System**
   - Student login (email + university ID)
   - Faculty login (email + faculty code)
   - Admin login (hardcoded credentials)
   - Account status validation (pending/approved/rejected/banned)

5. **✅ Notification System**
   - Registration approvals/rejections
   - Report approvals/rejections  
   - Claim and found requests
   - Report completion notifications

### 📁 File Structure:
```
├── index.html        - Main HTML file
├── app.js           - Core app logic, auth, pages
├── dashboards.js    - User & Admin dashboard functionality
├── style.css        - Custom CSS animations
└── README.md        - This file
```

### 🚀 Quick Start:
1. Open `index.html` in a web browser
2. No build process or npm install required!
3. Works completely offline after first load

### 🔐 Demo Credentials:

**Admin Account:**
- Email: `admin@bubt.edu.bd`
- Password: `admin123`

**Existing Approved Users:**
- Student: `ahmed.rahman@student.bubt.edu.bd` / ID: `20231001234` / (no password needed in demo)
- Student: `fatima.khan@student.bubt.edu.bd` / ID: `20231005678`
- Faculty: `mohammad.ali@faculty.bubt.edu.bd` / Code: `FAC001`

*Note: Password is not validated for demo accounts, just enter any password*

### 📋 Complete User Registration Flow:

1. **User Registration:**
   - Click "Register" on home page
   - Fill in details (name, email, ID/code, password)
   - Submit registration
   - See message: "Registration successful! Waiting for admin approval"
   - Redirected to login page

2. **Admin Approval:**
   - Admin logs in to admin dashboard
   - Goes to "Pending Users" tab (NEW!)
   - Sees the new registration
   - Clicks "Approve" or "Reject"
   - User receives notification

3. **User Login:**
   - If approved: User can now login successfully
   - If rejected: Login shows "Your account has been rejected"
   - If still pending: Login shows "Your account is pending admin approval"

### 🎨 Technologies Used:
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No frameworks, pure JS
- **LocalStorage** - Client-side data persistence
- **Lucide Icons** - Beautiful icon library

### 📊 Sample Data:
The application comes pre-loaded with:
- 3 approved users (1 faculty, 2 students)
- 2 sample reports (1 lost, 1 found)
- No pending registrations (test by creating new account)

### 🔧 Key Functions:

**Authentication:**
- `handleLogin()` - Validates credentials and account status
- `handleAdminLogin()` - Admin authentication
- `handleRegister()` - Creates pending user account

**Admin Operations:**
- `approveUser()` - Approve pending registration
- `rejectUser()` - Reject pending registration
- `approveReport()` - Approve submitted report
- `rejectReport()` - Reject submitted report
- `completeReport()` - Mark report as completed
- `toggleBan()` - Ban/unban user

**User Operations:**
- `submitReport()` - Create lost/found report
- `claimItem()` - Claim a found item
- `foundItem()` - Notify about finding a lost item
- `markRead()` - Mark notification as read

### 🎯 Testing the Admin Approval Feature:

1. Register a new account (student or faculty)
2. Try to login - you'll see "pending approval" message
3. Login as admin (admin@bubt.edu.bd / admin123)
4. Go to "Pending Users" tab
5. You'll see the new registration
6. Click "Approve"
7. Logout from admin
8. Login with the newly approved account - success!

### 🌟 Additional Features:
- Responsive design (mobile-friendly)
- Toast notifications for user feedback
- Modal dialogs for detailed views
- Real-time filtering and search
- Category-based filtering (8 categories)
- Status tracking for all reports
- Photo URL support for items
- Date/location tracking

### 💾 Data Persistence:
All data is stored in browser's LocalStorage:
- `users` - All registered users
- `reports` - All lost/found reports
- `notifications` - All notifications
- `currentUser` - Logged in user session
- `unifindInit` - Initialization flag

### 🔄 Clear Data:
To reset all data, open browser console and run:
```javascript
localStorage.clear();
location.reload();
```

### ✨ No Backend Required!
This is a complete frontend application that demonstrates:
- Complex state management
- Multi-user authentication
- Role-based access control (Admin vs User)
- Approval workflows
- Notification systems
- All without any backend server!

---

**Created for Bangladesh University of Business and Technology (BUBT)**
*Pure HTML, CSS, and JavaScript - No frameworks, no build tools, just works!*