import React, { useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Import the separated components
import Hero from './Hero';
import About from './About';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

// ==============================================
// GLOBAL HELPER COMPONENTS
// ==============================================

const PrecisionCursor = () => {
  const cursorRef = useRef(null);
  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);
  return (
    <div ref={cursorRef} className="fixed top-0 left-0 w-3 h-3 bg-[#4a0404] rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-ping opacity-20 bg-[#4a0404] rounded-full"></div>
    </div>
  );
};

const GrainTexture = () => {
  return (
    <div className="fixed inset-0 z-[50] pointer-events-none opacity-40 mix-blend-multiply">
      <svg className='w-full h-full opacity-60'>
        <filter id='noiseFilter'>
          <feTurbulence 
            type='fractalNoise' 
            baseFrequency='0.8' 
            numOctaves='3' 
            stitchTiles='stitch'/>
        </filter>
        <rect width='100%' height='100%' filter='url(#noiseFilter)' />
      </svg>
    </div>
  );
};

// ==============================================
// MAIN HOMEPAGE (Scroll Orchestrator)
// ==============================================

const HomePage = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // Horizontal Scroll Logic
      gsap.to(container.current, {
        xPercent: -50, // Move container left by 50%
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          pin: true,     
          scrub: 1,      
          end: "+=2000", 
        }
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#EAE8E4] text-[#1a1a1a]">
      <PrecisionCursor />
      
      {/* FIXED GRAIN OVERLAY */}
      <GrainTexture />
      <Navbar/>
      
      {/* The 200vw Container holding both pages side-by-side */}
      <div ref={container} className="flex w-[200vw] h-screen will-change-transform">
        <Hero />
        <About />
      </div>
    </div>
  );
};

export default HomePage;