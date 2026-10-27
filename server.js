import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-Memory Database with realistic pre-seeded state
const database = {
  currentUser: {
    id: 'usr_angela',
    name: 'Angela Della',
    email: 'angela.della@codealpha.edu',
    role: 'Student Intern',
    avatar: '/src/assets/images/avatar_angela_student_1793111131958.jpg',
    status: 'online',
    totalCourses: 104,
    hoursStudied: 245.5,
    studyGoalWeekly: 20,
    notificationCount: 3,
    unreadMessagesCount: 2,
    favoriteCourses: ['course_uiux'],
  },
  otherUsers: [
    {
      id: 'usr_alex',
      name: 'Alex Morgan',
      email: 'alex.m@codealpha.edu',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      studyStreak: 14,
      currentCourse: 'UI/UX Design Fundamentals',
    },
    {
      id: 'usr_maya',
      name: 'Maya Lin',
      email: 'maya.lin@codealpha.edu',
      role: 'Design Lead Peer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'studying',
      studyStreak: 21,
      currentCourse: '3D Design and Creative Modeling',
    },
    {
      id: 'usr_david',
      name: 'David Kim',
      email: 'david.kim@codealpha.edu',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'offline',
      studyStreak: 8,
      currentCourse: 'JavaScript Programming Masterclass',
    },
  ],
  courses: [
    {
      id: 'course_uiux',
      title: 'Learn Ui Ux with ZHF Design Studio',
      category: 'Design',
      level: 'Intermediate',
      instructor: 'ZHF Studio & CodeAlpha',
      tutorialsCount: 35,
      dailyHours: '02:30 hours/Daily',
      nextClassTime: 'starting in 30 mins',
      nextClassMinutes: 30,
      thumbnail: '/src/assets/images/course_uiux_thumbnail_1793111130665.jpg',
      enrolled: true,
      baseProgress: 65,
      initialCompletedCount: 6,
      description: 'Master practical product design, visual hierarchy, mobile layout systems, wireframing, and interactive design token systems.',
      lessons: [
        { id: 'l_ui_1', title: 'Introduction to Modern User Interfaces & Atomic Design', duration: '18 min', completed: true },
        { id: 'l_ui_2', title: 'Figma Components, Auto-Layout & Design Tokens', duration: '24 min', completed: true },
        { id: 'l_ui_3', title: 'Color Theory: 60-30-10 Rule & WCAG Contrast Standards', duration: '20 min', completed: true },
        { id: 'l_ui_4', title: 'Typography Pairing, Hierarchy & Scale Ratios', duration: '22 min', completed: true },
        { id: 'l_ui_5', title: 'Wireframing Mobile Flows with Interactive Prototypes', duration: '35 min', completed: true },
        { id: 'l_ui_6', title: 'Card Architecture & Micro-Interactions', duration: '28 min', completed: true },
        { id: 'l_ui_7', title: 'Design Systems Documentation & Handoff', duration: '30 min', completed: false },
        { id: 'l_ui_8', title: 'Case Study Project: FinTech Dashboard Redesign', duration: '45 min', completed: false },
      ],
    },
    {
      id: 'course_3d',
      title: 'Structure Expert - Making Things Look 3D',
      category: '3D Art',
      level: 'All Levels',
      instructor: 'Studio Polygon',
      tutorialsCount: 120,
      dailyHours: '02:00 hours/Daily',
      nextClassTime: 'starting in 01:44 hour',
      nextClassMinutes: 104,
      thumbnail: '/src/assets/images/course_3d_geometry_thumbnail_1793111174505.jpg',
      enrolled: true,
      baseProgress: 30,
      initialCompletedCount: 3,
      description: 'Learn three-dimensional spatial thinking, geometric primitive sculpting, lighting physics, textures, and stylized render pipelines.',
      lessons: [
        { id: 'l_3d_1', title: 'Understanding Primitive Geometry: Cylinders, Arches & Spheres', duration: '25 min', completed: true },
        { id: 'l_3d_2', title: 'Three-Point Studio Lighting and Soft Shadows', duration: '30 min', completed: true },
        { id: 'l_3d_3', title: 'Material Texturing: Matte Clay vs Glossy Enamel', duration: '35 min', completed: true },
        { id: 'l_3d_4', title: 'Isometric Camera Composition & Framing', duration: '20 min', completed: false },
        { id: 'l_3d_5', title: 'Lighting Rigs and Environment HDRIs', duration: '32 min', completed: false },
        { id: 'l_3d_6', title: 'Exporting 3D Models for Web Graphics (glTF / OBJ)', duration: '40 min', completed: false },
      ],
    },
    {
      id: 'course_code',
      title: 'Learn Programming FAST! My Favorite Method!',
      category: 'Engineering',
      level: 'Advanced',
      instructor: 'CodeAlpha Senior Staff',
      tutorialsCount: 55,
      dailyHours: '03:00 hours/Daily',
      nextClassTime: 'starting in 22:24 hours',
      nextClassMinutes: 1344,
      thumbnail: '/src/assets/images/course_programming_laptop_thumbnail_1793111130618.jpg',
      enrolled: true,
      baseProgress: 88,
      initialCompletedCount: 7,
      description: 'High-leverage JavaScript, asynchronous event loops, API design, clean architecture, performance optimization, and full-stack integration.',
      lessons: [
        { id: 'l_js_1', title: 'JavaScript Execution Context & The Event Loop', duration: '25 min', completed: true },
        { id: 'l_js_2', title: 'Async/Await, Promises & Concurrency Control', duration: '30 min', completed: true },
        { id: 'l_js_3', title: 'Building RESTful APIs with Node.js & Express', duration: '40 min', completed: true },
        { id: 'l_js_4', title: 'State Management Patterns & Pure Functions', duration: '28 min', completed: true },
        { id: 'l_js_5', title: 'DOM Performance, Virtual Lists & Debouncing', duration: '22 min', completed: true },
        { id: 'l_js_6', title: 'Database Indexing & Query Optimization', duration: '35 min', completed: true },
        { id: 'l_js_7', title: 'WebSockets & Real-Time Event Dispatch', duration: '30 min', completed: true },
        { id: 'l_js_8', title: 'Production Security, CORS & JWT Auth', duration: '26 min', completed: false },
      ],
    },
    {
      id: 'course_fullstack',
      title: 'Modern Full-Stack Web Development Architecture',
      category: 'Engineering',
      level: 'Intermediate',
      instructor: 'CodeAlpha Core Team',
      tutorialsCount: 64,
      dailyHours: '02:15 hours/Daily',
      nextClassTime: 'starts tomorrow at 10:00 AM',
      nextClassMinutes: 1200,
      thumbnail: '/src/assets/images/course_programming_laptop_thumbnail_1793111130618.jpg',
      enrolled: false,
      description: 'End-to-end full stack engineering using Node.js, Express, React, client-side routing, and real-time backend synchronization.',
      lessons: [
        { id: 'l_fs_1', title: 'Client-Server Communication Protocols', duration: '20 min', completed: false },
        { id: 'l_fs_2', title: 'Express Routing & Middleware Architecture', duration: '30 min', completed: false },
        { id: 'l_fs_3', title: 'React 19 Hooks and Optimized Component Renders', duration: '35 min', completed: false },
      ],
    },
  ],
  exams: [
    {
      id: 'exam_uiux_midterm',
      title: 'UI/UX Visual Design & Layout Midterm',
      courseId: 'course_uiux',
      courseTitle: 'Learn Ui Ux with ZHF Design Studio',
      durationMinutes: 15,
      totalQuestions: 5,
      passingGrade: 6.0,
      startsInDays: 22,
      startsInHours: 8,
      startsInMinutes: 53,
      date: '2026-11-18',
      status: 'Available',
      questions: [
        {
          id: 'q1',
          question: 'In the 60-30-10 color rule, what role does the 10% accent color play?',
          options: [
            'Dominant canvas background',
            'Card surfaces and structural dividers',
            'High-intent focal actions like primary CTAs and active states',
            'Text typography and secondary captions'
          ],
          correctIndex: 2,
          explanation: '10% of the visual weight is reserved strictly for high-intent focal points such as primary buttons, active state indicators, and key highlights.'
        },
        {
          id: 'q2',
          question: 'What is the minimum WCAG AA contrast ratio required for standard body text?',
          options: [
            '2.5 : 1',
            '3.0 : 1',
            '4.5 : 1',
            '7.0 : 1'
          ],
          correctIndex: 2,
          explanation: 'WCAG AA requires a minimum contrast ratio of 4.5:1 for standard body text and 3:1 for large display text.'
        },
        {
          id: 'q3',
          question: 'According to nested radius math, if a container has outer radius 24px and padding 12px, what should the inner child radius be?',
          options: [
            '24px',
            '12px',
            '36px',
            '6px'
          ],
          correctIndex: 1,
          explanation: 'Inner radius = Outer radius - Padding. So 24px - 12px = 12px for visually concentric corners.'
        },
        {
          id: 'q4',
          question: 'Which CSS property should be animated for optimal 60fps performance without triggering browser layout thrashing?',
          options: [
            'width and height',
            'top and left',
            'transform and opacity',
            'margin and padding'
          ],
          correctIndex: 2,
          explanation: 'transform and opacity are handled directly by the GPU compositor without triggering reflow or repaint.'
        },
        {
          id: 'q5',
          question: 'What is the primary visual drawback of wrapping every metadata tag inside pill badges?',
          options: [
            'It slows down server requests',
            'It creates visual noise, reduces scanability and clutters the UI',
            'It forces fonts to render in italic',
            'It disables touch clicks'
          ],
          correctIndex: 1,
          explanation: 'Excessive pill enclosures create clutter and visual fatigue. Metadata is best displayed as quiet, unboxed text.'
        }
      ]
    },
    {
      id: 'exam_js_quiz',
      title: 'JavaScript Event Loop & Concurrency Assessment',
      courseId: 'course_code',
      courseTitle: 'Learn Programming FAST! My Favorite Method!',
      durationMinutes: 10,
      totalQuestions: 4,
      passingGrade: 7.0,
      startsInDays: 7,
      startsInHours: 4,
      startsInMinutes: 15,
      date: '2026-11-03',
      status: 'Available',
      questions: [
        {
          id: 'q_js1',
          question: 'Which queue handles Promise.then callbacks in the JavaScript event loop?',
          options: [
            'Macrotask queue',
            'Microtask queue',
            'Rendering queue',
            'Animation frame queue'
          ],
          correctIndex: 1,
          explanation: 'Promises execute on the microtask queue, which drains completely after the current execution context and before the next macrotask.'
        },
        {
          id: 'q_js2',
          question: 'What is the output of `typeof null` in standard JavaScript?',
          options: [
            '"null"',
            '"undefined"',
            '"object"',
            '"boolean"'
          ],
          correctIndex: 2,
          explanation: 'In JavaScript, typeof null returns "object" due to an original legacy implementation detail in JS.'
        },
        {
          id: 'q_js3',
          question: 'What does Object.freeze() do to a JavaScript object?',
          options: [
            'Deletes all properties',
            'Prevents extensions and marks existing properties as read-only and non-configurable',
            'Converts the object to JSON string',
            'Stores the object in localStorage'
          ],
          correctIndex: 1,
          explanation: 'Object.freeze() makes an object shallowly immutable; new properties cannot be added and existing properties cannot be modified or removed.'
        },
        {
          id: 'q_js4',
          question: 'Which method creates a new array with all elements that pass the test provided by a predicate function?',
          options: [
            'Array.prototype.map()',
            'Array.prototype.filter()',
            'Array.prototype.reduce()',
            'Array.prototype.forEach()'
          ],
          correctIndex: 1,
          explanation: 'filter() creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test function.'
        }
      ]
    }
  ],
  examHistory: [
    { id: 'att_1', month: 'Jan', examTitle: 'Design Principles Diagnostic', grade: 3.8, date: '2026-01-14' },
    { id: 'att_2', month: 'Feb', examTitle: 'Color & Contrast Standards', grade: 4.2, date: '2026-02-18' },
    { id: 'att_3', month: 'Mar', examTitle: 'Typography & Layout Systems', grade: 3.6, date: '2026-03-22' },
    { id: 'att_4', month: 'Apr', examTitle: 'UI Architecture & Wireframing', grade: 7.8, date: '2026-04-10', isPeak: true },
    { id: 'att_5', month: 'May', examTitle: '3D Geometric Foundations', grade: 4.8, date: '2026-05-15' },
    { id: 'att_6', month: 'Jun', examTitle: 'Lighting & Texturing Exam', grade: 3.7, date: '2026-06-20' },
    { id: 'att_7', month: 'Jul', examTitle: 'JavaScript Basics & Functions', grade: 4.2, date: '2026-07-25' },
    { id: 'att_8', month: 'Aug', examTitle: 'Asynchronous Code & APIs', grade: 4.6, date: '2026-08-14' },
    { id: 'att_9', month: 'Sep', examTitle: 'Full-Stack Integration Quiz', grade: 3.9, date: '2026-09-08' },
    { id: 'att_10', month: 'Oct', examTitle: 'Component Performance Sprint', grade: 2.2, date: '2026-10-12' },
    { id: 'att_11', month: 'Nov', examTitle: 'Design System Sprint Test', grade: 6.5, date: '2026-11-05' },
    { id: 'att_12', month: 'Dec', examTitle: 'Annual Capstone Evaluation', grade: 3.4, date: '2026-12-19' },
  ],
  assignments: [
    {
      id: 'asgn_1',
      title: 'Mobile Banking Wireframe & Flowchart',
      courseTitle: 'Learn Ui Ux with ZHF Design Studio',
      dueDate: '2026-11-02',
      status: 'Submitted',
      grade: '9.2 / 10',
      feedback: 'Excellent typographic hierarchy and clean card layouts!'
    },
    {
      id: 'asgn_2',
      title: '3D Geometric Arch & Cylinder Studio Scene',
      courseTitle: 'Structure Expert - Making Things Look 3D',
      dueDate: '2026-11-08',
      status: 'Pending',
      grade: null,
      feedback: null
    },
    {
      id: 'asgn_3',
      title: 'Async Event Emitter & Worker Pool in Node.js',
      courseTitle: 'Learn Programming FAST! My Favorite Method!',
      dueDate: '2026-11-12',
      status: 'Pending',
      grade: null,
      feedback: null
    }
  ],
  schedule: [
    { id: 'sc_1', day: 'Today', time: '14:30', course: 'Learn Ui Ux with ZHF Design Studio', topic: 'Design Systems & Handoff', type: 'Live Workshop', room: 'Studio Room B' },
    { id: 'sc_2', day: 'Tomorrow', time: '10:00', course: 'Structure Expert - Making Things Look 3D', topic: 'Soft Shadows & HDRI Lighting', type: 'Lab Session', room: 'Virtual Lab 4' },
    { id: 'sc_3', day: 'Friday', time: '16:00', course: 'Learn Programming FAST! My Favorite Method!', topic: 'Async JavaScript Masterclass', type: 'Lecture', room: 'Auditorium 1' },
    { id: 'sc_4', day: 'Nov 18', time: '09:00', course: 'All Courses', topic: 'UI/UX Visual Design & Layout Midterm', type: 'Exam', room: 'Exam Hall A' }
  ],
  messages: [
    { id: 'm1', senderId: 'usr_maya', senderName: 'Maya Lin', text: 'Hey Angela! Have you checked lesson 4 on 3D textures yet?', timestamp: '10:45 AM', isSelf: false },
    { id: 'm2', senderId: 'usr_angela', senderName: 'Angela Della', text: 'Yes, just completed it! The studio lighting section was super helpful.', timestamp: '10:48 AM', isSelf: true },
    { id: 'm3', senderId: 'usr_alex', senderName: 'Alex Morgan', text: 'Are you guys ready for the midterm exam next month?', timestamp: '11:15 AM', isSelf: false }
  ],
  notifications: [
    { id: 'n1', title: 'Exam reminder', text: 'UI/UX Midterm starts in 22 days. Prepare study notes!', time: '10m ago', read: false },
    { id: 'n2', title: 'Grade published', text: 'Your Mobile Banking Wireframe got a 9.2 grade.', time: '2h ago', read: false },
    { id: 'n3', title: 'New Tutorial available', text: 'Lesson 8 added to JavaScript Programming Masterclass.', time: '1d ago', read: true }
  ]
};

