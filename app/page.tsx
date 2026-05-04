import { Navbar } from "@/components/navbar";
import { HeroDesktop } from "@/components/landingpage/hero-desktop";
import { HeroMobile } from "@/components/landingpage/hero-mobile";
import { ExploreMyWork } from "@/components/landingpage/exploremywork";
import { AboutMe } from "@/components/landingpage/aboutme";
import { ExperienceSection } from "@/components/landingpage/experience";
import { ContactSection } from "@/components/landingpage/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen pt-14">
        <div className="flex flex-col flex-1 items-center justify-center">
          <main className="w-full">
            <div className="hidden md:flex items-center justify-center w-full h-full">
              <HeroDesktop />
            </div>
            <div className="flex md:hidden items-center justify-center w-full h-full">
              <HeroMobile />
            </div>
            <ExploreMyWork />
            <AboutMe />
            <ExperienceSection />
            <ContactSection />
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
