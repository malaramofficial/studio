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
  // Regex to find lines starting with "Question", "Q.", "Q#", or just a number followed by a period/parenthesis.
  const questions = examContent.split('\n').filter(line => /^\s*(question|q)?\s*#?\s*\d+[\.\)]?\s+/i.test(line.trim()));
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
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <p className="font-semibold whitespace-pre-wrap">{question}</p>
                  <Textarea
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="अपना उत्तर यहाँ लिखें..."
                    className="min-h-[100px] text-base"
                    disabled={isSubmitting}
                  />
                </div>
              ))
            ) : (
                <div className="text-center text-muted-foreground p-8">
                    <p className="mb-4">माफ़ कीजिए, उत्पन्न किए गए परीक्षा-पत्र से प्रश्नों को निकाला नहीं जा सका।</p>
                    <p>यह एक अस्थायी समस्या हो सकती है। कृपया एक नई परीक्षा उत्पन्न करने का प्रयास करें।</p>
                </div>
            )}
          </div>
          {questions.length > 0 && (
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
          )}
        </form>
      </CardContent>
    </Card>
  );
}
