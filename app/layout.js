import { Inter } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Project Board",
  description: "Web App to manage task of project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
