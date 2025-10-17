// This component creates a modal for checking in habits
// Allows users to mark habits as completed and add notes

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Habit } from '../types';
import { createCheckin } from '../services/api';
import './CheckInModal.css';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  onSuccess: () => void; // Called when check-in is successful
}

const CheckInModal: React.FC<CheckInModalProps> = ({ 
  isOpen, 
  onClose, 
  habit, 
  onSuccess 
}) => {
  const [completed, setCompleted] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes or habit changes
  React.useEffect(() => {
    if (isOpen && habit) {
      setCompleted(true);
      setNotes('');
      setError(null);
    }
  }, [isOpen, habit]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habit) return;

    setLoading(true);
    setError(null);
    
    try {
      const checkinData = {
        date: new Date().toLocaleDateString('en-CA'), // Today's date in local timezone
        completed: completed,
        notes: notes.trim()
      };

      const result = await createCheckin(habit.id, checkinData);
      
      // Success! Close modal and refresh data
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error('Error creating check-in:', err);
      
      // Better error message
      let errorMessage = 'Failed to save check-in. Please try again.';
      
      if (err.response?.status === 404) {
        errorMessage = 'Habit not found. Please refresh and try again.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid data. Please check your input and try again.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !habit) {
    console.log('Modal not rendering:', { isOpen, habit: habit?.name });
    return null;
  }

  console.log('Modal rendering for habit:', habit.name);

  const modalContent = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Check In: {habit.name}</h2>
          <button 
            className="close-button"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="checkin-form">
          {/* Completion Status */}
          <div className="form-group">
            <label className="form-label">How did it go today?</label>
            <div className="status-options">
              <label className="status-option completed">
                <input
                  type="radio"
                  name="completed"
                  checked={completed}
                  onChange={() => setCompleted(true)}
                  disabled={loading}
                />
                <span className="option-content">
                  <span className="option-icon">✅</span>
                  <span className="option-text">
                    <strong>Completed!</strong>
                    <small>I did this habit today</small>
                  </span>
                </span>
              </label>
              
              <label className="status-option not-completed">
                <input
                  type="radio"
                  name="completed"
                  checked={!completed}
                  onChange={() => setCompleted(false)}
                  disabled={loading}
                />
                <span className="option-content">
                  <span className="option-icon">❌</span>
                  <span className="option-text">
                    <strong>Not completed</strong>
                    <small>I missed this today</small>
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
              placeholder="How did it go? Any thoughts or reflections..."
              rows={3}
              disabled={loading}
              maxLength={500}
            />
            <div className="char-count">{notes.length}/500</div>
          </div>

          {/* Submit Error */}
          {error && (
            <div className="submit-error">
              {error}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${completed ? 'btn-success' : 'btn-warning'}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Saving...
                </>
              ) : (
                <>
                  {completed ? '✅ Mark Completed' : '❌ Mark Missed'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render modal using React Portal
  return createPortal(modalContent, document.body);
};

export default CheckInModal;
