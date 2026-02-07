import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { keywords, location, employmentType } = await request.json();

    const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || "jsearch.p.rapidapi.com";
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server Config Error: NEXT_PUBLIC_INTERNSHIPS_API_KEY is missing' },
        { status: 500 }
      );
    }

    const allResults: any[] = [];
    let apiError = null; // Store error to send back to frontend

    // Make separate API call for each keyword
    for (const keyword of keywords) {
      const query = `${keyword} in ${location}`;
      console.log(`\n🔍 Searching JSearch for: "${query}"`);
      
      let url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=us&date_posted=all`;
      if (employmentType && employmentType !== "ALL") {
        url += `&employment_types=${employmentType}`;
      }

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
            'x-rapidapi-key': apiKey,
          },
        });

        if (!response.ok) {
          const status = response.status;
          console.error(`❌ API ERROR: ${status} for query "${query}"`);
          
          if (status === 403 || status === 401) {
            apiError = "Invalid API Key or Subscription (403). Check RapidAPI.";
          } else if (status === 429) {
            apiError = "Rate Limit Exceeded (429). You made too many requests.";
          } else {
            apiError = `External API Error: ${status}`;
          }
          continue; // Try next keyword
        }

        const data = await response.json();
        const count = data.data?.length || 0;
        console.log(`✅ Success: Found ${count} jobs for "${keyword}"`);

        if (data.data && Array.isArray(data.data)) {
          allResults.push({
            keyword,
            jobs: data.data,
          });
        }
      } catch (error: any) {
        console.error(`❌ NETWORK ERROR for "${keyword}":`, error.message);
        apiError = error.message;
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // If we found NO jobs but encountered an API error, tell the frontend
    if (allResults.length === 0 && apiError) {
      return NextResponse.json({
        success: false,
        error: apiError, 
      });
    }

    return NextResponse.json({
      success: true,
      results: allResults,
      totalJobs: allResults.reduce((sum, r) => sum + r.jobs.length, 0),
    });

  } catch (error: any) {
    console.error('SERVER CRASH:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error.message },
      { status: 500 }
    );
  }
}