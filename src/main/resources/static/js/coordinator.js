/**
 * Coordinator Panel Core Logic
 * Handles dynamic content loading, routing, and UI interactions.
 */

const CoordinatorPanel = {
    currentPage: 'dashboard',
    
    // User Session Data
    user: {
        name: "",
        role: "",
        collegeName: "",
        email: "",
        district: "",
        city: "",
        state: "",
        phone: "",
        initials: ""
    },
    
    // Live Data (Populated on init)
    data: {
        events: [],
        registrations: [],
        stats: {
            totalEvents: 0,
            presentEvents: 0,
            pastEvents: 0,
            totalRegistrations: 0
        }
    },

    selectedDashboardTab: 'total', // 'total', 'present', 'registrations', 'past'

    // Page Content Templates
    templates: {
        dashboard: `
            <div class="animate-slide">
                <h1 style="margin-bottom: 2rem;">Coordinator Dashboard</h1>
                
                <div class="stats-grid">
                    <div class="stat-card" onclick="CoordinatorPanel.filterDashboard('total')" id="stat-total">
                        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;"><i class="fas fa-calendar-plus"></i></div>
                        <div class="stat-info"><h3>Total Events</h3><p id="statTotalEvents">0</p></div>
                    </div>
                    <div class="stat-card" onclick="CoordinatorPanel.filterDashboard('present')" id="stat-present">
                        <div class="stat-icon" style="background: #eef2ff; color: #6366f1;"><i class="fas fa-clock"></i></div>
                        <div class="stat-info"><h3>Present Event</h3><p id="statPresentEvents">0</p></div>
                    </div>
                    <div class="stat-card" onclick="CoordinatorPanel.filterDashboard('registrations')" id="stat-registrations">
                        <div class="stat-icon" style="background: #fdf2f8; color: #ec4899;"><i class="fas fa-users"></i></div>
                        <div class="stat-info"><h3>Registrations</h3><p id="statTotalRegs">0</p></div>
                    </div>
                    <div class="stat-card" onclick="CoordinatorPanel.filterDashboard('past')" id="stat-past">
                        <div class="stat-icon" style="background: #fff7ed; color: #f59e0b;"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-info"><h3>Past Event</h3><p id="statPastEvents">0</p></div>
                    </div>
                </div>

                <div class="card" id="dashboardTableContainer">
                    <!-- Dynamic Table Rendered Here -->
                </div>
            </div>
        `,
        'create-event': `
            <div class="animate-slide">
                <h1 style="margin-bottom: 2rem;">Host a New Event</h1>
                <div class="card">
                    <form id="createEventForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;" onsubmit="CoordinatorPanel.submitEvent(event)">
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Title *</label>
                            <input id="evTitle" type="text" required placeholder="e.g., National Level Robotics Workshop" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Category *</label>
                            <select id="evCategory" required style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                                <option value="">Select category...</option>
                                <option>Technical</option>
                                <option>Cultural</option>
                                <option>Sports</option>
                                <option>Workshop</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Maximum Participants *</label>
                            <input id="evMaxParticipants" type="number" required placeholder="e.g., 500" min="1" max="999999" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description *</label>
                            <textarea id="evDescription" required rows="3" placeholder="Describe the purpose and highlights of the event..." style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);"></textarea>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Registration Deadline *</label>
                            <input id="evRegDeadline" type="date" required style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Date *</label>
                            <input id="evDate" type="datetime-local" required style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Location / Venue *</label>
                            <input id="evVenue" type="text" required placeholder="e.g., Main Auditorium, Block A" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div id="createEventMsg" style="grid-column: span 2; display: none; padding: 0.75rem; border-radius: 8px; font-weight: 600;"></div>
                        <div style="grid-column: span 2; display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                            <button type="submit" id="evPublishBtn" class="btn-primary">Publish Event</button>
                        </div>
                    </form>
                </div>
            </div>
        `,
        'manage-events': `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Manage Events</h1>
                    <button class="btn-primary" onclick="CoordinatorPanel.navigate('create-event')"><i class="fas fa-plus"></i> New Event</button>
                </div>
                <div class="card">
                    <div class="flex-between" style="margin-bottom: 1.5rem;">
                        <div class="search-box" style="max-width: 300px;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="eventSearchInput" onkeyup="CoordinatorPanel.filterEventsTable()" placeholder="Search event title...">
                        </div>
                        <div class="gap-1" style="display: flex;">
                            <select id="eventCategoryFilter" onchange="CoordinatorPanel.filterEventsTable()" style="padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                                <option value="all">All Categories</option>
                                <option value="Technical">Technical</option>
                                <option value="Cultural">Cultural</option>
                                <option value="Sports">Sports</option>
                            </select>
                            <select id="eventStatusFilter" onchange="CoordinatorPanel.filterEventsTable()" style="padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                                <option value="all">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Event Title</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Registrations</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="eventsTableBody">
                                <!-- Dynamic Events Row Rendered Here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        'form-builder': `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <div>
                        <h1>Registration Form Builder</h1>
                        <p style="color: var(--text-muted);">Configure the registration form for students.</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <!-- Configuration Section -->
                    <div class="card">
                        <h3 style="margin-bottom: 1.5rem;"><i class="fas fa-cog"></i> Form Configuration</h3>
                        
                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin-bottom: 1rem; color: var(--primary);">1. Select Student Details to Collect</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                                <label class="checkbox-container">
                                    <input type="checkbox" id="field-name" checked onchange="CoordinatorPanel.updateFormPreview()"> Student Name
                                </label>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="field-email" checked onchange="CoordinatorPanel.updateFormPreview()"> Email Address
                                </label>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="field-college" checked onchange="CoordinatorPanel.updateFormPreview()"> College Name
                                </label>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="field-branch" onchange="CoordinatorPanel.updateFormPreview()"> Branch / Department
                                </label>
                                <label class="checkbox-container">
                                    <input type="checkbox" id="field-year" onchange="CoordinatorPanel.updateFormPreview()"> Student Year
                                </label>
                            </div>
                        </div>

                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin-bottom: 1rem; color: var(--primary);">2. Select Events for Registration</h4>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Choose which events will appear as radio options.</p>
                            <div id="eventSelectionList" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 200px; overflow-y: auto; padding-right: 0.5rem;">
                                <!-- Populated dynamically -->
                            </div>
                        </div>

                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin-bottom: 1rem; color: var(--primary);">3. Additional Requirements</h4>
                            <label class="checkbox-container">
                                <input type="checkbox" id="field-payment" checked onchange="CoordinatorPanel.updateFormPreview()"> Require Payment Screenshot
                            </label>
                        </div>

                        <button class="btn-primary" style="width: 100%;" onclick="alert('Form configuration saved!')">Save Configuration</button>
                    </div>

                    <!-- Preview Section -->
                    <div class="card" style="background: #f8fafc; border: 2px dashed var(--border-color);">
                        <h3 style="margin-bottom: 1.5rem;"><i class="fas fa-eye"></i> Form Preview (Student View)</h3>
                        <div id="registrationFormPreview" style="background: white; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow-sm);">
                            <!-- Preview content rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `,
        'participants': `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Participant Management</h1>
                    <div class="gap-1" style="display: flex;">
                        <button class="btn-primary" style="background: #16a34a;"><i class="fas fa-file-excel"></i> Excel</button>
                        <button class="btn-primary" style="background: #1d4ed8;"><i class="fas fa-file-csv"></i> CSV</button>
                    </div>
                </div>
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>College</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Aryan Kulkarni</strong></td>
                                <td>KIT College</td>
                                <td>aryan@example.com</td>
                                <td><span class="status-badge status-pending">Pending</span></td>
                                <td>
                                    <button class="btn-primary" style="padding: 0.4rem; font-size: 0.7rem;">Approve</button>
                                    <button class="btn-primary" style="padding: 0.4rem; font-size: 0.7rem; background: #ef4444;">Reject</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        'posts': `
            <div class="animate-slide" style="max-width: 800px; margin: 0 auto;">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <div>
                        <h1>Community Posts</h1>
                        <p style="color: var(--text-muted);">Share updates and photos with the student community.</p>
                    </div>
                </div>

                <!-- Create Post Box -->
                <div class="card" style="padding: 1.5rem; margin-bottom: 2rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                            RP
                        </div>
                        <textarea id="postCaption" placeholder="What's happening in your event?" style="flex: 1; border: none; padding: 0.5rem; font-size: 1.1rem; resize: none; min-height: 100px; outline: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
                    </div>
                    
                    <div id="attachmentsPreview" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.5rem; margin-bottom: 1rem;">
                        <!-- Selected images will appear here -->
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #f1f5f9;">
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-primary" style="background: #f1f5f9; color: #475569; padding: 0.5rem 1rem;" onclick="document.getElementById('postPhotos').click()">
                                <i class="fas fa-image" style="color: #10b981;"></i> Photo/Video
                            </button>
                            <input type="file" id="postPhotos" multiple style="display: none;" accept="image/*">
                            <button class="btn-primary" style="background: #f1f5f9; color: #475569; padding: 0.5rem 1rem;">
                                <i class="fas fa-calendar-alt" style="color: #3b82f6;"></i> Tag Event
                            </button>
                        </div>
                        <button class="btn-primary" onclick="CoordinatorPanel.submitPost()" style="padding: 0.6rem 2rem;">Post</button>
                    </div>
                </div>

                <!-- Feed Header -->
                <div style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                    <h3 style="font-size: 1rem; color: var(--text-muted);">Recent Posts</h3>
                </div>

                <!-- Live Feed -->
                <div id="postsFeedContainer" style="display: grid; gap: 1.5rem;">
                    <!-- Posts will be rendered here -->
                </div>
            </div>
        `,
        'winners': `
            <div class="animate-slide">
                <h1>Winners Announcement</h1>
                <div class="card">
                    <form style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.5rem;">Event Name</label>
                            <select style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                                <option>Shivaji Jayanti 2024</option>
                                <option>Tech-Fest Zenith</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Winner Name</label>
                            <input type="text" placeholder="Individual or Team Name" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Winner College</label>
                            <input type="text" placeholder="College Name" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div style="grid-column: span 2;">
                            <button class="btn-primary">Publish Results</button>
                        </div>
                    </form>
                </div>
            </div>
        `,
        'notifications': `
             <div class="animate-slide">
                <h1>Notifications</h1>
                <div class="card">
                    <h3>Send New Notification</h3>
                    <form style="margin-top: 1.5rem;">
                        <input type="text" placeholder="Title: Hackathon update" style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        <textarea rows="3" placeholder="Message content..." style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);"></textarea>
                        <button class="btn-primary" style="margin-top: 1rem;">Send to Registered Students</button>
                    </form>
                </div>
            </div>
        `,
        'statistics': `
            <div class="animate-slide">
                <h1>Event Statistics</h1>
                <div class="stats-grid">
                    <div class="card" style="grid-column: span 2;">
                        <h3>Registration Trend</h3>
                        <div style="height: 200px; background: #f9fafb; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
                             [ Chart Placeholder ]
                        </div>
                    </div>
                </div>
            </div>
        `,
        'feedback': `
            <div class="animate-slide">
                <h1>Feedback Analysis</h1>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-info"><h3>Avg. Rating</h3><p>4.8 / 5.0</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info"><h3>Total Feedback</h3><p>120</p></div>
                    </div>
                </div>
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr><th>Student</th><th>Event</th><th>Rating</th><th>Comment</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Sneha Patil</td><td>Shivaji Jayanti</td><td>5 ★</td><td>Amazing experience!</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        'profile': `
            <div class="animate-slide">
                <h1>College Profile</h1>
                <div class="card" id="profileCard">
                    <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                        <div style="width: 150px; height: 150px; background: var(--primary-light); color: var(--primary); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                            <i class="fas fa-university"></i>
                        </div>
                        <div style="flex-grow: 1; min-width: 300px;" id="profileDisplayView">
                            <h2 id="profileCollegeName"></h2>
                            <p id="profileLocation" style="color: var(--text-muted);"></p>
                            <div style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                                <div>
                                    <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">College Email</label>
                                    <div id="profileEmail" style="font-weight: 500;"></div>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Phone Number</label>
                                    <div id="profilePhone" style="font-weight: 500;"></div>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">District</label>
                                    <div id="profileDistrict" style="font-weight: 500;"></div>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Coordinator</label>
                                    <div id="profileCoordName" style="font-weight: 500;"></div>
                                </div>
                            </div>
                            <button class="btn-primary" onclick="CoordinatorPanel.editProfile()" style="margin-top: 2rem; background: var(--secondary);">Edit Profile</button>
                        </div>
                        
                        <!-- Edit Mode View (Hidden by default) -->
                        <div style="flex-grow: 1; min-width: 300px; display: none;" id="profileEditView">
                            <form onsubmit="CoordinatorPanel.saveProfile(event)">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div style="grid-column: span 2;">
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Full Name (Coordinator)</label>
                                        <input type="text" id="editFullName" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Phone Number</label>
                                        <input type="tel" id="editPhone" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">District</label>
                                        <input type="text" id="editDistrict" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                                    </div>
                                </div>
                                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                                    <button type="submit" class="btn-primary">Save Changes</button>
                                    <button type="button" class="btn-primary" style="background: var(--text-muted);" onclick="CoordinatorPanel.populateProfileData()">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `,
    },

    async init() {
        this.loadSessionUser();
        this.updateHeaderWithUser();
        await this.fetchAllData();
        this.render();
        this.setupEventListeners();
        console.log("Coordinator Panel Initialized");
    },

    async fetchAllData() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const [stats, events, regs] = await Promise.all([
                fetch('/api/coordinator/stats', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                fetch('/api/coordinator/events', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                fetch('/api/coordinator/registrations', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
            ]);

            this.data.stats = stats;
            this.data.events = events.map(e => ({
                id: e.id,
                name: e.title,
                category: e.category,
                date: e.eventDate,
                venue: e.venue,
                registrations: 0, // Should be calculated or returned from backend
                status: e.status === 'PUBLISHED' ? 'Active' : (e.status === 'COMPLETED' ? 'Completed' : 'Draft'),
                description: e.description,
                rules: "", // Add if available
                deadline: e.registrationDeadline,
                coordinatorName: e.coordinator ? e.coordinator.fullName : "",
                coordinatorMobile: e.coordinator ? e.coordinator.phone : "",
                photos: 0,
                minParticipants: 1, // Default
                maxParticipants: e.maxParticipants
            }));

            this.data.registrations = regs.map(r => ({
                id: r.id,
                student: r.student.fullName,
                college: r.student.college ? r.student.college.name : "N/A",
                event: r.event.title,
                time: this.formatDateTime(r.registrationDate)
            }));

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },

    formatDateTime(dateStr) {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleString();
    },

    loadSessionUser() {
        const sessionUser = localStorage.getItem('user');
        if (sessionUser) {
            try {
                const parsed = JSON.parse(sessionUser);
                // Map session user - JWT response now includes fullName, collegeName, phone, district
                this.user = {
                    ...this.user,
                    name: parsed.fullName || parsed.name || this.user.name,
                    collegeName: parsed.collegeName || this.user.collegeName,
                    email: parsed.email || this.user.email,
                    district: parsed.district || this.user.district,
                    phone: parsed.phone || this.user.phone,
                    role: (parsed.roles && parsed.roles[0]) ? parsed.roles[0].replace('ROLE_', '') : this.user.role
                };
                
                // Set initials from name
                if (this.user.name) {
                    const names = this.user.name.trim().split(' ');
                    this.user.initials = names.map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || '??';
                }
            } catch (e) {
                console.error("Error parsing session user", e);
            }
        }
    },

    updateHeaderWithUser() {
        const nameEl = document.getElementById('userName') || document.querySelector('.user-name');
        const roleEl = document.getElementById('userRole') || document.querySelector('.user-role');
        const avatarEl = document.querySelector('.avatar');

        if (nameEl) nameEl.textContent = this.user.name;
        if (roleEl) roleEl.textContent = this.user.role;
        if (avatarEl) avatarEl.textContent = this.user.initials;
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
            
            // Post-render logic
            if (this.currentPage === 'dashboard') {
                this.populateDashboardStats();
                this.renderDashboardTable();
            } else if (this.currentPage === 'manage-events') {
                this.filterEventsTable();
            } else if (this.currentPage === 'form-builder') {
                this.initFormBuilder();
            } else if (this.currentPage === 'profile') {
                this.populateProfileData();
            } else if (this.currentPage === 'posts') {
                this.renderPosts();
            }
        }
    },

    async renderPosts() {
        const container = document.getElementById('postsFeedContainer');
        if (!container) return;

        try {
            const response = await fetch('/api/coordinator/posts');
            const posts = await response.json();

            if (posts.length === 0) {
                container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No posts yet. Be the first to share an update!</p>`;
                return;
            }

            container.innerHTML = posts.map(p => {
                const coordInitials = p.coordinator ? p.coordinator.fullName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : "??";
                return `
                    <div class="card" style="padding: 0; overflow: hidden;">
                        <div style="padding: 1rem; display: flex; align-items: center; gap: 0.75rem;">
                             <div style="width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;">${coordInitials}</div>
                             <div>
                                <h4 style="margin: 0; font-size: 0.95rem;">${p.coordinator ? p.coordinator.fullName : "Unknown"}</h4>
                                <span style="font-size: 0.75rem; color: var(--text-muted);">${this.formatDateTime(p.createdAt)} ${p.event ? `• ${p.event.title}` : ''}</span>
                             </div>
                        </div>
                        <div style="padding: 0 1rem 1rem 1rem;">
                            <p style="margin: 0; font-size: 0.95rem; line-height: 1.5;">${p.caption}</p>
                        </div>
                        ${p.images ? `
                        <div style="background: #f1f5f9; padding: 0.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                            ${p.images.includes(',') ? p.images.split(',').map(img => `<img src="${img}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">`).join('') : `<img src="${p.images}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px;">`}
                        </div>` : ''}
                        <div style="padding: 0.75rem 1rem; border-top: 1px solid #f1f5f9; display: flex; gap: 1.5rem;">
                            <span style="font-size: 0.85rem; color: var(--text-muted); cursor: pointer;"><i class="far fa-heart"></i> Like</span>
                            <span style="font-size: 0.85rem; color: var(--text-muted); cursor: pointer;"><i class="far fa-comment"></i> Comment</span>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error("Error fetching posts:", error);
            container.innerHTML = `<p style="color: red; text-align: center;">Failed to load posts.</p>`;
        }
    },

    populateDashboardStats() {
        const els = {
            total: document.getElementById('statTotalEvents'),
            present: document.getElementById('statPresentEvents'),
            regs: document.getElementById('statTotalRegs'),
            past: document.getElementById('statPastEvents')
        };

        if (els.total) els.total.textContent = this.data.stats.totalEvents;
        if (els.present) els.present.textContent = this.data.stats.presentEvents;
        if (els.regs) els.regs.textContent = this.data.stats.totalRegistrations;
        if (els.past) els.past.textContent = this.data.stats.pastEvents;
    },

    populateProfileData() {
        // Toggle view
        document.getElementById('profileDisplayView').style.display = 'block';
        document.getElementById('profileEditView').style.display = 'none';

        const elements = {
            college: document.getElementById('profileCollegeName'),
            location: document.getElementById('profileLocation'),
            email: document.getElementById('profileEmail'),
            phone: document.getElementById('profilePhone'),
            district: document.getElementById('profileDistrict'),
            coord: document.getElementById('profileCoordName')
        };

        if (elements.college) elements.college.textContent = this.user.collegeName;
        if (elements.location) elements.location.textContent = `${this.user.city}, ${this.user.state}`;
        if (elements.email) elements.email.textContent = this.user.email;
        if (elements.phone) elements.phone.textContent = this.user.phone;
        if (elements.district) elements.district.textContent = this.user.district;
        if (elements.coord) elements.coord.textContent = this.user.name;
    },

    editProfile() {
        document.getElementById('profileDisplayView').style.display = 'none';
        document.getElementById('profileEditView').style.display = 'block';

        // Pre-fill inputs
        document.getElementById('editFullName').value = this.user.name;
        document.getElementById('editPhone').value = this.user.phone;
        document.getElementById('editDistrict').value = this.user.district;
    },

    async saveProfile(e) {
        e.preventDefault();
        
        const updatedData = {
            fullName: document.getElementById('editFullName').value,
            phone: document.getElementById('editPhone').value,
            district: document.getElementById('editDistrict').value
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/coordinator/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const refreshedUser = await response.json();
                
                // Update local storage and panel state
                const localUserData = JSON.parse(localStorage.getItem('user'));
                localUserData.name = refreshedUser.fullName;
                localUserData.phone = refreshedUser.phone;
                localUserData.district = refreshedUser.district;
                localStorage.setItem('user', JSON.stringify(localUserData));
                
                this.loadSessionUser();
                this.updateHeaderWithUser();
                this.populateProfileData();
                
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred. Please check your connection.");
        }
    },

    async submitEvent(e) {
        e.preventDefault();
        const btn = document.getElementById('evPublishBtn');
        const msg = document.getElementById('createEventMsg');
        if (btn) { btn.disabled = true; btn.textContent = 'Publishing...'; }

        const payload = {
            title: document.getElementById('evTitle').value,
            category: document.getElementById('evCategory').value,
            maxParticipants: parseInt(document.getElementById('evMaxParticipants').value),
            description: document.getElementById('evDescription').value,
            registrationDeadline: document.getElementById('evRegDeadline').value + 'T00:00:00',
            eventDate: document.getElementById('evDate').value,
            venue: document.getElementById('evVenue').value
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/coordinator/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const created = await response.json();
                // Add to local data and refresh list
                this.data.events.push({
                    id: created.id,
                    name: created.title,
                    category: created.category,
                    date: created.eventDate,
                    venue: created.venue,
                    registrations: 0,
                    status: 'Active',
                    description: created.description,
                    maxParticipants: created.maxParticipants,
                    minParticipants: 1
                });
                this.data.stats.totalEvents++;
                this.data.stats.presentEvents++;

                if (msg) {
                    msg.style.display = 'block';
                    msg.style.background = '#ecfdf5';
                    msg.style.color = '#10b981';
                    msg.textContent = '✅ Event published successfully!';
                }
                document.getElementById('createEventForm').reset();
            } else {
                const err = await response.text();
                if (msg) {
                    msg.style.display = 'block';
                    msg.style.background = '#fef2f2';
                    msg.style.color = '#ef4444';
                    msg.textContent = '❌ Failed: ' + err;
                }
            }
        } catch (error) {
            console.error('Error creating event:', error);
            if (msg) {
                msg.style.display = 'block';
                msg.style.background = '#fef2f2';
                msg.style.color = '#ef4444';
                msg.textContent = '❌ Network error. Please try again.';
            }
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Publish Event'; }
        }
    },

    async submitPost() {
        const caption = document.getElementById('postCaption')?.value?.trim();
        const photoInput = document.getElementById('postPhotos');

        if (!caption && (!photoInput || photoInput.files.length === 0)) {
            alert('Please write a caption or add a photo before posting.');
            return;
        }

        const formData = new FormData();
        formData.append('caption', caption || '');
        if (photoInput && photoInput.files.length > 0) {
            Array.from(photoInput.files).forEach(file => formData.append('images', file));
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/coordinator/posts', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                // Clear inputs
                document.getElementById('postCaption').value = '';
                if (photoInput) photoInput.value = '';
                document.getElementById('attachmentsPreview').innerHTML = '';
                // Reload feed
                this.renderPosts();
            } else {
                const err = await response.text();
                alert('Failed to post: ' + err);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Network error. Please try again.');
        }
    },

    filterDashboard(type) {
        this.selectedDashboardTab = type;
        
        // Visual feedback on cards
        document.querySelectorAll('.stat-card').forEach(card => card.style.borderColor = 'var(--border-color)');
        document.getElementById(`stat-${type}`).style.borderColor = 'var(--primary)';
        
        this.renderDashboardTable();
    },

    renderDashboardTable() {
        const container = document.getElementById('dashboardTableContainer');
        if (!container) return;

        let html = '';
        const today = new Date('2024-03-08'); // Mock today matching user metadata

        if (this.selectedDashboardTab === 'registrations') {
            const eventNames = [...new Set(this.data.registrations.map(r => r.event))];
            html = `
                <div class="card-header">
                    <h2>Recent Registrations</h2>
                    <div class="flex-between gap-1" style="flex-wrap: wrap;">
                        <div class="search-box" style="max-width: 250px; margin-bottom: 0;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="regSearchInput" onkeyup="CoordinatorPanel.handleRegSearch()" placeholder="Search student or college...">
                        </div>
                        <select id="regEventFilter" onchange="CoordinatorPanel.handleRegSearch()" style="padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
                            <option value="all">All Events</option>
                            ${eventNames.map(name => `<option value="${name}">${name}</option>`).join('')}
                        </select>
                        <button class="btn-primary" onclick="CoordinatorPanel.navigate('participants')">Full View</button>
                    </div>
                </div>
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>College</th>
                                <th>Event</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody id="registrationsTableBody">
                            ${this.getFilteredRegistrationsRows()}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            let filteredEvents = this.data.events;
            let title = "Total Events Created";

            if (this.selectedDashboardTab === 'present') {
                filteredEvents = this.data.events.filter(e => new Date(e.date) >= today);
                title = "Present Active Events";
            } else if (this.selectedDashboardTab === 'past') {
                filteredEvents = this.data.events.filter(e => new Date(e.date) < today);
                title = "Past Events History";
            }

            html = `
                <div class="card-header">
                    <h2>${title}</h2>
                    <button class="btn-primary" onclick="CoordinatorPanel.navigate('manage-events')">View All</button>
                </div>
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Venue</th>
                                <th>Registrations</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredEvents.map(e => `
                                <tr>
                                    <td><strong>${e.name}</strong></td>
                                    <td>${this.formatDateShort(e.date)}</td>
                                    <td>${e.venue}</td>
                                    <td>${e.registrations}</td>
                                    <td><span class="status-badge ${e.status === 'Active' ? 'status-active' : 'status-completed'}">${e.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        container.innerHTML = html;
    },

    handleRegSearch() {
        const query = document.getElementById('regSearchInput')?.value.toLowerCase() || '';
        const eventName = document.getElementById('regEventFilter')?.value || 'all';
        const tbody = document.getElementById('registrationsTableBody');
        if (tbody) {
            tbody.innerHTML = this.getFilteredRegistrationsRows(query, eventName);
        }
    },

    getFilteredRegistrationsRows(query = '', eventName = 'all') {
        let rows = this.data.registrations;
        
        // Filter by event
        if (eventName !== 'all') {
            rows = rows.filter(r => r.event === eventName);
        }
        
        // Filter by search query
        if (query) {
            rows = rows.filter(r => 
                r.student.toLowerCase().includes(query) || 
                r.college.toLowerCase().includes(query)
            );
        }

        if (rows.length === 0) {
            return `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matching registrations found.</td></tr>`;
        }

        return rows.map(r => `
            <tr>
                <td><strong>${r.student}</strong></td>
                <td>${r.college}</td>
                <td><span class="district-badge" style="background: var(--primary-light); color: var(--primary-dark);">${r.event}</span></td>
                <td>${r.time}</td>
            </tr>
        `).join('');
    },

    formatDateShort(dateStr) {
        const d = new Date(dateStr);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[d.getMonth()]} ${d.getDate()}`;
    },

    filterEventsTable() {
        const query = document.getElementById('eventSearchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('eventCategoryFilter')?.value || 'all';
        const status = document.getElementById('eventStatusFilter')?.value || 'all';
        
        let filtered = this.data.events;
        if (query) filtered = filtered.filter(e => e.name.toLowerCase().includes(query));
        if (category !== 'all') filtered = filtered.filter(e => e.category === category);
        if (status !== 'all') filtered = filtered.filter(e => e.status === status);

        this.renderEventsTable(filtered);
    },

    renderEventsTable(events) {
        const tbody = document.getElementById('eventsTableBody');
        if (!tbody) return;

        if (events.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matching events found.</td></tr>`;
            return;
        }

        tbody.innerHTML = events.map(e => `
            <tr>
                <td><strong>${e.name}</strong></td>
                <td>${e.category}</td>
                <td>${this.formatDateShort(e.date)}</td>
                <td>${e.registrations}</td>
                <td><span class="status-badge ${e.status === 'Active' ? 'status-active' : 'status-completed'}">${e.status}</span></td>
                <td>
                    <button class="btn-primary" onclick="CoordinatorPanel.viewEventDetails(${e.id})" style="padding: 0.4rem; background: var(--secondary);"><i class="fas fa-eye"></i></button>
                    <button class="btn-primary" onclick="CoordinatorPanel.editEventDates(${e.id})" style="padding: 0.4rem; background: var(--accent);"><i class="fas fa-edit"></i></button>
                </td>
            </tr>
        `).join('');
    },

    viewEventDetails(id) {
        const event = this.data.events.find(e => e.id === id);
        if (!event) return;

        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Event Details</h1>
                    <button class="btn-primary" onclick="CoordinatorPanel.navigate('manage-events')" style="background: var(--text-muted);"><i class="fas fa-arrow-left"></i> Back to List</button>
                </div>
                <div class="card" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div style="grid-column: span 2;">
                        <h2 style="color: var(--primary);">${event.name}</h2>
                        <span class="status-badge ${event.status === 'Active' ? 'status-active' : 'status-completed'}">${event.status}</span>
                    </div>
                    <div>
                        <p><strong>Category:</strong> ${event.category}</p>
                        <p><strong>Venue:</strong> ${event.venue}</p>
                        <p><strong>Date:</strong> ${event.date}</p>
                        <p><strong>Registration Deadline:</strong> ${event.deadline}</p>
                    </div>
                    <div>
                        <p><strong>Registrations:</strong> ${event.registrations}</p>
                        <p><strong>Coordinator:</strong> ${event.coordinatorName}</p>
                        <p><strong>Contact:</strong> ${event.coordinatorMobile}</p>
                        <p><strong>Photos Published:</strong> ${event.photos}</p>
                    </div>
                    <div style="grid-column: span 2;">
                        <h3>Description</h3>
                        <p style="color: var(--text-muted);">${event.description}</p>
                    </div>
                    <div style="grid-column: span 2;">
                        <h3>Rules & Guidelines</h3>
                        <p style="color: var(--text-muted); white-space: pre-line;">${event.rules}</p>
                    </div>
                </div>
            </div>
        `;
    },

    editEventDates(id) {
        const event = this.data.events.find(e => e.id === id);
        if (!event) return;

        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Edit Event Dates</h1>
                    <button class="btn-primary" onclick="CoordinatorPanel.navigate('manage-events')" style="background: var(--text-muted);"><i class="fas fa-arrow-left"></i> Cancel</button>
                </div>
                <div class="card">
                    <p style="margin-bottom: 1.5rem; color: var(--text-muted);">Only registration and event dates can be modified for published events.</p>
                    <form onsubmit="CoordinatorPanel.saveEventDates(event, ${event.id})" style="display: grid; gap: 1.5rem; max-width: 500px;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Registration Deadline</label>
                            <input type="date" id="editDeadline" value="${event.deadline}" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Date</label>
                            <input type="date" id="editDate" value="${event.date}" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <button type="submit" class="btn-primary" style="width: fit-content;">Save Changes</button>
                    </form>
                </div>
            </div>
        `;
    },

    saveEventDates(e, id) {
        e.preventDefault();
        const deadline = document.getElementById('editDeadline').value;
        const date = document.getElementById('editDate').value;
        
        const index = this.data.events.findIndex(ev => ev.id === id);
        if (index !== -1) {
            this.data.events[index].deadline = deadline;
            this.data.events[index].date = date;
            
            // Re-check status based on date if needed (mock logic)
            const today = new Date('2024-03-08');
            this.data.events[index].status = new Date(date) < today ? 'Completed' : 'Active';
            
            alert("Dates updated successfully!");
            this.navigate('manage-events');
        }
    },

    initFormBuilder() {
        // Populate event selection list
        const list = document.getElementById('eventSelectionList');
        if (list) {
            list.innerHTML = this.data.events.filter(ev => ev.status === 'Active').map(ev => `
                <label class="checkbox-container" style="padding: 0.5rem; background: #f1f5f9; border-radius: 8px;">
                    <input type="radio" name="form-event-choice" class="event-choice" value="${ev.name}" checked onchange="CoordinatorPanel.updateFormPreview()"> 
                    <div style="display: flex; flex-direction: column;">
                        <span>${ev.name}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Capacity: ${ev.minParticipants}-${ev.maxParticipants} Members</span>
                    </div>
                </label>
            `).join('');
        }
        this.updateFormPreview();
    },

    updateFormPreview() {
        const preview = document.getElementById('registrationFormPreview');
        if (!preview) return;

        const fields = {
            name: document.getElementById('field-name')?.checked,
            email: document.getElementById('field-email')?.checked,
            college: document.getElementById('field-college')?.checked,
            branch: document.getElementById('field-branch')?.checked,
            year: document.getElementById('field-year')?.checked,
            payment: document.getElementById('field-payment')?.checked
        };

        const selectedEventName = document.querySelector('.event-choice:checked')?.value;
        const event = this.data.events.find(ev => ev.name === selectedEventName);

        if (!event) {
            preview.innerHTML = `<p style="color: red; text-align: center;">Please select an event for the form.</p>`;
            return;
        }

        let html = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.25rem;">Event Registration Form</h4>
                <p style="font-size: 0.9rem; color: var(--primary); font-weight: 600;">${event.name}</p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Team Size: ${event.minParticipants} to ${event.maxParticipants}</p>
            </div>
            <div style="display: grid; gap: 1.5rem;">
        `;

        for (let i = 1; i <= event.maxParticipants; i++) {
            const isRequired = i <= event.minParticipants;
            html += `
                <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 12px; background: ${isRequired ? '#fdf2f8' : '#fff'};">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <h5 style="margin: 0; color: #1f2937;">Student ${i} ${i === 1 ? '(Leader)' : ''}</h5>
                        <span style="font-size: 0.7rem; font-weight: 700; color: ${isRequired ? '#ec4899' : '#64748b'};">
                            ${isRequired ? 'REQUIRED' : 'OPTIONAL'}
                        </span>
                    </div>
                    <div style="display: grid; gap: 0.75rem;">
                        ${fields.name ? `<div><label style="font-size: 0.8rem;">Full Name</label><input type="text" disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;"></div>` : ''}
                        ${fields.email ? `<div><label style="font-size: 0.8rem;">Email Address</label><input type="email" disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;"></div>` : ''}
                        ${fields.college ? `<div><label style="font-size: 0.8rem;">College Name</label><input type="text" disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;"></div>` : ''}
                        ${fields.branch ? `<div><label style="font-size: 0.8rem;">Branch / Dept</label><input type="text" disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;"></div>` : ''}
                        ${fields.year ? `
                            <div>
                                <label style="font-size: 0.8rem;">Year</label>
                                <select disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;">
                                    <option>FY</option>
                                    <option>SY</option>
                                    <option>TY</option>
                                    <option>Final Year</option>
                                </select>
                            </div>` : ''}
                    </div>
                </div>
            `;
        }

        if (fields.payment) {
            html += `
                <div style="margin-top: 1.5rem; padding: 1.5rem; border: 2px dashed #94a3b8; text-align: center; border-radius: 12px; background: #f8fafc;">
                    <i class="fas fa-upload" style="color: #64748b; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.85rem; color: #475569; font-weight: 600;">Upload Payment Screenshot</p>
                    <p style="font-size: 0.7rem; color: var(--text-muted);">Required for registration</p>
                </div>
            `;
        }

        html += `
                <button class="btn-primary" style="margin-top: 1rem; width: 100%; padding: 1rem;" disabled>Submit Registration</button>
            </div>
        `;

        preview.innerHTML = html;
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
    CoordinatorPanel.init();
});
