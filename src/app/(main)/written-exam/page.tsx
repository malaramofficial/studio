import dynamic from "next/dynamic";
const WrittenExamClient = dynamic(() => import("../../../components/WrittenExamClient"), { ssr: false });

export default function Page() {
  return (
    <div className="w-full">
      <h1 className="font-headline text-3xl font-bold text-foreground mb-6">Written Exams</h1>
      <WrittenExamClient />
    </div>
  );
}
