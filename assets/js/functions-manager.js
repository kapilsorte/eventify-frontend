/**
 * EVENTIFY - CENTRALIZED FUNCTION MANAGER
 * Links all functions across the website for better organization and reusability
 */

class EventifyFunctionManager {
    constructor() {
        this.functions = {};
        this.init();
    }

    init() {
        this.registerCommonFunctions();
        this.registerNavigationFunctions();
        this.registerEventFunctions();
        this.registerUIFunctions();
    }

    // Register a function
    register(name, func) {
        this.functions[name] = func;
    }

    // Execute a function
    execute(name, ...args) {
        if (this.functions[name]) {
            return this.functions[name](...args);
        }
        console.warn(`Function ${name} not found`);
    }

    // COMMON FUNCTIONS
    registerCommonFunctions() {
        // Mobile menu toggle
        this.register('toggleMobileMenu', (mobileMenu, navLinks) => {
            if (mobileMenu && navLinks) {
                navLinks.classList.toggle('nav-active');
                mobileMenu.classList.toggle('is-active');
            }
        });

        // Close mobile menu
        this.register('closeMobileMenu', (mobileMenu, navLinks) => {
            if (navLinks && mobileMenu) {
                navLinks.classList.remove('nav-active');
                mobileMenu.classList.remove('is-active');
            }
        });

        // FAQ accordion toggle
        this.register('toggleFAQ', (item, faqItems) => {
            const answer = item.querySelector('.faq-answer');
            
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

    // NAVIGATION FUNCTIONS
    registerNavigationFunctions() {
        // Smooth scroll to section
        this.register('smoothScrollTo', (targetId) => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Setup navigation listeners
        this.register('setupNavigation', () => {
            const mobileMenu = document.getElementById('mobile-menu') || document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            const navItems = document.querySelectorAll('.nav-links a');

            if (mobileMenu && navLinks) {
                mobileMenu.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.execute('toggleMobileMenu', mobileMenu, navLinks);
                });

                // Close menu when link clicked
                navItems.forEach(link => {
                    link.addEventListener('click', () => {
                        this.execute('closeMobileMenu', mobileMenu, navLinks);
                    });
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (navLinks.classList.contains('nav-active')) {
                        if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
                            this.execute('closeMobileMenu', mobileMenu, navLinks);
                        }
                    }
                });
            }
        });
    }

    // EVENT MANAGEMENT FUNCTIONS
    registerEventFunctions() {
        // Load events from localStorage
        this.register('loadEvents', () => {
            return JSON.parse(localStorage.getItem('myEvents')) || [];
        });

        // Save events to localStorage
        this.register('saveEvents', (events) => {
            localStorage.setItem('myEvents', JSON.stringify(events));
        });

        // Create new event
        this.register('createEvent', (eventData) => {
            const events = this.execute('loadEvents');
            const newEvent = {
                id: Date.now(),
                ...eventData,
                image: eventData.image || 'https://via.placeholder.com/400x200?text=Event+Image'
            };
            events.push(newEvent);
            this.execute('saveEvents', events);
            return newEvent;
        });

        // Filter events
        this.register('filterEvents', (searchTerm = '', category = 'all') => {
            const allEventCards = document.querySelectorAll('.event-card');
            const noResultsMsg = document.getElementById('noResults');
            let visibleCount = 0;

            allEventCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const location = card.querySelector('.card-location a')?.textContent.toLowerCase() || '';
                const categoryBadge = card.querySelector('.badge');
                const cardCategory = categoryBadge ? categoryBadge.textContent : '';
                const isRegistered = card.classList.contains('registered-event');

                const matchesSearch = title.includes(searchTerm.toLowerCase()) || location.includes(searchTerm.toLowerCase());
                const matchesCategory = (category === 'all') || 
                                      (category === 'Registered' && isRegistered) ||
                                      (category !== 'Registered' && cardCategory === category);

                if (matchesSearch && matchesCategory) {
                    card.style.display = "flex";
                    visibleCount++;
                } else {
                    card.style.display = "none";
                }
            });

            if (noResultsMsg) {
                noResultsMsg.classList.toggle('hidden', visibleCount > 0);
            }

            return visibleCount;
        });

