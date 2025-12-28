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

// --- DATA CONFIG ---
const GENERAL_QUESTIONS = [
  { id: 'g1', label: "01. IDENTITY", question: "What is your name?", field: "full_name", type: "text", placeholder: "Enter your name..." },
  { id: 'g2', label: "02. CONTACT", question: "Your email address?", field: "email", type: "email", placeholder: "email@domain.com" },
  { id: 'g3', label: "03. CONTEXT", question: "What is the subject?", field: "subject", type: "text", placeholder: "Brief topic..." },
  { id: 'g4', label: "04. TRANSMISSION", question: "What is your message?", field: "message", type: "textarea", placeholder: "Type your message..." }
];

const SERVICE_QUESTIONS = [
  { id: 's1', label: "01. THE CLIENT", question: "Who are we working with?", field: "client_name", type: "text", placeholder: "Your name or company..." },
  { id: 's2', label: "02. THE FREQUENCY", question: "Best email to reach you?", field: "email", type: "email", placeholder: "email@domain.com" },
  { id: 's3', label: "03. THE DIGITAL REAL ESTATE", question: "Company Website (Optional)", field: "company_url", type: "text", placeholder: "https://..." },
  { id: 's4', label: "04. THE BLUEPRINT", question: "What are we building?", field: "service_type", type: "text", placeholder: "e.g. Web Architecture, Branding..." },
  { id: 's5', label: "05. THE INVESTMENT", question: "Estimated Budget", field: "budget_bracket", type: "budget_slider" }, 
  { id: 's6', label: "06. THE TIMELINE", question: "Expected Launch Date", field: "timeline", type: "text", placeholder: "e.g. 3 Months / ASAP" },
  { id: 's7', label: "07. THE AESTHETIC", question: "Desired Vibe", field: "aesthetic_vibe", type: "text", placeholder: "Minimal, Brutalist, Cinematic..." },
  { id: 's8', label: "08. THE MISSION", question: "Project Goal", field: "project_goal", type: "textarea", placeholder: "What defines success?" }
];

