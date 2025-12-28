import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { createClient } from '@supabase/supabase-js';
import Navbar from './Navbar';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Helper for the character scramble effect on labels
const ScrambleText = ({ text, active }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    if (!active) {
      setDisplayText(text);
      return;
    }
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((letter, index) => {
        if (index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [active, text]);

  return <span>{displayText}</span>;
};

const Contact = () => {
  // Updated state names for clarity
  const [formType, setFormType] = useState('inquiry'); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [currency, setCurrency] = useState('USD');
  
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const submitBtnRef = useRef(null);
  const audioRef = useRef(new Audio('https://www.soundjay.com/buttons/sounds/button-20.mp3'));

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".split-pane", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: "power4.out" });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const triggerSuccessSequence = () => {
    const tl = gsap.timeline();
    audioRef.current.play();

    tl.to(".form-input-line", { width: "100%", backgroundColor: "#4a0404", duration: 0.5 })
      .to(".form-field", { opacity: 0, y: -20, stagger: 0.05, duration: 0.4 })
      .to(formRef.current, { 
        clipPath: "circle(0% at 50% 50%)", 
        duration: 0.8, 
        ease: "expo.inOut" 
      })
      .set(formRef.current, { display: 'none' })
      .to(successRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setLoading(false);
    gsap.set(successRef.current, { opacity: 0, y: 20 });
    gsap.set(formRef.current, { display: 'flex', clipPath: "circle(100% at 50% 50%)" });
    gsap.fromTo(".form-field", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, delay: 0.2 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (formType === 'service') {
        data.budget_bracket = `${currency} ${data.budget_bracket}`;
    }

    try {
      let error;
      if (formType === 'inquiry') {
        ({ error } = await supabase.from('general_inquiries').insert([data]));
      } else {
        ({ error } = await supabase.from('service_requests').insert([data]));
        await fetch('/api/send-brief-email', { method: 'POST', body: JSON.stringify(data) });
      }
      if (error) throw error;
      setIsSubmitted(true);
      triggerSuccessSequence();
    } catch (err) {
      console.error("Transmission Error:", err.message);
      setLoading(false);
    }
  };

  const handleMagnetic = (e) => {
    const rect = submitBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(submitBtnRef.current, { x: x * 0.3, y: y * 0.3, duration: 0.6 });
  };

  return (
    <div ref={containerRef} className="h-screen w-screen bg-[#EAE8E4] text-[#1a1a1a] font-sans selection:bg-[#4a0404] selection:text-white overflow-hidden relative">
      <Navbar />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <main className="h-full w-full flex flex-col pt-24 px-12 pb-12">
        
        {/* Updated Toggle Labels */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[#1a1a1a]/5 p-1 rounded-full relative overflow-hidden">
            <div className={`absolute h-[calc(100%-8px)] top-1 bg-white rounded-full transition-all duration-500 ease-[expo.out] shadow-sm`}
                 style={{ width: 'calc(50% - 4px)', left: formType === 'inquiry' ? '4px' : '50%' }} />
            <button onClick={() => setFormType('inquiry')} className="relative z-10 px-8 py-2 font-mono text-[9px] tracking-widest uppercase">01. General Inquiry</button>
            <button onClick={() => setFormType('service')} className="relative z-10 px-8 py-2 font-mono text-[9px] tracking-widest uppercase">02. Request Service</button>
          </div>
        </div>

        <div className="flex-1 flex gap-24">
          
          <div className="split-pane hidden md:flex flex-col justify-between w-1/3 py-8 border-r border-[#1a1a1a]/10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#4a0404] block mb-4">Fig 4.0 // Transmission</span>
              <h2 className="font-serif text-6xl leading-[0.9]">Atelier <br /><span className="italic">Portal</span></h2>
            </div>
            <div className="space-y-4 font-mono text-[9px] uppercase tracking-widest opacity-40">
              <p>ENC_TYPE: AES-256</p>
              <p>LOC: 1.2921° S, 36.8219° E</p>
              <p>STATUS: {isSubmitted ? "SENT" : "READY_FOR_INPUT"}</p>
            </div>
          </div>

          <div className="flex-1 relative flex flex-col justify-center">
            <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6" style={{ clipPath: "circle(100% at 50% 50%)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {formType === 'inquiry' ? (
                    <>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Subject Name" active={focusedField === 'name'} />
                        </label>
                        <input name="full_name" required onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Email Alias" active={focusedField === 'email'} />
                        </label>
                        <input name="email" type="email" required onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                      <div className="form-field md:col-span-2 group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Message Transmission" active={focusedField === 'msg'} />
                        </label>
                        <textarea name="message" rows="2" required onFocus={() => setFocusedField('msg')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none resize-none" />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Client Name" active={focusedField === 'cname'} />
                        </label>
                        <input name="client_name" required onFocus={() => setFocusedField('cname')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Email" active={focusedField === 'email'} />
                        </label>
                        <input name="email" type="email" required onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Service Vision" active={focusedField === 'stype'} />
                        </label>
                        <input name="service_type" required onFocus={() => setFocusedField('stype')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" placeholder="Web Architecture..." />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40">
                            <ScrambleText text="Budget Bracket" active={focusedField === 'budget'} />
                          </label>
                          <div className="flex gap-2 font-mono text-[7px] tracking-widest">
                            <button type="button" onClick={() => setCurrency('USD')} className={`${currency === 'USD' ? 'text-[#4a0404]' : 'opacity-30'}`}>USD</button>
                            <span className="opacity-10">/</span>
                            <button type="button" onClick={() => setCurrency('KSH')} className={`${currency === 'KSH' ? 'text-[#4a0404]' : 'opacity-30'}`}>KSH</button>
                          </div>
                        </div>
                        <input name="budget_bracket" required onFocus={() => setFocusedField('budget')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" placeholder={currency === 'USD' ? '$10k+' : '1M+'} />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Timeline" active={focusedField === 'timeline'} />
                        </label>
                        <input name="timeline" onFocus={() => setFocusedField('timeline')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" placeholder="e.g. 3 Months" />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Aesthetic Vibe" active={focusedField === 'vibe'} />
                        </label>
                        <input name="aesthetic_vibe" onFocus={() => setFocusedField('vibe')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" placeholder="Minimal / Cinematic" />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                      <div className="form-field group relative border-b border-[#1a1a1a]/10 pb-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest block opacity-40 mb-1">
                          <ScrambleText text="Project Goal" active={focusedField === 'goal'} />
                        </label>
                        <input name="project_goal" required onFocus={() => setFocusedField('goal')} onBlur={() => setFocusedField(null)} 
                               className="bg-transparent w-full font-serif text-lg focus:outline-none" />
                        <div className="form-input-line absolute bottom-0 left-0 h-[1px] w-0 bg-[#4a0404] transition-all group-focus-within:w-full" />
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 flex justify-center">
                  <button 
                    ref={submitBtnRef}
                    onMouseMove={handleMagnetic}
                    onMouseLeave={() => gsap.to(submitBtnRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out" })}
                    disabled={loading}
                    className="w-32 h-32 rounded-full border border-[#1a1a1a]/20 flex items-center justify-center group relative overflow-hidden transition-colors"
                  >
                    <div className="absolute inset-0 bg-[#4a0404] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[expo.out]" />
                    <span className="relative z-10 font-mono text-[9px] tracking-[0.3em] uppercase group-hover:text-white transition-colors">
                      {loading ? "..." : "Send"}
                    </span>
                  </button>
                </div>
            </form>

            <div ref={successRef} className="opacity-0 translate-y-4 absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#4a0404] mb-2 font-bold">Message Sent</span>
                <button 
                  onClick={resetForm} 
                  className="pointer-events-auto font-mono text-[8px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity border-b border-current"
                >
                  Send Another
                </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 left-12 right-12 flex justify-between font-mono text-[8px] opacity-20 uppercase tracking-widest">
        <span>M—S System Architecture</span>
        <span>©2025 J&E Maison</span>
      </footer>
    </div>
  );
};

export default Contact;