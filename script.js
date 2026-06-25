// script.js
document.addEventListener("DOMContentLoaded", () => {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeMenu = document.querySelector(".close-menu");
    const navLinks = document.querySelector(".nav-links").innerHTML;
    const mobileLinks = document.querySelector(".mobile-links");

    mobileLinks.innerHTML = navLinks;

    menuToggle.addEventListener("click", () => {
        mobileMenu.classList.add("active");
    });

    closeMenu.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });

    mobileLinks.addEventListener("click", (e) => {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.remove("active");
        }
    });

    // Sticky Navigation
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Typing Animation
    const textArray = ["Java Developer", "Spring Boot Developer", "Full Stack Developer", "AI Enthusiast"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if(textArray.length && typedTextSpan) setTimeout(type, newTextDelay + 250);

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll(".reveal");

    function reveal() {
        var windowHeight = window.innerHeight;
        var elementVisible = 100;
        
        reveals.forEach((revealEl) => {
            var elementTop = revealEl.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                revealEl.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", reveal);
    reveal(); // Trigger on load

    // Form Submission (Prevent Default for demo)
    const form = document.querySelector(".contact-form");
    if(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = form.querySelector(".btn-submit");
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sent Successfully <i class="fa-solid fa-check"></i>';
            btn.style.background = "#10B981";
            btn.style.color = "#fff";
            form.reset();
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = "";
                btn.style.color = "";
            }, 3000);
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                const navHeight = document.querySelector(".navbar").offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
});
