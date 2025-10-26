import { NextRequest, NextResponse } from "next/server";

export interface JobSearchParams {
  query: string;
  page?: number;
  num_pages?: number;
  employment_types?: string;
  remote_jobs_only?: boolean;
  date_posted?: string;
}

export interface Job {
  job_id: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  job_employment_type: string;
  job_title: string;
  job_apply_link: string;
  job_description: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_posted_at_datetime_utc?: string;
  job_is_remote: boolean;
  job_salary?: string;
  job_min_salary?: number;
  job_max_salary?: number;
}

export interface JobSearchResponse {
  status: string;
  data: Job[];
}

export async function POST(req: NextRequest) {
  try {
    const body: JobSearchParams = await req.json();
    const { 
      query, 
      page = 1, 
      employment_types,
      remote_jobs_only = false,
    } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required." },
        { status: 400 }
      );
    }

    const API_KEY = process.env.RAPID_API_KEY;
    
    console.log("=== LinkedIn Job Search API Request ===");
    console.log("API Key exists:", !!API_KEY);
    console.log("Search query:", query);
    
    if (!API_KEY) {
      console.error("RAPID_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "RAPID_API_KEY not configured. Please add it to your .env file and restart the server." },
        { status: 500 }
      );
    }

    // LinkedIn API parameters
    const offset = (page - 1) * 10;
    
    // Build query parameters for LinkedIn API
    const params = new URLSearchParams({
      keywords: query,
      location: "United States",
      offset: offset.toString(),
      description_type: "text",
    });

    // Add optional filters
    if (employment_types && employment_types !== "all") {
      params.append("job_type", employment_types);
    }

    if (remote_jobs_only) {
      params.append("remote", "true");
    }

    const url = `https://linkedin-job-search-api.p.rapidapi.com/active-jb-ih?${params.toString()}`;
    console.log("Request URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "linkedin-job-search-api.p.rapidapi.com",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      
      return NextResponse.json(
        { 
          error: `LinkedIn API error: ${response.status} - ${response.statusText}`,
          details: errorText,
          hint: "Check if your RapidAPI subscription is active and you have remaining API calls"
        },
        { status: response.status }
      );
    }

    const data: any = await response.json();
    console.log("Raw API response:", JSON.stringify(data).substring(0, 500));

    // Transform LinkedIn API response to match our Job interface
    let jobs: Job[] = [];
    
    if (data && Array.isArray(data)) {
      jobs = data.map((job: any, index: number) => ({
        job_id: job.id || job.job_id || `job-${index}`,
        employer_name: job.company || job.companyName || job.employer_name || "N/A",
        employer_logo: job.companyLogo || job.logo || job.employer_logo || undefined,
        employer_website: job.companyUrl || job.employer_website || undefined,
        job_employment_type: job.type || job.employmentType || job.job_type || job.job_employment_type || "FULLTIME",
        job_title: job.title || job.position || job.job_title || "Untitled Position",
        job_apply_link: job.url || job.link || job.applyUrl || job.apply_url || job.job_apply_link || "#",
        job_description: job.description || job.snippet || job.job_description || "",
        job_city: job.location?.city || job.city || job.job_city || undefined,
        job_state: job.location?.state || job.state || job.job_state || undefined,
        job_country: job.location?.country || job.country || job.job_country || undefined,
        job_posted_at_datetime_utc: job.postedDate || job.date || job.posted_at || job.job_posted_at_datetime_utc || undefined,
        job_is_remote: job.isRemote || job.remote || job.is_remote || job.job_is_remote || false,
        job_salary: job.salary || job.job_salary || undefined,
      }));
    } else if (data && data.data && Array.isArray(data.data)) {
      jobs = data.data.map((job: any, index: number) => ({
        job_id: job.id || job.job_id || `job-${index}`,
        employer_name: job.company || job.companyName || job.employer_name || "N/A",
        employer_logo: job.companyLogo || job.logo || job.employer_logo || undefined,
        employer_website: job.companyUrl || job.employer_website || undefined,
        job_employment_type: job.type || job.employmentType || job.job_type || job.job_employment_type || "FULLTIME",
        job_title: job.title || job.position || job.job_title || "Untitled Position",
        job_apply_link: job.url || job.link || job.applyUrl || job.apply_url || job.job_apply_link || "#",
        job_description: job.description || job.snippet || job.job_description || "",
        job_city: job.location?.city || job.city || job.job_city || undefined,
        job_state: job.location?.state || job.state || job.job_state || undefined,
        job_country: job.location?.country || job.country || job.job_country || undefined,
        job_posted_at_datetime_utc: job.postedDate || job.date || job.posted_at || job.job_posted_at_datetime_utc || undefined,
        job_is_remote: job.isRemote || job.remote || job.is_remote || job.job_is_remote || false,
        job_salary: job.salary || job.job_salary || undefined,
      }));
    } else if (data && data.jobs && Array.isArray(data.jobs)) {
      jobs = data.jobs.map((job: any, index: number) => ({
        job_id: job.id || job.job_id || `job-${index}`,
        employer_name: job.company || job.companyName || job.employer_name || "N/A",
        employer_logo: job.companyLogo || job.logo || job.employer_logo || undefined,
        employer_website: job.companyUrl || job.employer_website || undefined,
        job_employment_type: job.type || job.employmentType || job.job_type || job.job_employment_type || "FULLTIME",
        job_title: job.title || job.position || job.job_title || "Untitled Position",
        job_apply_link: job.url || job.link || job.applyUrl || job.apply_url || job.job_apply_link || "#",
        job_description: job.description || job.snippet || job.job_description || "",
        job_city: job.location?.city || job.city || job.job_city || undefined,
        job_state: job.location?.state || job.state || job.job_state || undefined,
        job_country: job.location?.country || job.country || job.job_country || undefined,
        job_posted_at_datetime_utc: job.postedDate || job.date || job.posted_at || job.job_posted_at_datetime_utc || undefined,
        job_is_remote: job.isRemote || job.remote || job.is_remote || job.job_is_remote || false,
        job_salary: job.salary || job.job_salary || undefined,
      }));
    }

    console.log("Jobs found:", jobs.length);

    return NextResponse.json({
      success: true,
      data: jobs,
      parameters: { query, page },
    });
  } catch (err: any) {
    console.error("=== Job Search Error ===");
    console.error("Error:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    
    return NextResponse.json(
      { 
        error: "Failed to search jobs.", 
        details: err.message,
        hint: "Check the server console logs for detailed error information"
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";
    const employment_types = searchParams.get("employment_types");
    const remote_jobs_only = searchParams.get("remote_jobs_only") === "true";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required." },
        { status: 400 }
      );
    }

    const API_KEY = process.env.RAPID_API_KEY;
    
    console.log("=== LinkedIn Job Search API GET Request ===");
    console.log("API Key exists:", !!API_KEY);
    console.log("Search query:", query);
    
    if (!API_KEY) {
      console.error("RAPID_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "RAPID_API_KEY not configured." },
        { status: 500 }
      );
    }

    const offset = (parseInt(page) - 1) * 10;
    
    // Build query parameters for LinkedIn API
    const params = new URLSearchParams({
      keywords: query,
      location: "United States",
      offset: offset.toString(),
      description_type: "text",
    });

    // Add optional filters
    if (employment_types && employment_types !== "all") {
      params.append("job_type", employment_types);
    }

    if (remote_jobs_only) {
      params.append("remote", "true");
    }

    const url = `https://linkedin-job-search-api.p.rapidapi.com/active-jb-ih?${params.toString()}`;
    console.log("Request URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "linkedin-job-search-api.p.rapidapi.com",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      
      return NextResponse.json(
        { 
          error: `LinkedIn API error: ${response.status} - ${response.statusText}`,
          details: errorText,
          hint: "Check if your RapidAPI subscription is active"
        },
        { status: response.status }
      );
    }

    const data: any = await response.json();
    console.log("Raw API response:", JSON.stringify(data).substring(0, 500));
    
    let jobs: Job[] = [];
    
    if (data && Array.isArray(data)) {
      jobs = data.map((job: any, index: number) => ({
        job_id: job.id || job.job_id || `job-${index}`,
        employer_name: job.company || job.companyName || job.employer_name || "N/A",
        employer_logo: job.companyLogo || job.logo || job.employer_logo || undefined,
        employer_website: job.companyUrl || job.employer_website || undefined,
        job_employment_type: job.type || job.employmentType || job.job_type || job.job_employment_type || "FULLTIME",
        job_title: job.title || job.position || job.job_title || "Untitled Position",
        job_apply_link: job.url || job.link || job.applyUrl || job.apply_url || job.job_apply_link || "#",
        job_description: job.description || job.snippet || job.job_description || "",
        job_city: job.location?.city || job.city || job.job_city || undefined,
        job_state: job.location?.state || job.state || job.job_state || undefined,
        job_country: job.location?.country || job.country || job.job_country || undefined,
        job_posted_at_datetime_utc: job.postedDate || job.date || job.posted_at || job.job_posted_at_datetime_utc || undefined,
        job_is_remote: job.isRemote || job.remote || job.is_remote || job.job_is_remote || false,
        job_salary: job.salary || job.job_salary || undefined,
      }));
    } else if (data && data.data && Array.isArray(data.data)) {
      jobs = data.data.map((job: any, index: number) => ({
        job_id: job.id || job.job_id || `job-${index}`,
        employer_name: job.company || job.companyName || job.employer_name || "N/A",
        employer_logo: job.companyLogo || job.logo || job.employer_logo || undefined,
        employer_website: job.companyUrl || job.employer_website || undefined,
        job_employment_type: job.type || job.employmentType || job.job_type || job.job_employment_type || "FULLTIME",
        job_title: job.title || job.position || job.job_title || "Untitled Position",
        job_apply_link: job.url || job.link || job.applyUrl || job.apply_url || job.job_apply_link || "#",
        job_description: job.description || job.snippet || job.job_description || "",
        job_city: job.location?.city || job.city || job.job_city || undefined,
        job_state: job.location?.state || job.state || job.job_state || undefined,
        job_country: job.location?.country || job.country || job.job_country || undefined,
        job_posted_at_datetime_utc: job.postedDate || job.date || job.posted_at || job.job_posted_at_datetime_utc || undefined,
        job_is_remote: job.isRemote || job.remote || job.is_remote || job.job_is_remote || false,
        job_salary: job.salary || job.job_salary || undefined,
      }));
    } else if (data && data.jobs && Array.isArray(data.jobs)) {
      jobs = data.jobs.map((job: any, index: number) => ({
        job_id: job.id || job.job_id || `job-${index}`,
        employer_name: job.company || job.companyName || job.employer_name || "N/A",
        employer_logo: job.companyLogo || job.logo || job.employer_logo || undefined,
        employer_website: job.companyUrl || job.employer_website || undefined,
        job_employment_type: job.type || job.employmentType || job.job_type || job.job_employment_type || "FULLTIME",
        job_title: job.title || job.position || job.job_title || "Untitled Position",
        job_apply_link: job.url || job.link || job.applyUrl || job.apply_url || job.job_apply_link || "#",
        job_description: job.description || job.snippet || job.job_description || "",
        job_city: job.location?.city || job.city || job.job_city || undefined,
        job_state: job.location?.state || job.state || job.job_state || undefined,
        job_country: job.location?.country || job.country || job.job_country || undefined,
        job_posted_at_datetime_utc: job.postedDate || job.date || job.posted_at || job.job_posted_at_datetime_utc || undefined,
        job_is_remote: job.isRemote || job.remote || job.is_remote || job.job_is_remote || false,
        job_salary: job.salary || job.job_salary || undefined,
      }));
    }

    console.log("Jobs found:", jobs.length);

    return NextResponse.json({
      success: true,
      data: jobs,
      parameters: { query, page },
    });
  } catch (err: any) {
    console.error("=== Job Search Error ===");
    console.error("Error:", err);
    console.error("Error message:", err.message);
    
    return NextResponse.json(
      { 
        error: "Failed to search jobs.", 
        details: err.message,
        hint: "Check the server console logs"
      },
      { status: 500 }
    );
  }
}
