import { ExamForm } from "@/components/tests/exam-form";
import { Suspense } from "react";

export default function WrittenExamPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-6">
        Written Exams
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ExamForm />
      </Suspense>
    </div>
  );
}
