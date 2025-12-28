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

  // 1. DYNAMIC SECTION INDICATOR LOGIC
  const getSectionData = () => {
    switch (location.pathname) {
      case '/work': return { num: "02 / 04", name: "Work" };
      case '/about': return { num: "03 / 04", name: "About" };
      case '/about': return { num: "03 / 04", name: "Work" };
      case '/contact': return { num: "04 / 04", name: "Contact" };
      default: return { num: "01 / 04", name: "Home" };
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // For horizontal layouts, we usually listen to the window scroll 
      // which triggers the GSAP pin progress.
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

  // 2. THE LIQUID DOCK ANIMATION
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isCondensed) {
        const tl = gsap.timeline({ defaults: { ease: "expo.inOut", duration: 1.2 } });

        tl.to(navRef.current, {
          width: "auto",
          minWidth: "550px",
          padding: "12px 32px",
          backgroundColor: "rgba(255, 255, 255, 0.6)", 
          backdropFilter: "blur(20px) saturate(160%)",
          borderRadius: "100px",
          y: 20,
          border: "1px solid rgba(74, 4, 4, 0.25)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        })
        .to(brandRef.current, { scale: 0.9, duration: 1 }, "-=1")
        .to(indicatorRef.current, { opacity: 1, x: 0, duration: 0.8 }, "-=0.5")
        .to(actionsRef.current, { gap: "32px", duration: 1 }, "-=1");

      } else {
        const tl = gsap.timeline({ defaults: { ease: "expo.inOut", duration: 1.2 } });

        tl.to(navRef.current, {
          width: "100%",
          minWidth: "100%",
          padding: "32px 48px",
          backgroundColor: "transparent",
          backdropFilter: "blur(0px)",
          borderRadius: "0px",
          y: 0,
          border: "0px solid transparent",
          boxShadow: "none",
        })
        .to(brandRef.current, { scale: 1, duration: 1 }, "-=1")
        .to(indicatorRef.current, { opacity: 0, x: -20, duration: 0.5 }, "-=1")
        .to(actionsRef.current, { gap: "40px", duration: 1 }, "-=1");
      }
    }, navRef);
    return () => ctx.revert();
  }, [isCondensed]);

  // 3. CURTAIN REVEAL (PORTAL)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        gsap.to(menuOverlayRef.current, {
          clipPath: "circle(150% at 90% 10%)",
          duration: 1.4,
          ease: "expo.inOut"
        });
        // Stagger in links
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
      <div className="fixed top-0 left-0 w-full flex justify-center z-[1000] pointer-events-none px-4">
        <nav 
          ref={navRef}
          className="relative flex items-center justify-between pointer-events-auto transition-all"
          style={{ width: "100%", padding: "32px 48px" }}
        >
          {/* BRAND CLUSTER */}
          <Link to="/" className="group flex items-center gap-6 cursor-pointer origin-left">
            <div className="flex flex-col">
              <h1 className="font-serif text-2xl tracking-tighter uppercase text-[#4a0404] font-bold">
                J&E Maison
              </h1>
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#1a1a1a]">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                <span className="opacity-60 tabular-nums">{localTime}</span>
              </div>
            </div>

            {/* SECTION INDICATOR */}
            <div 
              ref={indicatorRef} 
              className="hidden md:flex flex-col border-l border-[#4a0404]/20 pl-6 opacity-0 -translate-x-5"
            >
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] opacity-40">
                {getSectionData().name}
              </span>
              <span className="font-serif italic text-sm text-[#4a0404]">
                {getSectionData().num}
              </span>
            </div>
          </Link>

          {/* ACTION CLUSTER */}
          <div ref={actionsRef} className="flex items-center gap-10 origin-right transition-all">
            <Link to="/contact" className="group relative overflow-hidden px-8 py-2.5 border border-[#4a0404]/30 rounded-full bg-white/40 backdrop-blur-md">
              <span className="relative z-10 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] group-hover:text-white transition-colors duration-500">
                Inquiry
              </span>
              <div className="absolute inset-0 bg-[#4a0404] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]"></div>
            </Link>

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-end gap-1.5 group cursor-pointer py-2"
            >
              <div className="w-10 h-[2px] bg-[#4a0404] transition-all duration-500 group-hover:w-14"></div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4a0404]">
                Menu
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* FULL-SCREEN OVERLAY (CURTAIN) */}
      <div 
        ref={menuOverlayRef}
        className="fixed inset-0 bg-[#4a0404] z-[2000] flex flex-col justify-center p-12 md:p-24"
        style={{ clipPath: "circle(0% at 90% 10%)" }}
      >
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-12 right-12 font-mono text-[10px] uppercase tracking-[0.4em] text-[#EAE8E4]/50 hover:text-white transition-colors"
        >
          [ EXIT_PORTAL ]
        </button>

        <div className="flex flex-col gap-4">
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
                className="block font-serif italic text-[12vw] md:text-[8vw] leading-none text-[#EAE8E4] transition-all duration-700 hover:pl-12 hover:opacity-40"
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