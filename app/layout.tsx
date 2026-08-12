import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL at deploy time so Open Graph URLs are absolute.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: `${SITE.name} — ${SITE.role}`,
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    type: "profile",
    locale: "es_MX",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE.name}, ${SITE.role}`,
      },
    ],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: SITE.role,
  email: `mailto:${SITE.email}`,
  url: SITE.github,
  sameAs: [SITE.github],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Zapopan",
    addressRegion: "Jalisco",
    addressCountry: "MX",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidad Tecnológica de Jalisco",
  },
  knowsAbout: [
    "AWS Lambda",
    "Amazon Bedrock",
    "Arquitectura serverless",
    "Angular",
    "React",
    "Node.js",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://db.onlinewebfonts.com" />
        {/* Root layout head applies to every route; the pages/_document rule
            does not apply to the App Router. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos"
          rel="stylesheet"
        />
        <link rel="preload" href="/fonts/GeistPixel-Circle.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
