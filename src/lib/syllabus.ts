import type { Syllabus } from './types';

export const syllabus: Syllabus = [
  {
    id: 'compulsory',
    name: 'Compulsory',
    subjects: [
      {
        id: 'hindi-compulsory',
        name: 'हिन्दी अनिवार्य',
        units: [
          {
            id: 'u1',
            name: 'अपठित बोध',
            marks: 12,
            chapters: [],
          },
          {
            id: 'u2',
            name: 'रचनात्मक लेखन',
            marks: 16,
            chapters: [],
          },
          {
            id: 'u3',
            name: 'व्यावहारिक व्याकरण',
            marks: 8,
            chapters: [],
          },
          {
            id: 'u4',
            name: 'पाठ्यपुस्तक - आरोह (भाग-2)',
            marks: 32,
            chapters: [
                {id: 'c1', name: 'पद्य', topics: []},
                {id: 'c2', name: 'गद्य', topics: []}
            ],
          },
          {
            id: 'u5',
            name: 'पाठ्यपुस्तक - वितान (भाग-2)',
            marks: 12,
            chapters: [],
          },
        ],
      },
      {
        id: 'english-compulsory',
        name: 'English Compulsory',
        units: [
          {
            id: 'u1',
            name: 'Reading (Unseen Passage)',
            marks: 15,
            chapters: [],
          },
          {
            id: 'u2',
            name: 'Writing',
            marks: 15,
            chapters: [],
          },
          {
            id: 'u3',
            name: 'Grammar',
            marks: 8,
            chapters: [],
          },
          {
            id: 'u4',
            name: 'Textbook - Flamingo',
            marks: 28,
            chapters: [
                {id: 'c1', name: 'Prose', topics: []},
                {id: 'c2', name: 'Poetry', topics: []}
            ],
          },
          {
            id: 'u5',
            name: 'Textbook - Vistas',
            marks: 14,
            chapters: [],
          },
        ],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    subjects: [
      {
        id: 'physics',
        name: 'Physics',
        units: [
          { id: 'u1', name: 'Electrostatics', marks: 7, chapters: [
            { id: 'ch1', name: 'Electric Charges and Fields', topics: [] },
            { id: 'ch2', name: 'Electrostatic Potential and Capacitance', topics: [] },
          ] },
          { id: 'u2', name: 'Current Electricity', marks: 5, chapters: [{ id: 'ch3', name: 'Current Electricity', topics: [] }] },
          { id: 'u3', name: 'Magnetic Effects of Current and Magnetism', marks: 7, chapters: [
            { id: 'ch4', name: 'Moving Charges and Magnetism', topics: [] },
            { id: 'ch5', name: 'Magnetism and Matter', topics: [] },
          ] },
          { id: 'u4', name: 'Electromagnetic Induction and Alternating Current', marks: 7, chapters: [
            { id: 'ch6', name: 'Electromagnetic Induction', topics: [] },
            { id: 'ch7', name: 'Alternating Current', topics: [] },
          ] },
          { id: 'u5', name: 'Electromagnetic Waves', marks: 3, chapters: [{ id: 'ch8', name: 'Electromagnetic Waves', topics: [] }] },
          { id: 'u6', name: 'Optics', marks: 13, chapters: [
            { id: 'ch9', name: 'Ray Optics and Optical Instruments', topics: [] },
            { id: 'ch10', name: 'Wave Optics', topics: [] },
          ] },
          { id: 'u7', name: 'Dual Nature of Radiation and Matter', marks: 5, chapters: [{ id: 'ch11', name: 'Dual Nature of Radiation and Matter', topics: [] }] },
          { id: 'u8', name: 'Atoms and Nuclei', marks: 7, chapters: [
            { id: 'ch12', name: 'Atoms', topics: [] },
            { id: 'ch13', name: 'Nuclei', topics: [] },
          ] },
          { id: 'u9', name: 'Electronic Devices', marks: 7, chapters: [{ id: 'ch14', name: 'Semiconductor Electronics', topics: [] }] },
        ],
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        units: [
            { id: 'u1', name: 'Solutions', marks: 7, chapters: [{id: 'ch1', name: 'Solutions', topics: []}]},
            { id: 'u2', name: 'Electrochemistry', marks: 9, chapters: [{id: 'ch2', name: 'Electrochemistry', topics: []}]},
            { id: 'u3', name: 'Chemical Kinetics', marks: 7, chapters: [{id: 'ch3', name: 'Chemical Kinetics', topics: []}]},
            { id: 'u4', name: 'd- and f-Block Elements', marks: 7, chapters: [{id: 'ch4', name: 'd- and f-Block Elements', topics: []}]},
            { id: 'u5', name: 'Coordination Compounds', marks: 7, chapters: [{id: 'ch5', name: 'Coordination Compounds', topics: []}]},
            { id: 'u6', name: 'Haloalkanes and Haloarenes', marks: 7, chapters: [{id: 'ch6', name: 'Haloalkanes and Haloarenes', topics: []}]},
            { id: 'u7', name: 'Alcohols, Phenols and Ethers', marks: 7, chapters: [{id: 'ch7', name: 'Alcohols, Phenols and Ethers', topics: []}]},
            { id: 'u8', name: 'Aldehydes, Ketones and Carboxylic Acids', marks: 9, chapters: [{id: 'ch8', name: 'Aldehydes, Ketones and Carboxylic Acids', topics: []}]},
            { id: 'u9', name: 'Amines', marks: 7, chapters: [{id: 'ch9', name: 'Amines', topics: []}]},
            { id: 'u10', name: 'Biomolecules', marks: 7, chapters: [{id: 'ch10', name: 'Biomolecules', topics: []}]},
        ],
      },
      {
        id: 'maths',
        name: 'Mathematics',
        units: [
            { id: 'u1', name: 'Relations and Functions', marks: 8, chapters: [{id: 'ch1', name: 'Relations and Functions', topics: []}, {id: 'ch2', name: 'Inverse Trigonometric Functions', topics: []}]},
            { id: 'u2', name: 'Algebra', marks: 10, chapters: [{id: 'ch3', name: 'Matrices', topics: []}, {id: 'ch4', name: 'Determinants', topics: []}]},
            { id: 'u3', name: 'Calculus', marks: 35, chapters: [{id: 'ch5', name: 'Continuity and Differentiability', topics: []}, {id: 'ch6', name: 'Application of Derivatives', topics: []}, {id: 'ch7', name: 'Integrals', topics: []}, {id: 'ch8', name: 'Application of Integrals', topics: []}, {id: 'ch9', name: 'Differential Equations', topics: []}]},
            { id: 'u4', name: 'Vectors and Three-Dimensional Geometry', marks: 14, chapters: [{id: 'ch10', name: 'Vectors', topics: []}, {id: 'ch11', name: 'Three-Dimensional Geometry', topics: []}]},
            { id: 'u5', name: 'Linear Programming', marks: 6, chapters: [{id: 'ch12', name: 'Linear Programming', topics: []}]},
            { id: 'u6', name: 'Probability', marks: 7, chapters: [{id: 'ch13', name: 'Probability', topics: []}]},
        ],
      },
      {
        id: 'biology',
        name: 'Biology',
        units: [
            { id: 'u1', name: 'Reproduction', marks: 14, chapters: [{id: 'ch1', name: 'Sexual Reproduction in Flowering Plants', topics: []}, {id: 'ch2', name: 'Human Reproduction', topics: []}, {id: 'ch3', name: 'Reproductive Health', topics: []}] },
            { id: 'u2', name: 'Genetics and Evolution', marks: 18, chapters: [{id: 'ch4', name: 'Principles of Inheritance and Variation', topics: []}, {id: 'ch5', name: 'Molecular Basis of Inheritance', topics: []}, {id: 'ch6', name: 'Evolution', topics: []}] },
            { id: 'u3', name: 'Biology and Human Welfare', marks: 14, chapters: [{id: 'ch7', name: 'Human Health and Disease', topics: []}, {id: 'ch8', name: 'Microbes in Human Welfare', topics: []}] },
            { id: 'u4', name: 'Biotechnology and its Applications', marks: 10, chapters: [{id: 'ch9', name: 'Biotechnology: Principles and Processes', topics: []}, {id: 'ch10', name: 'Biotechnology and its Applications', topics: []}] },
            { id: 'u5', name: 'Ecology and Environment', marks: 14, chapters: [{id: 'ch11', name: 'Organisms and Populations', topics: []}, {id: 'ch12', name: 'Ecosystem', topics: []}, {id: 'ch13', name: 'Biodiversity and Conservation', topics: []}] },
        ],
      },
      {
        id: 'computer-science',
        name: 'Computer Science',
        units: [
          {id: 'u1', name: 'Programming and Computational Thinking', marks: 40, chapters: []},
          {id: 'u2', name: 'Computer Networks', marks: 15, chapters: []},
          {id: 'u3', name: 'Data Management', marks: 15, chapters: []},
        ]
      }
    ],
  },
  {
    id: 'commerce',
    name: 'Commerce',
    subjects: [
      {
        id: 'accountancy',
        name: 'Accountancy',
        units: [
          {id: 'u1', name: 'Accounting for Partnership Firms and Companies', marks: 60, chapters: []},
          {id: 'u2', name: 'Financial Statement Analysis', marks: 20, chapters: []},
        ]
      },
      {
        id: 'business-studies',
        name: 'Business Studies',
        units: [
          {id: 'u1', name: 'Principles and Functions of Management', marks: 50, chapters: []},
          {id: 'u2', name: 'Business Finance and Marketing', marks: 30, chapters: []},
        ]
      },
      {
        id: 'economics',
        name: 'Economics',
        units: [
          {id: 'u1', name: 'Introductory Macroeconomics', marks: 40, chapters: []},
          {id: 'u2', name: 'Indian Economic Development', marks: 40, chapters: []},
        ]
      },
      {
        id: 'entrepreneurship',
        name: 'Entrepreneurship',
        units: [
          { id: 'u1', name: 'Entrepreneurial Opportunity', marks: 15, chapters: [] },
          { id: 'u2', name: 'Entrepreneurial Planning', marks: 20, chapters: [] },
          { id: 'u3', name: 'Enterprise Marketing', marks: 20, chapters: [] },
          { id: 'u4', name: 'Enterprise Growth Strategies', marks: 15, chapters: [] },
        ],
      },
      {
        id: 'informatics-practices',
        name: 'Informatics Practices',
        units: [
          { id: 'u1', name: 'Data Handling using Pandas and Data Visualization', marks: 30, chapters: [] },
          { id: 'u2', name: 'Database Query using SQL', marks: 25, chapters: [] },
          { id: 'u3', name: 'Introduction to Computer Networks', marks: 15, chapters: [] },
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
        units: [
            {id: 'u1', name: 'Themes in Indian History Part-I', marks: 25, chapters: []},
            {id: 'u2', name: 'Themes in Indian History Part-II', marks: 25, chapters: []},
            {id: 'u3', name: 'Themes in Indian History Part-III', marks: 25, chapters: []},
            {id: 'u4', name: 'Map Work', marks: 5, chapters: []},
        ]
      },
      {
        id: 'geography',
        name: 'Geography',
        units: [
            {id: 'u1', name: 'Fundamentals of Human Geography', marks: 35, chapters: []},
            {id: 'u2', name: 'India: People and Economy', marks: 35, chapters: []},
        ]
      },
      {
        id: 'political-science',
        name: 'Political Science',
        units: [
            {id: 'u1', name: 'Contemporary World Politics', marks: 40, chapters: []},
            {id: 'u2', name: 'Politics in India Since Independence', marks: 40, chapters: []},
        ]
      },
      {
        id: 'sociology',
        name: 'Sociology',
        units: [
          {id: 'u1', name: 'Indian Society', marks: 40, chapters: []},
          {id: 'u2', name: 'Social Change and Development in India', marks: 40, chapters: []},
        ]
      },
      {
        id: 'psychology',
        name: 'Psychology',
        units: [
          {id: 'u1', name: 'Variations in Psychological Attributes', marks: 9, chapters: []},
          {id: 'u2', name: 'Self and Personality', marks: 10, chapters: []},
          {id: 'u3', name: 'Meeting Life Challenges', marks: 7, chapters: []},
          {id: 'u4', name: 'Psychological Disorders', marks: 10, chapters: []},
          {id: 'u5', name: 'Therapeutic Approaches', marks: 7, chapters: []},
          {id: 'u6', name: 'Attitude and Social Cognition', marks: 8, chapters: []},
          {id: 'u7', name: 'Social Influence and Group Processes', marks: 7, chapters: []},
        ]
      },
      {
        id: 'home-science',
        name: 'Home Science',
        units: [
            {id: 'u1', name: 'Work, Livelihood and Career', marks: 5, chapters: []},
            {id: 'u2', name: 'Nutrition, Food Science and Technology', marks: 23, chapters: []},
            {id: 'u3', name: 'Human Development and Family Studies', marks: 10, chapters: []},
            {id: 'u4', name: 'Fabric and Apparel', marks: 17, chapters: []},
            {id: 'u5', name: 'Resource Management', marks: 10, chapters: []},
            {id: 'u6', name: 'Communication and Extension', marks: 5, chapters: []},
        ]
      },
      {
        id: 'hindi-literature',
        name: 'Hindi Literature',
        units: [
            {id: 'u1', name: 'अपठित बोध', marks: 12, chapters: []},
            {id: 'u2', name: 'रचनात्मक लेखन', marks: 16, chapters: []},
            {id: 'u3', name: 'काव्यशास्त्र', marks: 8, chapters: []},
            {id: 'u4', name: 'पाठ्यपुस्तक - अंतरा (भाग-2)', marks: 32, chapters: []},
            {id: 'u5', name: 'पाठ्यपुस्तक - अंतराल (भाग-2)', marks: 12, chapters: []},
        ]
      },
      {
        id: 'english-literature',
        name: 'English Literature',
        units: [
            {id: 'u1', name: 'Reading (Unseen Passage & Poem)', marks: 16, chapters: []},
            {id: 'u2', name: 'Writing', marks: 16, chapters: []},
            {id: 'u3', name: 'Literary Terms', marks: 8, chapters: []},
            {id: 'u4', name: 'Textbook - Kaleidoscope', marks: 24, chapters: []},
            {id: 'u5', name: 'Fiction (A Tiger for Malgudi or The Financial Expert)', marks: 16, chapters: []}
        ]
      },
      {
        id: 'sanskrit-literature',
        name: 'Sanskrit Literature',
        units: [
          { id: 'u1', name: 'अपठित-अवबोधनम्', marks: 12, chapters: [] },
          { id: 'u2', name: 'रचनात्मक-कार्यम्', marks: 16, chapters: [] },
          { id: 'u3', name: 'पठित-अवबोधनम्', marks: 40, chapters: [] },
          { id: 'u4', name: 'सामान्यः संस्कृत-साहित्य-परिचयः', marks: 12, chapters: [] },
        ],
      },
      {
        id: 'physical-education',
        name: 'Physical Education',
        units: [
          { id: 'u1', name: 'Management of Sporting Events', marks: 9, chapters: [] },
          { id: 'u2', name: 'Children & Women in Sports', marks: 7, chapters: [] },
          { id: 'u3', name: 'Yoga as Preventive measure for Lifestyle Disease', marks: 8, chapters: [] },
          { id: 'u4', name: 'Physical Education & Sports for CWSN', marks: 8, chapters: [] },
          { id: 'u5', name: 'Sports & Nutrition', marks: 8, chapters: [] },
          { id: 'u6', name: 'Test & Measurement in Sports', marks: 9, chapters: [] },
          { id: 'u7', name: 'Physiology & Injuries in Sport', marks: 8, chapters: [] },
          { id: 'u8', name: 'Biomechanics & Sports', marks: 10, chapters: [] },
          { id: 'u9', name: 'Psychology & Sports', marks: 7, chapters: [] },
          { id: 'u10', name: 'Training in Sports', marks: 6, chapters: [] },
        ],
      },
      {
        id: 'music',
        name: 'Music',
        units: [
          { id: 'u1', name: 'History of Indian Music', marks: 15, chapters: [] },
          { id: 'u2', name: 'Theory of Music', marks: 25, chapters: [] },
          { id: 'u3', name: 'Practical & Composition', marks: 30, chapters: [] },
        ],
      },
    ],
  },
];
