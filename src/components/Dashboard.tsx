/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, BookOpen, Flame, Star, CheckCircle, Play, ChevronRight, HelpCircle, GraduationCap, Check, ArrowLeft, Trophy } from 'lucide-react';
import { Course, Enrollment, Profile, Lesson, Quiz } from '../types';
import BilingualText from './BilingualText';
import AITutor from './AITutor';

interface DashboardProps {
  profile: Profile;
  courses: Course[];
  enrollments: Enrollment[];
  onCompleteLesson: (courseId: string, lessonId: string) => void;
  onUpdatePoints: (points: number) => void;
}

export default function Dashboard({
  profile,
  courses,
  enrollments,
  onCompleteLesson,
  onUpdatePoints
}: DashboardProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showTutor, setShowTutor] = useState(false);
  
  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Helper: Get Course info
  const getCourseInfo = (courseId: string): Course | undefined => {
    return courses.find(c => c.id === courseId);
  };

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = getCourseInfo(courseId);
    if (course && course.lessons.length > 0) {
      setSelectedLessonId(course.lessons[0].id);
    }
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const activeCourse = selectedCourseId ? getCourseInfo(selectedCourseId) : null;
  const activeEnrollment = enrollments.find(e => e.course_id === selectedCourseId);
  const activeLesson = activeCourse?.lessons.find(l => l.id === selectedLessonId);

  const handleLessonFinish = () => {
    if (selectedCourseId && selectedLessonId) {
      onCompleteLesson(selectedCourseId, selectedLessonId);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return profile.completed_lessons.includes(lessonId);
  };

  const handleQuizSubmit = (quiz: Quiz) => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct_index) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Reward points for taking quiz!
    if (score === quiz.questions.length) {
      onUpdatePoints(50); // Perfect score bonus
    } else {
      onUpdatePoints(20);
    }
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      
      {/* Back button when inside a course */}
      {selectedCourseId && (
        <button
          onClick={() => { setSelectedCourseId(null); setSelectedLessonId(null); }}
          className="text-zinc-400 hover:text-white flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 transition-all w-fit"
          id="dashboard-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <BilingualText en="Back to Student Portal" or="Gara Portal Barataa Deebi'i" layout="stacked" enClassName="text-xs font-semibold text-zinc-300" orClassName="text-[10px] text-zinc-500" />
        </button>
      )}

      {/* RENDER ACTIVE STUDENT STUDY INTERFACE */}
      {selectedCourseId && activeCourse && activeEnrollment ? (
        <div className="grid grid-cols-12 gap-6">
          
          {/* COURSE SYLLABUS MENU (Span 12 on mobile, Span 4 on desktop) */}
          <div className="col-span-12 lg:col-span-4 bg-zinc-950/60 border border-zinc-850 rounded-2xl p-5 flex flex-col gap-4 self-start">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">ACTIVE SYLLABUS / KOORSII</span>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">
                {activeCourse.title_en}
              </h3>
            </div>

            {/* Progress Badge */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-zinc-400">Course Progress:</span>
                <span className="text-emerald-400 font-bold ml-1">{activeEnrollment.progress_percentage}%</span>
              </div>
              <div className="w-24 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${activeEnrollment.progress_percentage}%` }} />
              </div>
            </div>

            {/* Lesson Select Grid */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Syllabus Lessons / Barnoota</span>
              {activeCourse.lessons.map((lesson) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isActive = lesson.id === selectedLessonId;
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => { setSelectedLessonId(lesson.id); setQuizSubmitted(false); }}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-emerald-500/10 border-emerald-500/40' 
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                    id={`select-lesson-${lesson.id}`}
                  >
                    <div className="flex gap-2.5 items-center">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold ${
                        isActive 
                          ? 'bg-emerald-500 text-zinc-950' 
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}>
                        {lesson.order}
                      </div>
                      <div className="overflow-hidden">
                        <BilingualText 
                          en={lesson.title_en} 
                          or={lesson.title_or} 
                          layout="stacked"
                          enClassName="text-xs font-bold text-white truncate"
                          orClassName="text-[10px] text-emerald-400/80 truncate mt-0.5"
                        />
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}

              {/* Course Quiz Selection Tile (Only if quiz exists) */}
              {activeCourse.quiz && (
                <button
                  onClick={() => setSelectedLessonId('quiz')}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                    selectedLessonId === 'quiz' 
                      ? 'bg-amber-500/10 border-amber-500/40' 
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                  id="select-course-quiz"
                >
                  <div className="flex gap-2.5 items-center">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs shrink-0 font-bold">
                      Q
                    </div>
                    <div>
                      <BilingualText 
                        en="Course Final Quiz" 
                        or="Madaallii Xumuraa" 
                        layout="stacked"
                        enClassName="text-xs font-bold text-amber-400"
                        orClassName="text-[10px] text-amber-500/80"
                      />
                    </div>
                  </div>
                  {quizSubmitted && (
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                  )}
                </button>
              )}
            </div>

            {/* Quick Helper Button */}
            <button
              onClick={() => setShowTutor(!showTutor)}
              className="mt-4 w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Tutor for help!</span>
            </button>
          </div>

          {/* STUDY CONTENT PLAYER (Span 12 on mobile, Span 8 on desktop) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {showTutor ? (
              <div className="border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="bg-zinc-900/80 p-3 px-4 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Active Virtual Study Room</span>
                  </span>
                  <button 
                    onClick={() => setShowTutor(false)} 
                    className="text-zinc-500 hover:text-white text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800"
                  >
                    Hide Tutor
                  </button>
                </div>
                <AITutor currentLesson={activeLesson} onClose={() => setShowTutor(false)} />
              </div>
            ) : null}

            {/* Quiz Content Renderer */}
            {selectedLessonId === 'quiz' && activeCourse.quiz ? (
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeCourse.quiz.title_en}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{activeCourse.quiz.title_or}</p>
                  </div>
                </div>

                {quizSubmitted ? (
                  <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-xl text-center space-y-4">
                    <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                    <h4 className="text-base font-bold text-white">Quiz Evaluation Complete!</h4>
                    <p className="text-xs text-zinc-400">
                      You scored <span className="text-emerald-400 font-bold text-sm">{quizScore} / {activeCourse.quiz.questions.length}</span> correct answers.
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Rewards: +{quizScore === activeCourse.quiz.questions.length ? '50' : '20'} Amoo points added to Ebisa's profile!
                    </p>
                    <button
                      onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                      className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-xs px-4 py-2 rounded-xl text-zinc-300 transition-all"
                    >
                      Retry Quiz
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeCourse.quiz.questions.map((q, qIdx) => (
                      <div key={q.id} className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl space-y-3">
                        <div className="flex gap-2">
                          <span className="text-amber-400 font-bold text-xs">{qIdx + 1}.</span>
                          <BilingualText 
                            en={q.question_en} 
                            or={q.question_or} 
                            layout="stacked"
                            enClassName="text-xs font-bold text-zinc-100"
                            orClassName="text-[11px] text-zinc-400"
                          />
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-2 pl-4">
                          {q.options_en.map((opt, oIdx) => (
                            <label 
                              key={oIdx}
                              className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                                quizAnswers[q.id] === oIdx 
                                  ? 'bg-amber-500/5 border-amber-500/45 text-white' 
                                  : 'bg-zinc-950/60 border-zinc-850 hover:border-zinc-700 text-zinc-400'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                checked={quizAnswers[q.id] === oIdx}
                                onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                                className="accent-amber-500"
                              />
                              <div className="text-[11px]">
                                <span className="font-semibold text-zinc-300">{opt}</span>
                                <span className="text-[10px] text-zinc-500 block italic">{q.options_or[oIdx]}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => activeCourse.quiz && handleQuizSubmit(activeCourse.quiz)}
                      disabled={Object.keys(quizAnswers).length < activeCourse.quiz.questions.length}
                      className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                      id="submit-quiz-btn"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Submit Answers / Deebii Kenni</span>
                    </button>
                  </div>
                )}
              </div>
            ) : activeLesson ? (
              /* Regular Lesson Content Player */
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden space-y-6 flex flex-col justify-between min-h-[420px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/10">
                      LESSON {activeLesson.order} / BARNOOTA {activeLesson.order}
                    </span>
                    <span className="text-zinc-500 font-mono text-xs">Estimated duration: {activeLesson.duration}</span>
                  </div>

                  {/* Dual Language Titles */}
                  <BilingualText 
                    en={activeLesson.title_en} 
                    or={activeLesson.title_or} 
                    layout="stacked" 
                    enClassName="text-xl md:text-2xl font-extrabold text-white" 
                    orClassName="text-xs text-emerald-400 font-semibold"
                  />

                  {/* Lesson Text Body Panels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900">
                    {/* English Panel */}
                    <div className="bg-zinc-900/40 border border-zinc-850/80 p-4.5 rounded-xl space-y-2">
                      <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block border-b border-zinc-800 pb-1">ENGLISH VERSION</span>
                      <p className="text-zinc-300 text-xs leading-relaxed font-normal whitespace-pre-wrap pt-1.5">
                        {activeLesson.content_en}
                      </p>
                    </div>

                    {/* Afaan Oromo Panel */}
                    <div className="bg-emerald-950/5 border border-emerald-900/10 p-4.5 rounded-xl space-y-2">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block border-b border-emerald-950/30 pb-1">HIREENTAA AFAAN OROMOO</span>
                      <p className="text-emerald-100/90 text-xs leading-relaxed font-normal whitespace-pre-wrap pt-1.5 italic">
                        {activeLesson.content_or}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Complete controls */}
                <div className="pt-6 border-t border-zinc-900 flex items-center justify-between gap-4 mt-8">
                  <div className="text-[10px] text-zinc-500">
                    Completing this lesson earns you <span className="text-emerald-400 font-bold">+10 points</span>
                  </div>

                  {isLessonCompleted(activeLesson.id) ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4" />
                      <span>Lesson Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleLessonFinish}
                      className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-950/30"
                      id="complete-lesson-button"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <BilingualText 
                        en="Complete Lesson" 
                        or="Barnoota Fixi" 
                        layout="stacked"
                        enClassName="text-xs font-bold text-zinc-950"
                        orClassName="text-[9px] text-zinc-900 font-semibold"
                      />
                    </button>
                  )}
                </div>

              </div>
            ) : null}

          </div>
        </div>
      ) : (
        /* STANDARD PORTAL STATE - STUDENT OVERVIEW & ENROLLED LIST */
        <div className="space-y-8">
          
          {/* Bento Grid Top Level Student Stats */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Cell 1: Student Welcome Title */}
            <div className="col-span-12 md:col-span-6 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <img 
                src={profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"} 
                alt={profile.name} 
                className="w-12 h-12 rounded-full border border-emerald-500/40 object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">STUDENT / BARATAA</span>
                <h3 className="text-base font-extrabold text-white mt-1">{profile.name}</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">{profile.email}</p>
              </div>
            </div>

            {/* Cell 2: Daily Streak */}
            <div className="col-span-6 md:col-span-3 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
              <span className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase">STUDY STREAK</span>
              <div className="flex items-end gap-2 mt-2">
                <Flame className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="text-2xl font-black text-white">{profile.streak_days}</span>
                <span className="text-zinc-500 text-[10px] font-semibold mb-1">DAYS</span>
              </div>
            </div>

            {/* Cell 3: Rewards Points */}
            <div className="col-span-6 md:col-span-3 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
              <span className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase">EARNED POINTS</span>
              <div className="flex items-end gap-2 mt-2">
                <Trophy className="w-8 h-8 text-emerald-400 fill-emerald-500/5" />
                <span className="text-2xl font-black text-white">{profile.current_points}</span>
                <span className="text-emerald-400 text-[10px] font-semibold mb-1">PTS</span>
              </div>
            </div>

          </div>

          {/* Enrolled Syllabus Modules List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>Your Syllabus enrollments / Koorsee Barachaa Jirtu</span>
            </h3>

            {enrollments.length === 0 ? (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 text-xs">
                No active enrollments. Explore course catalogs below to register for <span className="text-emerald-400 font-semibold">200 Birr</span>.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrollments.map((enroll) => {
                  const course = getCourseInfo(enroll.course_id);
                  if (!course) return null;

                  return (
                    <div 
                      key={enroll.id} 
                      className="bg-zinc-950/60 border border-zinc-800 hover:border-emerald-500/35 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all"
                      id={`enrolled-course-item-${course.id}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <BilingualText 
                            en={course.title_en} 
                            or={course.title_or} 
                            layout="stacked"
                            enClassName="text-sm font-bold text-white"
                            orClassName="text-xs text-emerald-400"
                          />
                          <p className="text-[10px] text-zinc-500 mt-2 font-mono">Category: {course.category} | {course.lessons.length} Lessons</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded uppercase">
                          ACTIVE
                        </span>
                      </div>

                      {/* Progress Bar & Buttons */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-500">
                            <span>Completeness:</span>
                            <span className="text-zinc-300 font-semibold">{enroll.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${enroll.progress_percentage}%` }} />
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenCourse(course.id)}
                          className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/30 text-zinc-200 text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                          id={`continue-learning-${course.id}`}
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500" />
                          <BilingualText 
                            en="Continue Learning" 
                            or="Barachuu Itti Fufi" 
                            layout="stacked"
                            enClassName="text-xs font-bold text-zinc-200"
                            orClassName="text-[9px] text-zinc-400"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
