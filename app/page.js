import BannerContainer from "@/components/banner/BannerContainer";
import ContactSection from "@/components/contact-section/ContactSection";
import AboutSection from "@/components/homepage/AboutSection";
import ClientSection from "@/components/homepage/ClientSection";
import ExpertiseSection from "@/components/homepage/ExpertiseSection";
import FinalCta from "@/components/homepage/FinalCta";
import ProductSection from "@/components/homepage/ProductSection";
import DepartmentPreview from "@/components/homepage/DepartmentPreview";
import PortfolioPreview from "@/components/homepage/PortfolioPreview";
import BoardOfDirectors from "@/components/team/BoardOfDirectors";
import WhatWeDo from "@/components/homepage/WhatWeDo";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import TestimonialsSlider from "@/components/TestimonialsSection";
import BasisBadge from "@/components/layouts/BasisBadge";
import SectionShell from "@/components/layouts/SectionShell";
import { pageSurface } from "@/lib/surfaces";

export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <BannerContainer
        heroSurface={pageSurface(0)}
        statsSurface={pageSurface(1)}
      />
      <div className={`${pageSurface(1)} pb-8`}>
        <SectionShell className="flex justify-center">
          <BasisBadge />
        </SectionShell>
      </div>
      <AboutSection surface={pageSurface(2)} />
      <WhyChooseUs surface={pageSurface(3)} />
      <WhatWeDo surface={pageSurface(4)} />
      <ExpertiseSection surface={pageSurface(5)} />
      <ProductSection surface={pageSurface(6)} />
      <PortfolioPreview surface={pageSurface(7)} />
      <TestimonialsSlider surface={pageSurface(8)} />
      <DepartmentPreview surface={pageSurface(9)} />
      <BoardOfDirectors surface={pageSurface(10)} />
      <ClientSection surface={pageSurface(11)} />
      <FinalCta surface={pageSurface(12)} />
      <ContactSection surface={pageSurface(13)} />
    </main>
  );
}
