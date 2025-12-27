import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Hero = () => {
  const container = useRef(null);
  const parallaxRefs = useRef([]);
  const maskTextRef = useRef(null);
  
  // ==============================================
  // 1. LIVE CLOCK LOGIC
  // ==============================================
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ==============================================
  // 2. GSAP ANIMATION & INTERACTION
  // ==============================================
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // --- A. INTRO SEQUENCE (The "Editorial Reveal") ---
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Draw Grid Lines
      tl.fromTo(".grid-line", 
        { scaleY: 0 }, 
        { scaleY: 1, duration: 1.5, stagger: 0.1, ease: "expo.out" }
      )
      // 2. Reveal Top/Bottom Meta Data
      .fromTo(".meta-reveal",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.05 },
        "-=1.0"
      )
      // 3. Main Typography Reveal (Staggered Up)
      .fromTo(".hero-char",
        { y: "120%", rotateX: 10, opacity: 0 },
        { y: "0%", rotateX: 0, opacity: 1, duration: 1.8, stagger: 0.1, ease: "power4.out" },
        "-=0.8"
      );

      // --- B. MOUSE PARALLAX (The "Alive" Factor) ---
      // We use quickTo for performance (no jank)
      const xTo = gsap.quickTo(parallaxRefs.current, "x", { duration: 0.8, ease: "power3" });
      const yTo = gsap.quickTo(parallaxRefs.current, "y", { duration: 0.8, ease: "power3" });
      
      // Special quickTo for the background mask position
      const maskPosx = gsap.quickTo(maskTextRef.current, "--mask-x", { duration: 0.6, ease: "power2" });
      const maskPosy = gsap.quickTo(maskTextRef.current, "--mask-y", { duration: 0.6, ease: "power2" });

      const handleMouseMove = (e) => {
        const { clientX, clientY, innerWidth, innerHeight } = window;
        
        // Normalize mouse (-1 to 1)
        const xNorm = (clientX / innerWidth - 0.5) * 2;
        const yNorm = (clientY / innerHeight - 0.5) * 2;

        // 1. Move Parallax Elements (J, &, E)
        parallaxRefs.current.forEach((el) => {
          if (!el) return;
          const speed = el.dataset.speed || 20;
          gsap.to(el, { 
            x: xNorm * speed, 
            y: yNorm * speed, 
            duration: 1, 
            ease: "power2.out" 
          });
        });

        // 2. Move the Background Mask INSIDE the text (Opposite direction for depth)
        // We update CSS variables to shift the background-position
        maskPosx(xNorm * -50); // Move texture 50px
        maskPosy(yNorm * -50);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);

    }, container);
    return () => ctx.revert();
  }, []);

  // Helper to add refs to array
  const addToRefs = (el) => {
    if (el && !parallaxRefs.current.includes(el)) {
      parallaxRefs.current.push(el);
    }
  };

  return (
    <div ref={container} className="relative w-screen h-screen bg-[#EAE8E4] text-[#1a1a1a] overflow-hidden flex flex-col justify-between p-6 md:p-12 font-sans selection:bg-[#4a0404] selection:text-white">
      
      {/* ==============================================
          BACKGROUND TEXTURE (Subtle Grain)
      ============================================== */}


      {/* ==============================================
          GRID LINES (Architectural Structure)
      ============================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-between px-12 md:px-24">
        <div className="w-[1px] h-full bg-[#1a1a1a]/10 grid-line origin-top"></div>
        <div className="w-[1px] h-full bg-[#1a1a1a]/10 grid-line origin-top hidden md:block"></div>
        <div className="w-[1px] h-full bg-[#1a1a1a]/10 grid-line origin-top"></div>
      </div>


      {/* ==============================================
          TOP BAR: DATA & TIME
      ============================================== */}
      <div className="relative z-20 w-full flex justify-between items-start text-[10px] md:text-xs font-mono uppercase tracking-widest leading-tight">



        {/* Right: Live Clock */}
     
      </div>


      {/* ==============================================
          MAIN STAGE: TYPOGRAPHY
      ============================================== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
        
        {/* The "J" and "E" - Serif, Elegant, Parallaxed */}
        <div className="w-full max-w-6xl relative flex justify-between items-end mb-[-2vw] md:mb-[-4vw] px-4 md:px-12 pointer-events-none">
          
          <div ref={addToRefs} data-speed="20" className="hero-char will-change-transform">
            <span className="block font-serif text-[15vw] md:text-[18vw] leading-none text-[#1a1a1a]">J</span>
            <span className="block font-mono text-[9px] tracking-[0.4em] opacity-40 ml-4 -mt-4 transform -rotate-90 origin-top-left">FIG. A</span>
          </div>

          <div ref={addToRefs} data-speed="-15" className="hero-char will-change-transform mb-[4vw]">
            <span className="block font-serif italic text-[8vw] md:text-[10vw] leading-none text-[#4a0404] opacity-80">&</span>
          </div>

          <div ref={addToRefs} data-speed="30" className="hero-char will-change-transform text-right">
            <span className="block font-mono text-[9px] tracking-[0.4em] opacity-40 mr-4 mb-4 transform rotate-90 origin-bottom-right">EST. 25</span>
            <span className="block font-serif text-[15vw] md:text-[18vw] leading-none text-[#1a1a1a]">E</span>
          </div>

        </div>

        {/* THE MASKED "MAISON" TITLE 
            Uses bg-clip-text with a variable background position.
        */}
        <div className="relative w-full text-center z-20">
            <div className="hero-char overflow-visible">
                <h1 
                    ref={maskTextRef}
                    className="font-serif text-[16vw] md:text-[19vw] leading-[0.85] tracking-tight uppercase will-change-transform cursor-default transition-opacity duration-500 hover:opacity-90"
                    style={{
                        // 1. The Masking Magic
                        color: 'transparent',
                        backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop")',
                        backgroundSize: '120% auto',
                        backgroundPosition: 'calc(50% + var(--mask-x, 0px)) calc(50% + var(--mask-y, 0px))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        // 2. Initial Vars for GSAP
                        '--mask-x': '0px',
                        '--mask-y': '0px'
                    }}
                >
                    Maison
                </h1>
            </div>
            
            {/* Tagline under the mask */}
            <div className="meta-reveal mt-4 md:mt-8 flex items-center justify-center gap-4 opacity-70">
                <div className="w-12 h-[1px] bg-[#1a1a1a]"></div>
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">System & Soul</span>
                <div className="w-12 h-[1px] bg-[#1a1a1a]"></div>
            </div>
        </div>

      </div>


      {/* ==============================================
          BOTTOM BAR: SERVICES & STATUS
      ============================================== */}
      <div className="relative z-20 w-full flex justify-between items-end border-t border-[#1a1a1a]/10 pt-6">
        
        {/* Services List (Hover Interactions) */}
        <div className="flex gap-8 md:gap-16">
            {["WEB ARCHITECTURE", "BRAND IDENTITY", "MOBILE SYSTEMS"].map((item, i) => (
                <div key={i} className="meta-reveal group cursor-pointer relative overflow-hidden">
                    <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-[#1a1a1a] group-hover:text-[#4a0404] transition-colors duration-300">
                        {item}
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#4a0404] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                </div>
            ))}
        </div>

        {/* Scroll Indicator */}
        <div className="meta-reveal hidden md:flex items-center gap-2 animate-pulse">
             <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">Scroll</span>
             <span className="text-[#4a0404] text-lg">&rarr;</span>
        </div>

      </div>

    </div>
  );
};

export default Hero;