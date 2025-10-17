from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from database import db

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    CORS(app)
    
    # Import models (needed for db.create_all())
    from models import Habit, CheckIn, Category
    
    # Import blueprints
    from routes.habits import habits_bp
    from routes.checkins import checkins_bp
    from routes.analytics import analytics_bp
    from routes.categories import categories_bp
    from routes.reports import reports_bp
    
    # Register blueprints
    app.register_blueprint(habits_bp)
    app.register_blueprint(checkins_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(reports_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Basic route
    @app.route('/')
    def hello():
        return jsonify({"message": "Habit Hero API is running!"})
    
    return app

if __name__ == '__main__':
    app = create_app('development')
    app.run(debug=True, port=5000)
