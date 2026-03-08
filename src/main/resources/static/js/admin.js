/**
 * Admin Panel Core Logic
 * Handles dynamic content loading for the Super Admin portal.
 */

const AdminPanel = {
    currentPage: 'dashboard',
    
    // Page Content Templates
    templates: {
        dashboard: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Admin Dashboard</h1>
                    <button class="btn-primary" style="background: var(--navy-sidebar);"><i class="fas fa-download"></i> Download Report</button>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;"><i class="fas fa-university"></i></div>
                        <div class="stat-info"><h3>Total Colleges</h3><p id="stat-colleges">--</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #f5f3ff; color: #8b5cf6;"><i class="fas fa-users"></i></div>
                        <div class="stat-info"><h3>Total Students</h3><p id="stat-students">--</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-info"><h3>Upcoming Events</h3><p id="stat-upcoming">--</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #fff1f2; color: #f43f5e;"><i class="fas fa-history"></i></div>
                        <div class="stat-info"><h3>Past Events</h3><p id="stat-past">--</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #fdf2f8; color: #db2777;"><i class="fas fa-ticket-alt"></i></div>
                        <div class="stat-info"><h3>Total Registrations</h3><p id="stat-registrations">--</p></div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-top: 2rem;">
                    <div class="card">
                        <div class="flex-between">
                            <h3>District Event Distribution</h3>
                            <a href="#" style="color: var(--primary); font-size: 0.8rem; font-weight: 600; text-decoration: none;">Download Report</a>
                        </div>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 2rem;">Regional event density across university jurisdiction</p>
                        
                        <div id="district-chart" style="height: 300px; display: flex; align-items: flex-end; justify-content: space-around; padding: 0 2rem; border-bottom: 2px solid var(--border-color);">
                            <!-- Chart bars will be injected here -->
                            <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                                <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: 65%; background: #3b82f6; border-radius: 8px 8px 0 0;"></div>
                                <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Kolhapur</span>
                            </div>
                            <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                                <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: 45%; background: #3b82f6; border-radius: 8px 8px 0 0;"></div>
                                <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Sangli</span>
                            </div>
                            <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                                <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: 35%; background: #3b82f6; border-radius: 8px 8px 0 0;"></div>
                                <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Satara</span>
                            </div>
                        </div>
                        
                        <div style="margin-top: 3rem;">
                            <h3>Recent Activities</h3>
                            <div id="activity-list" style="margin-top: 1rem;">
                                <p style="color: var(--text-muted);">Loading activities...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="card">
                            <div class="flex-between" style="margin-bottom: 1.5rem;">
                                <h3>Active Upcoming Events</h3>
                                <i class="fas fa-ellipsis-h" style="color: var(--text-muted);"></i>
                            </div>
                            <div id="upcoming-events-list" style="display: flex; flex-direction: column; gap: 1rem;">
                                <p style="color: var(--text-muted);">Loading events...</p>
                            </div>
                            <button class="btn-primary" style="width: 100%; margin-top: 2rem; background: white; color: var(--text-main); border: 1px solid var(--border-color);">View Calendar</button>
                        </div>
                        
                        <div class="card" style="background: var(--navy-sidebar); color: white;">
                            <h3 style="color: white; margin-bottom: 0.5rem;">Need assistance?</h3>
                            <p style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 1.5rem;">The event management support team is available 24/7 for technical issues.</p>
                            <button class="btn-primary" style="width: 100%; background: var(--primary);">Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        onboarding: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <div>
                        <h1>Add & Onboard Colleges</h1>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">View registered colleges and perform bulk onboarding via Excel</p>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <input type="file" id="bulkExcelUpload" accept=".xlsx, .xls" style="display: none;">
                        <button class="btn-primary" onclick="document.getElementById('bulkExcelUpload').click()">
                            <i class="fas fa-file-excel"></i> Bulk Upload Colleges
                        </button>
                    </div>
                </div>

                <!-- Onboarding Confirmation Modal -->
                <div id="onboardingModal" class="modal-overlay">
                    <div class="modal-content">
                        <div style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"><i class="fas fa-file-import"></i></div>
                        <h2>Confirm Upload</h2>
                        <p id="onboardingFileInfo">Are you sure you want to onboard colleges from this file?</p>
                        <div class="modal-actions">
                            <button class="btn-primary" style="background: var(--text-muted);" onclick="document.getElementById('onboardingModal').style.display='none'">Cancel</button>
                            <button class="btn-primary" id="confirmOnboardingBtn">Submit & Send Emails</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="flex-between" style="margin-bottom: 1.5rem;">
                        <h3>Registered Colleges & Coordinators</h3>
                        <div class="search-box" style="width: 300px;">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Filter colleges...">
                        </div>
                    </div>
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>College Code</th>
                                    <th>College Name</th>
                                    <th>Coordinator</th>
                                    <th>Email</th>
                                    <th>City/District</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="registered-colleges-body">
                                <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Loading colleges...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        colleges: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <div>
                        <h1>Colleges Directory</h1>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Manage and monitor affiliated institutions across districts</p>
                    </div>
                    <button class="btn-primary"><i class="fas fa-plus"></i> Add New College</button>
                </div>
                
                <div class="card">
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search by name, code or location...">
                        </div>
                        <select style="padding: 0.6rem 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
                            <option>All Districts</option>
                            <option>Kolhapur</option>
                            <option>Sangli</option>
                            <option>Satara</option>
                        </select>
                        <select style="padding: 0.6rem 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Pending</option>
                            <option>Disabled</option>
                        </select>
                    </div>

                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>College Name</th>
                                    <th>District</th>
                                    <th>Coordinators</th>
                                    <th>Total Events</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div style="display: flex; gap: 1rem; align-items: center;">
                                            <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary);"><i class="fas fa-university"></i></div>
                                            <div>
                                                <div style="font-weight: 700;">Rajaram College</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted);">Code: RC-2023</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Kolhapur</td>
                                    <td><div style="display: flex; gap: -10px;"><div style="width: 24px; height: 24px; border-radius: 50%; background: #fbbf24; border: 2px solid white;"></div><div style="width: 24px; height: 24px; border-radius: 50%; background: #f87171; border: 2px solid white; margin-left: -8px;"></div></div></td>
                                    <td>42</td>
                                    <td><span class="status-badge status-active">● Active</span></td>
                                    <td class="action-btns">
                                        <button style="border: none; background: none; color: var(--text-muted); cursor: pointer;"><i class="fas fa-edit"></i></button>
                                        <button style="border: none; background: none; color: var(--text-muted); cursor: pointer;"><i class="fas fa-external-link-alt"></i></button>
                                        <button style="border: none; background: none; color: var(--text-muted); cursor: pointer;"><i class="fas fa-ban"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <h3>Featured Institutions</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1.5rem;">
                    <div class="card" style="padding: 0; overflow: hidden;">
                        <div style="height: 100px; background: linear-gradient(to right, #4f46e5, #3b82f6);"></div>
                        <div style="padding: 1.5rem; position: relative;">
                            <div style="width: 60px; height: 60px; background: white; border-radius: 12px; position: absolute; top: -30px; box-shadow: var(--shadow-md); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--primary);"><i class="fas fa-university"></i></div>
                            <div style="margin-top: 1.5rem;">
                                <h4 style="font-weight: 800;">Shivaji Science Institute</h4>
                                <p style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-map-marker-alt"></i> KOLHAPUR</p>
                            </div>
                            <div class="flex-between" style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                                <div><small style="color: var(--text-muted);">EVENTS</small><div style="font-weight: 800;">128</div></div>
                                <div><small style="color: var(--text-muted);">RANK</small><div style="font-weight: 800;">#4</div></div>
                                <span class="status-badge status-active">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        coordinators: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Coordinator Management</h1>
                    <button class="btn-primary"><i class="fas fa-plus"></i> Add Coordinator</button>
                </div>
                <div class="card">
                    <table class="data-table">
                        <thead><tr><th>Name</th><th>College</th><th>Email</th><th>Actions</th></tr></thead>
                        <tbody>
                            <tr>
                                <td><strong>Prof. Rahul Patil</strong></td>
                                <td>KIT College</td>
                                <td>rahul@kit.edu</td>
                                <td class="action-btns">
                                    <button class="btn-primary" style="background: var(--primary);">Reset Pass</button>
                                    <button class="btn-primary" style="background: var(--danger);">Deactivate</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        events: `
            <div class="animate-slide">
                <h1>Event Moderation</h1>
                <div class="stats-grid" style="margin: 2rem 0;">
                    <div class="stat-card"><h3>Live Events</h3><p>24</p></div>
                    <div class="stat-card"><h3>Pending Review</h3><p>8</p></div>
                </div>
                <div class="card">
                    <table class="data-table">
                        <thead><tr><th>Title</th><th>College</th><th>District</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            <tr>
                                <td><strong>Hackathon 2024</strong></td>
                                <td>WCE Sangli</td>
                                <td>Sangli</td>
                                <td><span class="status-badge status-active">Live</span></td>
                                <td class="action-btns">
                                    <button class="btn-primary">View</button>
                                    <button class="btn-primary" style="background: var(--danger);">Suspend</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        categories: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Event Categories</h1>
                    <button class="btn-primary">Add Category</button>
                </div>
                <div class="card">
                   <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                        <div class="card" style="text-align: center;"><h3>Technical</h3><p>45 Events</p></div>
                        <div class="card" style="text-align: center;"><h3>Cultural</h3><p>32 Events</p></div>
                        <div class="card" style="text-align: center;"><h3>Sports</h3><p>28 Events</p></div>
                   </div>
                </div>
            </div>
        `,
        students: `
            <div class="animate-slide">
                <h1>Student Directory</h1>
                <div class="card">
                    <div class="search-box" style="margin-bottom: 1.5rem;"><i class="fas fa-search"></i><input type="text" placeholder="Search globally..."></div>
                    <table class="data-table">
                        <thead><tr><th>Name</th><th>College</th><th>District</th><th>Status</th></tr></thead>
                        <tbody>
                            <tr><td>Aryan Sharma</td><td>KIT College</td><td>Kolhapur</td><td><span class="status-badge status-active">Active</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        registrations: `
            <div class="animate-slide">
                <h1>Registration Monitoring</h1>
                <div class="card">
                    <div class="flex-between"><h3>Live Ticker</h3><button class="btn-primary">Export CSV</button></div>
                    <table class="data-table" style="margin-top: 1.5rem;">
                        <thead><tr><th>Event</th><th>Student</th><th>Time</th></tr></thead>
                        <tbody>
                            <tr><td>AI Workshop</td><td>Sameer K.</td><td>10 mins ago</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        posts: `
            <div class="animate-slide">
                <h1>Post Moderation</h1>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-top: 2rem;">
                    <div class="card">
                        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80" style="width: 100%; border-radius: 12px;">
                        <div class="flex-between" style="margin-top: 1rem;">
                            <h4>Winners of Tech-Fest</h4>
                            <div class="action-btns"><button class="btn-primary">Approve</button><button class="btn-primary" style="background: var(--danger);">Delete</button></div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        analytics: `
            <div class="animate-slide">
                <h1>District Analytics</h1>
                <div class="stats-grid" style="margin: 2rem 0;">
                    <div class="card"><h3>Kolhapur</h3><p>Active</p></div>
                    <div class="card"><h3>Sangli</h3><p>Steady</p></div>
                    <div class="card"><h3>Satara</h3><p>Growing</p></div>
                </div>
            </div>
        `,
        notifications: `
            <div class="animate-slide">
                <h1>Global Notifications</h1>
                <div class="card">
                    <form style="display: flex; flex-direction: column; gap: 1rem;">
                        <input type="text" class="form-input" placeholder="Announcement Title" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <textarea placeholder="Message content..." style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border-color); height: 100px;"></textarea>
                        <button class="btn-primary">Blast Notification</button>
                    </form>
                </div>
            </div>
        `,
        reports: `
            <div class="animate-slide">
                <h1>System Reports</h1>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
                    <div class="card"><h4>Event Reports</h4><button class="btn-primary">PDF</button></div>
                    <div class="card"><h4>Student Stats</h4><button class="btn-primary">CSV</button></div>
                    <div class="card"><h4>College Activity</h4><button class="btn-primary">Export</button></div>
                </div>
            </div>
        `,
        logs: `
            <div class="animate-slide">
                <h1>Activity Logs</h1>
                <div class="card">
                    <table class="data-table">
                        <thead><tr><th>Time</th><th>User</th><th>Action</th></tr></thead>
                        <tbody>
                            <tr><td>10:45</td><td>Admin</td><td>Updated System Rules</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        settings: `
            <div class="animate-slide">
                <h1>System Settings</h1>
                <div class="card">
                    <h3>General Platform Configuration</h3>
                    <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                        <div class="flex-between"><span>Max Image Size</span><input type="text" value="5MB"></div>
                        <div class="flex-between"><span>Maintenance Mode</span><input type="checkbox"></div>
                    </div>
                </div>
            </div>
        `,
        "ai-insights": `
            <div class="animate-slide">
                <h1 style="color: var(--primary);">AI Insights Dashboard</h1>
                <div class="stats-grid" style="margin-top: 2rem;">
                    <div class="card" style="background: linear-gradient(135deg, #1e293b, #3b82f6); color: white;">
                        <h4 style="color: white;">Trending Now</h4>
                        <h2>AI Workshops</h2>
                        <small>+45% Intereset spike</small>
                    </div>
                    <div class="card">
                        <h4>Predicted High Attendance</h4>
                        <p>Robo-War 2024</p>
                    </div>
                </div>
            </div>
        `
    },

    init() {
        this.render();
        this.setupEventListeners();
        if (this.currentPage === 'dashboard') {
            this.loadDashboardData();
        } else if (this.currentPage === 'onboarding') {
            this.loadOnboardingData();
        }
        console.log("Admin Panel Initialized");
    },

    navigate(pageId) {
        this.currentPage = pageId;
        this.render();
        
        // Update active class in sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        if (pageId === 'dashboard') {
            this.loadDashboardData();
        } else if (pageId === 'onboarding') {
            this.loadOnboardingData();
        }
    },

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },

    async loadOnboardingData() {
        try {
            const res = await fetch('/api/admin/colleges/registered', {
                headers: this.getAuthHeaders()
            });
            if (res.ok) {
                const colleges = await res.json();
                const tbody = document.getElementById('registered-colleges-body');
                if (tbody) {
                    if (colleges.length === 0) {
                        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No colleges registered yet.</td></tr>`;
                    } else {
                        tbody.innerHTML = colleges.map(c => `
                            <tr>
                                <td><code>${c.collegeCode}</code></td>
                                <td><strong>${c.collegeName}</strong></td>
                                <td>${c.coordinatorName}</td>
                                <td>${c.email}</td>
                                <td>${c.city}, ${c.district}</td>
                                <td><span class="status-badge status-active">● Registered</span></td>
                            </tr>
                        `).join('');
                    }
                }
            }
            
            // Re-setup upload listener
            const uploadInput = document.getElementById('bulkExcelUpload');
            if (uploadInput) {
                uploadInput.addEventListener('change', (e) => this.handleOnboardingUpload(e));
            }
        } catch (error) {
            console.error("Error loading onboarding data:", error);
        }
    },

    async handleOnboardingUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Store file reference
        this.pendingOnboardingFile = file;

        // Show modal
        const modal = document.getElementById('onboardingModal');
        const fileInfo = document.getElementById('onboardingFileInfo');
        const confirmBtn = document.getElementById('confirmOnboardingBtn');

        if (modal && fileInfo && confirmBtn) {
            fileInfo.innerHTML = `File: <strong>${file.name}</strong><br><br>This will create college records and send login credentials to all coordinators listed in the sheet.`;
            modal.style.display = 'flex';

            // Reset listener
            confirmBtn.onclick = () => this.submitBulkOnboarding();
        }
    },

    async submitBulkOnboarding() {
        const file = this.pendingOnboardingFile;
        if (!file) return;

        const modal = document.getElementById('onboardingModal');
        const confirmBtn = document.getElementById('confirmOnboardingBtn');
        const formData = new FormData();
        formData.append('file', file);

        try {
            confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
            confirmBtn.disabled = true;

            const res = await fetch('/api/admin/colleges/upload', {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: formData
            });

            if (res.ok) {
                const msg = await res.text();
                alert(msg);
                modal.style.display = 'none';
                this.loadOnboardingData();
            } else {
                const err = await res.text();
                alert("Upload failed: " + err);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file: " + error.message);
        } finally {
            confirmBtn.innerHTML = `Submit & Send Emails`;
            confirmBtn.disabled = false;
            // Clear input
            document.getElementById('bulkExcelUpload').value = '';
        }
    },

    async loadDashboardData() {
        try {
            // Stats
            const statsRes = await fetch('/api/admin/stats', {
                headers: this.getAuthHeaders()
            });
            if (statsRes.ok) {
                const stats = await statsRes.json();
                document.getElementById('stat-colleges').textContent = stats.totalColleges || 0;
                document.getElementById('stat-students').textContent = stats.totalStudents || 0;
                document.getElementById('stat-upcoming').textContent = stats.upcomingEvents || 0;
                document.getElementById('stat-past').textContent = stats.pastEvents || 0;
                document.getElementById('stat-registrations').textContent = stats.totalRegistrations || 0;
            }

            // Upcoming Events
            const eventsRes = await fetch('/api/admin/events/upcoming-active', {
                headers: this.getAuthHeaders()
            });
            if (eventsRes.ok) {
                const events = await eventsRes.json();
                const eventsList = document.getElementById('upcoming-events-list');
                if (eventsList) {
                    if (events.length === 0) {
                        eventsList.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-muted);">No active upcoming events.</p>`;
                    } else {
                        eventsList.innerHTML = events.slice(0, 5).map(event => `
                            <div style="display: flex; gap: 1rem; align-items: flex-start;">
                                <div style="background: #eff6ff; padding: 0.5rem; border-radius: 8px; text-align: center; min-width: 60px;">
                                    <div style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: var(--primary);">${new Date(event.eventDate).toLocaleString('default', { month: 'short' })}</div>
                                    <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">${new Date(event.eventDate).getDate()}</div>
                                </div>
                                <div style="flex: 1;">
                                    <p style="font-size: 0.9rem; font-weight: 700;">${event.title}</p>
                                    <p style="font-size: 0.8rem; color: var(--text-muted);">${event.college ? event.college.name : 'University'}</p>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            }

            // Recent Activities
            const activitiesRes = await fetch('/api/admin/recent-activities', {
                headers: this.getAuthHeaders()
            });
            if (activitiesRes.ok) {
                const activities = await activitiesRes.json();
                const activityList = document.getElementById('activity-list');
                if (activityList) {
                    activityList.innerHTML = activities.slice(0, 6).map(activity => `
                        <div class="recent-activity-item">
                            <span style="font-size: 0.8rem; color: var(--text-muted); width: 80px;">${new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <div style="flex: 1;">
                                <p style="font-size: 0.9rem; font-weight: 600;">${activity.action}</p>
                                <small style="color: var(--text-muted);">${activity.details}</small>
                            </div>
                        </div>
                    `).join('');
                }
            }

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }
    },

    render() {
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            contentArea.innerHTML = this.templates[this.currentPage] || `<h1>404</h1><p>Page not found</p>`;
        }
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.navigate(pageId);
            });
        });
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/login.html';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});
