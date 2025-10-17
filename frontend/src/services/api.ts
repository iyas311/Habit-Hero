// This file handles all communication with our Flask backend
// Think of it as a "messenger" that sends requests and gets responses

import axios, { AxiosResponse } from 'axios';
import {
  Habit,
  CheckIn,
  Category,
  HabitStreak,
  HabitStats,
  CalendarData,
  OverallAnalytics,
  CreateHabitData,
  CreateCheckInData,
  UpdateHabitData,
  UpdateCheckInData,
  ApiResponse,
  PaginatedResponse
} from '../types';

// ========================================
// AXIOS CONFIGURATION
// ========================================

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',  // Our Flask backend URL
  timeout: 10000,  // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================
// HABIT OPERATIONS
// ========================================

/**
 * Get all habits from the backend
 * @returns Promise<Habit[]> - Array of all habits
 */
export const getHabits = async (): Promise<Habit[]> => {
  try {
    const response: AxiosResponse<Habit[]> = await api.get('/habits');
    return response.data;
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

/**
 * Create a new habit
 * @param habitData - The habit data to create
 * @returns Promise<Habit> - The created habit
 */
export const createHabit = async (habitData: CreateHabitData): Promise<Habit> => {
  try {
    const response: AxiosResponse<Habit> = await api.post('/habits', habitData);
    return response.data;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

/**
 * Get a specific habit by ID
 * @param id - The habit ID
 * @returns Promise<Habit> - The habit data
 */
export const getHabit = async (id: number): Promise<Habit> => {
  try {
    const response: AxiosResponse<Habit> = await api.get(`/habits/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching habit ${id}:`, error);
    throw error;
  }
};

/**
 * Update a habit
 * @param id - The habit ID
 * @param updates - The updates to apply
 * @returns Promise<Habit> - The updated habit
 */
export const updateHabit = async (id: number, updates: UpdateHabitData): Promise<Habit> => {
  try {
    const response: AxiosResponse<Habit> = await api.put(`/habits/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating habit ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a habit
 * @param id - The habit ID
 * @returns Promise<void>
 */
export const deleteHabit = async (id: number): Promise<void> => {
  try {
    await api.delete(`/habits/${id}`);
  } catch (error) {
    console.error(`Error deleting habit ${id}:`, error);
    throw error;
  }
};

// ========================================
// CHECK-IN OPERATIONS
// ========================================

/**
 * Get all check-ins for a specific habit
 * @param habitId - The habit ID
 * @param limit - Optional limit for pagination
 * @param offset - Optional offset for pagination
 * @returns Promise<CheckIn[]> - Array of check-ins
 */
export const getHabitCheckins = async (
  habitId: number,
  limit?: number,
  offset?: number
): Promise<CheckIn[]> => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const url = `/habits/${habitId}/checkins${queryString ? `?${queryString}` : ''}`;
    
    const response: AxiosResponse<PaginatedResponse<CheckIn>> = await api.get(url);
    return response.data.checkins || response.data;
  } catch (error) {
    console.error(`Error fetching check-ins for habit ${habitId}:`, error);
    throw error;
  }
};

/**
 * Create a check-in for a habit
 * @param habitId - The habit ID
 * @param checkinData - The check-in data
 * @returns Promise<CheckIn> - The created check-in
 */
export const createCheckin = async (
  habitId: number,
  checkinData: CreateCheckInData
): Promise<CheckIn> => {
  try {
    const response: AxiosResponse<CheckIn> = await api.post(
      `/habits/${habitId}/checkin`,
      checkinData
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating check-in for habit ${habitId}:`, error);
    throw error;
  }
};

/**
 * Update a check-in
 * @param checkinId - The check-in ID
 * @param updates - The updates to apply
 * @returns Promise<CheckIn> - The updated check-in
 */
export const updateCheckin = async (
  checkinId: number,
  updates: UpdateCheckInData
): Promise<CheckIn> => {
  try {
    const response: AxiosResponse<CheckIn> = await api.put(
      `/checkins/${checkinId}`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating check-in ${checkinId}:`, error);
    throw error;
  }
};

/**
 * Delete a check-in
 * @param checkinId - The check-in ID
 * @returns Promise<void>
 */
export const deleteCheckin = async (checkinId: number): Promise<void> => {
  try {
    await api.delete(`/checkins/${checkinId}`);
  } catch (error) {
    console.error(`Error deleting check-in ${checkinId}:`, error);
    throw error;
  }
};

// ========================================
// ANALYTICS OPERATIONS
// ========================================

/**
 * Get streak information for a habit
 * @param habitId - The habit ID
 * @returns Promise<HabitStreak> - The streak data
 */
export const getHabitStreak = async (habitId: number): Promise<HabitStreak> => {
  try {
    const response: AxiosResponse<HabitStreak> = await api.get(`/habits/${habitId}/streak`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching streak for habit ${habitId}:`, error);
    throw error;
  }
};

/**
 * Get statistics for a habit
 * @param habitId - The habit ID
 * @returns Promise<HabitStats> - The statistics data
 */
export const getHabitStats = async (habitId: number): Promise<HabitStats> => {
  try {
    const response: AxiosResponse<HabitStats> = await api.get(`/habits/${habitId}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stats for habit ${habitId}:`, error);
    throw error;
  }
};

/**
 * Get calendar data for a habit
 * @param habitId - The habit ID
 * @param days - Number of days to fetch (default: 30)
 * @returns Promise<CalendarData> - The calendar data
 */
export const getHabitCalendar = async (
  habitId: number,
  days: number = 30
): Promise<CalendarData> => {
  try {
    const response: AxiosResponse<CalendarData> = await api.get(
      `/habits/${habitId}/calendar?days=${days}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching calendar for habit ${habitId}:`, error);
    throw error;
  }
};

/**
 * Get overall analytics across all habits
 * @returns Promise<OverallAnalytics> - The overall analytics data
 */
export const getOverallAnalytics = async (): Promise<OverallAnalytics> => {
  try {
    const response: AxiosResponse<OverallAnalytics> = await api.get('/habits/analytics');
    return response.data;
  } catch (error) {
    console.error('Error fetching overall analytics:', error);
    throw error;
  }
};

// ========================================
// CATEGORY OPERATIONS
// ========================================

/**
 * Get all categories
 * @returns Promise<Category[]> - Array of all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response: AxiosResponse<Category[]> = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Create a new category
 * @param name - The category name
 * @returns Promise<Category> - The created category
 */
export const createCategory = async (name: string): Promise<Category> => {
  try {
    const response: AxiosResponse<Category> = await api.post('/categories', { name });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Get a specific category by ID
 * @param id - The category ID
 * @returns Promise<Category> - The category data
 */
export const getCategory = async (id: number): Promise<Category> => {
  try {
    const response: AxiosResponse<Category> = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

/**
 * Update a category
 * @param id - The category ID
 * @param updates - The updates to apply
 * @returns Promise<Category> - The updated category
 */
export const updateCategory = async (
  id: number,
  updates: { name: string }
): Promise<Category> => {
  try {
    const response: AxiosResponse<Category> = await api.put(`/categories/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a category
 * @param id - The category ID
 * @returns Promise<void>
 */
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};

// ========================================
// HEALTH CHECK
// ========================================

/**
 * Check if the backend is running
 * @returns Promise<boolean> - True if backend is accessible
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/');
    return response.status === 200;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default api;
