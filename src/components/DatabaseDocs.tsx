/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, FolderTree, Clipboard, Check, Terminal, Shield, List } from 'lucide-react';

export default function DatabaseDocs() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlCode = `-- ==========================================
-- AMOO ACADEMY - SUPABASE / POSTGRES SCHEMA
-- Premium Bilingual EdTech Platform
-- ==========================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Student Profile Data)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    current_points INTEGER DEFAULT 0 NOT NULL,
    streak_days INTEGER DEFAULT 0 NOT NULL,
    completed_lessons UUID[] DEFAULT '{}'::UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "System can insert profiles on signup triggers" 
    ON public.profiles FOR INSERT 
    WITH CHECK (true);


-- 2. COURSES TABLE
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_or TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_or TEXT NOT NULL,
    price INTEGER DEFAULT 200 NOT NULL, -- Fixed 200 Birr
    image_url TEXT,
    category TEXT NOT NULL,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating NUMERIC(3, 2) DEFAULT 4.5 NOT NULL,
    enrolled_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for Courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses RLS Policies
CREATE POLICY "Anyone can view courses" 
    ON public.courses FOR SELECT 
    USING (true);

CREATE POLICY "Only admins can modify courses" 
    ON public.courses FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.email = 'dhiirakoo@gmail.com' -- Admin definition
        )
    );


-- 3. ENROLLMENTS TABLE
CREATE TABLE public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    progress_percentage INTEGER DEFAULT 0 NOT NULL,
    completed_lessons UUID[] DEFAULT '{}'::UUID[] NOT NULL,
    UNIQUE(profile_id, course_id)
);

-- Enable Row Level Security for Enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Enrollments RLS Policies
CREATE POLICY "Students can view their own enrollments" 
    ON public.enrollments FOR SELECT 
    USING (auth.uid() = profile_id);

CREATE POLICY "Students can update their own enrollments" 
    ON public.enrollments FOR UPDATE 
    USING (auth.uid() = profile_id);


-- 4. PAYMENTS TABLE
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL NOT NULL,
    amount INTEGER DEFAULT 200 NOT NULL, -- 200 Birr constant
    payment_method TEXT NOT NULL, -- 'CBE Birr', 'Telebirr', 'E-Birr'
    transaction_ref TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending'::text CHECK (status IN ('pending', 'completed', 'failed')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payments RLS Policies
CREATE POLICY "Students can view their own payment records" 
    ON public.payments FOR SELECT 
    USING (auth.uid() = profile_id);

CREATE POLICY "Students can request payments" 
    ON public.payments FOR INSERT 
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Admins can view and update all payments" 
    ON public.payments FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.email = 'dhiirakoo@gmail.com'
        )
    );
`;

  const folderStructure = `amoo-academy/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with premium layout headers
│   │   ├── page.tsx               # Cinematic Bento Grid Homepage
│   │   ├── api/
│   │   │   ├── ai-tutor/
│   │   │   │   └── route.ts       # Secure server-side Gemini AI API router
│   │   │   ├── courses/
│   │   │   │   └── route.ts       # Fetch & manage bilingual courses
│   │   │   └── payments/
│   │   │       └── route.ts       # Process 200 Birr student enrollments
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Student learning & progress portal
│   │   ├── courses/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Dynamic bilingual course view
│   │   └── admin/
│   │       └── page.tsx           # Course curator & financial logs control
│   ├── components/
│   │   ├── BilingualText.tsx      # Dual English/Afaan Oromo renderer
│   │   ├── CourseCard.tsx         # Bento-Grid style multi-pane course UI
│   │   ├── AITutor.tsx            # Floating Interactive AI Study Buddy
│   │   └── ui/
│   │       ├── bento-grid.tsx     # Generic modern Bento containers
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── lib/
│   │   ├── supabase.ts            # Client SDK singleton config
│   │   └── utils.ts               # Tailwind merge class mergers
│   └── types/
│       └── index.ts               # Core database & app interfaces
├── public/
│   └── assets/                    # Platform illustration icons
├── .env.local                     # Supabase & Gemini Key declarations
├── tailwind.config.ts             # Custom fonts and emerald core palette
├── package.json
└── tsconfig.json`;

  return (
    <div className="space-y-8" id="technical-docs-container">
      {/* Intro Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Terminal className="w-7 h-7 text-emerald-400" />
          <span>Amoo Academy Technical Engine</span>
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Complete blueprint for the Next.js 15, Supabase SQL, and TypeScript bilingual structure. Built for world-class design, mobile performance on Android, and robust security.
        </p>
      </div>

      {/* Bento Grid layout for Code & Structure */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Next.js 15 App Router Directory (Col 12 on mobile, Col 5 on desktop) */}
        <div className="col-span-12 lg:col-span-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-400" />
                <span>Next.js 15 Folder Tree</span>
              </h3>
              <button 
                onClick={() => copyToClipboard(folderStructure, 'tree')}
                className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40"
              >
                {copiedSection === 'tree' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clipboard className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Standardized clean App Router setup structure. Built with separation of concerns to handle the Bilingual system and AI Tutor on separate API routes.
            </p>

            <pre className="font-mono text-xs text-emerald-400/95 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/80 overflow-x-auto leading-relaxed max-h-[480px]">
              {folderStructure}
            </pre>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center gap-2 text-xs text-zinc-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Fully optimized for client-to-server security.</span>
          </div>
        </div>

        {/* Supabase PostgreSQL Database DDL Setup (Col 12 on mobile, Col 7 on desktop) */}
        <div className="col-span-12 lg:col-span-7 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Supabase PostgreSQL Schema & RLS</span>
              </h3>
              <button 
                onClick={() => copyToClipboard(sqlCode, 'sql')}
                className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40"
              >
                {copiedSection === 'sql' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clipboard className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              DDL file containing state tracking schemas, default billing entries at <span className="text-emerald-400 font-semibold">200 Birr</span>, and tight Row Level Security policies to isolate students.
            </p>

            <div className="relative">
              <pre className="font-mono text-[11px] text-zinc-300 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/80 overflow-x-auto leading-relaxed max-h-[480px]">
                {sqlCode}
              </pre>
              <div className="absolute bottom-2 right-2 bg-zinc-950 text-[10px] text-zinc-500 font-bold px-2 py-1 rounded border border-zinc-800">
                SQL / POSTGRESQL
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>RLS Policies Enforced</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>200 Birr Fixed Pricing</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
