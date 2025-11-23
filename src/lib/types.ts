
export type Topic = {
  id: string;
  name: string;
};

export type Chapter = {
  id: string;
  name: string;
  topics: Topic[];
};

export type Unit = {
  id: string;
  name: string;
  marks: number;
  chapters: Chapter[];
};

export type Subject = {
  id: string;
  name: string;
  units: Unit[];
};

export type Stream = {
  id:string;
  name: string;
  subjects: Subject[];
};

export type Syllabus = Stream[];
