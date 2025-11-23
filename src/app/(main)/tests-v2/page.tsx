import { TestGenerationFormV2 } from "@/components/tests/test-generation-form-v2";
import { Suspense } from "react";

export default function TestsPageV2() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-6">
        Written Exams
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TestGenerationFormV2 />
      </Suspense>
    </div>
  );
}
