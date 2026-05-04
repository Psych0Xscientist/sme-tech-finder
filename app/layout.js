import { Inter } from "next/font/google";
import Script from "next/script";
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
      <body className="font-sans antialiased text-slate-900">
        {children}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wlwsb8n1ab");
          `}
        </Script>
      </body>
    </html>
  );
}