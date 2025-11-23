"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { syllabus } from "@/lib/syllabus";
import type { Stream, Subject, Chapter } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { generateWrittenExam, evaluateWrittenExam } from "@/lib/test-actions";
import { TestInterface } from "./test-interface";
import { EvaluationDisplay } from "./evaluation-display";
import type { EvaluateWrittenExamOutput } from "@/ai/flows/evaluate-written-exam";

const formSchema = z.object({
  streamId: z.string().min(1, "Please select a stream."),
  subjectId: z.string().min(1, "Please select a subject."),
  chapterId: z.string().min(1, "Please select a chapter."),
});

type FormValues = z.infer<typeof formSchema>;

export function TestGenerationForm() {
  const [isPending, startTransition] = useTransition();
  const [examContent, setExamContent] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluateWrittenExamOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streamId: syllabus[0].id,
      subjectId: syllabus[0].subjects[0].id,
      chapterId: syllabus[0].subjects[0].chapters[0].id,
    },
  });

  const streamId = form.watch("streamId");
  const subjectId = form.watch("subjectId");

  const selectedStream = syllabus.find((s) => s.id === streamId);
  const selectedSubject = selectedStream?.subjects.find(
    (s) => s.id === subjectId
  );

  const handleStreamChange = (streamId: string) => {
    form.setValue("streamId", streamId);
    const firstSubject = syllabus.find((s) => s.id === streamId)?.subjects[0];
    if (firstSubject) {
      form.setValue("subjectId", firstSubject.id);
      form.setValue("chapterId", firstSubject.chapters[0]?.id || "");
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    form.setValue("subjectId", subjectId);
    const subject = selectedStream?.subjects.find((s) => s.id === subjectId);
    form.setValue("chapterId", subject?.chapters[0]?.id || "");
  };

  function onSubmit(values: FormValues) {
    const subject = selectedSubject?.name;
    const chapter = selectedSubject?.chapters.find(
      (c) => c.id === values.chapterId
    )?.name;

    if (!subject || !chapter) return;

    startTransition(async () => {
      const content = await generateWrittenExam({
        subject,
        chapters: [chapter],
        marks: 20, // Default marks for now
        durationMinutes: 45, // Default duration
      });
      setExamContent(content);
    });
  }

  const handleTestSubmit = (answers: { [key: string]: string }) => {
    if (!examContent) return;

    // Simple parsing of questions from the exam content
    const questions = examContent.split('\n').filter(line => /^\d+\./.test(line.trim()));
    const answerValues = Object.values(answers);

    startTransition(async () => {
      const result = await evaluateWrittenExam({
        questions,
        answers: answerValues
      });
      setEvaluation(result);
    });
  }

  const handleRetry = () => {
    setExamContent(null);
    setEvaluation(null);
    form.reset();
  }

  if (evaluation) {
    return <EvaluationDisplay evaluation={evaluation} onRetry={handleRetry} />;
  }

  if (examContent) {
    return (
      <TestInterface
        examContent={examContent}
        isSubmitting={isPending}
        onSubmit={handleTestSubmit}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="streamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stream</FormLabel>
                <Select
                  onValueChange={handleStreamChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a stream" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {syllabus.map((stream: Stream) => (
                      <SelectItem key={stream.id} value={stream.id}>
                        {stream.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={handleSubjectChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedStream?.subjects.map((subject: Subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chapterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapter</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a chapter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedSubject?.chapters.map((chapter: Chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormDescription>
          Select a stream, subject, and chapter to generate a practice exam.
        </FormDescription>
        <Button type="submit" disabled={isPending} size="lg">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Exam
        </Button>
      </form>
    </Form>
  );
}
