// This component displays a list of habits from the backend
// Handles loading, errors, and empty states

import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { getHabits, deleteHabit } from '../services/api';
import HabitCard from './HabitCard';
import './HabitList.css';

interface HabitListProps {
  onEdit?: (habit: Habit) => void;
  onCheckIn?: (habitId: number) => void;
  refreshTrigger?: number; // This will help us refresh the list when needed
}

const HabitList: React.FC<HabitListProps> = ({ 
  onEdit, 
  onCheckIn, 
  refreshTrigger 
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch habits from backend
  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const habitsData = await getHabits();
      setHabits(habitsData);
    } catch (err) {
      setError('Failed to load habits. Please check if the backend is running.');
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch habits when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchHabits();
  }, [refreshTrigger]);

  // Function to handle habit deletion
  const handleDelete = async (habitId: number) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) {
      return;
    }

    try {
      await deleteHabit(habitId);
      // Remove the habit from the local state
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    } catch (err) {
      alert('Failed to delete habit. Please try again.');
      console.error('Error deleting habit:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="habit-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading habits...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="habit-list">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Habits</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchHabits}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (habits.length === 0) {
    return (
      <div className="habit-list">
        <div className="empty-container">
          <div className="empty-icon">📝</div>
          <h3>No Habits Yet</h3>
          <p>Start building better habits by creating your first one!</p>
        </div>
      </div>
    );
  }

  // Success state - display habits
  return (
    <div className="habit-list">
      <div className="habit-list-header">
        <h2>Your Habits ({habits.length})</h2>
      </div>
      
      <div className="habits-grid">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={onEdit}
            onDelete={handleDelete}
            onCheckIn={onCheckIn}
          />
        ))}
      </div>
    </div>
  );
};

export default HabitList;
