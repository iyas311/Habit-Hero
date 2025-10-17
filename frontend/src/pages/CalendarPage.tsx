// Dedicated Calendar page for habit tracking
// Shows a calendar view of all habits with check-in editing capabilities

import React, { useState } from 'react';
import HabitCalendar from '../components/HabitCalendar';
import { Habit } from '../types';
import './CalendarPage.css';

const CalendarPage: React.FC = () => {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const handleHabitChange = (habit: Habit | null) => {
    setSelectedHabit(habit);
  };

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Habit Calendar</h1>
        <p>Track your daily progress with a visual calendar view. Select a habit to see all days from start date to today.</p>
      </div>
      
      {/* Habit Calendar Component */}
      <HabitCalendar 
        selectedHabit={selectedHabit}
        onHabitChange={handleHabitChange}
      />
    </div>
  );
};

export default CalendarPage;
