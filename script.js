// script.js
document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mobile navigation toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeMenu = document.querySelector(".close-menu");

    if (menuToggle && mobileMenu && closeMenu) {
        menuToggle.addEventListener("click", () => mobileMenu.classList.add("active"));
        closeMenu.addEventListener("click", () => mobileMenu.classList.remove("active"));
        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => mobileMenu.classList.remove("active"));
        });
    }

    // Sticky navbar
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    // Scroll reveal via IntersectionObserver
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length) {
        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            reveals.forEach((el) => el.classList.add("active"));
        } else {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("active");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
            );
            reveals.forEach((el) => observer.observe(el));
        }
    }

    // Scroll-spy for main nav
    const navLinks = document.querySelectorAll(".nav-links a");
    const spySections = Array.from(navLinks)
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (navLinks.length && spySections.length && "IntersectionObserver" in window) {
        const spyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = "#" + entry.target.id;
                    const link = document.querySelector(`.nav-links a[href="${id}"]`);
                    if (!link) return;
                    if (entry.isIntersecting) {
                        navLinks.forEach((l) => l.classList.remove("active"));
                        link.classList.add("active");
                    }
                });
            },
            { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
        );
        spySections.forEach((sec) => spyObserver.observe(sec));
    }

    // Smooth scroll with navbar offset for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - navHeight - 8,
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                });
            }
        });
    });
});
