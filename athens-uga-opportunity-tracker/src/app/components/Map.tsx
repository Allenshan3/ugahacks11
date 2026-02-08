'use client'
import React, { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

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
  lat?: number;
  lng?: number;
  jobs: JobSummary[];
};

interface MapProps {
  opportunities?: JobSummary[];
}

export default function Map({ opportunities }: MapProps) {
    const [dbClusters, setDbClusters] = useState<CityCluster[]>([]);
    const [dbTotalJobs, setDbTotalJobs] = useState(0);
    const [dbLoading, setDbLoading] = useState(!opportunities);

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

    // Aggregate opportunities by city/state with default coordinates
    const aggregatedClusters = useMemo(() => {
        if (!opportunities || opportunities.length === 0) {
            return dbClusters;
        }

        const cityCoords: Record<string, [number, number]> = {
            'Atlanta, Georgia': [33.7490, -84.3880],
            'Athens, Georgia': [33.9519, -83.3576],
            'Augusta, Georgia': [33.4735, -81.9754],
            'Savannah, Georgia': [32.0809, -81.0912],
            'Macon, Georgia': [32.8407, -83.6324],
        };

        const cityMap: Record<string, CityCluster> = {};

        opportunities.forEach((opp) => {
            const city = opp.job_city || 'Unknown';
            const state = opp.job_state || 'Unknown';
            const key = `${city}, ${state}`;

            if (!cityMap[key]) {
                const [lat, lng] = cityCoords[key] || [39.8283, -98.5795];
                cityMap[key] = {
                    city,
                    state,
                    count: 0,
                    lat,
                    lng,
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
    const clustersWithCoords = aggregatedClusters.filter(c => c.lat !== undefined && c.lng !== undefined);

    return (
        <div className="flex flex-col w-full gap-4">
            <div className="bg-[#A983B2] p-4 rounded-lg text-center font-bold text-white shadow-md">
                {loading ? "Loading job locations..." : `Found ${totalCount} Jobs in ${clustersWithCoords.length} Cities`}
            </div>

<div className="w-full h-[450px] rounded-lg overflow-hidden border-2 border-slate-200 shadow-md z-0">                {loading ? (
                    <div className="h-full flex items-center justify-center bg-gray-100 text-gray-600">
                        Loading map...
                    </div>
                ) : (
                    <MapContainer
                        center={[39.8283, -98.5795]}
                        zoom={4}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {clustersWithCoords.map((cluster) => {
                            const radius = Math.log(cluster.count + 1) * 15;
                            return (
                                <CircleMarker
                                    key={`${cluster.city}-${cluster.state}`}
                                    center={[cluster.lat!, cluster.lng!]}
                                    radius={radius}
                                    fillColor="#3b82f6"
                                    color="#1e40af"
                                    weight={2}
                                    opacity={0.8}
                                    fillOpacity={0.6}
                                >
                                    <Popup>
                                        <div className="min-w-[250px] max-h-[400px] overflow-y-auto">
                                            <h3 className="font-bold text-lg text-blue-700 mb-2">
                                                {cluster.city}, {cluster.state}
                                            </h3>
                                            <p className="text-sm font-semibold text-gray-600 mb-2">
                                                📍 {cluster.count} {cluster.count === 1 ? 'Job' : 'Jobs'} Available
                                            </p>
                                            <hr className="my-2" />
                                            <div className="text-sm">
                                                {cluster.jobs.slice(0, 5).map((job, idx) => (
                                                    <div key={job._id || idx} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                                                        <p className="font-semibold text-gray-800">{job.job_title || 'Untitled'}</p>
                                                        <p className="text-gray-600 text-xs">{job.employer_name || 'Unknown'}</p>
                                                        {job.job_apply_link && (
                                                            <a 
                                                                href={job.job_apply_link} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-block mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors no-underline"
                                                            >
                                                                Apply
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                                {cluster.jobs.length > 5 && (
                                                    <p className="text-xs text-gray-500 mt-2 font-semibold">
                                                        +{cluster.jobs.length - 5} more jobs
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}
                    </MapContainer>
                )}
            </div>
        </div>
    )
}