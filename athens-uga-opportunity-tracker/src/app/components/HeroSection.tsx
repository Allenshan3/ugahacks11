"use client";

import React, { useState } from "react";
import Link from "next/link";

interface HeroSectionProps {
  isLoggedIn: boolean;
  onPasteResume: () => void;
  onSearch: (query: string) => void;
}

export default function HeroSection({ isLoggedIn, onPasteResume, onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="w-full max-w-4xl text-center mt-8">
      <p className="text-sm font-semibold uppercase tracking-widest" style={{color: '#9F76A9'}}>
        Opportunity Tracker
      </p>
      <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight">
        Discover Community Volunteering Opportunities
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Browse community volunteer roles. 
        {isLoggedIn 
          ? " Save and track your opportunities." 
          : " Create an account to save and track your opportunities."}
      </p>

      {/* Conditional Buttons Based on Auth State */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={onPasteResume}
            className="px-6 py-3 rounded-full text-white font-semibold shadow hover:opacity-90 transition"
            style={{backgroundColor: '#9F76A9'}}
          >
            Paste Resume
          </button>
        ) : (
          <>
            <Link 
              href="/signup"
              className="px-6 py-3 rounded-full text-white font-semibold shadow hover:opacity-90 transition inline-block"
              style={{backgroundColor: '#9F76A9'}}
            >
              Create Account
            </Link>
            <Link 
              href="/login"
              className="px-6 py-3 rounded-full border border-gray-900 font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition inline-block"
            >
              Login
            </Link>
          </>
        )}
      </div>

      <form onSubmit={handleSearch} className="mt-12 w-full">
        <label className="sr-only" htmlFor="opportunity-search">
          Search opportunities
        </label>
        <div className="flex items-center gap-3 w-full rounded-full border border-gray-200 shadow-sm px-6 py-4">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.1-4.15a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
            />
          </svg>
          <input
            id="opportunity-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities by title, company, or location..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-full font-semibold hover:opacity-90 transition whitespace-nowrap"
            style={{backgroundColor: '#9F76A9'}}
          >
            Search
          </button>
        </div>
      </form>
    </section>
  );
}