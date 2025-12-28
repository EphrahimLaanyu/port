import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { id: "01", title: "Branding & Identity", desc: "Strategy / Language" },
  { id: "02", title: "Web Design & UI/UX", desc: "Architecture / Interface" },
  { id: "03", title: "Mobile Application", desc: "iOS / Android / Native" },
  { id: "04", title: "Web App Architecture", desc: "Full Stack Systems" },
  { id: "05", title: "SEO & Performance", desc: "Technical SEO / Speed" }
];

const About = () => {
  const container = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // ===============================================
      // 1. DESKTOP ANIMATION (The "Dashboard" Load)
      // ===============================================
      mm.add("(min-width: 769px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".divider-line", 
          { scaleY: 0 }, 
          { scaleY: 1, duration: 1.5, ease: "expo.out" }
        )
        .fromTo(".left-content",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
          "-=1.2"
        )
        .fromTo(".service-row",
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
          "-=0.8"
        );
      });

      // ===============================================
      // 2. MOBILE ANIMATION (The "Editorial" Scroll)
      // ===============================================
      mm.add("(max-width: 768px)", () => {
        
        // Animate the Header Text on Load
        gsap.fromTo(".mobile-hero-text",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15 }
        );

        // Animate Services as you scroll to them
        const rows = gsap.utils.toArray(".service-row");
        rows.forEach((row) => {
          gsap.fromTo(row,
            { y: 50, opacity: 0 },
            {
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 85%", // Triggers when row enters bottom of screen
              }
            }
          );
        });
      });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative w-full min-h-screen bg-[#EAE8E4] text-[#1a1a1a] flex flex-col md:flex-row font-sans overflow-x-hidden">
      
      {/* ============================================
          LEFT COLUMN: PHILOSOPHY
          Mobile: Top Section, Scrollable
          Desktop: Fixed Left Panel
         ============================================ */}
      <div ref={leftColRef} className="w-full md:w-[45%] md:h-screen relative px-6 md:px-16 pt-32 pb-12 md:pb-12 flex flex-col justify-between border-b md:border-b-0 border-[#1a1a1a]/10">
        
        {/* Mobile: Top Label */}
        <div className="left-content mobile-hero-text mb-12 md:mb-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#4a0404]">
            Fig 2.0 — Philosophy
          </span>
        </div>

        {/* Main Title */}
        <div className="left-content mobile-hero-text relative z-10 mb-12 md:mb-0">
          <h2 className="font-serif text-[13vw] md:text-[4vw] leading-[0.85] md:leading-[0.9] mb-8 text-[#1a1a1a]">
            Digital <br />
            <span className="text-[#4a0404] italic">Physics.</span>
          </h2>
          <div className="w-12 h-[1px] bg-[#1a1a1a] mb-6"></div>
          <p className="font-serif text-lg md:text-lg leading-relaxed opacity-80 max-w-sm">
            We orchestrate digital physics. J&E Maison represents the intersection of structural engineering and high-fashion aesthetics.
          </p>
        </div>

        {/* Footer Info */}
        <div className="left-content mobile-hero-text flex items-center gap-4 opacity-50">
           <div className="w-full h-[1px] bg-[#1a1a1a]/20"></div>
           <span className="font-mono text-[9px] whitespace-nowrap tracking-widest uppercase">M—S ©25</span>
        </div>

        {/* Vertical Divider (Desktop Only) */}
        <div className="divider-line absolute top-0 right-0 w-[1px] h-full bg-[#1a1a1a]/10 origin-top hidden md:block"></div>
      </div>

      {/* ============================================
          RIGHT COLUMN: SERVICE INDEX
          Mobile: Vertical Feed, Auto Height
          Desktop: Fixed Right Panel, Flex Fit
         ============================================ */}
      <div ref={rightColRef} className="w-full md:w-[55%] md:h-screen flex flex-col relative pt-12 md:pt-32 pb-12 md:pb-0">
        
        {/* Header */}
        <div className="px-6 md:px-12 h-12 flex justify-between items-end border-b border-[#1a1a1a]/10 pb-4 mb-4 md:mb-0">
           <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a] opacity-60">
             Index / Capabilities
           </span>
           <span className="font-mono text-[9px] text-[#4a0404] tracking-widest uppercase">
             (SELECT) &darr;
           </span>
        </div>

        {/* List Container */}
        <div className="flex-1 flex flex-col md:overflow-hidden">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-row group relative flex-1 md:border-b border-b-[1px] border-[#1a1a1a]/10 transition-colors duration-500 hover:bg-white/40 cursor-pointer flex items-center py-8 md:py-0"
            >
              <div className="w-full px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                
                {/* ID & Title */}
                <div className="flex items-start md:items-center gap-6 md:gap-10">
                   <span className="font-mono text-xs md:text-[10px] text-[#4a0404] md:text-[#1a1a1a]/40 group-hover:text-[#4a0404] transition-colors duration-300 mt-1 md:mt-0">
                     {service.id}
                   </span>
                   <div>
                       <h3 className="font-serif text-3xl md:text-[2.8vw] text-[#1a1a1a] leading-none transition-all duration-300 ease-out md:group-hover:translate-x-3 md:group-hover:italic md:group-hover:text-[#4a0404] whitespace-normal md:whitespace-nowrap">
                         {service.title}
                       </h3>
                       {/* Mobile Visible Description (Hidden on Desktop until hover) */}
                       <p className="block md:hidden font-mono text-[10px] uppercase tracking-widest opacity-50 mt-2 text-[#4a0404]">
                         {service.desc}
                       </p>
                   </div>
                </div>

                {/* Desktop Hover Info (Arrow & Desc) */}
                <div className="hidden md:flex flex-col items-end gap-1">
                   <span className="text-xl md:text-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#4a0404]">
                     &rarr;
                   </span>
                   <span className="font-mono text-[8px] uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-40 group-hover:translate-y-0 transition-all duration-500">
                     {service.desc}
                   </span>
                </div>

              </div>
              
              {/* Animated Underline (Desktop Only) */}
              <div className="hidden md:block absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] group-hover:w-full transition-all duration-700 ease-in-out"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;