function getCourseProgress(course) {
  if (!course.lessons || course.lessons.length === 0) return 0;
  const completed = course.lessons.filter(l => l.completed).length;
  if (course.baseProgress !== undefined && course.initialCompletedCount !== undefined) {
    const delta = (completed - course.initialCompletedCount) * 6;
    return Math.min(100, Math.max(0, course.baseProgress + delta));
  }
  return Math.round((completed / course.lessons.length) * 100);
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smart LMS Platform API', time: new Date().toISOString() });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ success: true, user: database.currentUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email required' });
  }
  database.currentUser.email = email;
  res.json({ success: true, user: database.currentUser });
});

app.post('/api/auth/switch-student', (req, res) => {
  const { studentId } = req.body;
  const target = database.otherUsers.find(u => u.id === studentId);
  if (target) {
    const prev = { ...database.currentUser };
    database.currentUser = {
      ...database.currentUser,
      id: target.id,
      name: target.name,
      email: target.email,
      avatar: target.avatar,
    };
    target.name = prev.name;
    target.email = prev.email;
  }
  res.json({ success: true, user: database.currentUser });
});

app.put('/api/auth/profile', (req, res) => {
  const { name, studyGoalWeekly } = req.body;
  if (name) database.currentUser.name = name.trim();
  if (studyGoalWeekly) database.currentUser.studyGoalWeekly = Number(studyGoalWeekly);
  res.json({ success: true, user: database.currentUser });
});

