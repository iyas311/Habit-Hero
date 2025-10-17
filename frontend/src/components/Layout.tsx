// This component wraps around all our pages
// It provides the basic structure: Navbar + Content + Footer (optional)

import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

// Define what props this component expects
interface LayoutProps {
  children: React.ReactNode; // This will be the page content
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      {/* Navigation bar at the top */}
      <Navbar />
      
      {/* Main content area */}
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
      
      {/* Optional footer - we can add this later if needed */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Habit Hero. Build better habits, one day at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
