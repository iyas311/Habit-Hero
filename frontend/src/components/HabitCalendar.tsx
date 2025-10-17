// This component shows a calendar view for a selected habit
// Displays all days from start date with check-in status and notes

import React, { useState, useEffect, useCallback } from 'react';
import { Habit, CheckIn } from '../types';
import { getHabits, getHabitCheckins, createCheckin, updateCheckin } from '../services/api';
import './HabitCalendar.css';

interface HabitCalendarProps {
  selectedHabit: Habit | null;
  onHabitChange: (habit: Habit | null) => void;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ selectedHabit, onHabitChange }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCheckins = useCallback(async () => {
    if (!selectedHabit) return;

    try {
      setLoading(true);
      setError(null);
      const checkinsData = await getHabitCheckins(selectedHabit.id, 100);
      setCheckins(checkinsData);
    } catch (err) {
      setError('Failed to load check-ins');
      console.error('Error loading check-ins:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedHabit]);

  // Load habits when component mounts
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const habitsData = await getHabits();
        setHabits(habitsData);
        if (habitsData.length > 0 && !selectedHabit) {
          onHabitChange(habitsData[0]);
        }
      } catch (err) {
        setError('Failed to load habits');
        console.error('Error loading habits:', err);
      }
    };
    loadHabits();
  }, [selectedHabit, onHabitChange]);

  // Load check-ins when habit changes
  useEffect(() => {
    if (selectedHabit) {
      loadCheckins();
    }
  }, [selectedHabit, loadCheckins]);

  // Generate all dates from habit start date to today
  const generateDateRange = () => {
    if (!selectedHabit) return [];

    const startDate = new Date(selectedHabit.start_date);
    const today = new Date();
    const dates = [];

    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    return dates.reverse(); // Most recent first
  };

  // Check if a date is relevant for a weekly habit
  const isDateRelevantForHabit = (date: Date): boolean => {
    if (!selectedHabit) return false;
    
    if (selectedHabit.frequency === 'daily') {
      return true; // All dates are relevant for daily habits
    }
    
    if (selectedHabit.frequency === 'weekly') {
      // For weekly habits, only show dates that match the start date's day of week
      const startDate = new Date(selectedHabit.start_date);
      const startDayOfWeek = startDate.getDay();
      const dateDayOfWeek = date.getDay();
      
      return startDayOfWeek === dateDayOfWeek;
    }
    
    return false;
  };

  // Get check-in for a specific date
  const getCheckinForDate = (date: Date): CheckIn | null => {
    const dateStr = date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local timezone
    return checkins.find(checkin => checkin.date === dateStr) || null;
  };

  // Handle check-in status change
  const handleCheckinChange = async (date: Date, completed: boolean, notes: string = '') => {
    if (!selectedHabit) return;

    const dateStr = date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local timezone
    const existingCheckin = getCheckinForDate(date);

    try {
      if (existingCheckin) {
        // Update existing check-in
        const updatedCheckin = await updateCheckin(existingCheckin.id, {
          completed,
          notes: notes.trim()
        });
        setCheckins(prev => prev.map(c => c.id === existingCheckin.id ? updatedCheckin : c));
      } else {
        // Create new check-in
        const newCheckin = await createCheckin(selectedHabit.id, {
          date: dateStr,
          completed,
          notes: notes.trim()
        });
        setCheckins(prev => [...prev, newCheckin]);
      }
    } catch (err) {
      console.error('Error updating check-in:', err);
      setError('Failed to update check-in');
    }
  };

  // Handle habit selector change
  const handleHabitChange = (habitId: string) => {
    const habit = habits.find(h => h.id === parseInt(habitId));
    onHabitChange(habit || null);
  };

  const dates = generateDateRange();

  if (loading) {
    return (
      <div className="habit-calendar">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="habit-calendar">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <p className="error-message">{error}</p>
          <button onClick={loadCheckins} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="habit-calendar">
        <div className="empty-container">
          <span className="empty-icon">📅</span>
          <p className="empty-message">No habits found. Create some habits to see the calendar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="habit-calendar">
      <div className="calendar-header">
        <h3>Habit Calendar</h3>
        <div className="habit-selector">
          <div className="selector-container">
            <label htmlFor="habit-select" className="selector-label">
              <span className="selector-icon">📅</span>
              Select Habit:
            </label>
            <div className="select-wrapper">
              <select
                id="habit-select"
                value={selectedHabit?.id || ''}
                onChange={(e) => handleHabitChange(e.target.value)}
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
      </div>

      {selectedHabit && (
        <div className="calendar-content">
          <div className="habit-info">
            <h4>{selectedHabit.name}</h4>
            <p className="habit-details">
              <span className="category">{selectedHabit.category}</span>
              <span className="frequency">{selectedHabit.frequency}</span>
              <span className="start-date">Started: {new Date(selectedHabit.start_date).toLocaleDateString()}</span>
            </p>
            {selectedHabit.description && (
              <p className="habit-description">{selectedHabit.description}</p>
            )}
          </div>

          <div className="calendar-grid">
            {dates.map((date) => {
              const checkin = getCheckinForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isFuture = date > new Date();
              const isRelevant = isDateRelevantForHabit(date);

              return (
                <div
                  key={date.toLocaleDateString('en-CA')}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''} ${!isRelevant ? 'not-relevant' : ''} ${checkin?.completed ? 'completed' : checkin ? 'missed' : ''}`}
                >
                  <div className="day-header">
                    <span className="day-number">{date.getDate()}</span>
                    <span className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  </div>

                  <div className="day-content">
                    {isFuture ? (
                      <div className="future-day">
                        <span className="future-text">Future</span>
                      </div>
                    ) : !isRelevant ? (
                      <div className="not-relevant-day">
                        <span className="not-relevant-text">N/A</span>
                      </div>
                    ) : (
                      <div className="checkin-controls">
                        <div className="status-buttons">
                          <button
                            className={`status-btn completed ${checkin?.completed ? 'active' : ''}`}
                            onClick={() => handleCheckinChange(date, true, checkin?.notes || '')}
                            title="Mark as completed"
                          >
                            ✓
                          </button>
                          <button
                            className={`status-btn missed ${checkin && !checkin.completed ? 'active' : ''}`}
                            onClick={() => handleCheckinChange(date, false, checkin?.notes || '')}
                            title="Mark as missed"
                          >
                            ✗
                          </button>
                        </div>

                        <div className="notes-section">
                          <textarea
                            className="notes-input"
                            placeholder="Add notes..."
                            value={checkin?.notes || ''}
                            onChange={(e) => {
                              const notes = e.target.value;
                              if (checkin) {
                                handleCheckinChange(date, checkin.completed, notes);
                              } else {
                                // If no check-in exists, create one when notes are added
                                if (notes.trim()) {
                                  handleCheckinChange(date, true, notes);
                                }
                              }
                            }}
                            rows={2}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCalendar;