app.get('/api/courses', (req, res) => {
  const search = (req.query.search || '').toLowerCase().trim();
  const enrolledOnly = req.query.enrolled === 'true';

  let list = database.courses.map(c => ({
    ...c,
    progress: getCourseProgress(c),
    completedLessonsCount: c.lessons.filter(l => l.completed).length,
    totalLessonsCount: c.lessons.length,
    isFavorite: database.currentUser.favoriteCourses.includes(c.id),
  }));

  if (enrolledOnly) {
    list = list.filter(c => c.enrolled);
  }

  if (search) {
    list = list.filter(c => 
      c.title.toLowerCase().includes(search) || 
      c.category.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    );
  }

  res.json({ success: true, courses: list });
});

app.get('/api/courses/:id', (req, res) => {
  const course = database.courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  res.json({
    success: true,
    course: {
      ...course,
      progress: getCourseProgress(course),
      completedLessonsCount: course.lessons.filter(l => l.completed).length,
      totalLessonsCount: course.lessons.length,
    }
  });
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const course = database.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
  course.enrolled = true;
  database.currentUser.totalCourses += 1;
  res.json({ success: true, message: `Enrolled in ${course.title}`, course });
});

app.post('/api/courses/:id/unenroll', (req, res) => {
  const course = database.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
  course.enrolled = false;
  database.currentUser.totalCourses = Math.max(0, database.currentUser.totalCourses - 1);
  res.json({ success: true, message: `Unenrolled from ${course.title}`, course });
});

