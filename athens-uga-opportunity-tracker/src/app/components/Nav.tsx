"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { status, data: session } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const [open, setOpen] = useState(false);
  const userName = session?.user?.name;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
<nav className="flex items-center justify-between px-8 md:px-12 py-6 backdrop-blur-sm sticky top-0 z-40 text-white" style={{backgroundColor: 'rgba(74, 74, 133, 0.9)'}}>      
      <div className="flex items-center gap-3">
        <Image 
          src="/bytehacks11icon.png" 
          alt="Opportunity Tracker Logo" 
          width={40} 
          height={40}
          className="rounded-md"
        />
        <h1 className="text-xl font-semibold tracking-tight">
          Opportunity Tracker
        </h1>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link href="/">Home</Link>

        {isLoggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/nonauth">Search</Link>
            {isAdmin && (
              <Link href="/stats">Stats</Link>
            )}
          </>
        ) : (
          <>
            <Link href="/nonauth">Search</Link>
          </>
        )}
      </div>

      {/* Desktop Auth buttons */}
      <div className="hidden md:flex gap-3 md:gap-4 items-center">
        {isLoggedIn && userName && (
          <span className="text-sm">Hi, {userName.split(" ")[0]}!</span>
        )}
        {isLoggedIn ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link 
              href="/login"
              className="px-5 py-2 rounded-md border border-white"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Sign Up
            </Link>

          </>
        )}
      </div>

      {/* Mobile: Hamburger button */}
      <button 
        className="md:hidden text-3xl"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Mobile menu overlay */}
      {open && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg px-8 py-6 flex flex-col gap-4 text-lg font-medium md:hidden text-black">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          

          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/nonauth" onClick={() => setOpen(false)}>Search</Link>
              {isAdmin && (
                <Link href="/stats" onClick={() => setOpen(false)}>Stats</Link>
              )}
            </>
          ) : (
            <>
            <Link href="/nonauth" onClick={() => setOpen(false)}>Search</Link>
            </>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                setOpen(false);
              }}
              className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
          <>
            <Link 
              href="/login"
              className="px-5 py-2 rounded-md border border-black"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Sign Up
            </Link>

          </>
          )}
        </div>
      )}
    </nav>
  );
}