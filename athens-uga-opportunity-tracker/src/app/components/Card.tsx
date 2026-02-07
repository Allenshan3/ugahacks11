import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (

    // testing comment ing changes for repo
    <article className={`rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow p-6 ${className}`}>
      {children}
    </article>
  );
}