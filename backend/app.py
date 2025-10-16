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

# Check-in Routes

@app.route('/habits/<int:habit_id>/checkin', methods=['POST'])
def create_checkin(habit_id):
    """Add a check-in for a specific habit"""
    habit = Habit.query.get_or_404(habit_id)
    data = request.get_json() or {}
    
    # Logic: Use provided date or default to today
    checkin_date_str = data.get('date', datetime.now().strftime('%Y-%m-%d'))
    
    try:
        checkin_date = datetime.strptime(checkin_date_str, '%Y-%m-%d').date()
        
        # Logic: Check if check-in already exists for this date
        existing_checkin = CheckIn.query.filter_by(
            habit_id=habit_id, 
            date=checkin_date
        ).first()
        
        if existing_checkin:
            return jsonify({"error": "Check-in already exists for this date"}), 400
        
        # Logic: Create new check-in with optional notes
        checkin = CheckIn(
            habit_id=habit_id,
            date=checkin_date,
            notes=data.get('notes', ''),
            completed=data.get('completed', True)  # Default to completed
        )
        
        db.session.add(checkin)
        db.session.commit()
        
        return jsonify(checkin.to_dict()), 201
        
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/habits/<int:habit_id>/checkins', methods=['GET'])
def get_habit_checkins(habit_id):
    """Get all check-ins for a specific habit"""
    habit = Habit.query.get_or_404(habit_id)
    
    # Logic: Get query parameters for filtering
    limit = request.args.get('limit', type=int)
    offset = request.args.get('offset', 0, type=int)
    
    # Logic: Base query for check-ins
    query = CheckIn.query.filter_by(habit_id=habit_id).order_by(CheckIn.date.desc())
    
    # Logic: Apply pagination if requested
    if limit:
        query = query.limit(limit).offset(offset)
    
    checkins = query.all()
    
    return jsonify({
        'habit_id': habit_id,
        'habit_name': habit.name,
        'checkins': [checkin.to_dict() for checkin in checkins],
        'total_count': CheckIn.query.filter_by(habit_id=habit_id).count()
    })

@app.route('/checkins/<int:checkin_id>', methods=['PUT'])
def update_checkin(checkin_id):
    """Update a specific check-in"""
    checkin = CheckIn.query.get_or_404(checkin_id)
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        # Logic: Allow updating notes and completion status
        if 'notes' in data:
            checkin.notes = data['notes']
        if 'completed' in data:
            checkin.completed = data['completed']
        
        db.session.commit()
        return jsonify(checkin.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/checkins/<int:checkin_id>', methods=['DELETE'])
def delete_checkin(checkin_id):
    """Delete a specific check-in"""
    checkin = CheckIn.query.get_or_404(checkin_id)
    
    try:
        db.session.delete(checkin)
        db.session.commit()
        return jsonify({"message": "Check-in deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
