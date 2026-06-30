/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Terminal, 
  User, 
  Flame, 
  Trophy, 
  Compass, 
  Database, 
  Layers, 
  Lock, 
  CreditCard,
  Check,
  AlertCircle
} from 'lucide-react';
import { Course, Enrollment, Profile, Payment } from './types';
import BilingualText from './components/BilingualText';
import CourseCard from './components/CourseCard';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import AITutor from './components/AITutor';
import DatabaseDocs from './components/DatabaseDocs';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'dashboard' | 'tutor' | 'tech' | 'admin'>('explore');
  
  // App state from custom backend API
  const [courses, setCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkout modal state
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('CBE Birr');
  const [transactionRef, setTransactionRef] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Fetch all states from Express full-stack API on boot
  const fetchAllData = async () => {
    try {
      const [coursesRes, profileRes, enrollmentsRes, paymentsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/profile'),
        fetch('/api/enrollments'),
        fetch('/api/payments')
      ]);

      const coursesData = await coursesRes.json();
      const profileData = await profileRes.json();
      const enrollmentsData = await enrollmentsRes.json();
      const paymentsData = await paymentsRes.json();

      setCourses(coursesData);
      setProfile(profileData);
      setEnrollments(enrollmentsData);
      setPayments(paymentsData);
    } catch (err) {
      console.error("Error synchronizing Amoo Academy state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Student buys course (Submits payment references)
  const handleEnrollCourse = (course: Course) => {
    setSelectedCourseForPayment(course);
    setTransactionRef(`CBE-TX-${Math.floor(1000000 + Math.random() * 9000000)}`); // pre-populate with mock ref
    setCheckoutError('');
    setCheckoutSuccess(false);
  };

  const submitPaymentReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForPayment || !transactionRef.trim()) {
      setCheckoutError("Please enter a valid Transaction Reference. / Maaloo kaffaltii guuti.");
      return;
    }

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: selectedCourseForPayment.id,
          payment_method: paymentMethod,
          transaction_ref: transactionRef
        })
      });

      const data = await res.json();
      if (res.ok) {
        setCheckoutSuccess(true);
        setTimeout(async () => {
          setSelectedCourseForPayment(null);
          await fetchAllData();
          // Redirect student to admin tab to approve for easier testing
          setActiveTab('admin');
        }, 2500);
      } else {
        setCheckoutError(data.error || "Payment submission failed.");
      }
    } catch (err) {
      setCheckoutError("Error reaching Amoo billing engine.");
    }
  };

  // Student completes a lesson in Dashboard player
  const handleCompleteLesson = async (courseId: string, lessonId: string) => {
    try {
      const res = await fetch('/api/enrollments/lesson-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, lesson_id: lessonId })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Profile points booster
  const handleUpdatePoints = async (pointsEarned: number) => {
    if (!profile) return;
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_points: profile.current_points + pointsEarned })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Adds a new course
  const handleAdminAddCourse = async (courseData: Partial<Course>) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Deletes a course
  const handleAdminDeleteCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Reviews and completes payment
  const handleAdminReviewPayment = async (paymentId: string, status: 'completed' | 'failed') => {
    try {
      const res = await fetch('/api/payments/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId, status })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helpers
  const isStudentEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  };

  const isPaymentPending = (courseId: string) => {
    return payments.some(p => p.course_id === courseId && p.status === 'pending');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/35 selection:text-white pb-12">
      
      {/* Dynamic Background Noise / Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* NAVIGATION HEADER BAR */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center shadow-lg shadow-emerald-950/20">
              <GraduationCap className="w-5.5 h-5.5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white tracking-tight text-lg">Amoo Academy</span>
                <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/20 tracking-wider">PREMIUM</span>
              </div>
              <p className="text-[9px] text-zinc-500 tracking-wider font-semibold uppercase">English & Afaan Oromo</p>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'explore' 
                  ? 'bg-emerald-500 text-zinc-950 shadow' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <BilingualText en="Explore" or="Koorsee" layout="stacked" enClassName="text-[11px] font-bold" orClassName="hidden" />
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-500 text-zinc-950 shadow' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <BilingualText en="My Portal" or="Portal-koo" layout="stacked" enClassName="text-[11px] font-bold" orClassName="hidden" />
            </button>
            <button
              onClick={() => setActiveTab('tutor')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'tutor' 
                  ? 'bg-emerald-500 text-zinc-950 shadow' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <BilingualText en="AI Tutor" or="Gargaara" layout="stacked" enClassName="text-[11px] font-bold" orClassName="hidden" />
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'tech' 
                  ? 'bg-emerald-500 text-zinc-950 shadow' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <BilingualText en="SQL Engine" or="Dhaabbata" layout="stacked" enClassName="text-[11px] font-bold" orClassName="hidden" />
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border ${
                activeTab === 'admin' 
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-500' 
                  : 'text-zinc-400 hover:text-white border-zinc-800 bg-zinc-950/40'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400 group-hover:text-zinc-950" />
              <span>Admin Panel</span>
            </button>
          </nav>

          {/* User Status Stats Profile Quick Badge */}
          {profile && (
            <div className="flex items-center gap-2.5 bg-zinc-900/40 border border-zinc-850 px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-1" title="Daily streak">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-white">{profile.streak_days}d</span>
              </div>
              <div className="w-px h-4 bg-zinc-800" />
              <div className="flex items-center gap-1" title="Amoo points earned">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold text-emerald-400">{profile.current_points} pts</span>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* MOBILE FLOATING TABS BAR */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-2 flex justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === 'explore' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === 'dashboard' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Portal</span>
        </button>
        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === 'tutor' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Tutor</span>
        </button>
        <button
          onClick={() => setActiveTab('tech')}
          className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === 'tech' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>SQL</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === 'admin' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-8 pb-20">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <p className="text-xs text-zinc-500 italic">Booting Amoo Academy full-stack core...</p>
          </div>
        ) : (
          
          <div className="space-y-12">
            
            {/* HERO HERO SECTION / LANDING OVERVIEW */}
            {activeTab === 'explore' && (
              <div className="bg-zinc-950/60 border border-zinc-850 rounded-3xl p-6 md:p-12 relative overflow-hidden flex flex-col gap-6 md:gap-8 justify-center min-h-[300px]">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 left-10 w-48 h-48 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Empowering East Africa with Premium Skills
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Learn Without Boundaries, <br className="hidden md:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                      Bilingually Everywhere.
                    </span>
                  </h1>

                  <div className="pt-2 text-zinc-400 text-sm md:text-base leading-relaxed space-y-1">
                    <p>
                      Master software development, modern agriculture, and digital banking practices explained concurrently in <span className="text-zinc-200 font-semibold">English</span> and <span className="text-emerald-400 font-semibold italic">Afaan Oromo</span>.
                    </p>
                    <p className="text-xs text-zinc-500 italic">
                      Qophii weebsaayitiitii fi qonna ammayyaa baradhu, hundi afaan lamaaniin qopha'eera.
                    </p>
                  </div>
                </div>

                {/* Constant pricing offer card row */}
                <div className="flex flex-wrap items-center gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl w-fit">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">FIXED VALUE PLAN / GATII DHAABBATAA</p>
                      <p className="text-xs text-emerald-400 font-bold">200 Birr / 200 Birrii <span className="text-zinc-500 font-normal">per course enrollment</span></p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: EXPLORE SYLLABUS DIRECTORY */}
            {activeTab === 'explore' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Compass className="w-6 h-6 text-emerald-400" />
                    <span>Explore Syllabi / Koorsiiwwan Filataman</span>
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">Select from our premium curated tracks. Instant student portal activation once billing is reviewed.</p>
                </div>

                {/* Bento Grid Course Directory */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isEnrolled={isStudentEnrolled(course.id)}
                      isPendingPayment={isPaymentPending(course.id)}
                      onEnroll={() => handleEnrollCourse(course)}
                      onSelect={() => {
                        setActiveTab('dashboard');
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: STUDENT LEARNING DASHBOARD */}
            {activeTab === 'dashboard' && profile && (
              <Dashboard
                profile={profile}
                courses={courses}
                enrollments={enrollments}
                onCompleteLesson={handleCompleteLesson}
                onUpdatePoints={handleUpdatePoints}
              />
            )}

            {/* TAB CONTENT: STANDALONE BILINGUAL AI TUTOR */}
            {activeTab === 'tutor' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Active Scholar virtual helper</h2>
                  <p className="text-xs text-zinc-500 mt-1">Chat about code, agricultural irrigation, or currency values in any combination of English & Afaan Oromo.</p>
                </div>
                <AITutor />
              </div>
            )}

            {/* TAB CONTENT: TECHNICAL SQL & TREE BLUEPRINTS */}
            {activeTab === 'tech' && (
              <div className="max-w-5xl mx-auto">
                <DatabaseDocs />
              </div>
            )}

            {/* TAB CONTENT: ADMINISTRATIVE PORTAL */}
            {activeTab === 'admin' && (
              <AdminPanel
                courses={courses}
                payments={payments}
                onAddCourse={handleAdminAddCourse}
                onDeleteCourse={handleAdminDeleteCourse}
                onReviewPayment={handleAdminReviewPayment}
              />
            )}

          </div>
        )}

      </main>

      {/* BILLING / CHECKOUT POPUP MODAL */}
      {selectedCourseForPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative overflow-hidden space-y-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Enrollment Billing</span>
              </h3>
              <button 
                onClick={() => setSelectedCourseForPayment(null)}
                className="text-zinc-500 hover:text-white text-xs bg-zinc-900 p-1 px-2 rounded border border-zinc-800"
              >
                Cancel
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Payment Submitted Successfully!</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Transaction <span className="text-emerald-400 font-mono font-bold">{transactionRef}</span> registered. Please switch to the admin panel to instantly approve your transaction and start barachuu!
                </p>
                <div className="text-[10px] text-zinc-500 italic">Redirecting to billing auditor...</div>
              </div>
            ) : (
              <form onSubmit={submitPaymentReceipt} className="space-y-4 text-xs">
                
                {/* Product Summary */}
                <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
                  <BilingualText 
                    en={selectedCourseForPayment.title_en} 
                    or={selectedCourseForPayment.title_or} 
                    layout="stacked"
                    enClassName="font-bold text-white text-xs"
                    orClassName="text-[10px] text-emerald-400"
                  />
                  <div className="flex justify-between mt-2.5 pt-2 border-t border-zinc-800/80 text-zinc-400 font-mono">
                    <span>Amount:</span>
                    <span className="text-emerald-400 font-bold">200 Birr / 200 Birrii</span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-lg text-rose-400 flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Payment Option */}
                <div className="space-y-2">
                  <label className="block text-zinc-400 font-medium">Select Payment Gateway / Filadhu</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['CBE Birr', 'Telebirr', 'E-Birr'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPaymentMethod(opt)}
                        className={`py-2 rounded-lg border font-bold text-center transition-all ${
                          paymentMethod === opt 
                            ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400' 
                            : 'bg-zinc-900/60 border-zinc-850 text-zinc-500'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 text-[10px] text-zinc-400 space-y-1">
                  <span className="font-bold text-white block uppercase">Ethiopian Banking Demo Protocol:</span>
                  <p>1. Transfer <span className="text-emerald-400 font-bold">200 Birr</span> via {paymentMethod}.</p>
                  <p>2. Paste your reference number below to register with the Amoo financial log.</p>
                </div>

                {/* Reference Input */}
                <div className="space-y-1.5">
                  <label className="block text-zinc-400">Transaction Reference Code (FT...)</label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Enter CBE or Telebirr reference code"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  id="checkout-confirm-btn"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Payment Reference</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
