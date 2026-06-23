/* =====================================================================
   main.js — App orchestration: loader, nav, content injection,
   project modals, gallery lightbox, charts, contact form & AOS.
   ===================================================================== */
(function () {
    "use strict";

    const D = window.PORTFOLIO_DATA || {};
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    // Always start at the home/hero section on (re)load instead of restoring
    // the previous scroll position.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.addEventListener("beforeunload", () => window.scrollTo(0, 0));
    window.addEventListener("load", () => {
        if (!location.hash || location.hash === "#hero") window.scrollTo(0, 0);
    });

    function ready(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }

    /* ---------------- LOADING SCREEN ---------------- */
    function initLoader() {
        const loader = $("#loader");
        const bar = $("#loaderBar");
        const percent = $("#loaderPercent");
        if (!loader) return;

        // particle canvas
        const canvas = $("#loaderParticles");
        let rafId;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            const size = 420;
            canvas.width = size; canvas.height = size;
            const parts = Array.from({ length: 60 }, () => ({
                x: Math.random() * size, y: Math.random() * size,
                vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
                r: Math.random() * 1.8 + 0.4
            }));
            const draw = () => {
                ctx.clearRect(0, 0, size, size);
                parts.forEach((p) => {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > size) p.vx *= -1;
                    if (p.y < 0 || p.y > size) p.vy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(10,147,150,0.55)";
                    ctx.fill();
                });
                rafId = requestAnimationFrame(draw);
            };
            if (!reduceMotion) draw();
        }

        let prog = 0;
        const tick = setInterval(() => {
            prog += Math.random() * 14 + 4;
            if (prog >= 100) { prog = 100; clearInterval(tick); finish(); }
            if (bar) bar.style.width = prog + "%";
            if (percent) percent.textContent = Math.floor(prog) + "%";
        }, 160);

        function finish() {
            setTimeout(() => {
                loader.classList.add("is-hidden");
                document.body.classList.remove("is-locked");
                cancelAnimationFrame(rafId);
                if (window.AOS) window.AOS.refresh();
            }, 450);
        }

        // safety timeout
        document.body.classList.add("is-locked");
        setTimeout(() => { if (!loader.classList.contains("is-hidden")) finish(); }, 5000);
    }

    /* ---------------- NAVIGATION ---------------- */
    function initNav() {
        const nav = $("#nav");
        const toggle = $("#navToggle");
        const moreWrap = $("#navMore");
        const moreBtn = $("#navMoreBtn");
        const moreLinks = $$(".nav__menu-link");
        const topLinks = $$(".nav__link:not(.nav__link--more)");
        const allNavTargets = [...topLinks, ...moreLinks];

        const moreSectionIds = moreLinks.map((l) => l.getAttribute("href").slice(1));

        function closeMore() {
            if (moreWrap) moreWrap.classList.remove("is-open");
            if (moreBtn) moreBtn.setAttribute("aria-expanded", "false");
        }

        function closeMobileNav() {
            nav.classList.remove("is-open");
            if (toggle) {
                toggle.setAttribute("aria-expanded", "false");
                toggle.setAttribute("aria-label", "Open menu");
            }
            document.body.classList.remove("is-locked");
            closeMore();
        }

        window.addEventListener("scroll", () => {
            nav.classList.toggle("is-scrolled", window.scrollY > 40);
        }, { passive: true });

        if (toggle) {
            toggle.addEventListener("click", () => {
                const open = nav.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", String(open));
                toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
                document.body.classList.toggle("is-locked", open);
                if (!open) closeMore();
            });
        }

        if (moreBtn && moreWrap) {
            moreBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const open = moreWrap.classList.toggle("is-open");
                moreBtn.setAttribute("aria-expanded", String(open));
            });
        }

        document.addEventListener("click", (e) => {
            if (moreWrap && !moreWrap.contains(e.target)) closeMore();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMore();
        });

        allNavTargets.forEach((l) => l.addEventListener("click", closeMobileNav));

        // active section spy
        const sections = $$("main section[id]");
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((en) => {
                    if (en.isIntersecting) {
                        const id = en.target.id;
                        topLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
                        moreLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
                        if (moreBtn) {
                            moreBtn.classList.toggle("is-active", moreSectionIds.includes(id));
                        }
                    }
                });
            }, { rootMargin: "-45% 0px -50% 0px" });
            sections.forEach((s) => io.observe(s));
        }
    }

    /* ---------------- RESEARCH CARDS ---------------- */
    function initResearch() {
        const grid = $("#researchGrid");
        if (!grid || !D.RESEARCH_AREAS) return;
        grid.innerHTML = D.RESEARCH_AREAS.map((a) => `
            <article class="research-card" data-cursor="magnetic">
                <div class="research-card__icon">${a.icon}</div>
                <h3>${a.title}</h3>
                <p>${a.desc}</p>
                <div class="research-card__bar"><i data-w="${a.weight}"></i></div>
            </article>
        `).join("");

        // Fill bars when they scroll into view (independent of GSAP)
        const bars = $$(".research-card__bar i", grid);
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((en) => {
                    if (en.isIntersecting) {
                        en.target.style.width = (en.target.dataset.w || "70") + "%";
                        io.unobserve(en.target);
                    }
                });
            }, { threshold: 0.3 });
            bars.forEach((b) => io.observe(b));
        } else {
            bars.forEach((b) => { b.style.width = (b.dataset.w || "70") + "%"; });
        }
    }

    /* ---------------- PROJECTS + MODAL ---------------- */
    function initProjects() {
        const grid = $("#projectsGrid");
        if (!grid || !D.PROJECTS) return;
        grid.innerHTML = D.PROJECTS.map((p, i) => `
            <article class="project-card" data-project="${i}" data-cursor="link">
                <div class="project-card__media">
                    <img src="${p.img}" alt="${p.title}" loading="lazy" />
                    <span class="project-card__tag">${p.tag}</span>
                </div>
                <div class="project-card__body">
                    <h3>${p.title}</h3>
                    <p>${p.lead}</p>
                    <span class="project-card__more">View case study</span>
                </div>
            </article>
        `).join("");

        const modal = $("#projectModal");
        const open = (i) => {
            const p = D.PROJECTS[i];
            if (!p) return;
            $("#modalHero").style.backgroundImage = `linear-gradient(180deg, rgba(5,8,22,0.1), rgba(5,8,22,0.7)), url('${p.img}')`;
            $("#modalTag").textContent = p.tag;
            $("#modalTitle").textContent = p.title;
            $("#modalLead").textContent = p.lead;
            $("#modalGrid").innerHTML = `
                <div class="modal__cell"><h4>Objectives</h4><p>${p.objectives}</p></div>
                <div class="modal__cell"><h4>Funding</h4><p>${p.funding}</p></div>
                <div class="modal__cell"><h4>Timeline</h4><p>${p.timeline}</p></div>
                <div class="modal__cell"><h4>Results</h4><p>${p.results}</p></div>
                <div class="modal__cell"><h4>Impact</h4><p>${p.impact}</p></div>
            `;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("is-locked");
        };
        const close = () => {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("is-locked");
        };

        grid.addEventListener("click", (e) => {
            const card = e.target.closest("[data-project]");
            if (card) open(parseInt(card.dataset.project, 10));
        });
        modal.querySelectorAll("[data-modal-close]").forEach((el) => el.addEventListener("click", close));
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }

    /* ---------------- GLOBAL IMPACT COUNTRIES ---------------- */
    function initCountries() {
        const ul = $("#impactCountries");
        if (!ul || !D.COUNTRIES) return;
        ul.innerHTML = D.COUNTRIES.map((c) => `
            <li class="country-row" data-cursor="link">
                <span class="country-row__flag">${c.flag}</span>
                <span class="country-row__name">${c.name}</span>
                <span class="country-row__type">${c.type}</span>
            </li>
        `).join("");
    }

    /* ---------------- SKILLS TAGS ---------------- */
    function initSkillTags() {
        const cloud = $("#skillsCloud");
        if (!cloud || !D.SKILL_TAGS) return;
        cloud.innerHTML = D.SKILL_TAGS.map((t) => `<span class="skill-tag" data-cursor="magnetic">${t}</span>`).join("");
    }

    /* ---------------- GALLERY + LIGHTBOX ---------------- */
    function initGallery() {
        const grid = $("#galleryGrid");
        if (!grid || !D.GALLERY) return;
        grid.innerHTML = D.GALLERY.map((g, i) => `
            <figure class="gallery__item" data-index="${i}" data-cursor="link">
                <img src="${g.img}" alt="${g.cap}" loading="lazy" />
                <figcaption class="gallery__cap">${g.cap}</figcaption>
            </figure>
        `).join("");

        const lb = $("#lightbox");
        const lbImg = $("#lightboxImg");
        const lbCap = $("#lightboxCaption");
        let cur = 0;

        const show = (i) => {
            cur = (i + D.GALLERY.length) % D.GALLERY.length;
            lbImg.src = D.GALLERY[cur].img;
            lbImg.alt = D.GALLERY[cur].cap;
            lbCap.textContent = D.GALLERY[cur].cap;
        };
        const open = (i) => { show(i); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); document.body.classList.add("is-locked"); };
        const close = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); document.body.classList.remove("is-locked"); };

        grid.addEventListener("click", (e) => {
            const fig = e.target.closest("[data-index]");
            if (fig) open(parseInt(fig.dataset.index, 10));
        });
        $("[data-lightbox-close]").addEventListener("click", close);
        $("[data-lightbox-prev]").addEventListener("click", () => show(cur - 1));
        $("[data-lightbox-next]").addEventListener("click", () => show(cur + 1));
        document.addEventListener("keydown", (e) => {
            if (!lb.classList.contains("is-open")) return;
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") show(cur - 1);
            if (e.key === "ArrowRight") show(cur + 1);
        });
    }

    /* ---------------- CHARTS ---------------- */
    function initCharts() {
        if (typeof Chart === "undefined") return;
        Chart.defaults.color = "#aebdd6";
        Chart.defaults.font.family = "'Inter', sans-serif";
        const gridColor = "rgba(255,255,255,0.06)";

        // Research focus doughnut
        const rc = $("#researchChart");
        if (rc && D.RESEARCH_AREAS) {
            new Chart(rc, {
                type: "doughnut",
                data: {
                    labels: D.RESEARCH_AREAS.map((a) => a.title),
                    datasets: [{
                        data: D.RESEARCH_AREAS.map((a) => a.weight),
                        backgroundColor: ["#0077B6", "#0A9396", "#2D6A4F", "#FFD166", "#48cae4", "#52b788", "#90e0ef", "#ffb347"],
                        borderColor: "#050816", borderWidth: 2, hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: "62%",
                    plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 12, font: { size: 11 } } } },
                    animation: { animateRotate: !reduceMotion, duration: reduceMotion ? 0 : 1400 }
                }
            });
        }

        // Output over time line chart
        const oc = $("#outputChart");
        if (oc) {
            new Chart(oc, {
                type: "line",
                data: {
                    labels: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
                    datasets: [{
                        label: "Publications",
                        data: [2, 3, 3, 5, 6, 5, 7, 6, 8, 8],
                        borderColor: "#0A9396", backgroundColor: "rgba(10,147,150,0.18)",
                        fill: true, tension: 0.4, pointBackgroundColor: "#FFD166", pointRadius: 4
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { grid: { color: gridColor } }, y: { grid: { color: gridColor }, beginAtZero: true } },
                    animation: { duration: reduceMotion ? 0 : 1400 }
                }
            });
        }

        // Leadership competency radar
        const sc = $("#competenceChart");
        if (sc && D.COMPETENCE_RADAR) {
            new Chart(sc, {
                type: "radar",
                data: {
                    labels: D.COMPETENCE_RADAR.labels,
                    datasets: [{
                        label: "Proficiency",
                        data: D.COMPETENCE_RADAR.values,
                        backgroundColor: "rgba(0,119,182,0.25)", borderColor: "#0077B6",
                        pointBackgroundColor: "#FFD166", borderWidth: 2
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        r: {
                            angleLines: { color: gridColor }, grid: { color: gridColor },
                            pointLabels: { font: { size: window.innerWidth < 480 ? 9 : 11 } },
                            ticks: { display: false, stepSize: 25 }, suggestedMin: 0, suggestedMax: 100
                        }
                    },
                    animation: { duration: reduceMotion ? 0 : 1400 }
                }
            });
        }
    }

    /* ---------------- FILL-ON-VIEW (meters, bars, rings) ---------------- */
    function observeFills(nodes) {
        const fill = (el) => {
            const v = el.dataset.fill || "0";
            if (el.classList.contains("tech-ring")) el.style.setProperty("--p", v);
            else el.style.width = v + "%";
        };
        if (!("IntersectionObserver" in window)) { nodes.forEach(fill); return; }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => { if (en.isIntersecting) { fill(en.target); io.unobserve(en.target); } });
        }, { threshold: 0.25 });
        nodes.forEach((n) => io.observe(n));
    }

    /* ---------------- FURTHER EDUCATION & TRAINING ---------------- */
    function initTrainings() {
        const wrap = $("#trainTimeline");
        if (!wrap || !D.TRAININGS) return;
        const path = $("#trainPath");
        wrap.insertAdjacentHTML("beforeend", D.TRAININGS.map((t) => `
            <div class="train-item" data-aos="fade-up">
                <div class="train-card" data-cursor="link">
                    <div class="train-card__head">
                        <span class="train-card__badge">${t.badge}</span>
                        <span class="train-card__title">${t.title}</span>
                        <span class="train-card__flag" title="${t.country}">${t.flag}</span>
                        <span class="train-card__chev">▾</span>
                    </div>
                    <div class="train-card__body">
                        <p class="train-card__org">${t.org} · ${t.country}</p>
                        <p class="train-card__desc">${t.desc}</p>
                    </div>
                </div>
            </div>
        `).join(""));

        wrap.addEventListener("click", (e) => {
            const item = e.target.closest(".train-item");
            if (item) item.classList.toggle("is-open");
        });

        if (path) {
            const update = () => {
                const r = wrap.getBoundingClientRect();
                const passed = Math.min(Math.max(window.innerHeight * 0.5 - r.top, 0), r.height);
                path.style.height = (passed / r.height * 100) + "%";
            };
            window.addEventListener("scroll", update, { passive: true });
            update();
        }
    }

    /* ---------------- TEACHING & CAPACITY BUILDING ---------------- */
    function initTeaching() {
        const stats = $("#teachingStats");
        const grid = $("#teachingGrid");
        if (stats && D.TEACHING_STATS) {
            stats.innerHTML = D.TEACHING_STATS.map((s, i) => `
                <div class="teach-stat" data-aos="zoom-in" data-aos-delay="${i * 80}">
                    <span class="teach-stat__num" data-count="${s.num}" data-suffix="${s.suffix}">0</span>
                    <span class="teach-stat__label">${s.label}</span>
                </div>
            `).join("");
        }
        if (grid && D.TEACHING) {
            grid.innerHTML = D.TEACHING.map((cat, ci) => `
                <div class="course-cat" data-aos="fade-up" data-aos-delay="${ci * 80}">
                    <div class="course-cat__head">
                        <span class="course-cat__icon">${cat.icon}</span>
                        <span class="course-cat__title">${cat.category}</span>
                        <span class="course-cat__count">${cat.courses.length} course${cat.courses.length > 1 ? "s" : ""}</span>
                    </div>
                    ${cat.courses.map((c) => `
                        <div class="course-row">
                            <button class="course-row__btn" type="button" data-cursor="link">
                                <span class="course-row__name">${c.name}</span>
                            </button>
                            <p class="course-row__note">${c.note}</p>
                        </div>
                    `).join("")}
                </div>
            `).join("");

            grid.addEventListener("click", (e) => {
                const btn = e.target.closest(".course-row__btn");
                if (btn) btn.parentElement.classList.toggle("is-open");
            });
        }
        if (window.refreshCounters) window.refreshCounters();
    }

    /* ---------------- PERSONAL SKILLS & COMPETENCES ---------------- */
    function initCompetences() {
        const cards = $("#competenceCards");
        const langs = $("#languageBars");
        if (cards && D.COMPETENCES) {
            cards.innerHTML = D.COMPETENCES.map((c) => `
                <div class="score-card" data-cursor="magnetic">
                    <div class="score-card__head">
                        <span class="score-card__icon">${c.icon}</span>
                        <span class="score-card__title">${c.group}</span>
                    </div>
                    <div class="score-card__items">
                        ${c.items.map((i) => `<span class="score-chip">${i}</span>`).join("")}
                    </div>
                </div>
            `).join("");
        }
        if (langs && D.LANGUAGES) {
            langs.innerHTML = D.LANGUAGES.map((l) => `
                <div class="lang">
                    <div class="lang__head">
                        <span class="lang__flag">${l.flag}</span>
                        <span class="lang__name">${l.name}</span>
                        <span class="lang__levels">Speaking ${l.levels.Speaking} · Reading ${l.levels.Reading} · Writing ${l.levels.Writing} · Listening ${l.levels.Listening}</span>
                    </div>
                    <div class="lang__bar"><i data-fill="${l.score}"></i></div>
                </div>
            `).join("");
            observeFills($$(".lang__bar i", langs));
        }
    }

    /* ---------------- SKILLS & COMPETENCIES (EXPERTISE) ---------------- */
    function initExpertise() {
        const grid = $("#expertiseGrid");
        if (!grid || !D.EXPERTISE) return;
        grid.innerHTML = D.EXPERTISE.map((g, gi) => `
            <div class="exp-group" data-aos="fade-up" data-aos-delay="${(gi % 3) * 80}">
                <div class="exp-group__head">
                    <span class="exp-group__icon">${g.icon}</span>
                    <span class="exp-group__title">${g.group}</span>
                </div>
                ${g.items.map((it) => `
                    <div class="meter">
                        <div class="meter__top"><span class="meter__name">${it.name}</span><span class="meter__val">${it.level}%</span></div>
                        <div class="meter__track"><span class="meter__fill" data-fill="${it.level}"></span></div>
                    </div>
                `).join("")}
            </div>
        `).join("");
        observeFills($$(".meter__fill", grid));
    }

    /* ---------------- SPECIALIZED SOFTWARE & TECHNICAL TOOLS ---------------- */
    function initTech() {
        const grid = $("#techGrid");
        if (!grid || !D.TECH_STACK) return;
        grid.innerHTML = D.TECH_STACK.map((cat, ci) => `
            <div class="tech-cat" data-aos="fade-up" data-aos-delay="${(ci % 4) * 70}" data-cursor="magnetic">
                <div class="tech-cat__head">
                    <span class="tech-cat__icon">${cat.icon}</span>
                    <span class="tech-cat__title">${cat.group}</span>
                </div>
                ${cat.tools.map((t) => `
                    <div class="tech-tool">
                        <span class="tech-ring" data-fill="${t.level}">
                            <span class="tech-ring__inner">${t.level}%</span>
                        </span>
                        <span class="tech-tool__name">${t.name}</span>
                    </div>
                `).join("")}
            </div>
        `).join("");
        observeFills($$(".tech-ring", grid));
    }

    /* ---------------- CONTACT FORM ---------------- */
    function initForm() {
        const form = $("#contactForm");
        if (!form) return;
        const btn = $("#submitBtn");
        const note = $("#formNote");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            note.textContent = "";
            // basic validation
            const name = $("#cName"), email = $("#cEmail"), msg = $("#cMessage");
            const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
            if (!name.value.trim() || !emailOk || !msg.value.trim()) {
                note.style.color = "#ff8a8a";
                note.textContent = "Please complete all required fields with a valid email.";
                return;
            }
            note.style.color = "";
            btn.classList.add("is-loading");
            setTimeout(() => {
                btn.classList.remove("is-loading");
                btn.classList.add("is-done");
                note.textContent = "Thank you — your message has been sent. Dr. Goshu will respond soon.";
                form.reset();
                setTimeout(() => btn.classList.remove("is-done"), 2600);
            }, 1500);
        });
    }

    /* ---------------- BACK TO TOP ---------------- */
    function initBackToTop() {
        const btn = $("#backToTop");
        if (!btn) return;

        const update = () => {
            btn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.7);
        };

        window.addEventListener("scroll", update, { passive: true });
        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
        update();
    }

    /* ---------------- AOS + misc ---------------- */
    function initMisc() {
        if (window.AOS) {
            window.AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 80, disable: reduceMotion });
        }
        const y = $("#year");
        if (y) y.textContent = new Date().getFullYear();

        // smooth-scroll for in-page anchors (respects reduced motion via CSS)
        $$('a[href^="#"]').forEach((a) => {
            a.addEventListener("click", (e) => {
                const id = a.getAttribute("href");
                if (id.length < 2) return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            });
        });
    }

    ready(function () {
        // Land on the home/hero section on load (ignore restored scroll & stray hash)
        if (!location.hash || location.hash === "#hero") window.scrollTo(0, 0);
        initLoader();
        initNav();
        initResearch();
        initProjects();
        initCountries();
        initSkillTags();
        initTrainings();
        initTeaching();
        initCompetences();
        initExpertise();
        initTech();
        initGallery();
        initForm();
        initBackToTop();
        initMisc();
        // charts after a tick (Chart.js is deferred)
        setTimeout(initCharts, 100);
        // refresh cursor targets for injected nodes
        if (window.refreshCursorTargets) window.refreshCursorTargets();
        if (window.AOS) window.AOS.refresh();
    });
})();
