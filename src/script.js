/* ==========================================
   APPLICATION STATE & DATA
   ========================================== */

const APP_STATE = {
    currentUser: null,
    isLoggedIn: false,
    userRole: null,
    serviceRequests: [],
    users: [],
    notifications: []
};

// Demo Users Database
const USERS_DATABASE = {
    citizen: {
        email: 'citizen@example.com',
        password: 'password123',
        role: 'citizen',
        name: 'John Doe',
        id: 'C001',
        phone: '+1 (555) 123-4567',
        dob: 'January 15, 1990',
        address: '123 Main Street, City, Country',
        joinDate: 'March 10, 2020'
    },
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User'
    }
};

// Demo Service Requests
const DEMO_SERVICE_REQUESTS = [
    {
        id: 'SR-1001',
        type: 'license',
        description: 'Business license application',
        priority: 'high',
        status: 'completed',
        date: '2026-05-20',
        user: 'John Doe'
    },
    {
        id: 'SR-1002',
        type: 'permit',
        description: 'Construction permit request',
        priority: 'medium',
        status: 'pending',
        date: '2026-06-01',
        user: 'John Doe'
    },
    {
        id: 'SR-1003',
        type: 'certificate',
        description: 'Birth certificate request',
        priority: 'low',
        status: 'completed',
        date: '2026-05-15',
        user: 'John Doe'
    },
    {
        id: 'SR-1004',
        type: 'utility',
        description: 'Utility bill support request',
        priority: 'medium',
        status: 'completed',
        date: '2026-06-02',
        user: 'Jane Smith'
    },
    {
        id: 'SR-1005',
        type: 'complaint',
        description: 'Complaint about service quality',
        priority: 'high',
        status: 'pending',
        date: '2026-06-03',
        user: 'Mike Johnson'
    },
    {
        id: 'SR-1006',
        type: 'license',
        description: 'Professional license renewal',
        priority: 'low',
        status: 'rejected',
        date: '2026-05-28',
        user: 'Sarah Williams'
    },
];

// Demo Users List
const DEMO_USERS = [
    { id: 1, name: 'John Doe', email: 'citizen@example.com', role: 'citizen', status: 'active', joinDate: '2020-03-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'citizen', status: 'active', joinDate: '2021-06-15' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'citizen', status: 'active', joinDate: '2019-11-20' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'citizen', status: 'inactive', joinDate: '2020-07-05' },
    { id: 5, name: 'Robert Brown', email: 'robert@example.com', role: 'citizen', status: 'active', joinDate: '2022-02-14' },
];

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ==========================================
   LOGIN PAGE FUNCTIONALITY
   ========================================== */

function initializeLoginPage() {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Toggle Password Visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                this.textContent = '👁️';
            }
        });
    });

    // Citizen Login Form
    const citizenLoginForm = document.getElementById('citizenLoginForm');
    if (citizenLoginForm) {
        citizenLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('citizen-email').value;
            const password = document.getElementById('citizen-password').value;

            // Validate
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }

            // Check credentials
            if (email === USERS_DATABASE.citizen.email && password === USERS_DATABASE.citizen.password) {
                // Successful login
                APP_STATE.currentUser = USERS_DATABASE.citizen;
                APP_STATE.isLoggedIn = true;
                APP_STATE.userRole = 'citizen';
                localStorage.setItem('userRole', 'citizen');
                localStorage.setItem('userName', USERS_DATABASE.citizen.name);
                localStorage.setItem('userEmail', email);
                
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                showNotification('Invalid email or password', 'error');
            }
        });
    }

    // Admin Login Form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;

            // Validate
            if (username.trim().length === 0) {
                showNotification('Please enter your username', 'error');
                return;
            }

            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }

            // Check credentials
            if (username === USERS_DATABASE.admin.username && password === USERS_DATABASE.admin.password) {
                // Successful login
                APP_STATE.currentUser = USERS_DATABASE.admin;
                APP_STATE.isLoggedIn = true;
                APP_STATE.userRole = 'admin';
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('userName', USERS_DATABASE.admin.name);
                
                showNotification('Admin login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
            } else {
                showNotification('Invalid username or password', 'error');
            }
        });
    }
}

