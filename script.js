document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations (fade-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.01
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Hummingbird Smart Animation
    const bird = document.getElementById('flying-bird');
    if (bird) {
        // Only target buttons inside sections, and the cards (excludes navbar and footer links)
        const targets = Array.from(document.querySelectorAll('section .btn, .niche-card, .service-item'));
        
        let currentX = window.innerWidth / 2;
        let currentY = window.innerHeight / 2;
        let targetX = currentX;
        let targetY = currentY;
        let targetCenterX = currentX; // Keeps track of where the target is
        let isFlipped = false;

        const updateBirdTarget = () => {
            const viewportCenter = window.innerHeight / 2;
            let closestTarget = null;
            let minDistance = Infinity;
            
            // Find which interactive element is closest to the center of the screen
            targets.forEach(el => {
                const rect = el.getBoundingClientRect();
                
                // Only consider elements currently visible in the viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const elCenter = rect.top + (rect.height / 2);
                    const distance = Math.abs(elCenter - viewportCenter);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestTarget = rect;
                    }
                }
            });

            if (closestTarget) {
                targetCenterX = closestTarget.left + (closestTarget.width / 2);
                
                // Fly to the top-left of the closest interactive element
                targetX = closestTarget.left - 50; 
                
                // If it goes offscreen to the left, fly to the top-right instead
                if (targetX < 20) {
                    targetX = closestTarget.right + 10;
                }
                
                targetY = closestTarget.top - 20;
            } else {
                // Fallback
                targetCenterX = window.innerWidth / 2;
                targetX = 80; // Rest on the left side of the screen
                targetY = viewportCenter;
            }

            // Ensure the bird stays within the visible viewport bounds
            const padding = 15; // 15px safety margin from the screen edges
            const birdWidth = 80;
            const birdHeight = 80; // approximate height for safety
            
            const minX = padding;
            const maxX = window.innerWidth - birdWidth - padding;
            const minY = 90; // Don't fly into navbar (top 90px)
            const maxY = window.innerHeight - birdHeight - padding;
            
            // Safeguard for very small screens or layout variations
            const safeMaxX = Math.max(minX, maxX);
            const safeMaxY = Math.max(minY, maxY);

            if (!bird.classList.contains('visible')) {
                targetX = -120; // Posiciona fora da tela à esquerda
            } else {
                targetX = Math.max(minX, Math.min(targetX, safeMaxX));
            }
            targetY = Math.max(minY, Math.min(targetY, safeMaxY));
        };

        // Initialize position
        updateBirdTarget();
        currentX = targetX;
        currentY = targetY;

        const animateBird = () => {
            // Lerp (smooth follow)
            currentX += (targetX - currentX) * 0.025;
            currentY += (targetY - currentY) * 0.025;
            
            // Movement direction for tilting
            const dx = targetX - currentX;
            const tilt = dx * 0.05; 
            
            // Always face the target center (look at the button)
            if (currentX < targetCenterX - 10) isFlipped = false; // Look right
            else if (currentX > targetCenterX + 10) isFlipped = true; // Look left

            const scaleX = isFlipped ? -1 : 1;
            
            // Apply transform
            bird.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${tilt}deg) scaleX(${scaleX})`;
            
            requestAnimationFrame(animateBird);
        };
        
        // Start animation loop
        requestAnimationFrame(animateBird);

        window.addEventListener('scroll', updateBirdTarget);
        window.addEventListener('resize', updateBirdTarget);
    }

    // Lógica do Formulário de Briefing Passo a Passo
    const briefingForm = document.getElementById('briefing-form');
    if (briefingForm) {
        const step1 = briefingForm.querySelector('.form-step[data-step="1"]');
        const step2 = briefingForm.querySelector('.form-step[data-step="2"]');
        const stepSuccess = briefingForm.querySelector('.form-step[data-step="success"]');
        const btnNext = briefingForm.querySelector('.next-step');
        const btnPrev = briefingForm.querySelector('.prev-step');

        if (btnNext && step1 && step2) {
            btnNext.addEventListener('click', () => {
                const checkedServices = briefingForm.querySelectorAll('input[name="services"]:checked');
                if (checkedServices.length === 0) {
                    alert('Por favor, selecione pelo menos uma opção para prosseguir.');
                    return;
                }
                step1.classList.remove('active');
                step2.classList.add('active');
            });
        }

        if (btnPrev && step1 && step2) {
            btnPrev.addEventListener('click', () => {
                step2.classList.remove('active');
                step1.classList.add('active');
            });
        }

        briefingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('client-name').value;
            const whatsapp = document.getElementById('client-whatsapp').value;
            const instagram = document.getElementById('client-instagram').value;

            const checkedServices = Array.from(briefingForm.querySelectorAll('input[name="services"]:checked'))
                .map(cb => cb.value)
                .join(', ');

            const text = `Olá Agência Silt! Acabei de preencher o briefing no site. Aqui estão meus detalhes:\n\n` +
                `*Nome/Escritório:* ${name}\n` +
                `*WhatsApp:* ${whatsapp}\n` +
                `*Instagram:* ${instagram || 'Não informado'}\n` +
                `*Interesses:* ${checkedServices}`;

            const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;

            const whatsappDirectBtn = document.getElementById('whatsapp-direct');
            if (whatsappDirectBtn) {
                whatsappDirectBtn.href = whatsappUrl;
            }

            step2.classList.remove('active');
            stepSuccess.classList.add('active');
        });
    }


    // Sticky CTA and Hummingbird show/hide on scroll
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        const updateVisibility = () => {
            const heroHeight = heroSection.offsetHeight;
            if (window.scrollY > heroHeight * 0.8) {
                if (stickyCta) stickyCta.classList.add('visible');
                if (bird) bird.classList.add('visible');
            } else {
                if (stickyCta) stickyCta.classList.remove('visible');
                if (bird) bird.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', updateVisibility);
        updateVisibility(); // Run on initial load
    }
});
