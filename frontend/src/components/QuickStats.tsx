// This component shows quick statistics about habits and progress
// Displays key metrics in an attractive card format

import React, { useState, useEffect, useCallback } from 'react';
import { CheckIn } from '../types';
import { getHabits, getHabitCheckins } from '../services/api';
import './QuickStats.css';

const QuickStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    completionRate: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Calculate statistics
  const loadStats = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const habitsData = await getHabits();
        const totalHabits = habitsData.length;
        
        // Get check-ins for all habits
        const allCheckins: CheckIn[] = [];
        for (const habit of habitsData) {
          try {
            const habitCheckins = await getHabitCheckins(habit.id, 100); // Get up to 100 check-ins, no offset
            allCheckins.push(...habitCheckins);
          } catch (err) {
            console.warn(`Failed to load check-ins for habit ${habit.id}:`, err);
          }
        }
        
        // Calculate today's completion
        const todayCheckins = allCheckins.filter((checkin: CheckIn) => 
          checkin.date === today && checkin.completed
        );
        const completedToday = todayCheckins.length;
        
        // Calculate completion rate (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];
        
        const weekCheckins = allCheckins.filter((checkin: CheckIn) => 
          checkin.date >= weekAgoStr && checkin.completed
        );
        const totalWeekCheckins = allCheckins.filter((checkin: CheckIn) => 
          checkin.date >= weekAgoStr
        );
        
        const completionRate = totalWeekCheckins.length > 0 
          ? Math.round((weekCheckins.length / totalWeekCheckins.length) * 100)
          : 0;

        // Calculate current streak (simplified - consecutive completed days)
        let currentStreak = 0;
        const sortedCheckins = allCheckins
          .filter((checkin: CheckIn) => checkin.completed)
          .sort((a: CheckIn, b: CheckIn) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (sortedCheckins.length > 0) {
          let currentDate = new Date(today);
          for (let i = 0; i < 30; i++) { // Check last 30 days max
            const dateStr = currentDate.toISOString().split('T')[0];
            const hasCompleted = sortedCheckins.some((checkin: CheckIn) => checkin.date === dateStr); 
            
            if (hasCompleted) {
              currentStreak++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }
        }

        setStats({
          totalHabits,
          completedToday,
          completionRate,
          currentStreak
        });
        
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    }, [today]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="quick-stats">
        <h3>Quick Stats</h3>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card loading">
              <div className="stat-skeleton"></div>
              <div className="stat-skeleton-small"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quick-stats">
        <h3>Quick Stats</h3>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Habits',
      value: stats.totalHabits,
      icon: '🎯',
      color: '#667eea'
    },
    {
      label: 'Completed Today',
      value: `${stats.completedToday}/${stats.totalHabits}`,
      icon: '✅',
      color: '#27ae60'
    },
    {
      label: 'Success Rate',
      value: `${stats.completionRate}%`,
      icon: '📊',
      color: '#f39c12'
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: '🔥',
      color: '#e74c3c'
    }
  ];

  return (
    <div className="quick-stats">
      <h3>Quick Stats</h3>
      <div className="stats-grid">
        {statItems.map((item, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
