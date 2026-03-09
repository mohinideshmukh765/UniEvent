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

                <!-- Deactivation Confirmation Modal -->
                <div id="deactivateModal" class="modal-overlay">
                    <div class="modal-content" style="max-width: 400px; text-align: left;">
                        <div style="font-size: 2.5rem; color: var(--danger); margin-bottom: 1rem; text-align: center;"><i class="fas fa-exclamation-triangle"></i></div>
                        <h2 style="text-align: center;">Deactivate College?</h2>
                        <p id="deactivateMessage" style="color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.5;"></p>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-main); display: block; margin-bottom: 0.5rem;">Type college name in CAPITAL to confirm:</label>
                            <input type="text" id="deactivateConfirmInput" class="form-input" placeholder="COLLEGE NAME" style="width: 100%; text-transform: uppercase; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px;">
                        </div>

                        <div class="modal-actions" style="justify-content: space-between;">
                            <button class="btn-primary" style="background: #e2e8f0; color: var(--text-main); border: none;" onclick="document.getElementById('deactivateModal').style.display='none'">Cancel</button>
                            <button class="btn-primary" id="finalDeactivateBtn" style="background: var(--danger); opacity: 0.5; cursor: not-allowed;" disabled>Deactivate Now</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="flex-between" style="margin-bottom: 1.5rem;">
                        <h3>Registered Colleges & Coordinators</h3>
                        <div class="search-box" style="width: 300px;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="collegeSearchInput" placeholder="Filter colleges..." onkeyup="AdminPanel.filterColleges()">
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
                                    <th>Actions</th>
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
        events: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Event Moderation</h1>
                </div>
                
                <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 2rem;">
                    <div class="stat-card" id="tab-upcoming" style="cursor: pointer; border: 2px solid var(--primary); background: #f0fdf4;" onclick="AdminPanel.setEventTab('upcoming')">
                        <div class="stat-icon" style="background: #dcfce7; color: #16a34a;"><i class="fas fa-calendar-alt"></i></div>
                        <div class="stat-info">
                            <h3 style="color: #16a34a;">Upcoming Events</h3>
                            <p id="count-upcoming" style="color: #15803d;">0</p>
                        </div>
                    </div>
                    <div class="stat-card" id="tab-past" style="cursor: pointer; opacity: 0.6; transition: opacity 0.3s;" onclick="AdminPanel.setEventTab('past')">
                        <div class="stat-icon" style="background: #f3f4f6; color: #4b5563;"><i class="fas fa-history"></i></div>
                        <div class="stat-info">
                            <h3 style="color: #4b5563;">Past Events</h3>
                            <p id="count-past" style="color: #374151;">0</p>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                        <h3 id="table-title">Upcoming Events</h3>
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <div class="search-box">
                                <i class="fas fa-map-marker-alt"></i>
                                <select id="filter-district" style="border: none; outline: none; background: transparent; padding-left: 0.5rem;" onchange="AdminPanel.renderModerationEvents()">
                                    <option value="ALL">All Districts</option>
                                    <option value="Kolhapur">Kolhapur</option>
                                    <option value="Sangli">Sangli</option>
                                    <option value="Satara">Satara</option>
                                </select>
                            </div>
                            <div class="search-box">
                                <i class="fas fa-tags"></i>
                                <select id="filter-category" style="border: none; outline: none; background: transparent; padding-left: 0.5rem;" onchange="AdminPanel.renderModerationEvents()">
                                    <option value="ALL">All Categories</option>
                                    <option>Technical</option>
                                    <option>Cultural</option>
                                    <option>Sports</option>
                                    <option>Workshop</option>
                                    <option>Hackathon</option>
                                    <option>Project Competition</option>
                                    <option>Coding Competition</option>
                                    <option>Electrical related</option>
                                    <option>Civil related</option>
                                    <option>Idea Pitching</option>
                                    <option>Business Competition</option>
                                    <option>Debate Competition</option>
                                    <option>Group Discussion</option>
                                    <option>Seminar/Webinar</option>
                                    <option>Others</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Event Date</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>College</th>
                                    <th>District</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="moderation-events-body">
                                <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Loading events...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- View Post Modal -->
                <div id="viewPostModal" class="modal-overlay" style="display: none; align-items: center; justify-content: center; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;">
                    <div class="modal-content" style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 100%; text-align: left; position: relative;">
                        <button onclick="document.getElementById('viewPostModal').style.display='none'" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                        <h2 style="margin-bottom: 1rem; color: var(--text-main);"><i class="fas fa-image" style="color: var(--primary);"></i> Event Post</h2>
                        <div id="postContentArea" style="min-height: 100px; display: flex; flex-direction: column; gap: 1rem;">
                            <p style="color: var(--text-muted); text-align: center;">Loading post data...</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
        registrations: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Registration Monitoring</h1>
                </div>
                
                <div class="card">
                    <div class="flex-between" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                        <h3>All Registrations</h3>
                        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                            <div class="search-box">
                                <i class="fas fa-university"></i>
                                <select id="reg-filter-college" style="border: none; outline: none; background: transparent; padding-left: 0.5rem;" onchange="AdminPanel.renderRegistrations()">
                                    <option value="ALL">All Colleges</option>
                                </select>
                            </div>
                            <div class="search-box">
                                <i class="fas fa-map-marker-alt"></i>
                                <select id="reg-filter-district" style="border: none; outline: none; background: transparent; padding-left: 0.5rem;" onchange="AdminPanel.renderRegistrations()">
                                    <option value="ALL">All Districts</option>
                                    <option value="Kolhapur">Kolhapur</option>
                                    <option value="Sangli">Sangli</option>
                                    <option value="Satara">Satara</option>
                                </select>
                            </div>
                            <div class="search-box">
                                <i class="fas fa-tags"></i>
                                <select id="reg-filter-category" style="border: none; outline: none; background: transparent; padding-left: 0.5rem;" onchange="AdminPanel.renderRegistrations()">
                                    <option value="ALL">All Categories</option>
                                    <option>Technical</option>
                                    <option>Cultural</option>
                                    <option>Sports</option>
                                    <option>Workshop</option>
                                    <option>Hackathon</option>
                                    <option>Project Competition</option>
                                    <option>Coding Competition</option>
                                    <option>Electrical related</option>
                                    <option>Civil related</option>
                                    <option>Idea Pitching</option>
                                    <option>Business Competition</option>
                                    <option>Debate Competition</option>
                                    <option>Group Discussion</option>
                                    <option>Seminar/Webinar</option>
                                    <option>Others</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Student College</th>
                                    <th>Event Name</th>
                                    <th>Hosting College</th>
                                    <th>District</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody id="registrations-body">
                                <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Loading registrations...</td></tr>
                            </tbody>
                        </table>
                    </div>
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

        if (pageId === 'onboarding') {
            this.loadOnboardingData();
        } else if (pageId === 'dashboard') {
            this.loadDashboardData();
        } else if (pageId === 'events') {
            this.loadModerationEventsData();
        } else if (pageId === 'registrations') {
            this.loadRegistrationsData();
        }
    },

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },

    // State Variables
    pendingOnboardingFile: null,
    allModerationEvents: [],
    allRegistrations: [],
    currentEventTab: 'upcoming', // 'upcoming' or 'past'

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
                        tbody.innerHTML = colleges.map(c => {
                            const statusLower = (c.status || '').toLowerCase();
                            const isDeactivated = statusLower === 'disabled' || statusLower === 'deactivated' || statusLower === 'rejected';
                            const actionText = isDeactivated ? 'Activate' : 'Deactivate';
                            const actionIcon = isDeactivated ? 'fa-check-circle' : 'fa-ban';
                            const actionColor = isDeactivated ? 'var(--primary)' : 'var(--danger)';
                            const btnAction = isDeactivated ? 'activate' : 'deactivate';
                            const statusLabel = statusLower === 'activated' ? '✅ Active' : statusLower === 'disabled' ? '🚫 Disabled' : (c.status || 'Unknown');
                            
                            return `
                                <tr>
                                    <td><code>${c.collegeCode}</code></td>
                                    <td><strong>${c.collegeName}</strong></td>
                                    <td>${c.coordinatorName}</td>
                                    <td>${c.email}</td>
                                    <td>${c.city}, ${c.district}</td>
                                    <td>
                                        <button class="btn-primary" style="background: ${actionColor}; font-size: 0.75rem; padding: 0.4rem 0.8rem;" 
                                                onclick="AdminPanel.showToggleStatusModal('${c.collegeCode}', '${(c.collegeName || '').replace(/'/g, "\\'")}', '${btnAction}')">
                                            <i class="fas ${actionIcon}"></i> ${actionText}
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('');
                    }
                }
            } else {
                const errorText = await res.text();
                console.error("Failed to load colleges:", errorText);
                const tbody = document.getElementById('registered-colleges-body');
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Error loading colleges (${res.status}): ${errorText}</td></tr>`;
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

    showToggleStatusModal(collegeCode, collegeName, action) {
        const modal = document.getElementById('deactivateModal');
        const message = document.getElementById('deactivateMessage');
        const inputContainer = document.getElementById('deactivateConfirmInput').parentElement;
        const input = document.getElementById('deactivateConfirmInput');
        const confirmBtn = document.getElementById('finalDeactivateBtn');
        const title = modal.querySelector('h2') || { innerHTML: '' };

        if (!modal || !message || !input || !confirmBtn) return;

        if (action === 'deactivate') {
            title.innerHTML = '<i class="fas fa-ban" style="color: var(--danger);"></i> Deactivate College';
            message.innerHTML = `This will deactivate <strong>${collegeName}</strong> and disable their coordinator account (<code>${collegeCode.toLowerCase()}</code>). The coordinator will no longer be able to login.`;
            inputContainer.style.display = 'block';
            input.value = '';
            confirmBtn.innerHTML = 'Deactivate Now';
            confirmBtn.style.background = 'var(--danger)';
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';

            input.oninput = (e) => {
                if (e.target.value.toUpperCase() === collegeName.toUpperCase()) {
                    confirmBtn.disabled = false;
                    confirmBtn.style.opacity = '1';
                    confirmBtn.style.cursor = 'pointer';
                } else {
                    confirmBtn.disabled = true;
                    confirmBtn.style.opacity = '0.5';
                    confirmBtn.style.cursor = 'not-allowed';
                }
            };
        } else {
            title.innerHTML = '<i class="fas fa-check-circle" style="color: var(--primary);"></i> Activate College';
            message.innerHTML = `This will re-activate <strong>${collegeName}</strong> and enable their coordinator account (<code>${collegeCode.toLowerCase()}</code>). They will be able to login again.`;
            inputContainer.style.display = 'none';
            confirmBtn.innerHTML = 'Activate Now';
            confirmBtn.style.background = 'var(--primary)';
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.cursor = 'pointer';
        }

        modal.style.display = 'flex';

        confirmBtn.onclick = async () => {
            try {
                const label = action === 'deactivate' ? 'Deactivating...' : 'Activating...';
                confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${label}`;
                const res = await fetch(`/api/admin/colleges/${action}/${collegeCode}`, {
                    method: 'POST',
                    headers: this.getAuthHeaders()
                });

                if (res.ok) {
                    alert(await res.text());
                    modal.style.display = 'none';
                    this.loadOnboardingData();
                } else {
                    alert(`Failed to ${action}: ` + await res.text());
                }
            } catch (error) {
                alert("Error: " + error.message);
            } finally {
                confirmBtn.innerHTML = action === 'deactivate' ? 'Deactivate Now' : 'Activate Now';
            }
        };
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

    filterColleges() {
        const input = document.getElementById('collegeSearchInput');
        if (!input) return;
        const filter = input.value.toUpperCase();
        const tbody = document.getElementById('registered-colleges-body');
        if (!tbody) return;
        const trs = tbody.getElementsByTagName('tr');
        for (let i = 0; i < trs.length; i++) {
            const tdCode = trs[i].getElementsByTagName('td')[0]; // collegeCode
            const tdName = trs[i].getElementsByTagName('td')[1]; // collegeName
            if (tdCode || tdName) {
                const txtCode = tdCode ? (tdCode.textContent || tdCode.innerText) : "";
                const txtName = tdName ? (tdName.textContent || tdName.innerText) : "";
                if (txtCode.toUpperCase().indexOf(filter) > -1 || txtName.toUpperCase().indexOf(filter) > -1) {
                    trs[i].style.display = "";
                } else {
                    trs[i].style.display = "none";
                }
            }
        }
    },

    setEventTab(tabStr) {
        this.currentEventTab = tabStr;
        
        const upTab = document.getElementById('tab-upcoming');
        const pastTab = document.getElementById('tab-past');
        const title = document.getElementById('table-title');
        
        if (tabStr === 'upcoming') {
            if(upTab) { upTab.style.border = '2px solid var(--primary)'; upTab.style.opacity = '1'; upTab.style.background = '#f0fdf4'; }
            if(pastTab) { pastTab.style.border = 'none'; pastTab.style.opacity = '0.6'; pastTab.style.background = '#fff'; }
            if(title) title.textContent = "Upcoming Events";
        } else {
            if(pastTab) { pastTab.style.border = '2px solid var(--primary)'; pastTab.style.opacity = '1'; pastTab.style.background = '#f0fdf4'; }
            if(upTab) { upTab.style.border = 'none'; upTab.style.opacity = '0.6'; upTab.style.background = '#fff'; }
            if(title) title.textContent = "Past Events";
        }
        
        this.renderModerationEvents(); // re-filter
    },

    async loadModerationEventsData() {
        try {
            const res = await fetch('/api/admin/events', { headers: this.getAuthHeaders() });
            if (res.ok) {
                this.allModerationEvents = await res.json();
                
                // Render lists
                this.renderModerationEvents();
            } else {
                console.error("Failed to fetch events");
                const tbody = document.getElementById('moderation-events-body');
                if(tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Failed to load events. Server returned ${res.status}</td></tr>`;
            }
        } catch(error) {
            console.error(error);
        }
    },

    renderModerationEvents() {
        const tbody = document.getElementById('moderation-events-body');
        if (!tbody) return;

        const catFilter = document.getElementById('filter-category')?.value || 'ALL';
        const distFilter = document.getElementById('filter-district')?.value || 'ALL';
        const now = new Date();

        // 1. Filter by Tab (Upcoming vs Past)
        let filtered = this.allModerationEvents.filter(e => {
            const edate = new Date(e.eventDate);
            if (this.currentEventTab === 'upcoming') return edate >= now;
            else return edate < now;
        });

        // Update counts
        const allUpcoming = this.allModerationEvents.filter(e => new Date(e.eventDate) >= now).length;
        const allPast = this.allModerationEvents.filter(e => new Date(e.eventDate) < now).length;
        
        const countUp = document.getElementById('count-upcoming');
        const countPast = document.getElementById('count-past');
        if (countUp) countUp.textContent = allUpcoming;
        if (countPast) countPast.textContent = allPast;

        // 2. Filter by Category
        if (catFilter !== 'ALL') {
            filtered = filtered.filter(e => e.category === catFilter);
        }

        // 3. Filter by District
        if (distFilter !== 'ALL') {
            filtered = filtered.filter(e => e.college && e.college.district === distFilter);
        }

        // Render to Table
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No events found matching these filters.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(e => {
            const dateObj = new Date(e.eventDate);
            const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Map EventStatus to colors manually since we don't have the status constants
            let statusColor = "gray"; 
            if(e.status === 'PUBLISHED') statusColor = 'green';
            if(e.status === 'DRAFT') statusColor = 'orange';

            return `
                <tr>
                    <td style="font-size: 0.85rem; color: var(--text-muted);">
                        <i class="far fa-calendar"></i> ${dateStr}
                    </td>
                    <td><strong style="color: var(--text-main);">${e.title}</strong></td>
                    <td><span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${e.category || 'N/A'}</span></td>
                    <td>${e.college ? e.college.name : 'Unknown'}</td>
                    <td>${e.college ? e.college.district : 'N/A'}</td>
                    <td>
                        <span style="background: ${statusColor}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${e.status || 'UNKNOWN'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-primary" style="background: var(--navy-sidebar); font-size: 0.75rem; padding: 0.4rem 0.8rem;" onclick="AdminPanel.viewEventPost(${e.id})">
                            <i class="fas fa-eye"></i> View Post
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    async viewEventPost(eventId) {
        const modal = document.getElementById('viewPostModal');
        const contentArea = document.getElementById('postContentArea');
        if (!modal || !contentArea) return;

        modal.style.display = 'flex';
        contentArea.innerHTML = `<p style="color: var(--text-muted); text-align: center;"><i class="fas fa-spinner fa-spin"></i> Fetching post...</p>`;

        try {
            const res = await fetch(`/api/admin/events/${eventId}/post`, { headers: this.getAuthHeaders() });
            if (res.ok) {
                const post = await res.json();
                let imageHtml = '';
                if (post.images) {
                    imageHtml = `<img src="${post.images}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem; border: 1px solid var(--border-color); object-fit: cover; max-height: 300px;" alt="Post Image">`;
                }

                contentArea.innerHTML = `
                    ${imageHtml}
                    <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <p style="font-size: 0.95rem; color: var(--text-main); white-space: pre-wrap; line-height: 1.5;">${post.caption || '<em>No caption provided.</em>'}</p>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); text-align: right; margin-top: 0.5rem;">
                        Posted: ${new Date(post.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                `;
            } else if (res.status === 404) {
                contentArea.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <i class="fas fa-folder-open" style="font-size: 3rem; color: #e2e8f0; margin-bottom: 1rem;"></i>
                        <h3 style="color: var(--text-muted);">No Post Available</h3>
                        <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem;">The coordinator has not created a post for this event yet.</p>
                    </div>
                `;
            } else {
                contentArea.innerHTML = `<p style="color: var(--danger); text-align: center;">Error loading post: Server returned ${res.status}</p>`;
            }
        } catch (error) {
            console.error("Error viewing post:", error);
            contentArea.innerHTML = `<p style="color: var(--danger); text-align: center;">An unexpected error occurred.</p>`;
        }
    },

    async loadRegistrationsData() {
        try {
            const res = await fetch('/api/admin/registrations', { headers: this.getAuthHeaders() });
            if (res.ok) {
                this.allRegistrations = await res.json();
                
                // Extract unique colleges to populate the filter
                const colleges = new Set();
                this.allRegistrations.forEach(r => {
                    if (r.event && r.event.college && r.event.college.name) {
                        colleges.add(r.event.college.name);
                    }
                });
                
                const cSelect = document.getElementById('reg-filter-college');
                if (cSelect) {
                    cSelect.innerHTML = '<option value="ALL">All Colleges</option>';
                    Array.from(colleges).sort().forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c;
                        opt.textContent = c;
                        cSelect.appendChild(opt);
                    });
                }

                // Render lists
                this.renderRegistrations();
            } else {
                console.error("Failed to fetch registrations");
                const tbody = document.getElementById('registrations-body');
                if(tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Failed to load registrations. Server returned ${res.status}</td></tr>`;
            }
        } catch(error) {
            console.error(error);
        }
    },

    renderRegistrations() {
        const tbody = document.getElementById('registrations-body');
        if (!tbody) return;

        const catFilter = document.getElementById('reg-filter-category')?.value || 'ALL';
        const distFilter = document.getElementById('reg-filter-district')?.value || 'ALL';
        const colFilter = document.getElementById('reg-filter-college')?.value || 'ALL';

        let filtered = this.allRegistrations;

        // Apply Category Filter
        if (catFilter !== 'ALL') {
            filtered = filtered.filter(r => r.event && r.event.category === catFilter);
        }

        // Apply District Filter
        if (distFilter !== 'ALL') {
            filtered = filtered.filter(r => r.event && r.event.college && r.event.college.district === distFilter);
        }

        // Apply College Filter
        if (colFilter !== 'ALL') {
            filtered = filtered.filter(r => r.event && r.event.college && r.event.college.name === colFilter);
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No registrations found matching these filters.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(r => {
            const studentName = r.student ? (r.student.fullName || r.student.username) : 'N/A';
            const studentCollegeInfo = r.student && r.student.college ? r.student.college.name : 'Unknown';
            const eventName = r.event ? r.event.title : 'N/A';
            const hostingCollege = r.event && r.event.college ? r.event.college.name : 'Unknown';
            const district = r.event && r.event.college ? r.event.college.district : 'N/A';
            const category = r.event ? r.event.category : 'N/A';

            return `
                <tr>
                    <td><strong>${studentName}</strong></td>
                    <td><span style="font-size: 0.85rem; color: var(--text-muted);">${studentCollegeInfo}</span></td>
                    <td><strong style="color: var(--primary);">${eventName}</strong></td>
                    <td>${hostingCollege}</td>
                    <td>${district}</td>
                    <td><span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${category}</span></td>
                </tr>
            `;
        }).join('');
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
