'use client';

import { useState } from 'react';
import { syllabus } from '@/lib/syllabus';
import type { Stream, Subject, Unit, Chapter } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCopy, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function SyllabusBrowser() {
  const [selectedStreamId, setSelectedStreamId] = useState<string>(
    syllabus[0].id
  );
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    syllabus[0].subjects[0].id
  );

  const selectedStream = syllabus.find((s) => s.id === selectedStreamId);
  
  const handleStreamChange = (streamId: string) => {
    setSelectedStreamId(streamId);
    const firstSubjectId = syllabus.find((s) => s.id === streamId)
      ?.subjects[0].id;
    if (firstSubjectId) {
      setSelectedSubjectId(firstSubjectId);
    }
  };

  const selectedSubject = selectedStream?.subjects.find(
    (s) => s.id === selectedSubjectId
  );

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
        <h2 className="font-headline text-2xl font-bold mb-4">Units and Chapters</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {selectedSubject?.units.map((unit: Unit, unitIndex: number) => (
            <AccordionItem value={`item-${unit.id}`} key={unit.id} className="bg-card rounded-2xl shadow-lg border-b-0">
              <AccordionTrigger className="p-6 text-lg font-headline hover:no-underline">
                <div className="flex justify-between w-full items-center">
                    <span>Unit {unitIndex + 1}: {unit.name}</span>
                    <span className="text-sm font-medium text-muted-foreground mr-4">Marks: {unit.marks}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                {unit.chapters.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {unit.chapters.map((chapter: Chapter, chapterIndex: number) => (
                      <Card key={chapter.id} className="rounded-xl flex flex-col bg-background/50">
                        <CardHeader>
                          <CardTitle className="font-headline text-primary">
                            Chapter {chapterIndex + 1}
                          </CardTitle>
                          <CardDescription className="text-base font-semibold pt-1 text-foreground">
                            {chapter.name}
                          </CardDescription>
                        </CardHeader>
                        {chapter.topics.length > 0 && (
                          <CardContent className='flex-grow'>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                              {chapter.topics.slice(0, 2).map((topic) => (
                                <li key={topic.id}>{topic.name}</li>
                              ))}
                              {chapter.topics.length > 2 && <li>and more...</li>}
                            </ul>
                          </CardContent>
                        )}
                        <CardFooter className="flex gap-2">
                          <Button asChild className="w-full" size="sm">
                              <Link href={`/ai?topic=${encodeURIComponent(chapter.name)}`}>
                                  <BookCopy className="mr-2 h-4 w-4" />
                                  Start
                              </Link>
                          </Button>
                          <Button asChild variant="secondary" className="w-full" size="sm">
                              <Link href={`/tests?chapter=${chapter.id}`}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Test
                              </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground'>No specific chapters listed for this unit. You can still generate a test for the whole unit.</p>
                )}
                 <Button asChild variant="ghost" className="mt-4 text-primary hover:text-primary">
                    <Link href={`/tests?unit=${unit.id}&subject=${selectedSubjectId}&stream=${selectedStreamId}`}>
                      Test this Unit <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
