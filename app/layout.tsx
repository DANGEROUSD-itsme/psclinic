import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Sans } from "next/font/google";

import { clinic, doctor, faqs } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const description =
  "Permanent treatment for excessive sweating of the hands, underarms and face. ETS keyhole surgery and miraDry in Perth, led by Harvard-trained cardiothoracic surgeon Dr Sanjay Sharma.";

export const metadata: Metadata = {
  metadataBase: new URL(clinic.url),
  title: {
    default: `${clinic.name} — Hyperhidrosis Treatment Perth`,
    template: `%s · ${clinic.name}`,
  },
  description,
  keywords: [
    "hyperhidrosis Perth",
    "excessive sweating treatment",
    "sweaty hands surgery",
    "ETS surgery Perth",
    "miraDry Perth",
    "palmar hyperhidrosis",
    "axillary hyperhidrosis",
    "craniofacial hyperhidrosis",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: clinic.url,
    siteName: clinic.name,
    title: `${clinic.name} — Hyperhidrosis Treatment Perth`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${clinic.name} — Hyperhidrosis Treatment Perth`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfbf9",
  colorScheme: "light",
};

/**
 * Structured data. A hyperhidrosis patient searching for help should see
 * the practice, the specialist and the procedures surfaced accurately —
 * this is the difference between a rich result and a bare blue link.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": `${clinic.url}/#clinic`,
      name: clinic.name,
      description,
      url: clinic.url,
      telephone: clinic.phone,
      email: clinic.email,
      medicalSpecialty: "Surgical",
      address: {
        "@type": "PostalAddress",
        streetAddress: clinic.address.suite,
        addressLocality: clinic.address.locality,
        addressRegion: clinic.address.region,
        postalCode: clinic.address.postcode,
        addressCountry: "AU",
      },
      openingHoursSpecification: clinic.openingHoursSpec.map((spec) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: spec.days,
        opens: spec.opens,
        closes: spec.closes,
      })),
      availableService: [
        {
          "@type": "MedicalProcedure",
          name: "Endoscopic Thoracic Sympathectomy (ETS)",
          procedureType: "https://schema.org/SurgicalProcedure",
        },
        {
          "@type": "MedicalProcedure",
          name: "miraDry",
          procedureType: "https://schema.org/NoninvasiveProcedure",
        },
      ],
    },
    {
      "@type": "Physician",
      "@id": `${clinic.url}/#physician`,
      name: doctor.name,
      medicalSpecialty: "Surgical",
      jobTitle: "Cardiothoracic Surgeon",
      worksFor: { "@id": `${clinic.url}/#clinic` },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "University of Western Australia" },
        { "@type": "CollegeOrUniversity", name: "Harvard Medical School" },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${clinic.url}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${instrument.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-clinical-700 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, build-time constant — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
