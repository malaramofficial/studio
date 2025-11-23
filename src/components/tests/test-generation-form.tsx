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
import type { Stream, Subject, Unit, Chapter } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { generateWrittenExam, evaluateWrittenExam } from "@/lib/test-actions";
import { TestInterface } from "./test-interface";
import { EvaluationDisplay } from "./evaluation-display";
import type { EvaluateWrittenExamOutput, EvaluateWrittenExamInput } from "@/ai/flows/evaluate-written-exam";
import type { GenerateWrittenExamOutput } from "@/ai/flows/generate-written-exam";

const formSchema = z.object({
  streamId: z.string().min(1, "Please select a stream."),
  subjectId: z.string().min(1, "Please select a subject."),
  unitId: z.string().optional(),
  chapterId: z.string().optional(),
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
      unitId: "",
      chapterId: "",
    },
  });

  useEffect(() => {
    const stream = searchParams.get('stream');
    const subject = searchParams.get('subject');
    const unit = searchParams.get('unit');
    const chapter = searchParams.get('chapter');
    
    if (stream) form.setValue("streamId", stream);
    if (subject) form.setValue("subjectId", subject);
    if (unit) form.setValue("unitId", unit);
    if (chapter) form.setValue("chapterId", chapter);
  }, [searchParams, form]);

  const streamId = form.watch("streamId");
  const subjectId = form.watch("subjectId");
  const unitId = form.watch("unitId");

  const selectedStream = syllabus.find((s) => s.id === streamId);
  const selectedSubject = selectedStream?.subjects.find(
    (s) => s.id === subjectId
  );
  const selectedUnit = selectedSubject?.units.find(
    u => u.id === unitId
  );

  const handleStreamChange = (streamId: string) => {
    form.setValue("streamId", streamId);
    const firstSubject = syllabus.find((s) => s.id === streamId)?.subjects[0];
    if (firstSubject) {
      form.setValue("subjectId", firstSubject.id);
      form.setValue("unitId", firstSubject.units[0]?.id || "");
      form.setValue("chapterId", "");
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    form.setValue("subjectId", subjectId);
    const subject = selectedStream?.subjects.find((s) => s.id === subjectId);
    form.setValue("unitId", subject?.units[0]?.id || "");
    form.setValue("chapterId", "");
  };

  const handleUnitChange = (unitId: string) => {
    form.setValue("unitId", unitId);
    form.setValue("chapterId", "");
  }

  function onSubmit(values: FormValues) {
    const subject = selectedSubject?.name;
    let chapters: string[] = [];

    if (values.chapterId && values.chapterId !== "all") {
        const chapter = selectedUnit?.chapters.find(c => c.id === values.chapterId)?.name;
        if(chapter) chapters.push(chapter);
    } else if (values.unitId) {
        const unit = selectedSubject?.units.find(u => u.id === values.unitId);
        if(unit) {
            chapters = unit.chapters.map(c => c.name).length > 0 ? unit.chapters.map(c => c.name) : [unit.name];
        }
    }

    if (!subject || chapters.length === 0) return;

    startTransition(async () => {
      const generatedExam = await generateWrittenExam({
        subject,
        chapters: chapters,
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
      unitId: "",
      chapterId: "",
    });
  }

  if (evaluation) {
    return <EvaluationDisplay evaluation={evaluation} onRetry={handleRetry} />;
  }

  if (examOutput) {
    const questionsText = examOutput.exam.questions.map(q => q.question);
    return (
      <TestInterface
        questions={questionsText}
        isSubmitting={isPending}
        onSubmit={handleTestSubmit}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={handleUnitChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedSubject?.units.map((unit: Unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
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
                <FormLabel>Chapter (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!unitId || !selectedUnit || selectedUnit.chapters.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="All Chapters in Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All Chapters in Unit</SelectItem>
                    {selectedUnit?.chapters.map((chapter: Chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Leave blank or select all to test the whole unit.</FormDescription>
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
