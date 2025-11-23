// components/WrittenExamClient.tsx
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

type Question = { id: string; section: string; marks: number; questionText: string, type: 'long' | 'short' | 'mcq', options?: string[] };

export default function WrittenExamClient() {
  const [stream, setStream] = useState("Science");
  const [subject, setSubject] = useState("Physics");
  const [chaptersInput, setChaptersInput] = useState("Modern Physics");
  const [duration, setDuration] = useState(120);
  const [exam, setExam] = useState<{ examId: string; title: string; durationMinutes: number; totalMarks: number; questions: Question[] } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [timer, setTimer] = useState<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingEvaluate, setLoadingEvaluate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // generate exam
  const generateExam = async () => {
    setLoadingGenerate(true);
    setError(null);
    setExam(null);
    try {
        const res = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            stream, subject, chapters: chaptersInput.split(',').map(s => s.trim()), durationMinutes: duration, totalMarks: 100
        })
        });
        const data = await res.json();
        if (data.ok && data.exam?.questions?.length > 0) {
            setExam(data.exam);
            setCurrentIndex(0);
            setAnswers({});
            setSubmitted(false);
            setResult(null);
            const seconds = data.exam.durationMinutes * 60;
            setTimer(seconds);
        } else {
            throw new Error(data.error || 'Failed to generate exam or exam has no questions.');
        }
    } catch(e) {
        setError(e instanceof Error ? e.message : String(e));
    } finally {
        setLoadingGenerate(false);
    }
  };

  // countdown effect
  useEffect(() => {
    if (timer === null || submitted) {
        if(timerIdRef.current) clearInterval(timerIdRef.current);
        return;
    }
    
    timerIdRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev === null) {
            if(timerIdRef.current) clearInterval(timerIdRef.current);
            return null;
        }
        if (prev <= 1) {
          if(timerIdRef.current) clearInterval(timerIdRef.current);
          handleSubmit(true); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
        if(timerIdRef.current) clearInterval(timerIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, submitted]);

  const handleAnswerChange = (qid: string, text: string) => {
    setAnswers(prev => ({ ...prev, [qid]: text }));
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!exam || submitted) return;
    if (!isAutoSubmit) {
        const confirmSubmit = confirm('क्या आप निश्चित रूप से पेपर सबमिट करना चाहते हैं? सबमिट करने के बाद उत्तर लॉक हो जाएंगे।');
        if (!confirmSubmit) return;
    }
    setLoadingEvaluate(true);
    setError(null);
    const payload = {
      examId: exam.examId,
      questions: exam.questions.map(q => ({ id: q.id, questionText: q.questionText, maxMarks: q.marks })),
      answers: exam.questions.map(q => ({ id: q.id, answerText: answers[q.id] || "" })),
      studentInfo: { name: "Guest" }
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
            setSubmitted(true);
            setTimer(null);
        } else {
            throw new Error(data.error || 'Evaluation failed');
        }
    } catch(e) {
         setError(e instanceof Error ? e.message : String(e));
    } finally {
        setLoadingEvaluate(false);
    }
  };
  
  const resetExam = () => {
      setExam(null);
      setResult(null);
      setSubmitted(false);
      setError(null);
      setLoadingGenerate(false);
      setLoadingEvaluate(false);
      setTimer(null);
      if(timerIdRef.current) clearInterval(timerIdRef.current);
  }

  if (!exam && !loadingGenerate && !result) {
    return (
      <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Stream</label>
               <Select value={stream} onValueChange={setStream}>
                <SelectTrigger className="w-full">
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
                <label className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                <Input value={subject} onChange={e=>setSubject(e.target.value)} />
            </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Chapters (comma separated)</label>
                <Input value={chaptersInput} onChange={e=>setChaptersInput(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Duration (minutes)</label>
                <Input type="number" value={duration} onChange={e=>setDuration(Number(e.target.value))} />
            </div>

            <div className="mt-4 flex gap-2">
                <Button onClick={generateExam} disabled={loadingGenerate}>
                {loadingGenerate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Exam
                </Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">Error: {error}</div>}
            </div>
          </CardContent>
      </Card>
    );
  }
  
  if (loadingGenerate) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-2xl shadow-lg">
            <Loader2 className="mr-2 h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold">Generating your exam...</p>
            <p className="text-muted-foreground">Please wait, this may take a moment.</p>
        </div>
      )
  }

  const q = exam?.questions[currentIndex];
  const minutes = timer ? Math.floor(timer/60) : 0;
  const seconds = timer ? timer%60 : 0;

  return (
    <div className="space-y-4">
      {exam && !submitted && q && (
      <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
            <div>
                <div className="text-sm text-muted-foreground">{exam.title}</div>
                <div className="font-semibold">Question {currentIndex + 1} / {exam.questions.length}</div>
            </div>
            <div className="text-sm text-center">
                <div>Time left</div>
                <div className="text-xl font-mono text-primary">{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</div>
            </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-muted/50">
            <div className="text-xs text-muted-foreground">Section {q.section} • {q.marks} marks</div>
            <div className="mt-2 font-medium whitespace-pre-wrap">{q.questionText}</div>
            
            {q.type === 'mcq' && q.options ? (
                 <RadioGroup
                    value={answers[q.id] || ""}
                    onValueChange={(value) => handleAnswerChange(q.id, value)}
                    className="mt-4 space-y-2"
                    disabled={submitted}
                >
                    {q.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${q.id}-option-${index}`} />
                        <Label htmlFor={`${q.id}-option-${index}`}>{option}</Label>
                    </div>
                    ))}
                </RadioGroup>
            ) : (
                <Textarea
                    placeholder="अपना उत्तर यहाँ लिखें..."
                    value={answers[q.id] || ""}
                    onChange={(e)=>handleAnswerChange(q.id, e.target.value)}
                    className="w-full mt-3 text-base min-h-[140px]"
                    disabled={submitted}
                />
            )}
            </div>

            <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
                <Button onClick={()=>setCurrentIndex(i=>Math.max(0,i-1))} variant="outline">Previous</Button>
                <Button onClick={()=>setCurrentIndex(i=>Math.min(exam.questions.length - 1, i+1))}>Next</Button>
            </div>
            <div>
                <Button onClick={() => handleSubmit(false)} disabled={loadingEvaluate || submitted} variant="destructive">
                {loadingEvaluate ? 'Submitting...' : 'Submit Exam'}
                </Button>
            </div>
            </div>
        </CardContent>
      </Card>
      )}

      {(submitted || loadingEvaluate) && (
          <Card>
              <CardContent className="p-6">
                {loadingEvaluate &&  <div className="flex flex-col items-center justify-center text-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary mb-4" /><p>Evaluating...</p></div>}
                {error && <div className="text-red-500 text-sm mt-2">Error: {error}</div>}
                {result && (
                <div>
                    <h2 className="text-2xl font-bold text-primary mb-4">Marksheet</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="text-sm text-muted-foreground">Total Score</div>
                            <div className="text-2xl font-bold">{result.totalScore} / {result.perQuestion.reduce((s:any,p:any)=>s+p.maxMarks,0)}</div>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="text-sm text-muted-foreground">Percentage</div>
                            <div className="text-2xl font-bold">{result.percentage}%</div>
                        </div>
                    </div>
                    
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold mb-1">Overall Advice</h3>
                        <p className="text-sm text-muted-foreground">{result.improvementAdvice || result.overallAdvice}</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">Per-question Feedback</h3>
                        {result.perQuestion.map((pq:any, index: number)=>(
                        <div key={pq.id || index} className="p-3 rounded-lg bg-muted/50">
                            <div className="text-sm font-semibold mb-1">Question {index + 1}</div>
                            <div className="font-medium">Marks Obtained: {pq.marksObtained} / {pq.maxMarks}</div>
                            <div className="text-xs mt-2 text-muted-foreground"><span className="font-semibold">Feedback: </span>{pq.feedback}</div>
                        </div>
                        ))}
                    </div>
                    <Button onClick={resetExam} className="mt-6 w-full">Take Another Exam</Button>
                </div>
                )}
              </CardContent>
          </Card>
      )}
    </div>
  );
}
