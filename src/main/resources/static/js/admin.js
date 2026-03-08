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
                <h1 style="margin-bottom: 2rem;">System Overview</h1>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #eef2ff; color: #4f46e5;"><i class="fas fa-university"></i></div>
                        <div class="stat-info"><h3>Total Colleges</h3><p>48</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;"><i class="fas fa-user-graduate"></i></div>
                        <div class="stat-info"><h3>Total Students</h3><p>12,450</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #fff7ed; color: #f59e0b;"><i class="fas fa-calendar-alt"></i></div>
                        <div class="stat-info"><h3>Total Events</h3><p>156</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #fef2f2; color: #ef4444;"><i class="fas fa-exclamation-circle"></i></div>
                        <div class="stat-info"><h3>Pending Approvals</h3><p>6</p></div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-top: 2rem;">
                    <div class="card">
                        <h3>District-wise Distribution</h3>
                        <div class="region-stats">
                            <div class="region-card">
                                <span class="district-badge district-kolhapur">Kolhapur</span>
                                <p style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem;">24</p>
                                <small>Colleges</small>
                            </div>
                            <div class="region-card">
                                <span class="district-badge district-sangli">Sangli</span>
                                <p style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem;">12</p>
                                <small>Colleges</small>
                            </div>
                            <div class="region-card">
                                <span class="district-badge district-satara">Satara</span>
                                <p style="font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem;">12</p>
                                <small>Colleges</small>
                            </div>
                        </div>
                        <div class="chart-container" style="display: flex; align-items: flex-end; gap: 2rem; padding: 2rem; background: #f9fafb; border-radius: 12px; margin-top: 2rem;">
                            <div style="flex: 1; height: 100%; background: var(--primary); border-radius: 8px 8px 0 0;"></div>
                            <div style="flex: 1; height: 60%; background: var(--secondary); border-radius: 8px 8px 0 0;"></div>
                            <div style="flex: 1; height: 45%; background: var(--accent); border-radius: 8px 8px 0 0;"></div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>Recent Activities</h3>
                        <div style="margin-top: 1rem;">
                            <div style="padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                                <p style="font-size: 0.9rem;"><strong>KIT College</strong> requested approval.</p>
                                <small style="color: var(--text-muted);">2 hours ago</small>
                            </div>
                            <div style="padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                                <p style="font-size: 0.9rem;"><strong>New Event:</strong> Robo-War published by DYP.</p>
                                <small style="color: var(--text-muted);">5 hours ago</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        colleges: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>College Management</h1>
                    <div class="gap-1" style="display: flex;">
                        <button class="btn-primary" style="background: var(--secondary);"><i class="fas fa-file-export"></i> Export Report</button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="flex-between" style="margin-bottom: 1.5rem;">
                        <div class="search-box" style="max-width: 300px;">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search by name or district...">
                        </div>
                        <div class="gap-1" style="display: flex;">
                            <select style="padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                                <option>All Districts</option>
                                <option>Kolhapur</option>
                                <option>Sangli</option>
                                <option>Satara</option>
                            </select>
                        </div>
                    </div>

                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>College Name</th>
                                    <th>District</th>
                                    <th>Coordinator</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>KIT's College of Engineering</strong></td>
                                    <td><span class="district-badge district-kolhapur">Kolhapur</span></td>
                                    <td>Prof. Rahul Patil</td>
                                    <td><span class="status-badge status-active">Approved</span></td>
                                    <td class="action-btns">
                                        <button class="btn-primary" style="padding: 0.4rem; background: var(--primary);"><i class="fas fa-eye"></i></button>
                                        <button class="btn-primary" style="padding: 0.4rem; background: var(--danger);"><i class="fas fa-ban"></i> Suspend</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Willingdon College</strong></td>
                                    <td><span class="district-badge district-sangli">Sangli</span></td>
                                    <td>Dr. S. K. Kulkarni</td>
                                    <td><span class="status-badge status-pending">Pending</span></td>
                                    <td class="action-btns">
                                        <button class="btn-primary" style="padding: 0.4rem; background: var(--secondary);"><i class="fas fa-check"></i> Approve</button>
                                        <button class="btn-primary" style="padding: 0.4rem; background: var(--danger);"><i class="fas fa-times"></i> Reject</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        students: `<h1>Student Directory</h1><div class="card"><p>Global student records and participation history.</p></div>`,
        events: `<h1>Event Moderation</h1><div class="card"><p>Review and monitor all active events across the region.</p></div>`,
        settings: `<h1>System Settings</h1><div class="card"><p>General platform configurations.</p></div>`,
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
