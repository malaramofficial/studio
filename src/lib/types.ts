export type Topic = {
  id: string;
  name: string;
};

export type Chapter = {
  id: string;
  name: string;
  topics: Topic[];
};

export type Subject = {
  id: string;
  name: string;
  chapters: Chapter[];
};

export type Stream = {
  id: string;
  name: string;
  subjects: Subject[];
};

export type Syllabus = Stream[];
