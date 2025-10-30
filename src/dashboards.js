// =================================================================
// USER & ADMIN DASHBOARDS
// Part 2 of UniFind Application
// =================================================================

// USER DASHBOARD
function renderUserDashboard() {
    const unreadCount = AppState.notifications.filter(n => n.userId === AppState.currentUser.id && !n.read).length;
    return `
        <div class="min-h-screen bg-gray-50">
            <header class="bg-white border-b sticky top-0 z-10">
                <div class="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <img src="images/bubt-logo.png" alt="BUBT Logo" class="w-12 h-12 object-contain">
                        <div><h1 class="text-xl font-bold">UniFind</h1><p class="text-sm text-gray-600">Welcome, ${AppState.currentUser.name}</p></div>
                    </div>
                    <button onclick="logout()" class="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <i data-lucide="log-out" class="w-4 h-4"></i>Logout
                    </button>
                </div>
            </header>
            <nav class="bg-white border-b">
                <div class="container mx-auto px-4 flex gap-1 overflow-x-auto">
                    <button onclick="setDashboardTab('home')" id="tab-home" class="dtab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="home" class="w-4 h-4"></i>All Reports</button>
                    <button onclick="setDashboardTab('my-reports')" id="tab-my-reports" class="dtab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="file-text" class="w-4 h-4"></i>My Reports</button>
                    <button onclick="setDashboardTab('notifications')" id="tab-notifications" class="dtab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="bell" class="w-4 h-4"></i>Notifications ${unreadCount > 0 ? `<span class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">${unreadCount}</span>` : ''}</button>
                    <button onclick="setDashboardTab('create')" id="tab-create" class="dtab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="plus-circle" class="w-4 h-4"></i>Create Report</button>
                </div>
            </nav>
            <main class="container mx-auto px-4 py-8" id="dash-content"></main>
        </div>`;
}

function setDashboardTab(tab) {
    AppState.currentDashboardTab = tab;
    document.querySelectorAll('.dtab').forEach(b => {
        b.classList.remove('border-blue-600', 'text-blue-600');
        b.classList.add('border-transparent', 'text-gray-600');
    });
    const active = document.getElementById(`tab-${tab}`);
    if (active) {
        active.classList.remove('border-transparent', 'text-gray-600');
        active.classList.add('border-blue-600', 'text-blue-600');
    }
    
    const content = document.getElementById('dash-content');
    if (tab === 'home') content.innerHTML = renderAllReports();
    else if (tab === 'my-reports') content.innerHTML = renderMyReports();
    else if (tab === 'notifications') content.innerHTML = renderNotifications();
    else if (tab === 'create') content.innerHTML = renderCreateReport();
    
    lucide.createIcons();
}

// ALL REPORTS TAB
function renderAllReports() {
    const reports = AppState.reports.filter(r => r.status === 'approved' || r.status === 'claimed' || r.status === 'found');
    return `
        <div><h2 class="text-3xl font-bold mb-2">Browse Reports</h2><p class="text-gray-600 mb-6">Search for your lost items or help others</p>
        <div class="bg-white p-4 rounded-lg border mb-6 flex gap-4 flex-wrap">
            <input id="searchAll" type="text" placeholder="Search..." class="flex-1 min-w-[200px] px-4 py-2 border rounded-lg" onkeyup="filterReports('all')">
            <select id="typeAll" class="px-4 py-2 border rounded-lg" onchange="filterReports('all')">
                <option value="all">All Types</option><option value="lost">Lost</option><option value="found">Found</option>
            </select>
            <select id="catAll" class="px-4 py-2 border rounded-lg" onchange="filterReports('all')">
                <option value="all">All Categories</option>${AppState.categories.map(c=>`<option value="${c}">${c.replace('-',' ')}</option>`).join('')}
            </select>
        </div>
        <div id="gridAll" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${reports.map(r=>card(r,false)).join('')}</div></div>`;
}

// MY REPORTS TAB
function renderMyReports() {
    const reports = AppState.reports.filter(r => r.userId === AppState.currentUser.id);
    return `
        <div><h2 class="text-3xl font-bold mb-2">My Reports</h2><p class="text-gray-600 mb-6">View and manage your reports</p>
        <div class="bg-white p-4 rounded-lg border mb-6 flex gap-4 flex-wrap">
            <input id="searchMy" type="text" placeholder="Search..." class="flex-1 min-w-[200px] px-4 py-2 border rounded-lg" onkeyup="filterReports('my')">
            <select id="statusMy" class="px-4 py-2 border rounded-lg" onchange="filterReports('my')">
                <option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Active</option><option value="claimed">Claimed</option><option value="found">Found</option><option value="completed">Completed</option><option value="rejected">Rejected</option>
            </select>
            <select id="catMy" class="px-4 py-2 border rounded-lg" onchange="filterReports('my')">
                <option value="all">All Categories</option>${AppState.categories.map(c=>`<option value="${c}">${c.replace('-',' ')}</option>`).join('')}
            </select>
        </div>
        <div id="gridMy" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${reports.map(r=>card(r,true)).join('')}</div></div>`;
}

function filterReports(type) {
    let reports = type === 'my' ? AppState.reports.filter(r => r.userId === AppState.currentUser.id) : AppState.reports.filter(r => r.status === 'approved' || r.status === 'claimed' || r.status === 'found');
    const search = document.getElementById(type==='my'?'searchMy':'searchAll').value.toLowerCase();
    const typeF = type==='all' ? document.getElementById('typeAll').value : null;
    const status = type==='my' ? document.getElementById('statusMy').value : null;
    const cat = document.getElementById(type==='my'?'catMy':'catAll').value;
    
    if (typeF && typeF !== 'all') reports = reports.filter(r => r.type === typeF);
    if (status && status !== 'all') reports = reports.filter(r => r.status === status);
    if (cat !== 'all') reports = reports.filter(r => r.category === cat);
    if (search) reports = reports.filter(r => r.itemName.toLowerCase().includes(search) || r.description.toLowerCase().includes(search));
    
    document.getElementById(type==='my'?'gridMy':'gridAll').innerHTML = reports.length === 0 ? '<div class="col-span-full text-center py-12 text-gray-500">No reports found</div>' : reports.map(r=>card(r,type==='my')).join('');
    lucide.createIcons();
}

// REPORT CARD
function card(r, mine) {
    const catColors = {stationary:'bg-blue-100 text-blue-700',electronics:'bg-purple-100 text-purple-700',books:'bg-green-100 text-green-700','id-cards':'bg-red-100 text-red-700',bags:'bg-yellow-100 text-yellow-700',accessories:'bg-pink-100 text-pink-700',clothing:'bg-indigo-100 text-indigo-700',other:'bg-gray-100 text-gray-700'};
    const badges = {pending:'⏱️ Pending',approved:'✅ Active',claimed:'🔔 Claimed',found:'✅ Found',completed:'✅ Completed',rejected:'❌ Rejected'};
    return `<div class="bg-white rounded-lg border shadow hover:shadow-lg transition p-6 space-y-3">
        <div class="flex justify-between mb-2">
            <span class="px-2 py-1 ${catColors[r.category]} rounded text-xs font-semibold">${r.category.replace('-',' ').toUpperCase()}</span>
            <span class="px-2 py-1 ${r.type==='lost'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'} rounded text-xs font-semibold">${r.type.toUpperCase()}</span>
        </div>
        <h3 class="text-lg font-bold line-clamp-1">${r.itemName}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">${r.description}</p>
        ${r.photoUrl?`<img src="${r.photoUrl}" class="w-full h-40 object-cover rounded-lg">`:''}
        <div class="space-y-1 text-sm text-gray-600">
            <div class="flex items-center gap-2"><i data-lucide="user" class="w-4 h-4"></i><span>${r.userName} (${r.userType})</span></div>
            ${r.type==='lost'&&r.dateLost?`<div class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i><span>Lost: ${formatDate(r.dateLost)}</span></div>`:''}
            ${r.type==='found'&&r.foundLocation?`<div class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4"></i><span>${r.foundLocation}</span></div>`:''}
        </div>
        ${mine?`<div class="text-sm">${badges[r.status]}</div>`:''}
        <button onclick="viewReport('${r.id}',${mine})" class="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
            <i data-lucide="eye" class="w-4 h-4"></i>View Details
        </button>
    </div>`;
}

// VIEW REPORT DETAILS
function viewReport(id, mine) {
    const r = AppState.reports.find(x => x.id === id);
    if (!r) return;
    const canAct = !mine && r.userId !== AppState.currentUser.id;
    modal(`<div class="p-6">
        <div class="flex justify-between mb-4">
            <h2 class="text-2xl font-bold">${r.itemName}</h2>
            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i data-lucide="x" class="w-6 h-6"></i></button>
        </div>
        <div class="flex gap-2 mb-4">
            <span class="px-2 py-1 ${r.type==='lost'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'} rounded text-xs">${r.type.toUpperCase()}</span>
            <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">${r.category.replace('-',' ').toUpperCase()}</span>
        </div>
        ${r.photoUrl?`<img src="${r.photoUrl}" class="w-full h-64 object-cover rounded-lg mb-4">`:''}
        <div class="space-y-4">
            <div><h4 class="font-bold mb-2">Description</h4><p class="text-gray-700">${r.description}</p></div>
            <div class="text-sm text-gray-600">
                Posted by: ${r.userName} (${r.userType}) | ${formatDateTime(r.createdAt)} | Status: ${r.status}
                ${r.type==='lost'&&r.dateLost?`<br>Lost on: ${formatDate(r.dateLost)}`:''}
                ${r.type==='found'&&r.foundLocation?`<br>Found at: ${r.foundLocation}`:''}
            </div>
            ${r.claimRequests&&r.claimRequests.length>0?`<div class="bg-blue-50 p-4 rounded border border-blue-200"><h4 class="text-blue-900 font-bold mb-2">Claim Requests (${r.claimRequests.length})</h4>${r.claimRequests.map(c=>`<p class="text-sm text-blue-800">${c.userName} - ${formatDateTime(c.requestedAt)}</p>`).join('')}</div>`:''}
            ${r.foundNotifications&&r.foundNotifications.length>0?`<div class="bg-green-50 p-4 rounded border border-green-200"><h4 class="text-green-900 font-bold mb-2">Found Notifications (${r.foundNotifications.length})</h4>${r.foundNotifications.map(f=>`<p class="text-sm text-green-800">${f.userName} - ${formatDateTime(f.notifiedAt)}</p>`).join('')}</div>`:''}
            ${canAct?`<div class="flex gap-3 pt-4 border-t">
                ${r.type==='found'?`<button onclick="claimItem('${r.id}')" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Claim Item</button>`:''}
                ${r.type==='lost'?`<button onclick="foundItem('${r.id}')" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">I Found This</button>`:''}
            </div>`:''}
            ${mine?`<div class="bg-gray-50 p-4 rounded border text-sm text-gray-600">This is your report. Others can send you notifications.</div>`:''}
        </div>
    </div>`);
}

