import React, { useState } from "react";
import { Opportunity } from "../lib/opportunityUtils";
import Card from "./Card";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isLoggedIn: boolean;
  onAddToTracker: () => void;
}

const suits = ["♠", "♥", "♦", "♣"];
const cardNumbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export default function OpportunityCard({ 
  opportunity, 
  isLoggedIn, 
  onAddToTracker 
}: OpportunityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate consistent suit and number based on job_id
  const cardNumber = cardNumbers[parseInt(opportunity.job_id.slice(-2), 16) % 13];
  const suit = suits[parseInt(opportunity.job_id.slice(-1), 16) % 4];
  const isPurple = suit === "♥" || suit === "♦";

  const location = [opportunity.job_city, opportunity.job_state, opportunity.job_country]
    .filter(Boolean)
    .join(", ") || "Location not specified";

  const postedDate = opportunity.job_posted_at_datetime_utc 
    ? new Date(opportunity.job_posted_at_datetime_utc).toLocaleDateString()
    : "Recently posted";

  const salary = opportunity.job_min_salary && opportunity.job_max_salary
    ? `${opportunity.job_salary_currency || "$"}${opportunity.job_min_salary.toLocaleString()} - ${opportunity.job_salary_currency || "$"}${opportunity.job_max_salary.toLocaleString()} ${opportunity.job_salary_period || ""}`
    : null;

  const expirationDate = opportunity.job_offer_expiration_datetime_utc
    ? new Date(opportunity.job_offer_expiration_datetime_utc).toLocaleDateString()
    : null;

  return (
    <Card className="rounded-3xl border-4 border-gray-800 bg-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all p-8 relative overflow-hidden w-full max-w-xs h-96 flex flex-col justify-between">
      {/* Playing Card Corners - Top Left */}
      <div style={{ color: isPurple ? '#9F76A9' : '#000000' }} className="absolute top-4 left-4 flex flex-col items-center leading-none">
        <span className="text-3xl font-bold">{cardNumber}</span>
        <span className="text-4xl">{suit}</span>
      </div>

      {/* Playing Card Corners - Bottom Right */}
      <div style={{ color: isPurple ? '#9F76A9' : '#000000' }} className="absolute bottom-4 right-4 flex flex-col items-center rotate-180 leading-none">
        <span className="text-3xl font-bold">{cardNumber}</span>
        <span className="text-4xl">{suit}</span>
      </div>

      {/* Center Suit Watermark */}
      <div style={{ color: isPurple ? '#9F76A9' : '#000000' }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <span className="text-[250px] leading-none font-bold">{suit}</span>
      </div>

      <div className="flex flex-col gap-3 relative z-10 px-2">
        {/* Header with logo and title */}
        <div className="flex items-start gap-2">
          {opportunity.employer_logo && (
            <img 
              src={opportunity.employer_logo} 
              alt={opportunity.employer_name}
              className="w-12 h-12 object-contain rounded flex-shrink-0 border border-gray-300"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 break-words line-clamp-2">
              {opportunity.job_title}
            </h3>
            <p className="text-sm font-semibold text-gray-600 break-words line-clamp-1">
              {opportunity.employer_name}
            </p>
          </div>
        </div>

        {/* Location and quick info */}
        <div className="text-xs text-gray-600 space-y-1">
          <p className="flex items-center gap-1">
            <span>📍</span>
            <span className="break-words">{location}</span>
          </p>
          <p className="flex items-center gap-1">
            <span>📅</span>
            <span>{postedDate}</span>
          </p>
        </div>

        {/* Salary if available */}
        {salary && (
          <div className="text-sm font-bold text-green-700">
            💰 {salary}
          </div>
        )}

        {/* Job type and remote status */}
        <div className="flex flex-wrap gap-2 pt-1">
          {opportunity.job_employment_type && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full whitespace-nowrap">
              {opportunity.job_employment_type}
            </span>
          )}
          {opportunity.job_is_remote && (
            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full whitespace-nowrap">
              Remote
            </span>
          )}
        </div>
      </div>

      {/* Expiration date if applicable */}
      {expirationDate && (
        <div className="text-xs font-semibold text-center relative z-10" style={{ color: "#9F76A9" }}>
          ⏰ Expires: {expirationDate}
        </div>
      )}

      {/* Bottom Action Buttons - Card Centered */}
      <div className="flex flex-col gap-2 relative z-10">
        <button
          type="button"
          onClick={onAddToTracker}
          style={{
            backgroundColor: isPurple ? '#9F76A9' : '#000000',
            color: '#ffffff'
          }}
          className="w-full py-2 rounded-full font-bold text-sm transition whitespace-nowrap hover:opacity-90"
        >
          {isLoggedIn ? "Add to Tracker" : "Login"}
        </button>
        
        {opportunity.job_apply_link && (
          <a
            href={opportunity.job_apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-full font-bold text-sm text-center transition border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white whitespace-nowrap"
          >
            Apply Now
          </a>
        )}
      </div>
    </Card>
  );
}