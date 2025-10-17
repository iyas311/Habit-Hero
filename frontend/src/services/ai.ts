/**
 * AI Service for Habit Suggestions
 * Communicates with backend AI endpoints for habit suggestions and analysis
 */

import api from './api';

// Types for AI responses
export interface HabitSuggestion {
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly';
  reason: string;
}

export interface AIAnalysis {
  performance_score: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export interface AISuggestionsResponse {
  suggestions: HabitSuggestion[];
  message: string;
}

export interface AIAnalysisResponse {
  analysis: AIAnalysis;
  message: string;
}

export interface AIHealthResponse {
  status: 'healthy' | 'unhealthy';
  message: string;
  api_configured: boolean;
  test_suggestions_count?: number;
}

export interface AICategoriesResponse {
  categories: string[];
  message: string;
}

/**
 * Get AI-powered habit suggestions
 * @param goals - Optional user goals for personalized suggestions
 * @param excludeCategories - Categories to exclude from suggestions
 * @returns Promise with AI-generated habit suggestions
 */
export const getAISuggestions = async (
  goals?: string,
  excludeCategories?: string[]
): Promise<AISuggestionsResponse> => {
  try {
    const requestData = {
      goals: goals || '',
      exclude_categories: excludeCategories || []
    };

    // AI requests may take longer due to retry logic, so increase timeout
    const response = await api.post<AISuggestionsResponse>('/ai/suggestions', requestData, {
      timeout: 30000  // 30 seconds timeout for AI requests
    });
    return response.data;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    throw error;
  }
};

/**
 * Get simple AI suggestions without user input (GET request)
 * @returns Promise with AI-generated habit suggestions
 */
export const getSimpleAISuggestions = async (): Promise<AISuggestionsResponse> => {
  try {
    const response = await api.get<AISuggestionsResponse>('/ai/suggestions');
    return response.data;
  } catch (error) {
    console.error('Error getting simple AI suggestions:', error);
    throw error;
  }
};

/**
 * Analyze user's habit patterns with AI
 * @returns Promise with AI analysis of habit patterns
 */
export const getAIAnalysis = async (): Promise<AIAnalysisResponse> => {
  try {
    const response = await api.get<AIAnalysisResponse>('/ai/analysis');
    return response.data;
  } catch (error) {
    console.error('Error getting AI analysis:', error);
    throw error;
  }
};

/**
 * Check AI service health
 * @returns Promise with AI service status
 */
export const checkAIHealth = async (): Promise<AIHealthResponse> => {
  try {
    const response = await api.get<AIHealthResponse>('/ai/health');
    return response.data;
  } catch (error) {
    console.error('Error checking AI health:', error);
    throw error;
  }
};

/**
 * Get AI-suggested habit categories
 * @returns Promise with list of suggested categories
 */
export const getAICategories = async (): Promise<AICategoriesResponse> => {
  try {
    const response = await api.get<AICategoriesResponse>('/ai/categories');
    return response.data;
  } catch (error) {
    console.error('Error getting AI categories:', error);
    throw error;
  }
};

/**
 * Create a habit from AI suggestion
 * @param suggestion - The AI suggestion to convert to a habit
 * @returns Promise with created habit data
 */
export const createHabitFromSuggestion = async (suggestion: HabitSuggestion) => {
  try {
    const habitData = {
      name: suggestion.name,
      description: suggestion.description,
      category: suggestion.category,
      frequency: suggestion.frequency,
      start_date: new Date().toLocaleDateString('en-CA')
    };

    const response = await api.post('/habits', habitData);
    return response.data;
  } catch (error) {
    console.error('Error creating habit from suggestion:', error);
    throw error;
  }
};


