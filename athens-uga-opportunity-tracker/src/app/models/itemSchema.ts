import mongoose, { Schema, Model } from "mongoose";

export type JobStatus = "Applied" | "Interview" | "Offer" | "Accepted" | "Rejected";

export type JobType = {
  userId: string;
  // Basic required fields
  role: string;
  company: string;
  location: string;
  status: JobStatus;
  link?: string;
  notes?: string;
  
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
  job_posted_at_datetime_utc?: Date;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_latitude?: number;
  job_longitude?: number;
  job_benefits?: string[];
  job_google_link?: string;
  job_offer_expiration_datetime_utc?: Date;
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
};

export type JobDoc = mongoose.HydratedDocument<JobType>;

const jobSchema = new Schema<JobType>(
  {
    userId: { type: String, required: true, index: true },
    // Basic required fields
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Applied", "Interview", "Offer", "Accepted", "Rejected"],
      required: true,
      default: "Applied"
    },
    link: String,
    notes: String,
    
    // Extended fields from JSearch API
    job_id: String,
    employer_name: String,
    employer_logo: String,
    employer_website: String,
    employer_company_type: String,
    job_publisher: String,
    job_employment_type: String,
    job_title: String,
    job_apply_link: String,
    job_apply_is_direct: Boolean,
    job_apply_quality_score: Number,
    job_description: String,
    job_is_remote: Boolean,
    job_posted_at_timestamp: Number,
    job_posted_at_datetime_utc: Date,
    job_city: String,
    job_state: String,
    job_country: String,
    job_latitude: Number,
    job_longitude: Number,
    job_benefits: [String],
    job_google_link: String,
    job_offer_expiration_datetime_utc: Date,
    job_offer_expiration_timestamp: Number,
    job_required_experience: {
      no_experience_required: Boolean,
      required_experience_in_months: Number,
      experience_mentioned: Boolean,
      experience_preferred: Boolean
    },
    job_required_skills: [String],
    job_required_education: {
      postgraduate_degree: Boolean,
      professional_school: Boolean,
      high_school: Boolean,
      associates_degree: Boolean,
      bachelors_degree: Boolean,
      degree_mentioned: Boolean,
      degree_preferred: Boolean,
      professional_school_mentioned: Boolean
    },
    job_experience_in_place_of_education: Boolean,
    job_min_salary: Number,
    job_max_salary: Number,
    job_salary_currency: String,
    job_salary_period: String,
    job_highlights: {
      Qualifications: [String],
      Responsibilities: [String],
      Benefits: [String]
    },
    job_job_title: String,
    job_posting_language: String,
    job_onet_soc: String,
    job_onet_job_zone: String,
    job_naics_code: String,
    job_naics_name: String
  },
  { timestamps: true }
);

export const Job: Model<JobType> =
  (mongoose.models.Job as Model<JobType>) ||
  mongoose.model<JobType>("Job", jobSchema);

export default Job;