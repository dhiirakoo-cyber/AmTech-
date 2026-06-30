/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const STATE_FILE_PATH = path.join(process.cwd(), 'db_state.json');

app.use(express.json());

// Initialize Gemini API Client safely (Lazy Initialization)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Initial Database Seeding Data
const initialCourses = [
  {
    id: "course-1",
    title_en: "Intro to Modern Web Engineering",
    title_or: "Seensa Saayinsii Web Ammayyaa",
    description_en: "Master React, TypeScript, and modern engineering practices from absolute scratch.",
    description_or: "Dandeettii React, TypeScript fi dalagaalee saayinsii ammayyaa guutummatti baradhu.",
    price: 200,
    instructor_name: "Amoo Girma",
    rating: 4.9,
    enrolled_count: 312,
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    category: "Software",
    featured: true,
    lessons: [
      {
        id: "c1-l1",
        title_en: "The Modern Web Ecosystem",
        title_or: "Naannoo Hojii Web Ammayyaa",
        content_en: "The web has evolved from simple HTML documents to complex client-server applications. Today, we use single-page applications (SPAs) powered by React to handle high-fidelity rendering, state synchronization, and micro-interactions.",
        content_or: "Weebiin barruulee HTML salphaa irraa gara hojiiwwan client-server walxaxaa ta'anitti guddatee jira. Har'a, nuhi hojiiwwan weebii mul'ata olaanaa qaban, wal-sinkiingii haalaa, fi hoji-xiqqeeyyii qabachuu danda'an hojjechuuf weebii SPA kan React'n deeggaramu fayyadamna.",
        order: 1,
        duration: "10 mins",
        category_en: "Concepts",
        category_or: "Yaada Bu'uraa"
      },
      {
        id: "c1-l2",
        title_en: "Introduction to TypeScript Core",
        title_or: "Seensa Bu'ura TypeScript",
        content_en: "TypeScript provides build-time type checking to prevent runtime exceptions. By declaring interfaces and strict schemas, we achieve self-documenting codebases and compile-time assurance of structural integrity.",
        content_or: "TypeScript dogoggoroota yeroo hojii (runtime) ittisuuf yeroo ijaaramaatti (build-time) qorannoo gosa tajaajilaa kenna. Interface fi saxaxawwan jajjaboo ibsuun, koodii of-ibsuu fi ijaarama koodii mirkaneessu arganna.",
        order: 2,
        duration: "15 mins",
        category_en: "Typing",
        category_or: "Gosa Koodii"
      }
    ],
    quiz: {
      id: "c1-q",
      title_en: "Web Engineering Core Knowledge",
      title_or: "Beekumsa Bu'ura Saayinsii Web",
      questions: [
        {
          id: "c1-q1",
          question_en: "What does SPA stand for in web engineering?",
          question_or: "Injinaringii weebii keessatti SPA'n maal ibsa?",
          options_en: ["Single Page Application", "Software Process Architecture", "Static Protocol Asset"],
          options_or: ["Aappilikeeshinii Fuula Tokkoo", "Hojimaata Adeemsa Softiweerii", "Qabeenya Kilaasikaa Static"],
          correct_index: 0
        },
        {
          id: "c1-q2",
          question_en: "Why do we use TypeScript over vanilla JavaScript?",
          question_or: "Maaliif JavaScript salphaa irra TypeScript filanna?",
          options_en: ["For static type safety and fewer runtime bugs", "Because it runs faster in the browser", "To completely replace HTML templates"],
          options_or: ["Wabiilee gosa tajaajilaa fi dogoggora runtime xiqqeessuuf", "Fiigicha weebsaayitii saffisiisuuf", "Guutummatti HTML bakka bu'uuf"],
          correct_index: 0
        }
      ]
    }
  },
  {
    id: "course-2",
    title_en: "Practical Agricultural Innovations",
    title_or: "Haala Qabatamaa Kalaqa Qonnaa",
    description_en: "Learn modern irrigation, soil management, and high-yield farming practices for East Africa.",
    description_or: "Barumsa bishaan kaffaltii, kunuunsa biyyee, fi adeemsa omisha qonnaa olaanaa dhiha Afrikaaf baradhu.",
    price: 200,
    instructor_name: "Chala Kebede",
    rating: 4.8,
    enrolled_count: 184,
    image_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    category: "Agriculture",
    featured: false,
    lessons: [
      {
        id: "c2-l1",
        title_en: "Modern Drip Irrigation Systems",
        title_or: "Hojimaata Bishaan Obasuu Coxxofuu",
        content_en: "Drip irrigation delivers water directly to plant roots, minimizing evaporation. It is highly sustainable, saving up to 60% water while maintaining optimal soil moisture levels for crop development.",
        content_or: "Miriirri bishaan coxxofuu bishaan kallattiin hiddoota biqiltuutti kenna, kunis bishaan dhumachuu ittisa. Haalaan itti-fufiinsa kan qabu yoo ta'u, bishaan dhibbeentaa 60% qusata.",
        order: 1,
        duration: "12 mins",
        category_en: "Irrigation",
        category_or: "Obasuu"
      },
      {
        id: "c2-l2",
        title_en: "Soil Nutrient Management",
        title_or: "Bulchiinsa Nyaata Biyyee",
        content_en: "Crops require essential minerals: Nitrogen, Phosphorus, and Potassium (NPK). Regular crop rotation and organic composting restabilize agricultural land without chemical soil damage.",
        content_or: "Omishni minerals ijoo barbaada: Nitrogen, Phosphorus, fi Potassium. Jijiirama biqiltuufi compost uumamaa fayyadamuun lafa qonnaa deebisanii gabbisuun ni danda'ama.",
        order: 2,
        duration: "14 mins",
        category_en: "Soil Ecology",
        category_or: "Ekolojii Biyyee"
      }
    ],
    quiz: {
      id: "c2-q",
      title_en: "Agronomy Principles Quiz",
      title_or: "Barumsa Agronomy Bu'uraa",
      questions: [
        {
          id: "c2-q1",
          question_en: "Which water-saving technique supplies moisture directly to the root zone?",
          question_or: "Adeemsi bishaan qusachuu kallattiin gara hundee jiidha kennu maali?",
          options_en: ["Flood irrigation", "Drip irrigation", "Sprinkler systems"],
          options_or: ["Obasuu lolaa", "Obasuu coxxofuu", "Hojimaata firiirsuu"],
          correct_index: 1
        }
      ]
    }
  },
  {
    id: "course-3",
    title_en: "Financial Literacy & Digital CBE Birr",
    title_or: "Beekumsa Maallaqaa fi CBE Birr",
    description_en: "Understand budgeting, micro-savings, and utilizing digital banking for business scaling.",
    description_or: "Qophii baasii, qusannaa xixiqqoo, fi tajaajila bankii dijitaalaa daldala guddisuuf hubadhu.",
    price: 200,
    instructor_name: "Lensa Tolessa",
    rating: 4.75,
    enrolled_count: 245,
    image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    category: "Finance",
    featured: true,
    lessons: [
      {
        id: "c3-l1",
        title_en: "Building a Micro-Enterprise Budget",
        title_or: "Qophii Baasii Hojii Xixiqqoo",
        content_en: "A robust budget tracks income, operational expenditure, and emergency savings. Micro-enterprises should isolate personal funds from business revenue to assure sustainable scaling.",
        content_or: "Madaallin baasii jabaan galii, baasii hojii, fi qusannaa yeroo muddamaa hordofa. Daldaltoonni xixiqqoon maallaqa dhuunfaa fi maallaqa daldalaa gargar baasuu qabu.",
        order: 1,
        duration: "11 mins",
        category_en: "Budgeting",
        category_or: "Qophii Baasii"
      }
    ]
  }
];

