import connectMongoDB from "../../lib/mongodb";
import Job from "../../models/itemSchema";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

// Nominatim geocoding with caching
const geocodeCache: Record<string, [number, number]> = {};

async function geocodeLocation(city: string, state: string): Promise<[number, number] | null> {
  const cacheKey = `${city}, ${state}`;
  
  if (geocodeCache[cacheKey]) {
    return geocodeCache[cacheKey];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cacheKey)}&limit=1`,
      { headers: { 'User-Agent': 'athens-uga-job-tracker' } }
    );

    if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);

    const data = await response.json();
    if (data && data[0]) {
      const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geocodeCache[cacheKey] = coords;
      await new Promise(r => setTimeout(r, 100)); // Rate limit courtesy
      return coords;
    }
    return null;
  } catch (error) {
    console.error(`Geocoding error for ${cacheKey}:`, error);
    return null;
  }
}

export async function GET(_request: NextRequest) {
  try {
    await connectMongoDB();

    // Get all jobs with city and state
    const jobs = await Job.find(
      { job_city: { $exists: true }, job_state: { $exists: true } },
      { job_city: 1, job_state: 1, job_title: 1, employer_name: 1, job_apply_link: 1, _id: 1 }
    ).lean();

    // Group by city and state
    const cityMap: Record<string, any> = {};

    for (const job of jobs) {
      const city = job.job_city || 'Unknown';
      const state = job.job_state || 'Unknown';
      const key = `${city}, ${state}`;

      if (!cityMap[key]) {
        cityMap[key] = {
          city,
          state,
          count: 0,
          jobs: [],
          lat: null,
          lng: null,
        };
      }

      cityMap[key].count += 1;
      cityMap[key].jobs.push({
        _id: job._id,
        title: job.job_title,
        company: job.employer_name,
        link: job.job_apply_link,
      });
    }

    // Geocode each unique city/state combination
    for (const key in cityMap) {
      const { city, state } = cityMap[key];
      const coords = await geocodeLocation(city, state);
      if (coords) {
        cityMap[key].lat = coords[0];
        cityMap[key].lng = coords[1];
      }
    }

    // Filter out locations without coordinates
    const clusteredJobs = Object.values(cityMap).filter(
      (location: any) => location.lat !== null && location.lng !== null
    );

    return NextResponse.json({ clusteredJobs, totalJobs: jobs.length }, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs for map:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs for map" },
      { status: 500 }
    );
  }
}
