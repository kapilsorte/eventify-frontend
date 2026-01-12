// Simple registration functionality
function registerForEvent(button) {
    if (button.textContent === 'Register') {
        button.textContent = 'Registered';
        button.style.backgroundColor = '#dc3545';
        button.closest('.event-card').style.border = '2px solid #dc3545';
        
        // Save to localStorage
        const eventTitle = button.closest('.event-card').querySelector('h3').textContent;
        let registered = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
        registered.push(eventTitle);
        localStorage.setItem('registeredEvents', JSON.stringify(registered));
        button.closest('.event-card').classList.add('registered-event');
    } else {
        button.textContent = 'Register';
        button.style.backgroundColor = '#28a745';
        button.closest('.event-card').style.border = 'none';
        
        // Remove from localStorage
        const eventTitle = button.closest('.event-card').querySelector('h3').textContent;
        let registered = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
        registered = registered.filter(title => title !== eventTitle);
        localStorage.setItem('registeredEvents', JSON.stringify(registered));
        button.closest('.event-card').classList.remove('registered-event');
    }
}

// Load registered events and setup functionality
document.addEventListener('DOMContentLoaded', () => {
    // Update all register buttons
    document.querySelectorAll('.register-btn').forEach(btn => {
        btn.onclick = () => registerForEvent(btn);
    });
    
    // Load registered events
    const registered = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    document.querySelectorAll('.event-card').forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (registered.includes(title)) {
            const btn = card.querySelector('.register-btn');
            btn.textContent = 'Registered';
            btn.style.backgroundColor = '#dc3545';
            card.style.border = '2px solid #dc3545';
            card.classList.add('registered-event');
        }
    });
    
    // Filter function
    function filterEvents() {
        const activeBtn = document.querySelector('.filter-btn.active');
        const category = activeBtn ? activeBtn.dataset.category : 'all';
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        document.querySelectorAll('.event-card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const badge = card.querySelector('.badge').textContent;
            const isRegistered = card.classList.contains('registered-event');
            
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = category === 'all' || 
                                  (category === 'Registered' && isRegistered) ||
                                  (category !== 'Registered' && badge === category);
            
            card.style.display = matchesSearch && matchesCategory ? 'flex' : 'none';
        });
    }
    
    // Add filter listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterEvents();
        });
    });
    
    document.getElementById('searchInput').addEventListener('input', filterEvents);
});