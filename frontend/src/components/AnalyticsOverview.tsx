// This component shows overall analytics across all habits
// Displays streaks, success rates, and progress charts

import React, { useState, useEffect } from 'react';
import { Habit, CheckIn } from '../types';
import { getHabits, getHabitCheckins } from '../services/api';
import { generatePDFReport } from '../services/reports';
import './AnalyticsOverview.css';

const AnalyticsOverview: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalHabits: 0,
    totalCheckins: 0,
    totalCompleted: 0,
    overallSuccessRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageStreak: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all habits and their check-ins
        const habits = await getHabits();
        const allCheckins: CheckIn[] = [];
        
        for (const habit of habits) {
          try {
            const habitCheckins = await getHabitCheckins(habit.id, 100); // Get up to 100 check-ins, no offset
            allCheckins.push(...habitCheckins);
          } catch (err) {
            console.warn(`Failed to load check-ins for habit ${habit.id}:`, err);
          }
        }

        const totalHabits = habits.length;
        const totalCheckins = allCheckins.length;
        const totalCompleted = allCheckins.filter(checkin => checkin.completed).length;
        const overallSuccessRate = totalCheckins > 0 ? Math.round((totalCompleted / totalCheckins) * 100) : 0;

        // Calculate streaks
        const completedCheckins = allCheckins
          .filter(checkin => checkin.completed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastDate: Date | null = null;

        for (const checkin of completedCheckins) {
          const checkinDate = new Date(checkin.date);
          
          if (lastDate === null) {
            tempStreak = 1;
            lastDate = checkinDate;
          } else {
            const daysDiff = Math.floor((lastDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
              tempStreak++;
            } else if (daysDiff > 1) {
              longestStreak = Math.max(longestStreak, tempStreak);
              tempStreak = 1;
            }
            lastDate = checkinDate;
          }
        }

        longestStreak = Math.max(longestStreak, tempStreak);
        
        // Calculate current streak (consecutive days from today)
        const today = new Date();
        let currentDate = new Date(today);
        currentStreak = 0;
        
        // Create a set of completed dates for faster lookup
        const completedDates = new Set(completedCheckins.map(checkin => checkin.date));
        
        // Check consecutive days backwards from today (up to 365 days max)
        for (let i = 0; i < 365; i++) {
          const dateStr = currentDate.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local timezone
          
          if (completedDates.has(dateStr)) {
            currentStreak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }

        const averageStreak = longestStreak > 0 ? Math.round(longestStreak / 2) : 0;

        setAnalytics({
          totalHabits,
          totalCheckins,
          totalCompleted,
          overallSuccessRate,
          currentStreak,
          longestStreak,
          averageStreak
        });

      } catch (err) {
        setError('Failed to load analytics');
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  // Handle direct PDF download
  const handleDownloadReport = async () => {
    try {
      setIsGeneratingReport(true);
      await generatePDFReport();
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-overview">
        <h3>Analytics Overview</h3>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-overview">
        <h3>Analytics Overview</h3>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Habits',
      value: analytics.totalHabits,
      icon: '🎯',
      color: '#667eea'
    },
    {
      label: 'Total Check-ins',
      value: analytics.totalCheckins,
      icon: '📊',
      color: '#3498db'
    },
    {
      label: 'Completed',
      value: analytics.totalCompleted,
      icon: '✅',
      color: '#27ae60'
    },
    {
      label: 'Success Rate',
      value: `${analytics.overallSuccessRate}%`,
      icon: '📈',
      color: '#f39c12'
    },
    {
      label: 'Current Streak',
      value: `${analytics.currentStreak} days`,
      icon: '🔥',
      color: '#e74c3c'
    },
    {
      label: 'Best Streak',
      value: `${analytics.longestStreak} days`,
      icon: '🏆',
      color: '#9b59b6'
    }
  ];

  return (
    <div className="analytics-overview">
      <div className="analytics-header">
        <h3>Analytics Overview</h3>
        <button
          className="download-report-btn"
          onClick={handleDownloadReport}
          disabled={isGeneratingReport}
          title="Download Progress Report"
        >
          {isGeneratingReport ? '⏳ Generating...' : '📄 Download Report'}
        </button>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AnalyticsOverview;
