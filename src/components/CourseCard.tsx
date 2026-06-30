/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Star, Users, ArrowUpRight, Award, Flame } from 'lucide-react';
import { Course } from '../types';
import BilingualText from './BilingualText';

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
  onSelect: (courseId: string) => void;
  isPendingPayment?: boolean;
  key?: string | number;
}

export default function CourseCard({
  course,
  isEnrolled,
  onEnroll,
  onSelect,
  isPendingPayment = false
}: CourseCardProps) {
  const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.floor(course.rating));

  return (
    <div 
      className="group relative bg-zinc-950/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-emerald-500/40 hover:shadow-emerald-950/20 hover:shadow-2xl flex flex-col h-full"
      id={`course-card-${course.id}`}
    >
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all duration-300 pointer-events-none" />

      {/* Bento Layout Grid Inside Card */}
      <div className="grid grid-cols-12 gap-px bg-zinc-800/50 h-full">
        
        {/* Visual / Image Block (Span 12 for mobile, Span 12 always, but let's make it look like bento boxes) */}
        <div className="col-span-12 relative overflow-hidden bg-zinc-900 aspect-video flex items-center justify-center border-b border-zinc-800/60">
          <img 
            src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"} 
            alt={course.title_en}
            className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-zinc-900/90 backdrop-blur-md text-zinc-100 text-[10px] font-bold px-2.5 py-1 rounded-full border border-zinc-800 tracking-wider uppercase">
              {course.category}
            </span>
            {course.featured && (
              <span className="bg-emerald-500/95 text-zinc-950 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 fill-zinc-950" />
                <span>POPULAR</span>
              </span>
            )}
          </div>

          {/* Core Price Overlay (Constant 200 Birr) */}
          <div className="absolute bottom-3 right-3 bg-zinc-950/90 backdrop-blur-md border border-emerald-500/40 rounded-xl px-3 py-1.5 flex flex-col items-end shadow-lg shadow-black/60">
            <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">PRICE / GATII</span>
            <span className="text-sm font-extrabold text-emerald-400">200 Birr / 200 Birrii</span>
          </div>
        </div>

        {/* Bento Cell 1: Title and Category (Span 12) */}
        <div className="col-span-12 p-5 bg-zinc-950/20 flex flex-col justify-between border-b border-zinc-800/60">
          <div>
            <BilingualText 
              en={course.title_en} 
              or={course.title_or} 
              layout="stacked"
              enClassName="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors"
              orClassName="text-xs text-emerald-400 font-medium"
            />
            <p className="text-zinc-400 text-xs mt-3 line-clamp-2 leading-relaxed">
              {course.description_en}
            </p>
          </div>
        </div>

        {/* Bento Sub-grid for Stats (Cell 2: left span 6, Cell 3: right span 6) */}
        <div className="col-span-12 grid grid-cols-2 bg-zinc-800/30 text-xs">
          {/* Stats Box 1: Lessons */}
          <div className="p-4 flex flex-col justify-center items-start border-r border-zinc-800/60">
            <span className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase mb-1">LESSONS / BARNOOTA</span>
            <div className="flex items-center gap-1.5 text-zinc-200 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>{course.lessons.length} {course.lessons.length === 1 ? 'Lesson' : 'Lessons'}</span>
            </div>
          </div>

          {/* Stats Box 2: Rating & Students */}
          <div className="p-4 flex flex-col justify-center items-start">
            <span className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase mb-1">REVIEWS / GIDDUGALA</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
              <span>{course.rating.toFixed(1)}</span>
              <span className="text-zinc-500 font-normal">({course.enrolled_count}+ students)</span>
            </div>
          </div>
        </div>

        {/* Bento Cell 4: Footer controls (Buy / Open Course) */}
        <div className="col-span-12 p-4 bg-zinc-950/40 flex items-center justify-between gap-3 mt-auto">
          {isEnrolled ? (
            <button
              onClick={() => onSelect(course.id)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/30 group/btn"
              id={`open-course-${course.id}`}
            >
              <BilingualText 
                en="Open Course" 
                or="Koorsee Banu" 
                layout="stacked" 
                enClassName="text-xs font-bold text-zinc-950" 
                orClassName="text-[10px] text-zinc-900 font-semibold mt-0.5"
              />
              <ArrowUpRight className="w-4 h-4 text-zinc-950 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          ) : isPendingPayment ? (
            <div className="w-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-xs py-3 px-4 rounded-xl flex flex-col items-center justify-center gap-0.5">
              <BilingualText 
                en="Payment Pending Admin Review" 
                or="Kaffaltiin Ilaalamaa Jira" 
                layout="stacked" 
                enClassName="text-xs font-bold text-yellow-400 text-center" 
                orClassName="text-[10px] text-yellow-500/80 text-center"
              />
            </div>
          ) : (
            <button
              onClick={() => onEnroll(course.id)}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-100 hover:border-emerald-500/50 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group/btn"
              id={`enroll-course-${course.id}`}
            >
              <BilingualText 
                en="Enroll for 200 Birr" 
                or="Gatii 200 Birriin Sali" 
                layout="stacked" 
                enClassName="text-xs font-bold text-zinc-100 group-hover/btn:text-emerald-400 transition-colors" 
                orClassName="text-[10px] text-emerald-400/80"
              />
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover/btn:text-emerald-400 transition-colors" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
