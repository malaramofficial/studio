'use client';
import React, { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedExam } from "@/lib/genkit";

type Question = GeneratedExam['questions'][0];

type EvaluationResult = {
    perQuestion: { id: string; marksObtained: number; maxMarks: number; feedback: string }[];
    totalScore: number;
    percentage: number;
    improvementAdvice: string;
    weakAreas: string[];
};

export function WrittenExamClient() {
  const [stream, setStream] = useState("Science");
  const [subject, setSubject] = useState("Physics");
  const [chaptersInput, setChaptersInput] = useState(""); // Optional: user can specify chapters
  const [duration, setDuration] = useState(60);
  const [marks, setMarks] = useState(50);
  
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timer, setTimer] = useState<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingEvaluate, setLoadingEvaluate] = useState(false);
  
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };
  
  const generateExam = async () => {
    setLoadingGenerate(true);
    setExam(null);
    try {
      const res = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          chapters: chaptersInput ? chaptersInput.split(',').map(s => s.trim()) : [],
          durationMinutes: duration,
          marks: marks
        })
      });
      const data = await res.json();
      if (!data.ok || !data.exam?.questions?.length) {
        throw new Error(data.error || 'Failed to generate exam or exam has no questions.');
      }
      setExam(data.exam);
      setCurrentIndex(0);
      setAnswers({});
      setSubmitted(false);
      setResult(null);
      setTimer(data.exam.durationMinutes * 60);
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      toast({ variant: "destructive", title: "Exam Generation Failed", description: error });
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!exam || submitted) return;
    if (!isAutoSubmit) {
      const confirmSubmit = window.confirm('क्या आप निश्चित रूप से पेपर सबमिट करना चाहते हैं?');
      if (!confirmSubmit) return;
    }
    setLoadingEvaluate(true);
    setSubmitted(true);
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    setTimer(0);

    const payload = {
      examId: exam.examId,
      questions: exam.questions.map(q => ({ id: q.id, questionText: q.questionText, maxMarks: q.marks })),
      answers: exam.questions.map(q => ({ id: q.id, answerText: answers[q.id] || "" })),
    };
    try {
      const res = await fetch('/api/evaluate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        setResult(data.result);
        setTimer(null);
      } else {
        throw new Error(data.error || 'Evaluation failed');
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      toast({ variant: "destructive", title: "Evaluation Failed", description: error });
      setSubmitted(false); // Allow user to try again if evaluation fails
    } finally {
      setLoadingEvaluate(false);
    }
  };

  useEffect(() => {
    if (timer === null) {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      return;
    }

    timerIdRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (timerIdRef.current) clearInterval(timerIdRef.current);
          handleSubmit(true); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, submitted]);


  const resetExam = () => {
    setExam(null);
    setResult(null);
    setSubmitted(false);
    setLoadingGenerate(false);
    setLoadingEvaluate(false);
    setTimer(null);
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  };

  if (loadingGenerate) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-2xl shadow-lg">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold">AI is generating your exam...</p>
        <p className="text-muted-foreground">This may take a moment. Please wait.</p>
      </div>
    );
  }
  
  if (submitted && result) {
      return (
          <Card>
              <CardContent className="p-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary mb-4">Marksheet</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="text-sm text-muted-foreground">Total Score</div>
                            <div className="text-2xl font-bold">{result.totalScore} / {exam?.totalMarks}</div>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="text-sm text-muted-foreground">Percentage</div>
                            <div className="text-2xl font-bold">{result.percentage}%</div>
                        </div>
                    </div>
                    
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold mb-1">Overall Advice</h3>
                        <p className="text-sm text-muted-foreground">{result.improvementAdvice}</p>
                    </div>
                    
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold mb-1">Weak Areas</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                        {result.weakAreas.map((area: string) => <span key={area} className="px-2 py-1 bg-destructive/20 text-destructive-foreground rounded-md text-xs">{area}</span>)}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">Per-question Feedback</h3>
                        {result.perQuestion.map((pq: any, index: number)=>(
                        <div key={pq.id || index} className="p-3 rounded-lg bg-muted/50">
                            <div className="flex justify-between items-center mb-1">
                                <div className="text-sm font-semibold">Question {index + 1}</div>
                                <div className="font-medium">Marks: {pq.marksObtained} / {pq.maxMarks}</div>
                            </div>
                            <div className="text-xs mt-2 text-muted-foreground"><span className="font-semibold">Feedback: </span>{pq.feedback}</div>
                        </div>
                        ))}
                    </div>
                    <Button onClick={resetExam} className="mt-6 w-full">Take Another Exam</Button>
                </div>
              </CardContent>
          </Card>
      )
  }

  if (exam) {
    const q = exam.questions[currentIndex];
    const minutes = timer ? Math.floor(timer / 60) : 0;
    const seconds = timer ? timer % 60 : 0;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">{exam.title}</div>
              <div className="font-semibold">Question {currentIndex + 1} / {exam.questions.length}</div>
            </div>
            <div className="text-sm text-center">
              <div>Time left</div>
              <div className="text-xl font-mono text-primary">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-muted/50">
            <div className="text-xs text-muted-foreground">Marks: {q.marks}</div>
            <div className="mt-2 font-medium whitespace-pre-wrap">{q.questionText}</div>
            {q.type === 'mcq' && q.options ? (
              <RadioGroup value={answers[q.id] || ""} onValueChange={(value) => handleAnswerChange(q.id, value)} className="mt-4 space-y-2">
                {q.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${q.id}-option-${index}`} />
                    <Label htmlFor={`${q.id}-option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea placeholder="अपना उत्तर यहाँ लिखें..." value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className="w-full mt-3 text-base min-h-[140px]" />
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} variant="outline" disabled={currentIndex === 0}>Previous</Button>
              <Button onClick={() => setCurrentIndex(i => Math.min(exam.questions.length - 1, i + 1))} disabled={currentIndex === exam.questions.length - 1}>Next</Button>
            </div>
            <div>
              <Button onClick={() => handleSubmit(false)} disabled={loadingEvaluate} variant="destructive">
                {loadingEvaluate ? 'Submitting...' : 'Submit Exam'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stream-select">Stream</Label>
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger id="stream-select" className="w-full">
                  <SelectValue placeholder="Select Stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject-input">Subject</Label>
              <Input id="subject-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Physics"/>
            </div>
          </div>
          <div>
            <Label htmlFor="chapters-input">Chapters (optional, comma-separated)</Label>
            <Input id="chapters-input" value={chaptersInput} onChange={e => setChaptersInput(e.target.value)} placeholder="e.g., Modern Physics, Optics"/>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration-input">Duration (minutes)</Label>
              <Input id="duration-input" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="marks-input">Total Marks</Label>
              <Input id="marks-input" type="number" value={marks} onChange={e => setMarks(Number(e.target.value))} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={generateExam} disabled={loadingGenerate} className="w-full">
              {loadingGenerate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Exam Paper
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
