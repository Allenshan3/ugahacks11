"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useJobs, JobStatus, Job } from "../../JobsContext";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

export default function JobFormPage() {
  const router = useRouter();
  const params = useParams();
  const { status: sessionStatus } = useSession();
  const isLoggedIn = sessionStatus === "authenticated";
  const { addJob, updateJob, getJobById, jobs } = useJobs();
  const jobId = params.id as string;
  const callbackPath = `/job/${jobId}`;
  
  // Check if this is a new job or editing existing
  const isNewJob = jobId === "new";

  // Store the full job object to preserve all fields
  const [originalJob, setOriginalJob] = useState<Job | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<JobStatus>("Applied");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  // Protect the page - redirect if not logged in
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
    }
  }, [sessionStatus, router, callbackPath]);

  // Load job data based on ID (only if editing existing job)
  useEffect(() => {
    if (!isNewJob && jobId) {
      const job = getJobById(jobId);
      if (job) {
        setOriginalJob(job); // Store the full job object
        setTitle(job.role);
        setCompany(job.company);
        setLocation(job.location);
        setStatus(job.status);
        setLink(job.link || "");
        setNotes(job.notes || "");
      } else {
        console.log("Job not found in context");
      }
    }
  }, [jobId, isNewJob, getJobById, jobs]);

  // Don't render content if not logged in
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking your access...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }
  const handleLinkBlur = () => {
    if (link && !/^https?:\/\//i.test(link)) {
      setLink(`https://${link}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData = {
      role: title,
      company,
      location,
      status,
      link,
      notes,
      // Preserve all extended fields from the original job
      ...(originalJob && {
        job_id: originalJob.job_id,
        employer_name: originalJob.employer_name,
        employer_logo: originalJob.employer_logo,
        employer_website: originalJob.employer_website,
        employer_company_type: originalJob.employer_company_type,
        job_publisher: originalJob.job_publisher,
        job_employment_type: originalJob.job_employment_type,
        job_title: originalJob.job_title,
        job_apply_link: originalJob.job_apply_link,
        job_apply_is_direct: originalJob.job_apply_is_direct,
        job_apply_quality_score: originalJob.job_apply_quality_score,
        job_description: originalJob.job_description,
        job_is_remote: originalJob.job_is_remote,
        job_posted_at_timestamp: originalJob.job_posted_at_timestamp,
        job_posted_at_datetime_utc: originalJob.job_posted_at_datetime_utc,
        job_city: originalJob.job_city,
        job_state: originalJob.job_state,
        job_country: originalJob.job_country,
        job_latitude: originalJob.job_latitude,
        job_longitude: originalJob.job_longitude,
        job_benefits: originalJob.job_benefits,
        job_google_link: originalJob.job_google_link,
        job_offer_expiration_datetime_utc: originalJob.job_offer_expiration_datetime_utc,
        job_offer_expiration_timestamp: originalJob.job_offer_expiration_timestamp,
        job_required_experience: originalJob.job_required_experience,
        job_required_skills: originalJob.job_required_skills,
        job_required_education: originalJob.job_required_education,
        job_experience_in_place_of_education: originalJob.job_experience_in_place_of_education,
        job_min_salary: originalJob.job_min_salary,
        job_max_salary: originalJob.job_max_salary,
        job_salary_currency: originalJob.job_salary_currency,
        job_salary_period: originalJob.job_salary_period,
        job_highlights: originalJob.job_highlights,
        job_job_title: originalJob.job_job_title,
        job_posting_language: originalJob.job_posting_language,
        job_onet_soc: originalJob.job_onet_soc,
        job_onet_job_zone: originalJob.job_onet_job_zone,
        job_naics_code: originalJob.job_naics_code,
        job_naics_name: originalJob.job_naics_name,
      })
    };

    try {
      if (isNewJob) {
        // Create new job
        await addJob(jobData);
        console.log("Creating new job:", jobData);
      } else {
        // Update existing job
        await updateJob(jobId, jobData);
        console.log("Updating job:", jobData);
      }
      
      // Clear form for new jobs
      if (isNewJob) {
        setTitle("");
        setCompany("");
        setLocation("");
        setStatus("Applied");
        setLink("");
        setNotes("");
      }
      
      // Navigate back to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  // Helper variables for job details display
  const postedDate = originalJob?.job_posted_at_datetime_utc 
    ? new Date(originalJob.job_posted_at_datetime_utc).toLocaleDateString()
    : null;

  const salary = originalJob?.job_min_salary && originalJob?.job_max_salary
    ? `${originalJob.job_salary_currency || "$"}${originalJob.job_min_salary.toLocaleString()} - ${originalJob.job_salary_currency || "$"}${originalJob.job_max_salary.toLocaleString()} ${originalJob.job_salary_period || ""}`
    : null;

  const expirationDate = originalJob?.job_offer_expiration_datetime_utc
    ? new Date(originalJob.job_offer_expiration_datetime_utc).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* NAVBAR */}
      <Nav />

      {/* FORM CONTAINER */}
      <div className="w-full px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-black mb-2">
            {isNewJob ? "Add New Opportunity" : "Edit Opportunity"}
          </h2>
          <p className="text-gray-600 mb-8">
            {isNewJob 
              ? "Track a new job, internship, or volunteer application." 
              : "Update your job, internship, or volunteer application."}
          </p>

          <form onSubmit={handleSubmit}>
            {/* RESPONSIVE LAYOUT - Side by side on large screens, stacked on small */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              
              {/* LEFT/TOP SIDE - Job Details & Notes */}
              <div className="flex-1 order-2 lg:order-1 space-y-6">
                
                {/* Job Details Section - Only show if editing and has extended data */}
                {!isNewJob && originalJob && (originalJob.job_description || originalJob.job_required_skills) && (
                  <div className="border rounded-lg p-5 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-4">Job Details</h3>
                    
                    {/* Scrollable container */}
                    <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                      
                      {/* Company Info with Logo */}
                      <div className="flex items-start gap-4">
                        {originalJob.employer_logo && (
                          <img 
                            src={originalJob.employer_logo} 
                            alt={originalJob.employer_name || company}
                            className="w-16 h-16 object-contain rounded flex-shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-base">{title}</h4>
                          <p className="text-gray-600 text-sm">{company}</p>
                          {originalJob.employer_website && (
                            <a 
                              href={originalJob.employer_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {originalJob.employer_website}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Job Metadata */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {location}
                        </span>

                        {originalJob.job_employment_type && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {originalJob.job_employment_type}
                          </span>
                        )}

                        {originalJob.job_is_remote && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Remote
                          </span>
                        )}

                        {postedDate && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {postedDate}
                          </span>
                        )}
                      </div>

                      {/* Salary */}
                      {salary && (
                        <div className="text-base font-semibold text-green-700">
                          💰 {salary}
                        </div>
                      )}

                      {/* Expiration date */}
                      {expirationDate && (
                        <div className="text-sm text-red-600">
                          ⚠️ Application deadline: {expirationDate}
                        </div>
                      )}

                      {/* Description */}
                      {originalJob.job_description && (
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold mb-2">Description:</p>
                          <div 
                            className={`whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''}`}
                            dangerouslySetInnerHTML={{ 
                              __html: originalJob.job_description.replace(/<[^>]*>/g, '').substring(0, isExpanded ? undefined : 300) 
                            }}
                          />
                        </div>
                      )}

                      {/* Required skills */}
                      {originalJob.job_required_skills && originalJob.job_required_skills.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {(isExpanded ? originalJob.job_required_skills : originalJob.job_required_skills.slice(0, 8)).map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                {skill}
                              </span>
                            ))}
                            {!isExpanded && originalJob.job_required_skills.length > 8 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                +{originalJob.job_required_skills.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Required Experience */}
                      {isExpanded && originalJob.job_required_experience && (
                        <div className="text-sm">
                          <p className="font-semibold text-gray-700 mb-2">Experience Requirements:</p>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {originalJob.job_required_experience.no_experience_required && (
                              <li>No experience required ✅</li>
                            )}
                            {originalJob.job_required_experience.required_experience_in_months && (
                              <li>{originalJob.job_required_experience.required_experience_in_months} months of experience required</li>
                            )}
                            {originalJob.job_required_experience.experience_preferred && (
                              <li>Experience preferred but not required</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Required Education */}
                      {isExpanded && originalJob.job_required_education && (
                        <div className="text-sm">
                          <p className="font-semibold text-gray-700 mb-2">Education Requirements:</p>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {originalJob.job_required_education.high_school && <li>High School Diploma</li>}
                            {originalJob.job_required_education.associates_degree && <li>Associate's Degree</li>}
                            {originalJob.job_required_education.bachelors_degree && <li>Bachelor's Degree</li>}
                            {originalJob.job_required_education.postgraduate_degree && <li>Postgraduate Degree</li>}
                            {originalJob.job_required_education.professional_school && <li>Professional School</li>}
                            {originalJob.job_required_education.degree_mentioned && !originalJob.job_required_education.degree_preferred && (
                              <li>Degree mentioned in posting</li>
                            )}
                            {originalJob.job_required_education.degree_preferred && <li>Degree preferred but not required</li>}
                          </ul>
                        </div>
                      )}

                      {/* Benefits */}
                      {isExpanded && originalJob.job_benefits && originalJob.job_benefits.length > 0 && (
                        <div className="text-sm">
                          <p className="font-semibold text-gray-700 mb-2">Benefits:</p>
                          <div className="flex flex-wrap gap-2">
                            {originalJob.job_benefits.map((benefit, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Highlights */}
                      {isExpanded && originalJob.job_highlights && (
                        <div className="space-y-3 text-sm">
                          {originalJob.job_highlights.Qualifications && originalJob.job_highlights.Qualifications.length > 0 && (
                            <div>
                              <p className="font-semibold text-gray-700 mb-2">📋 Qualifications:</p>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {originalJob.job_highlights.Qualifications.map((qual, i) => (
                                  <li key={i}>{qual}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {originalJob.job_highlights.Responsibilities && originalJob.job_highlights.Responsibilities.length > 0 && (
                            <div>
                              <p className="font-semibold text-gray-700 mb-2">💼 Responsibilities:</p>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {originalJob.job_highlights.Responsibilities.map((resp, i) => (
                                  <li key={i}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {originalJob.job_highlights.Benefits && originalJob.job_highlights.Benefits.length > 0 && (
                            <div>
                              <p className="font-semibold text-gray-700 mb-2">✨ Benefits:</p>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {originalJob.job_highlights.Benefits.map((benefit, i) => (
                                  <li key={i}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Additional Info */}
                      {isExpanded && (
                        <div className="text-sm text-gray-600 space-y-2 border-t pt-4">
                          {originalJob.job_google_link && (
                            <p>
                              <span className="font-semibold">Google Jobs Link:</span>{" "}
                              <a href={originalJob.job_google_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View on Google Jobs
                              </a>
                            </p>
                          )}
                          {originalJob.job_onet_soc && (
                            <p><span className="font-semibold">ONET SOC:</span> {originalJob.job_onet_soc}</p>
                          )}
                          {originalJob.job_onet_job_zone && (
                            <p><span className="font-semibold">ONET Job Zone:</span> {originalJob.job_onet_job_zone}</p>
                          )}
                          {originalJob.job_posting_language && (
                            <p><span className="font-semibold">Language:</span> {originalJob.job_posting_language}</p>
                          )}
                          <p><span className="font-semibold">Job ID:</span> {originalJob.job_id}</p>
                        </div>
                      )}

                      {/* Expand/Collapse Button */}
                      <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
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
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div>
                  <label className="block mb-1 font-semibold">Notes</label>
                  <textarea
                    rows={10}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none resize-none"
                    placeholder="Interview dates, recruiter name, follow-up reminders…"
                  ></textarea>
                </div>
              </div>

              {/* RIGHT/TOP SIDE - All Other Fields */}
              <div className="w-full lg:w-96 space-y-6 order-1 lg:order-2">
              
                {/* Job Title */}
                <div>
                  <label className="block mb-1 font-semibold">Position Title</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="e.g., Software Engineering Intern"
                    required
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block mb-1 font-semibold">Company / Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="e.g., NCR, UGA Research Lab, Delta, etc."
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="Athens, GA / Remote"
                  />
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block mb-1 font-semibold">Application Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as JobStatus)}
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>

                {/* Link */}

      
                <div>
                  <label className="block mb-1 font-semibold">Link to Posting (optional)</label>
                  <input 
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    onBlur={handleLinkBlur} 
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="https://jobposting.com"
                  />
                </div>

                {/* Buttons - Only show here on large screens */}
                <div className="hidden lg:flex gap-3 pt-4">
                  <button 
                    type="submit"
                    className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded"
                  >
                    {isNewJob ? "Add Opportunity" : "Save Changes"}
                  </button>
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="border border-black text-black hover:text-red-600 hover:border-red-600 px-6 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons - Show below notes on small screens */}
            <div className="flex lg:hidden gap-3 pt-8 order-3">
              <button 
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded"
              >
                {isNewJob ? "Add Opportunity" : "Save Changes"}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="border border-black text-black hover:text-red-600 hover:border-red-600 px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}