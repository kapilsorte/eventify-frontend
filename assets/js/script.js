document.addEventListener('DOMContentLoaded', () => {
    console.log("Script Loaded");

    /* ============================
       1. MOBILE MENU TOGGLE
       ============================ */
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileMenu && navLinks) {
        // ADDED 'e' inside the parentheses below
        mobileMenu.addEventListener('click', (e) => {
           e.stopPropagation(); // Now 'e' is defined and this will work
            
            navLinks.classList.toggle('nav-active'); 
            mobileMenu.classList.toggle('is-active');
        });
    } else {
        console.error("Menu elements not found. Check HTML IDs.");
    }

     // 2. Close menu when a link is clicked
    if (navItems) {
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                if (mobileMenu) mobileMenu.classList.remove('is-active');
            });
        });
    }

    // 3. Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('nav-active')) {
            // If click is NOT inside the menu AND NOT on the toggle button
            if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
                navLinks.classList.remove('nav-active');
                if (mobileMenu) mobileMenu.classList.remove('is-active');
            }
        }
    });


    /* ============================
       2. SLIDER FUNCTIONALITY
       ============================ */
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;

    if(slides.length > 0) {
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        if(nextBtn) nextBtn.addEventListener('click', nextSlide);
        if(prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto slide every 5 seconds
        setInterval(nextSlide, 10000);
    }

    /* ============================
       3. FAQ ACCORDION
       ============================ */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if(question && answer) {
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
});

