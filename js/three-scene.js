/* =====================================================================
   three-scene.js — Hero Earth scene + interactive global-impact globe
   Requires THREE (loaded via CDN). Degrades gracefully if unavailable.
   ===================================================================== */
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function ready(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }

    /* lat/lon -> 3D vector on sphere of given radius */
    function latLonToVec3(lat, lon, r) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
    }

    /* ============ HERO SCENE ============ */
    function initHero() {
        const canvas = document.getElementById("heroCanvas");
        if (!canvas || typeof THREE === "undefined") return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 13);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const group = new THREE.Group();
        scene.add(group);

        // Position the Earth toward the right side of the hero
        group.position.x = 3.2;

        // ---- Earth (wireframe + glow sphere) ----
        const earthRadius = 3.4;
        const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);

        const earthMat = new THREE.MeshPhongMaterial({
            color: 0x0a3a66,
            emissive: 0x021d33,
            shininess: 18,
            transparent: true,
            opacity: 0.92
        });
        const earth = new THREE.Mesh(earthGeo, earthMat);
        group.add(earth);

        const wireMat = new THREE.MeshBasicMaterial({ color: 0x0a9396, wireframe: true, transparent: true, opacity: 0.25 });
        const wire = new THREE.Mesh(new THREE.SphereGeometry(earthRadius + 0.02, 32, 32), wireMat);
        group.add(wire);

        // ---- Continents dot cloud (procedural noise blobs) ----
        const dotGeo = new THREE.BufferGeometry();
        const dotCount = 1400;
        const dotPos = new Float32Array(dotCount * 3);
        for (let i = 0; i < dotCount; i++) {
            const lat = (Math.random() * 180 - 90);
            const lon = (Math.random() * 360 - 180);
            // bias to clustered "land" patches
            const v = latLonToVec3(lat, lon, earthRadius + 0.05);
            dotPos[i * 3] = v.x; dotPos[i * 3 + 1] = v.y; dotPos[i * 3 + 2] = v.z;
        }
        dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
        const dotMat = new THREE.PointsMaterial({ color: 0x2d6a4f, size: 0.06, transparent: true, opacity: 0.7 });
        const dots = new THREE.Points(dotGeo, dotMat);
        group.add(dots);

        // ---- Atmospheric glow ----
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x0077b6, transparent: true, opacity: 0.12, side: THREE.BackSide });
        const glow = new THREE.Mesh(new THREE.SphereGeometry(earthRadius + 0.6, 32, 32), glowMat);
        group.add(glow);

        // ---- Flowing "river" particle ring ----
        const riverCount = 900;
        const riverGeo = new THREE.BufferGeometry();
        const riverPos = new Float32Array(riverCount * 3);
        const riverData = [];
        for (let i = 0; i < riverCount; i++) {
            const a = Math.random() * Math.PI * 2;
            const radius = earthRadius + 0.8 + Math.random() * 2.2;
            const tilt = (Math.random() - 0.5) * 1.4;
            riverData.push({ a, radius, tilt, speed: 0.002 + Math.random() * 0.004 });
            riverPos[i * 3] = Math.cos(a) * radius;
            riverPos[i * 3 + 1] = tilt * radius * 0.4;
            riverPos[i * 3 + 2] = Math.sin(a) * radius;
        }
        riverGeo.setAttribute("position", new THREE.BufferAttribute(riverPos, 3));
        const riverMat = new THREE.PointsMaterial({ color: 0xffd166, size: 0.05, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
        const river = new THREE.Points(riverGeo, riverMat);
        group.add(river);

        // ---- Distant starfield ----
        const starGeo = new THREE.BufferGeometry();
        const starCount = 600;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            starPos[i * 3] = (Math.random() - 0.5) * 60;
            starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
        }
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x9fc6ff, size: 0.06, transparent: true, opacity: 0.6 })));

        // ---- Lighting ----
        scene.add(new THREE.AmbientLight(0x335577, 0.8));
        const key = new THREE.DirectionalLight(0x66d3ff, 1.1);
        key.position.set(5, 3, 6);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xffd166, 0.5);
        rim.position.set(-6, -2, -4);
        scene.add(rim);

        // ---- Interaction (parallax) ----
        let targetX = 0, targetY = 0, curX = 0, curY = 0;
        window.addEventListener("pointermove", (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 0.5;
            targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
        });

        function resize() {
            const hero = canvas.parentElement;
            const w = hero.clientWidth, h = hero.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            // shift earth more central on narrow screens
            group.position.x = w < 900 ? 0 : 3.2;
            group.position.y = w < 900 ? -1.5 : 0;
        }
        window.addEventListener("resize", resize);
        resize();

        let raf;
        function animate() {
            raf = requestAnimationFrame(animate);
            const dt = reduceMotion ? 0 : 1;
            earth.rotation.y += 0.0016 * dt;
            wire.rotation.y -= 0.0009 * dt;
            dots.rotation.y += 0.0016 * dt;
            glow.rotation.y += 0.0005 * dt;

            // river flow
            if (!reduceMotion) {
                const pos = riverGeo.attributes.position.array;
                for (let i = 0; i < riverCount; i++) {
                    const d = riverData[i];
                    d.a += d.speed;
                    pos[i * 3] = Math.cos(d.a) * d.radius;
                    pos[i * 3 + 2] = Math.sin(d.a) * d.radius;
                }
                riverGeo.attributes.position.needsUpdate = true;
                river.rotation.x = 0.5;
            }

            curX += (targetX - curX) * 0.05;
            curY += (targetY - curY) * 0.05;
            group.rotation.y = curX;
            group.rotation.x = curY;

            renderer.render(scene, camera);
        }
        animate();

        // pause when tab hidden
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) cancelAnimationFrame(raf);
            else animate();
        });
    }

    /* ============ GLOBAL IMPACT GLOBE ============ */
    function initGlobe() {
        const canvas = document.getElementById("globeCanvas");
        if (!canvas || typeof THREE === "undefined" || !window.PORTFOLIO_DATA) return;
        const countries = window.PORTFOLIO_DATA.COUNTRIES;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 11);

        // Keep antialiasing off on high-DPR screens and cap the pixel ratio
        // to roughly halve the number of fragments the GPU must shade.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: dpr < 1.5, powerPreference: "low-power" });
        renderer.setPixelRatio(dpr);

        // Render textures with correct (sRGB) colours for a realistic Earth
        if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

        const group = new THREE.Group();
        scene.add(group);

        const R = 3;

        // Real Earth textures (NASA Blue Marble + topography + ocean mask)
        const texLoader = new THREE.TextureLoader();
        texLoader.setCrossOrigin("anonymous");
        const TEX = "https://unpkg.com/three-globe/example/img/";
        const earthMap = texLoader.load(TEX + "earth-blue-marble.jpg");
        const earthBump = texLoader.load(TEX + "earth-topology.png");
        const earthSpec = texLoader.load(TEX + "earth-water.png");
        if ("encoding" in earthMap) earthMap.encoding = THREE.sRGBEncoding;

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(R, 64, 64),
            new THREE.MeshPhongMaterial({
                map: earthMap,
                bumpMap: earthBump,
                bumpScale: 0.06,
                specularMap: earthSpec,
                specular: new THREE.Color(0x335577),
                shininess: 12,
                color: 0x1b3a5c
            })
        );
        group.add(sphere);

        // Soft atmospheric rim glow
        const atmos = new THREE.Mesh(
            new THREE.SphereGeometry(R + 0.5, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0x4ea8de, transparent: true, opacity: 0.12, side: THREE.BackSide })
        );
        group.add(atmos);

        const colorFor = (kind) => kind === "conf" ? 0xffd166 : kind === "train" ? 0x2d6a4f : 0x0a9396;

        // Pins + glowing arcs from Ethiopia hub
        const hub = countries.find(c => c.name === "Ethiopia") || countries[0];
        const hubVec = latLonToVec3(hub.lat, hub.lon, R);
        const pins = [];

        countries.forEach((c) => {
            const v = latLonToVec3(c.lat, c.lon, R);
            const col = colorFor(c.kind);

            const pin = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 12, 12),
                new THREE.MeshBasicMaterial({ color: col })
            );
            pin.position.copy(v);
            group.add(pin);

            const halo = new THREE.Mesh(
                new THREE.RingGeometry(0.1, 0.16, 24),
                new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
            );
            halo.position.copy(v);
            halo.lookAt(v.clone().multiplyScalar(2));
            group.add(halo);
            pins.push({ mesh: pin, halo, phase: Math.random() * Math.PI * 2 });

            // connection arc to hub
            if (c !== hub) {
                const mid = hubVec.clone().add(v).multiplyScalar(0.5);
                mid.normalize().multiplyScalar(R + 1.1);
                const curve = new THREE.QuadraticBezierCurve3(hubVec, mid, v);
                const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
                const arc = new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.35 }));
                group.add(arc);
            }
        });

        scene.add(new THREE.AmbientLight(0xb8cfff, 0.65));
        const dl = new THREE.DirectionalLight(0xffffff, 1.25);
        dl.position.set(5, 3, 5);
        scene.add(dl);
        const fill = new THREE.DirectionalLight(0x6fa8dc, 0.4);
        fill.position.set(-5, -2, -3);
        scene.add(fill);

        // drag to rotate
        let dragging = false, px = 0, py = 0, velX = 0.003, velY = 0;
        canvas.addEventListener("pointerdown", (e) => { dragging = true; px = e.clientX; py = e.clientY; });
        window.addEventListener("pointerup", () => { dragging = false; });
        window.addEventListener("pointermove", (e) => {
            if (!dragging) return;
            velX = (e.clientX - px) * 0.005;
            velY = (e.clientY - py) * 0.005;
            px = e.clientX; py = e.clientY;
        });

        function resize() {
            const wrap = canvas.parentElement;
            const w = wrap.clientWidth, h = Math.max(wrap.clientHeight, 460);
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        window.addEventListener("resize", resize);
        resize();

        let raf = null, t = 0, onScreen = true, running = false;
        function frame() {
            // Stop the loop entirely when the globe is offscreen or the tab is
            // hidden — no GPU work, no battery/RAM drain while you read elsewhere.
            if (!onScreen || document.hidden) { running = false; raf = null; return; }
            raf = requestAnimationFrame(frame);
            t += 0.03;
            if (!dragging && !reduceMotion) velX += (0.003 - velX) * 0.02;
            group.rotation.y += velX;
            group.rotation.x += velY;
            velY *= 0.92;
            group.rotation.x = Math.max(-0.6, Math.min(0.6, group.rotation.x));

            pins.forEach((p) => {
                const s = 1 + Math.sin(t + p.phase) * 0.25;
                p.halo.scale.setScalar(s);
                p.halo.material.opacity = 0.6 - (s - 1) * 1.2;
            });

            renderer.render(scene, camera);
        }
        function start() { if (!running) { running = true; frame(); } }

        // Only render while the globe is actually in the viewport.
        if ("IntersectionObserver" in window) {
            const vio = new IntersectionObserver((entries) => {
                onScreen = entries[0].isIntersecting;
                if (onScreen) start();
            }, { threshold: 0.05 });
            vio.observe(canvas);
        } else {
            onScreen = true;
        }
        start();

        document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
    }

    ready(function () {
        // slight delay so canvases have layout dimensions
        initHero();
        // globe is lower on the page — init when near viewport for perf
        const globeWrap = document.querySelector(".impact__globe");
        if (globeWrap && "IntersectionObserver" in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((en) => {
                    if (en.isIntersecting) { initGlobe(); io.disconnect(); }
                });
            }, { rootMargin: "200px" });
            io.observe(globeWrap);
        } else {
            initGlobe();
        }
    });
})();
