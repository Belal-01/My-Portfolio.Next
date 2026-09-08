import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import Skills from '@/components/Skills';
import Certificates from '@/components/Certificates';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <Hero />
      <AboutMe />
      <Skills />
      <Certificates />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
}
