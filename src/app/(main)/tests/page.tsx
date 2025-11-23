import { TestGenerationForm } from "@/components/tests/test-generation-form";
import { Suspense } from "react";

export default function TestsPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-6">
        Written Exams
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TestGenerationForm />
      </Suspense>
    </div>
  );
}