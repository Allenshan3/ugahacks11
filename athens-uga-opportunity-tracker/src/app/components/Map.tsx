'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect, useState } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'
import MapResize from './MapResize'
import L from 'leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

// Fix for default Leaflet icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationCluster {
  city: string;
  state: string;
  count: number;
  lat: number;
  lng: number;
  jobs: Array<{
    _id: string;
    title: string;
    company: string;
    link?: string;
  }>;
}

export default function Map() {
    const [clusteredLocations, setClusteredLocations] = useState<LocationCluster[]>([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMapData() {
            try {
                const res = await fetch("/api/jobs-for-map");
                if (!res.ok) throw new Error('Failed to fetch map data');
                const data = await res.json();
                setClusteredLocations(data.clusteredJobs);
                setTotalJobs(data.totalJobs);
            } catch (error) {
                console.error("Failed to load map data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadMapData();
    }, []);

    return (
        <div className='flex flex-col h-[80vh] w-full gap-4'>
            <div className="bg-blue-600 p-4 rounded-lg text-center font-bold text-white shadow-md">
                {loading ? "Loading Jobs Across the US..." : `Found ${totalJobs} Jobs in ${clusteredLocations.length} Cities`}
            </div>
            
            <MapContainer 
                className="h-full w-full z-0 rounded-lg border-2 border-slate-200 shadow-inner" 
                center={[39.8283, -98.5795]} // Center of United States
                zoom={4} 
                scrollWheelZoom={true}
            >
                <MapResize />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {!loading && (
                    <MarkerClusterGroup 
                        chunkedLoading
                        disableClusteringAtZoom={10}
                        maxClusterRadius={80}
                    >
                        {clusteredLocations.map((location) => (
                            <Marker 
                                key={`${location.city}-${location.state}`}
                                position={[location.lat, location.lng]}
                                icon={defaultIcon}
                            >
                                <Popup className="max-w-xs">
                                    <div className="min-w-[250px] max-h-[400px] overflow-y-auto">
                                        <h3 className="font-bold text-lg text-blue-700 mb-2">
                                            {location.city}, {location.state}
                                        </h3>
                                        <p className="text-sm font-semibold text-gray-600 mb-2">
                                            📍 {location.count} {location.count === 1 ? 'Job' : 'Jobs'} Available
                                        </p>
                                        <hr className="my-2" />
                                        <div className="text-sm">
                                            {location.jobs.slice(0, 5).map((job) => (
                                                <div key={job._id} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                                                    <p className="font-semibold text-gray-800">{job.title}</p>
                                                    <p className="text-gray-600 text-xs">{job.company}</p>
                                                    {job.link && (
                                                        <a 
                                                            href={job.link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-block mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors no-underline"
                                                        >
                                                            Apply
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                            {location.jobs.length > 5 && (
                                                <p className="text-xs text-gray-500 mt-2 font-semibold">
                                                    +{location.jobs.length - 5} more jobs
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
                )}
            </MapContainer>
        </div>
    );
}