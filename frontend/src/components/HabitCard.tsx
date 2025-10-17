// This component displays a single habit in a card format
// Shows habit details and provides quick actions

import React from 'react';
import { Habit } from '../types';
import './HabitCard.css';

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: number) => void;
  onCheckIn?: (habitId: number) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  onEdit, 
  onDelete, 
  onCheckIn 
}) => {
  // Format the start date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get category color (we'll make this dynamic later)
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'health': '#e74c3c',
      'learning': '#3498db',
      'work': '#f39c12',
      'personal': '#9b59b6',
      'fitness': '#27ae60'
    };
    return colors[category.toLowerCase()] || '#95a5a6';
  };

  return (
    <div className="habit-card">
      {/* Category badge */}
      <div 
        className="category-badge"
        style={{ backgroundColor: getCategoryColor(habit.category) }}
      >
        {habit.category}
      </div>

      {/* Habit content */}
      <div className="habit-content">
        <h3 className="habit-name">{habit.name}</h3>
        
        {habit.description && (
          <p className="habit-description">{habit.description}</p>
        )}

        <div className="habit-details">
          <div className="habit-detail">
            <span className="detail-label">Frequency:</span>
            <span className="detail-value">{habit.frequency}</span>
          </div>
          
          <div className="habit-detail">
            <span className="detail-label">Started:</span>
            <span className="detail-value">{formatDate(habit.start_date)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="habit-actions">
        {onCheckIn && (
          <button 
            className="btn btn-primary"
            onClick={() => onCheckIn(habit.id)}
            title="Check in for today"
          >
            ✓ Check In
          </button>
        )}
        
        {onEdit && (
          <button 
            className="btn btn-secondary"
            onClick={() => onEdit(habit)}
            title="Edit habit"
          >
            ✏️ Edit
          </button>
        )}
        
        {onDelete && (
          <button 
            className="btn btn-danger"
            onClick={() => onDelete(habit.id)}
            title="Delete habit"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default HabitCard;
