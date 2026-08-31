import React from "react";
import {
  Navbar,
  Hero,
  Features,
  CallToAction,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans selection:bg-jade-light selection:text-jade-dark">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
