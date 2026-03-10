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
        posts: [],
        eligibleEvents: [],
        stats: {
            totalEvents: 0,
            presentEvents: 0,
            pastEvents: 0,
            totalRegistrations: 0
        }
    },

    selectedDashboardTab: 'registrations', // Default to registrations to show table data

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
                                            <label class="checkbox-container">
                                                <input type="checkbox" id="field-phone" checked onchange="CoordinatorPanel.updateFormPreview()"> Phone Number
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


                        <!-- Event Photos Upload Section -->
                        <div style="grid-column: span 2; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                            <h3 style="margin-bottom: 1rem;"><i class="fas fa-images"></i> Event Photos</h3>
                            <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">Upload up to 10 photos to showcase your event to students (optional).</p>
                            <div style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center; background: #f8fafc; cursor: pointer;" onclick="document.getElementById('evPhotosInput').click()">
                                <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem;"></i>
                                <p style="margin: 0; font-weight: 600;">Click to select photos</p>
                                <p style="margin: 0.25rem 0 0; font-size: 0.8rem; color: var(--text-muted);">JPG, PNG, WEBP — max 10 images</p>
                            </div>
                            <input type="file" id="evPhotosInput" multiple accept="image/*" style="display:none;" onchange="CoordinatorPanel.previewEventPhotos(event)">
                            <div id="evPhotosPreview" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap:0.75rem; margin-top:1rem;"></div>
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
        'manage-events': `
            <div class="animate-slide">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h1>Manage Events</h1>
                    <button class="btn-primary" onclick="CoordinatorPanel.navigate('create-event')"><i class="fas fa-plus"></i> New Event</button>
                </div>
                
                <div class="card" style="margin-bottom: 2rem;">
                    <div style="display: flex; gap: 1rem; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid var(--border-color); flex-wrap: wrap;">
                        <div class="search-box" style="flex: 1; min-width: 250px; margin-bottom: 0;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="eventSearchInput" onkeyup="CoordinatorPanel.filterEventsTable()" placeholder="Search by event title...">
                        </div>
                        <select id="eventCategoryFilter" onchange="CoordinatorPanel.filterEventsTable()" style="padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
                            <option value="all">All Categories</option>
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
                        <select id="eventStatusFilter" onchange="CoordinatorPanel.filterEventsTable()" style="padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                </div>

                <div class="card">
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Date</th>
                                    <th>Deadline</th>
                                    <th>Coordinator</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="eventsTableBody">
                                <!-- Data injected here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        'posts': `
            <div class="animate-slide" style="max-width: 900px; margin: 0 auto;">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <div>
                        <h1>Community Feed</h1>
                        <p style="color: var(--text-muted);">Share event highlights and feedback with the student community.</p>
                    </div>
                    <button class="btn-primary" onclick="CoordinatorPanel.showCreatePostModal()">
                        <i class="fas fa-plus"></i> Create Post
                    </button>
                </div>

                <!-- Filters Section -->
                <div class="card" style="margin-bottom: 2rem; padding: 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0;">
                    <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 1rem; align-items: flex-end;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569;">Filter by Event</label>
                            <select id="postFilterEvent" onchange="CoordinatorPanel.handlePostFilter()" style="width: 100%; padding: 0.6rem; border-radius: 10px; border: 1px solid #cbd5e1;">
                                <option value="">All Events</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569;">Event Date From</label>
                            <input type="date" id="postFilterDateStart" onchange="CoordinatorPanel.handlePostFilter()" style="width: 100%; padding: 0.6rem; border-radius: 10px; border: 1px solid #cbd5e1;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569;">To</label>
                            <input type="date" id="postFilterDateEnd" onchange="CoordinatorPanel.handlePostFilter()" style="width: 100%; padding: 0.6rem; border-radius: 10px; border: 1px solid #cbd5e1;">
                        </div>
                    </div>
                </div>

                <!-- Feed Container -->
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
                <div id="pendingRegsContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
                    <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem; background: #f8fafc; border-radius: 16px; border: 2px dashed #e2e8f0;">
                        Loading pending registrations...
                    </div>
                </div>
            </div>
        `,
        'statistics': `
            <div class="animate-slide" style="max-width: 1000px; margin: 0 auto;">
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <div>
                        <h1>Event Statistics</h1>
                        <p style="color: var(--text-muted);">Analyze your registration numbers across different events and categories.</p>
                    </div>
                </div>

                <!-- Filters Section -->
                <div class="card" style="margin-bottom: 2rem; padding: 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0;">
                    <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 1rem; align-items: flex-end;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569;">Filter by Event</label>
                            <select id="statFilterEvent" onchange="CoordinatorPanel.renderStatistics()" style="width: 100%; padding: 0.6rem; border-radius: 10px; border: 1px solid #cbd5e1;">
                                <option value="all">All Events</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569;">Event Category</label>
                            <select id="statFilterCategory" onchange="CoordinatorPanel.renderStatistics()" style="width: 100%; padding: 0.6rem; border-radius: 10px; border: 1px solid #cbd5e1;">
                                <option value="all">All Categories</option>
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
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569;">Reg Date From</label>
                            <input type="date" id="statFilterDateStart" onchange="CoordinatorPanel.renderStatistics()" style="width: 100%; padding: 0.6rem; border-radius: 10px; border: 1px solid #cbd5e1;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569;">To</label>
                            <input type="date" id="statFilterDateEnd" onchange="CoordinatorPanel.renderStatistics()" style="width: 100%; padding: 0.6rem; border-radius: 10px; border: 1px solid #cbd5e1;">
                        </div>
                    </div>
                </div>

                <div class="stats-grid" style="margin-bottom: 2rem;">
                    <div class="stat-card" style="background: white; border: 1px solid var(--border-color);">
                        <div class="stat-icon" style="background: #eef2ff; color: #6366f1;"><i class="fas fa-users"></i></div>
                        <div class="stat-info"><h3>Filtered Registrations</h3><p id="statFilteredTotal">0</p></div>
                    </div>
                    <div class="stat-card" style="background: white; border: 1px solid var(--border-color);">
                        <div class="stat-icon" style="background: #fff7ed; color: #f59e0b;"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-info"><h3>Events Covered</h3><p id="statFilteredEventsCount">0</p></div>
                    </div>
                </div>

                <div class="card">
                    <h3 style="margin-bottom: 1.5rem; color: #334155;">Registrations by Event</h3>
                    <div id="registrationBarsContainer" style="display: flex; flex-direction: column; gap: 1rem;">
                        <!-- Bars injected here -->
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
                                    <div>
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">New Password (Optional)</label>
                                        <input type="password" id="editPassword" placeholder="Leave blank to keep current" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Confirm New Password</label>
                                        <input type="password" id="editConfirmPassword" placeholder="Repeat new password" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
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
            const [stats, events, regs, posts, eligibleEvents] = await Promise.all([
                fetch('/api/coordinator/stats', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                fetch('/api/coordinator/events', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                fetch('/api/coordinator/registrations', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                fetch('/api/coordinator/posts', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                fetch('/api/coordinator/events/eligible-for-post', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
            ]);

            this.data.stats = stats;
            this.data.posts = posts;
            this.data.eligibleEvents = eligibleEvents;
            this.data.events = events.map(e => ({
                id: e.id,
                name: e.title,
                category: e.category,
                date: e.eventDate,
                venue: e.venue,
                registrations: e.registrationCount || 0,
                status: this.calculateEventStatus(e.eventDate, e.registrationDeadline),
                description: e.description,
                deadline: e.registrationDeadline,
                coordinatorName: e.coordinatorName,
                coordinatorMobile: e.coordinatorMobile,
                organizedBy: e.organizedBy,
                minParticipants: e.minParticipants,
                maxParticipants: e.maxParticipants,
                feePerPerson: e.feePerPerson,
                requiresName: e.requiresName,
                requiresEmail: e.requiresEmail,
                requiresCollege: e.requiresCollege,
                requiresPhone: e.requiresPhone,
                requiresPayment: e.requiresPayment,
                qrCodePath: e.qrCodePath,
                imageUrls: e.imageUrls
            }));

            this.data.registrations = regs.map(r => ({
                id: r.id,
                student: r.studentName,
                email: r.studentEmail,
                phone: r.studentPhone,
                district: r.studentDistrict,
                event: r.event ? r.event.title : "Unknown",
                category: r.event ? r.event.category : "Unknown",
                time: r.registrationDate,
                formattedTime: this.formatDateTime(r.registrationDate)
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

    formatDateShort(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    },

    async viewRegistrationDetails(groupId) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/coordinator/registrations/group/${groupId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to load registration details");
            const data = await res.json();
            
            let modal = document.getElementById('regDetailsModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'regDetailsModal';
                modal.className = 'modal-overlay';
                document.body.appendChild(modal);
            }
            
            let paymentHtml = '';
            if (data.feePerPerson > 0) {
                paymentHtml = `
                    <div style="margin-top: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #334155;">Payment Information</h3>
                        <p style="margin: 0 0 0.5rem 0;"><strong>Transaction ID:</strong> <code style="background: white; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">${data.transactionId || 'N/A'}</code></p>
                        ${data.paymentScreenshot ? `
                            <div style="margin-top: 1rem;">
                                <p style="margin: 0 0 0.5rem 0; color: #64748b; font-size: 0.85rem;">Payment Screenshot:</p>
                                <img src="${data.paymentScreenshot}" alt="Payment QR" style="max-width: 100%; border-radius: 8px; border: 2px solid #e2e8f0; cursor: zoom-in;" onclick="window.open(this.src, '_blank')">
                            </div>
                        ` : '<p style="margin: 0; color: #ef4444; font-size: 0.85rem;">No payment screenshot uploaded.</p>'}
                    </div>
                `;
            }

            modal.innerHTML = `
                <div class="modal-content animate-slide-down" style="max-width: 600px; padding: 0; overflow: hidden; border-radius: 20px;">
                    <div class="modal-header flex-between" style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; background: white;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span style="background: var(--primary-light); color: var(--primary); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-users"></i>
                            </span>
                            <div>
                                <h2 style="font-size: 1.15rem; margin: 0;">Registration Details</h2>
                                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">${data.eventTitle} (Group: ${data.groupId})</p>
                            </div>
                        </div>
                        <button onclick="document.getElementById('regDetailsModal').classList.remove('active')" style="background:#f1f5f9; border:none; width:32px; height:32px; border-radius:50%; font-size:1rem; cursor:pointer; color:#64748b; display:flex; align-items:center; justify-content:center;">&times;</button>
                    </div>
                    
                    <div style="padding: 1.5rem; max-height: 70vh; overflow-y: auto; background: white;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <span style="font-size: 0.9rem; font-weight: 600; color: #334155;">Status:</span>
                            <span style="padding: 0.4rem 1rem; border-radius: 20px; font-weight: 700; font-size: 0.8rem; background: ${data.status === 'APPROVED' ? '#dcfce7' : (data.status === 'DENIED' ? '#fee2e2' : '#fef3c7')}; color: ${data.status === 'APPROVED' ? '#16a34a' : (data.status === 'DENIED' ? '#ef4444' : '#d97706')};">
                                ${data.status}
                            </span>
                        </div>
                        
                        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #334155;">Team Members (${data.members.length})</h3>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            ${data.members.map((m, idx) => `
                                <div style="display: flex; gap: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #fdfdfd; align-items: center;">
                                    <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); color: var(--primary-dark); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem;">
                                        ${idx === 0 ? '<i class="fas fa-crown"></i>' : (m.fullName ? m.fullName.charAt(0).toUpperCase() : '?')}
                                    </div>
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0 0 0.25rem 0; font-size: 0.95rem; color: #0f172a;">${m.fullName || m.username} ${idx === 0 ? '<span style="font-size: 0.75rem; color: var(--primary); font-weight: 600; margin-left: 0.5rem;">(Leader)</span>' : ''}</h4>
                                        <p style="margin: 0; font-size: 0.8rem; color: #64748b;"><i class="fas fa-envelope" style="width: 16px;"></i> ${m.email || 'N/A'}</p>
                                        <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #64748b;"><i class="fas fa-university" style="width: 16px;"></i> ${m.college || 'N/A'}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        ${paymentHtml}
                    </div>

                    <div style="padding: 1.25rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
                        <button class="btn-primary" onclick="document.getElementById('regDetailsModal').classList.remove('active')" style="background: white; color: #64748b; border: 1px solid #cbd5e1;">Close</button>
                    </div>
                </div>
            `;
            
            modal.classList.add('active');
        } catch (error) {
            console.error(error);
            alert("Error loading details. Please check connection.");
        }
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                if (pageId) this.navigate(pageId);
            });
        });
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.href = '/login.html';
            });
        }
        
        const headerLogoutBtn = document.getElementById('headerLogoutBtn');
        if (headerLogoutBtn) {
            headerLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.href = '/login.html';
            });
        }
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
            } else if (this.currentPage === 'statistics') {
                this.renderStatistics();
            } else if (this.currentPage === 'profile') {
                this.populateProfileData();
            } else if (this.currentPage === 'posts') {
                this.renderPosts();
            } else if (this.currentPage === 'notifications') {
                this.loadPendingRegistrations();
            }
        }
    },

    renderStatistics() {
        const container = document.getElementById('registrationBarsContainer');
        if (!container) return;

        // Populate Event Filter Dropdown
        const eventSelect = document.getElementById('statFilterEvent');
        if (eventSelect && eventSelect.options.length === 1) { // Only "All Events" option
            this.data.events.forEach(ev => {
                const opt = document.createElement('option');
                opt.value = ev.name;
                opt.textContent = ev.name;
                eventSelect.appendChild(opt);
            });
        }

        const filterEventName = eventSelect?.value;
        const filterCategory = document.getElementById('statFilterCategory')?.value;
        const filterDateStart = document.getElementById('statFilterDateStart')?.value;
        const filterDateEnd = document.getElementById('statFilterDateEnd')?.value;

        let filtered = this.data.registrations;

        if (filterEventName && filterEventName !== 'all') {
            filtered = filtered.filter(r => r.event === filterEventName);
        }
        if (filterCategory && filterCategory !== 'all') {
            filtered = filtered.filter(r => r.category === filterCategory);
        }
        if (filterDateStart) {
            filtered = filtered.filter(r => r.time && new Date(r.time) >= new Date(filterDateStart));
        }
        if (filterDateEnd) {
            const endDate = new Date(filterDateEnd);
            endDate.setHours(23, 59, 59);
            filtered = filtered.filter(r => r.time && new Date(r.time) <= endDate);
        }

        // Initialize all events with 0 counts to ensure they show up even with no registrations
        const eventCounts = {};
        this.data.events.forEach(ev => {
            eventCounts[ev.name] = 0;
        });

        // Tally registrations per event among the filtered data
        filtered.forEach(r => {
            const evName = r.event || 'Unknown';
            if (eventCounts.hasOwnProperty(evName)) {
                eventCounts[evName]++;
            } else {
                eventCounts[evName] = 1;
            }
        });

        // Update Summary Cards
        document.getElementById('statFilteredTotal').textContent = filtered.length;
        document.getElementById('statFilteredEventsCount').textContent = Object.keys(eventCounts).length;

        // Render Bars
        const entries = Object.entries(eventCounts).sort((a, b) => b[1] - a[1]); // sort descending
        const maxVal = entries.length > 0 ? entries[0][1] : 0;

        if (entries.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No registrations match your filters.</p>`;
            return;
        }

        container.innerHTML = entries.map(([evName, count]) => {
            // max width 100% relative to the maxVal
            const widthPct = Math.max(5, (count / maxVal) * 100); 
            return `
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem; font-size: 0.9rem; font-weight: 600;">
                        <span style="color: #334155;">${evName}</span>
                        <span style="color: var(--primary);">${count}</span>
                    </div>
                    <div style="width: 100%; background: #f1f5f9; height: 16px; border-radius: 8px; overflow: hidden;">
                        <div style="width: ${widthPct}%; height: 100%; background: var(--primary); border-radius: 8px; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
    },

    async loadPendingRegistrations() {
        const container = document.getElementById('pendingRegsContainer');
        if (!container) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/coordinator/registrations/pending', { headers: { 'Authorization': `Bearer ${token}` } });
            const regs = await res.json();
            if (!Array.isArray(regs) || regs.length === 0) {
                container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #f8fafc; border-radius: 16px; border: 2px dashed #e2e8f0; color: var(--text-muted);">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3 style="margin: 0;">No notifications</h3>
                    <p style="margin: 0.5rem 0 0 0;">All caught up!</p>
                </div>`;
                return;
            }
            container.innerHTML = regs.map(r => {
                const studentName = r.studentName || 'Unknown';
                const eventTitle = r.event ? r.event.title : 'Unknown';
                const upi = r.upiId || 'N/A';
                const rDate = r.registrationDate ? new Date(r.registrationDate) : null;
                const date = rDate ? rDate.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'N/A';
                
                let actionHtml = '';
                if (r.status === 'PENDING') {
                    actionHtml = `
                        <div id="actions-${r.groupId}" style="display: flex; gap: 0.75rem; margin-top: 0.25rem;">
                            <button class="btn-primary btn-approve" onclick="CoordinatorPanel.coordinatorApproveReg('${r.groupId}')" style="flex: 1; background: #10b981; padding: 0.6rem;">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn-primary btn-reject" onclick="CoordinatorPanel.coordinatorRejectReg('${r.groupId}')" style="flex: 1; background: #ef4444; padding: 0.6rem;">
                                <i class="fas fa-times"></i> Deny
                            </button>
                        </div>
                    `;
                } else if (r.status === 'APPROVED') {
                    actionHtml = `
                        <div id="actions-${r.groupId}" style="display: flex; gap: 0.75rem; margin-top: 0.25rem;">
                            <button class="btn-primary" disabled style="flex: 1; background: #10b981; padding: 0.6rem; opacity: 0.6; cursor: not-allowed;">
                                <i class="fas fa-check"></i> Approved
                            </button>
                        </div>
                    `;
                } else if (r.status === 'DENIED') {
                    actionHtml = `
                        <div id="actions-${r.groupId}" style="display: flex; gap: 0.75rem; margin-top: 0.25rem;">
                            <button class="btn-primary" disabled style="flex: 1; background: #ef4444; padding: 0.6rem; opacity: 0.6; cursor: not-allowed;">
                                <i class="fas fa-times"></i> Denied
                            </button>
                        </div>
                    `;
                }

                return `
                    <div class="card" id="pending-card-${r.groupId}" style="display: flex; flex-direction: column; gap: 1rem; position: relative; border-left: 4px solid ${r.status === 'APPROVED' ? '#10b981' : (r.status === 'DENIED' ? '#ef4444' : 'var(--primary)')};">
                        <div style="display: flex; gap: 1rem; align-items: flex-start;">
                            <div style="width: 45px; height: 45px; border-radius: 12px; background: var(--primary-light); color: var(--primary-dark); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; flex-shrink: 0;">
                                ${(studentName.charAt(0) || '?').toUpperCase()}
                            </div>
                            <div style="flex: 1;">
                                <h3 style="margin: 0 0 0.25rem 0; font-size: 1.1rem; color: #0f172a;">${studentName}</h3>
                                <p style="margin: 0; font-size: 0.85rem; color: var(--primary); font-weight: 600;">${eventTitle}</p>
                            </div>
                        </div>
                        
                        <div style="background: #f8fafc; border-radius: 8px; padding: 1rem; border: 1px solid #e2e8f0; font-size: 0.85rem; display: grid; gap: 0.5rem;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #64748b;">UPI / Ref ID:</span>
                                <strong style="color: #0f172a; word-break: break-all; max-width: 60%; text-align: right;">${upi}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #64748b;">Registered:</span>
                                <strong style="color: #0f172a;">${date}</strong>
                            </div>
                        </div>

                        <div style="display: flex; gap: 0.75rem; margin-top: auto;">
                            <button class="btn-primary" onclick="CoordinatorPanel.viewRegistrationDetails('${r.groupId}')" style="flex: 1; background: var(--secondary); padding: 0.6rem;">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                        
                        ${actionHtml}
                    </div>
                `;
            }).join('');
        } catch (err) {
            container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: red; padding: 2rem; background: #fef2f2; border-radius: 12px; border: 1px solid #fca5a5;">Failed to load notifications.</div>`;
        }
    },

    async coordinatorApproveReg(groupId) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/coordinator/registrations/${groupId}/approve`, { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (res.ok) { 
                const actionsContainer = document.getElementById(`actions-${groupId}`);
                const cardContainer = document.getElementById(`pending-card-${groupId}`);
                if (actionsContainer) {
                    actionsContainer.innerHTML = `
                        <button class="btn-primary" disabled style="flex: 1; background: #10b981; padding: 0.6rem; opacity: 0.6; cursor: not-allowed;">
                            <i class="fas fa-check"></i> Approved
                        </button>
                    `;
                }
                if (cardContainer) {
                    cardContainer.style.borderLeft = '4px solid #10b981';
                }
                // Also update the local data to reflect in the dashboard if they switch back
                await this.fetchAllData(); 
            } else { 
                alert('Failed to approve.'); 
            }
        } catch (error) {
            console.error('Error approving:', error);
            alert('Network error.');
        }
    },

    async coordinatorRejectReg(groupId) {
        const reason = prompt('Please enter the reason for denial (this will be sent to the student):');
        if (reason === null) return; // User clicked Cancel
        
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/coordinator/registrations/${groupId}/reject`, { 
                method: 'POST', 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: reason })
            });
            if (res.ok) { 
                const actionsContainer = document.getElementById(`actions-${groupId}`);
                const cardContainer = document.getElementById(`pending-card-${groupId}`);
                if (actionsContainer) {
                    actionsContainer.innerHTML = `
                        <button class="btn-primary" disabled style="flex: 1; background: #ef4444; padding: 0.6rem; opacity: 0.6; cursor: not-allowed;">
                            <i class="fas fa-times"></i> Denied
                        </button>
                    `;
                }
                if (cardContainer) {
                    cardContainer.style.borderLeft = '4px solid #ef4444';
                }
                await this.fetchAllData();
            } else { 
                alert('Failed to reject.'); 
            }
        } catch (error) {
            console.error('Error rejecting:', error);
            alert('Network error.');
        }
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

    previewEventPhotos(e) {
        const files = Array.from(e.target.files).slice(0, 10);
        const preview = document.getElementById('evPhotosPreview');
        if (!preview) return;
        preview.innerHTML = '';
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = ev => {
                const div = document.createElement('div');
                div.style.cssText = 'position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1;background:#e2e8f0;';
                div.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
                preview.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    },

    renderPosts() {
        const container = document.getElementById('postsFeedContainer');
        if (!container) return;

        // Populate Event Filter Dropdown if not already done
        const eventSelect = document.getElementById('postFilterEvent');
        if (eventSelect && eventSelect.options.length === 1) { // Only "All Events" option
            this.data.events.forEach(ev => {
                const opt = document.createElement('option');
                opt.value = ev.id;
                opt.textContent = ev.name;
                eventSelect.appendChild(opt);
            });
        }

        const filterEventId = document.getElementById('postFilterEvent')?.value;
        const filterDateStart = document.getElementById('postFilterDateStart')?.value;
        const filterDateEnd = document.getElementById('postFilterDateEnd')?.value;

        let filtered = this.data.posts;

        if (filterEventId) {
            filtered = filtered.filter(p => p.event && p.event.id == filterEventId);
        }
        if (filterDateStart) {
            filtered = filtered.filter(p => p.event && new Date(p.event.eventDate) >= new Date(filterDateStart));
        }
        if (filterDateEnd) {
            const endDate = new Date(filterDateEnd);
            endDate.setHours(23, 59, 59);
            filtered = filtered.filter(p => p.event && new Date(p.event.eventDate) <= endDate);
        }

        if (filtered.length === 0) {
            container.innerHTML = `<div class="card" style="text-align: center; padding: 3rem; color: var(--text-muted); background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 16px;">
                <i class="fas fa-newspaper" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p style="font-weight: 500;">No posts identified for the current filters.</p>
            </div>`;
            return;
        }

        container.innerHTML = filtered.map(p => {
            const photos = p.photo ? p.photo.split(',').filter(s => s.trim() !== '') : [];
            const eventTitle = p.event ? p.event.title : 'Shared Update';
            const initials = (eventTitle || '?').charAt(0).toUpperCase();
            
            return `
                <div class="card post-card" style="padding: 0; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 1.5rem; transition: all 0.3s ease;">
                    <div style="padding: 1.25rem; display: flex; align-items: center; gap: 1rem; background: white;">
                        <div style="width: 45px; height: 45px; border-radius: 12px; background: var(--primary-light); color: var(--primary-dark); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;">
                            ${initials}
                        </div>
                        <div style="flex: 1;">
                            <h3 style="margin: 0; font-size: 1.05rem; color: #0f172a; font-weight: 700;">${eventTitle}</h3>
                            <p style="margin: 0; font-size: 0.75rem; color: #64748b; font-weight: 500;">
                                <i class="far fa-clock"></i> ${this.formatDateTime(p.createdAt)}
                                ${p.event?.eventDate ? ` • <i class="far fa-calendar-check"></i> Event: ${new Date(p.event.eventDate).toLocaleDateString()}` : ''}
                            </p>
                        </div>
                        ${p.feedbackFormLink ? `
                            <a href="${p.feedbackFormLink}" target="_blank" class="btn-primary" style="padding: 0.45rem 1rem; font-size: 0.75rem; background: #16a34a; border-radius: 8px; box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2);">
                                <i class="fas fa-poll"></i> Feedback
                            </a>
                        ` : ''}
                    </div>
                    
                    <div style="padding: 0 1.25rem 1.25rem 1.25rem; background: white;">
                        <p style="margin: 0; font-size: 0.95rem; line-height: 1.7; color: #334155; white-space: pre-wrap;">${p.caption}</p>
                    </div>

                    ${photos.length > 0 ? `
                        <div style="display: grid; grid-template-columns: repeat(${photos.length === 1 ? '1' : '2'}, 1fr); gap: 2px; background: #f1f5f9;">
                            ${photos.slice(0, 4).map((img, idx) => `
                                <div style="position: relative; aspect-ratio: ${photos.length === 1 ? '16/9' : '1'}; cursor: zoom-in;" onclick="window.open('${img}', '_blank')">
                                    <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                                    ${idx === 3 && photos.length > 4 ? `<div style="position: absolute; inset: 0; background: rgba(0,0,0,0.6); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 800; backdrop-filter: blur(2px);">+${photos.length - 4}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div style="padding: 0.85rem 1.25rem; border-top: 1px solid #f1f5f9; display: flex; gap: 1.5rem; background: #fdfdfd;">
                        <span class="post-action" style="font-size: 0.85rem; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600;"><i class="far fa-heart"></i> Like</span>
                        <span class="post-action" style="font-size: 0.85rem; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600;"><i class="far fa-comment"></i> Comment</span>
                        <span class="post-action" style="font-size: 0.85rem; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; margin-left: auto;"><i class="fas fa-share-alt"></i> Share</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    handlePostFilter() {
        this.renderPosts();
    },

    showCreatePostModal() {
        let modal = document.getElementById('postCreateModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'postCreateModal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        const eligibleEvents = this.data.eligibleEvents || [];

        modal.innerHTML = `
            <div class="modal-content animate-slide-up" style="max-width: 600px; padding: 0; overflow: hidden; border-radius: 20px;">
                <div class="modal-header flex-between" style="padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; background: white;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="background: var(--primary-light); color: var(--primary); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-edit"></i>
                        </span>
                        <div>
                            <h2 style="font-size: 1.15rem; margin: 0;">Create Post</h2>
                            <p style="margin: 0; font-size: 0.75rem; color: #64748b;">Share your event highlights</p>
                        </div>
                    </div>
                    <button onclick="document.getElementById('postCreateModal').classList.remove('active')" style="background:#f1f5f9; border:none; width:32px; height:32px; border-radius:50%; font-size:1rem; cursor:pointer; color:#64748b; display:flex; align-items:center; justify-content:center;">&times;</button>
                </div>
                
                <div style="padding: 1.5rem; max-height: 75vh; overflow-y: auto; background: white;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.6rem; font-size: 0.9rem; font-weight: 700; color: #334155;">1. Choose Event *</label>
                        <select id="postNewEventId" style="width: 100%; padding: 0.8rem; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 0.95rem; outline: none; transition: border-color 0.2s;">
                            <option value="">Select a past event...</option>
                            ${eligibleEvents.map(e => `<option value="${e.id}">${e.title} (${new Date(e.eventDate).toLocaleDateString()})</option>`).join('')}
                        </select>
                        <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem;"><i class="fas fa-info-circle"></i> Only past events without existing posts are eligible.</p>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.6rem; font-size: 0.9rem; font-weight: 700; color: #334155;">2. What happened? *</label>
                        <textarea id="postNewCaption" placeholder="Write about the winners, the crowd, and the energy..." style="width: 100%; padding: 1rem; border-radius: 12px; border: 2px solid #e2e8f0; min-height: 140px; font-family: inherit; font-size: 1rem; resize: vertical; outline: none;"></textarea>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.6rem; font-size: 0.9rem; font-weight: 700; color: #334155;">3. Feedback Form Link (Optional)</label>
                        <div style="position: relative;">
                            <i class="fas fa-link" style="position: absolute; left: 1rem; top: 1rem; color: #94a3b8;"></i>
                            <input type="url" id="postNewFeedback" placeholder="https://forms.gle/your-form-link" style="width: 100%; padding: 0.8rem 0.8rem 0.8rem 2.5rem; border-radius: 12px; border: 2px solid #e2e8f0; outline: none;">
                        </div>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.6rem; font-size: 0.9rem; font-weight: 700; color: #334155;">4. Event Photos (Max 10)</label>
                        <div style="border: 2px dashed #cbd5e1; border-radius: 14px; padding: 2.5rem; text-align: center; background: #f8fafc; cursor: pointer; transition: all 0.2s;" onclick="document.getElementById('postNewPhotos').click()" onmouseover="this.style.borderColor='var(--primary)';this.style.background='#f0f9ff';" onmouseout="this.style.borderColor='#cbd5e1';this.style.background='#f8fafc';">
                            <i class="fas fa-images" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 0.75rem;"></i>
                            <p style="margin: 0; font-weight: 700; color: #475569;">Add Captivating Photos</p>
                            <p id="photoCountLabel" style="margin: 0.4rem 0 0; font-size: 0.8rem; color: #64748b;">Visuals help tell your story (Max 10 images)</p>
                        </div>
                        <input type="file" id="postNewPhotos" multiple accept="image/*" style="display:none;" onchange="CoordinatorPanel.previewPostPhotos(event)">
                        <div id="postNewPhotosPreview" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap:0.75rem; margin-top:1.25rem;"></div>
                    </div>
                </div>

                <div style="padding: 1.25rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="btn-primary" style="background: white; color: #475569; border: 1px solid #cbd5e1; box-shadow: none;" onclick="document.getElementById('postCreateModal').classList.remove('active')">Discard</button>
                    <button id="postNewSubmitBtn" class="btn-primary" onclick="CoordinatorPanel.submitPost()" style="padding: 0.8rem 2.5rem; border-radius: 12px; font-weight: 700;">Publish Post</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    },

    previewPostPhotos(e) {
        const files = Array.from(e.target.files).slice(0, 10);
        const preview = document.getElementById('postNewPhotosPreview');
        const label = document.getElementById('photoCountLabel');
        if (!preview) return;
        preview.innerHTML = '';
        if (label) label.innerHTML = `<span style="color:var(--primary); font-weight:700;">${files.length} photo(s) selected</span> (Max 10)`;
        
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = ev => {
                const div = document.createElement('div');
                div.style.cssText = 'position:relative;border-radius:10px;overflow:hidden;aspect-ratio:1;border:2px solid #f1f5f9;box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);';
                div.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
                preview.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    },

    async submitPost() {
        const eventId = document.getElementById('postNewEventId')?.value;
        const caption = document.getElementById('postNewCaption')?.value?.trim();
        const feedback = document.getElementById('postNewFeedback')?.value?.trim();
        const photoInput = document.getElementById('postNewPhotos');
        const btn = document.getElementById('postNewSubmitBtn');

        if (!eventId) return alert('Please select an event for the post.');
        if (!caption) return alert('Please provide a description.');
        if (!photoInput || photoInput.files.length === 0) return alert('Please add at least one photo.');

        const formData = new FormData();
        formData.append('caption', caption);
        if (feedback) formData.append('feedbackFormLink', feedback);
        Array.from(photoInput.files).slice(0, 10).forEach(file => formData.append('photos', file));

        if (btn) { btn.disabled = true; btn.textContent = 'Publishing...'; }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/coordinator/events/${eventId}/afterpost`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                alert('Success! Your community post has been published.');
                document.getElementById('postCreateModal').classList.remove('active');
                await this.fetchAllData(); 
                this.renderPosts();
            } else {
                const err = await response.text();
                alert('Error: ' + err);
            }
        } catch (error) {
            console.error('Error submitting post:', error);
            alert('A network error occurred. Please check your connection.');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Publish Post'; }
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
        
        const password = document.getElementById('editPassword').value;
        const confirmPassword = document.getElementById('editConfirmPassword').value;

        if (password && password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const updatedData = {
            fullName: document.getElementById('editFullName').value,
            username: document.getElementById('editUsername').value,
            phone: document.getElementById('editPhone').value,
            district: document.getElementById('editDistrict').value
        };

        if (password) {
            updatedData.password = password;
        }

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
            registrationDeadline: document.getElementById('evRegDeadline').value ? document.getElementById('evRegDeadline').value + 'T23:59:59' : null,
            eventDate: document.getElementById('evDate').value ? document.getElementById('evDate').value + ':00' : null,
            venue: document.getElementById('evVenue').value,
            coordinatorName: document.getElementById('evCoordinatorName').value,
            coordinatorMobile: document.getElementById('evCoordinatorMobile').value,
            requiresName: document.getElementById('field-name')?.checked ?? true,
            requiresEmail: document.getElementById('field-email')?.checked ?? true,
            requiresCollege: document.getElementById('field-college')?.checked ?? true,
            requiresPhone: document.getElementById('field-phone')?.checked ?? true,
            requiresPayment: (parseFloat(document.getElementById('evFee').value) > 0) || (document.getElementById('field-payment')?.checked ?? false)
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
                    requiresName: created.requiresName,
                    requiresEmail: created.requiresEmail,
                    requiresCollege: created.requiresCollege,
                    requiresPayment: created.requiresPayment,
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

                // Upload event photos if selected
                const photoInput = document.getElementById('evPhotosInput');
                if (photoInput && photoInput.files.length > 0) {
                    const photoData = new FormData();
                    Array.from(photoInput.files).slice(0, 10).forEach(f => photoData.append('photos', f));
                    const tok = localStorage.getItem('token');
                    fetch(`/api/coordinator/events/${created.id}/photos`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${tok}` },
                        body: photoData
                    }).then(r => r.json()).then(data => {
                        console.log('Photos uploaded:', data.uploadedFiles?.length || 0, 'files');
                    }).catch(err => console.warn('Photo upload failed:', err));
                }

                if (msg) {
                    msg.style.display = 'block';
                    msg.style.background = '#ecfdf5';
                    msg.style.color = '#10b981';
                    msg.textContent = '✅ Event published successfully!';
                }
                document.getElementById('createEventForm').reset();
                document.getElementById('evPhotosPreview').innerHTML = '';

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

        // Highlight selected card
        document.querySelectorAll('.stat-card').forEach(card => card.style.borderColor = 'var(--border-color)');
        const activeCard = document.getElementById(`stat-${this.selectedDashboardTab}`);
        if (activeCard) activeCard.style.borderColor = 'var(--primary)';

        let html = '';
        const today = new Date(); // Use actual current date

        if (this.selectedDashboardTab === 'registrations') {
            const districts = [...new Set(this.data.registrations.map(r => r.district).filter(Boolean))];
            const categories = ["Technical", "Cultural", "Sports", "Workshop", "Hackathon", "Project Competition", "Coding Competition", "Electrical related", "Civil related", "Idea Pitching", "Business Competition", "Debate Competition", "Group Discussion", "Seminar/Webinar", "Others"];

            html = `
                <div class="card-header" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
                    <div class="flex-between" style="width: 100%;">
                        <h2>Recent Registrations</h2>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-primary" onclick="CoordinatorPanel.exportRegistrations('excel')" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; background: #10b981;">
                                <i class="fas fa-file-excel"></i> Export Excel
                            </button>
                            <button class="btn-primary" onclick="CoordinatorPanel.exportRegistrations('pdf')" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; background: #ef4444;">
                                <i class="fas fa-file-pdf"></i> Export PDF
                            </button>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; width: 100%; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid var(--border-color); align-items: center;">
                        <div class="search-box" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="regSearchInput" onkeyup="CoordinatorPanel.handleRegSearch()" placeholder="Search leader, email, phone...">
                        </div>
                        
                        <select id="regCategoryFilter" onchange="CoordinatorPanel.handleRegSearch()" style="padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.85rem;">
                            <option value="all">All Categories</option>
                            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>

                        <select id="regDistrictFilter" onchange="CoordinatorPanel.handleRegSearch()" style="padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.85rem;">
                            <option value="all">All Districts</option>
                            ${districts.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>

                        <div style="display: flex; align-items: center; gap: 0.5rem; background: white; padding: 5px 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                            <i class="fas fa-calendar-alt" style="color: var(--text-muted); font-size: 0.8rem;"></i>
                            <input type="date" id="regDateStart" onchange="CoordinatorPanel.handleRegSearch()" style="border: none; font-size: 0.8rem; outline: none;">
                            <span style="font-size: 0.75rem; color: #94a3b8;">to</span>
                            <input type="date" id="regDateEnd" onchange="CoordinatorPanel.handleRegSearch()" style="border: none; font-size: 0.8rem; outline: none;">
                        </div>
                    </div>
                </div>
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Leader Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Event</th>
                                <th>Reg. Date/Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="registrationsTableBody">
                            ${this.getFilteredRegistrationsRows()}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (this.selectedDashboardTab === 'past') {
            const categories = ["Technical", "Cultural", "Sports", "Workshop", "Hackathon", "Project Competition", "Coding Competition", "Electrical related", "Civil related", "Idea Pitching", "Business Competition", "Debate Competition", "Group Discussion", "Seminar/Webinar", "Others"];

            html = `
                <div class="card-header" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
                    <div class="flex-between" style="width: 100%;">
                        <h2>Past Events History</h2>
                    </div>
                    
                    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; width: 100%; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid var(--border-color); align-items: center;">
                        <div class="search-box" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="pastEventSearchInput" onkeyup="CoordinatorPanel.handlePastEventSearch()" placeholder="Search event name...">
                        </div>
                        
                        <select id="pastEventCategoryFilter" onchange="CoordinatorPanel.handlePastEventSearch()" style="padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.85rem;">
                            <option value="all">All Categories</option>
                            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>

                        <div style="display: flex; align-items: center; gap: 0.5rem; background: white; padding: 5px 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                            <i class="fas fa-calendar-alt" style="color: var(--text-muted); font-size: 0.8rem;"></i>
                            <input type="date" id="pastEventDateStart" onchange="CoordinatorPanel.handlePastEventSearch()" style="border: none; font-size: 0.8rem; outline: none;">
                            <span style="font-size: 0.75rem; color: #94a3b8;">to</span>
                            <input type="date" id="pastEventDateEnd" onchange="CoordinatorPanel.handlePastEventSearch()" style="border: none; font-size: 0.8rem; outline: none;">
                        </div>
                    </div>
                </div>
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Deadline</th>
                                <th>Venue</th>
                                <th>Coordinator Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="pastEventsTableBody">
                            ${this.getFilteredPastEventsRows()}
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
            }

            html = `
                <div class="card-header" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
                    <div class="flex-between" style="width: 100%;">
                        <h2>${title}</h2>
                    </div>
                    
                    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; width: 100%; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid var(--border-color); align-items: center;">
                        <div class="search-box" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="dashEventSearchInput" onkeyup="CoordinatorPanel.handleDashEventSearch()" placeholder="Search event name...">
                        </div>
                        
                        <select id="dashEventCategoryFilter" onchange="CoordinatorPanel.handleDashEventSearch()" style="padding: 0.5rem; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.85rem;">
                            <option value="all">All Categories</option>
                            <option value="Technical">Technical</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Others">Others</option>
                        </select>

                        <div style="display: flex; align-items: center; gap: 0.5rem; background: white; padding: 5px 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                            <i class="fas fa-calendar-alt" style="color: var(--text-muted); font-size: 0.8rem;"></i>
                            <input type="date" id="dashEventDateStart" onchange="CoordinatorPanel.handleDashEventSearch()" style="border: none; font-size: 0.8rem; outline: none;">
                            <span style="font-size: 0.75rem; color: #94a3b8;">to</span>
                            <input type="date" id="dashEventDateEnd" onchange="CoordinatorPanel.handleDashEventSearch()" style="border: none; font-size: 0.8rem; outline: none;">
                        </div>
                    </div>
                </div>
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Deadline</th>
                                <th>Venue</th>
                                <th>Coordinator Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="dashEventsTableBody">
                            ${this.getFilteredDashEventsRows()}
                        </tbody>
                    </table>
                </div>
            `;
        }

        container.innerHTML = html;
    },

    handleRegSearch() {
        const query = document.getElementById('regSearchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('regCategoryFilter')?.value || 'all';
        const district = document.getElementById('regDistrictFilter')?.value || 'all';
        const dateStart = document.getElementById('regDateStart')?.value || '';
        const dateEnd = document.getElementById('regDateEnd')?.value || '';
        
        const tbody = document.getElementById('registrationsTableBody');
        if (tbody) {
            tbody.innerHTML = this.getFilteredRegistrationsRows(query, category, district, dateStart, dateEnd);
        }
    },

    handlePastEventSearch() {
        const query = document.getElementById('pastEventSearchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('pastEventCategoryFilter')?.value || 'all';
        const dateStart = document.getElementById('pastEventDateStart')?.value || '';
        const dateEnd = document.getElementById('pastEventDateEnd')?.value || '';

        const tbody = document.getElementById('pastEventsTableBody');
        if (tbody) {
            tbody.innerHTML = this.getFilteredPastEventsRows(query, category, dateStart, dateEnd);
        }
    },

    getFilteredPastEventsRows(query = '', category = 'all', dateStart = '', dateEnd = '') {
        const today = new Date(); // Use actual current date
        let rows = this.data.events.filter(e => new Date(e.date) < today);

        if (category !== 'all') {
            rows = rows.filter(e => e.category === category);
        }

        if (dateStart || dateEnd) {
            const start = dateStart ? new Date(dateStart).setHours(0,0,0,0) : null;
            const end = dateEnd ? new Date(dateEnd).setHours(23,59,59,999) : null;
            
            rows = rows.filter(e => {
                const evDate = new Date(e.date).getTime();
                if (start && evDate < start) return false;
                if (end && evDate > end) return false;
                return true;
            });
        }

        if (query) {
            rows = rows.filter(e => e.name.toLowerCase().includes(query));
        }

        if (rows.length === 0) {
            return `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matching past events found.</td></tr>`;
        }

        return rows.map(e => `
            <tr>
                <td><strong>${e.name}</strong></td>
                <td>${this.formatDateShort(e.date)}</td>
                <td>${this.formatDateShort(e.deadline)}</td>
                <td>${e.venue}</td>
                <td>${e.coordinatorName || 'N/A'}</td>
                <td>
                    <button class="btn-primary" onclick="CoordinatorPanel.showEventDetailModal(${e.id})" style="padding: 0.4rem 0.8rem; background: var(--primary); font-size: 0.85rem;">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    },

    handleDashEventSearch() {
        const query = document.getElementById('dashEventSearchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('dashEventCategoryFilter')?.value || 'all';
        const dateStart = document.getElementById('dashEventDateStart')?.value || '';
        const dateEnd = document.getElementById('dashEventDateEnd')?.value || '';

        const tbody = document.getElementById('dashEventsTableBody');
        if (tbody) {
            tbody.innerHTML = this.getFilteredDashEventsRows(query, category, dateStart, dateEnd);
        }
    },

    getFilteredDashEventsRows(query = '', category = 'all', dateStart = '', dateEnd = '') {
        const today = new Date(); // Use actual current date
        let rows = this.data.events;

        if (this.selectedDashboardTab === 'present') {
            rows = rows.filter(e => new Date(e.date) >= today);
        }

        if (category !== 'all') {
            rows = rows.filter(e => e.category === category || e.category.includes(category));
        }

        if (dateStart || dateEnd) {
            const start = dateStart ? new Date(dateStart).setHours(0,0,0,0) : null;
            const end = dateEnd ? new Date(dateEnd).setHours(23,59,59,999) : null;
            
            rows = rows.filter(e => {
                const evDate = new Date(e.date).getTime();
                if (start && evDate < start) return false;
                if (end && evDate > end) return false;
                return true;
            });
        }

        if (query) {
            rows = rows.filter(e => e.name.toLowerCase().includes(query));
        }

        if (rows.length === 0) {
            return `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matching events found.</td></tr>`;
        }

        return rows.map(e => `
            <tr>
                <td><strong>${e.name}</strong></td>
                <td>${this.formatDateShort(e.date)}</td>
                <td>${this.formatDateShort(e.deadline)}</td>
                <td>${e.venue}</td>
                <td>${e.coordinatorName || 'N/A'}</td>
                <td>
                    <button class="btn-primary" onclick="CoordinatorPanel.showEventDetailModal(${e.id})" style="padding: 0.4rem 0.8rem; background: var(--primary); font-size: 0.85rem;">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    },

    getFilteredRegistrationsRows(query = '', category = 'all', district = 'all', dateStart = '', dateEnd = '') {
        let rows = this.data.registrations;
        
        // Filter by category
        if (category !== 'all') {
            rows = rows.filter(r => r.category === category);
        }
        
        // Filter by district
        if (district !== 'all') {
            rows = rows.filter(r => r.district === district);
        }

        // Filter by date range
        if (dateStart || dateEnd) {
            rows = rows.filter(r => {
                if (!r.time) return false;
                const regDate = new Date(r.time).setHours(0,0,0,0);
                const start = dateStart ? new Date(dateStart).setHours(0,0,0,0) : null;
                const end = dateEnd ? new Date(dateEnd).setHours(0,0,0,0) : null;
                
                if (start && regDate < start) return false;
                if (end && regDate > end) return false;
                return true;
            });
        }
        
        if (query) {
            rows = rows.filter(r => 
                (r.student || '').toLowerCase().includes(query) || 
                (r.email || '').toLowerCase().includes(query) ||
                (r.phone || '').toLowerCase().includes(query)
            );
        }

        if (rows.length === 0) {
            return `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matching registrations found.</td></tr>`;
        }

        return rows.map(r => `
            <tr>
                <td><strong>${r.student}</strong></td>
                <td>${r.email || 'N/A'}</td>
                <td>${r.phone || 'N/A'}</td>
                <td><span class="district-badge" style="background: var(--primary-light); color: var(--primary-dark);">${r.event}</span></td>
                <td>${r.formattedTime}</td>
                <td>
                    <button class="btn-primary" onclick="CoordinatorPanel.viewRegistrationDetails('${r.id}')" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; background: var(--secondary);">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    },

    async exportRegistrations(format) {
        const tbody = document.getElementById('registrationsTableBody');
        const rows = tbody ? tbody.querySelectorAll('tr') : [];
        if (rows.length === 0 || (rows.length === 1 && rows[0].innerText.includes('No matching registrations'))) {
            alert('No registrations to export based on current filters.');
            return;
        }

        const query = document.getElementById('regSearchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('regCategoryFilter')?.value || 'all';
        const district = document.getElementById('regDistrictFilter')?.value || 'all';
        const dateStart = document.getElementById('regDateStart')?.value || '';
        const dateEnd = document.getElementById('regDateEnd')?.value || '';

        let filteredRegs = this.data.registrations;
        if (category !== 'all') filteredRegs = filteredRegs.filter(r => r.category === category);
        if (district !== 'all') filteredRegs = filteredRegs.filter(r => r.district === district);
        if (dateStart || dateEnd) {
            filteredRegs = filteredRegs.filter(r => {
                if (!r.time) return false;
                const regDate = new Date(r.time).setHours(0,0,0,0);
                const start = dateStart ? new Date(dateStart).setHours(0,0,0,0) : null;
                const end = dateEnd ? new Date(dateEnd).setHours(23,59,59,999) : null;
                if (start && regDate < start) return false;
                if (end && regDate > end) return false;
                return true;
            });
        }
        if (query) {
            filteredRegs = filteredRegs.filter(r => 
                (r.student || '').toLowerCase().includes(query) || 
                (r.email || '').toLowerCase().includes(query) ||
                (r.phone || '').toLowerCase().includes(query)
            );
        }

        if (filteredRegs.length === 0) {
            alert('No registrations to export.');
            return;
        }

        const token = localStorage.getItem('token');
        let fullGroupData = [];
        
        try {
            const groupPromises = filteredRegs.map(r => 
                fetch(`/api/coordinator/registrations/group/${r.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.ok ? res.json() : null)
            );
            
            const results = await Promise.all(groupPromises);
            fullGroupData = results.filter(g => g !== null);
            
            fullGroupData.sort((a, b) => {
                if(a.groupId < b.groupId) return -1;
                if(a.groupId > b.groupId) return 1;
                return 0;
            });

        } catch(err) {
            console.error("Export fetch error:", err);
            alert("Error preparing export data.");
            return;
        }

        if (format === 'excel') {
            this.downloadExcel(fullGroupData);
        } else if (format === 'pdf') {
            this.downloadPDF(fullGroupData);
        }
    },

    downloadExcel(groups) {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Group ID,Event,Registration Status,Total Amount,Leader Name,Leader College,Leader Email,Leader Phone,Member 2 Name,Member 2 College,Member 2 Email,Member 2 Phone,Member 3 Name,Member 3 College,Member 3 Email,Member 3 Phone,Member 4 Name,Member 4 College,Member 4 Email,Member 4 Phone,Member 5 Name,Member 5 College,Member 5 Email,Member 5 Phone\n";
        
        groups.forEach(g => {
            const members = g.members || [];
            const totalMoney = (g.feePerPerson || 0) * members.length;

            let row = [
                g.groupId,
                `"${g.eventTitle}"`,
                g.status,
                totalMoney
            ];
            
            // Allow up to 5 members (or pad empty if fewer)
            for(let i = 0; i < 5; i++) {
                if (members[i]) {
                    row.push(`"${members[i].fullName || members[i].username || ''}"`);
                    row.push(`"${members[i].college || ''}"`);
                    row.push(`"${members[i].email || ''}"`);
                    row.push(`"${members[i].phone || ''}"`);
                } else {
                    row.push('""', '""', '""', '""');
                }
            }

            csvContent += row.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Registrations_Export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    downloadPDF(groups) {
        const popWindow = window.open('', '_blank', 'width=1000,height=700');
        if (!popWindow) {
            alert("Please allow pop-ups to print PDF.");
            return;
        }

        let html = `
            <html>
            <head>
                <title>Registrations Export</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; font-size: 11px; }
                    h1 { color: #333; text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: top; }
                    th { background-color: #f2f2f2; color: #333; font-weight: bold; }
                    tr:nth-child(even) { background-color: #fafafa; }
                    .member-block { margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px dashed #ccc; }
                    .member-block:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                </style>
            </head>
            <body>
                <h1>Event Registrations</h1>
                <table>
                    <thead>
                        <tr>
                            <th width="80">Group ID</th>
                            <th width="120">Event</th>
                            <th width="70">Status</th>
                            <th width="70">Amount</th>
                            <th>Team Members (Details)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        groups.forEach(g => {
            const members = g.members || [];
            const totalMoney = (g.feePerPerson || 0) * members.length;
            
            let membersHtml = members.map((m, idx) => {
                const name = m.fullName || m.username || 'N/A';
                const role = idx === 0 ? '(Leader)' : '';
                return `
                    <div class="member-block">
                        <strong>${name} ${role}</strong><br>
                        College: ${m.college || 'N/A'}<br>
                        Email: ${m.email || 'N/A'} | Phone: ${m.phone || 'N/A'}
                    </div>
                `;
            }).join('');

            html += `
                <tr>
                    <td>${g.groupId}</td>
                    <td>${g.eventTitle}</td>
                    <td>${g.status}</td>
                    <td>Rs ${totalMoney}</td>
                    <td>${membersHtml || '-'}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;

        popWindow.document.write(html);
        popWindow.document.close();
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
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matching events found.</td></tr>`;
            return;
        }

        tbody.innerHTML = events.map(e => `
            <tr>
                <td><strong>${e.name}</strong></td>
                <td>${this.formatDateShort(e.date)}</td>
                <td>${this.formatDateShort(e.deadline)}</td>
                <td>${e.coordinatorName || 'N/A'}</td>
                <td>
                    <button class="btn-primary" onclick="CoordinatorPanel.showEventDetailModal(${e.id})" style="padding: 0.4rem 0.8rem; background: var(--primary); font-size: 0.85rem;">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    },

    showEventDetailModal(id) {
        const event = this.data.events.find(e => e.id === id);
        if (!event) return;

        let modal = document.getElementById('eventDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'eventDetailModal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                    <h2>Event Details: ${event.name}</h2>
                    <button onclick="document.getElementById('eventDetailModal').classList.remove('active')" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
                </div>
                
                <div id="eventModalBody">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;" id="eventViewContainer">
                        <div>
                            <p style="margin-bottom: 0.5rem;"><strong>Registration Deadline:</strong> <span>${this.formatDateTime(event.deadline)}</span></p>
                            <p style="margin-bottom: 0.5rem;"><strong>Event Date:</strong> <span>${this.formatDateTime(event.date)}</span></p>
                            <p style="margin-bottom: 0.5rem;"><strong>Coordinator Name:</strong> <span>${event.coordinatorName || 'N/A'}</span></p>
                            <p style="margin-bottom: 0.5rem;"><strong>Coordinator Contact:</strong> <span>${event.coordinatorMobile || 'N/A'}</span></p>
                        </div>
                        <div>
                            <p><strong>Category:</strong> ${event.category}</p>
                            <p><strong>Venue:</strong> ${event.venue}</p>
                            <p><strong>Organized By:</strong> ${event.organizedBy || 'N/A'}</p>
                        </div>
                        <div style="grid-column: span 2;">
                            <p><strong>Description:</strong></p>
                            <p style="color: var(--text-muted); padding: 1rem; background: #f8fafc; border-radius: 8px;">${event.description || 'No description provided.'}</p>
                        </div>
                        <div style="grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                            <div>
                                <p style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">Team Size</p>
                                <p><strong>Min:</strong> ${event.minParticipants} <strong>Max:</strong> ${event.maxParticipants}</p>
                            </div>
                            <div>
                                <p style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">Registration Fee</p>
                                <p><strong>${event.feePerPerson > 0 ? 'Rs ' + event.feePerPerson + ' / Person' : 'Free'}</strong></p>
                            </div>
                            <div style="grid-column: span 2;">
                                <p style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">Requirements</p>
                                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                    ${event.requiresName ? `<span style="background: var(--primary-light); color: var(--primary-dark); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-check"></i> Name</span>` : ''}
                                    ${event.requiresEmail ? `<span style="background: var(--primary-light); color: var(--primary-dark); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-check"></i> Email</span>` : ''}
                                    ${event.requiresPhone ? `<span style="background: var(--primary-light); color: var(--primary-dark); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-check"></i> Phone</span>` : ''}
                                    ${event.requiresCollege ? `<span style="background: var(--primary-light); color: var(--primary-dark); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-check"></i> College</span>` : ''}
                                    ${event.requiresPayment ? `<span style="background: var(--primary-light); color: var(--primary-dark); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-check"></i> Payment</span>` : ''}
                                </div>
                            </div>
                        </div>
                        ${event.qrCodePath ? `
                        <div style="grid-column: span 2;">
                            <p style="margin-bottom: 0.5rem;"><strong>Payment QR Code:</strong></p>
                            <img src="${event.qrCodePath}" style="max-height: 200px; border-radius: 8px; border: 1px solid var(--border-color);">
                        </div>` : ''}
                        ${event.imageUrls && event.imageUrls.length > 0 ? `
                        <div style="grid-column: span 2;">
                            <p style="margin-bottom: 0.5rem;"><strong>Event Photos:</strong></p>
                            <div style="display: flex; flex-wrap: wrap; gap: 1rem; padding-bottom: 0.5rem;">
                                ${event.imageUrls.map(url => `<a href="${url}" target="_blank"><img src="${url}" style="height: 120px; width: auto; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-color); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"></a>`).join('')}
                            </div>
                        </div>` : ''}
                        <div style="grid-column: span 2; display: flex; justify-content: flex-end; margin-top: 1rem;">
                            ${event.status === 'Active' ? `
                                <button class="btn-primary" onclick="CoordinatorPanel.toggleEventEditMode(${event.id}, true)"><i class="fas fa-edit"></i> Edit Details</button>
                            ` : `
                                <span style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;"><i class="fas fa-lock"></i> Only Active events can be edited</span>
                            `}
                        </div>
                    </div>

                    <div style="display: none; grid-template-columns: 1fr 1fr; gap: 1.5rem;" id="eventEditContainer">
                        <div>
                            <label style="display: block; margin-bottom: 0.4rem; font-weight: 600;">Registration Deadline</label>
                            <input type="datetime-local" id="editDeadline" value="${event.deadline ? event.deadline.slice(0, 16) : ''}" style="width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.4rem; font-weight: 600;">Event Date</label>
                            <input type="datetime-local" id="editDate" value="${event.date ? event.date.slice(0, 16) : ''}" style="width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.4rem; font-weight: 600;">Coordinator Name</label>
                            <input type="text" id="editCoordName" value="${event.coordinatorName || ''}" style="width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.4rem; font-weight: 600;">Coordinator Contact</label>
                            <input type="text" id="editCoordMobile" value="${event.coordinatorMobile || ''}" style="width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.4rem; font-weight: 600;">Description</label>
                            <textarea id="editDescription" style="width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid var(--border-color); min-height: 120px;">${event.description || ''}</textarea>
                        </div>
                        <div style="grid-column: span 2; display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem;">
                            <button class="btn-primary" style="background: #94a3b8;" onclick="CoordinatorPanel.toggleEventEditMode(${event.id}, false)">Cancel</button>
                            <button class="btn-primary" onclick="CoordinatorPanel.saveEventChanges(${event.id})">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add('active');
    },

    toggleEventEditMode(id, edit = true) {
        document.getElementById('eventViewContainer').style.display = edit ? 'none' : 'grid';
        document.getElementById('eventEditContainer').style.display = edit ? 'grid' : 'none';
    },

    async saveEventChanges(id) {
        const token = localStorage.getItem('token');
        const data = {
            registrationDeadline: document.getElementById('editDeadline').value,
            eventDate: document.getElementById('editDate').value,
            coordinatorName: document.getElementById('editCoordName').value,
            coordinatorMobile: document.getElementById('editCoordMobile').value,
            description: document.getElementById('editDescription').value
        };

        try {
            const res = await fetch(`/api/coordinator/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert('✅ Event updated successfully!');
                document.getElementById('eventDetailModal').classList.remove('active');
                this.fetchAllData();
                this.render();
            } else {
                alert('Failed to update event.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error.');
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
            phone: document.getElementById('field-phone')?.checked,
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
                        ${fields.phone ? `<div><label style="font-size: 0.8rem;">Phone Number</label><input type="text" disabled style="width: 100%; padding: 0.4rem; border: 1px solid #ddd;"></div>` : ''}
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

    async viewRegistrationDetails(groupId) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/coordinator/registrations/group/${groupId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch details');
            const data = await res.json();
            this.showRegistrationDetailModal(data);
        } catch (err) {
            console.error(err);
            alert('Error loading registration details');
        }
    },

    showRegistrationDetailModal(data) {
        let modal = document.getElementById('regDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'regDetailModal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        const totalMoney = (data.feePerPerson || 0) * (data.members ? data.members.length : 0);

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header flex-between" style="margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                    <div>
                        <h2 style="color: var(--primary-dark);"><i class="fas fa-file-invoice"></i> Registration Details</h2>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Group ID: <strong style="color: var(--text-main);">${data.groupId}</strong></p>
                    </div>
                    <button onclick="document.getElementById('regDetailModal').classList.remove('active')" style="background:#f1f5f9; border:none; width:40px; height:40px; border-radius:50%; font-size:1.2rem; cursor:pointer; color:#64748b; display:flex; align-items:center; justify-content:center;">&times;</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2.5rem;">
                    <div>
                        <h3 style="margin-bottom: 1.25rem; font-size: 1.1rem; display: flex; align-items: center; gap: 0.6rem;">
                            <span style="background:var(--primary-light); color:var(--primary-dark); width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem;"><i class="fas fa-users"></i></span>
                            Team Members (${data.members ? data.members.length : 0})
                        </h3>
                        <div style="display: grid; gap: 1rem;">
                            ${(data.members || []).map(m => `
                                <div style="padding: 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
                                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: white; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary-dark);">
                                            ${(m.fullName || m.username || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style="margin: 0; font-weight: 700; color: #1e293b;">${m.fullName || m.username}</p>
                                            <p style="margin: 0; font-size: 0.75rem; color: var(--text-muted);">@${m.username}</p>
                                        </div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr; gap: 0.5rem; font-size: 0.85rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #475569;">
                                            <i class="fas fa-university" style="width: 16px; color: #94a3b8;"></i>
                                            <span>${m.college || 'N/A'}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #475569;">
                                            <i class="fas fa-envelope" style="width: 16px; color: #94a3b8;"></i>
                                            <span>${m.email || 'N/A'}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #475569;">
                                            <i class="fas fa-phone" style="width: 16px; color: #94a3b8;"></i>
                                            <span>${m.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 2rem;">
                        <section>
                            <h3 style="margin-bottom: 1.25rem; font-size: 1.1rem; display: flex; align-items: center; gap: 0.6rem;">
                                <span style="background:#e0e7ff; color:#4338ca; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem;"><i class="fas fa-info-circle"></i></span>
                                Registration Summary
                            </h3>
                            <div style="padding: 1.5rem; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 16px;">
                                <div style="display: grid; gap: 1rem;">
                                    <div class="flex-between">
                                        <span style="color: #0369a1; font-weight: 500;">Event</span>
                                        <span style="font-weight: 700; color: #0c4a6e; text-align: right;">${data.eventTitle}</span>
                                    </div>
                                    <div class="flex-between">
                                        <span style="color: #0369a1; font-weight: 500;">Status</span>
                                        <span class="status-badge" style="background: ${data.status === 'APPROVED' ? '#dcfce7' : '#fee2e2'}; color: ${data.status === 'APPROVED' ? '#166534' : '#991b1b'}; font-weight: 700;">${data.status}</span>
                                    </div>
                                    <div class="flex-between">
                                        <span style="color: #0369a1; font-weight: 500;">Transaction ID</span>
                                        <code style="background: rgba(255,255,255,0.6); padding: 2px 6px; border-radius: 4px; color: #0369a1;">${data.transactionId || 'FREE'}</code>
                                    </div>
                                    <div style="margin-top: 1rem; padding-top: 1.5rem; border-top: 2px dashed #bae6fd;">
                                        <div class="flex-between">
                                            <span style="font-size: 1rem; color: #0369a1; font-weight: 700;">Total Amount</span>
                                            <span style="font-size: 1.5rem; font-weight: 800; color: #0369a1;">₹${totalMoney}</span>
                                        </div>
                                        <p style="font-size: 0.75rem; color: #0369a1; text-align: right; margin-top: 0.25rem;">(₹${data.feePerPerson} x ${data.members ? data.members.length : 0} members)</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        ${data.paymentScreenshot ? `
                            <section>
                                <h3 style="margin-bottom: 1.25rem; font-size: 1.1rem; display: flex; align-items: center; gap: 0.6rem;">
                                    <span style="background:#fef3c7; color:#92400e; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem;"><i class="fas fa-receipt"></i></span>
                                    Payment Screenshot
                                </h3>
                                <div style="border: 4px solid white; border-radius: 16px; overflow: hidden; background: #000; box-shadow: 0 10px 25px rgba(0,0,0,0.1); cursor: zoom-in;" onclick="window.open('${data.paymentScreenshot}', '_blank')">
                                    <img src="${data.paymentScreenshot}" style="width: 100%; display: block;">
                                </div>
                            </section>
                        ` : ''}
                    </div>
                </div>
                
                <div style="margin-top: 2.5rem; display: flex; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    ${data.status === 'PENDING' ? `
                        <button class="btn-primary" onclick="CoordinatorPanel.coordinatorApproveReg('${data.groupId}'); document.getElementById('regDetailModal').classList.remove('active');" style="flex: 1; background: #10b981; height: 50px; font-size: 1rem;">
                            <i class="fas fa-check"></i> Approve Registration
                        </button>
                        <button class="btn-primary" onclick="CoordinatorPanel.coordinatorRejectReg('${data.groupId}'); document.getElementById('regDetailModal').classList.remove('active');" style="flex: 1; background: #ef4444; height: 50px; font-size: 1rem;">
                            <i class="fas fa-times"></i> Reject Registration
                        </button>
                    ` : `
                        <button class="btn-primary" onclick="window.print()" style="flex: 1; background: var(--secondary); height: 50px; font-size: 1rem;">
                            <i class="fas fa-print"></i> Print Details
                        </button>
                    `}
                </div>
            </div>
        `;
        modal.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CoordinatorPanel.init();
});
