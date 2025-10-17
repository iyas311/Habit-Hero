// This is the main dashboard page that users see when they first visit the app
// Now shows real data: today's habits, quick stats, and progress overview

import React, { useState } from 'react';
import TodayHabits from '../components/TodayHabits';
import QuickStats from '../components/QuickStats';

const Dashboard: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleCheckInSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your progress overview.</p>
      </div>
      
      {/* Quick Statistics */}
      <QuickStats key={`stats-${refreshTrigger}`} />
      
      {/* Today's Habits */}
      <TodayHabits 
        key={`habits-${refreshTrigger}`} 
        onCheckInSuccess={handleCheckInSuccess}
      />
      
      {/* Additional sections can be added here */}
      <div className="dashboard-footer">
        <div className="motivational-quote">
          <p>"The secret of getting ahead is getting started."</p>
          <span>- Mark Twain</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
