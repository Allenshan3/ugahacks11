import React, { useState } from "react";
import { Opportunity } from "../lib/opportunityUtils";
import Card from "./Card";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isLoggedIn: boolean;
  onAddToTracker: () => void;
}

export default function OpportunityCard({ 
  opportunity, 
  isLoggedIn, 
  onAddToTracker 
}: OpportunityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow p-6">
      <div className="flex flex-col gap-4">
        {/* Header with logo and title */}
        <div className="flex items-start gap-4">
          {opportunity.employer_logo && (
            <img 
              src={opportunity.employer_logo} 
              alt={opportunity.employer_name}
              className="w-16 h-16 object-contain rounded flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 break-words">
              {opportunity.job_title}
            </h3>
            <p className="mt-1 font-medium text-gray-600 break-words">
              {opportunity.employer_name}
            </p>
            {opportunity.employer_website && (
              <a 
                href={opportunity.employer_website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {opportunity.employer_website}
              </a>
            )}
          </div>
        </div>

        {/* Job details */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="break-words">{location}</span>
          </span>

          {opportunity.job_employment_type && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full whitespace-nowrap">
              {opportunity.job_employment_type}
            </span>
          )}

          {opportunity.job_is_remote && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full whitespace-nowrap">
              Remote
            </span>
          )}

          <span className="flex items-center gap-1 text-gray-500 whitespace-nowrap">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {postedDate}
          </span>
        </div>

        {/* Salary */}
        {salary && (
          <div className="text-base font-semibold text-green-700 break-words">
            💰 {salary}
          </div>
        )}

        {/* Expiration date */}
        {expirationDate && (
          <div className="text-sm text-red-600 break-words">
            ⚠️ Application deadline: {expirationDate}
          </div>
        )}

        {/* Description preview or full */}
        {opportunity.job_description && (
          <div className="text-sm text-gray-700">
            <div 
              className={`whitespace-pre-wrap break-words ${!isExpanded ? 'line-clamp-3' : ''}`}
              dangerouslySetInnerHTML={{ 
                __html: opportunity.job_description.replace(/<[^>]*>/g, '').substring(0, isExpanded ? undefined : 300) 
              }}
            />
          </div>
        )}

        {/* Required skills */}
        {opportunity.job_required_skills && opportunity.job_required_skills.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-2">
              {(isExpanded ? opportunity.job_required_skills : opportunity.job_required_skills.slice(0, 8)).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full break-words">
                  {skill}
                </span>
              ))}
              {!isExpanded && opportunity.job_required_skills.length > 8 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  +{opportunity.job_required_skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Required Experience */}
        {isExpanded && opportunity.job_required_experience && (
          <div className="text-sm">
            <p className="font-semibold text-gray-700 mb-2">Experience Requirements:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {opportunity.job_required_experience.no_experience_required && (
                <li>No experience required ✅</li>
              )}
              {opportunity.job_required_experience.required_experience_in_months && (
                <li>{opportunity.job_required_experience.required_experience_in_months} months of experience required</li>
              )}
              {opportunity.job_required_experience.experience_preferred && (
                <li>Experience preferred but not required</li>
              )}
            </ul>
          </div>
        )}

        {/* Required Education */}
        {isExpanded && opportunity.job_required_education && (
          <div className="text-sm">
            <p className="font-semibold text-gray-700 mb-2">Education Requirements:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {opportunity.job_required_education.high_school && <li>High School Diploma</li>}
              {opportunity.job_required_education.associates_degree && <li>Associate's Degree</li>}
              {opportunity.job_required_education.bachelors_degree && <li>Bachelor's Degree</li>}
              {opportunity.job_required_education.postgraduate_degree && <li>Postgraduate Degree</li>}
              {opportunity.job_required_education.professional_school && <li>Professional School</li>}
              {opportunity.job_required_education.degree_mentioned && !opportunity.job_required_education.degree_preferred && (
                <li>Degree mentioned in posting</li>
              )}
              {opportunity.job_required_education.degree_preferred && <li>Degree preferred but not required</li>}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {isExpanded && opportunity.job_benefits && opportunity.job_benefits.length > 0 && (
          <div className="text-sm">
            <p className="font-semibold text-gray-700 mb-2">Benefits:</p>
            <div className="flex flex-wrap gap-2">
              {opportunity.job_benefits.map((benefit, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full break-words">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {isExpanded && opportunity.job_highlights && (
          <div className="space-y-3 text-sm">
            {opportunity.job_highlights.Qualifications && opportunity.job_highlights.Qualifications.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">📋 Qualifications:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {opportunity.job_highlights.Qualifications.map((qual, i) => (
                    <li key={i} className="break-words">{qual}</li>
                  ))}
                </ul>
              </div>
            )}
            {opportunity.job_highlights.Responsibilities && opportunity.job_highlights.Responsibilities.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">💼 Responsibilities:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {opportunity.job_highlights.Responsibilities.map((resp, i) => (
                    <li key={i} className="break-words">{resp}</li>
                  ))}
                </ul>
              </div>
            )}
            {opportunity.job_highlights.Benefits && opportunity.job_highlights.Benefits.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">✨ Benefits:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {opportunity.job_highlights.Benefits.map((benefit, i) => (
                    <li key={i} className="break-words">{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Additional Info */}
        {isExpanded && (
          <div className="text-sm text-gray-600 space-y-2 border-t pt-4">
            {opportunity.job_google_link && (
              <p>
                <span className="font-semibold">Google Jobs Link:</span>{" "}
                <a href={opportunity.job_google_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  View on Google Jobs
                </a>
              </p>
            )}
            {opportunity.job_onet_soc && (
              <p><span className="font-semibold">ONET SOC:</span> {opportunity.job_onet_soc}</p>
            )}
            {opportunity.job_onet_job_zone && (
              <p><span className="font-semibold">ONET Job Zone:</span> {opportunity.job_onet_job_zone}</p>
            )}
            {opportunity.job_posting_language && (
              <p><span className="font-semibold">Language:</span> {opportunity.job_posting_language}</p>
            )}
            <p><span className="font-semibold">Job ID:</span> {opportunity.job_id}</p>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 self-start"
        >
          {isExpanded ? (
            <>
              Show Less
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Show More Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            className="flex-1 md:flex-none px-6 py-2 rounded-full border border-gray-300 font-semibold text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition whitespace-nowrap"
            onClick={onAddToTracker}
          >
            {isLoggedIn ? "Add to Tracker" : "Login to Add"}
          </button>
          
          {opportunity.job_apply_link && (
            <a
              href={opportunity.job_apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-6 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition text-center whitespace-nowrap"
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}