/**
 * Categories Page - Manage habit categories
 * Allows users to view, create, edit, and delete categories
 */

import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { getHabits } from '../services/api';
import './CategoriesPage.css';

interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryDescription, setNewCategoryDescription] = useState<string>('');
  const [newCategoryColor, setNewCategoryColor] = useState<string>('#667eea');

  // Predefined colors
  const colorOptions = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#38f9d7', '#fa709a', '#fee140',
    '#30cfd0', '#330867', '#ff6b6b', '#4ecdc4'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesData, habitsData] = await Promise.all([
        getCategories(),
        getHabits()
      ]);
      
      setCategories(categoriesData);
      setHabits(habitsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryHabitCount = (categoryName: string): number => {
    return habits.filter(habit => habit.category === categoryName).length;
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      await createCategory(newCategoryName.trim());
      await loadData();
      
      // Reset form
      setNewCategoryName('');
      setNewCategoryDescription('');
      setNewCategoryColor('#667eea');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category. Please try again.');
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      await updateCategory(editingCategory.id, { name: newCategoryName.trim() });
      await loadData();
      
      // Reset form
      setEditingCategory(null);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setNewCategoryColor('#667eea');
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const habitCount = getCategoryHabitCount(category.name);
    
    if (habitCount > 0) {
      const confirmed = window.confirm(
        `This category has ${habitCount} habit(s). Deleting it will not delete the habits, but they will lose their category. Continue?`
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm(`Delete category "${category.name}"?`);
      if (!confirmed) return;
    }

    try {
      await deleteCategory(category.id);
      await loadData();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description || '');
    setNewCategoryColor(category.color || '#667eea');
    setShowAddForm(false);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setNewCategoryColor('#667eea');
  };

  if (loading) {
    return (
      <div className="categories-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🏷️ Categories</h1>
          <p>Organize your habits with custom categories</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(true);
            setEditingCategory(null);
          }}
          disabled={showAddForm || editingCategory !== null}
        >
          ➕ Add Category
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={loadData}>
            Try Again
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingCategory) && (
        <div className="category-form-card">
          <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
          
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g., Health, Personal, Work"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              placeholder="Brief description of this category"
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {colorOptions.map(color => (
                <button
                  key={color}
                  className={`color-option ${newCategoryColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategoryColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              className="btn btn-primary"
              onClick={editingCategory ? handleEditCategory : handleAddCategory}
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={cancelForm}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <h3>No Categories Yet</h3>
            <p>Create your first category to organize your habits</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              ➕ Add Category
            </button>
          </div>
        ) : (
          categories.map(category => {
            const habitCount = getCategoryHabitCount(category.name);
            
            return (
              <div key={category.id} className="category-card">
                <div 
                  className="category-color-bar"
                  style={{ backgroundColor: category.color || '#667eea' }}
                />
                
                <div className="category-content">
                  <div className="category-header">
                    <h3>{category.name}</h3>
                    <div className="category-badge">
                      {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
                    </div>
                  </div>
                  
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                  
                  <div className="category-actions">
                    <button
                      className="btn-icon"
                      onClick={() => startEdit(category)}
                      title="Edit category"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDeleteCategory(category)}
                      title="Delete category"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default CategoriesPage;
