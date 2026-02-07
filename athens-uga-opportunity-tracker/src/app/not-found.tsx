import Link from 'next/link';
import React from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <div>
    <Nav />
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Page Not Found</h2>
      <p className="mb-8 text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link 
        href="/"
        className="px-8 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition transform hover:scale-105 inline-block"
      >
        Go Home
      </Link>
    </div>
    <Footer />
    </div>
  );
}