// This is the navigation bar that appears at the top of every page
// Think of it like the menu bar on any website

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  // Get current page to highlight active link
  const location = useLocation();

  // Check if a link is currently active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏆</span>
          <span className="brand-text">Habit Hero</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          
          <Link 
            to="/habits" 
            className={`navbar-link ${isActive('/habits') ? 'active' : ''}`}
          >
            Habits
          </Link>
          
          <Link 
            to="/analytics" 
            className={`navbar-link ${isActive('/analytics') ? 'active' : ''}`}
          >
            Analytics
          </Link>
          
          <Link 
            to="/categories" 
            className={`navbar-link ${isActive('/categories') ? 'active' : ''}`}
          >
            Categories
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
