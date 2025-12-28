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
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ==============================================
  // 2. RESPONSIVE ANIMATIONS
  // ==============================================
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      let mm = gsap.matchMedia();

      // --- SHARED INTRO (Both Mobile & Desktop) ---
      // We define this outside to reuse or tweak per screen if needed
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      introTl.fromTo(".grid-line", 
        { scaleY: 0 }, 
        { scaleY: 1, duration: 1.5, stagger: 0.1, ease: "expo.out" }
      )
      .fromTo(".meta-reveal",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.05 },
        "-=1.0"
      )
      .fromTo(".hero-char",
        { y: "120%", rotateX: 10, opacity: 0 },
        { y: "0%", rotateX: 0, opacity: 1, duration: 1.8, stagger: 0.1, ease: "power4.out" },
        "-=0.8"
      );

      // ==========================================
      // DESKTOP LOGIC (Interactive)
      // ==========================================
      mm.add("(min-width: 769px)", () => {
         // Mouse Parallax Logic
         const xTo = gsap.quickTo(parallaxRefs.current, "x", { duration: 0.8, ease: "power3" });
         const yTo = gsap.quickTo(parallaxRefs.current, "y", { duration: 0.8, ease: "power3" });
         
         // Mask Position Logic
         const maskPosx = gsap.quickTo(maskTextRef.current, "--mask-x", { duration: 0.6, ease: "power2" });
         const maskPosy = gsap.quickTo(maskTextRef.current, "--mask-y", { duration: 0.6, ease: "power2" });

         const handleMouseMove = (e) => {
           const { clientX, clientY, innerWidth, innerHeight } = window;
           const xNorm = (clientX / innerWidth - 0.5) * 2;
           const yNorm = (clientY / innerHeight - 0.5) * 2;

           // Move Letters
           parallaxRefs.current.forEach((el) => {
             if (!el) return;
             const speed = el.dataset.speed || 20;
             gsap.to(el, { x: xNorm * speed, y: yNorm * speed, duration: 1, ease: "power2.out" });
           });

           // Move Mask Background
           maskPosx(xNorm * -50);
           maskPosy(yNorm * -50);
         };

         window.addEventListener("mousemove", handleMouseMove);
         return () => window.removeEventListener("mousemove", handleMouseMove);
      });

      // ==========================================
      // MOBILE LOGIC (Automated / Passive)
      // ==========================================
      mm.add("(max-width: 768px)", () => {
         // Instead of mouse movement, we gently pan the background image
         // to keep the "Alive" feeling without user input.
         if (maskTextRef.current) {
             gsap.to(maskTextRef.current, {
                 "--mask-x": "40px",
                 duration: 5,
                 ease: "sine.inOut",
                 yoyo: true,
                 repeat: -1
             });
         }
      });

    }, container);
    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !parallaxRefs.current.includes(el)) {
      parallaxRefs.current.push(el);
    }
  };

  return (
    <div ref={container} className="relative w-full md:w-screen h-svh md:h-screen bg-[#EAE8E4] text-[#1a1a1a] overflow-hidden flex flex-col justify-between p-6 md:p-12 font-sans selection:bg-[#4a0404] selection:text-white">
      
      {/* BACKGROUND GRID (Hidden on mobile to reduce noise, visible on desktop) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-24">
        <div className="w-[1px] h-full bg-[#1a1a1a]/5 md:bg-[#1a1a1a]/10 grid-line origin-top"></div>
        <div className="hidden md:block w-[1px] h-full bg-[#1a1a1a]/10 grid-line origin-top"></div>
        <div className="w-[1px] h-full bg-[#1a1a1a]/5 md:bg-[#1a1a1a]/10 grid-line origin-top"></div>
      </div>

      {/* ==============================================
          TOP BAR: DATA & TIME
      ============================================== */}
      <div className="relative z-20 w-full flex justify-end items-start text-[10px] md:text-xs font-mono uppercase tracking-widest leading-tight">
        <div className="meta-reveal flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#4a0404] rounded-full animate-pulse" />
            <span>{time}</span>
            <span className="opacity-40 ml-2 hidden md:inline">NBO, KE</span>
        </div>
      </div>

      {/* ==============================================
          MAIN STAGE: TYPOGRAPHY
      ============================================== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full min-h-[50vh]">
        
        {/* The J & E Wrapper */}
        <div className="w-full max-w-6xl relative flex justify-between items-end mb-[-4vw] px-2 md:px-12 pointer-events-none select-none">
          
          {/* J */}
          <div ref={addToRefs} data-speed="20" className="hero-char will-change-transform">
            <span className="block font-serif text-[20vw] md:text-[18vw] leading-none text-[#1a1a1a]">J</span>
            <span className="block font-mono text-[8px] md:text-[9px] tracking-[0.4em] opacity-40 ml-2 md:ml-4 -mt-2 md:-mt-4 transform -rotate-90 origin-top-left">FIG. A</span>
          </div>

          {/* & */}
          <div ref={addToRefs} data-speed="-15" className="hero-char will-change-transform mb-[6vw] md:mb-[4vw]">
            <span className="block font-serif italic text-[12vw] md:text-[10vw] leading-none text-[#4a0404] opacity-80">&</span>
          </div>

          {/* E */}
          <div ref={addToRefs} data-speed="30" className="hero-char will-change-transform text-right">
            <span className="block font-mono text-[8px] md:text-[9px] tracking-[0.4em] opacity-40 mr-2 md:mr-4 mb-2 md:mb-4 transform rotate-90 origin-bottom-right">EST. 25</span>
            <span className="block font-serif text-[20vw] md:text-[18vw] leading-none text-[#1a1a1a]">E</span>
          </div>

        </div>

        {/* MAISON TITLE */}
        <div className="relative w-full text-center z-20">
            <div className="hero-char overflow-visible">
                <h1 
                    ref={maskTextRef}
                    className="font-serif text-[22vw] md:text-[19vw] leading-[0.8] tracking-tight uppercase will-change-transform cursor-default transition-opacity duration-500 hover:opacity-90"
                    style={{
                        color: 'transparent',
                        backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop")',
                        backgroundSize: '120% auto',
                        // CSS Variables updated by GSAP
                        backgroundPosition: 'calc(50% + var(--mask-x, 0px)) calc(50% + var(--mask-y, 0px))',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        '--mask-x': '0px',
                        '--mask-y': '0px'
                    }}
                >
                    Maison
                </h1>
            </div>
            
            <div className="meta-reveal mt-6 md:mt-8 flex items-center justify-center gap-4 opacity-70">
                <div className="w-8 md:w-12 h-[1px] bg-[#1a1a1a]"></div>
                <span className="font-mono text-[9px] md:text-xs uppercase tracking-[0.3em]">System & Soul</span>
                <div className="w-8 md:w-12 h-[1px] bg-[#1a1a1a]"></div>
            </div>
        </div>
      </div>

      {/* ==============================================
          BOTTOM BAR: SERVICES
      ============================================== */}
      <div className="relative z-20 w-full flex flex-col md:flex-row justify-between items-center md:items-end border-t border-[#1a1a1a]/10 pt-6 gap-6 md:gap-0">
        
        {/* Mobile: Vertical Stack / Desktop: Horizontal Row */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-16">
            {["WEB ARCHITECTURE", "BRAND IDENTITY", "MOBILE SYSTEMS"].map((item, i) => (
                <div key={i} className="meta-reveal group cursor-pointer relative overflow-hidden">
                    <span className="font-mono text-[10px] tracking-widest text-[#1a1a1a] group-hover:text-[#4a0404] transition-colors duration-300">
                        {item}
                    </span>
                    {/* Hover line only on desktop */}
                    <div className="hidden md:block absolute bottom-0 left-0 w-full h-[1px] bg-[#4a0404] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                </div>
            ))}
        </div>

        {/* Scroll Indicator (Hidden on Mobile) */}
        <div className="meta-reveal hidden md:flex items-center gap-2 animate-pulse">
             <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">Scroll</span>
             <span className="text-[#4a0404] text-lg">&rarr;</span>
        </div>

      </div>

    </div>
  );
};

export default Hero;