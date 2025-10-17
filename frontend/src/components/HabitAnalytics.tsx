// This component shows analytics for individual habits
// Displays streaks, success rates, and calendar view

import React, { useState, useEffect } from 'react';
import { Habit, HabitStreak, HabitStats } from '../types';
import { getHabits, getHabitStreak, getHabitStats } from '../services/api';
import './HabitAnalytics.css';

const HabitAnalytics: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitStats, setHabitStats] = useState<HabitStats | null>(null);
  const [habitStreak, setHabitStreak] = useState<HabitStreak | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        setLoading(true);
        setError(null);
        const habitsData = await getHabits();
        setHabits(habitsData);
        
        if (habitsData.length > 0) {
          setSelectedHabit(habitsData[0]);
        }
      } catch (err) {
        setError('Failed to load habits');
        console.error('Error loading habits:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, []);

  useEffect(() => {
    if (selectedHabit) {
      loadHabitAnalytics(selectedHabit.id);
    }
  }, [selectedHabit]);

  const loadHabitAnalytics = async (habitId: number) => {
    try {
      setLoading(true);
      const [statsData, streakData] = await Promise.all([
        getHabitStats(habitId),
        getHabitStreak(habitId)
      ]);
      
      setHabitStats(statsData);
      setHabitStreak(streakData);
    } catch (err) {
      console.error('Error loading habit analytics:', err);
      setError('Failed to load habit analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleHabitChange = (habit: Habit) => {
    setSelectedHabit(habit);
  };

  if (loading && habits.length === 0) {
    return (
      <div className="habit-analytics">
        <h3>Habit Analytics</h3>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading habits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="habit-analytics">
        <h3>Habit Analytics</h3>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="habit-analytics">
        <h3>Habit Analytics</h3>
        <div className="empty-container">
          <div className="empty-icon">📊</div>
          <p>No habits found. Create some habits to see analytics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="habit-analytics">
      <h3>Habit Analytics</h3>
      
      {/* Habit Selector */}
      <div className="habit-selector">
        <div className="selector-container">
          <label htmlFor="habit-select" className="selector-label">
            <span className="selector-icon">📈</span>
            Analyze Habit
          </label>
          <div className="select-wrapper">
            <select
              id="habit-select"
              value={selectedHabit?.id || ''}
              onChange={(e) => {
                const habit = habits.find(h => h.id === parseInt(e.target.value));
                if (habit) handleHabitChange(habit);
              }}
              className="habit-select"
            >
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.name} • {habit.category} • {habit.frequency}
                </option>
              ))}
            </select>
            <div className="select-arrow">▼</div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      {selectedHabit && (
        <div className="analytics-content">
          {/* Habit Info */}
          <div className="habit-info">
            <h4>{selectedHabit.name}</h4>
            <p className="habit-category">{selectedHabit.category}</p>
            {selectedHabit.description && (
              <p className="habit-description">{selectedHabit.description}</p>
            )}
          </div>


          {/* Streak Information */}
          {habitStreak && (
            <div className="streak-section">
              <h5>Streak Information</h5>
              <div className="streak-grid">
                <div className="streak-item current">
                  <span className="streak-label">Current Streak</span>
                  <span className="streak-value">{habitStreak.current_streak} days</span>
                </div>
                <div className="streak-item longest">
                  <span className="streak-label">Longest Streak</span>
                  <span className="streak-value">{habitStreak.longest_streak} days</span>
                </div>
                <div className="streak-item last">
                  <span className="streak-label">Last Check-in</span>
                  <span className="streak-value">
                    {habitStreak.last_checkin_date 
                      ? new Date(habitStreak.last_checkin_date).toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Day of Week Analysis */}
          {habitStats && habitStats.checkins_by_day && (
            <div className="day-analysis">
              <h5>Best Days</h5>
              <div className="day-grid">
                {Object.entries(habitStats.checkins_by_day)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([day, count]) => (
                    <div key={day} className="day-item">
                      <span className="day-name">{day}</span>
                      <span className="day-count">{count} check-ins</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HabitAnalytics;
