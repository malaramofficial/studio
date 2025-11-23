"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { syllabus } from "@/lib/syllabus";
import type { Stream, Subject } from "@/lib/types";

type GenerationFormProps = {
  isGenerating: boolean;
  onGenerate: (subject: string) => void;
};

export function GenerationForm({ isGenerating, onGenerate }: GenerationFormProps) {
  const [streamId, setStreamId] = useState(syllabus[0].id);
  
  const selectedStream = syllabus.find(s => s.id === streamId) ?? syllabus[0];
  
  const [subjectId, setSubjectId] = useState(selectedStream.subjects[0].id);

  const handleStreamChange = (newStreamId: string) => {
    setStreamId(newStreamId);
    const newStream = syllabus.find(s => s.id === newStreamId);
    if (newStream && newStream.subjects.length > 0) {
      setSubjectId(newStream.subjects[0].id);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectName = selectedStream.subjects.find(s => s.id === subjectId)?.name;
    if (subjectName) {
      onGenerate(subjectName);
    } else {
        // Fallback or error
        console.error("Selected subject not found");
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Generate Your Exam</CardTitle>
        <CardDescription>
          Select a stream and subject to generate a 5-question exam paper.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="stream-select" className="text-sm font-medium text-muted-foreground">Stream</label>
                <Select value={streamId} onValueChange={handleStreamChange}>
                    <SelectTrigger id="stream-select" className="w-full rounded-xl h-12 text-base">
                        <SelectValue placeholder="Select a stream" />
                    </SelectTrigger>
                    <SelectContent>
                        {syllabus.map((stream: Stream) => (
                            <SelectItem key={stream.id} value={stream.id} className='text-base'>{stream.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label htmlFor="subject-select" className="text-sm font-medium text-muted-foreground">Subject</label>
                <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger id="subject-select" className="w-full rounded-xl h-12 text-base">
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedStream.subjects.map((subject: Subject) => (
                            <SelectItem key={subject.id} value={subject.id} className='text-base'>{subject.name}</SelectItem>
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
