/* =====================================================================
   animations.js — GSAP scroll effects, counters, custom cursor,
   timeline progress, hero text rotator & scroll progress bar.
   ===================================================================== */
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGSAP = typeof gsap !== "undefined";
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function ready(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }

    /* ---------------- MAGNETIC BUTTON EFFECT ---------------- */
    /* Custom cursor removed — native OS cursor is used everywhere. */
    function initMagnetic() {
        if (!finePointer || reduceMotion) {
            window.refreshCursorTargets = function () {};
            return;
        }
        function bind() {
            document.querySelectorAll('[data-cursor="magnetic"]').forEach((el) => {
                if (el.dataset.cursorBound) return;
                el.dataset.cursorBound = "1";
                el.addEventListener("pointermove", (e) => {
                    const r = el.getBoundingClientRect();
                    const dx = e.clientX - (r.left + r.width / 2);
                    const dy = e.clientY - (r.top + r.height / 2);
                    el.style.transform = `translate(${dx * 0.2}px, ${dy * 0.3}px)`;
                });
                el.addEventListener("pointerleave", () => { el.style.transform = ""; });
            });
        }
        bind();
        window.refreshCursorTargets = bind;
    }

    /* ---------------- SCROLL PROGRESS BAR ---------------- */
    function initScrollProgress() {
        const bar = document.getElementById("scrollProgress");
        if (!bar) return;
        const update = () => {
            const h = document.documentElement;
            const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
            bar.style.width = (scrolled * 100) + "%";
        };
        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    /* ---------------- HERO REVEALS + ROTATOR ---------------- */
    function initHeroReveals() {
        // reveal-up elements
        const revs = document.querySelectorAll(".hero .reveal-up");
        revs.forEach((el, i) => {
            setTimeout(() => el.classList.add("is-in"), 150 + i * 120);
        });

        // rotating words
        const rotator = document.getElementById("heroRotator");
        if (rotator) {
            const words = Array.from(rotator.children);
            let idx = 0;
            words[0].classList.add("is-active");
            if (!reduceMotion && words.length > 1) {
                setInterval(() => {
                    words[idx].classList.remove("is-active");
                    idx = (idx + 1) % words.length;
                    words[idx].classList.add("is-active");
                }, 2400);
            }
        }
    }

    /* ---------------- COUNTERS ---------------- */
    function animateCounter(el) {
        if (el.dataset.counted) return;
        el.dataset.counted = "1";
        const target = parseFloat(el.dataset.count || "0");
        const suffix = el.dataset.suffix || "";
        const isEuro = el.dataset.format === "euro";
        const dur = 1800;
        const start = performance.now();

        function fmt(v) {
            if (isEuro) return "€" + Math.round(v).toLocaleString("en-US");
            return Math.round(v).toLocaleString("en-US");
        }
        function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = fmt(target) + suffix;
        }
        if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
        requestAnimationFrame(tick);
    }

    function initCounters() {
        const counters = document.querySelectorAll("[data-count]");
        if (!("IntersectionObserver" in window)) { counters.forEach(animateCounter); return; }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) { animateCounter(en.target); io.unobserve(en.target); }
            });
        }, { threshold: 0.4 });
        counters.forEach((c) => { if (!c.dataset.counted) io.observe(c); });
    }
    // Allow other modules to re-scan for counters injected after load.
    window.refreshCounters = initCounters;

    /* ---------------- GSAP SCROLL EFFECTS ---------------- */
    function initGSAP() {
        if (!hasGSAP || reduceMotion) return;
        gsap.registerPlugin(ScrollTrigger);

        // Section heads parallax-ish reveal
        gsap.utils.toArray(".section__title").forEach((el) => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: "top 85%" },
                y: 40, opacity: 0, duration: 1, ease: "power3.out"
            });
        });

        // Hero parallax on scroll
        gsap.to(".hero__left", {
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
            y: 120, opacity: 0.3, ease: "none"
        });

        // Card stagger — only for JS-injected grids that do NOT use AOS.
        // (Education & leadership cards use data-aos, so AOS handles them to avoid conflicts.)
        ["#researchGrid", "#projectsGrid"].forEach((sel) => {
            const cont = document.querySelector(sel);
            if (!cont) return;
            ScrollTrigger.batch(cont.children, {
                start: "top 88%",
                onEnter: (els) => gsap.from(els, { y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", overwrite: true })
            });
        });

        // Research bars fill on enter
        ScrollTrigger.create({
            trigger: "#researchGrid", start: "top 80%", once: true,
            onEnter: () => document.querySelectorAll(".research-card__bar i").forEach((b) => {
                b.style.width = (b.dataset.w || "70") + "%";
            })
        });

        // Section background subtle parallax glow handled via CSS; refresh on load
        ScrollTrigger.refresh();
    }

    /* ---------------- TIMELINE PROGRESS ---------------- */
    function initTimeline() {
        const timeline = document.getElementById("timeline");
        const progress = document.getElementById("timelineProgress");
        const items = document.querySelectorAll(".timeline__item");
        if (!timeline || !progress) return;

        // reveal items
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((en) => {
                    if (en.isIntersecting) {
                        en.target.classList.add("is-in");
                        if (hasGSAP && !reduceMotion) {
                            gsap.from(en.target.querySelector(".timeline__card"), {
                                x: en.target.matches(":nth-child(odd)") ? 40 : -40,
                                opacity: 0, duration: 0.8, ease: "power3.out"
                            });
                        }
                        io.unobserve(en.target);
                    }
                });
            }, { threshold: 0.3 });
            items.forEach((it) => io.observe(it));
        }

        // progress line tied to scroll
        const update = () => {
            const rect = timeline.getBoundingClientRect();
            const vh = window.innerHeight;
            const total = rect.height;
            const passed = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
            progress.style.height = (passed / total * 100) + "%";
        };
        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    ready(function () {
        initMagnetic();
        initScrollProgress();
        initHeroReveals();
        initCounters();
        initTimeline();
        // GSAP after a tick so dynamic content (cards) is injected by main.js
        setTimeout(initGSAP, 60);
        window.initGSAPEffects = initGSAP;
    });
})();
