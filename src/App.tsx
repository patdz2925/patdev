import { lazy, Suspense, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileHeader, MobileMenu } from "./components/layout/MobileNav";
import { useActiveSection } from "./hooks/useActiveSection";
import { sectionIds } from "./data/navigation";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { Stats } from "./components/sections/Stats";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Education } from "./components/sections/Education";
import { CreativeWork } from "./components/sections/CreativeWork";
import { Organizations } from "./components/sections/Organizations";
import { Achievements } from "./components/sections/Achievements";
import { GithubStrip } from "./components/sections/GithubStrip";
import { Contact } from "./components/sections/Contact";

// Lazy: keeps supabase-js out of the initial bundle until chat opens.
const CommunityChat = lazy(() =>
  import("./components/chat/CommunityChat").then((m) => ({
    default: m.CommunityChat,
  }))
);

/**
 * Single-page portfolio. Section order mirrors the sidebar.
 * To add/remove a section: edit `sectionIds` + nav in src/data/navigation.ts
 * and mount/unmount the component below.
 */
export default function App() {
  const active = useActiveSection(sectionIds);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      {/* Page-wide halftone backdrop */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="halftone halftone-wide mask-tr absolute right-0 top-0 h-[70vh] w-[65vw] opacity-[0.16]" />
        <div className="halftone mask-bl absolute bottom-0 left-0 h-[60vh] w-[55vw] opacity-[0.13]" />
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded focus:bg-neutral-900 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Sidebar active={active} onOpenChat={() => setChatOpen(true)} />
      <MobileHeader onOpen={() => setMenuOpen(true)} />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenChat={() => setChatOpen(true)}
      />
      <Suspense fallback={null}>
        <CommunityChat open={chatOpen} onClose={() => setChatOpen(false)} />
      </Suspense>

      <main id="main" className="relative z-10 lg:pl-60">
        <div className="mx-auto max-w-2xl px-6">
          <Hero />
          <Stats />

          <div aria-hidden="true" className="halftone halftone-wide mask-fade-x my-2 h-6 w-full opacity-[0.18]" />

          <About />
          <Projects />
          <Skills />
          <Experience />
          <Education />
          <CreativeWork />
          <Organizations />
          <Achievements />
          <GithubStrip />
          <Contact />
          <Footer />
        </div>
      </main>
    </div>
  );
}
