import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const services = [
  { id: "01", title: "Branding & Identity", desc: "Strategy / Language" },
  { id: "02", title: "Web Design & UI/UX", desc: "Architecture / Interface" },
  { id: "03", title: "Mobile Application", desc: "iOS / Android / Native" },
  { id: "04", title: "Web App Architecture", desc: "Full Stack Systems" },
  { id: "05", title: "SEO & Performance", desc: "Technical SEO / Speed" }
];

const About = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative w-screen h-screen bg-[#EAE8E4] text-[#1a1a1a] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* LEFT COLUMN: PHILOSOPHY */}
      <div className="w-full md:w-[45%] h-full relative px-8 md:px-16 pb-12 pt-32 flex flex-col justify-between border-b md:border-b-0 border-[#1a1a1a]/10">
        <div className="left-content">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#4a0404]">
            Fig 2.0 — Philosophy
          </span>
        </div>

        <div className="left-content relative z-10">
          <h2 className="font-serif text-[8vw] md:text-[4vw] leading-[0.9] mb-6 text-[#1a1a1a]">
            Digital <br />
            <span className="text-[#4a0404] italic">Physics.</span>
          </h2>
          <div className="w-12 h-[1px] bg-[#1a1a1a] mb-6"></div>
          <p className="font-serif text-base md:text-lg leading-relaxed opacity-80 max-w-sm">
            We orchestrate digital physics. J&E Maison represents the intersection of structural engineering and high-fashion aesthetics.
          </p>
        </div>

        <div className="left-content flex items-center gap-4 opacity-50">
           <div className="w-full h-[1px] bg-[#1a1a1a]/20"></div>
           <span className="font-mono text-[9px] whitespace-nowrap tracking-widest uppercase">M—S ©25</span>
        </div>

        <div className="divider-line absolute top-0 right-0 w-[1px] h-full bg-[#1a1a1a]/10 origin-top hidden md:block"></div>
      </div>

      {/* RIGHT COLUMN: SERVICE INDEX (Fixed Fit) */}
      <div className="w-full md:w-[55%] h-full flex flex-col relative pt-32">
        
        {/* Header - Fixed Height */}
        <div className="px-8 md:px-12 h-12 flex justify-between items-end border-b border-[#1a1a1a]/10 pb-4">
           <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1a1a1a] opacity-60">
             Index / Capabilities
           </span>
           <span className="font-mono text-[9px] text-[#4a0404] tracking-widest uppercase">
             (SELECT) &darr;
           </span>
        </div>

        {/* List Container - Uses flex-1 to fill remaining screen height without scrolling */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-row group relative flex-1 border-b border-[#1a1a1a]/10 transition-colors duration-500 hover:bg-white/40 cursor-pointer flex items-center overflow-hidden"
            >
              <div className="w-full px-8 md:px-12 flex items-center justify-between">
                
                <div className="flex items-center gap-6 md:gap-10">
                   <span className="font-mono text-[10px] text-[#1a1a1a]/40 group-hover:text-[#4a0404] transition-colors duration-300">
                     {service.id}
                   </span>
                   <h3 className="font-serif text-2xl md:text-[2.8vw] text-[#1a1a1a] leading-none transition-all duration-300 ease-out group-hover:translate-x-3 group-hover:italic group-hover:text-[#4a0404] whitespace-nowrap">
                     {service.title}
                   </h3>
                </div>

                <div className="flex flex-col items-end gap-1">
                   <span className="text-xl md:text-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#4a0404]">
                     &rarr;
                   </span>
                   <span className="hidden lg:block font-mono text-[8px] uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-40 group-hover:translate-y-0 transition-all duration-500">
                     {service.desc}
                   </span>
                </div>

              </div>
              
              {/* Animated Underline */}
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] group-hover:w-full transition-all duration-700 ease-in-out"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;