import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import image1 from "../assets/Screenshot 2026-01-29 102644.png";
import image2 from "../assets/WhatsApp Image 2026-01-29 at 10.14.14.jpeg";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "01",
    title: "Deejay Kace",
    category: "Music",
    img: image1, 
    tagline: "Redefining digital liquidity.",
    link: "http://deejaykace.co.ke/" // Update these links
  },
  {
    id: "02",
    title: "NFCCO",
    category: "Conservancy",
    img: image2,
    tagline: "Architectural soul in every pixel.",
    link: "https://www.ndotoforestcco.org/"
  },
  {
    id: "03",
    title: "The j&E portfolio",
    category: "Portfolio",
    img: "https://images.unsplash.com/photo-1519643381401-22c77e60520e?q=80&w=2670&auto=format&fit=crop",
    tagline: "Engineering the future of wellness.",
    link: "http://jemaison.xyz/"
  },
];

const WorkPreview = () => {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // 1. DESKTOP ANIMATION
      mm.add("(min-width: 769px)", () => {
        gsap.fromTo(".shutter-panel", 
          { scaleY: 0 }, 
          { scaleY: 1, duration: 1.5, stagger: 0.15, ease: "expo.inOut" }
        );
      });

      // 2. MOBILE ANIMATION
      mm.add("(max-width: 768px)", () => {
        const panels = gsap.utils.toArray(".shutter-panel");
        
        panels.forEach((panel) => {
            gsap.fromTo(panel, 
                { opacity: 0, y: 100 },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: panel,
                        start: "top 85%",
                    }
                }
            );

            gsap.fromTo(panel.querySelector("img"),
                { scale: 1.2, y: -20 },
                { 
                    scale: 1, 
                    y: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: panel,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (index) => {
    if (window.innerWidth > 768) {
        setHoveredIndex(index);
        gsap.fromTo(`.content-${index}`, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.2 }
        );
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-auto md:h-screen bg-[#1a1a1a] flex flex-col md:flex-row flex-shrink-0 overflow-hidden font-sans md:cursor-crosshair"
    >
      {PROJECTS.map((project, index) => (
        <div
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="shutter-panel relative w-full h-[75vh] md:h-full flex transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] will-change-[flex-grow] overflow-hidden group border-b md:border-b-0 md:border-r border-white/10 last:border-0"
          style={{ 
            flexGrow: (window.innerWidth > 768) ? (hoveredIndex === index ? 6 : hoveredIndex === null ? 1 : 2) : 1,
          }}
        >
          {/* IMAGE LAYER */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img 
              src={project.img} 
              alt={project.title} 
              className="w-full h-full object-cover grayscale md:grayscale transition-all duration-[2000ms] ease-out md:group-hover:scale-110 md:group-hover:grayscale-0"
              style={{ filter: window.innerWidth < 768 ? 'grayscale(0%)' : undefined }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 md:opacity-80"></div>
          </div>

          {/* CONTENT LAYER */}
          <div className="relative w-full h-full flex items-end md:items-center justify-start md:justify-center p-8 md:px-12 pb-12 md:pb-0">
            
            {/* DESKTOP: VERTICAL ID */}
            <div className={`hidden md:flex absolute flex-col items-center transition-opacity duration-500 ${hoveredIndex === index ? 'opacity-0' : 'opacity-100'}`}>
              <span className="font-serif text-[8vw] leading-none text-white/20 rotate-90 whitespace-nowrap select-none">
                {project.id}
              </span>
            </div>

            {/* MAIN TEXT CONTENT */}
            <div className={`content-${index} flex flex-col items-start max-w-2xl transition-opacity duration-300 
                ${(window.innerWidth < 768) ? 'opacity-100' : (hoveredIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none')}
            `}>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#4a0404] bg-white px-2 py-1">
                  CASE STUDY {project.id}
                </span>
                <div className="h-[1px] w-12 bg-white/40"></div>
              </div>

              <h3 className="font-serif text-5xl md:text-[5vw] text-white leading-[0.9] mb-4 md:mb-6">
                {project.title.split(' ')[0]} <br />
                <span className="italic text-white/60">{project.title.split(' ')[1] || ""}</span>
              </h3>

              <p className="font-sans text-white/70 text-sm md:text-base mb-8 max-w-sm">
                {project.tagline}
              </p>

              {/* PROJECT LINK */}
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group/btn relative inline-flex items-center gap-6 py-2 md:py-4 overflow-hidden cursor-pointer"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white">Explore Project</span>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-white">
                    <span className="text-white group-hover/btn:text-black transition-colors duration-300">&rarr;</span>
                </div>
              </a>
            </div>
          </div>

          {/* CATEGORY TAG */}
          <div className="absolute top-8 right-8 md:top-auto md:right-auto md:bottom-12 md:left-12">
             <span className="block font-mono text-[9px] text-white/60 md:text-white/40 tracking-widest uppercase border border-white/20 px-3 py-1 rounded-full md:border-none md:p-0">
                {project.category}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkPreview;