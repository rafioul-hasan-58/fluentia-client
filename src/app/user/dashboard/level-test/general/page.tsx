import React from "react";
import { GeneralEnglishTestView } from "@/views/GeneralEnglishTestView";

export const metadata = {
  title: "General English Diagnostic Test | Fluentia Dashboard",
  description:
    "Complete the 40-question placement test to calculate your CEFR benchmark and calibrate your learning curriculum.",
};

export default function DashboardGeneralEnglishTestPage() {
  return <GeneralEnglishTestView />;
}