        // Register new event functions
        this.register('registerForEvent', (eventCard) => {
            const registerBtn = eventCard.querySelector('.register-btn');
            const eventTitle = eventCard.querySelector('h3').textContent;
            
            if (registerBtn.textContent === 'Register') {
                registerBtn.textContent = 'Registered';
                registerBtn.classList.add('registered');
                eventCard.classList.add('registered-event');
                
                // Save to localStorage
                let registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];
                if (!registeredEvents.includes(eventTitle)) {
                    registeredEvents.push(eventTitle);
                    localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
                }
            }
        });

        // Load registered events
        this.register('loadRegisteredEvents', () => {
            return JSON.parse(localStorage.getItem('registeredEvents')) || [];
        });

        // Apply registered status on page load
        this.register('applyRegisteredStatus', () => {
            const registeredEvents = this.execute('loadRegisteredEvents');
            const eventCards = document.querySelectorAll('.event-card');
            
            eventCards.forEach(card => {
                const eventTitle = card.querySelector('h3').textContent;
                if (registeredEvents.includes(eventTitle)) {
                    const registerBtn = card.querySelector('.register-btn');
                    registerBtn.textContent = 'Registered';
                    registerBtn.classList.add('registered');
                    card.classList.add('registered-event');
                }
            });
        });
            const container = document.getElementById(containerId);
            const noResultsMsg = document.getElementById('noResults');
            
            if (!container) return;

            container.innerHTML = '';

            if (events.length === 0) {
                noResultsMsg?.classList.remove('hidden');
            } else {
                noResultsMsg?.classList.add('hidden');
                
                events.forEach(evt => {
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
                    container.appendChild(card);
                });
            }
        });
    }

    // UI FUNCTIONS
    registerUIFunctions() {
        // Setup slider
        this.register('setupSlider', () => {
            const slides = document.querySelectorAll('.slide');
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            let currentSlide = 0;

            if (slides.length === 0) return;

            const showSlide = (index) => {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
            };

            const nextSlide = () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            };

            const prevSlide = () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            };

            nextBtn?.addEventListener('click', nextSlide);
            prevBtn?.addEventListener('click', prevSlide);

            // Auto slide
            setInterval(nextSlide, 10000);
        });

        // Setup modal
        this.register('setupModal', (modalId, openBtnId, closeBtnClass) => {
            const modal = document.getElementById(modalId);
            const openBtn = document.getElementById(openBtnId);
            const closeBtn = document.querySelector(closeBtnClass);

            if (!modal) return;

            openBtn?.addEventListener('click', () => {
                modal.style.display = 'flex';
            });

            closeBtn?.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Setup image zoom
        this.register('setupImageZoom', () => {
            const modal = document.getElementById("imageModal");
            const modalImg = document.getElementById("fullImage");
            const captionText = document.getElementById("caption");
            const closeBtn = document.querySelector(".close-modal");
            const zoomButtons = document.querySelectorAll('.zoom-btn');

            if (!modal || !modalImg || !captionText) return;

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

            closeBtn?.addEventListener('click', () => {
                modal.style.display = "none";
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = "none";
                }
            });
        });

        // Setup FAQ
        this.register('setupFAQ', () => {
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                
                if (question) {
                    question.addEventListener('click', () => {
                        this.execute('toggleFAQ', item, faqItems);
                    });
                }
            });
        });
    }

    // Initialize all page functions
    initializePage() {
        this.execute('setupNavigation');
        this.execute('setupSlider');
        this.execute('setupFAQ');
        this.execute('setupImageZoom');
        
        // Page-specific initializations
        if (document.getElementById('eventModal')) {
            this.execute('setupModal', 'eventModal', 'openModalBtn', '.close-btn');
        }
        
        if (document.getElementById('imageModal')) {
            this.execute('setupModal', 'imageModal', null, '.close-modal');
        }

        // Apply registered status on Find Events page
        if (document.querySelector('.filter-section')) {
            this.execute('applyRegisteredStatus');
        }
    }
}

// Create global instance
window.EventifyManager = new EventifyFunctionManager();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.EventifyManager.initializePage();
});