# 🔧 Habit Hero - Backend

Flask-based REST API for the Habit Hero application.

## 📋 Overview

The backend provides a RESTful API for habit tracking, analytics, PDF report generation, and AI-powered habit suggestions using Google Gemini.

## 🛠️ Tech Stack

- **Flask** - Web framework
- **SQLAlchemy** - Database ORM
- **Flask-CORS** - Cross-origin resource sharing
- **ReportLab** - PDF generation
- **Pillow** - Image processing
- **Google Gemini AI** - AI-powered features

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set up environment variables:**

Copy the example file and add your API key:
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

**Minimal `.env` file:**
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**Note:** `DATABASE_URL` is optional - the app automatically uses `instance/habits.db`

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

🔒 **Security:** Never commit your `.env` file! See [../docs/SECURITY.md](../docs/SECURITY.md)

3. **Run the server:**
```bash
python app.py
```

The API will be available at `http://127.0.0.1:5000`

## 📁 Project Structure

```
backend/
├── routes/                 # API endpoints
│   ├── ai.py              # AI-powered features
│   ├── analytics.py       # Analytics and statistics
│   ├── categories.py      # Category management
│   ├── checkins.py        # Check-in operations
│   ├── habits.py          # Habit CRUD operations
│   └── reports.py         # PDF report generation
├── services/              # Business logic
│   ├── ai_service.py      # AI service with Google Gemini
│   └── pdf_service.py     # PDF generation service
├── models.py              # Database models
├── database.py            # Database configuration
├── config.py              # App configuration
├── app.py                 # Flask application entry point
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables (create this)
```

## 🔌 API Endpoints

### Habits
- `GET /habits` - Get all habits
- `POST /habits` - Create new habit
- `GET /habits/{id}` - Get specific habit
- `PUT /habits/{id}` - Update habit
- `DELETE /habits/{id}` - Delete habit

### Check-ins
- `GET /habits/{id}/checkins` - Get habit check-ins
- `POST /habits/{id}/checkin` - Create check-in
- `PUT /checkins/{id}` - Update check-in
- `DELETE /checkins/{id}` - Delete check-in

### Analytics
- `GET /habits/analytics` - Overall analytics
- `GET /habits/{id}/stats` - Habit statistics
- `GET /habits/{id}/streak` - Streak information
- `GET /habits/{id}/calendar` - Calendar data

### AI Features
- `GET /ai/suggestions` - Get AI habit suggestions
- `POST /ai/suggestions` - Get personalized suggestions
- `GET /ai/analysis` - Get AI analysis
- `GET /ai/health` - Check AI service status
- `GET /ai/categories` - Get AI-suggested categories

### Reports
- `GET /habits/pdf` - Generate PDF report

For detailed API documentation, see [docs/API.md](../docs/API.md)

## 🗄️ Database

The application uses SQLite by default for development. The database is automatically created on first run.

### Models

- **Habit** - Stores habit information
- **CheckIn** - Stores check-in records
- **Category** - Stores habit categories

### Database Management

Access the database:
```python
from app import app, db
from models import Habit, CheckIn

with app.app_context():
    habits = Habit.query.all()
    print(habits)
```

Reset database:
```bash
rm -rf instance/
python app.py
```

## 🤖 AI Service

The AI service uses Google Gemini to provide:
- Personalized habit suggestions
- Habit pattern analysis
- Category recommendations

**Configuration:**
- Set `GEMINI_API_KEY` in `.env`
- The service uses `gemini-2.5-flash` model
- Fallback suggestions provided if AI fails

## 🧪 Testing

Run tests:
```bash
python -m pytest
```

Test specific file:
```bash
python -m pytest tests/test_habits.py
```

## 🔧 Configuration

Configuration is managed in `config.py`:

- **Development**: Debug mode enabled, SQLite database
- **Production**: Debug mode disabled, PostgreSQL recommended

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FLASK_ENV` | Environment (development/production) | No |
| `DATABASE_URL` | Database connection string | No |
| `SECRET_KEY` | Flask secret key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes (for AI) |

## 🚨 Common Issues

**Issue: Module not found**
```bash
pip install -r requirements.txt
```

**Issue: Database errors**
```bash
rm -rf instance/
python app.py
```

**Issue: AI service not working**
- Check `GEMINI_API_KEY` in `.env`
- Verify API key is valid
- Restart the server

## 📚 Additional Documentation

- [Main README](../README.md) - Project overview
- [Setup Guide](../docs/SETUP.md) - Detailed setup instructions
- [API Documentation](../docs/API.md) - Complete API reference
- [Contributing](../docs/CONTRIBUTING.md) - Contribution guidelines

## 🤝 Contributing

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details
