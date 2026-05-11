import { FeaturesSection } from "@/components/organisms/features-section"
import { HeroSection } from "@/components/organisms/hero-section"
import { SiteFooter } from "@/components/organisms/site-footer"
import { SiteHeader } from "@/components/organisms/site-header"
import { WorkflowSection } from "@/components/organisms/workflow-section"

export function HomeTemplate() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
      </main>
      <SiteFooter />
    </>
  )
}
