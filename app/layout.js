import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "RightTech — The right tech, without the headache",
  description:
    "A 3-minute quiz that gives UK SME owner-managers a personal shortlist of software — with a 90-day plan and total monthly cost up front.",
  metadataBase: new URL("https://righttech.online"),
  openGraph: {
    title: "RightTech — The right tech, without the headache",
    description:
      "A 3-minute quiz that gives UK SME owner-managers a personal shortlist of software — with a 90-day plan and total monthly cost up front.",
    url: "https://righttech.online",
    siteName: "RightTech",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className="font-sans antialiased text-slate-900">{children}</body>
    </html>
  );
}