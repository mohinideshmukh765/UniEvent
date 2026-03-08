document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    async function loadStudents() {
        try {
            const response = await fetch('/api/admin/students', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const students = await response.json();
            const tbody = document.getElementById('studentsTableBody');
            
            tbody.innerHTML = students.map(student => `
                <tr>
                    <td>
                        <div style="font-weight: 600;">${student.fullName}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">@${student.username}</div>
                    </td>
                    <td>${student.email}</td>
                    <td>${student.district || 'N/A'}</td>
                    <td>
                        <span class="status-badge ${student.enabled ? 'status-approved' : 'status-rejected'}">
                            ${student.enabled ? 'Active' : 'Disabled'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
                            <i class="fas ${student.enabled ? 'fa-user-slash' : 'fa-user-check'}"></i>
                        </button>
                        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;"><i class="fas fa-key"></i></button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading students', error);
        }
    }

    loadStudents();

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/login.html';
    });
});
