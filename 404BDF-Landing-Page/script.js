/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INITIALIZE AOS
    if (window.AOS) {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic'
        });
    }

    // 2. PRELOADER
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        }, 1500); // Give it some time to show the logo
    });

    // 3. CUSTOM CURSOR & MAGNETIC EFFECT
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        follower.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" });
    });

    const magneticElements = document.querySelectorAll('.btn, .dev-social a, .nav-links a');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            follower.style.transform = 'scale(2)';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
            follower.style.transform = 'scale(1)';
        });
    });

    // 4. PARALLAX HERO CARDS
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        document.addEventListener('mousemove', (e) => {
            const amount = 20;
            const x = (e.clientX - window.innerWidth / 2) / amount;
            const y = (e.clientY - window.innerHeight / 2) / amount;
            
            const cards = document.querySelectorAll('.f-card');
            cards.forEach((card, index) => {
                const depth = (index + 1) * 0.5;
                card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });
    }

    // 5. NAV SCROLL EFFECT
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.width = window.innerWidth > 768 ? '70%' : '95%';
            nav.style.padding = '10px 24px';
            nav.style.background = 'rgba(10, 10, 12, 0.9)';
        } else {
            nav.style.width = window.innerWidth > 768 ? '90%' : '95%';
            nav.style.padding = '12px 30px';
            nav.style.background = 'rgba(10, 10, 12, 0.7)';
        }
    });

    // 6. TECH MARQUEE INTERACTION (SIMPLE)
    // Scroll reveal for cards
    const techCards = document.querySelectorAll('.tech-card');
    const observerOptions = {
        threshold: 0.1
    };

    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    techCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
        techObserver.observe(card);
    });

});
