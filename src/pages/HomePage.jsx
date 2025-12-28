import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import WorkPreview from './WorkPreview';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // Initialize GSAP MatchMedia
      let mm = gsap.matchMedia();

      // ===============================================
      // 1. DESKTOP LOGIC (Horizontal Scroll)
      // ===============================================
      mm.add("(min-width: 769px)", () => {
        const sections = gsap.utils.toArray(".panel");
        
        // Horizontal Scroll Tween
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            // Use the offsetWidth of the SCROLL CONTAINER, not the window
            end: () => "+=" + containerRef.current.offsetWidth
          }
        });
      });

      // ===============================================
      // 2. MOBILE LOGIC (Vertical Scroll Fade-Ins)
      // ===============================================
      mm.add("(max-width: 768px)", () => {
        const sections = gsap.utils.toArray(".panel");

        // Optional: Add a simple "Fade Up" for sections on mobile
        // so it still feels premium, even without the horizontal scroll.
        sections.forEach((section) => {
          gsap.fromTo(section, 
            { opacity: 0, y: 50 },
            {
              opacity: 1, 
              y: 0, 
              duration: 1, 
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%", // Animate when top of section hits 80% of viewport
              }
            }
          );
        });
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    // MAIN WRAPPER
    <div ref={wrapperRef} className="relative bg-[#EAE8E4] overflow-x-hidden">
      
      <Navbar />

      {/* SCROLL CONTAINER:
          - Desktop: Horizontal Row (w-[300vw])
          - Mobile: Vertical Column (w-full, flex-col)
      */}
      <div 
        ref={containerRef} 
        className="flex flex-col md:flex-row w-full md:w-[300vw] h-auto md:h-screen overflow-hidden"
      >
        
        {/* SECTION 1: HERO */}
        <section className="panel w-full md:w-screen h-screen flex-shrink-0 relative border-b md:border-b-0 md:border-r border-[#0a0a0a]/10">
          <Hero />
        </section>

        {/* SECTION 2: ABOUT */}
        <section className="panel w-full md:w-screen min-h-screen md:h-screen flex-shrink-0 relative border-b md:border-b-0 md:border-r border-[#0a0a0a]/10">
          <About />
        </section>

        {/* SECTION 3: WORK PREVIEW */}
        <section className="panel w-full md:w-screen min-h-screen md:h-screen flex-shrink-0 relative">
          <WorkPreview />
        </section>

      </div>
      
      {/* MOBILE FOOTER (Optional) */}
      <div className="md:hidden h-[20vh] flex items-center justify-center border-t border-[#0a0a0a]/10 opacity-40">
         <p className="font-mono text-xs uppercase tracking-widest">End of Line</p>
      </div>

    </div>
  );
};

export default HomePage;