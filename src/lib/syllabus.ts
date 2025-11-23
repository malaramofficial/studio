import type { Syllabus } from './types';

export const syllabus: Syllabus = [
  {
    id: 'science',
    name: 'Science',
    subjects: [
      {
        id: 'physics',
        name: 'Physics',
        chapters: [
          {
            id: 'ch1',
            name: 'विद्युत आवेश तथा क्षेत्र',
            topics: [
              { id: 't1', name: 'विद्युत आवेश' },
              { id: 't2', name: 'चालक तथा विद्युतरोधी' },
              { id: 't3', name: 'कूलॉम का नियम' },
            ],
          },
          {
            id: 'ch2',
            name: 'स्थिरविद्युत विभव तथा धारिता',
            topics: [
              { id: 't1', name: 'स्थिरविद्युत विभव' },
              { id: 't2', name: 'संधारित्र तथा धारिता' },
            ],
          },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        chapters: [
          {
            id: 'ch1',
            name: 'विलयन',
            topics: [{ id: 't1', name: 'विलयनों के प्रकार' }],
          },
        ],
      },
      {
        id: 'maths',
        name: 'Maths',
        chapters: [
          {
            id: 'ch1',
            name: 'संबंध एवं फलन',
            topics: [{ id: 't1', name: 'फलनों के प्रकार' }],
          },
        ],
      },
    ],
  },
  {
    id: 'arts',
    name: 'Arts',
    subjects: [
      {
        id: 'history',
        name: 'History',
        chapters: [
          {
            id: 'ch1',
            name: 'ईंटें, मनके तथा अस्थियाँ',
            topics: [{ id: 't1', name: 'हड़प्पा सभ्यता' }],
          },
        ],
      },
      {
        id: 'hindi-literature',
        name: 'Hindi Literature',
        chapters: [
            { id: 'ch1', name: 'जयशंकर प्रसाद', topics: [] },
            { id: 'ch2', name: 'सूर्यकांत त्रिपाठी ‘निराला’', topics: [] },
        ]
      }
    ],
  },
];
