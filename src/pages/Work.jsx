import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "01",
    client: "AURORA PROPERTIES",
    title: "LUMINAL RESIDENCE",
    type: "WEB ARCHITECTURE",
    year: "2024",
    description: "A digital experience designed to mirror the fluidity of high-end real estate, focusing on spatial navigation and light-play.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "02",
    client: "NEON VENTURES",
    title: "CRYPTO ATELIER",
    type: "BLOCKCHAIN INTERFACE",
    year: "2023",
    description: "Developing a visual language for decentralized finance that prioritizes clarity, security, and architectural precision.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2232&auto=format&fit=crop"
  },
  {
    id: "03",
    client: "STUDIO KINETIC",
    title: "MOTION REEL",
    type: "IMMERSIVE SHOWCASE",
    year: "2024",
    description: "An experimental folio utilizing physics-based interactions to showcase global motion design excellence.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "04",
    client: "VELVET & CO",
    title: "MAISON DE LUXE",
    type: "E-COMMERCE SYSTEM",
    year: "2024",
    description: "A high-fashion commerce platform where every transition is choreographed to feel like a boutique fitting.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "05",
    client: "TERRA FIRMA",
    title: "LANDSCAPE GENOME",
    type: "DATA VISUALIZATION",
    year: "2023",
    description: "Transforming complex environmental data into a readable, beautiful architectural blueprint.",
    image: "https://images.unsplash.com/photo-1449156003053-c30670b96835?q=80&w=2670&auto=format&fit=crop"
  }
];

// ==============================================
// COMPONENT: SCRAMBLE TEXT HELPER
// ==============================================
const ScrambleText = ({ text, trigger }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    let interval = setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, text]);

  return <span>{displayText}</span>;
};

