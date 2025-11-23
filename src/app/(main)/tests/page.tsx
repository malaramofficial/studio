import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TestsPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-6">
        Written Exams
      </h1>
      <Card className="rounded-2xl shadow-lg text-center h-96 flex flex-col justify-center items-center">
        <CardHeader>
            <div className="mx-auto bg-primary/20 text-primary rounded-full p-4 w-fit">
                <FileText className="h-12 w-12" />
            </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="font-headline text-2xl">Coming Soon</CardTitle>
          <CardDescription className="mt-2">
            The exam generation and evaluation feature is under development.
            <br />
            Stay tuned for updates!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
