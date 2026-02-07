import React from "react";
import Link from "next/link";
import Image from "next/image";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white text-black flex flex-col">
      <Nav />

      {/* HERO SECTION */}
      <div className="relative flex flex-col items-center justify-center flex-grow text-center px-6 overflow-hidden">

        {/* Background Image using next/image */}
        <Image
          src="/background.jpg"
          alt="Athens skyline background"
          fill
          priority
          className="object-cover object-center z-0"
        />

        {/* White overlay */}
        <div className="absolute inset-0 bg-white/50 z-0"></div>

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-8xl font-bold max-w-4xl leading-tight tracking-tight">
            Athens & UGA <span className="text-red-600">Opportunity Tracker</span>
          </h2>

          <p className="text-black font-semibold max-w-2xl mt-6">
            Find jobs, internships, and volunteer roles that match your skills — and track
            your applications, interviews, and offers all in one place.
          </p>

          <div className="mt-10 flex gap-5">
            <Link 
              href="/nonauth"
              className="px-8 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition transform hover:scale-105 inline-block"
            >
              Get Started
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-12 text-black font-semibold mt-16">
            <div className="flex flex-col items-center gap-2">
              <span>🔍</span>
              Smart Job Matching
            </div>
            <div className="flex flex-col items-center gap-2">
              <span>🎯</span>
              Track Applications
            </div>
            <div className="flex flex-col items-center gap-2">
              <span>⏰</span>
              Deadline Reminders
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
