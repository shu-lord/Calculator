// ===================================
// MOBILE NAVIGATION TOGGLE (runs on all pages)
// ===================================
(function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Function to reset hamburger animation
    function resetHamburgerAnimation() {
        if (!hamburger) return;
        const spans = hamburger.querySelectorAll('span');
        if (spans.length >= 3) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        hamburger.classList.remove('active');
    }

    // Toggle menu (with null checks)
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');

            // Update aria-expanded for accessibility
            hamburger.setAttribute('aria-expanded', isActive);

            // Animate hamburger icon
            const spans = hamburger.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = isActive ? 'rotate(45deg) translate(5px, 5px)' : 'none';
                spans[1].style.opacity = isActive ? '0' : '1';
                spans[2].style.transform = isActive ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
            }
        });

        // Close menu when link is clicked
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                resetHamburgerAnimation();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                resetHamburgerAnimation();
            }
        });
    }
})();

// ===================================
// MATRIX RAIN ANIMATION (HERO BACKGROUND)
// ===================================
const canvas = document.getElementById('matrix-canvas');
if (!canvas) {
    // Matrix canvas not found - this is normal on some pages
} else {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
    } else {
        // Initialize canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Matrix characters
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        const fontSize = 14;
        const columns = canvas.width / fontSize;

        // Array to hold drop positions
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        // Draw matrix rain
        function drawMatrix() {
            // Semi-transparent black to create fade effect
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set text style
            ctx.font = fontSize + 'px monospace';

            // Loop through drops
            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = characters.charAt(Math.floor(Math.random() * characters.length));

                // Gradient color effect (red to orange)
                const gradient = ctx.createLinearGradient(0, drops[i] * fontSize, 0, (drops[i] + 1) * fontSize);
                gradient.addColorStop(0, '#ff0040');
                gradient.addColorStop(1, '#ff6b35');
                ctx.fillStyle = gradient;

                // Draw character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop to top randomly
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Increment Y coordinate
                drops[i]++;
            }
        }

        // Animation loop will be set up later with particles

        // Resize canvas on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Update columns array for matrix animation
            const newColumns = canvas.width / fontSize;
            drops.length = 0; // Clear existing drops
            for (let i = 0; i < newColumns; i++) {
                drops[i] = Math.random() * -100;
            }

            // Update particles for new canvas size
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        });


        // Mobile navigation now handled by IIFE at top of file

        // ===================================
        // SMOOTH SCROLL WITH OFFSET FOR FIXED NAVBAR
        // ===================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                // Close mobile nav menu if open
                const mobileNavLinks = document.querySelector('.nav-links');
                const mobileHamburger = document.querySelector('.hamburger');
                if (mobileNavLinks && mobileNavLinks.classList.contains('active')) {
                    mobileNavLinks.classList.remove('active');
                    if (mobileHamburger) {
                        mobileHamburger.classList.remove('active');
                        const spans = mobileHamburger.querySelectorAll('span');
                        if (spans.length >= 3) {
                            spans[0].style.transform = 'none';
                            spans[1].style.opacity = '1';
                            spans[2].style.transform = 'none';
                        }
                    }
                }

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Offset for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // ===================================
        // NAVBAR SCROLL EFFECT
        // ===================================
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        // ===================================
        // SCROLL ANIMATIONS (FADE IN ON SCROLL)
        // ===================================
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for fade-in animation
        const animateOnScroll = document.querySelectorAll('.purpose-card, .resource-card, .workflow-step, .stat-item');
        animateOnScroll.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });

        // ===================================
        // CONTACT FORM HANDLING WITH FORMSUBMIT
        // ===================================
        const contactForm = document.querySelector('.contact-form');

        // Only add event listener if contact form exists on this page
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                // Show loading state
                const submitBtn = contactForm.querySelector('.btn-submit');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = 'Sending... <span class="btn-arrow">⏳</span>';
                    submitBtn.disabled = true;

                    // Let the form submit naturally to FormSubmit
                    // The form will redirect to the _next URL after successful submission

                    // Reset button state after a delay (in case form doesn't redirect)
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 5000);
                }
            });
        }

        function showSuccessMessage() {
            const successMessage = document.createElement('div');
            successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff0040, #ff6b35);
        color: white;
        padding: 2rem 3rem;
        border-radius: 15px;
        font-size: 1.2rem;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(255, 0, 64, 0.5);
        animation: fadeInScale 0.3s ease-out;
    `;
            successMessage.textContent = 'Message sent successfully! 🚀';
            document.body.appendChild(successMessage);

            // Add animation keyframes
            const style = document.createElement('style');
            style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
            document.head.appendChild(style);

            // Remove message after 3 seconds
            setTimeout(() => {
                successMessage.style.animation = 'fadeInScale 0.3s ease-out reverse';
                setTimeout(() => {
                    successMessage.remove();
                }, 300);
            }, 3000);
        }

        function showErrorMessage() {
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #dc2626, #ef4444);
        color: white;
        padding: 2rem 3rem;
        border-radius: 15px;
        font-size: 1.2rem;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(220, 38, 38, 0.5);
        animation: fadeInScale 0.3s ease-out;
    `;
            errorMessage.textContent = 'Failed to send message. Please try again. ❌';
            document.body.appendChild(errorMessage);

            // Remove message after 3 seconds
            setTimeout(() => {
                errorMessage.style.animation = 'fadeInScale 0.3s ease-out reverse';
                setTimeout(() => {
                    errorMessage.remove();
                }, 300);
            }, 3000);
        }

        // ===================================
        // PARTICLE EFFECT FOR BACKGROUND (OPTIONAL ENHANCEMENT)
        // ===================================
        class Particle {
            constructor(canvasWidth, canvasHeight) {
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.canvasWidth = canvasWidth;
                this.canvasHeight = canvasHeight;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x > this.canvasWidth) this.x = 0;
                if (this.x < 0) this.x = this.canvasWidth;
                if (this.y > this.canvasHeight) this.y = 0;
                if (this.y < 0) this.y = this.canvasHeight;
            }

            draw(ctx) {
                ctx.fillStyle = 'rgba(255, 0, 64, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create particles array
        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(canvas.width, canvas.height));
        }

        // Animate particles
        function animateParticles() {
            particles.forEach(particle => {
                particle.update();
                particle.draw(ctx);
            });
        }

        // Add particles to the matrix animation
        const originalDrawMatrix = drawMatrix;
        function drawMatrixWithParticles() {
            originalDrawMatrix();
            animateParticles();
        }

        // Replace the original animation with the enhanced version
        const matrixInterval = setInterval(drawMatrixWithParticles, 50);
    }
}

