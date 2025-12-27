import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = () => {
  const container = useRef(null);
  const centerCluster = useRef(null);

  // ==============================================
  // GSAP ANIMATION LOGIC
  // ==============================================
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Intro Sequence
      tl.to(".marquee-mask", { scaleX: 0, duration: 1.8 })
        
        // Reveal J & E (Entry only - no continuous loop)
        .fromTo(".char-animate", 
          { y: 120, opacity: 0, rotateX: 25 }, 
          { y: 0, opacity: 1, rotateX: 0, duration: 1.6, stagger: 0.1 }, 
          "-=1.5")
      
        // Reveal Maison Block
        .fromTo(".maison-block",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" },
          "-=1.0"
        )
           
        // Draw Floor Lines
        .fromTo(".floor-line", { scaleX: 0 }, { scaleX: 1, duration: 1.5, stagger: 0.2 }, "-=1.0")
        
        // Reveal Orbs
        .fromTo(".pearl-orb", { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.6, duration: 2.5 }, "-=2.5");

      // Note: Continuous floating animation removed as requested.

      // 2. Mouse Parallax (Kept subtle 3D tilt for the whole container)
      const handleMouseMove = (e) => {
        const { clientX, clientY, innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / innerWidth;
        const y = (clientY - innerHeight / 2) / innerHeight;
        
        gsap.to(centerCluster.current, {
          rotationY: x * 8, 
          rotationX: -y * 8,
          x: x * 15,
          y: y * 15,
          duration: 1,
          ease: "power2.out"
        });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="hero-container">
      
      {/* ==============================================
          CSS STYLES (VANILLA)
      ============================================== */}
      <style>{`
        /* Reset & Base */
        * { box-sizing: border-box; }
        
        /* Layout */
        .hero-container {
          width: 100vw;
          height: 100vh;
          background-color: #EAE8E4;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        /* 3D Perspective Wrapper */
        .stage-perspective {
          perspective: 2000px;
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cluster-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          padding-bottom: 2rem;
        }

        /* Pearl Orbs */
        .pearl-orb {
          position: absolute;
          pointer-events: none;
          opacity: 0.4;
          mix-blend-mode: multiply;
          filter: blur(80px);
          z-index: -1;
          border-radius: 50%;
          background: radial-gradient(circle at center, #dcdcdc 0%, #EAE8E4 60%, transparent 100%);
        }

        /* Orbiting Ring */
        .orbit-container {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 45vw; height: 45vw;
          pointer-events: none;
          z-index: 0;
          mix-blend-mode: multiply;
        }
        .orbit-spinner {
          width: 100%; height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: orbit-spin 40s linear infinite;
        }
        .orbit-border {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 1px solid #4a0404;
          opacity: 0.1;
        }
        @keyframes orbit-spin {
          0% { transform: rotateX(75deg) rotateZ(0deg); }
          100% { transform: rotateX(75deg) rotateZ(360deg); }
        }

        /* Marquee */
        .marquee-container {
          width: 100%;
          max-width: 900px;
          height: 12px;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-top: 1px solid rgba(26, 26, 26, 0.05);
          border-bottom: 1px solid rgba(26, 26, 26, 0.05);
          opacity: 0.8;
          margin-bottom: 3rem;
        }
        .marquee-mask {
          position: absolute; inset: 0;
          background-color: #EAE8E4;
          z-index: 20;
          transform-origin: center;
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          width: 100%;
        }
        .marquee-item {
          font-family: monospace;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: #1a1a1a;
          opacity: 0.3;
          margin: 0 2rem;
        }
        .anim-normal { animation: marquee 20s linear infinite; }
        .anim-reverse { animation: marquee-rev 20s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-rev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

        /* Typography Cluster (J & E) */
        .typo-row {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          width: 100%;
          user-select: none;
          position: relative;
          z-index: 10;
          gap: 4rem; 
          margin-bottom: 2rem;
        }
        .char-wrapper {
          position: relative;
          transform-style: preserve-3d;
        }
        
        /* Updated Luxurious Font */
        .main-char {
          font-family: "Didot", "Bodoni MT", "Playfair Display", "Times New Roman", serif;
          font-size: 14vw;
          line-height: 0.8;
          color: #1a1a1a;
          mix-blend-mode: darken;
          will-change: transform;
          font-weight: 400; /* Lighter weight for high-fashion look */
        }
        
        /* Updated Ampersand */
        .ampersand {
          font-family: "Didot", "Bodoni MT", "Playfair Display", "Times New Roman", serif;
          font-style: italic;
          font-size: 10vw;
          line-height: 1;
          color: #4a0404;
          mix-blend-mode: multiply;
          filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
          padding-bottom: 1vw;
          z-index: 20;
        }
        
        .char-label {
          position: absolute;
          font-family: monospace;
          font-size: 9px;
          opacity: 0.4;
          letter-spacing: 0.2em;
        }
        .label-j { left: -1.5rem; top: 50%; transform: rotate(-90deg); }
        .label-e { right: -2rem; bottom: 2rem; }

        /* Maison Block */
        .maison-block {
          position: relative;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 4rem;
          opacity: 0; 
        }
        .maison-hairline {
          width: 6rem;
          height: 1px;
          background-color: #4a0404;
          margin-bottom: 1.5rem;
          opacity: 0.6;
        }
        .maison-title {
          font-family: "Didot", "Bodoni MT", "Playfair Display", serif;
          font-size: 5rem;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          line-height: 1;
          font-weight: 400;
          mix-blend-mode: darken;
          text-align: center;
        }
        .maison-subtitle {
          font-family: monospace;
          font-size: 10px;
          color: #4a0404;
          letter-spacing: 0.6em;
          text-transform: uppercase;
          margin-top: 1rem;
          opacity: 0.7;
          margin-left: 0.6em; 
        }

        /* Bottom Floor */
        .floor-container {
          width: 100%;
          max-width: 900px;
          position: relative;
        }
        .floor-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          height: 1px;
          background-color: #1a1a1a;
        }
        .line-1 { top: -2rem; width: 110%; opacity: 0.5; }
        .line-2 { top: -1rem; width: 90%; opacity: 0.2; }

        /* Responsive Tweaks */
        @media (max-width: 768px) {
          .orbit-container { width: 80vw; height: 80vw; }
          .typo-row { gap: 1rem; }
          .main-char { font-size: 18vw; }
          .ampersand { font-size: 14vw; }
          .maison-title { font-size: 2.5rem; }
        }
      `}</style>

      {/* ==============================================
          HTML STRUCTURE
      ============================================== */}
      <div className="stage-perspective">
        
        {/* The 3D Cluster that tilts */}
        <div ref={centerCluster} className="cluster-wrapper">
          
          {/* Background Elements */}
          <div className="pearl-orb" style={{ width: '70vw', height: '70vw', top: '-5rem', background: '#d4d1cc' }}></div>
          <div className="pearl-orb" style={{ width: '50vw', height: '50vw', transform: 'translate(20%, 20%)', background: '#e0ded9' }}></div>

          {/* 1. Orbit Ring */}
          <div className="orbit-container">
            <div className="orbit-spinner">
              <div className="orbit-border"></div>
              <svg width="100%" height="100%" viewBox="0 0 300 300" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <path id="circlePath" d="M 150, 150 m -120, 0 a 120,120 0 0,1 240,0 a 120,120 0 0,1 -240,0" />
                </defs>
                <text fill="#4a0404" fontSize="6" fontFamily="monospace" letterSpacing="4px" fontWeight="bold" opacity="0.4">
                  <textPath href="#circlePath" startOffset="0%">
                    MAISON SYSTEM 2025 • ARCHITECTURAL LOGIC • FIG 1.0 • KINETIC STRUCTURE • 
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* 2. Top Marquee */}
          <div className="marquee-container">
            <div className="marquee-mask"></div>
            <div className="marquee-track anim-normal">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="marquee-item">Fig 1.0 — System — Maison — Structure —</span>
              ))}
            </div>
          </div>

          {/* 3. Typography Cluster (J & E) */}
          <div className="typo-row">
            {/* J */}
            <div className="char-wrapper letter-j">
              <h1 className="main-char char-animate" style={{ transformOrigin: 'bottom right' }}>J</h1>
              <span className="char-label label-j">FIG. A</span>
            </div>

            {/* & */}
            <div className="char-wrapper brand-amp">
              <h1 className="ampersand char-animate" style={{ transformOrigin: 'bottom' }}>&</h1>
            </div>

            {/* E */}
            <div className="char-wrapper letter-e">
              <h1 className="main-char char-animate" style={{ transformOrigin: 'bottom left' }}>E</h1>
              <span className="char-label label-e">EST. 25</span>
            </div>
          </div>

          {/* 4. Maison Block */}
          <div className="maison-block">
            <div className="maison-hairline"></div>
            <h2 className="maison-title">
              <span style={{ display: 'block', marginLeft: '0.25em' }}>Maison</span>
            </h2>
            <span className="maison-subtitle">System . Structure . Logic</span>
          </div>

          {/* 5. Bottom Floor & Marquee */}
          <div className="floor-container">
            <div className="floor-line line-1"></div>
            <div className="floor-line line-2"></div>
            
            <div className="marquee-container" style={{ marginBottom: 0 }}>
              <div className="marquee-mask"></div>
              <div className="marquee-track anim-reverse">
                {[...Array(8)].map((_, i) => (
                  <span key={i} className="marquee-item">Fig 1.0 — System — Maison — Structure —</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;