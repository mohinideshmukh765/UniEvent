document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // Authentication Guard
    if (!user || !token || !user.roles.includes('ROLE_ADMIN')) {
        window.location.href = '/login.html';
        return;
    }

    // Set Profile Info
    const adminName = document.getElementById('adminName');
    if (adminName) adminName.textContent = user.username;

    // Logout Functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = '/login.html';
        });
    }

    // Highlight Active Nav Item
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });

    // Mobile Sidebar Toggle (if needed in future)
});
