import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const resumeId = searchParams.get("resumeId");

  if (!userId || !resumeId) {
    return NextResponse.json(
      { error: "Missing userId or resumeId" },
      { status: 400 }
    );
  }

  // Make sure this URL works in your browser first
  const resumeUrl = `http://localhost:3000/dashboard/resume/${userId}/${resumeId}/view`;

  try {
    console.log(`Launching Puppeteer...`);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    console.log(`Setting viewport...`);
    await page.setViewport({ width: 1200, height: 800 });

    console.log(`Navigating to: ${resumeUrl}`);
    await page.goto(resumeUrl, { waitUntil: "networkidle0" });

    console.log(`Waiting for #print-area...`);
    await page.waitForSelector("#print-area", { timeout: 8000 });

    console.log(`Taking screenshot for debugging...`);
    await page.screenshot({
      path: "/tmp/puppeteer-screenshot.png",
      fullPage: true,
    });
    console.log(`Screenshot saved to /tmp/puppeteer-screenshot.png`);

    console.log(`Generating PDF...`);
     const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  const stream = Readable.from(pdfBuffer);

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume-${resumeId}.pdf`,
    },
  });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
