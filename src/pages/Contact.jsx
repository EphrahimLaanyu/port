import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { createClient } from '@supabase/supabase-js';
import Navbar from './Navbar';

// --- 1. SAFE SUPABASE INIT ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const Contact = () => {
  // STATES
  const [viewState, setViewState] = useState('selection'); // 'selection', 'form', 'success'
  const [formType, setFormType] = useState(null); // 'general' or 'service'
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef(null);

  // --- ANIMATION: ENTRY ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate in the active view
      gsap.fromTo(".animate-entry", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [viewState]);

  // --- HANDLERS ---
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!supabase) {
        console.warn("Supabase keys missing.");
        setViewState('success');
        return;
    }

    setLoading(true);
    try {
      const table = formType === 'general' ? 'general_inquiries' : 'service_requests';
      const { error } = await supabase.from(table).insert([formData]);
      if (error) throw error;
      setViewState('success');
    } catch (err) {
      console.error(err);
      alert("Error submitting. Check console.");
    } finally {
        setLoading(false);
    }
  };

  const switchView = (type) => {
    // Fade out old view
    gsap.to(containerRef.current, {
        opacity: 0, 
        duration: 0.5, 
        onComplete: () => {
            setFormType(type);
            setViewState('form');
            setFormData({}); // Reset data
            // Fade in new view
            gsap.to(containerRef.current, { opacity: 1, duration: 0.5 });
        }
    });
  };

  // --- RENDER: SUCCESS ---
  if (viewState === 'success') {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] text-[#EAE8E4] flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="font-serif text-[10vw] italic leading-none text-[#4a0404] mb-8 animate-pulse">Received.</h1>
        <p className="font-mono text-sm tracking-[0.4em] uppercase opacity-60">The Maison has your brief.</p>
        <button onClick={() => window.location.reload()} className="mt-12 border-b border-white/30 pb-1 hover:text-[#4a0404] hover:border-[#4a0404] transition-colors font-mono text-xs uppercase tracking-widest">
            Return
        </button>
      </div>
    );
  }

  // --- RENDER: SELECTION (The Fork) ---
  if (viewState === 'selection') {
    return (
      <div ref={containerRef} className="h-screen w-screen bg-[#EAE8E4] text-[#0a0a0a] flex flex-col relative overflow-hidden">
        <Navbar />
        <div className="fixed inset-0 pointer-events-none opacity-[0.06] mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/noise-lines.png")` }}></div>
        
        <div className="flex-1 flex flex-col justify-center items-center gap-12 z-10">
            <div className="animate-entry text-center mb-12">
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#4a0404] mb-4 font-bold">Initialize Protocol</p>
                <h1 className="font-serif text-5xl md:text-6xl italic">Select Your Path</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-24">
                <button onClick={() => switchView('general')} className="animate-entry group text-center">
                    <div className="text-4xl md:text-5xl font-serif mb-4 group-hover:text-[#4a0404] transition-colors duration-500">Just Saying Hello</div>
                    <div className="h-[1px] w-0 bg-[#4a0404] mx-auto group-hover:w-full transition-all duration-500"></div>
                    <span className="block mt-4 font-mono text-[9px] tracking-widest opacity-40 group-hover:opacity-100">01. General Inquiry</span>
                </button>
                <div className="w-[1px] h-12 bg-[#0a0a0a]/10 hidden md:block animate-entry"></div>
                <button onClick={() => switchView('service')} className="animate-entry group text-center">
                    <div className="text-4xl md:text-5xl font-serif mb-4 group-hover:text-[#4a0404] transition-colors duration-500">Start a Project</div>
                    <div className="h-[1px] w-0 bg-[#4a0404] mx-auto group-hover:w-full transition-all duration-500"></div>
                    <span className="block mt-4 font-mono text-[9px] tracking-widest opacity-40 group-hover:opacity-100">02. Commission Work</span>
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: THE NARRATIVE FORM (Mad-Libs) ---
  return (
    <div ref={containerRef} className="min-h-screen w-screen bg-[#EAE8E4] text-[#0a0a0a] relative overflow-x-hidden">
      <Navbar />
      
      {/* TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.06] mix-blend-multiply" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/noise-lines.png")` }}></div>

      <div className="relative z-10 pt-32 pb-24 px-6 md:px-12 lg:px-24 min-h-screen flex flex-col justify-center">
        
        {/* HEADER */}
        <div className="animate-entry mb-16 border-b border-[#0a0a0a]/10 pb-6 flex justify-between items-end">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#4a0404]">
                {formType === 'general' ? '01 // General Inquiry' : '02 // Service Brief'}
            </span>
            <button onClick={() => setViewState('selection')} className="font-mono text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                ( Switch Path )
            </button>
        </div>

        {/* THE NARRATIVE FORM */}
        <form onSubmit={submitForm} className="animate-entry max-w-6xl mx-auto leading-relaxed md:leading-[1.6]">
            
            {formType === 'general' ? (
                // --- GENERAL TEMPLATE ---
                <p className="font-serif text-3xl md:text-[3.5vw] text-[#0a0a0a]">
                    Hello, my name is
                    <input 
                        name="full_name" required placeholder="your full name" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[300px] text-center"
                    />.
                    You can reach me at
                    <input 
                        name="email" type="email" required placeholder="email address" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[350px] text-center"
                    />.
                    I am writing to you today regarding
                    <input 
                        name="subject" placeholder="subject matter" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[400px] text-center"
                    />.
                    <br /><br />
                    <span className="block opacity-40 text-lg md:text-xl font-mono uppercase tracking-widest mb-2">Message:</span>
                    <textarea 
                        name="message" required placeholder="Type your full message here..." onChange={handleInput} rows={3}
                        className="w-full bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 resize-none"
                    />
                </p>
            ) : (
                // --- SERVICE TEMPLATE ---
                <p className="font-serif text-3xl md:text-[3.5vw] text-[#0a0a0a]">
                    Hello, I represent
                    <input 
                        name="client_name" required placeholder="Company / Client Name" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[350px] text-center"
                    />. 
                    Our website is 
                    <input 
                        name="company_url" placeholder="https:// (optional)" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[300px] text-center"
                    />.
                    <br /><br />
                    We are looking to commission a
                    <input 
                        name="service_type" required placeholder="e.g. Web Architecture" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[400px] text-center"
                    /> 
                    project. Ideally, the final result should feel
                    <input 
                        name="aesthetic_vibe" placeholder="e.g. Minimal & Cinematic" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[400px] text-center"
                    />.
                    <br /><br />
                    Our estimated budget for this undertaking is
                    <select 
                        name="budget_bracket" onChange={handleInput} className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] cursor-pointer appearance-none text-center w-[300px]"
                    >
                        <option value="" disabled selected>Select Range</option>
                        <option value="$10k - $25k">$10k — $25k</option>
                        <option value="$25k - $50k">$25k — $50k</option>
                        <option value="$50k - $100k">$50k — $100k</option>
                        <option value="$100k+">$100k+</option>
                    </select>
                    and we are hoping to launch within
                    <input 
                        name="timeline" placeholder="e.g. 3 months" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[250px] text-center"
                    />.
                    <br /><br />
                    You can reach me at
                    <input 
                        name="email" type="email" required placeholder="your email address" onChange={handleInput}
                        className="mx-2 md:mx-4 bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 w-[350px] text-center"
                    /> 
                    to discuss the details.
                    <br /><br />
                    <span className="block opacity-40 text-lg md:text-xl font-mono uppercase tracking-widest mb-2">Additional Context / Goals:</span>
                    <textarea 
                        name="project_goal" required placeholder="Describe the mission..." onChange={handleInput} rows={2}
                        className="w-full bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#4a0404] outline-none text-[#4a0404] placeholder:text-[#0a0a0a]/20 resize-none"
                    />
                </p>
            )}

            {/* SUBMIT STAMP */}
            <div className="mt-24 flex justify-center">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="group relative w-64 h-64 border border-[#0a0a0a]/10 rounded-full flex items-center justify-center overflow-hidden hover:border-[#4a0404] transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-[#4a0404] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[expo.out]"></div>
                    <div className="relative z-10 text-center group-hover:text-white transition-colors duration-500">
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-2">{loading ? "Signing..." : "Authorize"}</span>
                        <span className="font-serif text-3xl italic block">Send Brief</span>
                    </div>
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default Contact;