const initialProfile = {
  id: "student-user",
  name: "Ebisa Dirriba",
  email: "dhiirakoo@gmail.com",
  phone: "+251 912 345 678",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  current_points: 120,
  streak_days: 5,
  completed_lessons: ["c1-l1"]
};

const initialEnrollments = [
  {
    id: "enrollment-1",
    profile_id: "student-user",
    course_id: "course-1",
    enrolled_at: new Date().toISOString(),
    progress_percentage: 50,
    completed_lessons: ["c1-l1"]
  }
];

const initialPayments = [
  {
    id: "payment-1",
    profile_id: "student-user",
    course_id: "course-1",
    amount: 200,
    payment_method: "CBE Birr",
    transaction_ref: "TXN-91284712-CBE",
    status: "completed",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Load or Seed state helper
function loadState() {
  if (fs.existsSync(STATE_FILE_PATH)) {
    try {
      const data = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading db_state.json, reseeding.", e);
    }
  }
  const newState = {
    courses: initialCourses,
    profile: initialProfile,
    enrollments: initialEnrollments,
    payments: initialPayments
  };
  saveState(newState);
  return newState;
}

function saveState(state: any) {
  try {
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error writing db_state.json", e);
  }
}

// Ensure database state is initialized
let db = loadState();

// API ENDPOINTS

// 1. COURSES
app.get('/api/courses', (req, res) => {
  db = loadState();
  res.json(db.courses);
});

app.post('/api/courses', (req, res) => {
  db = loadState();
  const newCourse = {
    id: `course-${Date.now()}`,
    title_en: req.body.title_en || "Untitled Course",
    title_or: req.body.title_or || "Koorsii Salphaa",
    description_en: req.body.description_en || "",
    description_or: req.body.description_or || "",
    price: 200, // Fixed
    instructor_name: req.body.instructor_name || "Guest Instructor",
    rating: 5.0,
    enrolled_count: 0,
    image_url: req.body.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    category: req.body.category || "General",
    lessons: req.body.lessons || [],
    quiz: req.body.quiz || { id: `quiz-${Date.now()}`, title_en: "Quiz", title_or: "Madaallii", questions: [] }
  };
  db.courses.push(newCourse);
  saveState(db);
  res.status(201).json(newCourse);
});

// Update/Edit course (Admin feature)
app.put('/api/courses/:id', (req, res) => {
  db = loadState();
  const index = db.courses.findIndex((c: any) => c.id === req.params.id);
  if (index !== -1) {
    db.courses[index] = { ...db.courses[index], ...req.body };
    saveState(db);
    res.json(db.courses[index]);
  } else {
    res.status(404).json({ error: "Course not found" });
  }
});

// Delete Course
app.delete('/api/courses/:id', (req, res) => {
  db = loadState();
  db.courses = db.courses.filter((c: any) => c.id !== req.params.id);
  saveState(db);
  res.json({ success: true });
});

// 2. PROFILE
app.get('/api/profile', (req, res) => {
  db = loadState();
  res.json(db.profile);
});

app.post('/api/profile', (req, res) => {
  db = loadState();
  db.profile = { ...db.profile, ...req.body };
  saveState(db);
  res.json(db.profile);
});

// 3. ENROLLMENTS
app.get('/api/enrollments', (req, res) => {
  db = loadState();
  res.json(db.enrollments);
});

// Complete a lesson progress
app.post('/api/enrollments/lesson-complete', (req, res) => {
  db = loadState();
  const { course_id, lesson_id } = req.body;
  
  // Find enrollment
  const enrollIndex = db.enrollments.findIndex((e: any) => e.course_id === course_id && e.profile_id === db.profile.id);
  
  if (enrollIndex !== -1) {
    const enrollment = db.enrollments[enrollIndex];
    if (!enrollment.completed_lessons.includes(lesson_id)) {
      enrollment.completed_lessons.push(lesson_id);
      
      // Update profile completed_lessons
      if (!db.profile.completed_lessons.includes(lesson_id)) {
        db.profile.completed_lessons.push(lesson_id);
        db.profile.current_points += 10; // 10 points per lesson!
      }

      // Calculate new progress percentage
      const course = db.courses.find((c: any) => c.id === course_id);
      if (course && course.lessons.length > 0) {
        const total = course.lessons.length;
        const done = enrollment.completed_lessons.length;
        enrollment.progress_percentage = Math.min(100, Math.round((done / total) * 100));
      }
      
      saveState(db);
    }
    res.json({ enrollment, profile: db.profile });
  } else {
    res.status(404).json({ error: "Enrollment not found" });
  }
});

// 4. PAYMENTS & ENROLLING
app.get('/api/payments', (req, res) => {
  db = loadState();
  res.json(db.payments);
});

// Submitting a manual/digital 200 Birr payment request
app.post('/api/payments', (req, res) => {
  db = loadState();
  const { course_id, payment_method, transaction_ref } = req.body;
  
  // Check duplicate ref
  const duplicate = db.payments.find((p: any) => p.transaction_ref === transaction_ref);
  if (duplicate) {
    return res.status(400).json({ error: "Transaction Reference already submitted / Kaffaltiin kun duraan galmeeffameera." });
  }

  const newPayment = {
    id: `payment-${Date.now()}`,
    profile_id: db.profile.id,
    course_id: course_id,
    amount: 200, // Fixed
    payment_method,
    transaction_ref,
    status: "pending",
    created_at: new Date().toISOString()
  };

  db.payments.push(newPayment);
  saveState(db);
  res.status(201).json(newPayment);
});

// Admin reviews and approves / declines payments
app.post('/api/payments/review', (req, res) => {
  db = loadState();
  const { payment_id, status } = req.body; // 'completed' or 'failed'
  
  const payIndex = db.payments.findIndex((p: any) => p.id === payment_id);
  if (payIndex !== -1) {
    db.payments[payIndex].status = status;
    
    // If approved, create corresponding enrollment
    if (status === 'completed') {
      const payment = db.payments[payIndex];
      const existingEnroll = db.enrollments.find((e: any) => e.course_id === payment.course_id && e.profile_id === payment.profile_id);
      
      if (!existingEnroll) {
        db.enrollments.push({
          id: `enroll-${Date.now()}`,
          profile_id: payment.profile_id,
          course_id: payment.course_id,
          enrolled_at: new Date().toISOString(),
          progress_percentage: 0,
          completed_lessons: []
        });

        // Increment course enroll count
        const courseIndex = db.courses.findIndex((c: any) => c.id === payment.course_id);
        if (courseIndex !== -1) {
          db.courses[courseIndex].enrolled_count += 1;
        }
      }
    }
    saveState(db);
    res.json({ success: true, payments: db.payments, enrollments: db.enrollments });
  } else {
    res.status(404).json({ error: "Payment record not found" });
  }
});

// 5. GEMINI AI BILINGUAL STUDY TUTOR
app.post('/api/ai-tutor', async (req, res) => {
  const { prompt, chatHistory, lessonContext } = req.body;
  
  const client = getGeminiClient();
  if (!client) {
    return res.json({ 
      reply: "System Notice: The Gemini API Key is missing. Please add your `GEMINI_API_KEY` in the Settings > Secrets panel on Google AI Studio to enable the active bilingual Tutor!\n\nHubachiisa: Kiin API Gemini hin jiru. Gara Settings > Secrets deemuun galchi."
    });
  }

  try {
    const defaultInstruction = `You are "Amoo AI Tutor", a premium world-class educational virtual helper for Amoo Academy.
Your role is to explain subjects, answer educational questions, and guide students.
You MUST be completely bilingual, supporting English and Afaan Oromo side-by-side or offering clear explanations in both languages.
Keep answers readable, clear, structured with markdown, and highly engaging.

Current Student Profile:
Name: Ebisa Dirriba
Streak: 5 days

${lessonContext ? `The student is currently reading a lesson:
Lesson Title: "${lessonContext.title_en}" / "${lessonContext.title_or}"
Lesson Material:
English: ${lessonContext.content_en}
Afaan Oromo: ${lessonContext.content_or}
` : ''}

Be welcoming, polite, and maintain an inspiring educational tone. Keep explanations clear. Provide translation blocks for key technical words.`;

    // Construct contents
    const contents = [];
    if (chatHistory && chatHistory.length > 0) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: defaultInstruction,
        temperature: 0.75,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini AI API tutor error:", error);
    res.status(500).json({ 
      error: "Tutor engine encountered an error. Please try again.",
      details: error.message 
    });
  }
});

// Serve Frontend Vite bundle in dev/production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Amoo Academy Engine] running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
