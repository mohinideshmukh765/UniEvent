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
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card" style="cursor: pointer; transition: box-shadow 0.2s;" onclick="AdminPanel.navigate('onboarding')" onmouseover="this.style.boxShadow='0 4px 20px rgba(59,130,246,0.15)'" onmouseout="this.style.boxShadow=''">
                        <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;"><i class="fas fa-university"></i></div>
                        <div class="stat-info"><h3>Total Colleges</h3><p id="stat-colleges">--</p></div>
                        <small style="color: #3b82f6; font-size: 0.75rem;">Click to view →</small>
                    </div>
                    <div class="stat-card" style="cursor: pointer; transition: box-shadow 0.2s;" onclick="AdminPanel.navigate('students-note')" onmouseover="this.style.boxShadow='0 4px 20px rgba(139,92,246,0.15)'" onmouseout="this.style.boxShadow=''">
                        <div class="stat-icon" style="background: #f5f3ff; color: #8b5cf6;"><i class="fas fa-users"></i></div>
                        <div class="stat-info"><h3>Total Students</h3><p id="stat-students">--</p></div>
                        <small style="color: #8b5cf6; font-size: 0.75rem;">Click to view →</small>
                    </div>
                    <div class="stat-card" style="cursor: pointer; transition: box-shadow 0.2s;" onclick="AdminPanel.navigateToEvents('upcoming')" onmouseover="this.style.boxShadow='0 4px 20px rgba(16,185,129,0.15)'" onmouseout="this.style.boxShadow=''">
                        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-info"><h3>Upcoming Events</h3><p id="stat-upcoming">--</p></div>
                        <small style="color: #10b981; font-size: 0.75rem;">Click to view →</small>
                    </div>
                    <div class="stat-card" style="cursor: pointer; transition: box-shadow 0.2s;" onclick="AdminPanel.navigateToEvents('past')" onmouseover="this.style.boxShadow='0 4px 20px rgba(244,63,94,0.15)'" onmouseout="this.style.boxShadow=''">
                        <div class="stat-icon" style="background: #fff1f2; color: #f43f5e;"><i class="fas fa-history"></i></div>
                        <div class="stat-info"><h3>Past Events</h3><p id="stat-past">--</p></div>
                        <small style="color: #f43f5e; font-size: 0.75rem;">Click to view →</small>
                    </div>
                    <div class="stat-card" style="cursor: pointer; transition: box-shadow 0.2s;" onclick="AdminPanel.navigate('registrations')" onmouseover="this.style.boxShadow='0 4px 20px rgba(219,39,119,0.15)'" onmouseout="this.style.boxShadow=''">
                        <div class="stat-icon" style="background: #fdf2f8; color: #db2777;"><i class="fas fa-ticket-alt"></i></div>
                        <div class="stat-info"><h3>Total Registrations</h3><p id="stat-registrations">--</p></div>
                        <small style="color: #db2777; font-size: 0.75rem;">Click to view →</small>
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

                        <div style="margin-top: 2.5rem;">
                            <div id="today-registrations-list" style="margin-top: 0.5rem;">
                                <p style="color: var(--text-muted);">Loading today's registrations...</p>
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
                            <button class="btn-primary" style="background: var(--text-muted);" onclick="AdminPanel.closeModal('onboardingModal')">Cancel</button>
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
                            <button class="btn-primary" style="background: #e2e8f0; color: var(--text-main); border: none;" onclick="AdminPanel.closeModal('deactivateModal')">Cancel</button>
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
                            <div class="search-box" style="position: relative; width: 180px;">
                                <i class="fas fa-map-marker-alt" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none;"></i>
                                <select id="filter-district" style="width: 100%; border: 1px solid var(--border-color); outline: none; background: #f8fafc; padding: 0.6rem 1rem 0.6rem 2.8rem; border-radius: 100px; appearance: none; cursor: pointer; font-size: 0.85rem;" onchange="AdminPanel.renderModerationEvents()">
                                    <option value="ALL">All Districts</option>
                                    <option value="Kolhapur">Kolhapur</option>
                                    <option value="Sangli">Sangli</option>
                                    <option value="Satara">Satara</option>
                                </select>
                            </div>
                            <div class="search-box" style="position: relative; width: 200px;">
                                <i class="fas fa-tags" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none;"></i>
                                <select id="filter-category" style="width: 100%; border: 1px solid var(--border-color); outline: none; background: #f8fafc; padding: 0.6rem 1rem 0.6rem 2.8rem; border-radius: 100px; appearance: none; cursor: pointer; font-size: 0.85rem;" onchange="AdminPanel.renderModerationEvents()">
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
            </div>
        `,
        registrations: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Registration Monitoring</h1>
                </div>

                <div class="card">
                    <!-- Header row: title + filter bar on same line -->
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                        <h3 style="margin: 0;">All Registrations</h3>
                        <!-- Horizontal filter bar -->
                        <div style="display: flex; gap: 0.75rem; align-items: center; flex-direction: row; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; min-width: 140px;">
                                <i class="fas fa-university" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                                <select id="reg-filter-college" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer; width: 100%;" onchange="AdminPanel.renderRegistrations()">
                                    <option value="ALL">All Colleges</option>
                                </select>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; min-width: 130px;">
                                <i class="fas fa-map-marker-alt" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                                <select id="reg-filter-district" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer; width: 100%;" onchange="AdminPanel.renderRegistrations()">
                                    <option value="ALL">All Districts</option>
                                    <option value="Kolhapur">Kolhapur</option>
                                    <option value="Sangli">Sangli</option>
                                    <option value="Satara">Satara</option>
                                </select>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; min-width: 140px;">
                                <i class="fas fa-tags" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                                <select id="reg-filter-category" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer; width: 100%;" onchange="AdminPanel.renderRegistrations()">
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
                            <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; min-width: 120px;">
                                <i class="fas fa-filter" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                                <select id="reg-filter-status" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer; width: 100%;" onchange="AdminPanel.renderRegistrations()">
                                    <option value="ALL">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="DENIED">Denied</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Student Username</th>
                                    <th>Event Name</th>
                                    <th>Hosting College</th>
                                    <th>District</th>
                                    <th>Category</th>
                                    <th>Reg. Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="registrations-body">
                                <tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Loading registrations...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,

        posts: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Post Moderation</h1>
                    <button class="btn-primary" onclick="AdminPanel.loadPostsData()"><i class="fas fa-sync-alt"></i> Refresh</button>
                </div>
                <div id="posts-moderation-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                    <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                        <i class="fas fa-spinner fa-spin fa-2x" style="margin-bottom: 1rem;"></i>
                        <p>Loading after-event posts...</p>
                    </div>
                </div>
            </div>
        `,
        analytics: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Analytics</h1>
                    <button class="btn-primary" onclick="AdminPanel.loadAnalyticsData()"><i class="fas fa-sync-alt"></i> Refresh</button>
                </div>
                
                <div class="stats-grid" style="margin-bottom: 2rem; grid-template-columns: repeat(2, 1fr);">
                    <div class="stat-card" id="analytics-tab-events" style="display: flex; align-items: center; gap: 1.5rem; cursor: pointer; border: 2px solid var(--primary);" onclick="AdminPanel.setAnalyticsTab('events')">
                        <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;"><i class="fas fa-calendar-check"></i></div>
                        <div>
                            <p class="stat-title">Total Events</p>
                            <h2 class="stat-value" id="analytics-events-count">--</h2>
                        </div>
                    </div>
                    <div class="stat-card" id="analytics-tab-regs" style="display: flex; align-items: center; gap: 1.5rem; cursor: pointer; border: 2px solid transparent;" onclick="AdminPanel.setAnalyticsTab('regs')">
                        <div class="stat-icon" style="background: #fdf2f8; color: #ec4899;"><i class="fas fa-users"></i></div>
                        <div>
                            <p class="stat-title">Total Registrations</p>
                            <h2 class="stat-value" id="analytics-regs-count">--</h2>
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-bottom: 2rem;">
                    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-map-marker-alt" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <select id="analytics-filter-district" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyAnalyticsFilters()">
                                <option value="ALL">All Districts</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-university" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <select id="analytics-filter-college" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyAnalyticsFilters()">
                                <option value="ALL">All Colleges</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-calendar-alt" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <select id="analytics-filter-event" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyAnalyticsFilters()">
                                <option value="ALL">All Events</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-tags" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <select id="analytics-filter-category" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyAnalyticsFilters()">
                                <option value="ALL">All Categories</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-clock" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <input type="date" id="analytics-filter-date-from" placeholder="From" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyAnalyticsFilters()">
                            <span style="color: var(--text-muted); font-size: 0.85rem;">to</span>
                            <input type="date" id="analytics-filter-date-to" placeholder="To" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyAnalyticsFilters()">
                        </div>
                        <button class="btn-primary" style="background: var(--navy-sidebar);" onclick="AdminPanel.clearAnalyticsFilters()">Clear Filters</button>
                    </div>
                </div>

                <div id="analytics-events-view" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div class="card" style="height: 400px; display: flex; flex-direction: column;">
                        <h3 style="margin-bottom: 1rem;">Events by Category (Pie)</h3>
                        <div style="flex: 1; position: relative;">
                            <canvas id="analyticsEventPie"></canvas>
                        </div>
                    </div>
                    <div class="card" style="height: 400px; display: flex; flex-direction: column;">
                        <h3 style="margin-bottom: 1rem;">Events by College (Bar)</h3>
                        <div style="flex: 1; position: relative;">
                            <canvas id="analyticsEventBar"></canvas>
                        </div>
                    </div>
                </div>

                <div id="analytics-regs-view" style="display: none; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div class="card" style="height: 400px; display: flex; flex-direction: column;">
                        <h3 style="margin-bottom: 1rem;">Registrations by Category (Pie)</h3>
                        <div style="flex: 1; position: relative;">
                            <canvas id="analyticsRegPie"></canvas>
                        </div>
                    </div>
                    <div class="card" style="height: 400px; display: flex; flex-direction: column;">
                        <h3 style="margin-bottom: 1rem;">Registrations by College (Bar)</h3>
                        <div style="flex: 1; position: relative;">
                            <canvas id="analyticsRegBar"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `,
        reports: `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>System Reports</h1>
                    <div>
                        <button class="btn-primary" onclick="AdminPanel.exportReportsToExcel()" style="background: #10b981; margin-right: 0.5rem;"><i class="fas fa-file-excel"></i> Export Excel</button>
                    </div>
                </div>
                
                <div class="stats-grid" style="margin-bottom: 2rem; grid-template-columns: repeat(2, 1fr);">
                    <div class="stat-card" id="reports-tab-events" style="display: flex; align-items: center; gap: 1.5rem; cursor: pointer; border: 2px solid var(--primary);" onclick="AdminPanel.setReportsTab('events')">
                        <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;"><i class="fas fa-calendar-check"></i></div>
                        <div>
                            <p class="stat-title">Total Events</p>
                            <h2 class="stat-value" id="reports-events-count">--</h2>
                        </div>
                    </div>
                    <div class="stat-card" id="reports-tab-regs" style="display: flex; align-items: center; gap: 1.5rem; cursor: pointer; border: 2px solid transparent;" onclick="AdminPanel.setReportsTab('regs')">
                        <div class="stat-icon" style="background: #fdf2f8; color: #ec4899;"><i class="fas fa-users"></i></div>
                        <div>
                            <p class="stat-title">Total Registrations</p>
                            <h2 class="stat-value" id="reports-regs-count">--</h2>
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-bottom: 2rem;">
                    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-map-marker-alt" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <select id="reports-filter-district" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyReportsFilters()">
                                <option value="ALL">All Districts</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-university" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <select id="reports-filter-college" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyReportsFilters()">
                                <option value="ALL">All Colleges</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-calendar-alt" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <select id="reports-filter-event" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyReportsFilters()">
                                <option value="ALL">All Events</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-tags" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <select id="reports-filter-category" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyReportsFilters()">
                                <option value="ALL">All Categories</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.8rem; background: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px;">
                            <i class="fas fa-clock" style="color: var(--text-muted); font-size: 0.85rem;"></i>
                            <input type="date" id="reports-filter-date-from" placeholder="From" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyReportsFilters()">
                            <span style="color: var(--text-muted); font-size: 0.85rem;">to</span>
                            <input type="date" id="reports-filter-date-to" placeholder="To" style="border: none; outline: none; background: transparent; font-size: 0.85rem; color: var(--text-main); cursor: pointer;" onchange="AdminPanel.applyReportsFilters()">
                        </div>
                        <button class="btn-primary" style="background: var(--navy-sidebar);" onclick="AdminPanel.clearReportsFilters()">Clear</button>
                    </div>
                </div>

                <div id="reports-events-view" style="display: block;">
                    <div class="card">
                        <div class="data-table-wrapper" style="max-height: 400px; overflow-y: auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>College</th>
                                        <th>District</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="reports-events-body"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div id="reports-regs-view" style="display: none;">
                    <div class="card">
                        <div class="data-table-wrapper" style="max-height: 400px; overflow-y: auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Event</th>
                                        <th>Category</th>
                                        <th>College</th>
                                        <th>Reg. Date</th>
                                    </tr>
                                </thead>
                                <tbody id="reports-regs-body"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `,
        "students-note": `
            <div class="animate-slide">
                <div style="text-align: center; padding: 5rem 2rem;">
                    <div style="font-size: 4rem; color: #e2e8f0; margin-bottom: 1.5rem;"><i class="fas fa-user-graduate"></i></div>
                    <h1 style="color: var(--text-main); margin-bottom: 0.75rem;">Students Directory</h1>
                    <p style="color: var(--text-muted); font-size: 1rem; max-width: 400px; margin: 0 auto 2rem;">The dedicated Students page is coming soon. You can view student registrations under the <strong>Registrations</strong> section.</p>
                    <button class="btn-primary" onclick="AdminPanel.navigate('registrations')">View Registrations</button>
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
        } else if (pageId === 'analytics') {
            this.loadAnalyticsData();
        } else if (pageId === 'reports') {
            this.loadReportsData();
        } else if (pageId === 'posts') {
            this.loadPostsData();
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

        modal.classList.add('active');

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
                this.dashboardEvents = events; // Store for the modal viewer
                const eventsList = document.getElementById('upcoming-events-list');
                if (eventsList) {
                    if (events.length === 0) {
                        eventsList.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-muted);">No active upcoming events.</p>`;
                    } else {
                        eventsList.innerHTML = events.slice(0, 5).map(event => {
                            const collegeName = event.college ? (event.college.name || event.college.collegeName) : 'University';
                            return `
                                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                                    <div style="background: #eff6ff; padding: 0.5rem; border-radius: 8px; text-align: center; min-width: 60px;">
                                        <div style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: var(--primary);">${new Date(event.eventDate).toLocaleString('default', { month: 'short' })}</div>
                                        <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">${new Date(event.eventDate).getDate()}</div>
                                    </div>
                                    <div style="flex: 1;">
                                        <p style="font-size: 0.9rem; font-weight: 700;">${event.title}</p>
                                        <p style="font-size: 0.8rem; color: var(--text-muted);">${collegeName}</p>
                                    </div>
                                    <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.7rem; background: var(--navy-sidebar);" onclick="AdminPanel.viewEventDetails(${event.id})">View</button>
                                </div>
                            `;
                        }).join('');
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
                    const now = new Date();
                    activityList.innerHTML = activities.slice(0, 6).map(activity => {
                        const activityDate = new Date(activity.timestamp);
                        const isRecent = (now - activityDate) < (24 * 60 * 60 * 1000); // 24 hours
                        
                        return `
                            <div class="recent-activity-item">
                                <span style="font-size: 0.8rem; color: var(--text-muted); width: 80px;">${activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <div style="flex: 1;">
                                    <p style="font-size: 0.9rem; font-weight: 600;">${activity.action}</p>
                                    ${isRecent ? `<small style="color: var(--text-muted);">${activity.details}</small>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }

            // Today's Registrations
            try {
                const todayRes = await fetch('/api/admin/registrations/today', {
                    headers: this.getAuthHeaders()
                });
                const todayList = document.getElementById('today-registrations-list');
                if (todayRes.ok && todayList) {
                    const todayRegs = await todayRes.json();
                    if (todayRegs.length === 0) {
                        todayList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No registrations recorded today yet.</p>`;
                    } else {
                        todayList.innerHTML = `
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
                                <thead>
                                    <tr style="border-bottom: 2px solid var(--border-color);">
                                        <th style="text-align: left; padding: 0.6rem 0.8rem; color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Time</th>
                                        <th style="text-align: left; padding: 0.6rem 0.8rem; color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Student</th>
                                        <th style="text-align: left; padding: 0.6rem 0.8rem; color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Event</th>
                                        <th style="text-align: left; padding: 0.6rem 0.8rem; color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">College</th>
                                        <th style="text-align: left; padding: 0.6rem 0.8rem; color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${todayRegs.map(r => {
                                        const studentName = r.username || 'Unknown';
                                        const eventTitle = r.event ? r.event.title : 'Unknown Event';
                                        const college = r.event && r.event.college ? r.event.college.name : '—';
                                        const timeStr = r.registrationDate ? new Date(r.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--';
                                        return `
                                            <tr style="border-bottom: 1px solid var(--border-color);">
                                                <td style="padding: 0.7rem 0.8rem;">
                                                    <span style="background: #ecfdf5; color: #10b981; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700;">${timeStr}</span>
                                                </td>
                                                <td style="padding: 0.7rem 0.8rem; font-weight: 600; color: var(--text-main);">${studentName}</td>
                                                <td style="padding: 0.7rem 0.8rem; color: var(--primary); font-weight: 600;">${eventTitle}</td>
                                                <td style="padding: 0.7rem 0.8rem; color: var(--text-muted);">${college}</td>
                                                <td style="padding: 0.7rem 0.8rem;">
                                                    <span style="background: #d1fae5; color: #065f46; padding: 2px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 600;">New</span>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        `;
                    }
                }
            } catch(e) {
                console.warn('Could not load today\'s registrations:', e);
                const todayList = document.getElementById('today-registrations-list');
                if (todayList) todayList.innerHTML = `<p style="color: var(--text-muted);">Unable to load today's data.</p>`;
            }

            // District Event Distribution Chart
            try {
                const distEventsRes = await fetch('/api/admin/events', {
                    headers: this.getAuthHeaders()
                });
                if (distEventsRes.ok) {
                    const allEvents = await distEventsRes.json();
                    const distrCounts = { Kolhapur: 0, Sangli: 0, Satara: 0 };
                    
                    allEvents.forEach(e => {
                        const d = e.college && e.college.district;
                        if (distrCounts[d] !== undefined) distrCounts[d]++;
                    });
                    
                    let maxCount = Math.max(...Object.values(distrCounts));
                    if (maxCount === 0) maxCount = 1;
                    
                    const chartHtml = `
                        <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                            <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: ${(distrCounts.Kolhapur / maxCount) * 100}%; background: #3b82f6; border-radius: 8px 8px 0 0;"></div>
                            <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Kolhapur: ${distrCounts.Kolhapur}</span>
                        </div>
                        <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                            <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: ${(distrCounts.Sangli / maxCount) * 100}%; background: #3b82f6; border-radius: 8px 8px 0 0;"></div>
                            <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Sangli: ${distrCounts.Sangli}</span>
                        </div>
                        <div style="width: 60px; height: 90%; background: #e2e8f0; border-radius: 8px 8px 0 0; position: relative;">
                            <div class="chart-bar" style="position: absolute; bottom: 0; width: 100%; height: ${(distrCounts.Satara / maxCount) * 100}%; background: #3b82f6; border-radius: 8px 8px 0 0;"></div>
                            <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; font-weight: 600;">Satara: ${distrCounts.Satara}</span>
                        </div>
                    `;
                    
                    const dbChart = document.getElementById('district-chart');
                    if (dbChart) dbChart.innerHTML = chartHtml;
                }
            } catch (e) {
                console.warn('Could not load district chart data:', e);
            }

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }
    },

    navigateToEvents(tab) {
        this.navigate('events');
        // Wait for template to render, then set the tab
        setTimeout(() => this.setEventTab(tab), 50);
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
                    <td>${(e.college && (e.college.name || e.college.collegeName)) || 'Unknown'}</td>
                    <td>${e.college ? e.college.district : 'N/A'}</td>
                    <td>
                        <span style="background: ${statusColor}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            ${e.status || 'UNKNOWN'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-primary" style="background: var(--navy-sidebar); font-size: 0.75rem; padding: 0.4rem 0.8rem;" onclick="AdminPanel.viewEventDetails(${e.id})">
                            <i class="fas fa-eye"></i> View Event
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    async loadPostsData() {
        const grid = document.getElementById('posts-moderation-grid');
        try {
            const res = await fetch('/api/admin/posts', { headers: this.getAuthHeaders() });
            if (res.ok) {
                this.allPosts = await res.json();
                this.renderPosts();
            } else {
                if (grid) grid.innerHTML = `<div style="grid-column: 1/-1; color: red; text-align:center;">Failed to load posts.</div>`;
            }
        } catch (e) {
            console.error(e);
            if (grid) grid.innerHTML = `<div style="grid-column: 1/-1; color: red; text-align:center;">Error: ${e.message}</div>`;
        }
    },

    renderPosts() {
        const grid = document.getElementById('posts-moderation-grid');
        if (!grid) return;

        if (!this.allPosts || this.allPosts.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted); background: #f8fafc; border-radius: 12px; border: 2px dashed #e2e8f0;">
                <i class="fas fa-images fa-3x" style="margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>No after-event posts found to moderate.</p>
            </div>`;
            return;
        }

        grid.innerHTML = this.allPosts.map(post => {
            const photos = post.photo ? post.photo.split(',').map(p => p.trim()).filter(p => p) : [];
            const hasMultiple = photos.length > 1;
            const eventTitle = post.event?.title || 'Unknown Event';
            const collegeName = (post.event?.college?.name || post.event?.college?.collegeName) || 'Unknown College';
            
            return `
                <div class="card post-card animate-slide" style="display: flex; flex-direction: column; overflow: hidden; padding: 0;">
                    <div id="slider-${post.id}" style="height: 220px; overflow: hidden; position: relative; background: #000;">
                        <div class="slider-container">
                            ${photos.length > 0 ? photos.map((src, idx) => `
                                <img src="${src}" class="slider-image ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                            `).join('') : `
                                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80" class="slider-image active" data-index="0">
                            `}
                        </div>
                        
                        ${hasMultiple ? `
                            <button class="slider-control slider-prev" onclick="AdminPanel.changeSliderPhoto(${post.id}, -1)">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="slider-control slider-next" onclick="AdminPanel.changeSliderPhoto(${post.id}, 1)">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                            <div class="slider-dots">
                                ${photos.map((_, idx) => `
                                    <div class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column;">
                        <div style="margin-bottom: 1rem;">
                            <div style="font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem;">${collegeName}</div>
                            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">${eventTitle}</h3>
                        </div>
                        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.5rem; flex: 1;">
                            ${post.caption || 'No caption provided.'}
                        </p>
                        <div class="flex-between" style="padding-top: 1rem; border-top: 1px solid #f1f5f9;">
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn-primary" style="background: #10b981; font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="alert('Post Approved (Visual Only)')">
                                    <i class="fas fa-check"></i> Approve
                                </button>
                                <button class="btn-primary" style="background: #ef4444; font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="AdminPanel.deletePost(${post.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                            <small style="color: var(--text-muted); font-size: 0.75rem;">
                                ${new Date(post.createdAt || Date.now()).toLocaleDateString()}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    changeSliderPhoto(postId, direction) {
        const container = document.getElementById(`slider-${postId}`);
        if (!container) return;

        const images = container.querySelectorAll('.slider-image');
        const dots = container.querySelectorAll('.slider-dot');
        let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
        
        // Remove active from current
        images[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        // Calculate new index
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = images.length - 1;
        if (currentIndex >= images.length) currentIndex = 0;

        // Add active to new
        images[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    },

    async deletePost(eventId) {
        if (!confirm("Are you sure you want to delete this after-event post? This action cannot be undone.")) return;
        
        try {
            const res = await fetch(`/api/admin/posts/${eventId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            if (res.ok) {
                alert("Post deleted successfully.");
                this.loadPostsData();
            } else {
                alert("Failed to delete post: " + await res.text());
            }
        } catch (e) {
            console.error(e);
            alert("Error deleting post: " + e.message);
        }
    },

    viewEventDetails(eventId) {
        const modal = document.getElementById('viewEventModal');
        const contentArea = document.getElementById('eventContentArea');
        if (!modal || !contentArea) return;

        // Reset visibility state from previous closes
        modal.style.display = ''; 
        modal.classList.add('active');

        // Search across all possible event sources
        const event = (this.allModerationEvents || []).find(e => e.id == eventId) || 
                      (this.dashboardEvents || []).find(e => e.id == eventId) ||
                      (this.reportsEvents || []).find(e => e.id == eventId);

        if (event) {
            const dateStr = new Date(event.eventDate).toLocaleString();
            contentArea.innerHTML = `
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
                    <h3 style="color: var(--primary); margin-bottom: 0.5rem; font-size: 1.4rem;">${event.title || 'N/A'}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;"><i class="fas fa-layer-group"></i> ${event.category || 'N/A'} &nbsp;|&nbsp; <i class="far fa-calendar-alt"></i> ${dateStr}</p>
                    
                    <div style="font-size: 0.95rem; color: var(--text-main); margin-bottom: 1.5rem; border-left: 4px solid var(--primary); padding-left: 1rem; white-space: pre-wrap; line-height: 1.5;">${event.description || 'No description provided.'}</div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; background: white; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <div><strong style="color: var(--text-muted);"><i class="fas fa-university" style="width: 16px;"></i> College:</strong><br/>${(event.college && (event.college.name || event.college.collegeName)) || 'Unknown'}</div>
                        <div><strong style="color: var(--text-muted);"><i class="fas fa-map-marker-alt" style="width: 16px;"></i> Venue:</strong><br/>${event.venue || 'N/A'}</div>
                        <div><strong style="color: var(--text-muted);"><i class="fas fa-user-tie" style="width: 16px;"></i> Organizer:</strong><br/>${event.organizedBy || 'N/A'}</div>
                        <div><strong style="color: var(--text-muted);"><i class="fas fa-phone" style="width: 16px;"></i> Contact:</strong><br/>${event.coordinatorName || ''} ${event.coordinatorMobile ? '<br/>('+event.coordinatorMobile+')' : ''}</div>
                        <div><strong style="color: var(--text-muted);"><i class="fas fa-users" style="width: 16px;"></i> Participants:</strong><br/>${event.minParticipants || 0} - ${event.maxParticipants || 'Unlimited'}</div>
                        <div><strong style="color: var(--text-muted);"><i class="fas fa-rupee-sign" style="width: 16px;"></i> Fee:</strong><br/>${event.feePerPerson ? '₹' + event.feePerPerson : 'Free'}</div>
                        <div style="grid-column: span 2;"><strong style="color: var(--text-muted);"><i class="fas fa-clock" style="width: 16px;"></i> Reg. Deadline:</strong> ${event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleString() : 'N/A'}</div>
                    </div>
                </div>
            `;
        } else {
            contentArea.innerHTML = `<p style="color: var(--danger); text-align: center;">Error loading event details.</p>`;
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

        // Apply Status Filter
        const statusFilter = document.getElementById('reg-filter-status')?.value || 'ALL';
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(r => (r.status || '').toUpperCase() === statusFilter);
        }

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
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No registrations found matching these filters.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(r => {
            const studentName = r.username || r.student?.username || 'N/A';
            const eventName = r.event ? r.event.title : 'N/A';
            const hostingCollege = r.event && r.event.college ? (r.event.college.name || r.event.college.collegeName) : 'Unknown';
            const district = r.event && r.event.college ? r.event.college.district : 'N/A';
            const category = r.event ? r.event.category : 'N/A';
            const regDate = r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : '—';
            const status = r.status || 'PENDING';
            const statusColor = status === 'APPROVED' ? '#10b981' : status === 'DENIED' ? '#ef4444' : '#f59e0b';
            const statusBg = status === 'APPROVED' ? '#ecfdf5' : status === 'DENIED' ? '#fef2f2' : '#fffbeb';

            return `
                <tr>
                    <td><strong style="color: var(--text-main);">${studentName}</strong></td>
                    <td><strong style="color: var(--primary);">${eventName}</strong></td>
                    <td>${hostingCollege}</td>
                    <td><span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${district}</span></td>
                    <td><span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${category}</span></td>
                    <td style="font-size: 0.85rem; color: var(--text-muted);">${regDate}</td>
                    <td><span style="background: ${statusBg}; color: ${statusColor}; padding: 3px 10px; border-radius: 10px; font-size: 0.78rem; font-weight: 700;">${status}</span></td>
                </tr>
            `;
        }).join('');
    },

    setAnalyticsTab(tab) {
        const eventsTab = document.getElementById('analytics-tab-events');
        const regsTab = document.getElementById('analytics-tab-regs');
        const eventsView = document.getElementById('analytics-events-view');
        const regsView = document.getElementById('analytics-regs-view');
        
        if (eventsTab) eventsTab.style.borderColor = tab === 'events' ? 'var(--primary)' : 'transparent';
        if (regsTab) regsTab.style.borderColor = tab === 'regs' ? 'var(--primary)' : 'transparent';
        
        if (eventsView) eventsView.style.display = tab === 'events' ? 'grid' : 'none';
        if (regsView) regsView.style.display = tab === 'regs' ? 'grid' : 'none';
        
        // Re-render charts to fit the visible containers properly
        this.applyAnalyticsFilters(); 
    },

    async loadAnalyticsData() {
        try {
            const [eventsRes, regsRes] = await Promise.all([
                fetch('/api/admin/events', { headers: this.getAuthHeaders() }),
                fetch('/api/admin/registrations', { headers: this.getAuthHeaders() })
            ]);

            if (eventsRes.ok && regsRes.ok) {
                this.analyticsEvents = await eventsRes.json();
                this.analyticsRegs = await regsRes.json();

                const districts = new Set();
                const colleges = new Set();
                const events = new Set();
                const categories = new Set();

                this.analyticsEvents.forEach(e => {
                    events.add(e.title);
                    if (e.category) categories.add(e.category);
                    if (e.college) {
                        colleges.add(e.college.name || e.college.collegeName);
                        districts.add(e.college.district);
                    }
                });

                const populateSelect = (id, set, defaultText) => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.innerHTML = `<option value="ALL">${defaultText}</option>` +
                            Array.from(set).filter(Boolean).sort().map(item => `<option value="${item}">${item}</option>`).join('');
                    }
                };

                populateSelect('analytics-filter-district', districts, 'All Districts');
                populateSelect('analytics-filter-college', colleges, 'All Colleges');
                populateSelect('analytics-filter-event', events, 'All Events');
                populateSelect('analytics-filter-category', categories, 'All Categories');

                // Apply filters and route to default "events" tab
                this.setAnalyticsTab('events');
            } else {
                console.error("Failed to load analytics data");
            }
        } catch (e) {
            console.error(e);
        }
    },

    applyAnalyticsFilters() {
        const district = document.getElementById('analytics-filter-district')?.value || 'ALL';
        const college = document.getElementById('analytics-filter-college')?.value || 'ALL';
        const eventOpt = document.getElementById('analytics-filter-event')?.value || 'ALL';
        const categoryOpt = document.getElementById('analytics-filter-category')?.value || 'ALL';
        const dateFrom = document.getElementById('analytics-filter-date-from')?.value;
        const dateTo = document.getElementById('analytics-filter-date-to')?.value;

        // Filter events
        let fEvents = this.analyticsEvents || [];
        if (district !== 'ALL') fEvents = fEvents.filter(e => e.college && e.college.district === district);
        if (college !== 'ALL') fEvents = fEvents.filter(e => e.college && (e.college.name === college || e.college.collegeName === college));
        if (eventOpt !== 'ALL') fEvents = fEvents.filter(e => e.title === eventOpt);
        if (categoryOpt !== 'ALL') fEvents = fEvents.filter(e => e.category === categoryOpt);

        if (dateFrom) {
            const dFrom = new Date(dateFrom);
            fEvents = fEvents.filter(e => e.eventDate && new Date(e.eventDate) >= dFrom);
        }
        if (dateTo) {
            const dTo = new Date(dateTo);
            dTo.setHours(23, 59, 59, 999);
            fEvents = fEvents.filter(e => e.eventDate && new Date(e.eventDate) <= dTo);
        }

        // Filter registrations
        let fRegs = this.analyticsRegs || [];
        if (district !== 'ALL') fRegs = fRegs.filter(r => r.event && r.event.college && r.event.college.district === district);
        if (college !== 'ALL') fRegs = fRegs.filter(r => r.event && r.event.college && (r.event.college.name === college || r.event.college.collegeName === college));
        if (eventOpt !== 'ALL') fRegs = fRegs.filter(r => r.event && r.event.title === eventOpt);
        if (categoryOpt !== 'ALL') fRegs = fRegs.filter(r => r.event && r.event.category === categoryOpt);

        if (dateFrom) {
            const dFrom = new Date(dateFrom);
            fRegs = fRegs.filter(r => r.registrationDate && new Date(r.registrationDate) >= dFrom);
        }
        if (dateTo) {
            const dTo = new Date(dateTo);
            dTo.setHours(23, 59, 59, 999);
            fRegs = fRegs.filter(r => r.registrationDate && new Date(r.registrationDate) <= dTo);
        }

        // Update cards
        const evCountEl = document.getElementById('analytics-events-count');
        const regCountEl = document.getElementById('analytics-regs-count');
        if (evCountEl) evCountEl.textContent = fEvents.length;
        if (regCountEl) regCountEl.textContent = fRegs.length;

        this.renderAnalyticsCharts(fEvents, fRegs);
    },

    clearAnalyticsFilters() {
        if(document.getElementById('analytics-filter-district')) document.getElementById('analytics-filter-district').value = 'ALL';
        if(document.getElementById('analytics-filter-college')) document.getElementById('analytics-filter-college').value = 'ALL';
        if(document.getElementById('analytics-filter-event')) document.getElementById('analytics-filter-event').value = 'ALL';
        if(document.getElementById('analytics-filter-category')) document.getElementById('analytics-filter-category').value = 'ALL';
        if(document.getElementById('analytics-filter-date-from')) document.getElementById('analytics-filter-date-from').value = '';
        if(document.getElementById('analytics-filter-date-to')) document.getElementById('analytics-filter-date-to').value = '';
        this.applyAnalyticsFilters();
    },

    renderAnalyticsCharts(events, regs) {
        if (!window.Chart) return;
        
        // Destroy existing
        if (this.analyticsEventPie) this.analyticsEventPie.destroy();
        if (this.analyticsEventBar) this.analyticsEventBar.destroy();
        if (this.analyticsRegPie) this.analyticsRegPie.destroy();
        if (this.analyticsRegBar) this.analyticsRegBar.destroy();

        const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
        
        // ---------------- EVENTS CHARTS ----------------
        // Event Pie: Events by Category
        const eventCats = {};
        events.forEach(e => {
            const c = e.category || 'Other';
            eventCats[c] = (eventCats[c] || 0) + 1;
        });
        const ePieCtx = document.getElementById('analyticsEventPie');
        if (ePieCtx && Object.keys(eventCats).length > 0) {
            this.analyticsEventPie = new Chart(ePieCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(eventCats),
                    datasets: [{ data: Object.values(eventCats), backgroundColor: pieColors, borderWidth: 1 }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        
        // Event Bar: Events by College
        const eventColleges = {};
        events.forEach(e => {
            const cName = e.college ? (e.college.name || e.college.collegeName) : 'Unknown';
            eventColleges[cName] = (eventColleges[cName] || 0) + 1;
        });
        const sortedEventColleges = Object.entries(eventColleges).sort((a,b)=>b[1]-a[1]).slice(0, 5);
        const eBarCtx = document.getElementById('analyticsEventBar');
        if (eBarCtx && sortedEventColleges.length > 0) {
            this.analyticsEventBar = new Chart(eBarCtx, {
                type: 'bar',
                data: {
                    labels: sortedEventColleges.map(x=>x[0].substring(0,15) + (x[0].length>15?'...':'')),
                    datasets: [{ label: 'Number of Events', data: sortedEventColleges.map(x=>x[1]), backgroundColor: '#3b82f6', borderRadius: 4 }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
            });
        }

        // ---------------- REGISTRATIONS CHARTS ----------------
        // Reg Pie: Regs by Category
        const regCats = {};
        regs.forEach(r => {
            const c = (r.event && r.event.category) || 'Other';
            regCats[c] = (regCats[c] || 0) + 1;
        });
        const rPieCtx = document.getElementById('analyticsRegPie');
        if (rPieCtx && Object.keys(regCats).length > 0) {
            this.analyticsRegPie = new Chart(rPieCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(regCats),
                    datasets: [{ data: Object.values(regCats), backgroundColor: pieColors, borderWidth: 1 }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        // Reg Bar: Regs by College
        const regColleges = {};
        regs.forEach(r => {
            const cName = (r.event && r.event.college) ? (r.event.college.name || r.event.college.collegeName) : 'Unknown';
            regColleges[cName] = (regColleges[cName] || 0) + 1;
        });
        const sortedRegColleges = Object.entries(regColleges).sort((a,b)=>b[1]-a[1]).slice(0, 5);
        const rBarCtx = document.getElementById('analyticsRegBar');
        if (rBarCtx && sortedRegColleges.length > 0) {
            this.analyticsRegBar = new Chart(rBarCtx, {
                type: 'bar',
                data: {
                    labels: sortedRegColleges.map(x=>x[0].substring(0,15) + (x[0].length>15?'...':'')),
                    datasets: [{ label: 'Number of Registrations', data: sortedRegColleges.map(x=>x[1]), backgroundColor: '#ec4899', borderRadius: 4 }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
            });
        }
    },

    setReportsTab(tab) {
        document.getElementById('reports-tab-events').style.border = tab === 'events' ? '2px solid var(--primary)' : '2px solid transparent';
        document.getElementById('reports-tab-regs').style.border = tab === 'regs' ? '2px solid var(--primary)' : '2px solid transparent';

        document.getElementById('reports-events-view').style.display = tab === 'events' ? 'block' : 'none';
        document.getElementById('reports-regs-view').style.display = tab === 'regs' ? 'none' : 'block';
        if (tab === 'regs') {
            document.getElementById('reports-events-view').style.display = 'none';
            document.getElementById('reports-regs-view').style.display = 'block';
        }
        this.currentReportsTab = tab;
    },

    async loadReportsData() {
        try {
            const getEvents = fetch('/api/admin/events', { headers: this.getAuthHeaders() });
            const getRegs = fetch('/api/admin/registrations', { headers: this.getAuthHeaders() });
            
            const [eventsRes, regsRes] = await Promise.all([getEvents, getRegs]);
            
            if (eventsRes.ok && regsRes.ok) {
                this.reportsEvents = await eventsRes.json();
                this.reportsRegs = await regsRes.json();

                const districts = new Set();
                const colleges = new Set();
                const events = new Set();
                const categories = new Set();

                this.reportsEvents.forEach(e => {
                    events.add(e.title);
                    if (e.category) categories.add(e.category);
                    if (e.college) {
                        colleges.add(e.college.name || e.college.collegeName);
                        districts.add(e.college.district);
                    }
                });

                const populateSelect = (id, set, defaultText) => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.innerHTML = `<option value="ALL">${defaultText}</option>` +
                            Array.from(set).filter(Boolean).sort().map(item => `<option value="${item}">${item}</option>`).join('');
                    }
                };

                populateSelect('reports-filter-district', districts, 'All Districts');
                populateSelect('reports-filter-college', colleges, 'All Colleges');
                populateSelect('reports-filter-event', events, 'All Events');
                populateSelect('reports-filter-category', categories, 'All Categories');

                this.setReportsTab('events');
                this.applyReportsFilters();
            }
        } catch (e) {
            console.error(e);
        }
    },

    applyReportsFilters() {
        const district = document.getElementById('reports-filter-district')?.value || 'ALL';
        const college = document.getElementById('reports-filter-college')?.value || 'ALL';
        const eventOpt = document.getElementById('reports-filter-event')?.value || 'ALL';
        const categoryOpt = document.getElementById('reports-filter-category')?.value || 'ALL';
        const dateFrom = document.getElementById('reports-filter-date-from')?.value;
        const dateTo = document.getElementById('reports-filter-date-to')?.value;

        // Filter events
        let fEvents = this.reportsEvents || [];
        if (district !== 'ALL') fEvents = fEvents.filter(e => e.college && e.college.district === district);
        if (college !== 'ALL') fEvents = fEvents.filter(e => e.college && (e.college.name === college || e.college.collegeName === college));
        if (eventOpt !== 'ALL') fEvents = fEvents.filter(e => e.title === eventOpt);
        if (categoryOpt !== 'ALL') fEvents = fEvents.filter(e => e.category === categoryOpt);

        if (dateFrom) {
            const dFrom = new Date(dateFrom);
            fEvents = fEvents.filter(e => e.eventDate && new Date(e.eventDate) >= dFrom);
        }
        if (dateTo) {
            const dTo = new Date(dateTo);
            dTo.setHours(23, 59, 59, 999);
            fEvents = fEvents.filter(e => e.eventDate && new Date(e.eventDate) <= dTo);
        }

        // Filter registrations
        let fRegs = this.reportsRegs || [];
        if (district !== 'ALL') fRegs = fRegs.filter(r => r.event && r.event.college && r.event.college.district === district);
        if (college !== 'ALL') fRegs = fRegs.filter(r => r.event && r.event.college && (r.event.college.name === college || r.event.college.collegeName === college));
        if (eventOpt !== 'ALL') fRegs = fRegs.filter(r => r.event && r.event.title === eventOpt);
        if (categoryOpt !== 'ALL') fRegs = fRegs.filter(r => r.event && r.event.category === categoryOpt);

        if (dateFrom) {
            const dFrom = new Date(dateFrom);
            fRegs = fRegs.filter(r => r.registrationDate && new Date(r.registrationDate) >= dFrom);
        }
        if (dateTo) {
            const dTo = new Date(dateTo);
            dTo.setHours(23, 59, 59, 999);
            fRegs = fRegs.filter(r => r.registrationDate && new Date(r.registrationDate) <= dTo);
        }

        const evCountEl = document.getElementById('reports-events-count');
        const regCountEl = document.getElementById('reports-regs-count');
        if (evCountEl) evCountEl.textContent = fEvents.length;
        if (regCountEl) regCountEl.textContent = fRegs.length;

        this.currentReportsEvents = fEvents;
        this.currentReportsRegs = fRegs;
        
        // Render Tables
        const evBody = document.getElementById('reports-events-body');
        if (evBody) {
            if (fEvents.length === 0) {
                evBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No events found.</td></tr>';
            } else {
                evBody.innerHTML = fEvents.map(e => `
                    <tr>
                        <td>${e.eventDate ? new Date(e.eventDate).toLocaleDateString() : 'N/A'}</td>
                        <td style="font-weight: 600;">${e.title || 'N/A'}</td>
                        <td>${e.category || 'N/A'}</td>
                        <td>${(e.college && (e.college.name || e.college.collegeName)) || 'N/A'}</td>
                        <td>${(e.college && e.college.district) || 'N/A'}</td>
                        <td>
                            <button class="btn-primary" style="padding: 0.35rem 0.7rem; font-size: 0.75rem; background: var(--navy-sidebar);" onclick="AdminPanel.viewEventDetails(${e.id})">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }

        const regBody = document.getElementById('reports-regs-body');
        if (regBody) {
            if (fRegs.length === 0) {
                regBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No registrations found.</td></tr>';
            } else {
                regBody.innerHTML = fRegs.map(r => `
                    <tr>
                        <td style="font-weight: 600;">${r.username || (r.student && r.student.username) || 'N/A'}</td>
                        <td>${r.event ? r.event.title : 'N/A'}</td>
                        <td>${(r.event && r.event.category) || 'N/A'}</td>
                        <td>${(r.event && r.event.college && (r.event.college.name || r.event.college.collegeName)) || 'N/A'}</td>
                        <td>${r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                `).join('');
            }
        }
    },

    clearReportsFilters() {
        if(document.getElementById('reports-filter-district')) document.getElementById('reports-filter-district').value = 'ALL';
        if(document.getElementById('reports-filter-college')) document.getElementById('reports-filter-college').value = 'ALL';
        if(document.getElementById('reports-filter-event')) document.getElementById('reports-filter-event').value = 'ALL';
        if(document.getElementById('reports-filter-category')) document.getElementById('reports-filter-category').value = 'ALL';
        if(document.getElementById('reports-filter-date-from')) document.getElementById('reports-filter-date-from').value = '';
        if(document.getElementById('reports-filter-date-to')) document.getElementById('reports-filter-date-to').value = '';
        this.applyReportsFilters();
    },

    exportReportsToExcel() {
        if (!this.currentReportsEvents || !this.currentReportsRegs) return;
        const isEvents = this.currentReportsTab === 'events';
        let csvContent = "";
        
        if (isEvents) {
            csvContent = "Date,Title,Category,College,District\n";
            this.currentReportsEvents.forEach(e => {
                const date = e.eventDate ? new Date(e.eventDate).toLocaleDateString() : '';
                const title = `"${(e.title || '').replace(/"/g, '""')}"`;
                const cat = `"${(e.category || '').replace(/"/g, '""')}"`;
                const col = `"${((e.college && (e.college.name || e.college.collegeName)) || '').replace(/"/g, '""')}"`;
                const dist = `"${((e.college && e.college.district) || '').replace(/"/g, '""')}"`;
                csvContent += `${date},${title},${cat},${col},${dist}\n`;
            });
        } else {
            csvContent = "Username,Event,Category,College,Reg. Date\n";
            this.currentReportsRegs.forEach(r => {
                const studentName = r.username || (r.student && r.student.username) || '';
                const uname = `"${studentName.replace(/"/g, '""')}"`;
                const event = `"${(r.event ? r.event.title : '').replace(/"/g, '""')}"`;
                const cat = `"${((r.event && r.event.category) || '').replace(/"/g, '""')}"`;
                const col = `"${((r.event && r.event.college && (r.event.college.name || r.event.college.collegeName)) || '').replace(/"/g, '""')}"`;
                const date = r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : '';
                csvContent += `${uname},${event},${cat},${col},${date}\n`;
            });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', isEvents ? 'events_report.csv' : 'registrations_report.csv');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            // Remove any inline style that might interfere with CSS class display logic
            modal.style.display = '';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});
