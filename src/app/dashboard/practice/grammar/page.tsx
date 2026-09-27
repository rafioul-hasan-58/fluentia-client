import { Metadata } from "next";
import { getSkills, GrammarPracticeSelector } from "@/features/practice/grammar";

export const metadata: Metadata = {
  title: "Grammar Practice | Fluentia",
  description:
    "Select a grammar skill and sub-skill to start targeted practice drills and accelerate your English accuracy.",
};

export default async function GrammarPracticePage() {
  const skills = await getSkills();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-300">
      <GrammarPracticeSelector skills={skills} />
    </main>
  );
}
