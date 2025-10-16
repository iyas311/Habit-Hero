from flask import Blueprint, request, jsonify
from database import db
from models import Category

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories])

@categories_bp.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({"error": "Category name is required"}), 400
    
    try:
        category = Category(
            name=data['name'],
            color=data.get('color', '#3B82F6'),
            icon=data.get('icon', 'star')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@categories_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get_or_404(category_id)
    return jsonify(category.to_dict())

@categories_bp.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        if 'name' in data:
            category.name = data['name']
        if 'color' in data:
            category.color = data['color']
        if 'icon' in data:
            category.icon = data['icon']
        
        db.session.commit()
        return jsonify(category.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@categories_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    
    try:
        db.session.delete(category)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@categories_bp.route('/categories/populate', methods=['POST'])
def populate_default_categories():
    default_categories = [
        {'name': 'Health', 'color': '#10B981', 'icon': 'heart'},
        {'name': 'Work', 'color': '#3B82F6', 'icon': 'briefcase'},
        {'name': 'Learning', 'color': '#8B5CF6', 'icon': 'book'},
        {'name': 'Personal', 'color': '#F59E0B', 'icon': 'user'},
        {'name': 'Fitness', 'color': '#EF4444', 'icon': 'dumbbell'},
        {'name': 'Mindfulness', 'color': '#06B6D4', 'icon': 'brain'}
    ]
    
    created_categories = []
    
    for cat_data in default_categories:
        existing = Category.query.filter_by(name=cat_data['name']).first()
        if not existing:
            category = Category(
                name=cat_data['name'],
                color=cat_data['color'],
                icon=cat_data['icon']
            )
            db.session.add(category)
            created_categories.append(cat_data['name'])
    
    try:
        db.session.commit()
        return jsonify({
            "message": f"Created {len(created_categories)} default categories",
            "created": created_categories
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