const Contact = () => {
  // --- STATE MANAGEMENT ---
  const [viewState, setViewState] = useState('selection'); // 'selection' | 'form' | 'success'
  
  // Initialize with GENERAL questions by default to prevent "0 width" errors
  const [questions, setQuestions] = useState(GENERAL_QUESTIONS); 
  const [formType, setFormType] = useState('general');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Budget Logic
  const [budgetVal, setBudgetVal] = useState(10000);
  const [budgetSkipped, setBudgetSkipped] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const inputRefs = useRef([]);

  // --- ANIMATION: SELECTION ENTRY ---
  useLayoutEffect(() => {
    if (viewState === 'selection') {
      const ctx = gsap.context(() => {
        gsap.from(".selection-anim", {
          y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", delay: 0.2
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [viewState]);

  // --- ANIMATION: FORM SLIDES & ENTRY ---
  useLayoutEffect(() => {
    if (viewState === 'form' && trackRef.current) {
      const ctx = gsap.context(() => {
        
        // 1. Initial Entry Fade-In (Fixes the "Disappearing" bug)
        gsap.fromTo(containerRef.current, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.5 }
        );

        // 2. Slide the Track
        gsap.to(trackRef.current, {
          x: `-${currentStep * 100}vw`,
          duration: 1.2,
          ease: "power4.inOut"
        });

        // 3. Reveal Elements in Active Slide
        const activeSlide = trackRef.current.children[currentStep];
        if (activeSlide) {
            const textElements = activeSlide.querySelectorAll(".animate-reveal");
            gsap.fromTo(textElements, 
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.4, ease: "power3.out" }
            );
        }

        // 4. Progress Bar
        if (progressRef.current) {
            gsap.to(progressRef.current, {
                width: `${((currentStep + 1) / questions.length) * 100}%`,
                duration: 1,
                ease: "expo.out"
            });
        }
      }, containerRef); // Scope to container
      return () => ctx.revert();
    }
  }, [viewState, currentStep, questions]);

  // --- LOGIC: SWITCHING MODES ---
  const handlePathSelect = (type) => {
    // 1. Update Data Synchronously
    const newQuestions = type === 'general' ? GENERAL_QUESTIONS : SERVICE_QUESTIONS;
    setFormType(type);
    setQuestions(newQuestions);
    setCurrentStep(0);
    
    // 2. Switch View Immediately (Let the useEffect handle the fade-in)
    setViewState('form');
  };

  const handleBackToSelection = () => {
      setViewState('selection');
      setCurrentStep(0);
      setFormData({});
  };

  // --- LOGIC: FORM NAVIGATION ---
  const handleNext = () => {
    const q = questions[currentStep];
    const val = formData[q.field];
    const isBudgetStep = q.type === 'budget_slider';
    
    // Simple Validation
    if (!val && !isBudgetStep) {
       const activeInput = inputRefs.current[currentStep];
       if(activeInput) gsap.to(activeInput, { x: [-10, 10, -10, 10, 0], duration: 0.4 });
       return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleBudgetChange = (e) => {
    setBudgetSkipped(false);
    const val = parseInt(e.target.value);
    setBudgetVal(val);
    setFormData({ ...formData, budget_bracket: `$${val.toLocaleString()}` });
  };

  const handleBudgetSkip = () => {
    setBudgetSkipped(true);
    setFormData({ ...formData, budget_bracket: "Undecided / TBD" });
    handleNext();
  };

  const submitForm = async () => {
    if (!supabase) {
        console.warn("Supabase not configured. Showing success state for demo.");
        setViewState('success');
        return;
    }
    setLoading(true);
    try {
      let finalData = { ...formData };
      if (formType === 'service' && !finalData.budget_bracket) {
         finalData.budget_bracket = budgetSkipped ? "Undecided" : `$${budgetVal.toLocaleString()}`;
      }
      
      const table = formType === 'general' ? 'general_inquiries' : 'service_requests';
      const { error } = await supabase.from(table).insert([finalData]);
      
      if (error) throw error;
      setViewState('success');
    } catch (err) {
      console.error(err);
      alert("Error submitting. Check console.");
    } finally {
        setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  // ==========================================
  // VIEW: SUCCESS
  // ==========================================
  if (viewState === 'success') {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] text-[#EAE8E4] flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center px-6">
            <h1 className="font-serif text-[12vw] md:text-[8vw] italic leading-none text-[#4a0404] mb-8 animate-pulse">Received.</h1>
            <p className="font-mono text-xs tracking-[0.4em] uppercase opacity-60 mb-12">Signal Locked. We will respond shortly.</p>
            <button onClick={() => window.location.reload()} className="font-mono text-xs uppercase border-b border-white/40 pb-2 hover:text-[#4a0404] hover:border-[#4a0404] transition-all">
                Return to Surface
            </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: SELECTION MENU
  // ==========================================
  if (viewState === 'selection') {
    return (
      <div ref={containerRef} className="h-screen w-screen bg-[#EAE8E4] text-[#0a0a0a] flex flex-col relative overflow-hidden">
        <Navbar />
        
        {/* TEXTURE */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.06] mix-blend-multiply" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/noise-lines.png")` }}></div>

        {/* HEADER */}
        <div className="relative z-10 pt-32 pb-8 text-center selection-anim">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#4a0404] mb-2 font-bold">Initialize Transmission</p>
            <h1 className="font-serif text-3xl md:text-4xl italic">Select your path</h1>
        </div>

        {/* CARDS CONTAINER */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center relative z-10 px-6 md:px-12 gap-6 w-full max-w-7xl mx-auto pb-20">
            
            {/* CARD 1: GENERAL */}
            <button 
                onClick={() => handlePathSelect('general')}
                className="selection-anim group w-full md:w-1/2 h-full max-h-[50vh] border border-[#0a0a0a]/10 hover:border-[#4a0404] bg-[#0a0a0a]/[0.02] hover:bg-white transition-all duration-500 ease-out flex flex-col items-center justify-center relative rounded-sm p-8"
            >
                <div className="w-16 h-16 rounded-full border border-[#0a0a0a]/20 group-hover:bg-[#4a0404] group-hover:border-[#4a0404] transition-all duration-500 mb-8 flex items-center justify-center">
                   <span className="font-serif text-2xl group-hover:text-white transition-colors duration-500 italic">i</span>
                </div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]/40 group-hover:text-[#4a0404] transition-all mb-4">01. Interaction</span>
                <h2 className="font-serif text-4xl md:text-5xl leading-none mb-2">Just Saying <br /> Hello</h2>
                <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#4a0404]">Start Inquiry &rarr;</span>
                </div>
            </button>

            {/* CARD 2: SERVICE */}
            <button 
                onClick={() => handlePathSelect('service')}
                className="selection-anim group w-full md:w-1/2 h-full max-h-[50vh] border border-[#0a0a0a]/10 hover:border-[#4a0404] bg-[#0a0a0a]/[0.02] hover:bg-white transition-all duration-500 ease-out flex flex-col items-center justify-center relative rounded-sm p-8"
            >
                <div className="w-16 h-16 rounded-full border border-[#0a0a0a]/20 group-hover:bg-[#4a0404] group-hover:border-[#4a0404] transition-all duration-500 mb-8 flex items-center justify-center">
                   <span className="font-serif text-2xl group-hover:text-white transition-colors duration-500 italic">+</span>
                </div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]/40 group-hover:text-[#4a0404] transition-all mb-4">02. Commission</span>
                <h2 className="font-serif text-4xl md:text-5xl leading-none mb-2">Start a <br /> Project</h2>
                 <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#4a0404]">Begin Brief &rarr;</span>
                </div>
            </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: FORM SLIDER
  // ==========================================
  return (
    <div ref={containerRef} className="h-screen w-screen bg-[#EAE8E4] text-[#0a0a0a] overflow-hidden relative selection:bg-[#4a0404] selection:text-white">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.06] mix-blend-multiply" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/noise-lines.png")` }}></div>

      {/* PROGRESS */}
      <div className="fixed bottom-0 left-0 w-full h-3 bg-[#0a0a0a]/5 z-50">
        <div ref={progressRef} className="h-full bg-[#4a0404] w-0" />
      </div>

      {/* COUNTER */}
      <div className="fixed top-24 right-6 md:right-12 z-40 font-mono text-[10px] tracking-[0.4em] uppercase">
        {currentStep + 1} / {questions.length}
      </div>

      {/* TRACK */}
      <div ref={trackRef} className="h-full flex will-change-transform" style={{ width: `${questions.length * 100}vw` }}>
        
        {questions.map((q, index) => (
          <div key={q.id} className="w-[100vw] h-full flex flex-col justify-center px-6 md:px-32 lg:px-64 relative">
            
            <div className="animate-reveal mb-8">
               <span className="font-mono text-[12px] tracking-[0.4em] text-[#4a0404] uppercase block font-bold">
                 {q.label}
               </span>
            </div>

            <div className="animate-reveal mb-12">
               <h2 className="font-serif text-4xl md:text-7xl lg:text-8xl leading-[1.1]">
                 {q.question}
               </h2>
            </div>

            <div className="animate-reveal w-full relative max-w-4xl">
              <div ref={el => inputRefs.current[index] = el}>
                
                {q.type === 'budget_slider' ? (
                   // CUSTOM BUDGET COMPONENT
                   <div className="w-full py-8 md:py-12">
                      <div className="flex items-baseline mb-12">
                         <span className="font-serif text-5xl md:text-8xl text-[#4a0404]">
                            {budgetSkipped ? "Undefined" : `$${budgetVal.toLocaleString()}`}
                         </span>
                         {!budgetSkipped && <span className="font-serif text-2xl opacity-40 ml-4">+</span>}
                      </div>
                      
                      <input 
                        type="range" 
                        min="5000" 
                        max="100000" 
                        step="1000"
                        value={budgetVal}
                        onChange={handleBudgetChange}
                        className="w-full h-1 bg-[#0a0a0a]/10 appearance-none rounded-full outline-none cursor-pointer slider-thumb-custom"
                        style={{
                            backgroundImage: `linear-gradient(to right, #4a0404 0%, #4a0404 ${(budgetVal-5000)/950}%, transparent ${(budgetVal-5000)/950}%)`
                        }}
                      />
                      <style>{`
                        .slider-thumb-custom::-webkit-slider-thumb {
                            -webkit-appearance: none; appearance: none;
                            width: 30px; height: 30px; border-radius: 50%;
                            background: #0a0a0a; cursor: pointer; border: 2px solid #EAE8E4; transition: transform 0.2s;
                        }
                        .slider-thumb-custom::-webkit-slider-thumb:hover { transform: scale(1.2); }
                      `}</style>
                      <button onClick={handleBudgetSkip} className="mt-12 px-6 py-3 border border-[#0a0a0a]/20 hover:border-[#4a0404] rounded-full font-mono text-xs uppercase tracking-widest transition-all">
                         I don't know yet (Skip)
                      </button>
                   </div>

                ) : q.type === 'textarea' ? (
                  <textarea
                    autoFocus={currentStep === index}
                    value={formData[q.field] || ''}
                    onChange={(e) => setFormData({...formData, [q.field]: e.target.value})}
                    onKeyDown={handleKeyPress}
                    placeholder={q.placeholder}
                    rows={1}
                    className="w-full bg-transparent border-b-2 border-[#0a0a0a]/20 py-4 font-serif text-2xl md:text-5xl text-[#4a0404] placeholder:text-[#0a0a0a]/20 focus:outline-none focus:border-[#4a0404] transition-colors resize-none"
                  />
                ) : (
                  <input
                    autoFocus={currentStep === index}
                    type={q.type}
                    value={formData[q.field] || ''}
                    onChange={(e) => setFormData({...formData, [q.field]: e.target.value})}
                    onKeyDown={handleKeyPress}
                    placeholder={q.placeholder}
                    className="w-full bg-transparent border-b-2 border-[#0a0a0a]/20 py-4 font-serif text-2xl md:text-5xl text-[#4a0404] placeholder:text-[#0a0a0a]/20 focus:outline-none focus:border-[#4a0404] transition-colors"
                  />
                )}
              </div>
            </div>

            {/* BUTTONS ON LAST SLIDE */}
            {index === questions.length - 1 && (
               <button 
                 onClick={submitForm}
                 disabled={loading}
                 className="animate-reveal absolute bottom-24 right-6 md:right-32 w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center hover:scale-110 transition-transform duration-500 ease-[expo.out]"
               >
                 <span className="font-mono text-[9px] md:text-xs tracking-[0.3em] uppercase">
                   {loading ? "..." : "Send"}
                 </span>
               </button>
            )}

          </div>
        ))}
      </div>

      {/* FOOTER NAV */}
      <div className="absolute bottom-12 right-6 md:right-12 flex gap-8 z-50">
           <button onClick={handleBackToSelection} className="font-mono text-xs tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity">
             Change Path
           </button>

           <button 
             onClick={handlePrev} 
             className={`font-mono text-xs tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity ${currentStep === 0 ? 'invisible' : ''}`}
           >
             Go Back
           </button>

           {currentStep < questions.length - 1 && (
             <button onClick={handleNext} className="group flex items-center gap-4">
               <span className="font-mono text-xs tracking-[0.3em] uppercase group-hover:text-[#4a0404] transition-colors">Next</span>
               <div className="w-10 h-10 rounded-full border border-[#0a0a0a]/20 flex items-center justify-center group-hover:bg-[#4a0404] group-hover:border-[#4a0404] transition-all duration-300">
                  <span className="text-lg group-hover:text-white transition-colors">&rarr;</span>
               </div>
             </button>
           )}
      </div>

    </div>
  );
};

export default Contact;