import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import logo from "../assets/logo beige.png"
import logo2 from "../assets/logo burgundy.png"

const Hero = () => {
  const container = useRef(null);
  const leftWingRef = useRef(null);
  const rightWingRef = useRef(null);
  const watermarkRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Entry Animation
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 2.5 } });

      tl.from(".glass-panel", { xPercent: 100, opacity: 0, delay: 0.5 })
        .from(".content-block", { y: 40, opacity: 0, stagger: 0.2 }, "-=1.8")
        .from([leftWingRef.current, rightWingRef.current], { 
          scale: 0.8, 
          opacity: 0, 
          stagger: 0.1 
        }, "-=1.5");

      // 2. Performance-Optimized QuickSetters
      const xLeftTo = gsap.quickTo(leftWingRef.current, "x", { duration: 1, ease: "power3" });
      const xRightTo = gsap.quickTo(rightWingRef.current, "x", { duration: 1, ease: "power3" });
      
      // Watermark Setters for Background Movement
      const waterXTo = gsap.quickTo(watermarkRef.current, "x", { duration: 2, ease: "power2.out" });
      const waterYTo = gsap.quickTo(watermarkRef.current, "y", { duration: 2, ease: "power2.out" });

      // 3. Gentle "Breathing" Idle Animation for Wings
      gsap.to([leftWingRef.current, rightWingRef.current], {
        y: "-=12",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3
      });

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // --- MAGNETIC FEATHER LOGIC ---
        const distFromCenterX = (clientX - centerX) / centerX;
        const expansion = distFromCenterX * 25; // How much the wings grow/shrink
        
        xLeftTo(-expansion);
        xRightTo(expansion);

        // --- BACKGROUND WATERMARK PARALLAX ---
        // We use a small multiplier (0.05) so it feels deep in the background
        const moveX = (clientX - centerX) * 0.05;
        const moveY = (clientY - centerY) * 0.05;
        
        waterXTo(moveX);
        waterYTo(moveY);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative w-full h-screen bg-[#EAE8E4] text-[#1a1a1a] overflow-hidden font-sans selection:bg-[#4a0404] selection:text-white">
      
      {/* --- FILM GRAIN OVERLAY --- */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* --- FLOATING WATERMARK (Now moves with Mouse) --- */}
      <div 
        ref={watermarkRef} 
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-0 opacity-[0.04] select-none will-change-transform"
      >
        <h2 className="text-[40vw] font-serif leading-none tracking-tighter text-[#4a0404]">J&E</h2>
      </div>

      <main className="relative z-10 w-full h-full flex flex-col md:flex-row">
        
        {/* --- LEFT SECTION: EDITORIAL --- */}
        <div className="w-full md:w-1/2 h-full p-8 md:p-24 pt-32 md:pt-48 flex flex-col justify-start md:justify-center">
          <div className="content-block space-y-2 mb-12">
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#4a0404]">The Archive</span>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight">
              Web Design & <br /> <span className="italic px-2 text-[#4a0404]">Branding</span>
            </h1>
          </div>

          <div className="content-block max-w-sm border-l border-[#4a0404]/20 pl-6 py-2">
            <p className="font-serif text-lg md:text-xl italic leading-relaxed text-[#1a1a1a]/80 tracking-wide font-light">
              J&E Maison is a <span className="font-normal not-italic underline decoration-[#4a0404]/20 underline-offset-4">specialized boutique</span> architecting digital sanctuaries. 
              We curate branding and web systems that prioritize structural 
              integrity and <span className="font-normal not-italic">aesthetic silence.</span>
            </p>
          </div>

          <div className="content-block mt-12">
            <button className="group relative overflow-hidden px-10 py-4 border border-[#1a1a1a]/10 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] transition-all duration-700 hover:border-[#4a0404]/40">
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">Initialize Project</span>
              <div className="absolute inset-0 bg-[#4a0404] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
            </button>
          </div>
        </div>

        {/* --- RIGHT SECTION: GLASS PANEL & LOGO --- */}
        <div className="w-full md:w-1/2 h-full relative flex items-center justify-center p-6 md:p-12 md:pt-24">
          <div className="glass-panel relative w-full h-[70vh] md:h-[75vh] bg-white/5 backdrop-blur-2xl border border-white/30 rounded-[2px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden cursor-none">
            
            {/* Inner Refraction Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-[#4a0404]/5 pointer-events-none"></div>

            {/* THE WINGS */}
            <div className="relative z-10 flex items-center justify-center w-full max-w-lg scale-90 md:scale-100">
              
              {/* Left Wing */}
              <div ref={leftWingRef} className="w-32 md:w-56 translate-x-[12%] will-change-transform">
                <img 
                  src={logo} 
                  alt="Maison Wing Left" 
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                />
              </div>

              {/* Right Wing */}
              <div ref={rightWingRef} className="w-32 md:w-56 -translate-x-[12%] scale-x-[-1] will-change-transform">
                <img 
                  src={logo2} 
                  alt="Maison Wing Right" 
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                />
              </div>

            </div>

            {/* Technical Detail Overlays */}
            <div className="absolute top-8 left-8 font-mono text-[8px] opacity-20 tracking-[0.4em] uppercase">
                System_Status: Optimal
            </div>
            <div className="absolute bottom-8 right-8 font-mono text-[8px] opacity-20 tracking-[0.4em] uppercase">
                Auth: J&E_Maison_Studio
            </div>
          </div>
        </div>
      </main>

      {/* --- CENTER DIVIDER --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-32 bg-[#4a0404]/5 hidden md:block"></div>
    </div>
  );
};

export default Hero;