/* ==========================================
   HOME PAGE FUNCTIONALITY
   ========================================== */

function initializeHomePage() {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (!userRole) {
        window.location.href = 'index.html';
        return;
    }

    // Update user display name
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName) {
        userDisplayName.textContent = userName || 'User';
    }

    // Load demo data for citizen
    if (userRole === 'citizen') {
        loadCitizenDashboard();
    }

    // Setup logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Setup user menu
    setupUserMenu();

    // Setup quick links
    setupQuickLinks();

    // Setup service form
    setupServiceForm();

    // Setup profile modal
    setupProfileModal();
}

function loadCitizenDashboard() {
    // Show dashboard stats
    const dashboardStats = document.getElementById('dashboardStats');
    if (dashboardStats) {
        dashboardStats.classList.remove('hidden');
    }

    // Filter requests for current user
    const userRequests = DEMO_SERVICE_REQUESTS.filter(req => req.user === USERS_DATABASE.citizen.name);
    
    // Calculate stats
    const totalRequests = userRequests.length;
    const completedRequests = userRequests.filter(req => req.status === 'completed').length;
    const pendingRequests = userRequests.filter(req => req.status === 'pending').length;
    const rejectedRequests = userRequests.filter(req => req.status === 'rejected').length;

    // Update stats
    document.getElementById('totalRequestsCount').textContent = totalRequests;
    document.getElementById('completedRequestsCount').textContent = completedRequests;
    document.getElementById('pendingRequestsCount').textContent = pendingRequests;
    document.getElementById('rejectedRequestsCount').textContent = rejectedRequests;

    // Show recent requests section
    const recentRequestsSection = document.getElementById('recentRequestsSection');
    if (recentRequestsSection) {
        recentRequestsSection.classList.remove('hidden');
        populateRecentRequests(userRequests);
    }
}

function populateRecentRequests(requests) {
    const tableBody = document.querySelector('#recentRequestsTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    requests.slice(0, 5).forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${capitalizeText(request.type)}</td>
            <td>${formatDate(request.date)}</td>
            <td><span class="status-badge ${request.status}">${capitalizeText(request.status)}</span></td>
            <td><button class="btn btn-small" onclick="viewRequestDetails('${request.id}')">View</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function capitalizeText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function setupUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');

    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', function() {
            userMenu.classList.add('hidden');
        });
    }
}

function setupQuickLinks() {
    const myRequestsLink = document.getElementById('myRequestsLink');
    const newRequestLink = document.getElementById('newRequestLink');
    const profileLink = document.getElementById('profileLink');
    const helpLink = document.getElementById('helpLink');

    const newServiceBtn = document.getElementById('newServiceBtn');

    if (myRequestsLink) {
        myRequestsLink.addEventListener('click', () => {
            showNotification('Viewing your service requests...', 'info');
        });
    }

    if (newRequestLink || newServiceBtn) {
        (newRequestLink || newServiceBtn).addEventListener('click', (e) => {
            e.preventDefault();
            openServiceModal();
        });
    }

    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            openProfileModal();
        });
    }

    if (helpLink) {
        helpLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'help.html';
        });
    }
}

function setupServiceForm() {
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const serviceType = document.getElementById('serviceType').value;
            const priority = document.getElementById('servicePriority').value;
            const description = document.getElementById('serviceDescription').value;

            if (!serviceType || !description) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            if (description.length < 10) {
                showNotification('Description must be at least 10 characters', 'error');
                return;
            }

            // Create new request
            const requestId = 'SR-' + Math.floor(10000 + Math.random() * 90000);
            const newRequest = {
                id: requestId,
                type: serviceType,
                priority: priority,
                status: 'pending',
                description: description,
                date: getCurrentDateTime(),
                user: USERS_DATABASE.citizen.name
            };

            DEMO_SERVICE_REQUESTS.push(newRequest);

            showNotification(`Service request ${requestId} submitted successfully!`, 'success');
            
            // Reset form and close modal
            serviceForm.reset();
            closeServiceModal();

            // Reload dashboard
            loadCitizenDashboard();
        });
    }

    // Cancel button
    const cancelServiceBtn = document.getElementById('cancelServiceBtn');
    if (cancelServiceBtn) {
        cancelServiceBtn.addEventListener('click', closeServiceModal);
    }

    // Modal close button
    const modalClose = document.querySelector('#serviceModal .modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeServiceModal);
    }
}

function openServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function setupProfileModal() {
    const profileBtns = document.querySelectorAll('#profileBtn, #profileLink');
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    const modalClose = document.querySelector('#profileModal .modal-close');

    profileBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openProfileModal();
        });
    });

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', closeProfileModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeProfileModal);
    }
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        // Populate profile data
        document.getElementById('profileName').textContent = USERS_DATABASE.citizen.name;
        document.getElementById('profileRole').textContent = 'Citizen';
        document.getElementById('profileEmail').textContent = USERS_DATABASE.citizen.email;
        document.getElementById('profilePhone').textContent = USERS_DATABASE.citizen.phone;
        document.getElementById('profileDOB').textContent = USERS_DATABASE.citizen.dob;
        document.getElementById('profileID').textContent = USERS_DATABASE.citizen.id;
        document.getElementById('profileAddress').textContent = USERS_DATABASE.citizen.address;
        document.getElementById('profileJoinDate').textContent = USERS_DATABASE.citizen.joinDate;

        modal.classList.remove('hidden');
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    APP_STATE.isLoggedIn = false;
    APP_STATE.currentUser = null;
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

/* ==========================================
   ADMIN PAGE FUNCTIONALITY
   ========================================== */

function initializeAdminPage() {
    const userRole = localStorage.getItem('userRole');
    const adminName = localStorage.getItem('userName');

    if (userRole !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // Update admin name
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = adminName || 'Admin User';
    }

    // Setup sidebar navigation
    setupAdminNavigation();

    // Setup admin logout
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', logout);
    }

    // Load admin data
    loadAdminDashboard();

    // Setup admin functionality
    setupAdminUsers();
    setupAdminRequests();
    setupAdminReports();

    // Setup sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.style.left = sidebar.style.left === '0px' ? '-280px' : '0px';
        });
    }
}

function setupAdminNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const adminSections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('pageTitle');

    const sectionTitles = {
        dashboard: 'Dashboard',
        users: 'Manage Users',
        requests: 'Service Requests',
        reports: 'Reports',
        settings: 'System Settings'
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');

            // Remove active class from all sections
            adminSections.forEach(sec => sec.classList.remove('active'));
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Add active class to selected section
            document.getElementById(section + 'Section').classList.add('active');
            this.classList.add('active');

            // Update page title
            if (pageTitle) {
                pageTitle.textContent = sectionTitles[section] || 'Dashboard';
            }
        });
    });
}

function loadAdminDashboard() {
    // Update dashboard statistics
    document.getElementById('totalUsersCount').textContent = DEMO_USERS.length;
    document.getElementById('totalRequestsCount').textContent = DEMO_SERVICE_REQUESTS.length;
    document.getElementById('completedRequestsCount').textContent = 
        DEMO_SERVICE_REQUESTS.filter(r => r.status === 'completed').length;
    document.getElementById('pendingRequestsCount').textContent = 
        DEMO_SERVICE_REQUESTS.filter(r => r.status === 'pending').length;
}

