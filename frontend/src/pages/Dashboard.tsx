// This is the main dashboard page that users see when they first visit the app
// For now, it's a simple placeholder - we'll add content later

import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to Habit Hero! This is your dashboard.</p>
      <p>Here you'll see an overview of your habits and progress.</p>
      
      {/* Placeholder content - we'll replace this later */}
      <div className="dashboard-placeholder">
        <h2>Coming Soon:</h2>
        <ul>
          <li>Today's habits to check off</li>
          <li>Current streaks</li>
          <li>Recent activity</li>
          <li>Quick statistics</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
