// case-study.js — shared behavior for project case-study pages
document.addEventListener("DOMContentLoaded", () => {
    // TOC active-section spy
    const tocLinks = document.querySelectorAll(".cs-toc a");
    const sections = Array.from(tocLinks)
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (tocLinks.length && sections.length && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = "#" + entry.target.id;
                    const link = document.querySelector(`.cs-toc a[href="${id}"]`);
                    if (!link) return;
                    if (entry.isIntersecting) {
                        tocLinks.forEach((l) => l.classList.remove("active"));
                        link.classList.add("active");
                    }
                });
            },
            { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
        );
        sections.forEach((sec) => observer.observe(sec));
    }

    // Generic step-based demo panels.
    // Markup contract:
    //   <div class="demo-panel" data-demo="NAME">
    //     <div class="demo-steps">
    //       <button class="demo-step-btn" data-step="0">Label</button> ...
    //     </div>
    //     <div class="demo-output"></div>
    //   </div>
    // Content supplied via window.DEMO_CONTENT[NAME] = [htmlString, htmlString, ...]
    const demoPanels = document.querySelectorAll(".demo-panel[data-demo]");
    demoPanels.forEach((panel) => {
        const name = panel.getAttribute("data-demo");
        const content = (window.DEMO_CONTENT || {})[name];
        const output = panel.querySelector(".demo-output");
        const buttons = panel.querySelectorAll(".demo-step-btn");
        if (!content || !output || !buttons.length) return;

        function setStep(index) {
            buttons.forEach((b) => b.classList.remove("active"));
            buttons[index].classList.add("active");
            output.innerHTML = content[index];
        }

        buttons.forEach((btn, i) => {
            btn.addEventListener("click", () => setStep(i));
        });

        setStep(0);
    });
});