function setupAdminUsers() {
    const addUserBtn = document.getElementById('addUserBtn');
    const userForm = document.getElementById('userForm');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const userModal = document.getElementById('userModal');
    const usersTable = document.getElementById('usersTable');
    const userSearchInput = document.getElementById('userSearchInput');
    const userRoleFilter = document.getElementById('userRoleFilter');
    const userStatusFilter = document.getElementById('userStatusFilter');
    const userModalClose = document.querySelector('#userModal .modal-close');

    // Add user button
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            document.getElementById('userModalTitle').textContent = 'Add New User';
            userForm.reset();
            if (userModal) userModal.classList.remove('hidden');
        });
    }

    // Form submit
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const firstName = document.getElementById('userFirstName').value;
            const lastName = document.getElementById('userLastName').value;
            const email = document.getElementById('userEmail').value;
            const phone = document.getElementById('userPhone').value;
            const role = document.getElementById('userRole').value;
            const status = document.getElementById('userStatus').value;

            if (!firstName || !lastName || !email || !role) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showNotification('Please enter a valid email', 'error');
                return;
            }

            const newUser = {
                id: DEMO_USERS.length + 1,
                name: `${firstName} ${lastName}`,
                email: email,
                phone: phone || 'N/A',
                role: role,
                status: status,
                joinDate: getCurrentDateTime()
            };

            DEMO_USERS.push(newUser);
            showNotification('User added successfully!', 'success');
            userForm.reset();
            if (userModal) userModal.classList.add('hidden');
            populateUsersTable(DEMO_USERS);
        });
    }

    // Cancel button
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', () => {
            if (userModal) userModal.classList.add('hidden');
        });
    }

    if (userModalClose) {
        userModalClose.addEventListener('click', () => {
            if (userModal) userModal.classList.add('hidden');
        });
    }

    // Filter and search
    if (userSearchInput) {
        userSearchInput.addEventListener('input', filterUsers);
    }

    if (userRoleFilter) {
        userRoleFilter.addEventListener('change', filterUsers);
    }

    if (userStatusFilter) {
        userStatusFilter.addEventListener('change', filterUsers);
    }

    // Populate initial table
    populateUsersTable(DEMO_USERS);
}

function populateUsersTable(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${capitalizeText(user.role)}</td>
            <td><span class="status-badge ${user.status}">${capitalizeText(user.status)}</span></td>
            <td>${formatDate(user.joinDate)}</td>
            <td>
                <button class="btn btn-small" onclick="editUser(${user.id})">✏️ Edit</button>
                <button class="btn btn-small" onclick="deleteUser(${user.id})" style="margin-left: 5px; background-color: #ef4444; color: white;">🗑️ Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearchInput').value.toLowerCase();
    const roleFilter = document.getElementById('userRoleFilter').value;
    const statusFilter = document.getElementById('userStatusFilter').value;

    const filtered = DEMO_USERS.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    populateUsersTable(filtered);
}

function editUser(userId) {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (!user) return;

    const userModal = document.getElementById('userModal');
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userFirstName').value = user.name.split(' ')[0];
    document.getElementById('userLastName').value = user.name.split(' ')[1] || '';
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPhone').value = user.phone;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;

    if (userModal) userModal.classList.remove('hidden');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const index = DEMO_USERS.findIndex(u => u.id === userId);
        if (index > -1) {
            DEMO_USERS.splice(index, 1);
            showNotification('User deleted successfully!', 'success');
            populateUsersTable(DEMO_USERS);
        }
    }
}

function setupAdminRequests() {
    const requestsTable = document.getElementById('requestsTable');
    const requestSearchInput = document.getElementById('requestSearchInput');
    const requestTypeFilter = document.getElementById('requestTypeFilter');
    const requestStatusFilter = document.getElementById('requestStatusFilter');

    if (requestSearchInput) {
        requestSearchInput.addEventListener('input', filterRequests);
    }

    if (requestTypeFilter) {
        requestTypeFilter.addEventListener('change', filterRequests);
    }

    if (requestStatusFilter) {
        requestStatusFilter.addEventListener('change', filterRequests);
    }

    populateRequestsTable(DEMO_SERVICE_REQUESTS);
}

