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

      // 2. Magnetic Feather QuickSetters
      // These allow for high-performance updates without React re-renders
      const xLeftTo = gsap.quickTo(leftWingRef.current, "x", { duration: 1, ease: "power3" });
      const xRightTo = gsap.quickTo(rightWingRef.current, "x", { duration: 1, ease: "power3" });
      const waterXTo = gsap.quickTo(watermarkRef.current, "x", { duration: 1.5, ease: "power2" });
      const waterYTo = gsap.quickTo(watermarkRef.current, "y", { duration: 1.5, ease: "power2" });

      // 3. Gentle "Breathing" Idle Animation
      // This makes the wings hover slightly even when the mouse is still
      gsap.to([leftWingRef.current, rightWingRef.current], {
        y: "-=10",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        
        // Calculate distance from center (normalized -1 to 1)
        const distFromCenter = (clientX - centerX) / centerX;

        // "Magnetic Feather" Logic: 
        // As you move mouse, wings expand/contract by 20px
        const expansion = distFromCenter * 20;
        
        xLeftTo(-expansion);
        xRightTo(expansion);

        // Watermark Parallax
        waterXTo(clientX * 0.03);
        waterYTo(clientY * 0.03);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative w-full h-screen bg-[#EAE8E4] text-[#1a1a1a] overflow-hidden font-sans">
      
      {/* --- FLOATING WATERMARK --- */}
      <div 
        ref={watermarkRef} 
        className="absolute top-0 left-0 pointer-events-none z-10 opacity-[0.03] select-none"
      >
        <h2 className="text-[25vw] font-serif leading-none tracking-tighter text-[#4a0404]">J&E</h2>
      </div>

      <main className="relative w-full h-full flex flex-col md:flex-row">
        
        {/* --- LEFT SECTION --- */}
        <div className="w-full md:w-1/2 h-full p-8 md:p-24 pt-32 md:pt-48 flex flex-col justify-start md:justify-center z-20">
          <div className="content-block space-y-2 mb-12">
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#4a0404]">The Archive</span>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight">
              Web Design & <br /> <span className="italic px-2">Branding</span>
            </h1>
          </div>

          <div className="content-block max-w-sm border-l border-[#1a1a1a]/20 pl-6 py-2">
            <p className="font-serif text-lg md:text-xl italic leading-relaxed text-[#1a1a1a]/80 tracking-wide font-light">
              J&E Maison is a <span className="font-normal not-italic underline decoration-[#4a0404]/20 underline-offset-4">specialized boutique</span> architecting digital sanctuaries. 
              We curate branding and web systems that prioritize structural 
              integrity and <span className="font-normal not-italic">aesthetic silence.</span>
            </p>
          </div>

          <div className="content-block mt-12">
            <button className="group relative overflow-hidden px-10 py-4 border border-[#1a1a1a]/20 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] transition-all hover:border-[#4a0404]/40">
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">Initialize Project</span>
              <div className="absolute inset-0 bg-[#1a1a1a] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
            </button>
          </div>
        </div>

        {/* --- RIGHT SECTION: THE MAGNETIC WINGS --- */}
        <div className="w-full md:w-1/2 h-full relative flex items-center justify-center p-6 md:p-12 md:pt-24">
          <div className="glass-panel relative w-full h-[70vh] md:h-[75vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2px] shadow-2xl flex items-center justify-center overflow-hidden cursor-crosshair">
            
            {/* Inner Glass Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-[#4a0404]/5 pointer-events-none"></div>

            {/* THE WINGS */}
            <div className="relative z-10 flex items-center justify-center w-full max-w-lg">
              
              {/* Left Wing */}
              <div ref={leftWingRef} className="w-32 md:w-56 translate-x-[10%] will-change-transform">
                <img 
                  src={logo} 
                  alt="Maison Wing Left" 
                  className="w-full h-auto drop-shadow-2xl"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x400/EAE8E4/1a1a1a?text=LOGO"; }} 
                />
              </div>

              {/* Right Wing */}
              <div ref={rightWingRef} className="w-32 md:w-56 -translate-x-[10%] scale-x-[-1] will-change-transform">
                <img 
                  src={logo2} 
                  alt="Maison Wing Right" 
                  className="w-full h-auto drop-shadow-2xl"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x400/EAE8E4/1a1a1a?text=LOGO"; }} 
                />
              </div>

            </div>

            {/* Glass Overlays */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 m-4 opacity-50"></div>
            <div className="absolute bottom-6 left-6 font-mono text-[8px] opacity-20 tracking-[0.5em] uppercase">
                Kinetic_System_Active
            </div>
          </div>
        </div>
      </main>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-32 bg-[#1a1a1a]/10 hidden md:block"></div>
    </div>
  );
};

export default Hero;