// ===================================
// COUNTER ANIMATION FOR STATS
// ===================================
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element, target) => {
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
        }
    };

    updateCounter();
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const number = entry.target.querySelector('.stat-number');
            const target = parseInt(number.textContent);
            animateCounter(number, target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ===================================
// WORKFLOW STEP ANIMATION
// ===================================
const workflowSteps = document.querySelectorAll('.workflow-step');

const workflowObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200); // Stagger animation
        }
    });
}, { threshold: 0.3 });

workflowSteps.forEach((step, index) => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    workflowObserver.observe(step);
});

// ===================================
// DYNAMIC BUTTON RIPPLE EFFECT
// ===================================
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out;
        `;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// ===================================
// PARALLAX EFFECT FOR SECTIONS
// ===================================
const heroContent = document.querySelector('.hero-content');
const workflow = document.querySelector('.workflow');

// ===================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ===================================
const sections = document.querySelectorAll('section[id]');

// ===================================
// CURSOR TRAIL EFFECT (DESKTOP ONLY)
// ===================================
// Only create cursor trail on desktop to avoid wasted resources on mobile
if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    const cursorTrail = [];
    const trailLength = 10;

    document.addEventListener('mousemove', (e) => {
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
    });

    // Create a canvas for cursor trail to improve performance
    const trailCanvas = document.createElement('canvas');
    trailCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(trailCanvas);
    const trailCtx = trailCanvas.getContext('2d');

    function resizeTrailCanvas() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    }

    resizeTrailCanvas();
    window.addEventListener('resize', resizeTrailCanvas);

    function drawCursorTrail() {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        const now = Date.now();

        cursorTrail.forEach((point, index) => {
            const age = now - point.time;
            if (age < 500) {
                const opacity = 1 - (age / 500);
                const size = 5 - (index / trailLength) * 3;

                trailCtx.beginPath();
                trailCtx.arc(point.x, point.y, size, 0, Math.PI * 2);
                trailCtx.fillStyle = `rgba(255, 0, 64, ${opacity * 0.5})`;
                trailCtx.fill();
            }
        });

        requestAnimationFrame(drawCursorTrail);
    }

    drawCursorTrail();
}

// ===================================
// OPTIMIZED SCROLL HANDLER
// ===================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;

        // Navbar shadow effect
        if (scrolled > 100) {
            navbar.style.boxShadow = '0 5px 30px rgba(255, 0, 64, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Parallax for hero section
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Parallax for workflow section
        if (workflow) {
            const workflowTop = workflow.offsetTop;
            const workflowScroll = scrolled - workflowTop;
            if (workflowScroll > -500 && workflowScroll < 500) {
                workflow.style.transform = `translateY(${workflowScroll * 0.1}px)`;
            }
        }

        // Active navigation link highlighting
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrolled > sectionTop && scrolled <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => link.style.color = '');
                if (navLink) {
                    navLink.style.color = '#ff0040';
                }
            }
        });
    });
});

// Lazy load images if any are added later
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// CONSOLE EASTER EGG (Development Only)
// ===================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%c🔴 AI RedCell', 'color: #ff0040; font-size: 24px; font-weight: bold;');
    console.log('%c⚠️ Ethical AI Jailbreaking & Research', 'color: #ff6b35; font-size: 16px;');
    console.log('%cInterested in joining our research? Contact us!', 'color: #a855f7; font-size: 14px;');
    console.log('✅ AI RedCell website initialized successfully');
}
