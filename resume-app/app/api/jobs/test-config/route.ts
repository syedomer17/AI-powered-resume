import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.RAPID_API_KEY;
  
  return NextResponse.json({
    rapidApiKeyConfigured: !!API_KEY,
    rapidApiKeyLength: API_KEY?.length || 0,
    rapidApiKeyPreview: API_KEY ? `${API_KEY.substring(0, 8)}...` : "Not set",
    allEnvVars: Object.keys(process.env).filter(key => 
      key.includes("RAPID") || key.includes("API")
    ),
  });
}
