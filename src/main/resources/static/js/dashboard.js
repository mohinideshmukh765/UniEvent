document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.roles.includes('ROLE_ADMIN')) {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('adminName').textContent = user.fullName || user.username;

    // Load Stats
    try {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            document.getElementById('totalColleges').textContent = stats.totalColleges;
            document.getElementById('totalStudents').textContent = stats.totalStudents;
            document.getElementById('totalEvents').textContent = stats.totalEvents;
            document.getElementById('totalRegistrations').textContent = stats.totalRegistrations;
        }
    } catch (error) {
        console.error('Error loading stats', error);
    }

    try {
        const eventsResponse = await fetch('/api/admin/events', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            const distrCounts = {
                Kolhapur: 0,
                Sangli: 0,
                Satara: 0
            };
            
            events.forEach(e => {
                const dist = (e.college && e.college.district);
                if (distrCounts[dist] !== undefined) {
                    distrCounts[dist]++;
                }
            });
            
            let maxCount = Math.max(...Object.values(distrCounts));
            if (maxCount === 0) maxCount = 1; // avoid division by zero
            
            const chartHtml = `
                <div style="flex: 1; height: ${(distrCounts.Kolhapur / maxCount) * 85 + 10}%; background: #3b82f6; border-radius: 8px 8px 0 0; position: relative;">
                    <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; color: var(--admin-text-muted);">Kolhapur: ${distrCounts.Kolhapur}</span>
                </div>
                <div style="flex: 1; height: ${(distrCounts.Sangli / maxCount) * 85 + 10}%; background: #6366f1; border-radius: 8px 8px 0 0; position: relative;">
                    <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; color: var(--admin-text-muted);">Sangli: ${distrCounts.Sangli}</span>
                </div>
                <div style="flex: 1; height: ${(distrCounts.Satara / maxCount) * 85 + 10}%; background: #8b5cf6; border-radius: 8px 8px 0 0; position: relative;">
                    <span style="position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; color: var(--admin-text-muted);">Satara: ${distrCounts.Satara}</span>
                </div>
            `;
            const chartContainer = document.getElementById('district-chart');
            if (chartContainer) chartContainer.innerHTML = chartHtml;
        }
    } catch (error) {
        console.error('Error loading events for charts', error);
    }

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/login.html';
    });
});
