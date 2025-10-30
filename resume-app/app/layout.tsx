import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers"; // only global providers like next-auth, react-hot-toast
import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireAI",
  description: "AI-Powered Resume Builder - Create professional resumes with artificial intelligence",
  icons: {
    // Use an existing SVG from public to avoid dynamic favicon route issues
    icon: "favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
