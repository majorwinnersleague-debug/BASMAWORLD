import { Suspense } from "react";
import ScheduleContent from "./ScheduleContent";

export const metadata = {
  title: "Class Schedule — BASMA Academy",
  description: "View the full weekly class schedule, important dates, and calendar for BASMA Music Academy.",
};

export default function SchedulePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#050505" }} />}>
      <ScheduleContent />
    </Suspense>
  );
}
