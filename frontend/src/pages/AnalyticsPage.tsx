// This is the analytics page where users can view their progress, streaks, and statistics
// For now, it's a simple placeholder - we'll add content later

import React from 'react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="analytics-page">
      <h1>Analytics</h1>
      <p>Track your progress and see your statistics.</p>
      
      {/* Placeholder content - we'll replace this later */}
      <div className="analytics-placeholder">
        <h2>Coming Soon:</h2>
        <ul>
          <li>Success rates and streaks</li>
          <li>Calendar view of check-ins</li>
          <li>Weekly/monthly progress charts</li>
          <li>Best performing habits</li>
          <li>Overall statistics</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsPage;
