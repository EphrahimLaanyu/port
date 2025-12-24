import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero = () => {
  const containerRef = useRef(null);
  const portalRef = useRef(null);
  const heroContentRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // --- SETUP ---
    // Start with the Hero content scaled down (to look like a preview)
    gsap.set(heroContentRef.current, { scale: 1.2, transformOrigin: "center center" });

    // --- PHASE 1: TEXT ENTRANCE ---
    tl.from(".split-text", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.05,
      ease: "power4.out",
      delay: 0.2
    });

    // --- PHASE 2: THE SPLIT & PREVIEW ---
    tl.addLabel("split");
    
    // 1. Split the text apart
    tl.to(".text-left", { x: "-15vw", duration: 1.5, ease: "power4.inOut" }, "split");
    tl.to(".text-right", { x: "15vw", duration: 1.5, ease: "power4.inOut" }, "split");

    // 2. Open the Portal to a "Square Preview" size
    tl.to(portalRef.current, {
      width: "35vh",
      height: "45vh", // Portrait aspect ratio for a "magazine" feel
      duration: 1.5,
      ease: "power4.inOut"
    }, "split");

    // 3. Briefly pause to admire the preview (Optional tension)
    tl.to({}, { duration: 0.2 }); 

    // --- PHASE 3: THE FULL REVEAL ---
    tl.addLabel("reveal");

    // 4. Expand Portal to fill screen
    tl.to(portalRef.current, {
      width: "150vw", // Go larger than screen to ensure coverage
      height: "150vh",
      duration: 1.8,
      ease: "expo.inOut"
    }, "reveal");

    // 5. Fade out and move text further away
    tl.to(".split-text", {
      opacity: 0,
      x: (i, target) => target.classList.contains("text-left") ? "-30vw" : "30vw",
      duration: 0.5,
      ease: "power2.in"
    }, "reveal");

    // 6. Zoom the Hero Content into place (from 1.2 to 1)
    tl.to(heroContentRef.current, {
      scale: 1,
      duration: 1.8,
      ease: "expo.inOut"
    }, "reveal");

    // 7. Hide portal overlay completely for performance
    tl.set(".preloader-overlay", { display: "none" });

    // --- PHASE 4: HERO ANIMATIONS (Grid Lines & Text) ---
    // Animate the grid lines appearing
    tl.from(".border-anim-v", { scaleY: 0, transformOrigin: "top", duration: 1, ease: "expo.out", stagger: 0.1 }, "-=0.5");
    tl.from(".border-anim-h", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "expo.out" }, "<");
    
    // Animate main text rising
    tl.from(".hero-char", {
      y: "110%", skewY: 7, duration: 1.2, stagger: 0.05, ease: "power4.out"
    }, "-=0.8");

    // Reveal badge and globe
    tl.from([".wireframe-globe", ".stamp-badge", ".floating-socials"], {
      opacity: 0, scale: 0.9, duration: 1.5, ease: "power2.out"
    }, "-=1");

  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <style>{`
        /* --- FONTS --- */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@1,300&display=swap');

        :root {
          --bg-color: #F2F0E9;       
          --text-color: #1A1A1A;     
          --accent-red: #8a0303;     
          --line-color: #CCC8BC;     
          --silver: #888888;
          --loader-bg: #0F0F0F;
          
          --font-display: 'Playfair Display', serif;
          --font-tech: 'Inter', sans-serif;
          --font-script: 'Cormorant Garamond', serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: var(--font-tech);
          overflow: hidden; 
          height: 100vh;
          width: 100vw;
        }

        /* --- PRELOADER OVERLAY --- */
        .preloader-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none; /* Let clicks pass through once hidden */
        }

        /* The Portal: A div with a massive box-shadow that acts as the "black screen" */
        .portal-window {
          width: 0px; height: 0px; /* Starts closed */
          box-shadow: 0 0 0 200vmax var(--loader-bg); /* Massive shadow covers screen */
          display: flex; align-items: center; justify-content: center;
          position: relative;
          z-index: 2;
        }

        /* The Split Text container sits ON TOP of the portal (z-index 3) */
        .loader-text-container {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0; /* No gap initially */
          z-index: 3;
          width: 100%;
          pointer-events: none;
        }

        .split-text {
          font-family: var(--font-display);
          font-size: 8vw; /* Large entrance text */
          color: #F2F0E9; /* Paper color text on black bg */
          letter-spacing: -0.02em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        
        .text-left { text-align: right; }
        .text-right { text-align: left; }

        /* --- HERO WRAPPER (This gets zoomed) --- */
        .hero-zoom-wrapper {
          width: 100vw; height: 100vh;
          transform-origin: center center;
          overflow: hidden;
        }

        /* --- MAIN PAGE STYLES (Architectural Grid) --- */
        .bg-grid-pattern {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-size: 60px 60px;
          background-image:
            linear-gradient(to right, rgba(26, 26, 26, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 26, 26, 0.02) 1px, transparent 1px);
          pointer-events: none; z-index: 0;
        }

        .grain-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0.08; mix-blend-mode: multiply; pointer-events: none; z-index: 100;
        }

        .magazine-container {
          position: relative; z-index: 2; width: 100%; height: 100%;
          display: grid;
          grid-template-columns: 80px 1fr; 
          grid-template-rows: 80px 1fr 60px; 
        }

        /* Borders & Animation Helpers */
        .border-r, .border-b, .border-t, .border-l { position: relative; }
        .border-anim-h { width: 100%; height: 1px; background: var(--line-color); position: absolute; }
        .border-anim-v { height: 100%; width: 1px; background: var(--line-color); position: absolute; }
        
        /* Specific positioning for border animations */
        .b-bottom { bottom: 0; left: 0; transform-origin: left; }
        .b-right { top: 0; right: 0; transform-origin: top; }
        .b-left { top: 0; left: 0; transform-origin: top; }
        .b-top { top: 0; left: 0; transform-origin: left; }

        .crosshair::after {
          content: '+'; position: absolute; bottom: -9px; right: -6px;
          color: var(--text-color); font-weight: 300; font-size: 14px; z-index: 10;
        }

        /* Header */
        .header-bar { grid-column: 1 / -1; grid-row: 1; display: flex; align-items: center; justify-content: space-between; position: relative; }
        .header-logo { width: 80px; height: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; position: relative; }
        .header-meta-area { flex-grow: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 3rem; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; color: var(--text-color); }
        .header-menu { width: 80px; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; }
        .hamburger span { display: block; height: 1px; background: var(--text-color); margin-bottom: 4px; }
        .hamburger span:nth-child(1) { width: 24px; } .hamburger span:nth-child(2) { width: 16px; }

        /* Main Content */
        .cell-main { grid-column: 2; grid-row: 2; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
        .bg-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop'); background-size: cover; background-position: center; opacity: 0.06; filter: grayscale(100%) contrast(120%); z-index: 0; }
        .wireframe-globe { position: absolute; width: 35vw; height: 35vw; border: 1px solid rgba(26,26,26,0.1); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
        .globe-inner { position: absolute; top: 15%; left: 15%; width: 70%; height: 70%; border: 1px solid rgba(138, 3, 3, 0.1); border-radius: 50%; }

        /* Text Masking */
        .title-mask { overflow: hidden; display: flex; justify-content: center;}
        .title-wrapper { position: relative; z-index: 10; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .hero-title { font-family: var(--font-display); font-size: 13vw; line-height: 0.85; letter-spacing: -0.05em; color: var(--text-color); white-space: nowrap; mix-blend-mode: darken; }
        .hero-title.middle { font-size: 12vw; display: flex; align-items: center; gap: 2rem; }
        .hero-title.italic { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; color: var(--accent-red); }
        .hero-title.outline { -webkit-text-stroke: 1px var(--text-color); color: transparent; }
        .separator-line { width: 120px; height: 1px; background: var(--text-color); margin: 0 1rem; }

        .floating-socials { position: absolute; right: 0; top: 50%; transform: translateY(-50%) rotate(180deg); writing-mode: vertical-rl; padding: 2rem 1.5rem; display: flex; align-items: center; gap: 3rem; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; z-index: 50; color: var(--text-color); }

        /* Sidebar & Footer */
        .cell-sidebar-l { grid-column: 1; grid-row: 2; writing-mode: vertical-rl; transform: rotate(180deg); display: flex; align-items: center; justify-content: center; padding: 2rem 0; position: relative; }
        .sidebar-text { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--silver); display: flex; gap: 2rem; }
        .sidebar-text span.active { color: var(--accent-red); font-weight: 600; }
        .cell-footer-l { grid-column: 1; grid-row: 3; position: relative; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: var(--accent-red); }
        .cell-footer-m { grid-column: 2; grid-row: 3; position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 3rem; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; }
        .stamp-badge { position: absolute; bottom: 5%; right: 5%; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; z-index: 20; }
        .stamp-circle { position: absolute; width: 100%; height: 100%; border: 1px solid var(--text-color); border-radius: 50%; animation: spin 30s linear infinite; }
        .stamp-inner-text { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
           .magazine-container { grid-template-columns: 50px 1fr; grid-template-rows: 60px 1fr 60px; }
           .hero-title { font-size: 15vw; } .hero-title.middle { font-size: 14vw; }
           .header-logo, .header-menu { width: 50px; }
           .meta-coords, .floating-socials { display: none; }
           .split-text { font-size: 12vw; }
        }
      `}</style>

      {/* --- PRELOADER --- */}
      <div className="preloader-overlay">
        
        {/* TEXT ON TOP */}
        <div className="loader-text-container">
          <span className="split-text text-left">MAI</span>
          <span className="split-text text-right">SON</span>
        </div>

        {/* PORTAL BEHIND TEXT */}
        <div ref={portalRef} className="portal-window"></div>
      </div>


      {/* --- HERO CONTENT (Zoomed into) --- */}
      <div ref={heroContentRef} className="hero-zoom-wrapper">
        <div className="bg-grid-pattern"></div>
        <div className="grain-overlay">
          <svg width="100%" height="100%">
            <filter id='noiseFilter'>
              <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/>
            </filter>
            <rect width='100%' height='100%' filter='url(#noiseFilter)'/>
          </svg>
        </div>

        <div className="magazine-container">

          {/* Header */}
          <div className="header-bar crosshair">
            <div className="border-anim-h b-bottom"></div>
            
            <div className="header-logo">
               <div className="border-anim-v b-right"></div>
               <span>O.</span>
            </div>
            
            <div className="header-meta-area">
              <span>The Portfolio</span>
              <div className="meta-coords">
                <span className="coords">1.2921° S, 36.8219° E</span>
                <span>Nairobi</span>
              </div>
            </div>
            
            <div className="header-menu">
              <div className="border-anim-v b-left"></div>
              <div className="hamburger"><span></span><span></span></div>
            </div>
          </div>

          {/* Sidebar Left */}
          <div className="cell-sidebar-l">
            <div className="border-anim-v b-right"></div>
            <div className="sidebar-text">
              <span>Fig. 01</span>
              <span className="active">Index</span>
              <span>About</span>
            </div>
          </div>

          {/* Main */}
          <div className="cell-main">
            <div className="bg-image"></div>
            <div className="wireframe-globe">
               <div className="globe-inner"></div>
            </div>

            <div className="title-wrapper">
              <div className="title-mask">
                <h1 className="hero-title hero-char">WE ARE</h1>
              </div>
              <div className="title-mask">
                <div className="hero-title middle hero-char">
                  <span className="separator-line"></span>
                  <span className="hero-title italic">THE</span>
                  <span className="separator-line"></span>
                </div>
              </div>
              <div className="title-mask">
                <h1 className="hero-title outline hero-char">ELITE</h1>
              </div>
            </div>

            <div className="stamp-badge">
              <div className="stamp-circle"></div>
              <span className="stamp-inner-text">Scroll</span>
            </div>
            
            <div className="floating-socials">
              <span>Instagram</span>
              <span>LinkedIn</span>
              <span>Email</span>
            </div>
          </div>

          {/* Footer */}
          <div className="cell-footer-l crosshair">
             <div className="border-anim-v b-right"></div>
             <div className="border-anim-h b-top"></div>
             <span>01</span>
          </div>
          
          <div className="cell-footer-m">
            <div className="border-anim-h b-top"></div>
            <span>Digital Atelier</span>
            <span>© 2025</span>
            <span>Ke</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;