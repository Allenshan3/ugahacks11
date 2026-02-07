"use client";

import React from "react";
import Nav from "../components/Nav";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <>
      <Nav />
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-purple-900 text-white pt-20">
      
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwcHVycGxlJTIwbmlnaHQlMjBza3klMjBzdGFycyUyMGNhcnRvb258ZW58MXx8fHwxNzcwNDg0MDU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")' }}
      />
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-purple-900/20 to-purple-900/80 z-0 pointer-events-none" />

      {/* Floating Stars Animations */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 z-10"
          initial={{ y: 0, opacity: 0.5 }}
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            fontSize: `${20 + Math.random() * 30}px`,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto px-4">
        {/* Crystal Ball Graphic Placeholder (CSS Circle with Glow) */}
        <motion.div 
          className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-purple-400/30 to-purple-800/30 backdrop-blur-sm border border-purple-300/20 shadow-[0_0_100px_rgba(168,85,247,0.4)] flex items-center justify-center mb-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              job<br/>finder
            </h1>
            <span className="text-4xl font-cinzel text-purple-200">11</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 text-purple-200 font-cinzel text-lg md:text-xl">
            <div className="flex items-center gap-2">
              <span>February 7-9, 2026</span>
            </div>
            <div className="hidden md:block w-2 h-2 rounded-full bg-purple-400" />
            <div className="flex items-center gap-2">
              <span>Zell B. Miller Learning Center</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-200 to-yellow-400 text-purple-900 font-bold font-cinzel text-xl rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] transition-all"
          >
            Register Now
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F5E6CA] to-transparent z-20" />
      <div className="absolute -bottom-1 left-0 right-0">
         {/* Torn paper effect SVG */}
         <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 text-[#F5E6CA] fill-current">
            <path d="M0,0 C200,20 400,0 600,20 C800,40 1000,10 1200,30 C1300,40 1440,0 1440,0 V50 H0 V0 Z" />
         </svg>
      </div>
    </section>
   </> 
  );
}