function populateRequestsTable(requests) {
    const tableBody = document.querySelector('#requestsTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    requests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${request.user}</td>
            <td>${capitalizeText(request.type)}</td>
            <td>${capitalizeText(request.priority)}</td>
            <td><span class="status-badge ${request.status}">${capitalizeText(request.status)}</span></td>
            <td>${formatDate(request.date)}</td>
            <td>
                <button class="btn btn-small" onclick="updateRequestStatus('${request.id}')">Update</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterRequests() {
    const searchTerm = document.getElementById('requestSearchInput').value.toLowerCase();
    const typeFilter = document.getElementById('requestTypeFilter').value;
    const statusFilter = document.getElementById('requestStatusFilter').value;

    const filtered = DEMO_SERVICE_REQUESTS.filter(req => {
        const matchesSearch = req.id.toLowerCase().includes(searchTerm) || 
                            req.user.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || req.type === typeFilter;
        const matchesStatus = !statusFilter || req.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    populateRequestsTable(filtered);
}

function updateRequestStatus(requestId) {
    const request = DEMO_SERVICE_REQUESTS.find(r => r.id === requestId);
    if (!request) return;

    const modal = document.getElementById('requestModal');
    document.getElementById('requestIDDisplay').value = requestId;
    if (modal) modal.classList.remove('hidden');

    // Setup form submit
    const requestStatusForm = document.getElementById('requestStatusForm');
    if (requestStatusForm) {
        requestStatusForm.onsubmit = function(e) {
            e.preventDefault();
            const newStatus = document.getElementById('requestStatusSelect').value;
            const comment = document.getElementById('requestComment').value;

            if (!newStatus) {
                showNotification('Please select a status', 'error');
                return;
            }

            request.status = newStatus;
            showNotification(`Request ${requestId} status updated to ${capitalizeText(newStatus)}!`, 'success');
            modal.classList.add('hidden');
            populateRequestsTable(DEMO_SERVICE_REQUESTS);
        };
    }

    // Setup cancel button
    const cancelRequestBtn = document.getElementById('cancelRequestBtn');
    if (cancelRequestBtn) {
        cancelRequestBtn.onclick = () => {
            modal.classList.add('hidden');
        };
    }

    // Setup modal close
    const modalClose = document.querySelector('#requestModal .modal-close');
    if (modalClose) {
        modalClose.onclick = () => {
            modal.classList.add('hidden');
        };
    }
}

function setupAdminReports() {
    // Reports are static display, no additional setup needed
    // They display the demo data already
}

/* ==========================================
   GENERAL PAGE FUNCTIONALITY
   ========================================== */

function initializeFunctionsPage() {
    setupUserMenuFunctions();
    setupLogoutFunctions();
}

function initializeHelpPage() {
    setupUserMenuFunctions();
    setupLogoutFunctions();

    // Setup details/summary for troubleshooting
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                // Close other details
                details.forEach(d => {
                    if (d !== this) d.open = false;
                });
            }
        });
    });
}

function setupUserMenuFunctions() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    const userDisplayName = document.getElementById('userDisplayName');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (userDisplayName) {
        if (userRole && userName) {
            userDisplayName.textContent = userName;
        } else {
            userDisplayName.textContent = 'Guest';
        }
    }

    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', function() {
            userMenu.classList.add('hidden');
        });
    }

    const profileBtns = document.querySelectorAll('#profileBtn');
    profileBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (userRole === 'citizen') {
                openProfileModal();
            } else {
                showNotification('Please log in to view your profile', 'info');
            }
        });
    });

    const logoutButtons = document.querySelectorAll('#logoutBtn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });

    const settingsButtons = document.querySelectorAll('#settingsBtn');
    settingsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Settings feature coming soon', 'info');
        });
    });
}

function setupLogoutFunctions() {
    const logoutButtons = document.querySelectorAll('#logoutBtn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
}

function viewRequestDetails(requestId) {
    showNotification(`Viewing request details for ${requestId}`, 'info');
}

/* ==========================================
   INITIALIZATION
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;

    // Initialize based on current page
    if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
        initializeLoginPage();
    } else if (currentPage.includes('home.html')) {
        initializeHomePage();
    } else if (currentPage.includes('admin.html')) {
        initializeAdminPage();
    } else if (currentPage.includes('functions.html')) {
        initializeFunctionsPage();
    } else if (currentPage.includes('help.html')) {
        initializeHelpPage();
    }
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});
