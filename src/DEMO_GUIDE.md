# 🎯 UniFind Demo & Testing Guide

## Quick Demo Walkthrough

### 1. Testing Admin Approval for Registration ✅

**Step 1: Register a New User**
1. Open `index.html` in your browser
2. Click "Register" button
3. Fill in the form:
   - Register As: Student
   - Name: Test Student
   - Email: test@student.bubt.edu.bd
   - University ID: 20239999
   - Password: test123
   - Confirm Password: test123
4. Click "Create Account"
5. You'll see: "Registration successful! Waiting for admin approval"
6. You're redirected to login page

**Step 2: Try to Login (Will Fail)**
1. Try to login with the credentials you just created
2. You'll see an error: "Your account is pending admin approval"
3. This proves the approval system is working!

**Step 3: Admin Approves the User**
1. Click "Admin Login" button (bottom right)
2. Login with:
   - Email: admin@bubt.edu.bd
   - Password: admin123
3. You'll see the Admin Dashboard
4. Click on "Pending Users" tab (first tab)
5. You'll see "Test Student" waiting for approval
6. Click the green "Approve" button
7. Success! User is now approved

**Step 4: User Can Now Login**
1. Click "Logout"
2. Click "Login" on home page
3. Login with:
   - Login As: Student
   - Email: test@student.bubt.edu.bd
   - University ID: 20239999
   - Password: anything (not validated in demo)
4. SUCCESS! You're now in the user dashboard

---

### 2. Testing Report Creation & Approval

**Create a Report:**
1. In user dashboard, click "Create Report" tab
2. Choose "Lost Item" or "Found Item"
3. Fill in details:
   - Item Name: My Laptop
   - Category: Electronics
   - Description: Lost my silver HP laptop in library
   - Date Lost: (select today)
   - Photo URL: (optional)
4. Click "Submit Report"
5. You'll see: "Report submitted! Waiting for admin approval"

**Admin Approves Report:**
1. Logout and login as admin
2. Go to "Pending Reports" tab
3. You'll see "My Laptop" report
4. Click green "Approve" button
5. Report is now visible to all users!

**View Approved Report:**
1. Logout admin, login as any user
2. Go to "All Reports" tab
3. You'll see "My Laptop" in the list
4. Click "View Details"
5. Other users can now click "I Found This" to help!

---

### 3. Testing Claim & Found System

**Claim a Found Item:**
1. Login as a user
2. Go to "All Reports" tab
3. Find a "FOUND" item
4. Click "View Details"
5. Click "Claim This Item" button
6. Notification sent to item owner and admin!

**Report Finding a Lost Item:**
1. Login as a user
2. Find a "LOST" item in "All Reports"
3. Click "View Details"
4. Click "I Found This Item" button
5. Owner gets notified!

---

### 4. Testing Notifications

**User Notifications:**
1. Login as a user
2. Click "Notifications" tab
3. You'll see:
   - Green background: Approvals/Completions
   - Red background: Rejections
   - Blue background: Claims/Found notifications
4. Click "Mark as read" on unread notifications

---

### 5. Testing Admin Features

**Manage Users:**
1. Login as admin
2. Go to "All Users" tab
3. You'll see all registered users
4. Click "Ban" to ban a user
5. That user can no longer login!

**Complete Reports:**
1. Go to "Approved Reports" tab
2. See reports with claims/found notifications
3. Click "Mark Complete" when item is returned
4. Report moves to "Completed" tab

**View Completed & Rejected:**
1. Go to "Completed" tab
2. See archive of all finished reports
3. Both completed and rejected reports shown here

---

### 6. Testing Filters & Search

**Filter Reports:**
1. In "All Reports" tab, use the filters:
   - Type: Lost/Found/All
   - Category: Select from 8 categories
   - Search: Type keywords
2. Reports filter in real-time!

**Filter My Reports:**
1. In "My Reports" tab:
   - Filter by Status (Pending/Approved/etc.)
   - Filter by Category
   - Search your reports

---

### 7. Pre-loaded Demo Accounts

**Login as Existing Users:**
```
Student 1:
- Email: ahmed.rahman@student.bubt.edu.bd
- ID: 20231001234
- (any password)

Student 2:
- Email: fatima.khan@student.bubt.edu.bd
- ID: 20231005678
- (any password)

Faculty:
- Email: mohammad.ali@faculty.bubt.edu.bd
- Code: FAC001
- (any password)

Admin:
- Email: admin@bubt.edu.bd
- Password: admin123
```

---

### 8. Test Rejection Flow

**Reject a User:**
1. Register a new account
2. Login as admin
3. Go to "Pending Users"
4. Click red "Reject" button
5. Logout and try to login as that user
6. You'll see: "Your account has been rejected"

**Reject a Report:**
1. Create a report as a user
2. Login as admin
3. Go to "Pending Reports"
4. Click red "Reject" button
5. User gets notification in red background

---

### 9. Edge Cases to Test

✅ **Cannot claim own found items**
- Try to claim your own found item - you'll see a message

✅ **Cannot mark own lost items as found**
- Try to mark your own lost item - message appears

✅ **Cannot claim twice**
- Try to claim the same item twice - error shown

✅ **Banned users cannot login**
- Admin bans a user, they cannot login

✅ **Pending users cannot login**
- New registration cannot login until approved

---

### 10. Reset Demo Data

To start fresh:
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Press Enter
4. Refresh page
5. All data reset, sample data reloaded!

---

## Screenshots Guide

### Home Page
- Beautiful landing page
- UniFind logo and branding
- Login, Register, Admin Login buttons
- Feature cards explaining the platform

### User Dashboard
- 4 tabs: All Reports, My Reports, Notifications, Create Report
- Filter and search functionality
- Report cards with details
- Real-time notification counter

### Admin Dashboard
- 5 tabs: Pending Users, Pending Reports, Approved Reports, All Users, Completed
- Approve/Reject actions
- User management (ban/unban)
- Complete reports workflow

### Notifications
- Color-coded (green/red/blue)
- Unread badge counter
- Mark as read functionality
- Timestamp on each notification

---

## Pro Tips

💡 **Multiple Browser Tabs**
- Open multiple tabs to test as different users simultaneously
- One tab as admin, another as user

💡 **Different Browsers**
- Use Chrome for user, Firefox for admin
- Test concurrent interactions

💡 **LocalStorage Inspector**
- Open DevTools > Application > LocalStorage
- See all stored data in real-time

💡 **Responsive Testing**
- Press F12, toggle device toolbar
- Test on mobile sizes
- All features work on mobile!

---

## Common Questions

**Q: Where is the data stored?**
A: Browser's LocalStorage. Open DevTools > Application > LocalStorage to see it.

**Q: Can I use this in production?**
A: This is a demo. For production, you'd need a real backend database and authentication system.

**Q: How do I deploy this?**
A: Just upload the 4 files (index.html, app.js, dashboards.js, style.css) to any web hosting!

**Q: Can I modify the categories?**
A: Yes! Edit the `categories` array in `app.js`

**Q: Can I change admin password?**
A: Yes! Edit `ADMIN_CREDENTIALS` in `app.js`

---

**Happy Testing! 🎉**

If you find any bugs or have questions, the code is well-commented and easy to modify!
