document.getElementById('role')?.addEventListener('change', (e) => {
    const studentSection = document.getElementById('studentCollegeSection');
    const collegeSection = document.getElementById('collegeSection');
    if (e.target.value === 'COORDINATOR') {
        collegeSection.style.display = 'block';
        studentSection.style.display = 'none';
        loadColleges();
    } else {
        collegeSection.style.display = 'none';
        studentSection.style.display = 'block';
    }
});

async function loadColleges() {
    try {
        const response = await fetch('/api/public/colleges');
        if (!response.ok) throw new Error('Failed to load');
        const colleges = await response.json();
        const collegeSelect = document.getElementById('collegeId');
        collegeSelect.innerHTML = colleges.map(c => `<option value="${c.collegeCode}">${c.collegeName}</option>`).join('');
    } catch (error) {
        console.error('Error loading colleges', error);
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
        collegeId: document.getElementById('role').value === 'COORDINATOR' ? document.getElementById('collegeId').value : null,
        college: document.getElementById('role').value === 'STUDENT' ? document.getElementById('college').value : null
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
