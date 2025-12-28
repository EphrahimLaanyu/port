import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const location = useLocation();

  const navRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const brandRef = useRef(null);
  const actionsRef = useRef(null);
  const indicatorRef = useRef(null);

  const getSectionData = () => {
    switch (location.pathname) {
      case '/work': return { num: "02 / 04", name: "Work" };
      case '/about': return { num: "03 / 04", name: "About" };
      case '/contact': return { num: "04 / 04", name: "Contact" };
      default: return { num: "01 / 04", name: "Home" };
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsCondensed(window.scrollY > 40);
    };

    const timer = setInterval(() => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
      }));
    }, 1000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      if (isCondensed) {
        gsap.to(navRef.current, {
          width: "auto",
          // Adjust minWidth for mobile screens to keep it compact
          minWidth: isMobile ? "280px" : "550px", 
          padding: isMobile ? "10px 16px" : "12px 32px",
          backgroundColor: "rgba(255, 255, 255, 0.7)", 
          backdropFilter: "blur(20px) saturate(160%)",
          borderRadius: "100px",
          y: isMobile ? 10 : 20,
          border: "1px solid rgba(74, 4, 4, 0.25)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          duration: 1.2,
          ease: "expo.inOut"
        });
        gsap.to(brandRef.current, { scale: isMobile ? 0.8 : 0.9, duration: 1, ease: "expo.inOut" });
        gsap.to(indicatorRef.current, { opacity: 1, x: 0, duration: 0.8 });
        gsap.to(actionsRef.current, { gap: isMobile ? "12px" : "32px", duration: 1, ease: "expo.inOut" });

      } else {
        gsap.to(navRef.current, {
          width: "100%",
          minWidth: "100%",
          padding: isMobile ? "16px 20px" : "32px 48px",
          backgroundColor: "transparent",
          backdropFilter: "blur(0px)",
          borderRadius: "0px",
          y: 0,
          border: "0px solid transparent",
          boxShadow: "none",
          duration: 1.2,
          ease: "expo.inOut"
        });
        gsap.to(brandRef.current, { scale: 1, duration: 1, ease: "expo.inOut" });
        gsap.to(indicatorRef.current, { opacity: 0, x: -20, duration: 0.5 });
        gsap.to(actionsRef.current, { gap: isMobile ? "20px" : "40px", duration: 1, ease: "expo.inOut" });
      }
    }, navRef);
    return () => ctx.revert();
  }, [isCondensed]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        gsap.to(menuOverlayRef.current, {
          clipPath: "circle(150% at 90% 10%)",
          duration: 1.4,
          ease: "expo.inOut"
        });
        gsap.fromTo(".portal-link", 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power4.out", delay: 0.4 }
        );
      } else {
        gsap.to(menuOverlayRef.current, {
          clipPath: "circle(0% at 90% 10%)",
          duration: 1.2,
          ease: "expo.inOut"
        });
      }
    }, menuOverlayRef);
    return () => ctx.revert();
  }, [isMenuOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-[1000] pointer-events-none px-2 md:px-4">
        <nav 
          ref={navRef}
          className="relative flex items-center justify-between pointer-events-auto transition-all"
        >
          {/* BRAND CLUSTER */}
          <Link to="/" className="group flex items-center gap-3 md:gap-6 cursor-pointer origin-left">
            <div className="flex flex-col">
              <h1 className="font-serif text-lg md:text-2xl tracking-tighter uppercase text-[#4a0404] font-bold leading-none">
                J&E Maison
              </h1>
              <div className="flex items-center gap-1.5 font-mono text-[7px] md:text-[9px] uppercase tracking-widest text-[#1a1a1a] mt-1">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                <span className="opacity-60 tabular-nums">{localTime}</span>
              </div>
            </div>

            {/* SECTION INDICATOR (Hidden on very small screens, shown on dock) */}
            <div 
              ref={indicatorRef} 
              className="hidden sm:flex flex-col border-l border-[#4a0404]/20 pl-4 md:pl-6 opacity-0 -translate-x-5"
            >
              <span className="font-mono text-[7px] md:text-[8px] uppercase tracking-[0.3em] opacity-40">
                {getSectionData().name}
              </span>
              <span className="font-serif italic text-xs md:text-sm text-[#4a0404]">
                {getSectionData().num}
              </span>
            </div>
          </Link>

          {/* ACTION CLUSTER */}
          <div ref={actionsRef} className="flex items-center gap-5 md:gap-10 origin-right transition-all">
            
            {/* DYNAMIC INQUIRY BUTTON: ICON ON MOBILE, TEXT ON DESKTOP */}
            <Link to="/contact" className="group relative flex items-center justify-center overflow-hidden w-10 h-10 md:w-auto md:h-auto md:px-8 md:py-2.5 border border-[#4a0404]/30 rounded-full bg-white/40 backdrop-blur-md transition-all">
              {/* DESKTOP TEXT */}
              <span className="hidden md:block relative z-10 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] group-hover:text-white transition-colors duration-500">
                Inquiry
              </span>
              
              {/* MOBILE CHAT ICON (Minimalist Geometric) */}
              <div className="md:hidden relative z-10 flex items-center justify-center">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a0404" strokeWidth="1.5" strokeLinecap="square">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                 </svg>
              </div>

              <div className="absolute inset-0 bg-[#4a0404] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]"></div>
            </Link>

            {/* MENU TRIGGER */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-end gap-1 md:gap-1.5 group cursor-pointer py-2"
            >
              <div className="w-6 md:w-10 h-[1.5px] md:h-[2px] bg-[#4a0404] transition-all duration-500 group-hover:w-12"></div>
              <span className="font-mono text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#4a0404]">
                Menu
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* FULL-SCREEN OVERLAY (CURTAIN) */}
      <div 
        ref={menuOverlayRef}
        className="fixed inset-0 bg-[#4a0404] z-[2000] flex flex-col justify-center p-8 md:p-24"
        style={{ clipPath: "circle(0% at 90% 10%)" }}
      >
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-8 right-8 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#EAE8E4]/50 hover:text-white transition-colors"
        >
          [ EXIT_PORTAL ]
        </button>

        <div className="flex flex-col gap-2 md:gap-4">
          {[
            { label: 'Index', path: '/' },
            { label: 'Work', path: '/work' },
            { label: 'About', path: '/about' },
            { label: 'Contact', path: '/contact' }
          ].map((item) => (
            <div key={item.label} className="overflow-hidden group portal-link opacity-0">
              <Link 
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block font-serif italic text-[14vw] md:text-[8vw] leading-none text-[#EAE8E4] transition-all duration-700 hover:pl-6 md:hover:pl-12 hover:opacity-40"
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