app.post('/api/courses/:id/lessons/:lessonId/complete', (req, res) => {
  const course = database.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
  
  const lesson = course.lessons.find(l => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ success: false, error: 'Lesson not found' });

  lesson.completed = !lesson.completed;
  if (lesson.completed) {
    database.currentUser.hoursStudied = Math.round((database.currentUser.hoursStudied + 0.5) * 10) / 10;
  }

  const newProgress = getCourseProgress(course);
  res.json({
    success: true,
    lesson,
    courseProgress: newProgress,
    hoursStudied: database.currentUser.hoursStudied,
  });
});

app.get('/api/exams', (req, res) => {
  res.json({ success: true, exams: database.exams });
});

app.get('/api/exams/:id', (req, res) => {
  const exam = database.exams.find(e => e.id === req.params.id);
  if (!exam) return res.status(404).json({ success: false, error: 'Exam not found' });
  
  const sanitized = {
    ...exam,
    questions: exam.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }))
  };
  res.json({ success: true, exam: sanitized });
});

app.post('/api/exams/:id/submit', (req, res) => {
  const exam = database.exams.find(e => e.id === req.params.id);
  if (!exam) return res.status(404).json({ success: false, error: 'Exam not found' });

  const { answers } = req.body;
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ success: false, error: 'Answers must be provided as an object' });
  }

  let correctCount = 0;
  const review = exam.questions.map(q => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      id: q.id,
      question: q.question,
      options: q.options,
      selectedIndex: selected,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const total = exam.questions.length;
  const grade = Math.round((correctCount / total) * 100) / 10;
  const passed = grade >= exam.passingGrade;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = months[new Date().getMonth()];
  
  const newAttempt = {
    id: `att_${Date.now()}`,
    month: currentMonth,
    examTitle: exam.title,
    grade,
    date: new Date().toISOString().split('T')[0],
  };
  database.examHistory.push(newAttempt);
  database.currentUser.hoursStudied = Math.round((database.currentUser.hoursStudied + 0.4) * 10) / 10;

  res.json({
    success: true,
    grade,
    totalQuestions: total,
    correctCount,
    passed,
    passingGrade: exam.passingGrade,
    review,
    newAttempt,
  });
});

