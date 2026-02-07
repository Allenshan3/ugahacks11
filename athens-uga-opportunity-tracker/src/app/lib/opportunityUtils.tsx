export interface Opportunity {
  
  job_id: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  employer_company_type?: string; // ADD THIS
  job_publisher?: string; // ADD THIS
  job_employment_type?: string;
  job_title: string;
  job_apply_link: string;
  job_apply_is_direct?: boolean; // ADD THIS
  job_apply_quality_score?: number; // ADD THIS
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
  job_naics_code?: string; // ADD THIS
  job_naics_name?: string; // ADD THIS
}

export const featuredOpportunities: Opportunity[] = [];

export const normalizeJSearchOpportunities = (payload: any): Opportunity[] => {
  if (!payload || !payload.data || !Array.isArray(payload.data)) {
    console.warn("Invalid JSearch API response format");
    return [];
  }

  return payload.data.map((job: any) => ({
    job_id: job.job_id || `job-${Date.now()}-${Math.random()}`,
    employer_name: job.employer_name || "Company Confidential",
    employer_logo: job.employer_logo,
    employer_website: job.employer_website,
    employer_company_type: job.employer_company_type, // ADD THIS
    job_publisher: job.job_publisher, // ADD THIS
    job_employment_type: job.job_employment_type,
    job_title: job.job_title || "Position Available",
    job_apply_link: job.job_apply_link || "",
    job_apply_is_direct: job.job_apply_is_direct, // ADD THIS
    job_apply_quality_score: job.job_apply_quality_score, // ADD THIS
    job_description: job.job_description,
    job_is_remote: job.job_is_remote,
    job_posted_at_timestamp: job.job_posted_at_timestamp,
    job_posted_at_datetime_utc: job.job_posted_at_datetime_utc,
    job_city: job.job_city,
    job_state: job.job_state,
    job_country: job.job_country,
    job_latitude: job.job_latitude,
    job_longitude: job.job_longitude,
    job_benefits: job.job_benefits,
    job_google_link: job.job_google_link,
    job_offer_expiration_datetime_utc: job.job_offer_expiration_datetime_utc,
    job_offer_expiration_timestamp: job.job_offer_expiration_timestamp,
    job_required_experience: job.job_required_experience,
    job_required_skills: job.job_required_skills,
    job_required_education: job.job_required_education,
    job_experience_in_place_of_education: job.job_experience_in_place_of_education,
    job_min_salary: job.job_min_salary,
    job_max_salary: job.job_max_salary,
    job_salary_currency: job.job_salary_currency,
    job_salary_period: job.job_salary_period,
    job_highlights: job.job_highlights,
    job_job_title: job.job_job_title,
    job_posting_language: job.job_posting_language,
    job_onet_soc: job.job_onet_soc,
    job_onet_job_zone: job.job_onet_job_zone,
    job_naics_code: job.job_naics_code, // ADD THIS
    job_naics_name: job.job_naics_name, // ADD THIS
  }));
};