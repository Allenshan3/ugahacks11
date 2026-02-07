"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useJobs, type JobStatus } from "../JobsContext";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function StatsPage() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { jobs } = useJobs();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/stats");
    }
  }, [status, router]);

  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, isAdmin, router]);

  const stats = useMemo(() => {
    const totalApplications = jobs.length;
    
    const statusCounts: Record<JobStatus, number> = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Accepted: 0,
      Rejected: 0,
    };

    jobs.forEach((job) => {
      statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
    });

    const locationCounts: Record<string, number> = {};
    jobs.forEach((job) => {
      const loc = job.location || "Unknown";
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const companyCounts: Record<string, number> = {};
    jobs.forEach((job) => {
      const comp = job.company || "Unknown";
      companyCounts[comp] = (companyCounts[comp] || 0) + 1;
    });

    const successful = statusCounts.Offer + statusCounts.Accepted;
    const successRate = totalApplications > 0 
      ? ((successful / totalApplications) * 100).toFixed(1) 
      : "0";

    const topLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalApplications,
      statusCounts,
      locationCounts,
      companyCounts,
      successRate,
      topLocations,
      topCompanies,
    };
  }, [jobs]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking your access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  const statusColors: Record<JobStatus, string> = {
    Applied: "bg-blue-100 text-blue-800 border-blue-300",
    Interview: "bg-orange-100 text-orange-800 border-orange-300",
    Offer: "bg-green-100 text-green-800 border-green-300",
    Accepted: "bg-purple-100 text-purple-800 border-purple-300",
    Rejected: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />
      
      <main className="flex-grow max-w-7xl mx-auto w-full p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of application statistics and trends</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Applications</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Success Rate</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.successRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.statusCounts.Offer + stats.statusCounts.Accepted} offers/accepted
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Interviews</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.statusCounts.Interview}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Active Applications</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.statusCounts.Applied + stats.statusCounts.Interview}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Status Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(stats.statusCounts).map(([status, count]) => {
                const percentage = stats.totalApplications > 0
                  ? ((count / stats.totalApplications) * 100).toFixed(1)
                  : "0";
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status as JobStatus]}`}>
                        {status}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${statusColors[status as JobStatus].split(" ")[0]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className="font-semibold text-gray-900">{count}</span>
                      <span className="text-sm text-gray-500 ml-2">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Locations</h2>
            {stats.topLocations.length > 0 ? (
              <div className="space-y-3">
                {stats.topLocations.map(([location, count]) => {
                  const percentage = stats.totalApplications > 0
                    ? ((count / stats.totalApplications) * 100).toFixed(1)
                    : "0";
                  return (
                    <div key={location} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm font-medium text-gray-700">📍 {location}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 ml-4">{count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No location data available</p>
            )}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Companies</h2>
          {stats.topCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topCompanies.map(([company, count]) => (
                <div
                  key={company}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-gray-900">{company}</h3>
                  <p className="text-2xl font-bold text-red-600 mt-2">{count}</p>
                  <p className="text-xs text-gray-500 mt-1">application{count !== 1 ? "s" : ""}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No company data available</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}