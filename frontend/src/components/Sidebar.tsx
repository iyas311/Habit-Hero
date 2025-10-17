// This is the vertical sidebar navigation that appears on the left side
// Modern design with icons and smooth transitions

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Check if a link is currently active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Navigation items with icons
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/habits', label: 'Habits', icon: '🎯' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/categories', label: 'Categories', icon: '🏷️' }
  ];

  return (
    <div className="sidebar">
      {/* Logo/Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">🏆</div>
        <div className="brand-text">
          <span className="brand-name">Habit Hero</span>
          <span className="brand-tagline">Build Better Habits</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
};

export default Sidebar;
