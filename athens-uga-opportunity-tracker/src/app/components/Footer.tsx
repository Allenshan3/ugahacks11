"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="text-center py-6 text-gray-500 border-t border-gray-200 bg-white">
      © {new Date().getFullYear()} UGA Opportunity Tracker — Built for students.
    </footer>
  );
}
