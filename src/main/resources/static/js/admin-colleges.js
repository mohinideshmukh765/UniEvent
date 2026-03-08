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
                        <div style="font-weight: 600;">${college.collegeName}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${college.collegeCode}</div>
                    </td>
                    <td>${college.district || 'N/A'}</td>
                    <td>
                        <span class="status-badge status-${college.enabled ? 'activated' : 'disabled'}">
                            ${college.enabled ? 'Active' : 'Disabled'}
                        </span>
                    </td>
                    <td>
                        ${college.enabled ? `
                            <button class="btn btn-secondary" onclick="toggleStatus('${college.collegeCode}', 'deactivate')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; background: var(--danger); border: none; color: white;">Deactivate</button>
                        ` : `
                            <button class="btn btn-primary" onclick="toggleStatus('${college.collegeCode}', 'activate')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; background: var(--primary); border: none; color: white;">Activate</button>
                        `}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading colleges', error);
        }
    }

    window.toggleStatus = async (collegeCode, action) => {
        try {
            const response = await fetch(`/api/admin/colleges/${action}/${collegeCode}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                loadColleges();
            } else {
                alert("Failed to " + action + ": " + await response.text());
            }
        } catch (error) {
            console.error('Error updating status', error);
            alert("Error: " + error.message);
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
