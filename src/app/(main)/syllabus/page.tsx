import { SyllabusBrowser } from "@/components/syllabus/syllabus-browser";

export default function SyllabusPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-6">
        RBSE Syllabus Explorer
      </h1>
      <SyllabusBrowser />
    </div>
  );
}
