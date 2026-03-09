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
                            <input id="evTitle" type="text" required placeholder="e.g., National Level Robotics Workshop" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);" oninput="CoordinatorPanel.updateFormPreview()">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Organized By *</label>
                            <input id="evOrganizedBy" type="text" required placeholder="e.g., Computer Science Department" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);" oninput="CoordinatorPanel.updateFormPreview()">
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
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Minimum Participants *</label>
                            <input id="evMinParticipants" type="number" required placeholder="e.g., 2" min="1" max="999999" value="1" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);" oninput="CoordinatorPanel.updateFormPreview()">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Maximum Participants *</label>
                            <input id="evMaxParticipants" type="number" required placeholder="e.g., 5" min="1" max="999999" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);" oninput="CoordinatorPanel.updateFormPreview()">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Fee (Per Person) *</label>
                            <input id="evFee" type="number" required placeholder="e.g., 100" min="0" max="999999" value="0" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);" oninput="CoordinatorPanel.updateFormPreview()">
                            <span style="font-size: 0.75rem; color: var(--text-muted);">Set to 0 if the event is free.</span>
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
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Coordinator Name *</label>
                            <input id="evCoordinatorName" type="text" required placeholder="e.g., Jane Doe" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Contact (Mobile Number) *</label>
                            <input id="evCoordinatorMobile" type="tel" required placeholder="e.g., 9876543210" pattern="[0-9]{10}" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        
                        <!-- Form Builder Section Integrated -->
                        <div style="grid-column: span 2; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                            <h3 style="margin-bottom: 1.5rem;"><i class="fas fa-cog"></i> Registration Form Configuration</h3>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                                <!-- Configuration Column -->
                                <div>
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
                                        </div>
                                    </div>

                                    <div style="margin-bottom: 2rem;">
                                        <h4 style="margin-bottom: 1rem; color: var(--primary);">2. Additional Requirements</h4>
                                        <label class="checkbox-container">
                                            <input type="checkbox" id="field-payment" onchange="CoordinatorPanel.updateFormPreview()"> Require Payment Screenshot
                                        </label>
                                    </div>

                                    <div style="margin-bottom: 2rem;">
                                        <h4 style="margin-bottom: 1rem; color: var(--primary);">3. Choose Payment Method</h4>
                                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Select how students will pay the registration fee.</p>
                                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                            <label class="checkbox-container">
                                                <input type="radio" name="payment-method" id="payment-none" value="none" checked onchange="CoordinatorPanel.updateFormPreview()"> No Payment Required
                                            </label>
                                            <label class="checkbox-container" style="border: 1px solid #16a34a; border-radius: 8px; padding: 0.5rem;">
                                                <input type="radio" name="payment-method" id="payment-qr" value="qr" onchange="CoordinatorPanel.updateFormPreview()">
                                                <span style="display: flex; align-items: center; gap: 0.5rem;">
                                                    <i class="fas fa-qrcode" style="color: #16a34a; font-size: 1.1rem;"></i>
                                                    <strong>QR Code Payment (UPI)</strong>
                                                    <span style="font-size:0.7rem; background:#dcfce7; color:#166534; padding:1px 6px; border-radius:9px;">Recommended</span>
                                                </span>
                                            </label>
                                        </div>
                                        <div id="qr-upload-box" style="display:none; margin-top:1rem; padding:0.75rem; background:#f0fdf4; border-radius:8px; border:1px solid #86efac;">
                                            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.4rem;">Upload Your UPI QR Code Image</label>
                                            <input type="file" id="qr-image-input" accept="image/*" style="width:100%; padding:0.4rem;" onchange="CoordinatorPanel.previewQrImage()">
                                            <div id="qr-preview-thumb" style="margin-top:0.5rem;"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Preview Column -->
                                <div style="background: #f8fafc; border: 2px dashed var(--border-color); border-radius: 12px; padding: 1.5rem;">
                                    <h4 style="margin-bottom: 1.5rem;"><i class="fas fa-eye"></i> Form Preview (Student View)</h4>
                                    <div id="registrationFormPreview" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: var(--shadow-sm);">
                                        <!-- Preview content rendered here -->
                                        <p style="text-align: center; color: var(--text-muted);">Please fill out the event details first to see the preview.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="createEventMsg" style="grid-column: span 2; display: none; padding: 0.75rem; border-radius: 8px; font-weight: 600;"></div>
                        <div style="grid-column: span 2; display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                            <button type="submit" id="evPublishBtn" class="btn-primary">Publish Event</button>
                        </div>
                    </form>
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
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Notifications &amp; Pending Approvals</h1>
                    <button class="btn-primary" onclick="CoordinatorPanel.loadPendingRegistrations()" style="background: var(--secondary);"><i class="fas fa-sync-alt"></i> Refresh</button>
                </div>
                <div id="pendingRegsContainer" class="card">
                    <p style="text-align: center; color: var(--text-muted);">Loading pending registrations...</p>
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
                                <div>
                                    <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Login Username</label>
                                    <div id="profileUsername" style="font-weight: 500;"></div>
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
                                    <div style="grid-column: span 2;">
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Username (For Login)</label>
                                        <input type="text" id="editUsername" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
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
                status: this.calculateEventStatus(e.eventDate, e.registrationDeadline),
                description: e.description,
                rules: "", // Add if available
                deadline: e.registrationDeadline,
                coordinatorName: e.coordinator ? e.coordinator.fullName : "",
                coordinatorMobile: e.coordinator ? e.coordinator.phone : "",
                photos: 0,
                minParticipants: e.minParticipants || 1, // Handle if backend doesn't have it yet
                maxParticipants: e.maxParticipants || 1,
                feePerPerson: e.feePerPerson || 0
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

    calculateEventStatus(eventDateStr, regDeadlineStr) {
        if (!eventDateStr) return 'Active';
        
        const now = new Date();
        const eventDate = new Date(eventDateStr);
        const regDeadline = regDeadlineStr ? new Date(regDeadlineStr) : null;

        if (eventDate < now) {
            return 'Completed';
        }

        if (regDeadline && regDeadline < now) {
            return 'Expired';
        }

        return 'Active';
    },

    formatDateTime(dateStr) {
        if (!dateStr) return "Not Set";
        const date = new Date(dateStr);
        if (isNaN(date)) return "Not Set";
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
                    username: parsed.username || this.user.username,
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
            } else if (this.currentPage === 'notifications') {
                this.loadPendingRegistrations();
            }
        }
    },

    async loadPendingRegistrations() {
        const container = document.getElementById('pendingRegsContainer');
        if (!container) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/coordinator/registrations/pending', { headers: { 'Authorization': `Bearer ${token}` } });
            const regs = await res.json();
            if (!Array.isArray(regs) || regs.length === 0) {
                container.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted);"><i class="fas fa-check-circle" style="font-size: 2rem; color: #10b981; display: block; margin-bottom: 0.5rem;"></i>No pending registrations — all caught up!</div>`;
                return;
            }
            container.innerHTML = regs.map(r => {
                const student = r.student ? (r.student.fullName || r.student.username) : 'Unknown';
                const event = r.event ? r.event.title : 'Unknown Event';
                const upi = r.upiId || 'N/A';
                const regId = r.registrationId || r.id;
                const date = r.registrationDate ? new Date(r.registrationDate).toLocaleString() : 'N/A';
                return `
                    <div style="padding: 1.25rem; border-radius: 12px; border: 1px solid #fde68a; background: #fffbeb; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span style="background: #fef3c7; color: #92400e; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:20px;">PENDING</span>
                                <span style="font-size: 0.75rem; color: var(--text-muted);">${date}</span>
                            </div>
                            <p style="margin: 0 0 0.25rem; font-weight: 700;">${student} &rarr; ${event}</p>
                            <p style="margin: 0; font-size: 0.82rem; color: var(--text-muted);">Reg ID: ${regId} &nbsp;|&nbsp; UPI: <strong>${upi}</strong></p>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-primary" onclick="CoordinatorPanel.coordinatorApproveReg(${r.id})" style="background: #10b981; padding: 0.5rem 1rem; font-size: 0.82rem;"><i class="fas fa-check"></i> Approve</button>
                            <button class="btn-primary" onclick="CoordinatorPanel.coordinatorRejectReg(${r.id})" style="background: #ef4444; padding: 0.5rem 1rem; font-size: 0.82rem;"><i class="fas fa-times"></i> Reject</button>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) {
            container.innerHTML = `<p style="color: red; padding: 1rem;">Failed to load pending registrations.</p>`;
        }
    },

    async coordinatorApproveReg(regId) {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/coordinator/registrations/${regId}/approve`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) { alert('✅ Registration Approved!'); this.loadPendingRegistrations(); }
        else { alert('Failed to approve.'); }
    },

    async coordinatorRejectReg(regId) {
        if (!confirm('Are you sure you want to reject this registration?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/coordinator/registrations/${regId}/reject`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) { alert('❌ Registration Rejected.'); this.loadPendingRegistrations(); }
        else { alert('Failed to reject.'); }
    },

    previewQrImage() {
        const input = document.getElementById('qr-image-input');
        const thumb = document.getElementById('qr-preview-thumb');
        if (!input || !thumb) return;
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                thumb.innerHTML = `<img src="${e.target.result}" style="max-width: 150px; max-height: 150px; border-radius: 8px; border: 2px solid #16a34a;">`;
            };
            reader.readAsDataURL(file);
        } else {
            thumb.innerHTML = '';
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
            coord: document.getElementById('profileCoordName'),
            username: document.getElementById('profileUsername')
        };

        if (elements.college) elements.college.textContent = this.user.collegeName;
        if (elements.location) elements.location.textContent = `${this.user.city}, ${this.user.state}`;
        if (elements.email) elements.email.textContent = this.user.email;
        if (elements.phone) elements.phone.textContent = this.user.phone;
        if (elements.district) elements.district.textContent = this.user.district;
        if (elements.coord) elements.coord.textContent = this.user.name;
        if (elements.username) elements.username.textContent = this.user.username;
    },

    editProfile() {
        document.getElementById('profileDisplayView').style.display = 'none';
        document.getElementById('profileEditView').style.display = 'block';

        // Pre-fill inputs
        document.getElementById('editFullName').value = this.user.name;
        document.getElementById('editUsername').value = this.user.username || '';
        document.getElementById('editPhone').value = this.user.phone;
        document.getElementById('editDistrict').value = this.user.district;
    },

    async saveProfile(e) {
        e.preventDefault();
        
        const updatedData = {
            fullName: document.getElementById('editFullName').value,
            username: document.getElementById('editUsername').value,
            phone: document.getElementById('editPhone').value,
            district: document.getElementById('editDistrict').value
        };

        const oldUsername = this.user.username;

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
                
                // If username was changed, force logout immediately
                if (updatedData.username && updatedData.username.trim() !== '' && updatedData.username !== oldUsername) {
                    alert("Username updated successfully! Please log in again with your new username.");
                    localStorage.clear();
                    window.location.href = '/login.html';
                    return;
                }

                // Update local storage and panel state
                const localUserData = JSON.parse(localStorage.getItem('user'));
                localUserData.name = refreshedUser.fullName;
                localUserData.username = refreshedUser.username;
                localUserData.phone = refreshedUser.phone;
                localUserData.district = refreshedUser.district;
                localStorage.setItem('user', JSON.stringify(localUserData));
                
                this.loadSessionUser();
                this.updateHeaderWithUser();
                this.populateProfileData();
                
                alert("Profile updated successfully!");
            } else {
                const errorText = await response.text();
                alert(errorText || "Failed to update profile. Please try again.");
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
            organizedBy: document.getElementById('evOrganizedBy').value,
            minParticipants: parseInt(document.getElementById('evMinParticipants').value) || 1,
            maxParticipants: parseInt(document.getElementById('evMaxParticipants').value) || 1,
            feePerPerson: parseFloat(document.getElementById('evFee').value) || 0,
            description: document.getElementById('evDescription').value,
            registrationDeadline: document.getElementById('evRegDeadline').value + 'T23:59:59',
            eventDate: document.getElementById('evDate').value + 'T08:00:00',
            venue: document.getElementById('evVenue').value,
            coordinatorName: document.getElementById('evCoordinatorName').value,
            coordinatorMobile: document.getElementById('evCoordinatorMobile').value
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
                    status: this.calculateEventStatus(created.eventDate, created.registrationDeadline),
                    description: created.description,
                    maxParticipants: created.maxParticipants || parseInt(document.getElementById('evMaxParticipants').value) || 1,
                    minParticipants: created.minParticipants || parseInt(document.getElementById('evMinParticipants').value) || 1,
                    feePerPerson: created.feePerPerson || parseFloat(document.getElementById('evFee').value) || 0,
                    coordinatorName: created.coordinatorName || document.getElementById('evCoordinatorName').value,
                    coordinatorMobile: created.coordinatorMobile || document.getElementById('evCoordinatorMobile').value,
                    qrCodePath: null
                });
                this.data.stats.totalEvents++;
                this.data.stats.presentEvents++;

                // Upload QR code if QR payment was selected
                const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
                if (paymentMethod === 'qr') {
                    const qrFile = document.getElementById('qr-image-input')?.files[0];
                    if (qrFile) {
                        const formData = new FormData();
                        formData.append('qr', qrFile);
                        const token = localStorage.getItem('token');
                        fetch(`/api/coordinator/events/${created.id}/qr`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                        }).then(r => r.json()).then(data => {
                            const ev = this.data.events.find(e => e.id === created.id);
                            if (ev && data.qrCodePath) ev.qrCodePath = data.qrCodePath;
                        }).catch(err => console.warn('QR upload failed:', err));
                    }
                }

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
                                <th>Deadline</th>
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
                                    <td>${this.formatDateShort(e.deadline)}</td>
                                    <td>${e.venue}</td>
                                    <td>${e.registrations}</td>
                                    <td><span class="status-badge ${e.status === 'Active' ? 'status-active' : (e.status === 'Completed' ? 'status-completed' : 'status-pending')}">${e.status}</span></td>
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
        if (!dateStr) return "Not Set";
        const d = new Date(dateStr);
        if (isNaN(d)) return "Not Set";
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
                <td>${this.formatDateShort(e.deadline)}</td>
                <td>${e.registrations}</td>
                <td><span class="status-badge ${e.status === 'Active' ? 'status-active' : (e.status === 'Completed' ? 'status-completed' : 'status-pending')}">${e.status}</span></td>
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
                        <span class="status-badge ${event.status === 'Active' ? 'status-active' : (event.status === 'Completed' ? 'status-completed' : 'status-pending')}">${event.status}</span>
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
                            <input type="date" id="editDeadline" value="${event.deadline ? event.deadline.split('T')[0] : ''}" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Date</label>
                            <input type="date" id="editDate" value="${event.date ? event.date.split('T')[0] : ''}" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <button type="submit" class="btn-primary" style="width: fit-content;">Save Changes</button>
                    </form>
                </div>
            </div>
        `;
    },

    async saveEventDates(e, id) {
        e.preventDefault();
        const deadline = document.getElementById('editDeadline').value;
        const date = document.getElementById('editDate').value;

        // Perform validation
        if (!deadline || !date) {
            alert("Both dates are required.");
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/coordinator/events/' + id + '/dates', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    title: "update",
                    category: "update",
                    description: "update",
                    venue: "update",
                    eventDate: date + 'T08:00:00',
                    registrationDeadline: deadline + 'T23:59:59'
                })
            });

            if (response.ok) {
                const updatedEvent = await response.json();
                
                // Update local array with fresh data
                const index = this.data.events.findIndex(ev => ev.id === id);
                if (index !== -1) {
                    this.data.events[index].deadline = updatedEvent.registrationDeadline;
                    this.data.events[index].date = updatedEvent.eventDate;
                    this.data.events[index].status = this.calculateEventStatus(updatedEvent.eventDate, updatedEvent.registrationDeadline);
                }
                
                alert("Dates updated successfully!");
                this.navigate('manage-events');
            } else {
                const err = await response.text();
                alert("Failed to update dates: " + err);
            }
        } catch(error) {
             console.error("Error updating dates:", error);
             alert("Network error.");
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
            payment: document.getElementById('field-payment')?.checked
        };

        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'none';
        const qrUploadBox = document.getElementById('qr-upload-box');
        if (qrUploadBox) qrUploadBox.style.display = (paymentMethod === 'qr') ? 'block' : 'none';

        let eventName = "New Event";
        let minParticipants = 1;
        let maxParticipants = 1;
        let feePerPerson = 0;

        if (this.currentPage === 'create-event') {
            eventName = document.getElementById('evTitle')?.value || "New Event";
            minParticipants = parseInt(document.getElementById('evMinParticipants')?.value) || 1;
            maxParticipants = parseInt(document.getElementById('evMaxParticipants')?.value) || 1;
            feePerPerson = parseFloat(document.getElementById('evFee')?.value) || 0;
        } else {
            const selectedEventName = document.querySelector('.event-choice:checked')?.value;
            const event = this.data.events.find(ev => ev.name === selectedEventName);
            if (!event) {
                preview.innerHTML = `<p style="color: red; text-align: center;">Please select an event for the form.</p>`;
                return;
            }
            eventName = event.name;
            minParticipants = event.minParticipants || 1;
            maxParticipants = event.maxParticipants || 1;
            feePerPerson = event.feePerPerson || 0;
        }

        const feeLabel = feePerPerson > 0
            ? `<span style="display: inline-block; margin-top: 0.4rem; background: #ecfdf5; color: #065f46; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 20px;">&#8377;${feePerPerson} / person</span>`
            : `<span style="display: inline-block; margin-top: 0.4rem; background: #f0fdf4; color: #15803d; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 20px;">Free Event</span>`;

        let html = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.25rem;">Event Registration Form</h4>
                <p style="font-size: 0.9rem; color: var(--primary); font-weight: 600;">${eventName}</p>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Team Size: ${minParticipants} to ${maxParticipants}</p>
                ${feeLabel}
            </div>
            <div style="display: grid; gap: 1.5rem;">
        `;

        if (feePerPerson > 0) {
            html += `
                <div style="padding: 1rem; background: #fefce8; border: 1px solid #fde68a; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-receipt" style="color: #d97706; font-size: 1.2rem;"></i>
                    <div>
                        <p style="margin: 0; font-size: 0.85rem; font-weight: 700; color: #92400e;">Registration Fee: &#8377;${feePerPerson} per person</p>
                        <p style="margin: 0; font-size: 0.72rem; color: #b45309;">Total for ${maxParticipants} member(s): &#8377;${(feePerPerson * maxParticipants).toFixed(0)}</p>
                    </div>
                </div>
            `;
        }

        for (let i = 1; i <= maxParticipants; i++) {
            const isRequired = i <= minParticipants;
            const isLeader = i === 1;
            html += `
                <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 12px; background: ${isRequired ? '#fdf2f8' : '#fff'};">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <h5 style="margin: 0; color: #1f2937;">Student ${i} ${isLeader ? '(Leader)' : ''}</h5>
                        <span style="font-size: 0.7rem; font-weight: 700; color: ${isRequired ? '#ec4899' : '#64748b'};">
                            ${isRequired ? 'REQUIRED' : 'OPTIONAL'}
                        </span>
                    </div>
                    <div style="display: grid; gap: 0.75rem;">
                        <div><label style="font-size: 0.8rem; font-weight: 600; color: #6366f1;">Portal Username *</label><input type="text" disabled placeholder="Must match UniEvent account" style="width: 100%; padding: 0.4rem; border: 1px solid #a5b4fc;"></div>
                        ${fields.name ? `<div><label style="font-size: 0.8rem;">Full Name</label><input type="text" disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;"></div>` : ''}
                        ${fields.email ? `<div><label style="font-size: 0.8rem;">Email Address</label><input type="email" disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;"></div>` : ''}
                        ${fields.college ? `<div><label style="font-size: 0.8rem;">College Name</label><input type="text" disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;"></div>` : ''}
                        ${isLeader && paymentMethod === 'qr' && feePerPerson > 0 ? `<div><label style="font-size: 0.8rem; font-weight: 600; color: #d97706;">UPI Transaction ID *</label><input type="text" disabled placeholder="Enter UPI ID used for payment" style="width: 100%; padding: 0.4rem; border: 1px solid #fbbf24; background: #fefce8;"></div>` : ''}
                    </div>
                </div>
            `;
        }

        if (paymentMethod === 'screenshot' || fields.payment) {
            html += `
                <div style="margin-top: 1.5rem; padding: 1.5rem; border: 2px dashed #94a3b8; text-align: center; border-radius: 12px; background: #f8fafc;">
                    <i class="fas fa-upload" style="color: #64748b; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="font-size: 0.85rem; color: #475569; font-weight: 600;">Upload Payment Screenshot</p>
                    <p style="font-size: 0.7rem; color: var(--text-muted);">Required for registration</p>
                </div>
            `;
        } else if (paymentMethod === 'qr' && feePerPerson > 0) {
            html += `
                <div style="margin-top: 1.5rem; padding: 1.5rem; border: 2px solid #16a34a; border-radius: 12px; background: #f0fdf4; text-align: center;">
                    <p style="font-size: 0.85rem; color: #166534; font-weight: 700; margin-bottom: 0.75rem;">&#128179; Pay &#8377;${feePerPerson} per person via UPI</p>
                    <div style="width: 120px; height: 120px; margin: 0 auto 0.75rem; background: #e2e8f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 2px dashed #16a34a;">
                        <i class="fas fa-qrcode" style="font-size: 3rem; color: #16a34a;"></i>
                    </div>
                    <p style="font-size: 0.75rem; color: #166534;">Scan QR &amp; pay, then enter your UPI Transaction ID above</p>
                </div>
            `;
        }

        html += `
                <button class="btn-primary" style="margin-top: 1rem; width: 100%; padding: 1rem;" disabled>Submit Registration</button>
            </div>
        `;

        preview.innerHTML = html;
    },

    async openStripe(amount) {
        try {
            const token = localStorage.getItem('token');
            const selectedEvent = document.querySelector('.event-choice:checked')?.value || 'Event Registration';

            const res = await fetch('/api/payment/createSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseInt(amount),
                    eventName: selectedEvent,
                    successUrl: window.location.href.split('?')[0] + '?payment=success',
                    cancelUrl:  window.location.href.split('?')[0] + '?payment=cancelled'
                })
            });

            if (!res.ok) {
                const err = await res.text();
                alert('Could not start Stripe checkout. Error: ' + err);
                return;
            }

            const data = await res.json();
            // Redirect to hosted Stripe checkout page
            window.location.href = data.url;
        } catch (err) {
            console.error('Stripe error:', err);
            alert('Payment error: ' + err.message);
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
    CoordinatorPanel.init();
});
