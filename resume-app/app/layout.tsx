import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers"; // only global providers like next-auth, react-hot-toast

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
