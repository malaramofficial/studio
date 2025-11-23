'use client';

import { useState } from 'react';
import { syllabus } from '@/lib/syllabus';
import type { Stream, Subject, Chapter } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCopy, FileText } from 'lucide-react';
import Link from 'next/link';

export function SyllabusBrowser() {
  const [selectedStreamId, setSelectedStreamId] = useState<string>(
    syllabus[0].id
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    syllabus[0].subjects[0].id
  );

  const selectedStream = syllabus.find((s) => s.id === selectedStreamId);
  const selectedSubject = selectedStream?.subjects.find(
    (s) => s.id === selectedSubjectId
  );

  const handleStreamChange = (streamId: string) => {
    setSelectedStreamId(streamId);
    const firstSubjectId = syllabus.find((s) => s.id === streamId)
      ?.subjects[0].id;
    if (firstSubjectId) {
      setSelectedSubjectId(firstSubjectId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <label className="text-sm font-medium text-muted-foreground">
            Stream
          </label>
          <Select value={selectedStreamId} onValueChange={handleStreamChange}>
            <SelectTrigger className="w-full rounded-xl h-12 text-base">
              <SelectValue placeholder="Select a stream" />
            </SelectTrigger>
            <SelectContent>
              {syllabus.map((stream: Stream) => (
                <SelectItem key={stream.id} value={stream.id} className='text-base'>
                  {stream.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-64">
          <label className="text-sm font-medium text-muted-foreground">
            Subject
          </label>
          <Select
            value={selectedSubjectId}
            onValueChange={setSelectedSubjectId}
          >
            <SelectTrigger className="w-full rounded-xl h-12 text-base">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {selectedStream?.subjects.map((subject: Subject) => (
                <SelectItem key={subject.id} value={subject.id} className='text-base'>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">अध्याय (Chapters)</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {selectedSubject?.chapters.map((chapter: Chapter, index: number) => (
            <Card key={chapter.id} className="rounded-2xl shadow-lg flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-primary">
                  अध्याय {index + 1}
                </CardTitle>
                <CardDescription className="text-lg font-semibold pt-1 text-foreground">
                  {chapter.name}
                </CardDescription>
              </CardHeader>
              <CardContent className='flex-grow'>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {chapter.topics.slice(0, 2).map((topic) => (
                    <li key={topic.id}>{topic.name}</li>
                  ))}
                  {chapter.topics.length > 2 && <li>और भी...</li>}
                </ul>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild className="w-full">
                    <Link href={`/ai?topic=${chapter.name}`}>
                        <BookCopy className="mr-2 h-4 w-4" />
                        पढ़ना शुरू करें
                    </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                    <Link href={`/tests?chapter=${chapter.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        टेस्ट दें
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
