/**
 * AI Suggestions Component
 * Displays AI-generated habit suggestions with options to create habits
 */

import React, { useState, useEffect } from 'react';
import { HabitSuggestion, getAISuggestions, createHabitFromSuggestion } from '../services/ai';
import './AISuggestions.css';

interface AISuggestionsProps {
  onHabitCreated?: () => void;
  onClose?: () => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ onHabitCreated, onClose }) => {
  const [suggestions, setSuggestions] = useState<HabitSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingHabits, setCreatingHabits] = useState<Set<number>>(new Set());
  const [userGoals, setUserGoals] = useState<string>('');
  const [showGoalsInput, setShowGoalsInput] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // Don't auto-load on mount - wait for user action
  // useEffect(() => {
  //   loadSuggestions();
  // }, []);

  const loadSuggestions = async (goals?: string) => {
    try {
      setLoading(true);
      setError(null);
      setHasLoaded(true);
      
      const response = await getAISuggestions(goals);
      
      // Check if response has suggestions
      if (response && response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      } else {
        setError('No suggestions available. Try adding your goals or refreshing.');
      }
    } catch (err: any) {
      console.error('Error loading AI suggestions:', err);
      
      // More specific error messages
      if (err.response?.status === 503) {
        setError('AI service is temporarily unavailable. Please try again in a moment.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please check if the backend is running.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
      } else {
        setError('Failed to load AI suggestions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (suggestion: HabitSuggestion, index: number) => {
    try {
      setCreatingHabits(prev => new Set(prev).add(index));
      
      await createHabitFromSuggestion(suggestion);
      
      // Remove the created suggestion from the list
      setSuggestions(prev => prev.filter((_, i) => i !== index));
      
      // Notify parent component
      if (onHabitCreated) {
        onHabitCreated();
      }
      
    } catch (err) {
      console.error('Error creating habit:', err);
      alert('Failed to create habit. Please try again.');
    } finally {
      setCreatingHabits(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleGetPersonalizedSuggestions = () => {
    if (userGoals.trim()) {
      loadSuggestions(userGoals.trim());
      setShowGoalsInput(false);
    }
  };

  const handleRefreshSuggestions = () => {
    loadSuggestions(userGoals || undefined);
  };

  if (loading && suggestions.length === 0) {
    return (
      <div className="ai-suggestions">
        <div className="ai-suggestions-header">
          <h3>🤖 AI Habit Suggestions</h3>
          <p>Getting personalized suggestions for you...</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>AI is analyzing your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-suggestions">
      <div className="ai-suggestions-header">
        <div className="header-content">
          <h3>🤖 AI Habit Suggestions</h3>
          <p>Personalized habit recommendations based on your current routine</p>
        </div>
        
        <div className="header-actions">
          {!showGoalsInput ? (
            <button
              className="btn btn-secondary"
              onClick={() => setShowGoalsInput(true)}
            >
              🎯 Add Goals
            </button>
          ) : (
            <div className="goals-input">
              <input
                type="text"
                placeholder="What are your goals? (e.g., 'Get fit and learn coding')"
                value={userGoals}
                onChange={(e) => setUserGoals(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGetPersonalizedSuggestions()}
              />
              <button
                className="btn btn-primary"
                onClick={handleGetPersonalizedSuggestions}
                disabled={!userGoals.trim()}
              >
                Get Suggestions
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowGoalsInput(false)}
              >
                Cancel
              </button>
            </div>
          )}
          
          <button
            className="btn btn-secondary"
            onClick={handleRefreshSuggestions}
            disabled={loading}
          >
            🔄 Refresh
          </button>
          
          {onClose && (
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-container">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => loadSuggestions()}>
            Try Again
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-card">
              <div className="suggestion-header">
                <h4>{suggestion.name}</h4>
                <div className="suggestion-meta">
                  <span className={`frequency-badge ${suggestion.frequency}`}>
                    {suggestion.frequency}
                  </span>
                  <span className="category-badge">
                    {suggestion.category}
                  </span>
                </div>
              </div>
              
              <div className="suggestion-content">
                <p className="suggestion-description">{suggestion.description}</p>
                <p className="suggestion-reason">
                  <strong>Why:</strong> {suggestion.reason}
                </p>
              </div>
              
              <div className="suggestion-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleCreateHabit(suggestion, index)}
                  disabled={creatingHabits.has(index)}
                >
                  {creatingHabits.has(index) ? '⏳ Creating...' : '➕ Create Habit'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !loading && !error && !hasLoaded && (
        <div className="empty-container">
          <div className="empty-icon">🤖</div>
          <h3>Get AI-Powered Habit Suggestions</h3>
          <p>Click the button below to get personalized habit recommendations based on your existing habits!</p>
          <button 
            className="btn btn-primary"
            onClick={() => loadSuggestions()}
            style={{ marginTop: '1rem', fontSize: '1.1rem', padding: '0.75rem 2rem' }}
          >
            ✨ Generate Suggestions
          </button>
        </div>
      )}
      
      {suggestions.length === 0 && !loading && !error && hasLoaded && (
        <div className="empty-container">
          <div className="empty-icon">🤖</div>
          <p>No suggestions available right now. Try refreshing or adding your goals!</p>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;


