import React from 'react';

const About = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden bg-[#EAE8E4] border-l border-[#1a1a1a]/10">
      
      <div className="relative z-10 max-w-7xl w-full px-12 flex flex-col md:flex-row items-center gap-20">
        
        {/* TEXT SIDE */}
        <div className="flex-1 relative">
            
            {/* Top Border for "Chapter" feel */}
            <div className="w-full border-t border-[#1a1a1a] opacity-30 mb-2"></div>
            <div className="w-full border-t border-[#1a1a1a] opacity-80 mb-8"></div>

            <h1 className="font-serif text-[10vw] leading-[0.9] tracking-tighter text-[#1a1a1a]">
                ELEVATED
            </h1>

            {/* Bottom Border */}
            <div className="w-full border-b border-[#1a1a1a] opacity-80 mt-2"></div>
            <div className="w-full border-b border-[#1a1a1a] opacity-30 mt-1 mb-12"></div>

            <div className="ml-[2vw] pl-8 border-l border-[#4a0404]">
                <h3 className="font-mono text-xs text-[#4a0404] tracking-[0.3em] uppercase mb-4">Methodology</h3>
                <p className="font-serif text-2xl italic leading-relaxed opacity-80 max-w-lg">
                    "We orchestrate digital physics. J&E Maison represents the intersection of structural engineering and high-fashion aesthetics."
                </p>
            </div>
        </div>

        {/* IMAGE SIDE */}
        <div className="flex-1 flex justify-center items-center">
            {/* Frame inside a frame */}
            <div className="relative p-6 border border-[#1a1a1a]/10">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#1a1a1a]"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#1a1a1a]"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#1a1a1a]"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#1a1a1a]"></div>

                <div className="h-[40vh] aspect-[3/4] bg-[#1a1a1a]/5 relative flex items-center justify-center overflow-hidden">
                     <div className="w-full h-[1px] bg-[#4a0404] absolute top-1/2 left-0 opacity-20"></div>
                     <div className="h-full w-[1px] bg-[#4a0404] absolute top-0 left-1/2 opacity-20"></div>
                     <div className="w-32 h-32 rounded-full border border-[#4a0404] opacity-50"></div>
                </div>
                <p className="mt-4 text-center font-mono text-[10px] tracking-widest opacity-50">PLATE NO. 1</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;