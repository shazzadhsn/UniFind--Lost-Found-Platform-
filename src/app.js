// =================================================================
// UNIFIND - BUBT Lost & Found Application
// Pure JavaScript Implementation with Admin Approval for Registration
// =================================================================

// State Management
const AppState = {
    currentPage: 'home',
    currentUser: null,
    currentDashboardTab: 'home',
    currentAdminTab: 'pending-users',
    reports: [],
    users: [],
    notifications: [],
    categories: ['stationary', 'electronics', 'books', 'id-cards', 'bags', 'accessories', 'clothing', 'other']
};

const ADMIN_CREDENTIALS = { email: 'admin@bubt.edu.bd', password: 'admin123' };

// ========== UTILITY FUNCTIONS ==========
function ID(prefix='item') { return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; }
function formatDate(d) { return new Date(d).toLocaleDateString(); }
function formatDateTime(d) { return new Date(d).toLocaleString(); }
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function load(key, def=null) { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; }

// Toast Notifications
function toast(msg, type='info') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    const bg = type==='success' ? 'bg-green-500' : type==='error' ? 'bg-red-500' : 'bg-blue-500';
    t.className = `${bg} text-white px-6 py-3 rounded-lg shadow-lg toast-enter`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.classList.add('toast-exit'); setTimeout(() => t.remove(), 300); }, 3000);
}

// Modal
function modal(content) {
    document.getElementById('modal-container').innerHTML = `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onclick="if(event.target===this) closeModal()">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                ${content}
            </div>
        </div>`;
    lucide.createIcons();
}
function closeModal() { document.getElementById('modal-container').innerHTML = ''; }

// ========== DATA INITIALIZATION ==========
function initData() {
    if (!localStorage.getItem('unifindInit')) {
        save('users', [
            {id:'user-1', name:'Ahmed Rahman', email:'ahmed.rahman@student.bubt.edu.bd', type:'student', universityId:'20231001234', status:'approved', isBanned:false},
            {id:'user-2', name:'Fatima Khan', email:'fatima.khan@student.bubt.edu.bd', type:'student', universityId:'20231005678', status:'approved', isBanned:false},
            {id:'user-3', name:'Dr. Mohammad Ali', email:'mohammad.ali@faculty.bubt.edu.bd', type:'faculty', facultyCode:'FAC001', status:'approved', isBanned:false}
        ]);
        save('reports', [
            {id:'r1', userId:'user-1', userName:'Ahmed Rahman', userType:'student', type:'lost', itemName:'Black Laptop Bag', category:'bags', description:'Lost laptop bag in library 3rd floor', dateLost:'2025-10-28', status:'approved', createdAt:'2025-10-28T10:30:00Z', claimRequests:[], foundNotifications:[]},
            {id:'r2', userId:'user-2', userName:'Fatima Khan', userType:'student', type:'found', itemName:'Student ID Card', category:'id-cards', description:'Found student ID near cafeteria', foundLocation:'Main Building Cafeteria', photoUrl:'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=400', status:'approved', createdAt:'2025-10-29T14:15:00Z', claimRequests:[], foundNotifications:[]}
        ]);
        save('notifications', []);
        localStorage.setItem('unifindInit', 'true');
    }
    AppState.users = load('users', []);
    AppState.reports = load('reports', []);
    AppState.notifications = load('notifications', []);
    
    const savedUser = load('currentUser');
    if (savedUser) {
        AppState.currentUser = savedUser;
        navigate(savedUser.type === 'admin' ? 'admin-dashboard' : 'user-dashboard');
    }
}

// ========== NAVIGATION ==========
function navigate(page) {
    AppState.currentPage = page;
    render();
}

function logout() {
    AppState.currentUser = null;
    localStorage.removeItem('currentUser');
    navigate('home');
}

// ========== AUTHENTICATION ==========
function handleLogin(email, password, idCode, userType) {
    const user = AppState.users.find(u => u.type === userType && (u.email === email || (userType==='student' ? u.universityId===idCode : u.facultyCode===idCode)));
    
    if (!user) { toast('Invalid credentials', 'error'); return; }
    if (user.status === 'pending') { toast('Your account is pending admin approval', 'error'); return; }
    if (user.status === 'rejected') { toast('Your account has been rejected', 'error'); return; }
    if (user.isBanned) { toast('Your account has been banned', 'error'); return; }
    
    AppState.currentUser = user;
    save('currentUser', user);
    toast('Login successful!', 'success');
    navigate('user-dashboard');
}

function handleAdminLogin(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        AppState.currentUser = {id:'admin-001', name:'Admin', email:ADMIN_CREDENTIALS.email, type:'admin'};
        save('currentUser', AppState.currentUser);
        toast('Admin login successful!', 'success');
        navigate('admin-dashboard');
    } else {
        toast('Invalid admin credentials', 'error');
    }
}

