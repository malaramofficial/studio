import { TestFlow } from "@/components/tests/test-flow";

export default function WrittenExamPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold text-foreground">
          AI Written Exam
        </h1>
        <p className="text-muted-foreground">
          Generate, take, and get feedback on an exam created by AI.
        </p>
      </div>
      <TestFlow />
    </div>
  );
}
