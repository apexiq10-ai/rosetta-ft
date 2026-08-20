import type { Metadata } from "next";
import {
  Archivo,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import ComplianceFooter from "@/src/components/ComplianceFooter";
import NavPill from "@/src/components/NavPill";
import { SourceProvider } from "@/src/components/SourceDrawer";
import { masterNarrative } from "@/src/content/content";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  // Unreleased concept work naming a real public company: keep it out of
  // search results rather than relying on the URL staying unknown.
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${archivo.variable} ${plexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas font-body text-ink">
        <SourceProvider>
          {children}
          <NavPill />
          <ComplianceFooter />
        </SourceProvider>
      </body>
    </html>
  );
}
