import { useState } from "react";
import IntroLoader from "./components/IntroLoader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import AllWorks from "./components/AllWorks";
import Works from "./components/Works";
import Experience from "./components/Experience";
import Strengths from "./components/Strengths";
import Contact from "./components/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      {loading && <IntroLoader onDone={() => setLoading(false)} />}
      <Navbar />
      <main>
        <Hero ready={!loading} />
        <About />
        <AllWorks />
        <Works />
        <Experience />
        <Strengths />
        <Contact />
      </main>
    </>
  );
}
