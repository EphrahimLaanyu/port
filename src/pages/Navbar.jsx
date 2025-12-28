import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import logo from "../assets/logo burgundy.png"; // Using the burgundy one for the light nav

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const location = useLocation();

  const navRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsCondensed(window.scrollY > 40);
    const timer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString('en-GB', { 
        hour: '2-digit', minute: '2-digit', hour12: false 
      }));
    }, 1000);
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(timer); };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      if (isCondensed) {
        gsap.to(navRef.current, {
          width: "auto",
          minWidth: isMobile ? "90%" : "600px", 
          padding: "12px 24px",
          backgroundColor: "rgba(234, 232, 228, 0.8)", 
          backdropFilter: "blur(20px)",
          borderRadius: "100px",
          y: 20,
          border: "1px solid rgba(74, 4, 4, 0.1)",
          boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.15)",
          duration: 1,
          ease: "expo.out"
        });
        gsap.to(".nav-logo", { scale: 0.8, duration: 1 });
      } else {
        gsap.to(navRef.current, {
          width: "100%",
          padding: isMobile ? "20px" : "40px 60px",
          backgroundColor: "transparent",
          backdropFilter: "blur(0px)",
          borderRadius: "0px",
          y: 0,
          border: "0px solid transparent",
          boxShadow: "none",
          duration: 1,
          ease: "expo.out"
        });
        gsap.to(".nav-logo", { scale: 1, duration: 1 });
      }
    }, navRef);
    return () => ctx.revert();
  }, [isCondensed]);

  useLayoutEffect(() => {
    if (isMenuOpen) {
      gsap.to(menuOverlayRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" });
      gsap.fromTo(".portal-link", 
        { y: 100, rotate: 5, opacity: 0 }, 
        { y: 0, rotate: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: "power4.out", delay: 0.3 }
      );
      gsap.from(".menu-bg-logo", { scale: 1.2, opacity: 0, duration: 2, ease: "expo.out" });
    } else {
      gsap.to(menuOverlayRef.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" });
    }
  }, [isMenuOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-[1000] pointer-events-none px-4">
        <nav ref={navRef} className="relative flex items-center justify-between pointer-events-auto w-full transition-all">
          
          {/* BRAND: THE WINGS LOGO */}
          <Link to="/" className="group flex items-center gap-4 cursor-pointer nav-logo origin-left">
            <div className="flex items-center -space-x-2">
                <img src={logo} alt="L" className="w-8 md:w-10 opacity-80" />
                <img src={logo} alt="R" className="w-8 md:w-10 opacity-80 scale-x-[-1]" />
            </div>
            <div className="hidden sm:flex flex-col border-l border-[#4a0404]/20 pl-4">
               <span className="font-serif font-bold text-sm tracking-tighter uppercase text-[#4a0404]">Maison</span>
               <span className="font-mono text-[8px] opacity-40 tabular-nums uppercase">{localTime} NBO</span>
            </div>
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link to="/contact" className="group relative px-6 py-2 border border-[#4a0404]/20 rounded-full overflow-hidden transition-all duration-500 hover:border-[#4a0404]">
                <span className="relative z-10 font-mono text-[9px] uppercase tracking-widest text-[#4a0404] group-hover:text-white transition-colors">Start Project</span>
                <div className="absolute inset-0 bg-[#4a0404] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
            </Link>

            <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 group">
                <div className="flex flex-col gap-1.5 items-end">
                    <div className="w-6 h-[1px] bg-[#4a0404] group-hover:w-10 transition-all duration-500"></div>
                    <div className="w-10 h-[1px] bg-[#4a0404]"></div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#4a0404]">Menu</span>
            </button>
          </div>
        </nav>
      </div>

      {/* LUXURY OVERLAY */}
      <div ref={menuOverlayRef} className="fixed inset-0 bg-[#EAE8E4] z-[2000] flex flex-col md:flex-row p-8 md:p-24 overflow-hidden" style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
        
        {/* BACKGROUND DECOR */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] w-[80%] menu-bg-logo">
            <div className="flex items-center -space-x-20 justify-center">
                <img src={logo} alt="" className="w-full max-w-2xl" />
                <img src={logo} alt="" className="w-full max-w-2xl scale-x-[-1]" />
            </div>
        </div>

        <button onClick={() => setIsMenuOpen(false)} className="absolute top-12 right-12 group flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">Close Archive</span>
            <div className="w-10 h-10 border border-[#4a0404]/20 rounded-full flex items-center justify-center group-hover:bg-[#4a0404] transition-all">
                <span className="text-[#4a0404] group-hover:text-white">&times;</span>
            </div>
        </button>

        <div className="flex flex-col justify-center h-full gap-2 relative z-10">
          {[
            { label: 'The Index', path: '/', num: '01' },
            { label: 'Selected Work', path: '/work', num: '02' },
            { label: 'The Studio', path: '/about', num: '03' },
            { label: 'Initialize', path: '/contact', num: '04' }
          ].map((item, i) => (
            <div key={i} className="portal-link overflow-hidden flex items-baseline gap-6 group">
              <span className="font-mono text-xs opacity-30 text-[#4a0404] translate-y-[-2vw]">{item.num}</span>
              <Link 
                to={item.path} 
                onClick={() => setIsMenuOpen(false)}
                className="font-serif italic text-[12vw] md:text-[7vw] leading-[1.1] text-[#4a0404] hover:pl-12 transition-all duration-700 hover:opacity-40"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="absolute bottom-12 right-12 hidden md:block text-right">
            <p className="font-mono text-[9px] uppercase tracking-widest opacity-40 leading-relaxed">
                J&E Maison Studio<br/>
                Digital Sanctuary ©2025<br/>
                Nairobi / Global
            </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;