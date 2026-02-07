"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useJobs } from "../JobsContext";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

type JobStatus = "Applied" | "Interview" | "Offer" | "Accepted" | "Rejected";

export default function Dashboard() {
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const { jobs, deleteJob, isLoading } = useJobs();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading your applications...</p>
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

  const statusColor: Record<JobStatus, string> = {
    Applied: "text-blue-600 bg-blue-100",
    Interview: "text-orange-600 bg-orange-100",
    Offer: "text-green-600 bg-green-100",
    Accepted: "text-purple-600 bg-purple-100",
    Rejected: "text-red-600 bg-red-100",
  };

  const handleDelete = async (id: string, jobName: string) => {   
      try {
        await deleteJob(id);
      } catch (error) {
        alert("Failed to delete job. Please try again.");
      } 
  };

  const exportToCSV = () => {
    const csvHeader = "Role,Company,Location,Status,Link,Employment Type,Salary,Remote,Posted Date,Notes\n";
    const csvRows = jobs
      .map((job) => {
        const salary = job.job_min_salary && job.job_max_salary
          ? `${job.job_salary_currency || "$"}${job.job_min_salary}-${job.job_max_salary} ${job.job_salary_period || ""}`
          : "N/A";
        const postedDate = job.job_posted_at_datetime_utc 
          ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
          : "N/A";
        return `"${job.role}","${job.company}","${job.location}","${job.status}","${job.link}","${job.job_employment_type || "N/A"}","${salary}","${job.job_is_remote ? "Yes" : "No"}","${postedDate}","${job.notes.replace(/"/g, '""')}"`;
      })
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "applications.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <header className="px-8 py-12">
        <h2 className="text-4xl font-extrabold">Your Applications</h2>
        <p className="text-gray-600 mt-2">
          Track your job, internship, and volunteer role progress.
        </p>

        <div className="flex gap-3 mt-6">
          <Link 
            href="/job/new"
            className="text-white px-6 py-2 rounded inline-block hover:opacity-90" style={{backgroundColor: '#9F76A9'}}
          >
            + Add Application
          </Link>
          <button
            onClick={exportToCSV} 
            className="text-white px-6 py-2 rounded inline-block hover:opacity-90" style={{backgroundColor: '#9F76A9'}}
          >
            Export to CSV
          </button>
        </div>
      </header>

      <section className="px-8 pb-20 max-w-6xl mx-auto w-full space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No applications yet.</p>
            <p className="mt-2">Click &quot;+ Add Application&quot; to get started!</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                {/* Logo */}
                {job.employer_logo && (
                  <img 
                    src={job.employer_logo} 
                    alt={job.company}
                    className="w-16 h-16 object-contain rounded flex-shrink-0"
                  />
                )}
                
                <div className="flex-1">
                  {/* Title and Company */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{job.role}</h3>
                      <p className="text-gray-600 text-sm">{job.company}</p>
                      {job.employer_website && (
                        <a 
                          href={job.employer_website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {job.employer_website}
                        </a>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Link 
                        href={`/job/${job._id}`} 
                        className="text-black-600 hover:bg-blue-50 px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button 
                        onClick={() => handleDelete(job._id, job.role)}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {job.location}
                    </span>

                    {job.job_employment_type && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {job.job_employment_type}
                      </span>
                    )}

                    {job.job_is_remote && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Remote
                      </span>
                    )}

                    {job.job_posted_at_datetime_utc && (
                      <span>
                        Posted: {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Salary */}
                  {job.job_min_salary && job.job_max_salary && (
                    <div className="mt-2 text-sm font-semibold text-green-700">
                      💰 {job.job_salary_currency || "$"}{job.job_min_salary.toLocaleString()} - {job.job_salary_currency || "$"}{job.job_max_salary.toLocaleString()} {job.job_salary_period || ""}
                    </div>
                  )}

                  {/* Status */}
                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${statusColor[job.status]}`}
                  >
                    {job.status}
                  </span>

                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <Footer />
    </div>
  );
}