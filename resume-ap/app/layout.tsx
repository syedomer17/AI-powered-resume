import "./globals.css";
import { Providers } from "./providers"; // only global providers like next-auth, react-hot-toast

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
