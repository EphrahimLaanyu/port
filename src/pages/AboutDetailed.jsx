import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

// --- REUSABLE COMPONENT: STYLISH DIVIDER ---
const StylishDivider = () => (
  <div className="divider-line relative w-full h-[1px] my-16 flex items-center justify-center overflow-hidden">
    <div className="w-full h-full bg-[#0a0a0a]/10 scale-x-0 origin-left transition-transform duration-1000 ease-out divider-bg" />
    <div className="absolute w-2 h-2 bg-[#4a0404] rotate-45 opacity-0 divider-diamond" />
  </div>
);

const AboutDetailed = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. HERO TEXT REVEAL (Staggered)
      const tl = gsap.timeline();
      tl.from(".hero-char", {
        y: 100,
        opacity: 0,
        rotateX: -45,
        stagger: 0.05,
        duration: 1.2,
        ease: "power4.out"
      })
      .from(".hero-meta", { opacity: 0, y: 20, duration: 1 }, "-=0.8");

      // 2. SCROLL ANIMATIONS FOR SECTIONS
      const sections = gsap.utils.toArray(".fade-section");
      sections.forEach(section => {
        gsap.fromTo(section.querySelectorAll(".animate-text"), 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // 3. DIVIDER DRAW ANIMATION
      const dividers = gsap.utils.toArray(".divider-line");
      dividers.forEach(div => {
        const line = div.querySelector(".divider-bg");
        const diamond = div.querySelector(".divider-diamond");
        
        const dTl = gsap.timeline({
          scrollTrigger: {
            trigger: div,
            start: "top 85%",
          }
        });
        
        dTl.to(line, { scaleX: 1, duration: 1.5, ease: "expo.out" })
           .to(diamond, { opacity: 1, rotate: 225, duration: 0.5 }, "-=1");
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#EAE8E4] text-[#0a0a0a] min-h-screen selection:bg-[#4a0404] selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="px-6 md:px-12 lg:px-24 pb-32">
        
        {/* ============================================
            HERO SECTION: "ABOUT US"
           ============================================ */}
        <section className="h-screen flex flex-col justify-center pt-20">
          <div className="hero-meta flex justify-between items-end border-b border-[#0a0a0a] pb-4 mb-12">
             <span className="font-mono text-[10px] tracking-[0.4em] uppercase">Est. 2024</span>
             <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#4a0404]">Nairobi, KE</span>
          </div>

          <div className="overflow-hidden">
            <h1 className="font-serif text-[14vw] leading-[0.85] tracking-tighter uppercase font-medium">
              {"ABOUT".split("").map((char, i) => (
                <span key={i} className="hero-char inline-block">{char}</span>
              ))}
              {/* <span className="hero-char inline-block text-[#4a0404] ml-4 italic">&</span> */}
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="font-serif text-[14vw] leading-[0.85] tracking-tighter uppercase font-medium ml-[10vw]">
              {"US".split("").map((char, i) => (
                <span key={i} className="hero-char inline-block">{char}</span>
              ))}
              <span className="hero-char inline-block text-lg align-top ml-4 opacity-40">®</span>
            </h1>
          </div>
        </section>

        {/* ============================================
            PHILOSOPHY: WHO WE ARE
           ============================================ */}
        <section className="fade-section max-w-4xl mx-auto text-center py-24">
          <span className="animate-text font-mono text-[10px] tracking-[0.6em] text-[#4a0404] uppercase block mb-8">
            The Philosophy
          </span>
          <p className="animate-text font-serif text-3xl md:text-5xl leading-tight text-balance">
            We are not just a digital agency. We are a <span className="italic text-[#4a0404]">dual-force</span> collective. 
            Merging the precision of high-level code with the psychology of modern branding.
          </p>
        </section>

        <StylishDivider />

        {/* ============================================
            THE TEAM: JOSHUA & EPHRAHIM
           ============================================ */}
        <section className="fade-section py-24">
          <div className="flex flex-col gap-32">
            
            {/* TEAM MEMBER 01: JOSHUA */}
            <div className="flex flex-col md:flex-row items-start justify-between group">
              <div className="w-full md:w-1/3 mb-8 md:mb-0">
                 <span className="animate-text font-mono text-[10px] tracking-[0.4em] uppercase block opacity-40 mb-2">01 / The Vision</span>
                 <h2 className="animate-text font-serif text-6xl md:text-7xl leading-none mb-2">Joshua <br/> Jeremy</h2>
                 <p className="animate-text font-mono text-xs text-[#4a0404] tracking-widest uppercase mt-4">Branding & Marketing Manager</p>
              </div>
              <div className="w-full md:w-1/2 relative">
                 <div className="animate-text absolute -left-8 -top-8 text-9xl font-serif text-[#0a0a0a]/5 select-none">“</div>
                 <p className="animate-text font-serif text-2xl md:text-3xl italic leading-relaxed pl-8 border-l border-[#4a0404]">
                   "A brand is not just a logo—it is the silence between the noise. My job is to make the world stop and listen to your story."
                 </p>
              </div>
            </div>

            <StylishDivider />

            {/* TEAM MEMBER 02: EPHRAHIM */}
            <div className="flex flex-col md:flex-row-reverse items-start justify-between group">
              <div className="w-full md:w-1/3 mb-8 md:mb-0 text-right">
                 <span className="animate-text font-mono text-[10px] tracking-[0.4em] uppercase block opacity-40 mb-2">02 / The Engine</span>
                 <h2 className="animate-text font-serif text-6xl md:text-7xl leading-none mb-2">Ephrahim <br/> Laanyu</h2>
                 <p className="animate-text font-mono text-xs text-[#4a0404] tracking-widest uppercase mt-4">Lead Developer & Programmer</p>
              </div>
              <div className="w-full md:w-1/2 relative text-right">
                 <div className="animate-text absolute -right-8 -top-8 text-9xl font-serif text-[#0a0a0a]/5 select-none">”</div>
                 <p className="animate-text font-serif text-2xl md:text-3xl italic leading-relaxed pr-8 border-r border-[#4a0404]">
                   "Code is the invisible architecture of the modern world. I don't just write functions; I engineer digital stability."
                 </p>
              </div>
            </div>

          </div>
        </section>

        <StylishDivider />

        {/* ============================================
            CAPABILITIES: WHAT WE DO
           ============================================ */}
        <section className="fade-section py-24">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3">
              <h3 className="animate-text font-serif text-5xl italic text-[#4a0404] mb-6">Our Craft.</h3>
              <p className="animate-text font-mono text-[10px] tracking-widest opacity-60 max-w-xs leading-relaxed">
                WE ELIMINATE THE UNNECESSARY SO THE NECESSARY MAY SPEAK.
              </p>
            </div>
            
            <div className="w-full md:w-2/3 grid grid-cols-1 gap-12">
              {[
                { title: "Brand Strategy", desc: "Positioning / Voice / Visual Identity" },
                { title: "Web Architecture", desc: "React / GSAP / Next.js / Performance" },
                { title: "Market Intelligence", desc: "Campaigns / Analytics / Growth" }
              ].map((item, i) => (
                <div key={i} className="animate-text group border-b border-[#0a0a0a]/10 pb-8 hover:border-[#4a0404] transition-colors duration-500">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-serif text-4xl group-hover:pl-4 transition-all duration-500">{item.title}</h4>
                    <span className="font-mono text-[10px] tracking-[0.2em] opacity-40 group-hover:text-[#4a0404] transition-colors">0{i+1}</span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest opacity-40 mt-2 pl-1 group-hover:pl-5 transition-all duration-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER SIGNATURE */}
      <footer className="text-center pb-12 opacity-30">
        <p className="font-serif italic text-2xl">J&E Maison</p>
      </footer>
    </div>
  );
};

export default AboutDetailed;