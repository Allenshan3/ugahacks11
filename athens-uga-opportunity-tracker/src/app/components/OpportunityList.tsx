"use client";

import React from "react";
import OpportunityCard from "./OpportunityCard";
import { Opportunity } from "../lib/opportunityUtils";

interface OpportunityListProps {
  opportunities: Opportunity[];
  visibleOpportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  onAddToTracker: (opportunity: Opportunity) => void;
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onNextPage: () => void;
  pageSize: number;
}

export default function OpportunityList({
  opportunities,
  visibleOpportunities,
  isLoading,
  error,
  isLoggedIn,
  onAddToTracker,
  page,
  totalPages,
  startIndex,
  endIndex,
  onNextPage,
  pageSize,
}: OpportunityListProps) {
  return (
    <section className="w-full max-w-5xl mt-16">
      {isLoading && (
        <p className="text-center text-gray-500 mb-6">Searching job opportunities...</p>
      )}
      {error && (
        <p className="text-center text-yellow-600 mb-6">{error}</p>
      )}
      {!isLoading && opportunities.length === 0 && (
        <p className="text-center text-gray-500 mb-6">
          No job opportunities found. Try a different search.
        </p>
      )}
      
      {/* JOB CARDS */}
      <div className="space-y-4">
        {visibleOpportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.job_id}
            opportunity={opportunity}
            isLoggedIn={isLoggedIn}
            onAddToTracker={() => onAddToTracker(opportunity)}
          />
        ))}
      </div>

      {opportunities.length > pageSize && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onNextPage}
            className="px-6 py-2 rounded-full border border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition"
          >
            Next jobs
          </button>
          <p className="text-sm text-gray-500">
            Showing {startIndex}-{endIndex} of {opportunities.length}
          </p>
        </div>
      )}
    </section>
  );
}