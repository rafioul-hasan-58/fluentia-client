import React from "react";
import Link from "next/link";
import { CurvedUnderline } from "@/components/ui";

export function CallToAction() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-gradient-to-b from-purple-50/60 via-slate-50 to-purple-100/40 dark:from-[#090514] dark:via-[#0f0c20] dark:to-[#070510] border-y border-slate-200 dark:border-white/10 py-20 text-ink dark:text-white transition-colors duration-200"
    >
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-primary/10 dark:bg-purple-600/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-3xl mx-auto px-6 text-center space-y-6 relative z-10">
        <h3 className="font-bangla text-3xl sm:text-4xl lg:text-[40px] font-bold text-ink dark:text-white tracking-tight leading-[1.35]">
          আপনার English level{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 dark:from-purple-300 dark:via-fuchsia-300 dark:to-indigo-300">
              কতটা ভালো, জানেন?
            </span>
            <CurvedUnderline className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full" />
          </span>
        </h3>

        <p className="font-bangla text-ink-soft dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
          একটি short English Level Test দিন এবং আপনার বর্তমান level, strengths ও weaknesses সম্পর্কে clear ধারণা পান। এরপর আপনার level অনুযায়ী শুরু করুন structured learning journey।
        </p>

        <div className="pt-3">
          <Link
            href="/level-test"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:via-primary-dark hover:to-fuchsia-500 text-white font-bold text-base transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 dark:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-[1.03] active:scale-95"
          >
            <span>Take the Level Test</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