app.get('/api/analytics', (req, res) => {
  const period = req.query.period || 'Yearly';

  const defaultYearly = [
    { label: 'Jan', grade: 3.8 },
    { label: 'Feb', grade: 4.2 },
    { label: 'Mar', grade: 3.6 },
    { label: 'Apr', grade: 7.8, isPeak: true },
    { label: 'May', grade: 4.8 },
    { label: 'Jun', grade: 3.7 },
    { label: 'Jul', grade: 4.2 },
    { label: 'Aug', grade: 4.6 },
    { label: 'Sep', grade: 3.9 },
    { label: 'Oct', grade: 2.2 },
    { label: 'Nov', grade: 6.5 },
    { label: 'Dec', grade: 3.4 },
  ];

  const monthlyBreakdown = [
    { label: 'W1', grade: 6.8 },
    { label: 'W2', grade: 7.4 },
    { label: 'W3', grade: 7.8, isPeak: true },
    { label: 'W4', grade: 7.1 },
  ];

  const weeklyBreakdown = [
    { label: 'Mon', grade: 7.0 },
    { label: 'Tue', grade: 6.5 },
    { label: 'Wed', grade: 7.8, isPeak: true },
    { label: 'Thu', grade: 7.2 },
    { label: 'Fri', grade: 7.5 },
    { label: 'Sat', grade: 8.0 },
    { label: 'Sun', grade: 7.4 },
  ];

  let chartData = defaultYearly;
  if (period === 'Monthly') chartData = monthlyBreakdown;
  if (period === 'Weekly') chartData = weeklyBreakdown;

  const achievements = [
    {
      id: 'ach_1',
      title: 'Complete 5 Full Course',
      unlocked: true,
      current: 5,
      target: 5,
      tier: 'Gold',
      icon: 'medal-gold'
    },
    {
      id: 'ach_2',
      title: 'Available On Time',
      unlocked: true,
      current: 98,
      target: 95,
      tier: 'Silver',
      icon: 'medal-purple'
    },
    {
      id: 'ach_3',
      title: 'Complete 500 Hours',
      unlocked: false,
      current: Math.floor(database.currentUser.hoursStudied),
      target: 500,
      tier: 'Locked',
      icon: 'medal-grey'
    },
    {
      id: 'ach_4',
      title: 'Clear 10 Exams',
      unlocked: false,
      current: 7,
      target: 10,
      tier: 'Locked',
      icon: 'medal-grey'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  res.json({
    success: true,
    period,
    chartData,
    highestGrade: 7.8,
    averageGrade: 4.8,
    totalCourses: database.currentUser.totalCourses,
    hoursStudied: database.currentUser.hoursStudied,
    achievements: {
      unlockedCount,
      totalCount: achievements.length,
      items: achievements,
    }
  });
});

app.post('/api/study/log', (req, res) => {
  const { hours } = req.body;
  const added = Number(hours) || 1.0;
  database.currentUser.hoursStudied = Math.round((database.currentUser.hoursStudied + added) * 10) / 10;
  res.json({
    success: true,
    message: `Logged ${added} hour(s) of study session!`,
    hoursStudied: database.currentUser.hoursStudied,
  });
});

app.get('/api/assignments', (req, res) => {
  res.json({ success: true, assignments: database.assignments });
});

app.post('/api/assignments/:id/submit', (req, res) => {
  const asgn = database.assignments.find(a => a.id === req.params.id);
  if (!asgn) return res.status(404).json({ success: false, error: 'Assignment not found' });
  const { notes, submissionUrl } = req.body;
  asgn.status = 'Submitted';
  asgn.submittedAt = new Date().toISOString();
  asgn.notes = notes || '';
  asgn.submissionUrl = submissionUrl || '';
  res.json({ success: true, message: 'Assignment submitted successfully!', assignment: asgn });
});

app.get('/api/schedule', (req, res) => {
  res.json({ success: true, schedule: database.schedule });
});

app.get('/api/chat/messages', (req, res) => {
  res.json({ success: true, messages: database.messages, currentUser: database.currentUser });
});

app.post('/api/chat/messages', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ success: false, error: 'Text required' });
  
  const newMsg = {
    id: `m_${Date.now()}`,
    senderId: database.currentUser.id,
    senderName: database.currentUser.name,
    text: text.trim(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isSelf: true,
  };
  database.messages.push(newMsg);

  if (text.toLowerCase().includes('help') || text.toLowerCase().includes('exam') || text.toLowerCase().includes('study')) {
    setTimeout(() => {
      database.messages.push({
        id: `m_ai_${Date.now()}`,
        senderId: 'usr_ai_mentor',
        senderName: 'Study AI Assistant',
        text: 'Great question! Focus on lesson 3 and 4 in the course outline, and review the interactive quiz questions for optimal preparation!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false,
      });
    }, 1500);
  }

  res.json({ success: true, message: newMsg });
});

