import React from 'react';

// Reusing simple components for consistency
const GlassCard = ({ children, className }) => (
  <div className={`backdrop-blur-sm bg-white/40 border border-white/50 shadow-sm rounded-md ${className}`}>
    {children}
  </div>
);

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

export default About;