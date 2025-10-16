from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from database import db
from models import Habit, CheckIn

# Create blueprint for analytics routes
analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/habits/<int:habit_id>/streak', methods=['GET'])
def get_habit_streak(habit_id):
    """Calculate current streak for a specific habit"""
    habit = Habit.query.get_or_404(habit_id)
    
    # Logic: Get all completed check-ins, ordered by date descending
    checkins = CheckIn.query.filter_by(
        habit_id=habit_id, 
        completed=True
    ).order_by(CheckIn.date.desc()).all()
    
    if not checkins:
        return jsonify({
            'habit_id': habit_id,
            'habit_name': habit.name,
            'current_streak': 0,
            'longest_streak': 0
        })
    
    # Logic: Calculate current streak
    current_streak = 0
    longest_streak = 0
    temp_streak = 0
    last_date = None
    
    for checkin in checkins:
        if last_date is None:
            last_date = checkin.date
            current_streak = 1
            temp_streak = 1
            longest_streak = 1
        else:
            # Logic: Check if dates are consecutive (difference of 1 day)
            days_diff = (last_date - checkin.date).days
            
            if days_diff == 1:  # Consecutive day
                temp_streak += 1
                if temp_streak > longest_streak:
                    longest_streak = temp_streak
                
                # Logic: Only count current streak if we're still in it
                if current_streak == temp_streak - 1:
                    current_streak = temp_streak
            elif days_diff > 1:  # Gap in dates
                if current_streak == temp_streak:  # We were in current streak
                    current_streak = 0  # Streak broken
                temp_streak = 1
                last_date = checkin.date
            # If days_diff == 0, it's the same date, skip
    
    return jsonify({
        'habit_id': habit_id,
        'habit_name': habit.name,
        'current_streak': current_streak,
        'longest_streak': longest_streak,
        'last_checkin_date': checkins[0].date.isoformat() if checkins else None
    })

@analytics_bp.route('/habits/<int:habit_id>/stats', methods=['GET'])
def get_habit_stats(habit_id):
    """Get comprehensive statistics for a specific habit"""
    habit = Habit.query.get_or_404(habit_id)
    
    # Logic: Get all check-ins for this habit
    all_checkins = CheckIn.query.filter_by(habit_id=habit_id).all()
    completed_checkins = CheckIn.query.filter_by(habit_id=habit_id, completed=True).all()
    
    total_checkins = len(all_checkins)
    total_completed = len(completed_checkins)
    success_rate = (total_completed / total_checkins * 100) if total_checkins > 0 else 0
    
    # Logic: Calculate days since start
    days_since_start = (datetime.now().date() - habit.start_date).days + 1
    
    # Logic: Get check-ins by day of week
    checkins_by_day = {}
    for checkin in completed_checkins:
        day_name = checkin.date.strftime('%A')
        checkins_by_day[day_name] = checkins_by_day.get(day_name, 0) + 1
    
    return jsonify({
        'habit_id': habit_id,
        'habit_name': habit.name,
        'start_date': habit.start_date.isoformat(),
        'days_since_start': days_since_start,
        'total_checkins': total_checkins,
        'total_completed': total_completed,
        'success_rate': round(success_rate, 2),
        'checkins_by_day': checkins_by_day,
        'last_updated': datetime.now().isoformat()
    })

@analytics_bp.route('/habits/<int:habit_id>/calendar', methods=['GET'])
def get_habit_calendar(habit_id):
    """Get calendar view of check-ins for a specific habit"""
    habit = Habit.query.get_or_404(habit_id)
    
    # Logic: Get date range from query params or default to last 30 days
    days_back = request.args.get('days', 30, type=int)
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days_back)
    
    # Logic: Get all check-ins in date range
    checkins = CheckIn.query.filter(
        CheckIn.habit_id == habit_id,
        CheckIn.date >= start_date,
        CheckIn.date <= end_date
    ).all()
    
    # Logic: Create calendar data structure
    calendar_data = {}
    for checkin in checkins:
        date_str = checkin.date.isoformat()
        calendar_data[date_str] = {
            'date': date_str,
            'completed': checkin.completed,
            'notes': checkin.notes or '',
            'checkin_id': checkin.id
        }
    
    return jsonify({
        'habit_id': habit_id,
        'habit_name': habit.name,
        'date_range': {
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'days': days_back
        },
        'calendar_data': calendar_data
    })

@analytics_bp.route('/habits/analytics', methods=['GET'])
def get_overall_analytics():
    """Get overall analytics across all habits"""
    # Logic: Get all habits and their check-ins
    habits = Habit.query.all()
    
    total_habits = len(habits)
    total_checkins = 0
    total_completed = 0
    habits_with_streaks = 0
    category_stats = {}
    
    for habit in habits:
        habit_checkins = CheckIn.query.filter_by(habit_id=habit.id).all()
        habit_completed = CheckIn.query.filter_by(habit_id=habit.id, completed=True).all()
        
        total_checkins += len(habit_checkins)
        total_completed += len(habit_completed)
        
        # Logic: Check if habit has any streak (simplified)
        if len(habit_completed) > 0:
            habits_with_streaks += 1
        
        # Logic: Category statistics
        category = habit.category
        if category not in category_stats:
            category_stats[category] = {'count': 0, 'completed': 0, 'total': 0}
        
        category_stats[category]['count'] += 1
        category_stats[category]['completed'] += len(habit_completed)
        category_stats[category]['total'] += len(habit_checkins)
    
    overall_success_rate = (total_completed / total_checkins * 100) if total_checkins > 0 else 0
    
    return jsonify({
        'total_habits': total_habits,
        'total_checkins': total_checkins,
        'total_completed': total_completed,
        'overall_success_rate': round(overall_success_rate, 2),
        'habits_with_streaks': habits_with_streaks,
        'category_stats': category_stats,
        'last_updated': datetime.now().isoformat()
    })
