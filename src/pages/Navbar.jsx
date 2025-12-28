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
      gsap.fromTo(".portal-button", 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: "power4.out", delay: 0.5 }
      );
      gsap.from(".menu-detail", { opacity: 0, y: 10, duration: 1, stagger: 0.1, delay: 0.8 });
    } else {
      gsap.to(menuOverlayRef.current, { clipPath: "circle(0% at 90% 10%)", duration: 1.2, ease: "expo.inOut" });
    }
  }, [isMenuOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center z-[1000] pointer-events-none px-4">
        <nav ref={navRef} className="relative flex items-center justify-between pointer-events-auto transition-all">
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

      {/* --- ELITE MENU OVERLAY --- */}
      <div ref={menuOverlayRef} className="fixed inset-0 bg-[#4a0404] z-[2000] flex flex-col justify-between p-8 md:p-16 overflow-hidden" style={{ clipPath: "circle(0% at 90% 10%)" }}>
        
        {/* Grain & Watermark */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] opacity-[0.03] pointer-events-none">
          <div className="flex items-center -space-x-10 justify-center">
             <img src={logo} alt="" className="w-full grayscale invert scale-110" />
             <img src={logo} alt="" className="w-full grayscale invert scale-110 scale-x-[-1]" />
          </div>
        </div>

        {/* Top bar: Stats & Close */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="menu-detail flex flex-col">
            <span className="font-mono text-[9px] text-[#EAE8E4]/30 uppercase tracking-[0.5em]">Navigation</span>
            <span className="font-serif italic text-[#EAE8E4] text-lg">Maison J&E</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#EAE8E4]/40 group-hover:text-white transition-all">Close</span>
            <div className="w-12 h-12 border border-[#EAE8E4]/10 rounded-full flex items-center justify-center group-hover:bg-[#EAE8E4] group-hover:text-[#4a0404] transition-all duration-500 text-xl font-light">×</div>
          </button>
        </div>

        {/* Center: Boutique Button Links */}
        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
          {[
            { label: 'The Index', path: '/', num: '01' },
            { label: 'Selected Work', path: '/work', num: '02' },
            { label: 'About Studio', path: '/about', num: '03' },
            { label: 'Start Project', path: '/contact', num: '04' }
          ].map((item, i) => (
            <div key={i} className="portal-button w-full max-w-lg">
              <Link 
                to={item.path} 
                onClick={() => setIsMenuOpen(false)}
                className="group relative flex items-center justify-between px-8 py-6 md:py-8 border-b border-[#EAE8E4]/10 transition-all duration-500 hover:border-[#EAE8E4]/40"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-[10px] opacity-30 group-hover:text-[#EAE8E4] group-hover:opacity-100 transition-all">{item.num}</span>
                  <span className="font-serif italic text-3xl md:text-5xl text-[#EAE8E4] group-hover:translate-x-4 transition-transform duration-700">{item.label}</span>
                </div>
                {/* Arrow Icon */}
                <div className="w-10 h-10 rounded-full border border-[#EAE8E4]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:rotate-[-45deg] transition-all duration-500">
                    <span className="text-[#EAE8E4] text-xl">→</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Socials & Location */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-12 border-t border-[#EAE8E4]/05 pt-8">
          <div className="menu-detail flex flex-col gap-3">
             <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-[#EAE8E4]/30">Connection</span>
             <div className="flex gap-8">
                {['Instagram', 'LinkedIn', 'Twitter'].map(s => (
                  <a key={s} href="#" className="font-mono text-[9px] uppercase tracking-widest text-[#EAE8E4]/60 hover:text-white transition-all underline decoration-[#EAE8E4]/10 underline-offset-8">{s}</a>
                ))}
             </div>
          </div>
          <div className="menu-detail text-right hidden md:block">
            <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-[#EAE8E4]/30">Location</span>
            <p className="font-serif italic text-[#EAE8E4]/80">NBO, Kenya — Worldwide</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;