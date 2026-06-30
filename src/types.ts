/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BilingualString {
  en: string;
  or: string; // Afaan Oromo
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  current_points: number;
  streak_days: number;
  completed_lessons: string[]; // lesson_ids
}

export interface Question {
  id: string;
  question_en: string;
  question_or: string;
  options_en: string[];
  options_or: string[];
  correct_index: number;
}

export interface Quiz {
  id: string;
  title_en: string;
  title_or: string;
  questions: Question[];
}

export interface Lesson {
  id: string;
  title_en: string;
  title_or: string;
  content_en: string;
  content_or: string;
  order: number;
  duration: string;
  category_en: string;
  category_or: string;
}

export interface Course {
  id: string;
  title_en: string;
  title_or: string;
  description_en: string;
  description_or: string;
  price: number; // Constant 200 Birr
  instructor_name: string;
  rating: number;
  enrolled_count: number;
  lessons: Lesson[];
  quiz?: Quiz;
  image_url: string;
  featured?: boolean;
  category: string;
}

export interface Enrollment {
  id: string;
  profile_id: string;
  course_id: string;
  enrolled_at: string;
  progress_percentage: number;
  completed_lessons: string[];
}

export interface Payment {
  id: string;
  profile_id: string;
  course_id: string;
  amount: number; // 200
  payment_method: string;
  transaction_ref: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
