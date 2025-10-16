// This file defines the "shape" of our data
// Think of it like a blueprint for what each piece of data should look like

// ========================================
// CORE DATA MODELS (matching our backend)
// ========================================

export interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';  // Can only be 'daily' or 'weekly'
  category: string;
  start_date: string;  // Date as string (e.g., "2024-01-15")
  created_at: string;  // When the habit was created
}

export interface CheckIn {
  id: number;
  habit_id: number;  // Which habit this check-in belongs to
  date: string;      // Date when checked in (e.g., "2024-01-15")
  notes: string;     // Optional notes about the check-in
  completed: boolean; // true if completed, false if missed
  created_at: string; // When the check-in was recorded
}

export interface Category {
  id: number;
  name: string;
}

// ========================================
// ANALYTICS DATA (from our backend analytics)
// ========================================

export interface HabitStreak {
  habit_id: number;
  habit_name: string;
  current_streak: number;    // How many days in a row currently
  longest_streak: number;    // Best streak ever achieved
  last_checkin_date: string; // Most recent check-in date
}

export interface HabitStats {
  habit_id: number;
  habit_name: string;
  start_date: string;
  days_since_start: number;  // How long the habit has been tracked
  total_checkins: number;    // Total number of check-ins
  total_completed: number;   // How many were completed
  success_rate: number;      // Percentage of success (e.g., 85.5)
  checkins_by_day: Record<string, number>; // How many check-ins per day of week
  last_updated: string;
}

export interface CalendarData {
  habit_id: number;
  habit_name: string;
  date_range: {
    start_date: string;
    end_date: string;
    days: number;
  };
  calendar_data: Record<string, {
    date: string;
    completed: boolean;
    notes: string;
    checkin_id: number;
  }>;
}

export interface OverallAnalytics {
  total_habits: number;
  total_checkins: number;
  total_completed: number;
  overall_success_rate: number;
  habits_with_streaks: number;
  category_stats: Record<string, {
    count: number;
    completed: number;
    total: number;
  }>;
  last_updated: string;
}

// ========================================
// FORM DATA TYPES (for creating/updating)
// ========================================

export interface CreateHabitData {
  name: string;
  description?: string;  // Optional (the ? means it's not required)
  frequency: 'daily' | 'weekly';
  category: string;
  start_date?: string;   // Optional, defaults to today
}

export interface CreateCheckInData {
  date?: string;         // Optional, defaults to today
  notes?: string;        // Optional
  completed?: boolean;   // Optional, defaults to true
}

export interface UpdateHabitData {
  name?: string;
  description?: string;
  frequency?: 'daily' | 'weekly';
  category?: string;
  start_date?: string;
}

export interface UpdateCheckInData {
  notes?: string;
  completed?: boolean;
}

// ========================================
// API RESPONSE TYPES (what we get from backend)
// ========================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total_count: number;
  limit?: number;
  offset?: number;
}
