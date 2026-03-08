document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    async function loadColleges() {
        try {
            const response = await fetch('/api/admin/colleges', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const colleges = await response.json();
            const tbody = document.getElementById('collegesTableBody');
            
            tbody.innerHTML = colleges.map(college => `
                <tr>
                    <td>
                        <div style="font-weight: 600;">${college.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${college.address}</div>
                    </td>
                    <td>${college.district}</td>
                    <td>
                        <span class="status-badge status-${college.status.toLowerCase()}">${college.status}</span>
                    </td>
                    <td>
                        ${college.status === 'PENDING' ? `
                            <button class="btn btn-primary" onclick="updateStatus(${college.id}, 'APPROVED')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Approve</button>
                            <button class="btn btn-secondary" onclick="updateStatus(${college.id}, 'REJECTED')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Reject</button>
                        ` : `
                            <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;"><i class="fas fa-edit"></i></button>
                        `}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading colleges', error);
        }
    }

    window.updateStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/admin/colleges/${id}/status?status=${status}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                loadColleges();
            }
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    loadColleges();

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/login.html';
    });
});
