import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const services = [
  { id: "01", title: "Branding & Identity", desc: "Strategy / Visual Language / Tone" },
  { id: "02", title: "Web Design & UI/UX", desc: "Architecture / Interface / Experience" },
  { id: "03", title: "Mobile Application", desc: "iOS / Android / React Native" },
  { id: "04", title: "Web App Architecture", desc: "Full Stack / Scalable Systems" },
  { id: "05", title: "SEO & Performance", desc: "Technical SEO / Speed / Analytics" }
];

const About = () => {
  const container = useRef(null);

  // ==============================================
  // GSAP ENTRY ANIMATION
  // ==============================================
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Draw Vertical Divider
      tl.fromTo(".divider-line", 
        { scaleY: 0 }, 
        { scaleY: 1, duration: 1.5, ease: "expo.out" }
      )
      // 2. Reveal Left Content
      .fromTo(".left-content",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
        "-=1.2"
      )
      // 3. Stagger Reveal Service Rows
      .fromTo(".service-row",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
        "-=0.8"
      );

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative w-screen h-screen bg-[#EAE8E4] text-[#1a1a1a] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* ==============================================
          LEFT COLUMN: PHILOSOPHY (Narrative)
      ============================================== */}
      {/* FIX: Added 'pt-32' (approx 128px) to push content below Navbar */}
      <div className="w-full md:w-[45%] h-full relative px-8 md:px-16 pb-8 md:pb-16 pt-32 flex flex-col justify-between">
        
        {/* Top Label */}
        <div className="left-content">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#4a0404]">
            Fig 2.0 — Philosophy
          </span>
        </div>

        {/* Main Narrative */}
        <div className="left-content relative z-10 my-auto">
          <h2 className="font-serif text-[10vw] md:text-[5vw] leading-[0.9] mb-8 text-[#1a1a1a]">
            Digital <br />
            <span className="text-[#4a0404] italic">Physics.</span>
          </h2>
          <div className="w-12 h-[1px] bg-[#1a1a1a] mb-8"></div>
          <p className="font-serif text-lg md:text-xl leading-relaxed opacity-80 max-w-md">
            We orchestrate digital physics. J&E Maison represents the intersection of structural engineering and high-fashion aesthetics. We do not build websites; we construct digital environments that feel breathable, tactile, and inevitable.
          </p>
        </div>

        {/* Bottom Signature */}
        <div className="left-content flex items-center gap-4 opacity-50 mt-8 md:mt-0">
           <div className="w-full h-[1px] bg-[#1a1a1a]/20"></div>
           <span className="font-mono text-[9px] whitespace-nowrap tracking-widest">EST. 2025</span>
        </div>

        {/* The Vertical Divider (Absolute on desktop) */}
        <div className="divider-line absolute top-0 right-0 w-[1px] h-full bg-[#1a1a1a]/10 origin-top hidden md:block"></div>
        {/* Mobile Divider */}
        <div className="divider-line absolute bottom-0 left-0 w-full h-[1px] bg-[#1a1a1a]/10 origin-left md:hidden"></div>
      </div>


      {/* ==============================================
          RIGHT COLUMN: SERVICE INDEX (Interactive)
      ============================================== */}
      {/* FIX: Added 'pt-32' here as well to align the header with the left side */}
      <div className="w-full md:w-[55%] h-full flex flex-col relative pt-32">
        
        {/* Header */}
        <div className="px-8 md:px-12 pb-4 border-b border-[#1a1a1a]/10 flex justify-between items-end">
           <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1a1a1a] opacity-60">
             Index / Capabilities
           </span>
           <span className="font-mono text-[10px] text-[#4a0404] tracking-widest">
             SELECT SERVICE &darr;
           </span>
        </div>

        {/* Scrollable List Container */}
        {/* Added pb-20 to ensure the last item isn't cut off by the bottom of the screen */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-row group relative border-b border-[#1a1a1a]/10 transition-colors duration-500 hover:bg-white/40 cursor-pointer"
            >
              <div className="w-full h-full p-6 md:p-10 flex items-center justify-between">
                
                {/* Left: ID & Title */}
                <div className="flex items-center gap-6 md:gap-12">
                   {/* ID Number */}
                   <span className="font-mono text-xs text-[#1a1a1a]/40 group-hover:text-[#4a0404] transition-colors duration-300">
                     ({service.id})
                   </span>
                   
                   {/* Title with Shift & Italic Effect */}
                   <h3 className="font-serif text-2xl md:text-5xl text-[#1a1a1a] transition-all duration-300 ease-out group-hover:translate-x-4 group-hover:italic group-hover:text-[#4a0404]">
                     {service.title}
                   </h3>
                </div>

                {/* Right: Arrow & Hidden Desc */}
                <div className="flex flex-col items-end gap-2">
                   {/* Arrow Icon */}
                   <span className="text-xl md:text-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#4a0404]">
                     &rarr;
                   </span>
                   
                   {/* Description (Visible on hover desktop) */}
                   <span className="hidden md:block font-mono text-[9px] uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-60 group-hover:translate-y-0 transition-all duration-500 delay-75">
                     {service.desc}
                   </span>
                </div>

              </div>
              
              {/* Hover Progress Line (Bottom) */}
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] group-hover:w-full transition-all duration-700 ease-in-out"></div>
            </div>
          ))}
          
          {/* Spacer to allow scrolling past the last item comfortably */}
          <div className="h-24"></div>
        </div>
      </div>

    </div>
  );
};

export default About;