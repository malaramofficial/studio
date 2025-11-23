"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

type TestInterfaceProps = {
  examContent: string;
  isSubmitting: boolean;
  onSubmit: (answers: { [key: string]: string }) => void;
};

export function TestInterface({ examContent, isSubmitting, onSubmit }: TestInterfaceProps) {
  // Simple parsing of questions. Assumes questions start with a number and a dot.
  const questions = examContent.split('\n').filter(line => /^\d+\./.test(line.trim()));
  const [answers, setAnswers] = useState<{ [key: string]: string }>(
    questions.reduce((acc, _, index) => ({ ...acc, [index]: "" }), {})
  );

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Generated Exam</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <p className="font-semibold">{question}</p>
                <Textarea
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="अपना उत्तर यहाँ लिखें..."
                  className="min-h-[100px] text-base"
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>
          <CardFooter className="p-0">
            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit for Evaluation
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
