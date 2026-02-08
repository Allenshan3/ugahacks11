"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useJobs } from "../JobsContext";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import HeroSection from "../components/HeroSection";
import OpportunityList from "../components/OpportunityList";
import ResumeModal from "../components/ResumeModal";
import Map from "../components/Map";
import { 
  Opportunity, 
  normalizeJSearchOpportunities,
} from "../lib/opportunityUtils";

const PAGE_SIZE = 6;

export default function NonAuthPage() {
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  
  // Only destructure addJob when logged in to avoid unnecessary context calls
  const jobsContext = useJobs();
  const addJob = jobsContext?.addJob;
  
  // Resume modal state
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [atsKeywords, setAtsKeywords] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Opportunities state
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [opportunityError, setOpportunityError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("volunteer");
  
  const totalPages = opportunities.length > 0 ? Math.ceil(opportunities.length / PAGE_SIZE) : 1;
  const visibleOpportunities = opportunities.length > 0
    ? opportunities.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    : [];
  const startIndex = opportunities.length > 0 ? page * PAGE_SIZE + 1 : 0;
  const endIndex = opportunities.length > 0
    ? Math.min((page + 1) * PAGE_SIZE, opportunities.length)
    : 0;

  // Fetch opportunities function
  const fetchOpportunities = async (searchQuery: string) => {

    if (!searchQuery || searchQuery.trim().length === 0) {
      console.log("Empty search query, skipping fetch.");
      return; 
    }

    setIsLoadingOpportunities(true);
    setOpportunityError(null);

    try {
      console.log("Fetching via server proxy for:", searchQuery);

      // 1. Prepare data for the backend
      const keyword = searchQuery; 
      const location = "Georgia, USA";

      // 2. Call YOUR OWN backend API (bypassing the need for a client-side key)
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: [keyword],
          location: location,
          employmentType: 'ALL' 
        })
      });

      if (!response.ok) {
        throw new Error(`Server API responded with ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        // If the backend sends a specific error (like "Invalid API Key"), show it
        throw new Error(data.error || 'Failed to fetch jobs');
      }

      // 3. Extract and normalize jobs
      const allJobs = data.results.flatMap((r: any) => r.jobs);
      
      // We wrap it in { data: ... } because normalizeJSearchOpportunities expects the raw API structure
      const normalized = normalizeJSearchOpportunities({ data: allJobs });

      if (normalized.length === 0) {
        setOpportunityError(`No job opportunities found for "${searchQuery}".`);
        setOpportunities([]);
      } else {
        setOpportunities(normalized);
        setOpportunityError(null);
      }
      
      setPage(0);
    } catch (err: any) {
      console.error("Failed to load opportunities:", err);
      // Show the actual error message from the backend so you know what's wrong
      setOpportunityError(err.message || `Unable to load job opportunities.`);
      setOpportunities([]);
      setPage(0);
    } finally {
      setIsLoadingOpportunities(false);
    }
  };
  // Fetch opportunities on mount with default search
  useEffect(() => {
    console.log("🔍 Fetching opportunities on mount..."); // Debug
    fetchOpportunities(currentSearchQuery);
  }, []); // Only run once on mount

  const handleSearch = (query: string) => {
    console.log("🔍 New search query:", query); // Debug
    setCurrentSearchQuery(query);
    fetchOpportunities(query);
  };

  const handleNextPage = () => {
    if (opportunities.length <= PAGE_SIZE) return;
    setPage((prev) => (prev + 1) % totalPages);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResumeText(data.text);
        setAtsKeywords(data.atsKeywords || "");
        
        console.log('==================== RESUME TEXT ====================');
        console.log(data.text);
        console.log('====================================================');
        console.log('Number of pages:', data.numPages);
        console.log('====================================================');
        
        if (data.atsKeywords) {
          console.log('==================== ATS KEYWORDS ====================');
          console.log(data.atsKeywords);
          console.log('====================================================');
        }
        
      } else {
        alert('Failed to parse PDF: ' + data.error);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveResume = () => {
    console.log('==================== SAVED RESUME ====================');
    console.log(resumeText);
    console.log('====================================================');
    
    if (atsKeywords) {
      console.log('==================== ATS KEYWORDS ====================');
      console.log(atsKeywords);
      console.log('====================================================');
    }
    
    setShowPasteModal(false);
  };

  // NEW: Handle search results from ResumeModal
  const handleSearchComplete = (jobs: any[], searchQuery: string) => {
    console.log('==================== UPDATING OPPORTUNITIES ====================');
    console.log('Received jobs:', jobs.length);
    console.log('====================================================');

    // Normalize the jobs using your existing utility function
    const normalized = normalizeJSearchOpportunities({ data: jobs });
    
    if (normalized.length === 0) {
      setOpportunityError(`No matching opportunities found for your selected keywords.`);
      setOpportunities([]);
    } else {
      setOpportunities(normalized);
      setOpportunityError(null);
      setCurrentSearchQuery(searchQuery);
    }
    
    setPage(0);
  };

  const handleAddToTracker = async (opportunity: Opportunity) => {
    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/dashboard");
      return;
    }

    const location = [opportunity.job_city, opportunity.job_state]
      .filter(Boolean)
      .join(", ") || "Location not specified";

    try {
      await addJob({
        // Basic required fields
        role: opportunity.job_title,
        company: opportunity.employer_name,
        location: location,
        status: "Applied",
        link: opportunity.job_apply_link || "",
        notes: `Employment Type: ${opportunity.job_employment_type || "N/A"}`,
        
        // All extended fields from the opportunity
        job_id: opportunity.job_id,
        employer_name: opportunity.employer_name,
        employer_logo: opportunity.employer_logo,
        employer_website: opportunity.employer_website,
        employer_company_type: opportunity.employer_company_type,
        job_publisher: opportunity.job_publisher,
        job_employment_type: opportunity.job_employment_type,
        job_title: opportunity.job_title,
        job_apply_link: opportunity.job_apply_link,
        job_apply_is_direct: opportunity.job_apply_is_direct,
        job_apply_quality_score: opportunity.job_apply_quality_score,
        job_description: opportunity.job_description,
        job_is_remote: opportunity.job_is_remote,
        job_posted_at_timestamp: opportunity.job_posted_at_timestamp,
        job_posted_at_datetime_utc: opportunity.job_posted_at_datetime_utc,
        job_city: opportunity.job_city,
        job_state: opportunity.job_state,
        job_country: opportunity.job_country,
        job_latitude: opportunity.job_latitude,
        job_longitude: opportunity.job_longitude,
        job_benefits: opportunity.job_benefits,
        job_google_link: opportunity.job_google_link,
        job_offer_expiration_datetime_utc: opportunity.job_offer_expiration_datetime_utc,
        job_offer_expiration_timestamp: opportunity.job_offer_expiration_timestamp,
        job_required_experience: opportunity.job_required_experience,
        job_required_skills: opportunity.job_required_skills,
        job_required_education: opportunity.job_required_education,
        job_experience_in_place_of_education: opportunity.job_experience_in_place_of_education,
        job_min_salary: opportunity.job_min_salary,
        job_max_salary: opportunity.job_max_salary,
        job_salary_currency: opportunity.job_salary_currency,
        job_salary_period: opportunity.job_salary_period,
        job_highlights: opportunity.job_highlights,
        job_job_title: opportunity.job_job_title,
        job_posting_language: opportunity.job_posting_language,
        job_onet_soc: opportunity.job_onet_soc,
        job_onet_job_zone: opportunity.job_onet_job_zone,
        job_naics_code: opportunity.job_naics_code,
        job_naics_name: opportunity.job_naics_name,
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to add job:", error);
      alert("Failed to add job to tracker. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowPasteModal(false);
    setResumeText("");
    setAtsKeywords("");
  };

  return (
    <div className="min-h-screen flex flex-col relative text-gray-900" style={{ backgroundColor: '#ffffff' }}>
      
      <Nav />

      <main className="flex-grow w-full flex flex-col items-center px-6 py-12">
        <HeroSection 
          isLoggedIn={isLoggedIn}
          onPasteResume={() => setShowPasteModal(true)}
          onSearch={handleSearch}
        />

        {/* Display current search query */}
        {!isLoadingOpportunities && opportunities.length > 0 && (
          <div className="w-full max-w-5xl mt-8 text-center">
            <p className="text-gray-600">
              Showing results for: <span className="font-semibold text-gray-900">"{currentSearchQuery}"</span>
            </p>
          </div>
        )}

        {/* Public Map showing job counts by city */}
        <div className="w-full max-w-6xl mt-6">
          <Map opportunities={opportunities} />
        </div>

        <OpportunityList
          opportunities={opportunities}
          visibleOpportunities={visibleOpportunities}
          isLoading={isLoadingOpportunities}
          error={opportunityError}
          isLoggedIn={isLoggedIn}
          onAddToTracker={handleAddToTracker}
          page={page}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          onNextPage={handleNextPage}
          pageSize={PAGE_SIZE}
        />
      </main>

      <ResumeModal
        isOpen={showPasteModal}
        onClose={handleCloseModal}
        resumeText={resumeText}
        setResumeText={setResumeText}
        atsKeywords={atsKeywords}
        isUploading={isUploading}
        onFileUpload={() => {}}
        onFileChange={handleFileChange}
        onSave={handleSaveResume}
        onSearchComplete={handleSearchComplete}
      />

      <Footer />
    </div>
  );
}