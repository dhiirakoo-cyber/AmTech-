/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Check, X, ShieldAlert, Award, FileText, Database, Layers, ExternalLink, Calendar } from 'lucide-react';
import { Course, Payment } from '../types';
import BilingualText from './BilingualText';
import DatabaseDocs from './DatabaseDocs';

interface AdminPanelProps {
  courses: Course[];
  payments: Payment[];
  onAddCourse: (courseData: Partial<Course>) => void;
  onDeleteCourse: (courseId: string) => void;
  onReviewPayment: (paymentId: string, status: 'completed' | 'failed') => void;
}

export default function AdminPanel({
  courses,
  payments,
  onAddCourse,
  onDeleteCourse,
  onReviewPayment
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'payments' | 'courses' | 'schema'>('payments');
  
  // New Course Form State
  const [titleEn, setTitleEn] = useState('');
  const [titleOr, setTitleOr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descOr, setDescOr] = useState('');
  const [category, setCategory] = useState('Software');
  const [imageUrl, setImageUrl] = useState('');
  const [instructor, setInstructor] = useState('Instructor Amoo');

  // Simple Lesson Form Addition
  const [lessonTitleEn, setLessonTitleEn] = useState('');
  const [lessonTitleOr, setLessonTitleOr] = useState('');
  const [lessonContentEn, setLessonContentEn] = useState('');
  const [lessonContentOr, setLessonContentOr] = useState('');
  const [lessonDuration, setLessonDuration] = useState('10 mins');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleSubmitCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleOr || !descEn || !descOr) {
      setFormError("Please fill out all bilingual titles and descriptions! / Maaloo maraa guuti.");
      return;
    }

    const defaultLessons = [
      {
        id: `les-${Date.now()}-1`,
        title_en: lessonTitleEn || "Foundations and Overview",
        title_or: lessonTitleOr || "Bu'uraalee fi Daawwannaa Jalqabaa",
        content_en: lessonContentEn || "This lesson covers the core overview of our bilingual material.",
        content_or: lessonContentOr || "Inni kun bu'uraalee barruu afaan lamaanii gadi fageenyaan ibsa.",
        order: 1,
        duration: lessonDuration || "10 mins",
        category_en: "Introduction",
        category_or: "Seensa"
      }
    ];

    onAddCourse({
      title_en: titleEn,
      title_or: titleOr,
      description_en: descEn,
      description_or: descOr,
      category,
      image_url: imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
      instructor_name: instructor,
      lessons: defaultLessons
    });

    // Clear form
    setTitleEn('');
    setTitleOr('');
    setDescEn('');
    setDescOr('');
    setLessonTitleEn('');
    setLessonTitleOr('');
    setLessonContentEn('');
    setLessonContentOr('');
    setFormError('');
    setFormSuccess('Course successfully curated! / Koorseen sun milkiin uumameera.');
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title_en : "Unknown Course";
  };

  return (
    <div className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-4 md:p-6" id="admin-panel-container">
      {/* Top Credentials Security Alert banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3 mb-6">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs">
          <p className="font-bold text-white uppercase tracking-wider">SECURE ADMISTRATIVE MODE (dhiirakoo@gmail.com)</p>
          <p className="text-zinc-400 mt-1 leading-relaxed">
            Authorized administrative panel active. Here you can curate new course syllabi in English and Afaan Oromo, audit financial transaction logs, and review database architecture.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-zinc-800 gap-4 mb-6">
        <button
          onClick={() => setActiveSubTab('payments')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'payments' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Audit Payments ({payments.filter(p => p.status === 'pending').length} Pending)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'courses' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Syllabus Curator ({courses.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('schema')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'schema' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>SQL Schema & Architecture</span>
        </button>
      </div>

      {/* RENDER ACTIVE SUBTAB */}
      
      {activeSubTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Manual Billing Logs (200 Birr Fixed Plan)</h3>
              <p className="text-xs text-zinc-500 mt-1">Review student bank transfers (CBE Birr, Telebirr) to approve enrollment keys.</p>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-xs">
              No financial transaction logs found in system database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payments.map((p) => (
                <div 
                  key={p.id} 
                  className={`bg-zinc-900/60 border rounded-xl p-4 flex flex-col justify-between transition-all ${
                    p.status === 'pending' 
                      ? 'border-zinc-800' 
                      : p.status === 'completed' 
                        ? 'border-emerald-500/20 bg-emerald-500/5' 
                        : 'border-rose-500/20 bg-rose-500/5'
                  }`}
                  id={`admin-payment-log-${p.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-zinc-400 font-bold tracking-wider bg-zinc-950 px-2 py-1 rounded border border-zinc-800 uppercase">
                        {p.payment_method}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.status === 'pending' 
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' 
                          : p.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {p.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">
                      {getCourseTitle(p.course_id)}
                    </h4>
                    
                    <div className="space-y-1.5 text-xs text-zinc-400 mt-3 font-mono">
                      <div className="flex justify-between">
                        <span>Transaction Ref:</span>
                        <span className="text-white font-semibold">{p.transaction_ref}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount / Gatii:</span>
                        <span className="text-emerald-400 font-bold">{p.amount} Birr / {p.amount} Birrii</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time / Sa'aa:</span>
                        <span className="text-zinc-500">{new Date(p.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {p.status === 'pending' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800/60">
                      <button
                        onClick={() => onReviewPayment(p.id, 'completed')}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                        id={`approve-payment-${p.id}`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onReviewPayment(p.id, 'failed')}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-rose-400 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                        id={`decline-payment-${p.id}`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'courses' && (
        <div className="space-y-8">
          {/* Create New Course Form */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>Curate New Bilingual Course Syllabus</span>
            </h3>

            {formError && <p className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg mb-4">{formError}</p>}
            {formSuccess && <p className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg mb-4">{formSuccess}</p>}

            <form onSubmit={handleSubmitCourse} className="space-y-4 text-xs">
              
              {/* Row 1: Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Course Title (English)</label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Modern Web Engineering"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Course Title (Afaan Oromo)</label>
                  <input
                    type="text"
                    value={titleOr}
                    onChange={(e) => setTitleOr(e.target.value)}
                    placeholder="e.g. Seensa Saayinsii Weebii"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Row 2: Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="Provide English syllabus details..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Description (Afaan Oromo)</label>
                  <textarea
                    rows={2}
                    value={descOr}
                    onChange={(e) => setDescOr(e.target.value)}
                    placeholder="Ibsa koorsii kaffaltii guuti..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Row 3: Category, Image, Instructor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Software">Software Engineering</option>
                    <option value="Agriculture">Modern Agriculture</option>
                    <option value="Finance">Financial Literacy</option>
                    <option value="Language">Bilingualism</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Course Cover Image URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Leave empty for premium default"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Instructor Name</label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Syllabus Lesson 1 Setup */}
              <div className="border-t border-zinc-800/80 pt-4 mt-4">
                <h4 className="font-bold text-white mb-2 text-xs uppercase text-emerald-400">First Core Lesson Material</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Lesson Title (English)</label>
                    <input
                      type="text"
                      value={lessonTitleEn}
                      onChange={(e) => setLessonTitleEn(e.target.value)}
                      placeholder="e.g. Modern Web Ecosystem"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Lesson Title (Afaan Oromo)</label>
                    <input
                      type="text"
                      value={lessonTitleOr}
                      onChange={(e) => setLessonTitleOr(e.target.value)}
                      placeholder="e.g. Adeemsa Weebii Ammayyaa"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-zinc-400 mb-1">Lesson Content (English)</label>
                    <textarea
                      rows={2}
                      value={lessonContentEn}
                      onChange={(e) => setLessonContentEn(e.target.value)}
                      placeholder="English lesson study notes..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Lesson Content (Afaan Oromo)</label>
                    <textarea
                      rows={2}
                      value={lessonContentOr}
                      onChange={(e) => setLessonContentOr(e.target.value)}
                      placeholder="Ibsa barumsa afaan oromoo..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-5 py-3 rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                  id="admin-submit-course-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>Curate & Publish Course</span>
                </button>
              </div>

            </form>
          </div>

          {/* Existing Courses Catalog */}
          <div>
            <h3 className="text-base font-bold text-white mb-4">Syllabus Catalog</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map((c) => (
                <div key={c.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <BilingualText 
                      en={c.title_en} 
                      or={c.title_or} 
                      layout="stacked" 
                      enClassName="text-sm font-bold text-white" 
                      orClassName="text-xs text-emerald-400" 
                    />
                    <p className="text-[11px] text-zinc-500 mt-2">Instructor: {c.instructor_name}</p>
                    <p className="text-[11px] text-zinc-500">Price: 200 Birr / 200 Birrii</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-mono">{c.lessons.length} lessons</span>
                    <button
                      onClick={() => onDeleteCourse(c.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:border-rose-500/20 transition-all"
                      title="Delete Course"
                      id={`delete-course-btn-${c.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'schema' && (
        <DatabaseDocs />
      )}

    </div>
  );
}
