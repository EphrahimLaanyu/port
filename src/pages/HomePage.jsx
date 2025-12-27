import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import WorkPreview from './WorkPreview';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const scrollContainer = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".panel");
      
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainer.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          // We set the end value to create a smooth scroll distance
          end: () => "+=" + (scrollContainer.current.offsetWidth)
        }
      });
    }, scrollContainer);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#EAE8E4]">
      
      {/* NAVBAR: Placed outside the flex container 
          so it stays fixed at the top of the viewport.
      */}
      <Navbar />

      <div ref={scrollContainer}>
        {/* HORIZONTAL WRAPPER: 
            The width must be 100vw * Number of Sections (300vw).
        */}
        <div className="flex w-[300vw] h-screen overflow-hidden">
          
          {/* SECTION 1: HERO */}
          <section className="panel w-screen h-screen flex-shrink-0 relative">
            <Hero />
          </section>

          {/* SECTION 2: ABOUT */}
          <section className="panel w-screen h-screen flex-shrink-0 relative">
            <About />
          </section>

          {/* SECTION 3: WORK PREVIEW */}
          <section className="panel w-screen h-screen flex-shrink-0 relative">
            <WorkPreview />
          </section>

        </div>
      </div>
      
    </div>
  );
};

export default HomePage;