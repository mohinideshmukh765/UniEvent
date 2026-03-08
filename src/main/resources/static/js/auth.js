document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('loginMessage');

    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            
            messageDiv.style.display = 'block';
            messageDiv.style.color = '#10b981';
            messageDiv.textContent = 'Login successful! Redirecting...';
            
            // Redirect based on role
            const role = data.roles[0];
            setTimeout(() => {
                if (role === 'ROLE_ADMIN') window.location.href = '/admin/index.html';
                else if (role === 'ROLE_COORDINATOR') window.location.href = '/coordinator/index.html';
                else window.location.href = '/student/dashboard.html';
            }, 1000);
        } else {
            messageDiv.style.display = 'block';
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = data.message || 'Login failed. Please check credentials.';
        }
    } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.style.color = '#ef4444';
        messageDiv.textContent = 'Server error. Please try again later.';
    }
});
