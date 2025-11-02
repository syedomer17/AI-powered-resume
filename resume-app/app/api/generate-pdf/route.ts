import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

// Ensure Node.js runtime (not Edge) and disable static optimization
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Build absolute URL based on the incoming request's origin
  const origin = req.nextUrl.origin;
  const resumeUrl = `${origin}/dashboard/resume/${userId}/${resumeId}/view`;

  try {
    // console.log(`Launching Puppeteer...`);
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    // console.log(`Setting viewport...`);
    await page.setViewport({ width: 1200, height: 800 });

  // console.log(`Navigating to: ${resumeUrl}`);
  await page.goto(resumeUrl, { waitUntil: "networkidle0" });

  // Use screen media for colors; we'll isolate the resume node manually
  await page.emulateMediaType("screen");

    // console.log(`Waiting for #print-area...`);
    await page.waitForSelector("#print-area", { timeout: 15000 });

    // Isolate only the printable node to avoid nav/headers or extra whitespace
    await page.evaluate(() => {
      const el = document.querySelector('#print-area') as HTMLElement | null;
      if (!el) return;
      const cloned = el.cloneNode(true) as HTMLElement;
      const body = document.body;
      body.innerHTML = '';
      body.appendChild(cloned);
      // Normalize basic layout to top-left and white background
      body.style.margin = '0';
      cloned.style.margin = '0';
      cloned.style.backgroundColor = '#ffffff';
      // Disable animations/transforms that could shift layout in print
      const style = document.createElement('style');
      style.textContent = `*{animation:none!important;transition:none!important;transform:none!important}`;
      document.head.appendChild(style);
    });

    // Ensure fonts are fully loaded before printing
    await page.evaluate(async () => {
      // @ts-ignore
      if (document?.fonts?.ready) {
        // @ts-ignore
        await (document as any).fonts.ready;
      }
      const root = document.getElementById("print-area");
      if (root) {
        (root as HTMLElement).style.backgroundColor = "#ffffff";
      }
    });

  // Optional debug screenshot (commented out in production)
  // await page.screenshot({ path: "/tmp/puppeteer-screenshot.png", fullPage: true });

    console.log(`Generating PDF...`);
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

  await browser.close();

  // Return the PDF buffer directly (simpler than streaming; avoids dev fetch issues)
  // Send as a raw buffer (cast for TS compatibility in Node runtime)
  return new NextResponse(pdfBuffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume-${resumeId}.pdf`,
      "Cache-Control": "no-store",
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
