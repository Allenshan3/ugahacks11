"use client";

import React from "react";
import Nav from "../components/Nav";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";

export default function Hero() {
  return (
    <>
      <Nav />
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-purple-900 text-white pt-20">
      
      {/* Background Image Overlay */}
      <Image  
          src="/splash-background .png"
          alt="background"
          fill
          priority
          className="object-cover object-center z-0"
        />
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-purple-900/20 to-purple-900/80 z-0 pointer-events-none" />

      {/* Floating Stars Animations */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 z-10"
          initial={{ y: 0, opacity: 0.5 }}
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            fontSize: `${30 + Math.random() * 50}px`,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto px-4">
        {/* Glass Rectangle */}
        <motion.div 
          className="w-auto px-8 py-8 md:px-12 md:py-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.3)] mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-cinzel font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              Georgia Community Job/Internship Opportunities Tracker
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="font-cinzel font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            Helping you find jobs and internships within the Georgia community that match your time, skills, and interests. Create and track
            your jobs and internships applications in one place.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-200 to-yellow-400 text-purple-900 font-bold font-cinzel text-xl rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] transition-all"
          >
            <Link 
              href="/signup"
            >
              Login/Sign Up
            </Link>
            
          </motion.button>
        </motion.div>
      </div>
    </section>
    <Footer />
   </> 
  );
}