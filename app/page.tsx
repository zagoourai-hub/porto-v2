import AboutMe from "./section/about/AboutMe";
import Hero from "./section/hero/Hero";
import TechStack from "./section/techstack/TechStack";
import Timeline from "./section/timeline/Timeline";
import Work from "./section/work/Work";
import Contact from "./section/contact/Contact";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
        <Hero />
        <AboutMe />
        <TechStack />
        <Timeline />
        <Work />
        <Contact />
    </main>
  );
}
