"""
AI-powered features for Habit Hero
Provides habit suggestions and analysis using Google Gemini
"""

from flask import Blueprint, request, jsonify
from services.ai_service import AIService
from models import Habit, CheckIn
from database import db
import logging

# Create blueprint
ai_bp = Blueprint('ai', __name__)

# Initialize AI service
try:
    ai_service = AIService()
    logging.info("AI service initialized successfully")
except Exception as e:
    logging.error(f"Failed to initialize AI service: {str(e)}")
    ai_service = None

@ai_bp.route('/ai/suggestions', methods=['GET', 'POST'])
def get_habit_suggestions():
    """
    Generate AI-powered habit suggestions based on existing habits
    
    GET: Returns suggestions based on current habits
    POST: Accepts user goals and returns personalized suggestions
    
    Request Body (POST):
    {
        "goals": "string - user's goals or preferences",
        "exclude_categories": ["category1", "category2"] - optional
    }
    
    Response:
    {
        "suggestions": [
            {
                "name": "Habit Name",
                "description": "Description",
                "category": "Category",
                "frequency": "daily|weekly",
                "reason": "Why this is beneficial"
            }
        ],
        "message": "Success message"
    }
    """
    try:
        if not ai_service:
            return jsonify({
                'error': 'AI service not available. Please check API key configuration.'
            }), 500
        
        # Get existing habits from database (with error handling)
        existing_habits = []
        try:
            habits_query = Habit.query.all()
            
            for habit in habits_query:
                existing_habits.append({
                    'id': habit.id,
                    'name': habit.name,
                    'description': habit.description,
                    'frequency': habit.frequency,
                    'category': habit.category,
                    'start_date': habit.start_date
                })
        except Exception as db_error:
            logging.warning(f"Database access failed, using empty habits list: {str(db_error)}")
            existing_habits = []
        
        # Get user goals from request (if POST)
        user_goals = None
        exclude_categories = []
        
        if request.method == 'POST':
            data = request.get_json() or {}
            user_goals = data.get('goals', '')
            exclude_categories = data.get('exclude_categories', [])
        
        # Filter out excluded categories
        if exclude_categories:
            existing_habits = [
                habit for habit in existing_habits 
                if habit['category'] not in exclude_categories
            ]
        
        # Generate AI suggestions
        suggestions = ai_service.generate_habit_suggestions(existing_habits, user_goals)
        
        return jsonify({
            'suggestions': suggestions,
            'message': f'Generated {len(suggestions)} personalized habit suggestion{"s" if len(suggestions) != 1 else ""}'
        }), 200
        
    except Exception as e:
        logging.error(f"Error generating habit suggestions: {str(e)}")
        return jsonify({
            'error': 'Failed to generate habit suggestions',
            'message': str(e)
        }), 500

@ai_bp.route('/ai/analysis', methods=['GET'])
def analyze_habits():
    """
    Analyze user's habit patterns and provide insights
    
    Response:
    {
        "analysis": {
            "performance_score": 8,
            "strengths": ["strength1", "strength2"],
            "improvements": ["improvement1", "improvement2"],
            "recommendations": ["rec1", "rec2", "rec3"]
        },
        "message": "Analysis completed"
    }
    """
    try:
        if not ai_service:
            return jsonify({
                'error': 'AI service not available. Please check API key configuration.'
            }), 500
        
        # Get habits and check-ins from database
        habits = []
        habits_query = Habit.query.all()
        
        for habit in habits_query:
            habits.append({
                'id': habit.id,
                'name': habit.name,
                'description': habit.description,
                'frequency': habit.frequency,
                'category': habit.category,
                'start_date': habit.start_date
            })
        
        checkins = []
        checkins_query = CheckIn.query.all()
        
        for checkin in checkins_query:
            checkins.append({
                'id': checkin.id,
                'habit_id': checkin.habit_id,
                'date': checkin.date,
                'completed': checkin.completed,
                'notes': checkin.notes
            })
        
        # Generate AI analysis
        analysis = ai_service.analyze_habit_patterns(habits, checkins)
        
        return jsonify({
            'analysis': analysis,
            'message': 'Habit analysis completed successfully'
        }), 200
        
    except Exception as e:
        logging.error(f"Error analyzing habits: {str(e)}")
        return jsonify({
            'error': 'Failed to analyze habits',
            'message': str(e)
        }), 500

@ai_bp.route('/ai/health', methods=['GET'])
def ai_health_check():
    """
    Check if AI service is properly configured and working
    
    Response:
    {
        "status": "healthy|unhealthy",
        "message": "Status message",
        "api_configured": true/false
    }
    """
    try:
        if ai_service:
            # Test AI service with a simple request
            test_suggestions = ai_service.generate_habit_suggestions([], "test")
            
            return jsonify({
                'status': 'healthy',
                'message': 'AI service is working properly',
                'api_configured': True,
                'test_suggestions_count': len(test_suggestions)
            }), 200
        else:
            return jsonify({
                'status': 'unhealthy',
                'message': 'AI service not initialized',
                'api_configured': False
            }), 503
            
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'message': f'AI service error: {str(e)}',
            'api_configured': False
        }), 500

@ai_bp.route('/ai/categories', methods=['GET'])
def get_ai_categories():
    """
    Get list of suggested habit categories from AI
    
    Response:
    {
        "categories": ["Health", "Personal", "Productivity", ...],
        "message": "Available categories"
    }
    """
    try:
        if not ai_service:
            return jsonify({
                'error': 'AI service not available'
            }), 500
        
        # Use AI to suggest categories based on common habit types
        prompt = """
        List 10 common habit categories that people typically track for personal development and wellness.
        Return only the category names, one per line, without numbers or bullets.
        """
        
        # Use retry logic for category generation
        response = ai_service._generate_with_retry(prompt)
        categories = [cat.strip() for cat in response.text.split('\n') if cat.strip()]
        
        # Clean up and filter categories
        valid_categories = []
        for category in categories:
            if category and len(category) < 50 and category.isalpha():
                valid_categories.append(category.title())
        
        # Add some standard categories if AI response is insufficient
        standard_categories = [
            'Health', 'Personal', 'Productivity', 'Learning', 
            'Relationships', 'Finance', 'Spiritual', 'Creative'
        ]
        
        for cat in standard_categories:
            if cat not in valid_categories:
                valid_categories.append(cat)
        
        return jsonify({
            'categories': valid_categories[:10],  # Limit to 10 categories
            'message': 'Available habit categories'
        }), 200
        
    except Exception as e:
        logging.error(f"Error getting AI categories: {str(e)}")
        
        # Return fallback categories
        fallback_categories = [
            'Health', 'Personal', 'Productivity', 'Learning',
            'Relationships', 'Finance', 'Spiritual', 'Creative',
            'Fitness', 'Mindfulness'
        ]
        
        return jsonify({
            'categories': fallback_categories,
            'message': 'Using fallback categories'
        }), 200

