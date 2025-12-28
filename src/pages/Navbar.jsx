import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import logo from "../assets/logo burgundy.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const location = useLocation();

  const navRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const indicatorRef = useRef(null);

  // RESTORED: Section Data Logic
  const getSectionData = () => {
    switch (location.pathname) {
      case '/work': return { num: "02 / 04", name: "Work" };
      case '/about': return { num: "03 / 04", name: "About" };
      case '/contact': return { num: "04 / 04", name: "Contact" };
      default: return { num: "01 / 04", name: "Home" };
    }
  };

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
        // THE GLASS DOCK: Restored the exact look you liked
        gsap.to(navRef.current, {
          width: "auto",
          minWidth: isMobile ? "90%" : "580px", 
          padding: "10px 28px",
          backgroundColor: "rgba(255, 255, 255, 0.4)", 
          backdropFilter: "blur(25px) saturate(180%)",
          borderRadius: "100px",
          y: 20,
          border: "1px solid rgba(74, 4, 4, 0.15)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
          duration: 1.2,
          ease: "expo.inOut"
        });
        gsap.to(indicatorRef.current, { opacity: 1, x: 0, duration: 0.8 });
      } else {
        gsap.to(navRef.current, {
          width: "100%",
          padding: isMobile ? "20px" : "32px 48px",
          backgroundColor: "transparent",
          backdropFilter: "blur(0px)",
          borderRadius: "0px",
          y: 0,
          border: "0px solid transparent",
          boxShadow: "none",
          duration: 1.2,
          ease: "expo.inOut"
        });
        gsap.to(indicatorRef.current, { opacity: 0, x: -20, duration: 0.5 });
      }
    }, navRef);
    return () => ctx.revert();
  }, [isCondensed]);

  useLayoutEffect(() => {
    if (isMenuOpen) {
      gsap.to(menuOverlayRef.current, { clipPath: "circle(150% at 90% 10%)", duration: 1.4, ease: "expo.inOut" });
      gsap.fromTo(".portal-link", 
        { y: 80, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power4.out", delay: 0.4 }
      );
    } else {
      gsap.to(menuOverlayRef.current, { clipPath: "circle(0% at 90% 10%)", duration: 1.2, ease: "expo.inOut" });
    }
  }, [isMenuOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-[1000] pointer-events-none px-4">
        <nav ref={navRef} className="relative flex items-center justify-between pointer-events-auto transition-all">
          
          {/* BRAND CLUSTER WITH WINGS */}
          <Link to="/" className="group flex items-center gap-4 cursor-pointer">
            <div className="flex items-center -space-x-2 transition-transform duration-500 group-hover:scale-110">
                <img src={logo} alt="L" className="w-7 md:w-9 opacity-90" />
                <img src={logo} alt="R" className="w-7 md:w-9 opacity-90 scale-x-[-1]" />
            </div>
            
            <div ref={indicatorRef} className="flex flex-col border-l border-[#4a0404]/20 pl-4 transition-all">
               <span className="font-mono text-[8px] uppercase tracking-[0.3em] opacity-40">{getSectionData().name}</span>
               <span className="font-serif italic text-sm text-[#4a0404]">{getSectionData().num}</span>
            </div>
          </Link>

          {/* ACTION CLUSTER */}
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/contact" className="group relative hidden sm:flex items-center justify-center px-8 py-2 border border-[#4a0404]/30 rounded-full bg-white/20 overflow-hidden">
                <span className="relative z-10 font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a] group-hover:text-white transition-colors duration-500">Inquiry</span>
                <div className="absolute inset-0 bg-[#4a0404] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo"></div>
            </Link>

            <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 group">
                <div className="flex flex-col gap-1 items-end">
                    <div className="w-6 h-[1.5px] bg-[#4a0404] group-hover:w-10 transition-all duration-500"></div>
                    <div className="w-10 h-[1.5px] bg-[#4a0404]"></div>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4a0404]">Menu</span>
            </button>
          </div>
        </nav>
      </div>

      {/* FULL-SCREEN OVERLAY */}
      <div ref={menuOverlayRef} className="fixed inset-0 bg-[#4a0404] z-[2000] flex flex-col justify-center p-8 md:p-24 overflow-hidden" style={{ clipPath: "circle(0% at 90% 10%)" }}>
        
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-12 right-12 font-mono text-[10px] uppercase tracking-[0.4em] text-[#EAE8E4]/50 hover:text-white transition-colors">
          [ EXIT_PORTAL ]
        </button>

        <div className="flex flex-col gap-2 relative z-10">
          {[
            { label: 'Home', path: '/' },
            { label: 'Work', path: '/work' },
            { label: 'About', path: '/about' },
            { label: 'Contact', path: '/contact' }
          ].map((item, i) => (
            <div key={i} className="portal-link overflow-hidden group">
              <Link 
                to={item.path} 
                onClick={() => setIsMenuOpen(false)}
                className="block font-serif italic text-[14vw] md:text-[8vw] leading-none text-[#EAE8E4] transition-all duration-700 hover:pl-12 hover:opacity-40"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;