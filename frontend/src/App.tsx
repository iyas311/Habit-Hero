import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HabitsPage from './pages/HabitsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CategoriesPage from './pages/CategoriesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard route - this is the default page */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Habits management page */}
          <Route path="/habits" element={<HabitsPage />} />
          
          {/* Analytics page */}
          <Route path="/analytics" element={<AnalyticsPage />} />
          
          {/* Categories management page */}
          <Route path="/categories" element={<CategoriesPage />} />
          
          {/* 404 page - if someone visits a page that doesn't exist */}
          <Route path="*" element={
            <div className="not-found">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
