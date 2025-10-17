"""
Reports routes for generating PDF reports
"""

from flask import Blueprint, request, jsonify, send_file
from datetime import datetime, timedelta
from database import db
from models import Habit, CheckIn
from services.pdf_service import PDFReportService
from io import BytesIO

# Create blueprint for reports routes
reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/habits/pdf', methods=['GET'])
def generate_habit_pdf():
    """Generate and return a PDF report of habit progress"""
    try:
        # Get query parameters
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        # Parse date range
        date_range = None
        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
                date_range = (start_date_str, end_date_str)
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Get all habits
        habits = Habit.query.all()
        habits_data = [habit.to_dict() for habit in habits]
        
        # Get check-ins
        checkins_query = CheckIn.query
        if date_range:
            checkins_query = checkins_query.filter(
                CheckIn.date >= start_date,
                CheckIn.date <= end_date
            )
        
        checkins = checkins_query.all()
        checkins_data = [checkin.to_dict() for checkin in checkins]
        
        # Calculate analytics data
        total_habits = len(habits_data)
        total_checkins = len(checkins_data)
        total_completed = len([c for c in checkins_data if c['completed']])
        overall_success_rate = round((total_completed / total_checkins * 100), 1) if total_checkins > 0 else 0
        
        # Calculate current streak (simplified - across all habits)
        current_streak = calculate_overall_current_streak(checkins_data)
        
        analytics_data = {
            'total_habits': total_habits,
            'total_checkins': total_checkins,
            'total_completed': total_completed,
            'overall_success_rate': overall_success_rate,
            'current_streak': current_streak
        }
        
        # Generate PDF
        pdf_service = PDFReportService()
        pdf_buffer = pdf_service.generate_habit_report(
            habits_data, 
            checkins_data, 
            analytics_data, 
            date_range
        )
        
        # Prepare filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'habit_hero_report_{timestamp}.pdf'
        
        # Return PDF file
        pdf_buffer.seek(0)
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        print(f"Error generating PDF report: {str(e)}")
        return jsonify({"error": "Failed to generate PDF report"}), 500

@reports_bp.route('/habits/analytics', methods=['GET'])
def get_report_analytics():
    """Get analytics data for report preview"""
    try:
        # Get query parameters
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        # Parse date range
        start_date = None
        end_date = None
        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Get habits
        habits = Habit.query.all()
        habits_data = [habit.to_dict() for habit in habits]
        
        # Get check-ins
        checkins_query = CheckIn.query
        if start_date and end_date:
            checkins_query = checkins_query.filter(
                CheckIn.date >= start_date,
                CheckIn.date <= end_date
            )
        
        checkins = checkins_query.all()
        checkins_data = [checkin.to_dict() for checkin in checkins]
        
        # Calculate analytics
        total_habits = len(habits_data)
        total_checkins = len(checkins_data)
        total_completed = len([c for c in checkins_data if c['completed']])
        overall_success_rate = round((total_completed / total_checkins * 100), 1) if total_checkins > 0 else 0
        current_streak = calculate_overall_current_streak(checkins_data)
        
        # Category breakdown
        categories = {}
        for habit in habits_data:
            category = habit.get('category', 'Uncategorized')
            categories[category] = categories.get(category, 0) + 1
        
        # Habit performance summary
        habit_performance = []
        for habit in habits_data:
            habit_id = habit['id']
            habit_checkins = [c for c in checkins_data if c['habit_id'] == habit_id]
            
            if habit_checkins:
                total_habit_checkins = len(habit_checkins)
                completed_habit_checkins = len([c for c in habit_checkins if c['completed']])
                success_rate = round((completed_habit_checkins / total_habit_checkins * 100), 1)
                current_habit_streak = calculate_habit_current_streak(habit_checkins)
            else:
                success_rate = 0
                current_habit_streak = 0
            
            habit_performance.append({
                'id': habit['id'],
                'name': habit['name'],
                'category': habit['category'],
                'frequency': habit['frequency'],
                'success_rate': success_rate,
                'current_streak': current_habit_streak
            })
        
        return jsonify({
            'total_habits': total_habits,
            'total_checkins': total_checkins,
            'total_completed': total_completed,
            'overall_success_rate': overall_success_rate,
            'current_streak': current_streak,
            'categories': categories,
            'habit_performance': habit_performance,
            'date_range': {
                'start_date': start_date_str,
                'end_date': end_date_str
            }
        })
        
    except Exception as e:
        print(f"Error getting report analytics: {str(e)}")
        return jsonify({"error": "Failed to get analytics data"}), 500

def calculate_overall_current_streak(checkins_data):
    """Calculate overall current streak across all habits"""
    if not checkins_data:
        return 0
    
    # Get all completed check-ins, sorted by date
    completed_checkins = [c for c in checkins_data if c['completed']]
    if not completed_checkins:
        return 0
    
    # Sort by date (most recent first)
    sorted_checkins = sorted(completed_checkins, key=lambda x: x['date'], reverse=True)
    
    today = datetime.now().date()
    current_date = today
    streak_count = 0
    
    # Check consecutive days backwards from today
    for checkin in sorted_checkins:
        checkin_date = datetime.strptime(checkin['date'], '%Y-%m-%d').date()
        if checkin_date == current_date:
            streak_count += 1
            current_date -= timedelta(days=1)
        elif checkin_date < current_date:
            break
    
    return streak_count

def calculate_habit_current_streak(checkins_data):
    """Calculate current streak for a specific habit"""
    if not checkins_data:
        return 0
    
    # Filter completed check-ins and sort by date
    completed_checkins = [c for c in checkins_data if c['completed']]
    if not completed_checkins:
        return 0
    
    sorted_checkins = sorted(completed_checkins, key=lambda x: x['date'], reverse=True)
    
    today = datetime.now().date()
    current_date = today
    streak_count = 0
    
    # Check consecutive days backwards from today
    for checkin in sorted_checkins:
        checkin_date = datetime.strptime(checkin['date'], '%Y-%m-%d').date()
        if checkin_date == current_date:
            streak_count += 1
            current_date -= timedelta(days=1)
        elif checkin_date < current_date:
            break
    
    return streak_count