const Work = () => {
  const containerRef = useRef(null);
  const scrollLineRef = useRef(null);
  const cursorRef = useRef(null);
  const [activeScramble, setActiveScramble] = useState({});

  // ==============================================
  // 1. CUSTOM CURSOR & 3D TILT LOGIC
  // ==============================================
  const handleMouseMove = (e) => {
    // Move Portal Cursor
    gsap.to(cursorRef.current, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: "power2.out"
    });

    // Handle 3D Tilt on Hovered Image
    const imageContainer = e.target.closest(".project-image-mask");
    if (imageContainer) {
      const rect = imageContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(imageContainer.querySelector("img"), {
        rotateY: x * 15,
        rotateX: -y * 15,
        scale: 1.1,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const handleImageLeave = (e) => {
    gsap.to(e.currentTarget.querySelector("img"), {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    });
    gsap.to(cursorRef.current, { opacity: 0, scale: 0 });
  };

  const handleImageEnter = () => {
    gsap.to(cursorRef.current, { opacity: 1, scale: 1 });
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 2. SENSORY SCROLL PHYSICS (Stretch/Compress)
      ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity() / 1000);
          gsap.to(".project-image-mask img", {
            scaleY: 1 + (velocity * 0.05),
            duration: 0.2,
            overwrite: true
          });
        }
      });

      // 3. PARALLAX BACKDROPS (The Big Numbers)
      gsap.utils.toArray(".bg-number").forEach((num) => {
        gsap.to(num, {
          y: -200,
          scrollTrigger: {
            trigger: num,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

      // 4. SECTION REVEALS & SCRAMBLE TRIGGER
      gsap.utils.toArray(".project-section").forEach((section, i) => {
        const image = section.querySelector(".project-image-mask");
        const details = section.querySelectorAll(".detail-item");

        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          onEnter: () => setActiveScramble(prev => ({ ...prev, [i]: true })),
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        });

        tl.fromTo(image, 
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.6, ease: "expo.inOut" }
        )
        .fromTo(details, 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
          "-=1.2"
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="work-page-container relative bg-[#EAE8E4] text-[#1a1a1a] min-h-screen overflow-x-hidden selection:bg-[#4a0404] selection:text-white"
    >
      <Navbar />

      {/* CUSTOM CURSOR PORTAL */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-20 h-20 border border-[#4a0404] rounded-full pointer-events-none z-[100] flex items-center justify-center opacity-0 scale-0 backdrop-blur-[2px] bg-[#4a0404]/5"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <span className="font-mono text-[8px] text-[#4a0404] font-bold tracking-widest">VIEW</span>
      </div>

      {/* GRAINY FILM OVERLAY (Moving Noise) */}
      <style>{`
        .work-page-container::after {
          content: "";
          position: fixed;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.04;
          z-index: 99;
          pointer-events: none;
          animation: noise 0.2s infinite;
        }
        @keyframes noise {
          0% { transform: translate(0,0) }
          10% { transform: translate(-1%,-1%) }
          20% { transform: translate(-2%,1%) }
          100% { transform: translate(1%,-2%) }
        }
        .project-image-mask { perspective: 1000px; }
        .project-image-mask img { will-change: transform; transition: filter 0.3s; }
        .project-image-mask:hover img { filter: contrast(1.1) brightness(1.1); }
      `}</style>

      <main className="relative z-10">
        {PROJECTS.map((project, index) => (
          <section 
            key={project.id} 
            className="project-section min-h-screen w-full flex items-center justify-center p-6 md:p-24 relative"
          >
            {/* BACKGROUND PARALLAX NUMBER */}
            <div className="bg-number absolute inset-0 flex items-center justify-center pointer-events-none z-0">
               <span className="text-[35vw] font-serif italic text-black/[0.03] select-none">
                 {project.id}
               </span>
            </div>

            <div className={`w-full max-w-7xl flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 relative z-10`}>
              
              {/* IMAGE COLUMN WITH 3D TILT */}
              <div 
                className="w-full md:w-3/5 group"
                onMouseEnter={handleImageEnter}
                onMouseLeave={handleImageLeave}
              >
                <div className="project-image-mask aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-[#1a1a1a] shadow-2xl">
                  <img 
                    src={project.image} 
                    alt={project.client} 
                    className="w-full h-full object-cover opacity-90 transition-all duration-300 pointer-events-auto"
                  />
                  {/* Chroma Aberration Simulation on Hover (via backdrop filter in CSS if desired, here just grid) */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[linear-gradient(to_right,#4a0404_1px,transparent_1px),linear-gradient(to_bottom,#4a0404_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                </div>
              </div>

              {/* DETAILS COLUMN WITH SCRAMBLE */}
              <div className="w-full md:w-2/5 flex flex-col items-start">
                <span className="detail-item font-mono text-[10px] uppercase tracking-[0.4em] text-[#4a0404] mb-4">
                  <ScrambleText text={`[ REF.${project.id} / 05 ]`} trigger={activeScramble[index]} />
                </span>
                
                <h2 className="detail-item font-serif text-5xl md:text-7xl leading-tight mb-6">
                  <ScrambleText text={project.client} trigger={activeScramble[index]} />
                </h2>

                <div className="detail-item flex items-center gap-4 mb-8">
                  <div className="h-[1px] w-8 bg-[#1a1a1a]/40"></div>
                  <span className="font-mono text-[10px] tracking-widest uppercase opacity-60 italic">
                    {project.type} // {project.year}
                  </span>
                </div>

                <p className="detail-item font-serif text-lg leading-relaxed opacity-80 mb-10 max-w-sm">
                  {project.description}
                </p>

                <button 
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    gsap.to(e.currentTarget, { x: x * 0.4, y: y * 0.4, duration: 0.6 });
                  }}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: "elastic.out" })}
                  className="detail-item group relative px-10 py-4 border border-[#1a1a1a] rounded-full overflow-hidden transition-all"
                >
                  <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.3em] group-hover:text-white transition-colors duration-500">
                    VIEW_STUDY.EXE
                  </span>
                  <div className="absolute inset-0 bg-[#4a0404] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                </button>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER CALL TO ACTION */}
      <section className="h-screen w-full flex flex-col items-center justify-center bg-[#1a1a1a] text-[#EAE8E4] relative z-50">
          <span className="font-mono text-xs uppercase tracking-[0.5em] mb-8 opacity-40">Architectural Inquiry</span>
          <h2 className="font-serif text-[10vw] italic mb-12">System & Soul.</h2>
          <button className="px-16 py-6 border border-[#EAE8E4] rounded-full font-mono text-xs tracking-[0.4em] hover:bg-[#EAE8E4] hover:text-[#1a1a1a] transition-all duration-700">
             START_INIT.EXE
          </button>
      </section>
    </div>
  );
};

export default Work;