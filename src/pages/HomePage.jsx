import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==============================================
// 1. UTILITIES & HELPER COMPONENTS
// ==============================================

const useScramble = (text) => {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((letter, index) => {
            if (index < iteration) return text[index];
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)];
          }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3; 
    }, 30);
    return () => clearInterval(interval);
  }, [text]);
  return display;
};

const CipherText = ({ text, className }) => {
  const scrambled = useScramble(text);
  return <span className={className}>{scrambled}</span>;
};

const PrecisionCursor = () => {
  const cursorRef = useRef(null);
  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    };
    const clickAnim = () => {
      gsap.fromTo(cursorRef.current, { scale: 1 }, { scale: 1.5, duration: 0.1, yoyo: true, repeat: 1 });
    };
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", clickAnim);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", clickAnim);
    };
  }, []);
  return (
    <div ref={cursorRef} className="fixed top-0 left-0 w-3 h-3 bg-[#4a0404] rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-ping opacity-20 bg-[#4a0404] rounded-full"></div>
    </div>
  );
};

const MagneticNav = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.3; 
      const y = (clientY - (top + height / 2)) * 0.3;
      gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });
    };
    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    };
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  return <div ref={ref} className="relative p-2 cursor-pointer inline-block">{children}</div>;
};

const GlassCard = ({ children, className }) => (
  <div className={`backdrop-blur-sm bg-white/40 border border-white/50 shadow-sm rounded-md ${className}`}>
    {children}
  </div>
);

// --- 3D DEEP LETTER COMPONENT (For Hero) ---
const DeepLetter = ({ char, className }) => {
  const layers = [...Array(10)]; 
  return (
    <div className={`relative perspective-container ${className}`} style={{ perspective: '1000px' }}>
      <div className="preserve-3d relative">
        {layers.map((_, i) => {
          const isTop = i === 0;
          const zDepth = i * -15; 
          return (
            <h1 
              key={i}
              className={`font-serif text-[18vw] leading-none tracking-tighter absolute top-0 left-0 w-full text-center
                ${isTop ? 'text-stroke z-50' : ''} 
                ${!isTop ? 'text-[#4a0404] opacity-80 blur-[1px]' : ''}
              `}
              style={{
                transform: `translateZ(${zDepth}px)`,
                filter: isTop ? 'none' : `brightness(${1 - (i * 0.08)}) blur(${i * 0.5}px)`,
                zIndex: 50 - i
              }}
              data-depth-layer={i} 
            >
              {char}
            </h1>
          );
        })}
      </div>
      <h1 className="font-serif text-[18vw] leading-none tracking-tighter opacity-0">{char}</h1>
    </div>
  );
};

// ==============================================
// 2. HERO COMPONENT
// ==============================================