function handleRegister(name, email, idCode, password, confirmPassword, userType) {
    if (password !== confirmPassword) { toast('Passwords do not match', 'error'); return; }
    if (password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
    
    const newUser = {
        id:ID('user'), name, email, type:userType, status:'pending', isBanned:false,
        ...(userType==='student' ? {universityId:idCode} : {facultyCode:idCode})
    };
    
    AppState.users.push(newUser);
    save('users', AppState.users);
    
    AppState.notifications.push({
        id:ID('notif'), userId:'admin-001', type:'claim',
        message:`New ${userType} registration: ${name}`,
        createdAt:new Date().toISOString(), read:false
    });
    save('notifications', AppState.notifications);
    
    toast('Registration successful! Waiting for admin approval.', 'success');
    navigate('login');
}

// ========== PAGE RENDERING ==========
function render() {
    const app = document.getElementById('app');
    let content = '';
    
    switch(AppState.currentPage) {
        case 'home': content = renderHome(); break;
        case 'login': content = renderLogin(); break;
        case 'admin-login': content = renderAdminLogin(); break;
        case 'register': content = renderRegister(); break;
        case 'user-dashboard': content = renderUserDashboard(); break;
        case 'admin-dashboard': content = renderAdminDashboard(); break;
    }
    
    app.innerHTML = content;
    lucide.createIcons();
    
    // Initialize dashboard tabs if needed
    if (AppState.currentPage === 'user-dashboard') {
        setTimeout(() => setDashboardTab(AppState.currentDashboardTab), 0);
    } else if (AppState.currentPage === 'admin-dashboard') {
        setTimeout(() => setAdminTab(AppState.currentAdminTab), 0);
    }
}

// ========== HOME PAGE ==========
function renderHome() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <header class="container mx-auto px-4 py-6">
                <div class="flex justify-between items-center flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <img src="images/bubt-logo.png" alt="BUBT Logo" class="w-16 h-16 object-contain">
                        <div><h1 class="text-2xl font-bold text-blue-900">UniFind</h1><p class="text-sm text-gray-600">BUBT Lost & Found</p></div>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="navigate('login')" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Login</button>
                        <button onclick="navigate('register')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</button>
                    </div>
                </div>
            </header>
            <main class="container mx-auto px-4 py-16 text-center">
                <img src="images/bubt-logo.png" alt="BUBT Logo" class="w-32 h-32 object-contain mx-auto mb-6 drop-shadow-2xl">
                <h2 class="text-5xl font-bold text-gray-900 mb-6">Welcome to UniFind</h2>
                <p class="text-xl text-gray-700 mb-4 max-w-2xl mx-auto">The official lost and found platform for <span class="text-blue-600 font-semibold">Bangladesh University of Business and Technology (BUBT)</span></p>
                <p class="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">Lost your ID card, laptop, or books on campus? Found something that belongs to someone else? UniFind connects our university community to help reunite lost items with their rightful owners.</p>
                <div class="flex flex-wrap gap-4 justify-center mb-16">
                    <button onclick="navigate('register')" class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold">Get Started</button>
                    <button onclick="navigate('login')" class="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-lg font-semibold">Sign In</button>
                </div>
                <div class="grid md:grid-cols-3 gap-8 mt-16">
                    <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><i data-lucide="map-pin" class="w-7 h-7 text-blue-600"></i></div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Report Lost Items</h3>
                        <p class="text-gray-600">Quickly report items you've lost on campus with detailed descriptions</p>
                    </div>
                    <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4"><i data-lucide="search" class="w-7 h-7 text-purple-600"></i></div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Find & Claim</h3>
                        <p class="text-gray-600">Browse found items and claim yours, or help others by reporting items you've found</p>
                    </div>
                    <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4"><i data-lucide="users" class="w-7 h-7 text-green-600"></i></div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Community Driven</h3>
                        <p class="text-gray-600">Connect with students and faculty to reunite lost items with their owners</p>
                    </div>
                </div>
            </main>
            <div class="fixed bottom-6 right-6">
                <button onclick="navigate('admin-login')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 shadow-lg flex items-center gap-2">
                    <i data-lucide="shield" class="w-4 h-4"></i>Admin Login
                </button>
            </div>
        </div>`;
}

// ========== LOGIN PAGE ==========
function renderLogin() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <button onclick="navigate('home')" class="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>Back to Home
                </button>
                <div class="bg-white rounded-lg shadow-xl border p-8">
                    <div class="text-center mb-6">
                        <img src="images/bubt-logo.png" alt="BUBT Logo" class="w-20 h-20 object-contain mx-auto mb-4">
                        <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p class="text-gray-600">Sign in to your UniFind account</p>
                    </div>
                    <form onsubmit="event.preventDefault(); const f=event.target; handleLogin(f.email.value, f.password.value, f.idCode.value, f.userType.value);" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Login As</label>
                            <select name="userType" id="loginUserType" onchange="document.getElementById('idLabel').textContent=this.value==='student'?'University ID':'Faculty Code'" class="w-full px-4 py-2 border rounded-lg">
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Email</label>
                            <input type="email" name="email" required class="w-full px-4 py-2 border rounded-lg" placeholder="your.email@example.com">
                        </div>
                        <div>
                            <label id="idLabel" class="block text-sm font-medium mb-2">University ID</label>
                            <input type="text" name="idCode" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 20231234567">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Password</label>
                            <input type="password" name="password" required class="w-full px-4 py-2 border rounded-lg" placeholder="Enter password">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">Sign In</button>
                    </form>
                    <div class="mt-6 text-center">
                        <p class="text-gray-600">Don't have an account? <button onclick="navigate('register')" class="text-blue-600 hover:underline font-semibold">Register here</button></p>
                    </div>
                </div>
            </div>
        </div>`;
}

