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
        let currentX = window.innerWidth / 2;
        let currentY = window.innerHeight / 2;
        let targetX = currentX;
        let targetY = currentY;
        let isFlipped = false;

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX + 15; // Offset from cursor
            targetY = e.clientY + 15;
        });

        const animateBird = () => {
            if (!bird.classList.contains('visible')) {
                // Fly offscreen if not visible
                targetX = -120; 
                targetY = window.innerHeight / 2;
            }

            // Lerp (smooth follow)
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;
            
            // Movement direction for tilting
            const dx = targetX - currentX;
            const tilt = dx * 0.1; 
            
            // Determine facing direction
            if (dx > 2) isFlipped = false; // Look right
            else if (dx < -2) isFlipped = true; // Look left

            const scaleX = isFlipped ? -1 : 1;
            
            // Apply transform
            bird.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${tilt}deg) scaleX(${scaleX})`;
            
            requestAnimationFrame(animateBird);
        };
        
        // Start animation loop
        requestAnimationFrame(animateBird);
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