const Hero = () => {
  const container = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle3DMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
      const xNorm = (e.clientX / window.innerWidth - 0.5);
      const yNorm = (e.clientY / window.innerHeight - 0.5);

      gsap.utils.toArray('[data-depth-layer]').forEach((layer) => {
        const depth = layer.getAttribute('data-depth-layer');
        if (depth > 0) {
            gsap.to(layer, {
                x: (xNorm * 50) * depth,
                y: (yNorm * 50) * depth,
                duration: 0.2,
                ease: "power1.out"
            });
        }
      });

      // Parallax for Ampersand
      gsap.to(".brand-amp", {
        x: xNorm * -30,
        y: yNorm * -30,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handle3DMove);
    return () => window.removeEventListener("mousemove", handle3DMove);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(container.current, { opacity: 1, duration: 1 });
      tl.fromTo(".grid-line", { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "expo.out", stagger: 0.01 });
      tl.fromTo(".grid-line-vert", { scaleY: 0 }, { scaleY: 1, duration: 1.5, ease: "expo.out", stagger: 0.01 }, "<");
      tl.from(".glass-card", { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=1");
      
      tl.from(".brand-amp", { scale: 0, autoAlpha: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }, "-=0.5");
      tl.from(".deep-j-container", { x: -100, autoAlpha: 0, duration: 1.2, ease: "power4.out" }, "-=1.2");
      tl.from(".deep-e-container", { x: 100, autoAlpha: 0, duration: 1.2, ease: "power4.out" }, "<");
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative w-full h-screen overflow-hidden text-[#1a1a1a] opacity-0 cursor-none">
      
      <PrecisionCursor />

      <style jsx>{`
        .text-stroke { -webkit-text-stroke: 2px #1a1a1a; color: transparent; }
        .preserve-3d { transform-style: preserve-3d; }
        .perspective-container { perspective: 1000px; }
        .glass-card {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
          border-radius: 4px;
        }
      `}</style>

      {/* GRAPH PAPER */}
      <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between overflow-hidden">
         {[...Array(40)].map((_, i) => (
             <div key={`h-${i}`} className={`grid-line w-full origin-left ${i % 6 === 0 ? 'h-[1px] bg-[#4a0404]/30 z-10' : 'h-[1px] bg-[#1a1a1a]/5 z-0'}`}></div>
         ))}
         <div className="absolute inset-0 flex justify-between">
            {[...Array(60)].map((_, i) => (
                <div key={`v-${i}`} className={`grid-line-vert h-full origin-top ${i % 6 === 0 ? 'w-[1px] bg-[#4a0404]/30 z-10' : 'w-[1px] bg-[#1a1a1a]/5 z-0'}`}></div>
            ))}
         </div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-12">
        
        <div className="flex justify-between items-start">
            <div className="glass-card px-4 py-3 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#4a0404] rounded-full"></div>
                    <span className="font-mono text-[10px] tracking-widest uppercase opacity-60">
                        FIG 1.0 // <CipherText text="MAISON" />
                    </span>
                </div>
            </div>
            <div className="glass-card px-4 py-3 font-mono text-[10px] tracking-widest text-[#1a1a1a]/60 text-right">
                <div>LAT: <span className="text-[#4a0404]">{coords.x}</span></div>
                <div>LON: <span className="text-[#4a0404]">{coords.y}</span></div>
            </div>
        </div>

        {/* CENTER STAGE */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <div className="mb-8 flex justify-center">
               <div className="glass-card px-4 py-1 rounded-full border-[#4a0404]/20">
                  <p className="font-mono text-[9px] text-[#4a0404] tracking-[0.3em] uppercase">Architecture & Design</p>
               </div>
            </div>

            <div className="grid grid-cols-3 items-center justify-items-center w-full max-w-5xl mx-auto select-none perspective-container">
                <div className="deep-j-container justify-self-end -mr-12 md:-mr-32 z-0"><DeepLetter char="J" /></div>
                <div className="brand-amp z-20 relative preserve-3d">
                    <h1 className="font-serif italic text-[12vw] leading-none text-[#4a0404]" style={{ filter: 'drop-shadow(0px 30px 20px rgba(0,0,0,0.3))' }}>&</h1>
                </div>
                {/* IMPORTANT: This 'deep-e-container' is what gets animated 
                   across the screen in HomePage.jsx 
                */}
                <div className="deep-e-container justify-self-start -ml-12 md:-ml-32 z-0"><DeepLetter char="E" /></div>
            </div>
        </div>

        <div className="flex justify-between items-end">
             <div className="glass-card px-4 py-2"><p className="font-mono text-[10px] opacity-50 uppercase tracking-widest">Nairobi, KE ©2025</p></div>
        </div>

      </div>
    </div>
  );
};

// ==============================================
// 3. ABOUT COMPONENT
// ==============================================

const About = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden text-[#1a1a1a] flex items-center justify-center">
      
      {/* COPY BACKGROUND GRID (Seamless Transition) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between overflow-hidden">
         {[...Array(40)].map((_, i) => (
             <div key={`h-${i}`} className={`w-full origin-left ${i % 6 === 0 ? 'h-[1px] bg-[#4a0404]/30' : 'h-[1px] bg-[#1a1a1a]/5'}`}></div>
         ))}
         <div className="absolute inset-0 flex justify-between">
            {[...Array(60)].map((_, i) => (
                <div key={`v-${i}`} className={`h-full origin-top ${i % 6 === 0 ? 'w-[1px] bg-[#4a0404]/30' : 'w-[1px] bg-[#1a1a1a]/5'}`}></div>
            ))}
         </div>
      </div>

      <div className="relative z-10 max-w-6xl w-full px-8 flex flex-col md:flex-row items-center gap-12">
        
        {/* LEFT: THE HEADLINE */}
        <div className="flex-1">
            <div className="flex items-baseline">
                {/* THE EMPTY SPACE for the 'E'.
                   The 'E' from Hero will animate exactly into this spot.
                   Width is approx 18vw * 0.8 (scaled) ~ 14vw
                */}
                <div className="w-[14vw] h-[14vw] flex-shrink-0 relative">
                   {/* Ghost E for alignment (Hidden, helps you visualize) */}
                   {/* <h1 className="font-serif text-[18vw] leading-none opacity-10">E</h1> */}
                </div>
                
                {/* THE REST OF THE WORD */}
                <h1 className="font-serif text-[10vw] leading-none tracking-tighter text-[#1a1a1a]">
                   LEVATED
                </h1>
            </div>
            
            <div className="mt-8 ml-[14vw]">
                <GlassCard className="p-8 inline-block max-w-md">
                    <h3 className="font-mono text-xs text-[#4a0404] tracking-[0.3em] uppercase mb-4">The Methodology</h3>
                    <p className="font-serif text-xl italic leading-relaxed opacity-80">
                        "We don't just write code. We orchestrate digital physics. J&E Maison represents the intersection of structural engineering and high-fashion aesthetics."
                    </p>
                </GlassCard>
            </div>
        </div>

        {/* RIGHT: IMAGE / CONTENT */}
        <div className="flex-1 h-[60vh] relative group">
             {/* A placeholder for a high-end image */}
             <div className="w-full h-full bg-[#1a1a1a] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#4a0404] opacity-20 group-hover:opacity-0 transition-opacity duration-700"></div>
                 <div className="absolute inset-0 border-[1px] border-white/20 m-4"></div>
                 
                 {/* Technical markers */}
                 <div className="absolute top-8 right-8 font-mono text-[10px] text-white tracking-widest">
                     IMG_REF_02
                 </div>
                 
                 {/* Center text */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                     <div className="w-32 h-32 rounded-full border border-white/20 animate-spin-slow"></div>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

// ==============================================
// 4. MAIN HOMEPAGE (The Orchestrator)
// ==============================================

const HomePage = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. HORIZONTAL SCROLL LOGIC
      // We pin the container and move it X: -100vw (to show the second page)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=2000", // The length of the scroll interaction
          scrub: 1,      // Smooth scrubbing
          pin: true,     // Pin the page while scrolling
        }
      });

      // Move the whole world to the left
      tl.to(container.current, {
        xPercent: -50, // Moves -100vw (since container is 200vw wide)
        ease: "none",
      });

      // 2. THE "E" CONNECTION ANIMATION
      // While the world moves Left, we move the "E" Right so it stays in view
      // Then we slot it into the "About" headline.
      
      // Target the "E" container in Hero
      tl.to(".deep-e-container", {
        x: "35vw", // Move it right relative to Hero to land in About
        y: "5vh",  // Slight adjustment to align with About text
        scale: 0.8, // Scale down slightly for the new headline
        rotationY: 180, // Spin it for flair? Or keep it stable. Let's keep stable.
        ease: "power1.inOut"
      }, 0); // Start at same time as scroll

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#F4F4F0]">
      {/* The Container is 200vw Wide (2 Screens). 
         We slide this container leftwards.
      */}
      <div ref={container} className="flex w-[200vw] h-screen">
        <div className="w-screen h-screen flex-shrink-0">
          <Hero />
        </div>
        <div className="w-screen h-screen flex-shrink-0">
          <About />
        </div>
      </div>
    </div>
  );
};

export default HomePage;