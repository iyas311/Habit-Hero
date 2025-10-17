// This is the categories page where users can manage habit categories
// For now, it's a simple placeholder - we'll add content later

import React from 'react';

const CategoriesPage: React.FC = () => {
  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Categories</h1>
          <p>Manage your habit categories.</p>
        </div>
      </div>
      
      {/* Placeholder content - we'll replace this later */}
      <div className="categories-placeholder">
        <h2>Coming Soon:</h2>
        <ul>
          <li>List of all categories</li>
          <li>Add new category</li>
          <li>Edit/delete categories</li>
          <li>Category colors and icons</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoriesPage;
