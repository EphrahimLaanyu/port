import React from 'react';

const Hero = () => {
  return (
    <>
      <style>{`
        /* --- FONTS --- */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@1,300&display=swap');

        :root {
          --bg-color: #F2F0E9;       
          --text-color: #1A1A1A;     
          --accent-red: #8a0303;     
          --line-color: #CCC8BC;     
          --silver: #888888;         
          
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

        /* --- 1. TEXTURE --- */
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

        .vignette {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle, transparent 40%, rgba(26,26,26,0.03) 100%);
          pointer-events: none; z-index: 1;
        }

        /* --- 2. UPDATED GRID LAYOUT --- */
        .magazine-container {
          position: relative;
          z-index: 2;
          width: 100vw; 
          height: 100vh;
          display: grid;
          /* UPDATED: Only 2 columns (Sidebar Left | Main Content) */
          grid-template-columns: 80px 1fr; 
          grid-template-rows: 80px 1fr 60px; 
        }

        /* --- BORDERS --- */
        .border-r { border-right: 1px solid var(--line-color); }
        .border-b { border-bottom: 1px solid var(--line-color); }
        .border-t { border-top: 1px solid var(--line-color); }

        .crosshair::after {
          content: '+'; position: absolute; bottom: -9px; right: -6px;
          color: var(--text-color); font-weight: 300; font-size: 14px; z-index: 10;
        }

        /* --- HEADER (Full Width) --- */
        .header-bar {
          grid-column: 1 / -1; 
          grid-row: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--line-color);
          position: relative;
        }

        .header-logo {
          width: 80px; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 1.5rem; font-weight: 700;
          border-right: 1px solid var(--line-color);
          flex-shrink: 0;
        }

        .header-meta-area {
          flex-grow: 1;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 3rem;
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.25em; 
          color: var(--text-color);
        }
        .meta-coords { display: flex; gap: 2rem; color: var(--silver); }
        
        /* Menu is now part of the flex header on the far right */
        .header-menu {
          width: 80px; height: 100%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          border-left: 1px solid var(--line-color);
          flex-shrink: 0;
        }
        .hamburger { display: flex; flex-direction: column; gap: 4px; align-items: flex-end;}
        .hamburger span { display: block; height: 1px; background: var(--text-color); }
        .hamburger span:nth-child(1) { width: 24px; }
        .hamburger span:nth-child(2) { width: 16px; }

        /* --- SIDEBAR LEFT --- */
        .cell-sidebar-l {
          grid-column: 1; grid-row: 2;
          writing-mode: vertical-rl; transform: rotate(180deg);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 0;
          border-right: 1px solid var(--line-color);
        }
        .sidebar-text {
          font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; 
          color: var(--silver); display: flex; gap: 2rem;
        }
        .sidebar-text span.active { color: var(--accent-red); font-weight: 600; }

        /* --- MAIN STAGE (Now covers entire right side) --- */
        .cell-main {
          grid-column: 2; grid-row: 2; /* Spans to edge */
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .bg-image {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-image: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop');
          background-size: cover; background-position: center;
          opacity: 0.06; filter: grayscale(100%) contrast(120%); z-index: 0;
        }

        .wireframe-globe {
          position: absolute;
          width: 35vw; height: 35vw;
          border: 1px solid rgba(26,26,26,0.1);
          border-radius: 50%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }
        .wireframe-globe::before {
          content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 1px;
          background: rgba(26,26,26,0.1); transform: translateY(-50%);
        }
        .wireframe-globe::after {
          content: ''; position: absolute; left: 50%; top: 0; height: 100%; width: 1px;
          background: rgba(26,26,26,0.1); transform: translateX(-50%);
        }
        .globe-inner {
          position: absolute; top: 15%; left: 15%; width: 70%; height: 70%;
          border: 1px solid rgba(138, 3, 3, 0.1); border-radius: 50%;
        }

        .title-wrapper {
          position: relative; z-index: 10;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: 13vw; /* Increased size since we have more room */
          line-height: 0.85;
          letter-spacing: -0.05em;
          color: var(--text-color);
          white-space: nowrap;
          mix-blend-mode: darken;
        }

        .hero-title.middle {
          font-size: 12vw;
          display: flex; align-items: center; gap: 2rem;
        }
        
        .hero-title.italic {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300; color: var(--accent-red);
        }

        .separator-line {
          width: 120px; height: 1px; background: var(--text-color); margin: 0 1rem;
        }

        .hero-title.outline {
          -webkit-text-stroke: 1px var(--text-color);
          color: transparent;
        }

        .stamp-badge {
          position: absolute;
          bottom: 5%; right: 5%;
          width: 140px; height: 140px;
          display: flex; align-items: center; justify-content: center;
          z-index: 20;
        }
        .stamp-circle {
          position: absolute; width: 100%; height: 100%;
          border: 1px solid var(--text-color); border-radius: 50%;
          animation: spin 30s linear infinite;
        }
        .stamp-inner-text {
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;
        }

        /* --- FLOATING RIGHT SIDEBAR ELEMENTS --- */
        /* Instead of a dedicated column, these float on the right edge */
        .floating-socials {
          position: absolute;
          right: 0; top: 50%;
          transform: translateY(-50%) rotate(180deg);
          writing-mode: vertical-rl;
          padding: 2rem 1.5rem; /* Space from edge */
          display: flex; align-items: center; gap: 3rem;
          font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
          z-index: 50;
          color: var(--text-color);
        }
        .floating-socials span:hover { color: var(--accent-red); cursor: pointer; }

        /* --- FOOTER (Matches Grid) --- */
        .cell-footer-l { 
          grid-column: 1; grid-row: 3; 
          border-right: 1px solid var(--line-color); border-top: 1px solid var(--line-color);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem; color: var(--accent-red);
        }
        
        .cell-footer-m { 
          grid-column: 2; grid-row: 3; 
          border-top: 1px solid var(--line-color);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 3rem;
          font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .magazine-container { grid-template-columns: 50px 1fr; grid-template-rows: 60px 1fr 60px; }
          .hero-title { font-size: 15vw; }
          .hero-title.middle { font-size: 14vw; }
          .header-meta-area { padding: 0 1rem; font-size: 0.5rem; justify-content: center; }
          .header-logo, .header-menu { width: 50px; }
          .wireframe-globe { width: 80vw; height: 80vw; }
          .stamp-badge { width: 80px; height: 80px; bottom: 2%; right: 2%; }
          .meta-coords { display: none; }
          .floating-socials { display: none; } /* Hide socials on mobile or move to footer */
        }
      `}</style>

      <div className="bg-grid-pattern"></div>
      <div className="grain-overlay">
        <svg width="100%" height="100%">
          <filter id='noiseFilter'>
            <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/>
          </filter>
          <rect width='100%' height='100%' filter='url(#noiseFilter)'/>
        </svg>
      </div>
      <div className="vignette"></div>

      <div className="magazine-container">

        {/* HEADER */}
        <div className="header-bar crosshair">
          <div className="header-logo"><span>O.</span></div>
          <div className="header-meta-area">
            <span>The Portfolio</span>
            <div className="meta-coords">
              <span className="coords">1.2921° S, 36.8219° E</span>
              <span>Nairobi</span>
            </div>
          </div>
          <div className="header-menu">
            <div className="hamburger"><span></span><span></span></div>
          </div>
        </div>

        {/* SIDEBAR LEFT */}
        <div className="cell-sidebar-l">
          <div className="sidebar-text">
            <span>Fig. 01</span>
            <span className="active">Index</span>
            <span>About</span>
          </div>
        </div>

        {/* MAIN CONTENT (Spans to Right Edge) */}
        <div className="cell-main">
          
          <div className="bg-image"></div>
          
          <div className="wireframe-globe">
             <div className="globe-inner"></div>
          </div>

          <div className="title-wrapper">
            <h1 className="hero-title">WE ARE</h1>
            
            <div className="hero-title middle">
              <span className="separator-line"></span>
              <span className="hero-title italic">THE</span>
              <span className="separator-line"></span>
            </div>

            <h1 className="hero-title outline">ELITE</h1>
          </div>

          <div className="stamp-badge">
            <div className="stamp-circle"></div>
            <span className="stamp-inner-text">Scroll</span>
          </div>
          
          {/* FLOATING SOCIALS (Overlay on the right edge) */}
          <div className="floating-socials">
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>Email</span>
          </div>

        </div>

        {/* FOOTER */}
        <div className="cell-footer-l crosshair">
           <span>01</span>
        </div>
        
        <div className="cell-footer-m">
          <span>Digital Atelier</span>
          <span>© 2025</span>
          <span>Ke</span>
        </div>

      </div>
    </>
  );
};

export default Hero;