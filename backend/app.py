from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///habits.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)


from models import Habit, CheckIn

# Create tables
with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return jsonify({"message": "Habit Hero API is running!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
