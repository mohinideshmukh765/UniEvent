document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // Basic session validation
    if (!user || !token || !user.roles.includes('ROLE_STUDENT')) {
        window.location.href = '/login.html';
        return;
    }

    // Set user profile data
    const studentNames = document.querySelectorAll('.student-name');
    studentNames.forEach(el => el.textContent = user.fullName || user.username);

    // Logout functionality
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = '/login.html';
        });
    });

    // Sidebar navigation highlight
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

// Utility for mock data generation
const mockEvents = [
    {
        id: 1,
        title: "Tech-Fest Zenith 2024",
        college: "Shivaji University, Kolhapur",
        district: "Kolhapur",
        date: "25 Oct, 2024",
        deadline: "20 Oct",
        category: "Technical",
        price: "Free",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
    },
    {
        id: 2,
        title: "Cultural Night '24",
        college: "KIT College, Kolhapur",
        district: "Kolhapur",
        date: "28 Oct, 2024",
        deadline: "15 Oct",
        category: "Cultural",
        price: "₹200",
        image: "https://images.unsplash.com/photo-1514525253344-7814d2e99a27?w=800&q=80"
    },
    {
        id: 3,
        title: "Inter-College Sports",
        college: "Walchand College, Sangli",
        district: "Sangli",
        date: "10 Oct, 2024",
        deadline: "15 Oct",
        category: "Sports",
        price: "Free",
        image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80"
    },
    {
        id: 4,
        title: "AI & ML Workshop",
        college: "YCC, Satara",
        district: "Satara",
        date: "02 Nov, 2024",
        deadline: "30 Oct",
        category: "Technical",
        price: "Free",
        image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80"
    }
];

const mockNotifications = [
    { id: 1, text: "Youth Festival registration is closing in 2 days!", type: "warning", time: "2h ago" },
    { id: 2, text: "Your registration for Robo-War '24 was approved.", type: "success", time: "5h ago" },
    { id: 3, text: "New announcement from Admin regarding Hackathon.", type: "info", time: "1d ago" }
];
