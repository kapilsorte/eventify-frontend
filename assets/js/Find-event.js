document.addEventListener('DOMContentLoaded', async () => {
    // Load events from backend
    await loadEventsFromBackend();
    
    // Initialize registration functionality first
    window.registerForEvent = function(button) {
        if (button.textContent === 'Register') {
            button.textContent = 'Registered';
            button.style.backgroundColor = '#dc3545';
            button.closest('.event-card').style.border = '2px solid #dc3545';
            button.closest('.event-card').classList.add('registered-event');
            
            // Save to localStorage
            const eventTitle = button.closest('.event-card').querySelector('h3').textContent;
            let registered = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
            if (!registered.includes(eventTitle)) {
                registered.push(eventTitle);
                localStorage.setItem('registeredEvents', JSON.stringify(registered));
            }
        }
    };

    async function loadEventsFromBackend() {
        try {
            const response = await fetch('http://localhost:3000/api/events');
            if (response.ok) {
                const events = await response.json();
                renderBackendEvents(events);
            }
        } catch (error) {
            console.log('Backend not available, using static events');
        }
    }
    
    function renderBackendEvents(events) {
        const eventsGrid = document.querySelector('.events-grid');
        if (!eventsGrid) return;
        
        // Clear existing dynamic events (keep static ones)
        const dynamicEvents = eventsGrid.querySelectorAll('.dynamic-event');
        dynamicEvents.forEach(event => event.remove());
        
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card dynamic-event';
            eventCard.innerHTML = `
                <div class="card-image">
                    <img src="http://localhost:3000/${event.imagePath}" alt="${event.eventName}">
                    <span class="badge">${event.category}</span>
                    <button class="zoom-btn"><i class="fas fa-search-plus"></i></button>
                </div>
                <div class="card-content">
                    <h3>${event.eventName}</h3>
                    <div class="card-org">Organized by: ${event.organizationName}</div>
                    <p class="date">${new Date(event.date).toLocaleDateString()} • ${event.time}</p>
                    <div class="card-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span><a class="c101" href="${event.googleFormLink || '#'}">${event.address}, ${event.city}</a></span>
                    </div>
                    <button class="register-btn" onclick="registerForEvent(this)">Register</button>
                </div>
            `;
            eventsGrid.appendChild(eventCard);
        });
        
        // Re-initialize zoom functionality for new events
        initializeZoomForNewEvents();
    }
    
    function initializeZoomForNewEvents() {
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("fullImage");
        const captionText = document.getElementById("caption");
        
        if (modal && modalImg && captionText) {
            const newZoomButtons = document.querySelectorAll('.dynamic-event .zoom-btn');
            newZoomButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const img = btn.closest('.card-image').querySelector('img');
                    if (img) {
                        modal.style.display = "block";
                        modalImg.src = img.src;
                        captionText.innerHTML = img.alt;
                    }
                });
            });
        }
    }

    // Update all register buttons to use the new function
    document.querySelectorAll('.register-btn').forEach(btn => {
        const currentOnclick = btn.getAttribute('onclick');
        if (currentOnclick && currentOnclick.includes('EventifyManager.execute')) {
            btn.setAttribute('onclick', 'registerForEvent(this)');
        }
    });


    /* ==================================================================
       SECTION 1: NAVBAR TOGGLE & CLOSE LOGIC
       ================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // 1. Toggle Menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            navLinks.classList.toggle('nav-active');

           
            e.stopPropagation();
        });
    }

    // 2. Close when link clicked
    if (navItems) {
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                
            });
        });
    }

    // 3. Close when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('nav-active')) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('nav-active');
                
            }
        }
    });


    /* ==================================================================
       SECTION 2: EVENT SEARCH & FILTER LOGIC
       ================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const noResultsMsg = document.getElementById('noResults');
    const allEventCards = document.querySelectorAll('.event-card');

    function filterEvents() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        // Find the active category button
        let activeCategory = 'all';
        if (filterButtons) {
            filterButtons.forEach(btn => {
                if (btn.classList.contains('active')) {
                    activeCategory = btn.getAttribute('data-category');
                }
            });
        }

        let visibleCount = 0;

        allEventCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const location = card.querySelector('.card-location a').textContent.toLowerCase();
            const categoryBadge = card.querySelector('.badge');
            const category = categoryBadge ? categoryBadge.textContent : '';
            const isRegistered = card.classList.contains('registered-event');

            const matchesSearch = title.includes(searchTerm) || location.includes(searchTerm);
            const matchesCategory = (activeCategory === 'all') || 
                                  (activeCategory === 'Registered' && isRegistered) ||
                                  (activeCategory !== 'Registered' && category === activeCategory);

            if (matchesSearch && matchesCategory) {
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResultsMsg) {
            if (visibleCount === 0) {
                noResultsMsg.classList.remove('hidden');
            } else {
                noResultsMsg.classList.add('hidden');
            }
        }
    }

    // Load registered events on page load
    const registered = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    allEventCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (registered.includes(title)) {
            const btn = card.querySelector('.register-btn');
            if (btn) {
                btn.textContent = 'Registered';
                btn.style.backgroundColor = '#dc3545';
                card.style.border = '2px solid #dc3545';
                card.classList.add('registered-event');
            }
        }
    });

    // Filter Listeners
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                if (searchInput) searchInput.value = '';
                filterEvents();
            });
        });
    }

    // Search Listener
    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }


    /* ==================================================================
       SECTION 3: FAQ ACCORDION
       ================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems) {
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
    }


    /* ==================================================================
       SECTION 4: IMAGE ZOOM LOGIC
       ================================================================== */
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("fullImage");
    const captionText = document.getElementById("caption");
    const closeBtn = document.querySelector(".close-modal");
    const zoomButtons = document.querySelectorAll('.zoom-btn');

    if (modal && modalImg && captionText) {
        zoomButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = btn.closest('.card-image').querySelector('img');
                if (img) {
                    modal.style.display = "block";
                    modalImg.src = img.src;
                    captionText.innerHTML = img.alt;
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = "none";
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});