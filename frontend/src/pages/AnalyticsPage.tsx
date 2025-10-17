// This is the analytics page where users can view their progress, streaks, and statistics
// Now fully functional with real analytics data

import React from 'react';
import AnalyticsOverview from '../components/AnalyticsOverview';
import HabitAnalytics from '../components/HabitAnalytics';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Analytics</h1>
          <p>Track your progress and see your habits' performance.</p>
        </div>
      </div>
      
      {/* Analytics Overview */}
      <AnalyticsOverview />
      
      {/* Individual Habit Analytics */}
      <HabitAnalytics />
    </div>
  );
};

export default AnalyticsPage;
