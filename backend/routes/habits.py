from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db
from models import Habit

habits_bp = Blueprint('habits', __name__)

@habits_bp.route('/habits', methods=['GET'])
def get_habits():
    habits = Habit.query.all()
    return jsonify([habit.to_dict() for habit in habits])

@habits_bp.route('/habits', methods=['POST'])
def create_habit():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('frequency') or not data.get('category'):
        return jsonify({"error": "Missing required fields: name, frequency, category"}), 400
    
    try:
        habit = Habit(
            name=data['name'],
            description=data.get('description', ''),
            frequency=data['frequency'],
            category=data['category'],
            start_date=datetime.strptime(data.get('start_date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date()
        )
        
        db.session.add(habit)
        db.session.commit()
        
        return jsonify(habit.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@habits_bp.route('/habits/<int:habit_id>', methods=['GET'])
def get_habit(habit_id):
    habit = Habit.query.get_or_404(habit_id)
    return jsonify(habit.to_dict())

@habits_bp.route('/habits/<int:habit_id>', methods=['PUT'])
def update_habit(habit_id):
    habit = Habit.query.get_or_404(habit_id)
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        if 'name' in data:
            habit.name = data['name']
        if 'description' in data:
            habit.description = data['description']
        if 'frequency' in data:
            habit.frequency = data['frequency']
        if 'category' in data:
            habit.category = data['category']
        if 'start_date' in data:
            habit.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        
        db.session.commit()
        return jsonify(habit.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@habits_bp.route('/habits/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    habit = Habit.query.get_or_404(habit_id)
    
    try:
        db.session.delete(habit)
        db.session.commit()
        return jsonify({"message": "Habit deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