app.get('/api/friends', (req, res) => {
  res.json({ success: true, friends: database.otherUsers });
});

app.post('/api/friends/:id/nudge', (req, res) => {
  const friend = database.otherUsers.find(u => u.id === req.params.id);
  if (!friend) return res.status(404).json({ success: false, error: 'Friend not found' });
  res.json({ success: true, message: `Sent high-five study nudge to ${friend.name}!` });
});

app.get('/api/notifications', (req, res) => {
  res.json({ success: true, notifications: database.notifications });
});

app.post('/api/notifications/read', (req, res) => {
  const { id } = req.body;
  if (id) {
    const n = database.notifications.find(item => item.id === id);
    if (n) n.read = true;
  } else {
    database.notifications.forEach(n => { n.read = true; });
  }
  res.json({ success: true, notifications: database.notifications });
});

app.post('/api/favorites/toggle', (req, res) => {
  const { courseId } = req.body;
  const idx = database.currentUser.favoriteCourses.indexOf(courseId);
  let isFavorite = false;
  if (idx > -1) {
    database.currentUser.favoriteCourses.splice(idx, 1);
    isFavorite = false;
  } else {
    database.currentUser.favoriteCourses.push(courseId);
    isFavorite = true;
  }
  res.json({ success: true, isFavorite, favoriteCourses: database.currentUser.favoriteCourses });
});

// Start Express server and connect Vite in development mode
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart LMS Platform server running on http://localhost:${PORT}`);
  });
}

startServer();
