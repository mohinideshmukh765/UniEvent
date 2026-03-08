document.getElementById('role')?.addEventListener('change', (e) => {
    const collegeSection = document.getElementById('collegeSection');
    if (e.target.value === 'COORDINATOR') {
        collegeSection.style.display = 'block';
        loadColleges();
    } else {
        collegeSection.style.display = 'none';
    }
});

async function loadColleges() {
    try {
        const response = await fetch('/api/public/colleges'); // Need to create this endpoint
        const colleges = [
            { id: 1, name: "KIT College, Kolhapur" },
            { id: 2, name: "DYP College, Kolhapur" }
        ]; // Mocked for now
        
        const collegeSelect = document.getElementById('collegeId');
        collegeSelect.innerHTML = colleges.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading colleges');
    }
}

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
        district: document.getElementById('district').value,
        collegeId: document.getElementById('role').value === 'COORDINATOR' ? document.getElementById('collegeId').value : null
    };

    const messageDiv = document.getElementById('signupMessage');

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.text();

        if (response.ok) {
            messageDiv.style.display = 'block';
            messageDiv.style.color = '#10b981';
            messageDiv.textContent = 'Account created! Redirecting to login...';
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        } else {
            messageDiv.style.display = 'block';
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = data || 'Signup failed. Please try again.';
        }
    } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.style.color = '#ef4444';
        messageDiv.textContent = 'Server error. Please try again later.';
    }
});
