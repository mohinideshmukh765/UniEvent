document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    async function loadEvents() {
        try {
            const response = await fetch('/api/admin/events', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const events = await response.json();
            const tbody = document.getElementById('eventsTableBody');
            
            tbody.innerHTML = events.map(event => `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="font-weight: 600;">${event.title}</div>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(event.eventDate).toLocaleDateString()}</div>
                    </td>
                    <td>${event.college ? event.college.name : 'N/A'}</td>
                    <td>${event.category}</td>
                    <td>
                        <span class="status-badge status-${event.status.toLowerCase()}">${event.status}</span>
                    </td>
                    <td>
                        <button class="btn btn-secondary" onclick="updateEventStatus(${event.id}, 'SUSPENDED')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Suspend</button>
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;"><i class="fas fa-eye"></i></button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading events', error);
        }
    }

    window.updateEventStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/admin/events/${id}/status?status=${status}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                loadEvents();
            }
        } catch (error) {
            console.error('Error updating event status', error);
        }
    };

    loadEvents();

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/login.html';
    });
});
