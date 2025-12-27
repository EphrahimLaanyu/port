import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const PROJECTS = [
  {
    id: "01",
    title: "Lumina Bank",
    category: "Fintech App",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop", 
    tagline: "Redefining digital liquidity."
  },
  {
    id: "02",
    title: "Vogue Interiors",
    category: "E-commerce",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
    tagline: "Architectural soul in every pixel."
  },
  {
    id: "03",
    title: "Oasis Health",
    category: "Medical Platform",
    img: "https://images.unsplash.com/photo-1519643381401-22c77e60520e?q=80&w=2670&auto=format&fit=crop",
    tagline: "Engineering the future of wellness."
  },
];

const WorkPreview = () => {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".shutter-panel", 
        { scaleY: 0 }, 
        { scaleY: 1, duration: 1.5, stagger: 0.15, ease: "expo.inOut" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    gsap.fromTo(`.content-${index}`, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.2 }
    );
  };

  return (
    // 'flex-shrink-0' is vital here so it doesn't compress the Hero section
    <div 
      ref={containerRef} 
      className="relative w-screen h-screen bg-[#1a1a1a] flex flex-shrink-0 overflow-hidden font-sans cursor-crosshair"
    >
      {PROJECTS.map((project, index) => (
        <div
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="shutter-panel relative h-full flex transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] will-change-[flex-grow] overflow-hidden group border-r border-white/10 last:border-r-0"
          style={{ 
            flexGrow: hoveredIndex === index ? 6 : hoveredIndex === null ? 1 : 2,
          }}
        >
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={project.img} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
          </div>

          <div className="relative w-full h-full flex items-center justify-center px-12">
            <div className={`absolute flex flex-col items-center transition-opacity duration-500 ${hoveredIndex === index ? 'opacity-0' : 'opacity-100'}`}>
              <span className="font-serif text-[8vw] leading-none text-white/20 rotate-90 whitespace-nowrap select-none">
                {project.id}
              </span>
            </div>

            <div className={`content-${index} flex flex-col items-start max-w-2xl transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#4a0404] bg-white px-2 py-1">
                  CASE STUDY {project.id}
                </span>
                <div className="h-[1px] w-12 bg-white/40"></div>
              </div>

              <h3 className="font-serif text-[6vw] md:text-[5vw] text-white leading-none mb-6">
                {project.title.split(' ')[0]} <br />
                <span className="italic text-white/60">{project.title.split(' ')[1] || ""}</span>
              </h3>

              <p className="font-sans text-white/70 text-sm md:text-base mb-8 max-w-sm">
                {project.tagline}
              </p>

              <button className="group/btn relative flex items-center gap-6 py-4 overflow-hidden">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white">Explore Project</span>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-white">
                    <span className="text-white group-hover/btn:text-black">&rarr;</span>
                </div>
              </button>
            </div>
          </div>

          <div className="absolute bottom-12 left-12">
             <span className="block font-mono text-[9px] text-white/40 tracking-widest uppercase">
                {project.category}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkPreview;