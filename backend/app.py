from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from models import db, Habit, CheckIn

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///habits.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
CORS(app)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return jsonify({"message": "Habit Hero API is running!"})

# Habit Routes

@app.route('/habits', methods=['GET'])
def get_habits():
    """Get all habits"""
    habits = Habit.query.all()
    return jsonify([habit.to_dict() for habit in habits])

@app.route('/habits', methods=['POST'])
def create_habit():
    """Create a new habit"""
    data = request.get_json()
    
    # Validate required fields
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

@app.route('/habits/<int:habit_id>', methods=['GET'])
def get_habit(habit_id):
    """Get a specific habit"""
    habit = Habit.query.get_or_404(habit_id)
    return jsonify(habit.to_dict())

@app.route('/habits/<int:habit_id>', methods=['PUT'])
def update_habit(habit_id):
    """Update a specific habit"""
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

@app.route('/habits/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    """Delete a specific habit"""
    habit = Habit.query.get_or_404(habit_id)
    
    try:
        db.session.delete(habit)
        db.session.commit()
        return jsonify({"message": "Habit deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
