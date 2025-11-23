"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";

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
import type { Stream, Subject } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { generateWrittenExam, evaluateWrittenExam } from "@/lib/test-actions";
import { TestInterface } from "./test-interface";
import { EvaluationDisplay } from "./evaluation-display";
import type { EvaluateWrittenExamOutput, EvaluateWrittenExamInput } from "@/ai/flows/evaluate-written-exam";
import type { GenerateWrittenExamOutput } from "@/ai/flows/generate-written-exam";

const formSchema = z.object({
  streamId: z.string().min(1, "Please select a stream."),
  subjectId: z.string().min(1, "Please select a subject."),
});

type FormValues = z.infer<typeof formSchema>;

export function TestGenerationForm() {
  const [isPending, startTransition] = useTransition();
  const [examOutput, setExamOutput] = useState<GenerateWrittenExamOutput | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluateWrittenExamOutput | null>(null);
  const searchParams = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streamId: syllabus[0].id,
      subjectId: syllabus[0].subjects[0].id,
    },
  });

  useEffect(() => {
    const stream = searchParams.get('stream');
    const subject = searchParams.get('subject');
    
    if (stream) form.setValue("streamId", stream);
    if (subject) form.setValue("subjectId", subject);
  }, [searchParams, form]);

  const streamId = form.watch("streamId");

  const selectedStream = syllabus.find((s) => s.id === streamId);
  
  const handleStreamChange = (streamId: string) => {
    form.setValue("streamId", streamId);
    const firstSubject = syllabus.find((s) => s.id === streamId)?.subjects[0];
    if (firstSubject) {
      form.setValue("subjectId", firstSubject.id);
    }
  };

  function onSubmit(values: FormValues) {
    const subject = selectedStream?.subjects.find(s => s.id === values.subjectId)?.name;
    
    if (!subject) {
        console.error("Subject not found.");
        // Optionally, show an error to the user
        return;
    }

    startTransition(async () => {
      const generatedExam = await generateWrittenExam({
        subject,
        chapters: [], // Chapters are now determined by the AI based on the subject
        marks: 20,
        durationMinutes: 45,
      });
      setExamOutput(generatedExam);
    });
  }

  const handleTestSubmit = (answers: { [key: string]: string }) => {
    if (!examOutput) return;
    
    const questionsText = examOutput.exam.questions.map(q => q.question);
    const answerValues = Object.values(answers);

    const evaluationInput: EvaluateWrittenExamInput = {
        questions: questionsText,
        answers: answerValues
    };

    startTransition(async () => {
      const result = await evaluateWrittenExam(evaluationInput);
      setEvaluation(result);
    });
  }

  const handleRetry = () => {
    setExamOutput(null);
    setEvaluation(null);
    form.reset({
      streamId: syllabus[0].id,
      subjectId: syllabus[0].subjects[0].id,
    });
  }

  if (evaluation) {
    return <EvaluationDisplay evaluation={evaluation} onRetry={handleRetry} />;
  }

  if (examOutput) {
    return (
      <TestInterface
        questions={examOutput.exam.questions.map(q => q.question)}
        isSubmitting={isPending}
        onSubmit={handleTestSubmit}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <p className="text-muted-foreground">
          Select a subject and our AI will generate a balanced test paper for you based on the RBSE syllabus.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="streamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stream</FormLabel>
                <Select
                  onValueChange={handleStreamChange}
                  value={field.value}
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
                  onValueChange={field.onChange}
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
        </div>
        <Button type="submit" disabled={isPending} size="lg">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Exam
        </Button>
      </form>
    </Form>
  );
}