function claimItem(id) {
    const r = AppState.reports.find(x => x.id === id);
    if (!r) return;
    if (r.claimRequests && r.claimRequests.some(c => c.userId === AppState.currentUser.id)) {
        toast('You already claimed this', 'error'); return;
    }
    if (!r.claimRequests) r.claimRequests = [];
    r.claimRequests.push({id:ID('claim'), userId:AppState.currentUser.id, userName:AppState.currentUser.name, requestedAt:new Date().toISOString()});
    r.status = 'claimed';
    save('reports', AppState.reports);
    AppState.notifications.push({id:ID('notif'), userId:r.userId, type:'claim', message:`${AppState.currentUser.name} claimed your item: ${r.itemName}`, reportId:r.id, createdAt:new Date().toISOString(), read:false});
    AppState.notifications.push({id:ID('notif'), userId:'admin-001', type:'claim', message:`Claim for "${r.itemName}" by ${AppState.currentUser.name}`, reportId:r.id, createdAt:new Date().toISOString(), read:false});
    save('notifications', AppState.notifications);
    toast('Claim sent!', 'success');
    closeModal();
    setDashboardTab(AppState.currentDashboardTab);
}

function foundItem(id) {
    const r = AppState.reports.find(x => x.id === id);
    if (!r) return;
    if (r.foundNotifications && r.foundNotifications.some(f => f.userId === AppState.currentUser.id)) {
        toast('You already notified this', 'error'); return;
    }
    if (!r.foundNotifications) r.foundNotifications = [];
    r.foundNotifications.push({id:ID('found'), userId:AppState.currentUser.id, userName:AppState.currentUser.name, notifiedAt:new Date().toISOString()});
    r.status = 'found';
    save('reports', AppState.reports);
    AppState.notifications.push({id:ID('notif'), userId:r.userId, type:'found', message:`${AppState.currentUser.name} found your item: ${r.itemName}`, reportId:r.id, createdAt:new Date().toISOString(), read:false});
    AppState.notifications.push({id:ID('notif'), userId:'admin-001', type:'found', message:`Found notification for "${r.itemName}" by ${AppState.currentUser.name}`, reportId:r.id, createdAt:new Date().toISOString(), read:false});
    save('notifications', AppState.notifications);
    toast('Found notification sent!', 'success');
    closeModal();
    setDashboardTab(AppState.currentDashboardTab);
}

