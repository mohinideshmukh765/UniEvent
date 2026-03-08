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
                        <div class="stat-info"><h3>Total Colleges</h3><p>48</p></div>
                        <div style="margin-left: auto; color: #10b981; font-size: 0.8rem; font-weight: 600;"><i class="fas fa-arrow-up"></i> +2</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #f5f3ff; color: #8b5cf6;"><i class="fas fa-users"></i></div>
                        <div class="stat-info"><h3>Total Students</h3><p>6,200</p></div>
                        <div style="margin-left: auto; color: #10b981; font-size: 0.8rem; font-weight: 600;"><i class="fas fa-arrow-up"></i> +12%</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #fff1f2; color: #f43f5e;"><i class="fas fa-calendar-alt"></i></div>
                        <div class="stat-info"><h3>Total Events</h3><p>135</p></div>
                        <div style="margin-left: auto; color: #64748b; font-size: 0.8rem;">Active now</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;"><i class="fas fa-ticket-alt"></i></div>
                        <div class="stat-info"><h3>Total Registrations</h3><p>3,980</p></div>
                        <div style="margin-left: auto; color: #10b981; font-size: 0.8rem; font-weight: 600;"><i class="fas fa-arrow-up"></i> +8%</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-top: 2rem;">
                    <div class="card">
                        <div class="flex-between">
                            <h3>District Event Distribution</h3>
                            <a href="#" style="color: var(--primary); font-size: 0.8rem; font-weight: 600; text-decoration: none;">Download Report</a>
                        </div>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 2rem;">Regional event density across university jurisdiction</p>
                        
                        <div style="height: 300px; display: flex; align-items: flex-end; justify-content: space-around; padding: 0 2rem; border-bottom: 2px solid var(--border-color);">
                            <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                                <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: 85%; background: #cbd5e1; border-radius: 8px 8px 0 0;"></div>
                                <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Kolhapur</span>
                            </div>
                            <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                                <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: 45%; background: #cbd5e1; border-radius: 8px 8px 0 0;"></div>
                                <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Sangli</span>
                            </div>
                            <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                                <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: 35%; background: #cbd5e1; border-radius: 8px 8px 0 0;"></div>
                                <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Satara</span>
                            </div>
                        </div>
                        
                        <div style="margin-top: 3rem;">
                            <h3>Recent Activities</h3>
                            <div style="margin-top: 1rem;">
                                <div class="recent-activity-item">
                                    <span style="font-size: 0.8rem; color: var(--text-muted); width: 80px;">10:30 AM</span>
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.9rem; font-weight: 600;">Technical Symposia created</p>
                                    </div>
                                    <span style="font-size: 0.9rem; color: var(--text-muted); width: 150px;">KIT College of Engineering</span>
                                    <span class="status-badge" style="background: #dcfce7; color: #166534;">Published</span>
                                </div>
                                <div class="recent-activity-item">
                                    <span style="font-size: 0.8rem; color: var(--text-muted); width: 80px;">09:45 AM</span>
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.9rem; font-weight: 600;">New student registration</p>
                                    </div>
                                    <span style="font-size: 0.9rem; color: var(--text-muted); width: 150px;">DKTE Institute, Ichalkaranji</span>
                                    <span class="status-badge" style="background: #fff7ed; color: #9a3412;">Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="card">
                            <div class="flex-between" style="margin-bottom: 1.5rem;">
                                <h3>Upcoming Events</h3>
                                <i class="fas fa-ellipsis-h" style="color: var(--text-muted);"></i>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 1rem;">
                                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                                    <div style="background: #eff6ff; padding: 0.5rem; border-radius: 8px; text-align: center; min-width: 60px;">
                                        <div style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: var(--primary);">Oct</div>
                                        <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">24</div>
                                    </div>
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.9rem; font-weight: 700;">Youth Festival 2024</p>
                                        <p style="font-size: 0.8rem; color: var(--text-muted);">Shivaji University Main Campus</p>
                                        <div class="flex-between" style="margin-top: 0.5rem;">
                                            <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="fas fa-users"></i> 450 REG.</span>
                                            <a href="#" style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-decoration: none;">View Details</a>
                                        </div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                                    <div style="background: #f5f3ff; padding: 0.5rem; border-radius: 8px; text-align: center; min-width: 60px;">
                                        <div style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: #8b5cf6;">Nov</div>
                                        <div style="font-size: 1.25rem; font-weight: 800; color: #8b5cf6;">02</div>
                                    </div>
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.9rem; font-weight: 700;">Robo-War Championship</p>
                                        <p style="font-size: 0.8rem; color: var(--text-muted);">Willingdon College, Sangli</p>
                                        <div class="flex-between" style="margin-top: 0.5rem;">
                                            <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="fas fa-users"></i> 120 REG.</span>
                                            <a href="#" style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-decoration: none;">View Details</a>
                                        </div>
                                    </div>
                                </div>
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
        approvals: `
            <div class="animate-slide">
                <h1 style="margin-bottom: 2rem;">College Approvals</h1>
                <div class="card">
                    <div class="card-header">
                        <h3>Pending Applications</h3>
                    </div>
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>College Name</th>
                                    <th>District</th>
                                    <th>Coordinator</th>
                                    <th>Applied Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Shivaji Science Institute</strong></td>
                                    <td><span class="district-badge district-kolhapur">Kolhapur</span></td>
                                    <td>Dr. A. B. Deshpande</td>
                                    <td>Oct 12, 2024</td>
                                    <td class="action-btns">
                                        <button class="btn-primary" style="background: var(--secondary);">Approve</button>
                                        <button class="btn-primary" style="background: var(--danger);">Reject</button>
                                    </td>
                                </tr>
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
