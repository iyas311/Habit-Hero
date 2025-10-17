/**
 * Reports API service for generating and downloading PDF reports
 */

import api from './api';

// Types for report data
export interface ReportAnalytics {
  total_habits: number;
  total_checkins: number;
  total_completed: number;
  overall_success_rate: number;
  current_streak: number;
  categories: Record<string, number>;
  habit_performance: HabitPerformance[];
  date_range: {
    start_date: string | null;
    end_date: string | null;
  };
}

export interface HabitPerformance {
  id: number;
  name: string;
  category: string;
  frequency: string;
  success_rate: number;
  current_streak: number;
}

export interface ReportOptions {
  start_date?: string;
  end_date?: string;
}

/**
 * Generate and download a PDF report of habit progress
 * @param options - Report generation options
 */
export const generatePDFReport = async (options: ReportOptions = {}): Promise<void> => {
  try {
    const params = new URLSearchParams();
    
    if (options.start_date) {
      params.append('start_date', options.start_date);
    }
    
    if (options.end_date) {
      params.append('end_date', options.end_date);
    }
    
    const queryString = params.toString();
    const url = `/habits/pdf${queryString ? `?${queryString}` : ''}`;
    
    // Make the request and handle the PDF download
    const response = await fetch(`${api.defaults.baseURL}${url}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate PDF report: ${response.statusText}`);
    }
    
    // Get the filename from the Content-Disposition header or create a default one
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'habit_hero_report.pdf';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Create blob and download
    const blob = await response.blob();
    const url_blob = window.URL.createObjectURL(blob);
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url_blob;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url_blob);
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

/**
 * Get analytics data for report preview
 * @param options - Report options
 * @returns Promise<ReportAnalytics>
 */
export const getReportAnalytics = async (options: ReportOptions = {}): Promise<ReportAnalytics> => {
  try {
    const params = new URLSearchParams();
    
    if (options.start_date) {
      params.append('start_date', options.start_date);
    }
    
    if (options.end_date) {
      params.append('end_date', options.end_date);
    }
    
    const queryString = params.toString();
    const url = `/habits/analytics${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<ReportAnalytics>(url);
    return response.data;
    
  } catch (error) {
    console.error('Error getting report analytics:', error);
    throw error;
  }
};