// NOTIFICATIONS TAB
function renderNotifications() {
    const notifs = AppState.notifications.filter(n => n.userId === AppState.currentUser.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const unread = notifs.filter(n => !n.read).length;
    return `<div><div class="flex justify-between items-center mb-6">
        <div><h2 class="text-3xl font-bold mb-2">Notifications</h2><p class="text-gray-600">Stay updated on your reports</p></div>
        ${unread>0?`<button onclick="markAllRead()" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Mark all as read</button>`:''}
    </div>
    ${notifs.length===0?'<div class="bg-white rounded-lg border p-12 text-center text-gray-500">No notifications yet</div>':notifs.map(n=>{
        const bg = n.type==='approval'||n.type==='completed'?'bg-green-50 border-green-200':n.type==='rejection'?'bg-red-50 border-red-200':'bg-blue-50 border-blue-200';
        return `<div class="${bg} border ${n.read?'':'border-2'} rounded-lg p-4 mb-3">
            <div class="flex justify-between items-start">
                <p class="text-gray-900">${n.message}</p>
                ${!n.read?'<span class="px-2 py-1 bg-blue-500 text-white text-xs rounded">New</span>':''}
            </div>
            <p class="text-sm text-gray-600 mt-2">${formatDateTime(n.createdAt)}</p>
            ${!n.read?`<button onclick="markRead('${n.id}')" class="mt-2 text-sm text-blue-600 hover:underline">Mark as read</button>`:''}
        </div>`;
    }).join('')}
    </div>`;
}

function markRead(id) {
    const n = AppState.notifications.find(x => x.id === id);
    if (n) n.read = true;
    save('notifications', AppState.notifications);
    setDashboardTab('notifications');
}

function markAllRead() {
    AppState.notifications.forEach(n => { if (n.userId === AppState.currentUser.id) n.read = true; });
    save('notifications', AppState.notifications);
    setDashboardTab('notifications');
}

// CREATE REPORT TAB
function renderCreateReport() {
    return `<div class="max-w-2xl mx-auto"><h2 class="text-3xl font-bold mb-2">Create Report</h2><p class="text-gray-600 mb-6">Report a lost or found item</p>
    <div class="bg-white rounded-lg border p-8">
        <div class="mb-6 flex gap-2">
            <button id="typeLost" onclick="setReportType('lost')" class="flex-1 px-4 py-2 border-2 border-blue-600 bg-blue-50 text-blue-600 rounded-lg font-semibold">Lost Item</button>
            <button id="typeFound" onclick="setReportType('found')" class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold">Found Item</button>
        </div>
        <form onsubmit="event.preventDefault(); submitReport(event.target);" class="space-y-4">
            <div><label class="block text-sm font-medium mb-2">Item Name *</label>
            <input name="itemName" required class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Black Laptop"></div>
            
            <div><label class="block text-sm font-medium mb-2">Category *</label>
            <select name="category" required class="w-full px-4 py-2 border rounded-lg">
                ${AppState.categories.map(c=>`<option value="${c}">${c.replace('-',' ')}</option>`).join('')}
            </select></div>
            
            <div><label class="block text-sm font-medium mb-2">Description *</label>
            <textarea name="description" required rows="4" class="w-full px-4 py-2 border rounded-lg" placeholder="Provide details..."></textarea></div>
            
            <div id="lostFields"><label class="block text-sm font-medium mb-2">Date Lost *</label>
            <input name="dateLost" type="date" max="${new Date().toISOString().split('T')[0]}" required class="w-full px-4 py-2 border rounded-lg"></div>
            
            <div id="foundFields" class="hidden"><label class="block text-sm font-medium mb-2">Found Location *</label>
            <input name="foundLocation" class="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Library 2nd Floor"></div>
            
            <div><label class="block text-sm font-medium mb-2">Photo URL (Optional)</label>
            <input name="photoUrl" type="url" class="w-full px-4 py-2 border rounded-lg" placeholder="https://..."></div>
            
            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">Submit Report</button>
        </form>
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <strong>Note:</strong> All reports require admin approval before being published.
        </div>
    </div></div>`;
}

let reportType = 'lost';
function setReportType(type) {
    reportType = type;
    document.getElementById('typeLost').className = type==='lost'?'flex-1 px-4 py-2 border-2 border-blue-600 bg-blue-50 text-blue-600 rounded-lg font-semibold':'flex-1 px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold';
    document.getElementById('typeFound').className = type==='found'?'flex-1 px-4 py-2 border-2 border-blue-600 bg-blue-50 text-blue-600 rounded-lg font-semibold':'flex-1 px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold';
    document.getElementById('lostFields').classList.toggle('hidden', type==='found');
    document.getElementById('foundFields').classList.toggle('hidden', type==='lost');
    const dl = document.querySelector('[name="dateLost"]');
    const fl = document.querySelector('[name="foundLocation"]');
    if (type==='lost') { if(dl) dl.required=true; if(fl) fl.required=false; }
    else { if(dl) dl.required=false; if(fl) fl.required=true; }
}

function submitReport(form) {
    const data = new FormData(form);
    const newReport = {
        id:ID('report'), userId:AppState.currentUser.id, userName:AppState.currentUser.name, userType:AppState.currentUser.type,
        type:reportType, itemName:data.get('itemName'), category:data.get('category'), description:data.get('description'),
        ...(reportType==='lost'?{dateLost:data.get('dateLost')}:{foundLocation:data.get('foundLocation')}),
        ...(data.get('photoUrl')?{photoUrl:data.get('photoUrl')}:{}),
        status:'pending', createdAt:new Date().toISOString(), claimRequests:[], foundNotifications:[]
    };
    AppState.reports.push(newReport);
    save('reports', AppState.reports);
    AppState.notifications.push({id:ID('notif'), userId:'admin-001', type:'claim', message:`New ${reportType} report: ${newReport.itemName} by ${AppState.currentUser.name}`, createdAt:new Date().toISOString(), read:false});
    save('notifications', AppState.notifications);
    toast('Report submitted! Waiting for admin approval.', 'success');
    form.reset();
    setReportType('lost');
}

// ADMIN DASHBOARD
function renderAdminDashboard() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
            <header class="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
                <div class="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        <img src="images/bubt-logo.png" alt="BUBT Logo" class="w-12 h-12 object-contain bg-white rounded-lg p-1">
                        <div><h1 class="text-xl font-bold text-white">Admin Dashboard</h1><p class="text-sm text-purple-200">UniFind - BUBT</p></div>
                    </div>
                    <button onclick="logout()" class="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 flex items-center gap-2">
                        <i data-lucide="log-out" class="w-4 h-4"></i>Logout
                    </button>
                </div>
            </header>
            <nav class="bg-white border-b">
                <div class="container mx-auto px-4 flex gap-1 overflow-x-auto">
                    <button onclick="setAdminTab('pending-users')" id="atab-pending-users" class="atab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="user-plus" class="w-4 h-4"></i>Pending Users</button>
                    <button onclick="setAdminTab('pending-reports')" id="atab-pending-reports" class="atab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="clock" class="w-4 h-4"></i>Pending Reports</button>
                    <button onclick="setAdminTab('approved')" id="atab-approved" class="atab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="check-circle" class="w-4 h-4"></i>Approved Reports</button>
                    <button onclick="setAdminTab('users')" id="atab-users" class="atab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="users" class="w-4 h-4"></i>All Users</button>
                    <button onclick="setAdminTab('completed')" id="atab-completed" class="atab flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap"><i data-lucide="file-check" class="w-4 h-4"></i>Completed</button>
                </div>
            </nav>
            <main class="container mx-auto px-4 py-8" id="admin-content"></main>
        </div>`;
}

function setAdminTab(tab) {
    AppState.currentAdminTab = tab;
    document.querySelectorAll('.atab').forEach(b => {
        b.classList.remove('border-purple-600', 'text-purple-600');
        b.classList.add('border-transparent', 'text-gray-600');
    });
    const active = document.getElementById(`atab-${tab}`);
    if (active) {
        active.classList.remove('border-transparent', 'text-gray-600');
        active.classList.add('border-purple-600', 'text-purple-600');
    }
    
    const content = document.getElementById('admin-content');
    if (tab === 'pending-users') content.innerHTML = renderPendingUsers();
    else if (tab === 'pending-reports') content.innerHTML = renderPendingReports();
    else if (tab === 'approved') content.innerHTML = renderApprovedReports();
    else if (tab === 'users') content.innerHTML = renderAllUsers();
    else if (tab === 'completed') content.innerHTML = renderCompletedReports();
    
    lucide.createIcons();
}

// PENDING USERS (NEW!)
function renderPendingUsers() {
    const pending = AppState.users.filter(u => u.status === 'pending');
    return `<div><h2 class="text-3xl font-bold mb-2">Pending User Registrations</h2><p class="text-gray-600 mb-6">Approve or reject new user accounts</p>
    ${pending.length===0?'<div class="bg-white rounded-lg border p-12 text-center text-gray-500">No pending users</div>':`
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    ${pending.map(u=>`<div class="bg-white rounded-lg border p-6 space-y-3">
        <div class="flex items-start justify-between">
            <div>
                <h3 class="text-lg font-bold">${u.name}</h3>
                <p class="text-sm text-gray-600">${u.email}</p>
            </div>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">${u.type.toUpperCase()}</span>
        </div>
        <div class="text-sm text-gray-600">
            <p>ID/Code: ${u.universityId||u.facultyCode}</p>
            <p class="text-xs text-gray-500">Registered: ${formatDateTime(u.createdAt || new Date().toISOString())}</p>
        </div>
        <div class="flex gap-2 pt-2">
            <button onclick="approveUser('${u.id}')" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold">Approve</button>
            <button onclick="rejectUser('${u.id}')" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold">Reject</button>
        </div>
    </div>`).join('')}
    </div>`}</div>`;
}

function approveUser(id) {
    const u = AppState.users.find(x => x.id === id);
    if (!u) return;
    u.status = 'approved';
    save('users', AppState.users);
    AppState.notifications.push({id:ID('notif'), userId:u.id, type:'approval', message:'Your account has been approved! You can now login to UniFind.', createdAt:new Date().toISOString(), read:false});
    save('notifications', AppState.notifications);
    toast(`${u.name} approved!`, 'success');
    setAdminTab('pending-users');
}

function rejectUser(id) {
    const u = AppState.users.find(x => x.id === id);
    if (!u) return;
    u.status = 'rejected';
    save('users', AppState.users);
    AppState.notifications.push({id:ID('notif'), userId:u.id, type:'rejection', message:'Your account registration has been rejected. Please contact admin for more information.', createdAt:new Date().toISOString(), read:false});
    save('notifications', AppState.notifications);
    toast(`${u.name} rejected`, 'error');
    setAdminTab('pending-users');
}

// PENDING REPORTS
function renderPendingReports() {
    const pending = AppState.reports.filter(r => r.status === 'pending');
    return `<div><h2 class="text-3xl font-bold mb-2">Pending Reports</h2><p class="text-gray-600 mb-6">Review and approve/reject reports</p>
    ${pending.length===0?'<div class="bg-white rounded-lg border p-12 text-center text-gray-500">No pending reports</div>':
    `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${pending.map(r=>`<div class="bg-white rounded-lg border p-6 space-y-3">
        <div class="flex justify-between"><span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">PENDING</span><span class="px-2 py-1 ${r.type==='lost'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'} rounded text-xs">${r.type.toUpperCase()}</span></div>
        <h3 class="text-lg font-bold line-clamp-1">${r.itemName}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">${r.description}</p>
        ${r.photoUrl?`<img src="${r.photoUrl}" class="w-full h-40 object-cover rounded-lg">`:''}
        <p class="text-sm text-gray-600">By: ${r.userName} (${r.userType})</p>
        <div class="flex gap-2">
            <button onclick="approveReport('${r.id}')" class="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Approve</button>
            <button onclick="rejectReport('${r.id}')" class="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Reject</button>
        </div>
    </div>`).join('')}</div>`}</div>`;
}

function approveReport(id) {
    const r = AppState.reports.find(x => x.id === id);
    if (!r) return;
    r.status = 'approved';
    save('reports', AppState.reports);
    AppState.notifications.push({id:ID('notif'), userId:r.userId, type:'approval', message:`Your ${r.type} report for "${r.itemName}" has been approved!`, createdAt:new Date().toISOString(), read:false});
    save('notifications', AppState.notifications);
    toast('Report approved!', 'success');
    setAdminTab('pending-reports');
}

function rejectReport(id) {
    const r = AppState.reports.find(x => x.id === id);
    if (!r) return;
    r.status = 'rejected';
    save('reports', AppState.reports);
    AppState.notifications.push({id:ID('notif'), userId:r.userId, type:'rejection', message:`Your ${r.type} report for "${r.itemName}" has been rejected.`, createdAt:new Date().toISOString(), read:false});
    save('notifications', AppState.notifications);
    toast('Report rejected', 'error');
    setAdminTab('pending-reports');
}

// APPROVED REPORTS
function renderApprovedReports() {
    const approved = AppState.reports.filter(r => r.status === 'approved' || r.status === 'claimed' || r.status === 'found');
    return `<div><h2 class="text-3xl font-bold mb-2">Approved Reports</h2><p class="text-gray-600 mb-6">Manage active reports</p>
    ${approved.length===0?'<div class="bg-white rounded-lg border p-12 text-center text-gray-500">No approved reports</div>':
    `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${approved.map(r=>`<div class="bg-white rounded-lg border p-6 space-y-3">
        <div class="flex justify-between">
            <span class="px-2 py-1 ${r.status==='claimed'?'bg-blue-100 text-blue-700':r.status==='found'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-700'} rounded text-xs">${r.status.toUpperCase()}</span>
            <span class="px-2 py-1 ${r.type==='lost'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'} rounded text-xs">${r.type.toUpperCase()}</span>
        </div>
        <h3 class="text-lg font-bold line-clamp-1">${r.itemName}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">${r.description}</p>
        ${r.photoUrl?`<img src="${r.photoUrl}" class="w-full h-40 object-cover rounded-lg">`:''}
        <p class="text-sm text-gray-600">By: ${r.userName}</p>
        ${r.claimRequests&&r.claimRequests.length>0?`<p class="text-sm text-blue-600">Claims: ${r.claimRequests.length}</p>`:''}
        ${r.foundNotifications&&r.foundNotifications.length>0?`<p class="text-sm text-green-600">Found: ${r.foundNotifications.length}</p>`:''}
        <button onclick="completeReport('${r.id}')" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold">Mark Complete</button>
    </div>`).join('')}</div>`}</div>`;
}

function completeReport(id) {
    const r = AppState.reports.find(x => x.id === id);
    if (!r) return;
    r.status = 'completed';
    save('reports', AppState.reports);
    AppState.notifications.push({id:ID('notif'), userId:r.userId, type:'completed', message:`Your report for "${r.itemName}" has been marked as completed.`, createdAt:new Date().toISOString(), read:false});
    save('notifications', AppState.notifications);
    toast('Report marked complete!', 'success');
    setAdminTab('approved');
}

// ALL USERS
function renderAllUsers() {
    const users = AppState.users;
    return `<div><h2 class="text-3xl font-bold mb-2">User Management</h2><p class="text-gray-600 mb-6">Manage all registered users</p>
    <div class="bg-white rounded-lg border overflow-x-auto">
        <table class="w-full">
            <thead class="bg-gray-50 border-b"><tr>
                <th class="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Type</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">ID/Code</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th class="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr></thead>
            <tbody>${users.map(u=>`<tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">${u.name}</td>
                <td class="px-4 py-3 text-sm">${u.email}</td>
                <td class="px-4 py-3 text-sm"><span class="px-2 py-1 ${u.type==='student'?'bg-blue-100 text-blue-700':'bg-purple-100 text-purple-700'} rounded text-xs">${u.type.toUpperCase()}</span></td>
                <td class="px-4 py-3 text-sm">${u.universityId||u.facultyCode||'N/A'}</td>
                <td class="px-4 py-3 text-sm"><span class="px-2 py-1 ${u.status==='approved'?'bg-green-100 text-green-700':u.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'} rounded text-xs">${u.status||'approved'}</span></td>
                <td class="px-4 py-3 text-sm"><button onclick="toggleBan('${u.id}')" class="px-3 py-1 ${u.isBanned?'bg-green-600':'bg-red-600'} text-white rounded hover:opacity-80 text-xs">${u.isBanned?'Unban':'Ban'}</button></td>
            </tr>`).join('')}</tbody>
        </table>
    </div></div>`;
}

function toggleBan(id) {
    const u = AppState.users.find(x => x.id === id);
    if (!u) return;
    u.isBanned = !u.isBanned;
    save('users', AppState.users);
    toast(`${u.name} ${u.isBanned?'banned':'unbanned'}`, u.isBanned?'error':'success');
    setAdminTab('users');
}

// COMPLETED REPORTS
function renderCompletedReports() {
    const completed = AppState.reports.filter(r => r.status === 'completed' || r.status === 'rejected');
    return `<div><h2 class="text-3xl font-bold mb-2">Completed & Rejected</h2><p class="text-gray-600 mb-6">Archived reports</p>
    ${completed.length===0?'<div class="bg-white rounded-lg border p-12 text-center text-gray-500">No completed/rejected reports</div>':
    `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${completed.map(r=>`<div class="bg-white rounded-lg border p-6 space-y-3">
        <div class="flex justify-between">
            <span class="px-2 py-1 ${r.status==='completed'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'} rounded text-xs">${r.status.toUpperCase()}</span>
            <span class="px-2 py-1 ${r.type==='lost'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'} rounded text-xs">${r.type.toUpperCase()}</span>
        </div>
        <h3 class="text-lg font-bold line-clamp-1">${r.itemName}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">${r.description}</p>
        <p class="text-sm text-gray-600">By: ${r.userName} | ${formatDate(r.createdAt)}</p>
    </div>`).join('')}</div>`}</div>`;
}

// Initialize app on load
window.addEventListener('DOMContentLoaded', () => {
    initData();
    render();
});