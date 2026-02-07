'use client'
import React, { useEffect, useState, useMemo } from 'react'

type JobSummary = {
  _id?: string;
  job_id?: string;
  job_title?: string;
  employer_name?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
};

type CityCluster = {
  city: string;
  state: string;
  count: number;
  jobs: JobSummary[];
};

interface MapProps {
  opportunities?: JobSummary[];
}

export default function Map({ opportunities }: MapProps) {
    const [dbClusters, setDbClusters] = useState<CityCluster[]>([]);
    const [dbTotalJobs, setDbTotalJobs] = useState(0);
    const [dbLoading, setDbLoading] = useState(!opportunities);
    const [openKey, setOpenKey] = useState<string | null>(null);

    // Load database jobs only if no opportunities passed
    useEffect(() => {
        if (opportunities) {
            setDbLoading(false);
            return;
        }

        async function loadMapData() {
            try {
                const res = await fetch("/api/jobs-for-map");
                if (!res.ok) throw new Error('Failed to fetch map data');
                const data = await res.json();
                setDbClusters(data.clusteredJobs);
                setDbTotalJobs(data.totalJobs);
            } catch (error) {
                console.error("Failed to load map data:", error);
            } finally {
                setDbLoading(false);
            }
        }

        loadMapData();
    }, [opportunities]);

    // Aggregate opportunities by city/state
    const aggregatedClusters = useMemo(() => {
        if (!opportunities || opportunities.length === 0) {
            return dbClusters;
        }

        const cityMap: Record<string, CityCluster> = {};

        opportunities.forEach((opp) => {
            const city = opp.job_city || 'Unknown';
            const state = opp.job_state || 'Unknown';
            const key = `${city}, ${state}`;

            if (!cityMap[key]) {
                cityMap[key] = {
                    city,
                    state,
                    count: 0,
                    jobs: [],
                };
            }

            cityMap[key].count += 1;
            cityMap[key].jobs.push({
                _id: opp.job_id || opp._id,
                job_title: opp.job_title,
                employer_name: opp.employer_name,
                job_apply_link: opp.job_apply_link,
                job_city: opp.job_city,
                job_state: opp.job_state,
            });
        });

        return Object.values(cityMap);
    }, [opportunities, dbClusters]);

    const totalCount = opportunities 
        ? opportunities.length 
        : dbTotalJobs;

    const loading = opportunities ? false : dbLoading;

    return (
        <div className="flex flex-col w-full gap-4">
            <div className="p-4 rounded-lg text-center font-bold text-white shadow-md" style={{backgroundColor: '#9F76A9'}}>
                {loading ? "Loading job locations..." : `Found ${totalCount} Jobs in ${aggregatedClusters.length} Cities`}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {loading && (
                    <div className="p-6 bg-white rounded shadow text-center text-gray-600">Loading...</div>
                )}

                {!loading && aggregatedClusters.length === 0 && (
                    <div className="p-6 bg-white rounded shadow text-center text-gray-600">No job locations available.</div>
                )}

                {!loading && aggregatedClusters.map((c) => {
                    const key = `${c.city}-${c.state}`;
                    const isOpen = openKey === key;
                    return (
                        <div key={key} className="bg-white p-4 rounded shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold">{c.city}, {c.state}</div>
                                    <div className="text-sm text-gray-500">{c.count} {c.count === 1 ? 'job' : 'jobs'}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">{c.count}</div>
                                    <button
                                        onClick={() => setOpenKey(isOpen ? null : key)}
                                        className="px-3 py-1 rounded bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
                                    >
                                        {isOpen ? 'Hide' : 'View'}
                                    </button>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="mt-3 border-t pt-3 max-h-48 overflow-y-auto">
                                    {c.jobs.map((job, idx) => (
                                        <div key={job._id || idx} className="mb-2">
                                            <div className="font-semibold text-sm">{job.job_title || 'Untitled'}</div>
                                            <div className="text-xs text-gray-600">{job.employer_name || 'Unknown'}</div>
                                            {job.job_apply_link && (
                                                <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">Apply</a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}