import type { Metadata } from "next";
import {
  DM_Sans,
  IBM_Plex_Mono,
  Instrument_Serif,
  Outfit,
} from "next/font/google";
import "./globals.css";
import ComplianceFooter from "@/src/components/ComplianceFooter";
import { SourceProvider } from "@/src/components/SourceDrawer";
import { masterNarrative } from "@/src/content/content";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: masterNarrative.eyebrow,
  description: masterNarrative.subhead,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${outfit.variable} ${dmSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas font-body text-ink">
        <SourceProvider>
          {children}
          <ComplianceFooter />
        </SourceProvider>
      </body>
    </html>
  );
}
