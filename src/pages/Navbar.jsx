import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

// ==============================================
// 1. HELPER: SCRAMBLE TEXT
// ==============================================
const ScrambleText = ({ text, trigger }) => {
  const [display, setDisplay] = useState(text);
  
  useEffect(() => {
    if (!trigger) {
      setDisplay(text);
      return;
    }
    
    let chars = "0123456789";
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * 10)];
          })
          .join("")
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [trigger, text]);

  return <span>{display}</span>;
};

// ==============================================
// 2. COMPONENT: NAV NODE (The Tick & Label)
// ==============================================
const NavNode = ({ label, sub, index, total }) => {
  const [isHovered, setIsHovered] = useState(false);
  const tickRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // GSAP Animation Logic
    if (isHovered) {
      // HOVER STATE: Tick grows red, Text moves down slightly and turns red
      gsap.to(tickRef.current, { 
        height: 24, 
        backgroundColor: "#4a0404", 
        duration: 0.4, 
        ease: "power2.out" 
      });
      gsap.to(textRef.current, { 
        y: 5, // Moves slightly down for emphasis
        opacity: 1, 
        color: "#4a0404",
        duration: 0.4, 
        ease: "power2.out" 
      });
    } else {
      // IDLE STATE: Tick shrinks, Text returns to neutral position and gray
      gsap.to(tickRef.current, { 
        height: 8, 
        backgroundColor: "#1a1a1a", 
        duration: 0.4, 
        ease: "power2.out" 
      });
      gsap.to(textRef.current, { 
        y: 0, 
        opacity: 0.5, // Semi-transparent when idle
        color: "#1a1a1a",
        duration: 0.3, 
        ease: "power2.in" 
      });
    }
  }, [isHovered]);

  // Calculate position percentage
  const position = `${((index + 1) / (total + 1)) * 100}%`;

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-50"
      style={{ left: position }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        {/* The Clickable Area */}
        <div className="absolute w-12 h-20 -top-10"></div>

        {/* The Tick Mark */}
        <div ref={tickRef} className="w-[1px] h-2 bg-[#1a1a1a] origin-center transition-colors"></div>

        {/* The Label (Now Visible) */}
        <div 
          ref={textRef} 
          className="absolute top-4 flex flex-col items-center whitespace-nowrap opacity-50"
        >
            <span className="font-serif italic text-lg leading-none transition-colors duration-300">
                {label}
            </span>
            <span className="font-mono text-[8px] tracking-widest uppercase mt-1">
                  COORD <ScrambleText text={sub} trigger={isHovered} />
            </span>
        </div>
    </div>
  );
};

// ==============================================
// 3. MAIN NAVBAR COMPONENT
// ==============================================

const Navbar = () => {
  const lineRef = useRef(null);
  const trackerRef = useRef(null);
  
  const menuItems = [
    { label: "Index", sub: "01.04" },
    { label: "Projects", sub: "12.08" },
    { label: "Maison", sub: "88.21" },
    { label: "Contact", sub: "00.00" }
  ];

  // 1. Intro Animation
  useEffect(() => {
    gsap.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
    );
  }, []);

  // 2. Mouse Tracker Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
       if (!trackerRef.current) return;
       gsap.to(trackerRef.current, {
         x: e.clientX,
         duration: 0.6,
         ease: "power2.out"
       });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed top-12 left-0 w-full z-[100] px-12 pointer-events-none mix-blend-darken">
      
      <div className="relative w-full">
          
          {/* THE ARCHITECTURAL LINE */}
          <div ref={lineRef} className="w-full h-[1px] bg-[#1a1a1a] opacity-20 relative origin-center"></div>

          {/* THE MOUSE TRACKER */}
          <div
             ref={trackerRef}
             className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#4a0404] rounded-full -ml-[0.75px] pointer-events-none opacity-80"
             style={{ left: 0 }}
          ></div>

          {/* LEFT ANCHOR (Logo) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 pr-4 pointer-events-auto cursor-pointer group">
              <span className="font-mono text-[9px] font-bold tracking-widest opacity-100 group-hover:opacity-50 transition-opacity">M—S</span>
          </div>

          {/* RIGHT ANCHOR (Menu Trigger) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 pl-4 pointer-events-auto cursor-pointer group">
             {/* Hamburger Icon */}
             <div className="flex flex-col gap-1 items-end">
                <div className="w-4 h-[1px] bg-[#1a1a1a] group-hover:w-6 transition-all duration-300"></div>
                <div className="w-3 h-[1px] bg-[#1a1a1a] group-hover:w-6 transition-all duration-300 delay-75"></div>
             </div>
          </div>

          {/* NAV NODES */}
          <div className="pointer-events-auto">
             {menuItems.map((item, index) => (
                <NavNode 
                   key={index} 
                   label={item.label} 
                   sub={item.sub}
                   index={index}
                   total={menuItems.length}
                />
             ))}
          </div>

      </div>
    </div>
  );
};

export default Navbar;