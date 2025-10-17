// This component shows today's habits that need to be checked off
// Displays habits in a clean, actionable format

import React, { useState, useEffect, useCallback } from 'react';
import { Habit, CheckIn } from '../types';
import { getHabits, getHabitCheckins } from '../services/api';
import CheckInModal from './CheckInModal';
import './TodayHabits.css';

interface TodayHabitsProps {
  onCheckInSuccess?: () => void;
}

const TodayHabits: React.FC<TodayHabitsProps> = ({ onCheckInSuccess }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayCheckins, setTodayCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkInModal, setCheckInModal] = useState<{
    isOpen: boolean;
    habit: Habit | null;
  }>({ isOpen: false, habit: null });

  // Get today's date in YYYY-MM-DD format (using local timezone)
  const today = new Date().toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local timezone

  // Check if a habit should be shown today based on its frequency
  const shouldShowHabitToday = (habit: Habit): boolean => {
    if (habit.frequency === 'daily') {
      return true; // Daily habits always show
    }
    
    if (habit.frequency === 'weekly') {
      // Weekly habits should only show on the same day of the week as their start date
      const startDate = new Date(habit.start_date);
      const todayDate = new Date(today);
      
      // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const startDayOfWeek = startDate.getDay();
      const todayDayOfWeek = todayDate.getDay();
      
      return startDayOfWeek === todayDayOfWeek;
    }
    
    return false; // Unknown frequency
  };

  // Load habits and today's check-ins
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const habitsData = await getHabits();
      
      // Filter habits to only show those that should appear today
      const todaysHabits = habitsData.filter(shouldShowHabitToday);
      setHabits(todaysHabits);
      
      // Get check-ins for each habit and filter for today
      const allCheckins: CheckIn[] = [];
      for (const habit of todaysHabits) {
        try {
          const habitCheckins = await getHabitCheckins(habit.id, 100); // Get up to 100 check-ins, no offset
          allCheckins.push(...habitCheckins);
        } catch (err) {
          console.warn(`Failed to load check-ins for habit ${habit.id}:`, err);
        }
      }
      
      // Filter check-ins for today
      const todayCheckinsData = allCheckins.filter((checkin: CheckIn) => 
        checkin.date === today
      );
      setTodayCheckins(todayCheckinsData);
      
    } catch (err) {
      setError('Failed to load habits');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    loadData();
  }, [today]); // Only reload when today's date changes

  // Check if a habit is completed today
  const isHabitCompletedToday = (habitId: number) => {
    return todayCheckins.some(checkin => 
      checkin.habit_id === habitId && checkin.completed
    );
  };

  // Handle habit check-in - open modal
  const handleCheckIn = (habit: Habit) => {
    console.log('Opening check-in modal for habit:', habit);
    setCheckInModal({ isOpen: true, habit });
  };

      // Handle successful check-in
      const handleCheckInSuccess = useCallback(() => {
        // Reload data to show updated check-ins
        loadData();
        // Notify parent component
        if (onCheckInSuccess) {
          onCheckInSuccess();
        }
      }, [loadData, onCheckInSuccess]);

  if (loading) {
    return (
      <div className="today-habits">
        <h3>Today's Habits</h3>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading today's habits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="today-habits">
        <h3>Today's Habits</h3>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="today-habits">
        <h3>Today's Habits</h3>
        <div className="empty-container">
          <div className="empty-icon">🎯</div>
          <p>No habits scheduled for today. Create habits or check back on their scheduled days!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="today-habits">
      <h3>Today's Habits</h3>
      <div className="habits-list">
        {habits.map((habit) => {
          const isCompleted = isHabitCompletedToday(habit.id);
          return (
            <div key={habit.id} className={`habit-item ${isCompleted ? 'completed' : ''}`}>
              <div className="habit-info">
                <span className="habit-name">{habit.name}</span>
                <div className="habit-meta">
                  <span className="habit-category">{habit.category}</span>
                  <span className="habit-frequency">{habit.frequency}</span>
                </div>
              </div>
              <button
                className={`check-btn ${isCompleted ? 'checked' : 'unchecked'}`}
                onClick={() => handleCheckIn(habit)}
                title={isCompleted ? 'Update check-in' : 'Check in'}
                type="button"
              >
                {isCompleted ? '✓' : '○'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Check-in Modal */}
      <CheckInModal
        isOpen={checkInModal.isOpen}
        onClose={() => setCheckInModal({ isOpen: false, habit: null })}
        habit={checkInModal.habit}
        onSuccess={handleCheckInSuccess}
      />
    </div>
  );
};

export default TodayHabits;
