"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

type GenerationFormProps = {
  isGenerating: boolean;
  onGenerate: (subject: string) => void;
};

const subjects = [
    "Physics", "Chemistry", "Biology", "Mathematics", 
    "History", "Geography", "Political Science",
    "Accountancy", "Business Studies", "Economics",
    "Hindi", "English"
];


export function GenerationForm({ isGenerating, onGenerate }: GenerationFormProps) {
  const [subject, setSubject] = useState("Physics");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(subject);
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Generate Your Exam</CardTitle>
        <CardDescription>
          Select a subject to generate a 5-question exam paper.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject-select" className="text-sm font-medium text-muted-foreground">Subject</label>
            <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject-select" className="w-full rounded-xl h-12 text-base mt-1">
                    <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                    {subjects.map((s) => (
                        <SelectItem key={s} value={s} className='text-base'>{s}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Generate Exam"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
