import { Conditions } from "@/components/conditions";
import { Contact } from "@/components/contact";
import { Doctor } from "@/components/doctor";
import { EtsExplainer } from "@/components/ets-explainer";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { Learn } from "@/components/learn";
import { Locations } from "@/components/locations";
import { MiraDry } from "@/components/miradry";
import { Pricing } from "@/components/pricing";
import { SiteNav } from "@/components/site-nav";
import { Treatments } from "@/components/treatments";
import { Trust } from "@/components/trust";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <Conditions />
        <Doctor />
        <Treatments />
        <EtsExplainer />
        <MiraDry />
        <Journey />
        <Trust />
        <Pricing />
        <Faq />
        <Learn />
        <Locations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
