// Login Integration Script
document.addEventListener('DOMContentLoaded', () => {
    // Add login button to navigation
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('loginBtn')) {
        const loginLi = document.createElement('li');
        loginLi.innerHTML = '<a href="#" id="loginBtn" class="login-btn">Login</a>';
        navLinks.appendChild(loginLi);
    }

    // Check login status
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.textContent = 'Logout';
            loginBtn.onclick = () => {
                localStorage.removeItem('userLoggedIn');
                alert('Logged out successfully!');
                location.reload();
            };
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.onclick = () => {
                window.location.href = 'Login.html';
            };
        }
    }

    // Restrict registration to logged-in users
    document.querySelectorAll('.register-btn').forEach(btn => {
        const originalOnclick = btn.onclick;
        btn.onclick = () => {
            if (!isLoggedIn) {
                alert('Please login to register for events');
                return;
            }
            if (originalOnclick) originalOnclick();
        };
    });
});