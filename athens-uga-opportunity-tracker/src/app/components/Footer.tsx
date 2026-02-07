"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="text-center py-6 text-white border-t border-gray-200" style={{backgroundColor: 'rgba(74, 74, 133, 0.9)'}}>
      © {new Date().getFullYear()} Opportunity Tracker — Built for the community.
    </footer>
  );
}
