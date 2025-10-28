import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers"; // only global providers like next-auth, react-hot-toast
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HireAI",
  description: "AI-Powered Resume Builder - Create professional resumes with artificial intelligence",
  icons: {
    icon: [
      { url: "favicon.ico" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
