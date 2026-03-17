import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Timeline from "../components/Timeline";
import Achievements from "../components/Achievements";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Services />
      <Projects />
      <Timeline />
      <Achievements />
      <Testimonials />
      <Stats />
      <Contact />
    </>
  );
}
