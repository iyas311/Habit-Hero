// This component wraps around all our pages
// It provides the basic structure: Sidebar + Content (modern layout)

import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

// Define what props this component expects
interface LayoutProps {
  children: React.ReactNode; // This will be the page content
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      {/* Vertical sidebar navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
