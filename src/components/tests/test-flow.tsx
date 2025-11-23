"use client";

import { useState, useTransition } from "react";
import { generateWrittenExam } from "@/lib/test-actions-v2";
import { evaluateWrittenExam } from "@/lib/test-actions";
import { GenerationForm } from "@/components/tests/generation-form";
import { TestInterface } from "@/components/tests/test-interface";
import { EvaluationDisplay } from "@/components/tests/evaluation-display";
import type { EvaluateWrittenExamOutput } from "@/ai/flows/evaluate-written-exam";

export function TestFlow() {
  const [examState, setExamState] = useState<"generate" | "take" | "evaluate">(
    "generate"
  );
  const [questions, setQuestions] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [evaluation, setEvaluation] = useState<EvaluateWrittenExamOutput | null>(null);
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isEvaluating, startEvaluationTransition] = useTransition();

  const handleGenerate = (selectedSubject: string) => {
    setSubject(selectedSubject);
    startGenerationTransition(async () => {
      const result = await generateWrittenExam({ subject: selectedSubject });
      if (result && result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        setExamState("take");
      } else {
        // In a real app, show a toast notification
        console.error("Failed to generate exam or no questions were returned.");
      }
    });
  };

  const handleRegenerate = () => {
    if (!subject) return;
    startGenerationTransition(async () => {
      const result = await generateWrittenExam({ subject });
      if (result && result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        // Reset answers for the new questions
        setExamState("take"); 
      } else {
        console.error("Failed to regenerate exam.");
      }
    });
  }

  const handleSubmit = (answers: { [key: string]: string }) => {
    startEvaluationTransition(async () => {
      const answerList = questions.map((_, index) => answers[index] || "");
      const result = await evaluateWrittenExam({ questions, answers: answerList });
      setEvaluation(result);
      setExamState("evaluate");
    });
  };

  const handleRetry = () => {
    setQuestions([]);
    setEvaluation(null);
    setSubject("");
    setExamState("generate");
  };

  if (examState === "evaluate" && evaluation) {
    return <EvaluationDisplay evaluation={evaluation} onRetry={handleRetry} />;
  }

  if (examState === "take") {
    return (
      <TestInterface
        questions={questions}
        isSubmitting={isEvaluating || isGenerating}
        onSubmit={handleSubmit}
        onRegenerate={handleRegenerate}
        isRegenerating={isGenerating}
      />
    );
  }

  return (
    <GenerationForm isGenerating={isGenerating} onGenerate={handleGenerate} />
  );
}
