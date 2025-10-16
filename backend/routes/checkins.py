from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db
from models import Habit, CheckIn

# Create blueprint for check-in routes
checkins_bp = Blueprint('checkins', __name__)

@checkins_bp.route('/habits/<int:habit_id>/checkin', methods=['POST'])
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

@checkins_bp.route('/habits/<int:habit_id>/checkins', methods=['GET'])
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

@checkins_bp.route('/checkins/<int:checkin_id>', methods=['PUT'])
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

@checkins_bp.route('/checkins/<int:checkin_id>', methods=['DELETE'])
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
