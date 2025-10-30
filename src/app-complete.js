// This file contains the complete application
// Copy this content to replace app.js

// [The previous content from app.js goes here, followed by:]

// USER DASHBOARD
function renderUserDashboard() {
    const unreadCount = AppState.notifications.filter(n => n.userId === AppState.currentUser.id && !n.read).length;
    
    return `
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <i data-lucide="search" class="w-5 h-5 text-white"></i>
                            </div>
                            <div>
                                <h1 class="text-xl font-bold text-gray-900">UniFind</h1>
                                <p class="text-sm text-gray-600">Welcome, ${AppState.currentUser.name}</p>
                            </div>
                        </div>
                        <button onclick="logout()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <i data-lucide="log-out" class="w-4 h-4"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <!-- Navigation -->
            <nav class="bg-white border-b border-gray-200">
                <div class="container mx-auto px-4">
                    <div class="flex gap-1 overflow-x-auto">
                        <button onclick="setDashboardTab('home')" id="tab-home" class="dashboard-tab flex items-center gap-2 px-4 py-3 border-b-2">
                            <i data-lucide="home" class="w-4 h-4"></i>
                            All Reports
                        </button>
                        <button onclick="setDashboardTab('my-reports')" id="tab-my-reports" class="dashboard-tab flex items-center gap-2 px-4 py-3 border-b-2">
                            <i data-lucide="file-text" class="w-4 h-4"></i>
                            My Reports
                        </button>
                        <button onclick="setDashboardTab('notifications')" id="tab-notifications" class="dashboard-tab flex items-center gap-2 px-4 py-3 border-b-2">
                            <i data-lucide="bell" class="w-4 h-4"></i>
                            Notifications
                            ${unreadCount > 0 ? `<span class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">${unreadCount}</span>` : ''}
                        </button>
                        <button onclick="setDashboardTab('create')" id="tab-create" class="dashboard-tab flex items-center gap-2 px-4 py-3 border-b-2">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            Create Report
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="container mx-auto px-4 py-8">
                <div id="dashboard-content"></div>
            </main>
        </div>
    `;
}

let currentDashboardTab = 'home';

function setDashboardTab(tab) {
    currentDashboardTab = tab;
    
    // Update active tab styling
    document.querySelectorAll('.dashboard-tab').forEach(btn => {
        btn.classList.remove('border-blue-600', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-600');
    });
    
    const activeTab = document.getElementById(`tab-${tab}`);
    if (activeTab) {
        activeTab.classList.remove('border-transparent', 'text-gray-600');
        activeTab.classList.add('border-blue-600', 'text-blue-600');
    }
    
    // Render content
    const content = document.getElementById('dashboard-content');
    if (tab === 'home') {
        content.innerHTML = renderAllReports();
    } else if (tab === 'my-reports') {
        content.innerHTML = renderMyReports();
    } else if (tab === 'notifications') {
        content.innerHTML = renderNotifications();
    } else if (tab === 'create') {
        content.innerHTML = renderCreateReport();
    }
    
    lucide.createIcons();
}

// ALL REPORTS
function renderAllReports() {
    const approvedReports = AppState.reports.filter(r => r.status === 'approved' || r.status === 'claimed' || r.status === 'found');
    
    return `
        <div class="space-y-6">
            <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Browse Reports</h2>
                <p class="text-gray-600">Search for your lost items or help others find theirs</p>
            </div>

            <!-- Filters -->
            <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <div class="flex gap-4 flex-wrap">
                    <div class="flex-1 min-w-[200px]">
                        <div class="relative">
                            <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
                            <input type="text" id="searchAllReports" placeholder="Search by item name, description..." class="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg" onkeyup="filterAllReports()">
                        </div>
                    </div>
                    
                    <select id="typeFilterAll" class="px-4 py-2 border border-gray-300 rounded-lg" onchange="filterAllReports()">
                        <option value="all">All Types</option>
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>

                    <select id="categoryFilterAll" class="px-4 py-2 border border-gray-300 rounded-lg" onchange="filterAllReports()">
                        <option value="all">All Categories</option>
                        ${AppState.categories.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
                    </select>
                </div>
            </div>

            <!-- Reports Grid -->
            <div id="allReportsGrid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${approvedReports.length === 0 ? `
                    <div class="col-span-full text-center py-12">
                        <p class="text-gray-500">No reports found.</p>
                    </div>
                ` : approvedReports.map(report => renderReportCard(report, false)).join('')}
            </div>
        </div>
    `;
}

function filterAllReports() {
    const search = document.getElementById('searchAllReports').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilterAll').value;
    const categoryFilter = document.getElementById('categoryFilterAll').value;
    
    let reports = AppState.reports.filter(r => r.status === 'approved' || r.status === 'claimed' || r.status === 'found');
    
    if (typeFilter !== 'all') {
        reports = reports.filter(r => r.type === typeFilter);
    }
    
    if (categoryFilter !== 'all') {
        reports = reports.filter(r => r.category === categoryFilter);
    }
    
    if (search) {
        reports = reports.filter(r => 
            r.itemName.toLowerCase().includes(search) || 
            r.description.toLowerCase().includes(search)
        );
    }
    
    const grid = document.getElementById('allReportsGrid');
    grid.innerHTML = reports.length === 0 ? `
        <div class="col-span-full text-center py-12">
            <p class="text-gray-500">No reports match your filters.</p>
        </div>
    ` : reports.map(report => renderReportCard(report, false)).join('');
    
    lucide.createIcons();
}

// MY REPORTS
function renderMyReports() {
    const myReports = AppState.reports.filter(r => r.userId === AppState.currentUser.id);
    
    return `
        <div class="space-y-6">
            <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">My Reports</h2>
                <p class="text-gray-600">View and manage all your lost and found reports</p>
            </div>

            <!-- Filters -->
            <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                <div class="flex gap-4 flex-wrap">
                    <div class="flex-1 min-w-[200px]">
                        <div class="relative">
                            <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
                            <input type="text" id="searchMyReports" placeholder="Search your reports..." class="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg" onkeyup="filterMyReports()">
                        </div>
                    </div>

                    <select id="statusFilterMy" class="px-4 py-2 border border-gray-300 rounded-lg" onchange="filterMyReports()">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Active</option>
                        <option value="claimed">Claimed</option>
                        <option value="found">Found</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select id="categoryFilterMy" class="px-4 py-2 border border-gray-300 rounded-lg" onchange="filterMyReports()">
                        <option value="all">All Categories</option>
                        ${AppState.categories.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
                    </select>
                </div>
            </div>

            <!-- Reports Grid -->
            <div id="myReportsGrid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${myReports.length === 0 ? `
                    <div class="col-span-full text-center py-12">
                        <p class="text-gray-500">You haven't created any reports yet.</p>
                    </div>
                ` : myReports.map(report => renderReportCard(report, true)).join('')}
            </div>
        </div>
    `;
}

function filterMyReports() {
    const search = document.getElementById('searchMyReports').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilterMy').value;
    const categoryFilter = document.getElementById('categoryFilterMy').value;
    
    let reports = AppState.reports.filter(r => r.userId === AppState.currentUser.id);
    
    if (statusFilter !== 'all') {
        reports = reports.filter(r => r.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
        reports = reports.filter(r => r.category === categoryFilter);
    }
    
    if (search) {
        reports = reports.filter(r => 
            r.itemName.toLowerCase().includes(search) || 
            r.description.toLowerCase().includes(search)
        );
    }
    
    const grid = document.getElementById('myReportsGrid');
    grid.innerHTML = reports.length === 0 ? `
        <div class="col-span-full text-center py-12">
            <p class="text-gray-500">No reports match your filters.</p>
        </div>
    ` : reports.map(report => renderReportCard(report, true)).join('');
    
    lucide.createIcons();
}

// REPORT CARD COMPONENT
function renderReportCard(report, isMyReport) {
    const categoryColors = {
        'stationary': 'bg-blue-100 text-blue-700',
        'electronics': 'bg-purple-100 text-purple-700',
        'books': 'bg-green-100 text-green-700',
        'id-cards': 'bg-red-100 text-red-700',
        'bags': 'bg-yellow-100 text-yellow-700',
        'accessories': 'bg-pink-100 text-pink-700',
        'clothing': 'bg-indigo-100 text-indigo-700',
        'other': 'bg-gray-100 text-gray-700'
    };
    
    const statusBadges = {
        'pending': '<span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i>Pending</span>',
        'approved': '<span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs"><i data-lucide="check-circle" class="w-3 h-3"></i>Active</span>',
        'claimed': '<span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"><i data-lucide="alert-circle" class="w-3 h-3"></i>Claimed</span>',
        'found': '<span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs"><i data-lucide="check-circle" class="w-3 h-3"></i>Found</span>',
        'completed': '<span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs"><i data-lucide="check-circle" class="w-3 h-3"></i>Completed</span>',
        'rejected': '<span class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs"><i data-lucide="x-circle" class="w-3 h-3"></i>Rejected</span>'
    };
    
    return `
        <div class="bg-white rounded-lg border border-gray-200 shadow hover:shadow-lg transition-shadow">
            <div class="p-6 space-y-3">
                <div class="flex justify-between items-start mb-2">
                    <span class="px-2 py-1 ${categoryColors[report.category]} rounded text-xs font-semibold">${report.category.replace('-', ' ').toUpperCase()}</span>
                    <span class="px-2 py-1 ${report.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} rounded text-xs font-semibold">${report.type.toUpperCase()}</span>
                </div>
                
                <h3 class="text-lg font-bold text-gray-900 line-clamp-1">${report.itemName}</h3>
                <p class="text-gray-600 text-sm line-clamp-2">${report.description}</p>
                
                ${report.photoUrl ? `<img src="${report.photoUrl}" alt="${report.itemName}" class="w-full h-40 object-cover rounded-lg">` : ''}
                
                <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex items-center gap-2">
                        <i data-lucide="user" class="w-4 h-4"></i>
                        <span>${report.userName} (${report.userType})</span>
                    </div>
                    ${report.type === 'lost' && report.dateLost ? `
                        <div class="flex items-center gap-2">
                            <i data-lucide="calendar" class="w-4 h-4"></i>
                            <span>Lost on ${formatDate(report.dateLost)}</span>
                        </div>
                    ` : ''}
                    ${report.type === 'found' && report.foundLocation ? `
                        <div class="flex items-center gap-2">
                            <i data-lucide="map-pin" class="w-4 h-4"></i>
                            <span>${report.foundLocation}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${isMyReport ? `<div class="pt-2">${statusBadges[report.status]}</div>` : ''}
                
                <button onclick="viewReportDetails('${report.id}', ${isMyReport})" class="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                    View Details
                </button>
            </div>
        </div>
    `;
}

// REPORT DETAILS MODAL
function viewReportDetails(reportId, isMyReport) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (!report) return;
    
    const canInteract = !isMyReport && report.userId !== AppState.currentUser.id;
    
    const modalContent = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-2xl font-bold text-gray-900">${report.itemName}</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            
            <div class="flex gap-2 mb-4">
                <span class="px-2 py-1 ${report.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} rounded text-xs font-semibold">${report.type.toUpperCase()}</span>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">${report.category.replace('-', ' ').toUpperCase()}</span>
            </div>
            
            ${report.photoUrl ? `<img src="${report.photoUrl}" alt="${report.itemName}" class="w-full h-64 object-cover rounded-lg mb-4">` : ''}
            
            <div class="space-y-4">
                <div>
                    <h4 class="font-bold text-gray-900 mb-2">Description</h4>
                    <p class="text-gray-700">${report.description}</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2 text-sm text-gray-600">
                        <div class="flex items-center gap-2">
                            <i data-lucide="user" class="w-4 h-4"></i>
                            <span>Posted by: <span class="text-gray-900">${report.userName}</span> (${report.userType})</span>
                        </div>
                        ${report.type === 'lost' && report.dateLost ? `
                            <div class="flex items-center gap-2">
                                <i data-lucide="calendar" class="w-4 h-4"></i>
                                <span>Lost on: <span class="text-gray-900">${formatDate(report.dateLost)}</span></span>
                            </div>
                        ` : ''}
                        ${report.type === 'found' && report.foundLocation ? `
                            <div class="flex items-center gap-2">
                                <i data-lucide="map-pin" class="w-4 h-4"></i>
                                <span>Found at: <span class="text-gray-900">${report.foundLocation}</span></span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="text-sm">
                        <p class="text-gray-600">Posted: <span class="text-gray-900">${formatDateTime(report.createdAt)}</span></p>
                        <p class="text-gray-600 mt-1">Status: <span class="text-gray-900">${report.status}</span></p>
                    </div>
                </div>
                
                ${report.claimRequests && report.claimRequests.length > 0 ? `
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 class="text-blue-900 font-bold mb-2 flex items-center gap-2">
                            <i data-lucide="alert-circle" class="w-4 h-4"></i>
                            Claim Requests (${report.claimRequests.length})
                        </h4>
                        <div class="space-y-2">
                            ${report.claimRequests.map(claim => `
                                <p class="text-sm text-blue-800">${claim.userName} - ${formatDateTime(claim.requestedAt)}</p>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${report.foundNotifications && report.foundNotifications.length > 0 ? `
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 class="text-green-900 font-bold mb-2 flex items-center gap-2">
                            <i data-lucide="check-circle" class="w-4 h-4"></i>
                            Found Notifications (${report.foundNotifications.length})
                        </h4>
                        <div class="space-y-2">
                            ${report.foundNotifications.map(found => `
                                <p class="text-sm text-green-800">${found.userName} - ${formatDateTime(found.notifiedAt)}</p>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${canInteract ? `
                    <div class="flex gap-3 pt-4 border-t">
                        ${report.type === 'found' ? `
                            <button onclick="claimItem('${report.id}')" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <i data-lucide="alert-circle" class="w-4 h-4"></i>
                                Claim This Item
                            </button>
                        ` : ''}
                        ${report.type === 'lost' ? `
                            <button onclick="foundItem('${report.id}')" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                <i data-lucide="check-circle" class="w-4 h-4"></i>
                                I Found This Item
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
                
                ${isMyReport ? `
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p class="text-sm text-gray-600">This is your report. Other users can send you claim/found notifications.</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

function claimItem(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (!report) return;
    
    // Check if already claimed
    if (report.claimRequests && report.claimRequests.some(cr => cr.userId === AppState.currentUser.id)) {
        showToast('You have already sent a claim request for this item', 'error');
        return;
    }
    
    // Update report
    const reportIndex = AppState.reports.findIndex(r => r.id === reportId);
    if (!report.claimRequests) report.claimRequests = [];
    
    report.claimRequests.push({
        id: generateId('claim'),
        userId: AppState.currentUser.id,
        userName: AppState.currentUser.name,
        requestedAt: new Date().toISOString()
    });
    report.status = 'claimed';
    
    AppState.reports[reportIndex] = report;
    saveToLocalStorage('reports', AppState.reports);
    
    // Notify owner
    AppState.notifications.push({
        id: generateId('notif'),
        userId: report.userId,
        type: 'claim',
        message: `${AppState.currentUser.name} has claimed your found item: ${report.itemName}`,
        reportId: report.id,
        createdAt: new Date().toISOString(),
        read: false
    });
    
    // Notify admin
    AppState.notifications.push({
        id: generateId('notif'),
        userId: 'admin-001',
        type: 'claim',
        message: `Claim request for "${report.itemName}" by ${AppState.currentUser.name}`,
        reportId: report.id,
        createdAt: new Date().toISOString(),
        read: false
    });
    
    saveToLocalStorage('notifications', AppState.notifications);
    
    showToast('Claim request sent successfully!', 'success');
    closeModal();
    setDashboardTab(currentDashboardTab); // Refresh
}

function foundItem(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (!report) return;
    
    // Check if already notified
    if (report.foundNotifications && report.foundNotifications.some(fn => fn.userId === AppState.currentUser.id)) {
        showToast('You have already sent a found notification for this item', 'error');
        return;
    }
    
    // Update report
    const reportIndex = AppState.reports.findIndex(r => r.id === reportId);
    if (!report.foundNotifications) report.foundNotifications = [];
    
    report.foundNotifications.push({
        id: generateId('found'),
        userId: AppState.currentUser.id,
        userName: AppState.currentUser.name,
        notifiedAt: new Date().toISOString()
    });
    report.status = 'found';
    
    AppState.reports[reportIndex] = report;
    saveToLocalStorage('reports', AppState.reports);
    
    // Notify owner
    AppState.notifications.push({
        id: generateId('notif'),
        userId: report.userId,
        type: 'found',
        message: `${AppState.currentUser.name} has found your lost item: ${report.itemName}`,
        reportId: report.id,
        createdAt: new Date().toISOString(),
        read: false
    });
    
    // Notify admin
    AppState.notifications.push({
        id: generateId('notif'),
        userId: 'admin-001',
        type: 'found',
        message: `Found notification for "${report.itemName}" by ${AppState.currentUser.name}`,
        reportId: report.id,
        createdAt: new Date().toISOString(),
        read: false
    });
    
    saveToLocalStorage('notifications', AppState.notifications);
    
    showToast('Found notification sent successfully!', 'success');
    closeModal();
    setDashboardTab(currentDashboardTab); // Refresh
}

// Due to character limit, I need to continue this in a separate message.
// The complete file is too large to fit in one response.
// Please let me know if you'd like me to create multiple smaller files or provide the rest of the code.
