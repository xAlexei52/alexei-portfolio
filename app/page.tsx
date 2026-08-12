import BackgroundVideo from "@/components/BackgroundVideo";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import StatsFooter from "@/components/StatsFooter";

export default function Home() {
  return (
    <>
      <BackgroundVideo />

      <div className="page">
        <SiteNav />
        <Hero />
        <StatsFooter />
      </div>
    </>
  );
}
