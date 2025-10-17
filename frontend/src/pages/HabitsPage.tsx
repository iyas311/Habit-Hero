// This is the habits management page where users can view, create, edit, and delete habits
// Now displays real habits from the backend using HabitList component

import React, { useState } from 'react';
import { Habit } from '../types';
import HabitList from '../components/HabitList';
import AddHabitForm from '../components/AddHabitForm';

const HabitsPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  // Function to handle habit editing (placeholder for now)
  const handleEdit = (habit: Habit) => {
    console.log('Edit habit:', habit);
    // TODO: Open edit modal or navigate to edit page
    alert(`Edit functionality coming soon for: ${habit.name}`);
  };

  // Function to handle check-ins (placeholder for now)
  const handleCheckIn = (habitId: number) => {
    console.log('Check in for habit:', habitId);
    // TODO: Open check-in modal
    alert(`Check-in functionality coming soon for habit ID: ${habitId}`);
  };

  // Function to trigger list refresh (for when we add new habits)
  const refreshList = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Function to handle successful habit creation
  const handleHabitCreated = () => {
    refreshList(); // Refresh the habits list
    // Optional: Show success message
    console.log('New habit created successfully!');
  };

  return (
    <div className="habits-page">
      <div className="page-header">
        <h1>My Habits</h1>
        <p>Manage your habits and track your progress.</p>
        
        {/* Add habit button - now opens the modal */}
        <button 
          className="btn btn-primary add-habit-btn"
          onClick={() => setIsAddFormOpen(true)}
        >
          ➕ Add New Habit
        </button>
      </div>
      
      {/* Real habits list from backend */}
      <HabitList 
        onEdit={handleEdit}
        onCheckIn={handleCheckIn}
        refreshTrigger={refreshTrigger}
      />

      {/* Add Habit Modal */}
      <AddHabitForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSuccess={handleHabitCreated}
      />
    </div>
  );
};

export default HabitsPage;
