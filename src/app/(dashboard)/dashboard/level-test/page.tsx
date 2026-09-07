import React from "react";
import { LevelTestSelectionView } from "@/views/LevelTestSelectionView";

export const metadata = {
  title: "English Level Assessment | Fluentia Dashboard",
  description:
    "Choose between the General English Diagnostic Test and IELTS Benchmark Assessment to calibrate your personalized AI coaching curriculum.",
};

export default function DashboardLevelTestPage() {
  return <LevelTestSelectionView />;
}
