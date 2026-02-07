"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export type JobStatus = "Applied" | "Interview" | "Offer" | "Accepted" | "Rejected";

export interface Job {
  _id: string;
  // Basic fields
  role: string;
  company: string;
  location: string;
  status: JobStatus;
  link: string;
  notes: string;
  
  // Extended fields from JSearch API
  job_id?: string;
  employer_name?: string;
  employer_logo?: string;
  employer_website?: string;
  employer_company_type?: string;
  job_publisher?: string;
  job_employment_type?: string;
  job_title?: string;
  job_apply_link?: string;
  job_apply_is_direct?: boolean;
  job_apply_quality_score?: number;
  job_description?: string;
  job_is_remote?: boolean;
  job_posted_at_timestamp?: number;
  job_posted_at_datetime_utc?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_latitude?: number;
  job_longitude?: number;
  job_benefits?: string[];
  job_google_link?: string;
  job_offer_expiration_datetime_utc?: string;
  job_offer_expiration_timestamp?: number;
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number;
    experience_mentioned?: boolean;
    experience_preferred?: boolean;
  };
  job_required_skills?: string[];
  job_required_education?: {
    postgraduate_degree?: boolean;
    professional_school?: boolean;
    high_school?: boolean;
    associates_degree?: boolean;
    bachelors_degree?: boolean;
    degree_mentioned?: boolean;
    degree_preferred?: boolean;
    professional_school_mentioned?: boolean;
  };
  job_experience_in_place_of_education?: boolean;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_job_title?: string;
  job_posting_language?: string;
  job_onet_soc?: string;
  job_onet_job_zone?: string;
  job_naics_code?: string;
  job_naics_name?: string;
}

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, "_id">) => Promise<void>;
  updateJob: (id: string, job: Omit<Job, "_id">) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJobById: (id: string) => Job | undefined;
  isLoading: boolean;
  refreshJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchJobs = async () => {
    if (status !== "authenticated") {
      setJobs([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/jobs");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched jobs data:", data); // Debug log
        
        // Extract the jobs array from the response
        const jobsArray = data.jobs || [];
        setJobs(jobsArray);
      } else {
        console.error("Failed to fetch jobs:", response.status);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [status]);

  const addJob = async (job: Omit<Job, "_id">) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Added job response:", data); // Debug log
        
        // Extract the job from the response
        const newJob = data.job;
        
        if (newJob && newJob._id) {
          setJobs([...jobs, newJob]);
        } else {
          console.error("Invalid job data returned:", newJob);
          // Refresh jobs from server to ensure consistency
          await fetchJobs();
        }
      } else {
        throw new Error("Failed to add job");
      }
    } catch (error) {
      console.error("Error adding job:", error);
      throw error;
    }
  };

  const updateJob = async (id: string, updatedJob: Omit<Job, "_id">) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Updated job response:", data); // Debug log
        
        // Extract the job from the response
        const updated = data.job;
        
        if (updated && updated._id) {
          setJobs(jobs.map(job => job._id === id ? updated : job));
        } else {
          console.error("Invalid job data returned:", updated);
          // Refresh jobs from server to ensure consistency
          await fetchJobs();
        }
      } else {
        throw new Error("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== id));
      } else {
        throw new Error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  };

  const getJobById = (id: string) => {
    // Add safety check for undefined jobs
    if (!jobs || !Array.isArray(jobs)) {
      console.warn("Jobs array is not initialized");
      return undefined;
    }
    
    return jobs.find(job => job && job._id === id);
  };

  const refreshJobs = async () => {
    await fetchJobs();
  };

  return (
    <JobsContext.Provider value={{ jobs, addJob, updateJob, deleteJob, getJobById, isLoading, refreshJobs }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within JobsProvider");
  }
  return context;
}