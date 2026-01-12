document.addEventListener('DOMContentLoaded', () => {

   /* ==================================================================
   1. NAVBAR TOGGLE 
   ================================================================== */
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a'); // Select all links

if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
        // Toggle the menu open/close
        navLinks.classList.toggle('nav-active');
        mobileMenu.classList.toggle('is-active');
        e.stopPropagation(); 
    });
}

// NEW: Close the menu when any link inside it is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // If the menu is open, close it
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            mobileMenu.classList.remove('is-active'); // Reset hamburger icon
        }
    });
});

// Close menu when clicking outside (Keep this existing part)
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('nav-active')) {
        if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
            navLinks.classList.remove('nav-active');
            mobileMenu.classList.remove('is-active');
        }
    }
});
    /* ==================================================================
       2. FAQ ACCORDION
       ================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                // Close others
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });
                // Toggle current
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    answer.style.maxHeight = null;
                }
            });
        }
    });

    /* ==================================================================
       3. CREATE EVENT LOGIC
       ================================================================== */
    const modal = document.getElementById('eventModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('createEventForm');
    const grid = document.getElementById('createdEventsGrid');
    const noResultsMsg = document.getElementById('noResults');

    // Load Events from LocalStorage on page load
    let createdEvents = JSON.parse(localStorage.getItem('myEvents')) || [];
    renderEvents();

    // Open Modal
    if(openBtn) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    // Close Modal
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close Modal on Click Outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle Form Submission
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('eventName', document.getElementById('evTitle').value);
            formData.append('organizationName', document.getElementById('evOrg').value);
            formData.append('category', document.getElementById('evCategory').value);
            formData.append('eventDate', document.getElementById('evDate').value);
            formData.append('address', document.getElementById('evLocation').value);
            formData.append('city', 'Pune');
            formData.append('latitude', '18.5204');
            formData.append('longitude', '73.8567');
            formData.append('googleFormLink', 'https://forms.google.com/sample');
            formData.append('eventTime', '10:00');
            
            // Add image file if exists
            const imageInput = document.getElementById('evImage');
            if (imageInput && imageInput.files[0]) {
                formData.append('eventImage', imageInput.files[0]);
            } else {
                // Create a placeholder image blob
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(0, 0, 400, 200);
                ctx.fillStyle = '#666';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Event Image', 200, 100);
                
                canvas.toBlob(blob => {
                    formData.append('eventImage', blob, 'placeholder.png');
                    submitEvent(formData);
                });
                return;
            }
            
            submitEvent(formData);
        });
    }
    
    async function submitEvent(formData) {
        try {
            const response = await fetch('http://localhost:3000/api/events', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                alert('Event created successfully and saved to database!');
                
                // Also save locally for display
                const newEvent = {
                    id: Date.now(),
                    title: formData.get('eventName'),
                    org: formData.get('organizationName'),
                    category: formData.get('category'),
                    date: formData.get('eventDate'),
                    location: formData.get('address'),
                    image: 'http://localhost:3000/uploads/' + (formData.get('eventImage').name || 'placeholder.png')
                };
                
                createdEvents.push(newEvent);
                localStorage.setItem('myEvents', JSON.stringify(createdEvents));
                renderEvents();
                
                form.reset();
                modal.style.display = 'none';
            } else {
                throw new Error('Failed to create event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating event. Please try again.');
        }
    }

    // Render Logic
    function renderEvents() {
        grid.innerHTML = '';
        
        if (createdEvents.length === 0) {
            noResultsMsg.classList.remove('hidden');
        } else {
            noResultsMsg.classList.add('hidden');
            
            createdEvents.forEach(evt => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.innerHTML = `
                    <div class="card-image">
                        <img src="${evt.image}" alt="Event Image">
                        <span class="badge">${evt.category}</span>
                    </div>
                    <div class="card-content">
                        <h3>${evt.title}</h3>
                        <div class="card-org">Organized by: ${evt.org}</div>
                        <p class="date">${evt.date}</p>
                        <div class="card-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${evt.location}</span>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
  }
});