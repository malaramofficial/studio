import { WrittenExamClient } from "@/components/WrittenExamClient";

export default function WrittenExamPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold text-foreground">
          AI Generated Exams
        </h1>
        <p className="text-muted-foreground">
          Select a subject and let our AI create a custom exam for you.
        </p>
      </div>
      <WrittenExamClient />
    </div>
  );
}