// ========== ADMIN LOGIN PAGE ==========
function renderAdminLogin() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <button onclick="navigate('home')" class="mb-4 flex items-center gap-2 text-gray-300 hover:text-white">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>Back to Home
                </button>
                <div class="bg-white rounded-lg shadow-2xl p-8">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="shield" class="w-8 h-8 text-white"></i>
                        </div>
                        <h2 class="text-2xl font-bold">Admin Portal</h2>
                        <p class="text-gray-600">Sign in to access the admin dashboard</p>
                    </div>
                    <form onsubmit="event.preventDefault(); const f=event.target; handleAdminLogin(f.email.value, f.password.value);" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Admin Email</label>
                            <input type="email" name="email" required class="w-full px-4 py-2 border rounded-lg" placeholder="admin@bubt.edu.bd">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Password</label>
                            <input type="password" name="password" required class="w-full px-4 py-2 border rounded-lg" placeholder="Enter admin password">
                        </div>
                        <button type="submit" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-semibold">Sign In as Admin</button>
                    </form>
                    <div class="mt-6 p-3 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
                        Demo: <span class="text-gray-900 font-semibold">admin@bubt.edu.bd / admin123</span>
                    </div>
                </div>
            </div>
        </div>`;
}

// ========== REGISTER PAGE ==========
function renderRegister() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <button onclick="navigate('home')" class="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>Back to Home
                </button>
                <div class="bg-white rounded-lg shadow-xl border p-8">
                    <div class="text-center mb-6">
                        <img src="images/bubt-logo.png" alt="BUBT Logo" class="w-20 h-20 object-contain mx-auto mb-4">
                        <h2 class="text-2xl font-bold text-gray-900">Create Account</h2>
                        <p class="text-gray-600">Join UniFind to report and find lost items</p>
                    </div>
                    <form onsubmit="event.preventDefault(); const f=event.target; handleRegister(f.name.value, f.email.value, f.idCode.value, f.password.value, f.confirmPassword.value, f.userType.value);" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Register As</label>
                            <select name="userType" id="regUserType" onchange="document.getElementById('regIdLabel').textContent=this.value==='student'?'University ID':'Faculty Code'" class="w-full px-4 py-2 border rounded-lg">
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Full Name</label>
                            <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg" placeholder="Enter your full name">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Email</label>
                            <input type="email" name="email" required class="w-full px-4 py-2 border rounded-lg" placeholder="your.email@example.com">
                        </div>
                        <div>
                            <label id="regIdLabel" class="block text-sm font-medium mb-2">University ID</label>
                            <input type="text" name="idCode" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 20231234567">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Password</label>
                            <input type="password" name="password" required class="w-full px-4 py-2 border rounded-lg" placeholder="At least 6 characters">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Confirm Password</label>
                            <input type="password" name="confirmPassword" required class="w-full px-4 py-2 border rounded-lg" placeholder="Re-enter password">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">Create Account</button>
                    </form>
                    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 text-center">
                        <strong>Note:</strong> New accounts require admin approval before login.
                    </div>
                    <div class="mt-4 text-center">
                        <p class="text-gray-600">Already have an account? <button onclick="navigate('login')" class="text-blue-600 hover:underline font-semibold">Sign in here</button></p>
                    </div>
                </div>
            </div>
        </div>`;
}

// Continue with User Dashboard and Admin Dashboard in next part...
// This file is getting long. I'll complete it with the dashboard functions.