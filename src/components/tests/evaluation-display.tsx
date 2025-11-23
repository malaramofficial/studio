"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThumbsDown, ThumbsUp, RefreshCw } from "lucide-react";
import type { EvaluateWrittenExamOutput } from "@/ai/flows/evaluate-written-exam";

type EvaluationDisplayProps = {
  evaluation: EvaluateWrittenExamOutput;
  onRetry: () => void;
};

export function EvaluationDisplay({
  evaluation,
  onRetry,
}: EvaluationDisplayProps) {
  return (
    <div className="space-y-8">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">
            Marksheet
          </CardTitle>
          <CardDescription>
            Here is your detailed performance report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl">Total Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{evaluation.totalScore}</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl">Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-20 w-20 mx-auto">
                    <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36">
                        <circle className="stroke-current text-muted" strokeWidth="4" cx="18" cy="18" r="16" fill="transparent"></circle>
                        <circle
                            className="stroke-current text-primary"
                            strokeWidth="4"
                            strokeDasharray={`${evaluation.percentage}, 100`}
                            strokeLinecap="round"
                            cx="18"
                            cy="18"
                            r="16"
                            fill="transparent"
                            transform="rotate(-90 18 18)"
                        ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{evaluation.percentage}%</span>
                    </div>
                </div>
              </CardContent>
            </Card>
             <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{evaluation.perQuestion.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Improvement Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{evaluation.improvementAdvice}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Weak Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {evaluation.weakAreas.map((area, index) => (
                  <Badge key={index} variant="destructive">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Per-Question Feedback */}
          <div>
            <h3 className="font-headline text-2xl font-bold mb-4">
              Question-wise Feedback
            </h3>
            <div className="space-y-4">
              {evaluation.perQuestion.map((item, index) => (
                <Card key={index} className="rounded-xl">
                  <CardHeader>
                    <CardTitle>Question {index + 1}</CardTitle>
                     <p className="text-lg font-bold text-primary">{item.marks} Marks</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                        <ThumbsUp className="h-5 w-5 text-green-500 mt-1" />
                        <p>
                            <span className="font-semibold">Feedback: </span>{item.feedback}
                        </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onRetry} className="w-full" size="lg">
            <RefreshCw className="mr-2 h-5 w-5" />
            Take Another Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
