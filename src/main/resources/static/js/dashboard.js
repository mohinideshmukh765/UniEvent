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

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/login.html';
    });
});
