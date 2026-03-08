/**
 * Coordinator Panel Core Logic
 * Handles dynamic content loading, routing, and UI interactions.
 */

const CoordinatorPanel = {
    currentPage: 'dashboard',
    
    // Page Content Templates
    templates: {
        dashboard: `
            <div class="animate-slide">
                <h1 style="margin-bottom: 2rem;">Coordinator Dashboard</h1>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;"><i class="fas fa-calendar-plus"></i></div>
                        <div class="stat-info"><h3>Total Events</h3><p>12</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #eef2ff; color: #6366f1;"><i class="fas fa-clock"></i></div>
                        <div class="stat-info"><h3>Upcoming</h3><p>4</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #fdf2f8; color: #ec4899;"><i class="fas fa-users"></i></div>
                        <div class="stat-info"><h3>Registrations</h3><p>520</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #fff7ed; color: #f59e0b;"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-info"><h3>Completed</h3><p>8</p></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2>Upcoming Events Overview</h2>
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
                                <tr>
                                    <td><strong>Shivaji Jayanti 2024</strong></td>
                                    <td>Feb 19</td>
                                    <td>Main Campus</td>
                                    <td>240</td>
                                    <td><span class="status-badge status-active">Active</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Tech-Fest Zenith</strong></td>
                                    <td>Mar 05</td>
                                    <td>IT Dept Hall</td>
                                    <td>120</td>
                                    <td><span class="status-badge status-pending">Draft</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        'create-event': `
            <div class="animate-slide">
                <h1 style="margin-bottom: 2rem;">Host a New Event</h1>
                <div class="card">
                    <form id="createEventForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Title</label>
                            <input type="text" placeholder="e.g., National Level Robotics Workshop" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Category</label>
                            <select style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                                <option>Technical</option>
                                <option>Cultural</option>
                                <option>Sports</option>
                                <option>Workshop</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Maximum Participants</label>
                            <input type="number" placeholder="500" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                         <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
                            <textarea rows="4" placeholder="Describe the event, rules, and outcomes..." style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);"></textarea>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Event Date</label>
                            <input type="date" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Venue</label>
                            <input type="text" placeholder="Main Auditorium" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div style="grid-column: span 2; display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                            <button type="button" class="btn-primary" style="background: var(--text-muted);">Save Draft</button>
                            <button type="submit" class="btn-primary">Publish Event</button>
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
                            <input type="text" placeholder="Search event title...">
                        </div>
                        <div class="gap-1" style="display: flex;">
                            <select style="padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                                <option>All Categories</option>
                                <option>Technical</option>
                                <option>Cultural</option>
                            </select>
                            <select style="padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Draft</option>
                                <option>Completed</option>
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
                            <tbody>
                                <tr>
                                    <td><strong>Shivaji Jayanti 2024</strong></td>
                                    <td>Cultural</td>
                                    <td>Feb 19</td>
                                    <td>240</td>
                                    <td><span class="status-badge status-active">Active</span></td>
                                    <td>
                                        <button class="btn-primary" style="padding: 0.4rem; background: var(--secondary);"><i class="fas fa-eye"></i></button>
                                        <button class="btn-primary" style="padding: 0.4rem; background: var(--accent);"><i class="fas fa-edit"></i></button>
                                        <button class="btn-primary" style="padding: 0.4rem; background: #ef4444;"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        'form-builder': `
            <div class="animate-slide">
                <h1>Registration Form Builder</h1>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Customize the fields students need to fill during registration.</p>
                <div class="stats-grid">
                    <div class="card" style="margin-bottom: 0;">
                        <h3>Default Fields</h3>
                        <ul style="list-style: none; margin-top: 1rem;">
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color); color: var(--text-muted);"><i class="fas fa-check-circle" style="color: var(--primary);"></i> Full Name</li>
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color); color: var(--text-muted);"><i class="fas fa-check-circle" style="color: var(--primary);"></i> College ID</li>
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color); color: var(--text-muted);"><i class="fas fa-check-circle" style="color: var(--primary);"></i> Email Address</li>
                        </ul>
                    </div>
                    <div class="card" style="margin-bottom: 0;">
                        <h3>Custom Questions</h3>
                        <div id="customFieldsList" style="margin: 1rem 0;">
                            <p style="font-size: 0.8rem; color: var(--text-muted);">No custom fields added yet.</p>
                        </div>
                        <button class="btn-primary" style="width: 100%;"><i class="fas fa-plus"></i> Add Question</button>
                    </div>
                </div>
                <div class="card" style="margin-top: 2rem;">
                    <h3>Form Settings</h3>
                    <div style="margin-top: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem;">Max Participants</label>
                            <input type="number" value="100" style="width: 100%; padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color);">
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" id="teamReg">
                            <label for="teamReg">Allow Team Registration</label>
                        </div>
                    </div>
                    <button class="btn-primary" style="margin-top: 1.5rem;">Save Form Config</button>
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
        'upload-photos': `
            <div class="animate-slide">
                <h1>Event Photo Upload</h1>
                <div class="card" style="border: 2px dashed var(--border-color); text-align: center; padding: 4rem;">
                    <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                    <h3>Drag & Drop Event Photos</h3>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Maximum 20 photos at a time. Supports JPG, PNG.</p>
                    <button class="btn-primary">Browse Files</button>
                </div>
                <div class="card">
                    <h3>Thumbnail Gallery</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; margin-top: 1rem;">
                        <!-- Mock thumbnails -->
                         <div style="aspect-ratio: 1; background: #eee; border-radius: 8px;"></div>
                         <div style="aspect-ratio: 1; background: #eee; border-radius: 8px;"></div>
                    </div>
                    <button class="btn-primary" style="margin-top: 2rem; width: 100%;">Publish Gallery</button>
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
                <div class="card">
                    <div style="display: flex; gap: 2rem;">
                        <div style="width: 150px; height: 150px; background: #eee; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                            <i class="fas fa-university"></i>
                        </div>
                        <div style="flex-grow: 1;">
                            <h2>DYP College of Engineering</h2>
                            <p style="color: var(--text-muted);">Kolhapur, Maharashtra</p>
                            <div style="margin-top: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div><strong>College Email:</strong> contact@dyp.edu</div>
                                <div><strong>Phone:</strong> +91 9876543210</div>
                                <div><strong>District:</strong> Kolhapur</div>
                            </div>
                            <button class="btn-primary" style="margin-top: 1.5rem; background: var(--secondary);">Edit Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
    },

    init() {
        this.render();
        this.setupEventListeners();
        console.log("Coordinator Panel Initialized");
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
    CoordinatorPanel.init();
});
