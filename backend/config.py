import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the absolute path to the instance directory
basedir = os.path.abspath(os.path.dirname(__file__))
instance_dir = os.path.join(basedir, 'instance')

class Config:
    """Base configuration class"""
    # Use a persistent SQLite database file in the instance directory
    # For deployment compatibility, use relative path from the backend directory
    db_uri_path = os.path.join(instance_dir, "habits.db").replace('\\', '/')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f'sqlite:///{db_uri_path}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    # Use absolute path for local development
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(instance_dir, "habits.db").replace(os.sep, "/")}'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    # Use relative path for production deployment
    SQLALCHEMY_DATABASE_URI = 'sqlite:///./instance/habits.db'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
