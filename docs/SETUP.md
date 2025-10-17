# 🚀 Setup Guide - Habit Hero

Complete setup instructions for getting Habit Hero running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/habit-hero.git
cd habit-hero
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

If you're using a virtual environment (recommended):

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
FLASK_ENV=development
DATABASE_URL=sqlite:///instance/habits.db
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**Getting Your Gemini API Key:**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it into your `.env` file

#### Initialize the Database

```bash
python app.py
```

The database will be automatically created on first run.

#### Run the Backend Server

```bash
python app.py
```

The backend will be available at: `http://127.0.0.1:5000`

### 3. Frontend Setup

Open a new terminal window/tab:

#### Install Node Dependencies

```bash
cd frontend
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

#### Configure API Endpoint (Optional)

The frontend is pre-configured to connect to `http://127.0.0.1:5000`. If your backend runs on a different port, update `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://127.0.0.1:YOUR_PORT';
```

#### Run the Frontend Server

```bash
npm start
```

Or with yarn:

```bash
yarn start
```

The frontend will be available at: `http://localhost:3000`

## Verification

### Check Backend Health

Visit: `http://127.0.0.1:5000/habits`

You should see an empty array: `[]`

### Check AI Service

Visit: `http://127.0.0.1:5000/ai/health`

You should see:
```json
{
  "status": "healthy",
  "message": "AI service is working properly",
  "api_configured": true
}
```

### Check Frontend

Visit: `http://localhost:3000`

You should see the Habit Hero dashboard.

## Troubleshooting

### Backend Issues

**Problem: Module not found errors**
```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt
```

**Problem: Database errors**
```bash
# Solution: Delete and recreate database
rm -rf instance/
python app.py
```

**Problem: AI service not working**
- Verify your `GEMINI_API_KEY` is correct in `.env`
- Check that the `.env` file is in the `backend/` directory
- Restart the backend server after adding the key

### Frontend Issues

**Problem: Cannot connect to backend**
- Ensure backend is running on port 5000
- Check for CORS errors in browser console
- Verify `API_BASE_URL` in `frontend/src/services/api.ts`

**Problem: Module not found errors**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem: Port 3000 already in use**
```bash
# Solution: Use a different port
PORT=3001 npm start
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Automatically reloads on file changes
- **Backend**: Restart manually or use `flask run` with debug mode

### Database Management

View database contents:
```bash
cd backend
python
>>> from app import app, db
>>> from models import Habit, CheckIn
>>> with app.app_context():
...     habits = Habit.query.all()
...     print(habits)
```

### API Testing

Use tools like:
- **Postman** - [Download](https://www.postman.com/)
- **Thunder Client** (VS Code Extension)
- **curl** (command line)

Example curl request:
```bash
curl http://127.0.0.1:5000/habits
```

## Next Steps

1. ✅ Create your first habit
2. ✅ Try the AI suggestions feature
3. ✅ Check in on your habits daily
4. ✅ View your progress in analytics
5. ✅ Generate a PDF report

## Additional Resources

- [README.md](README.md) - Project overview
- [API.md](API.md) - API documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## Need Help?

- Check the [Issues](https://github.com/yourusername/habit-hero/issues) page
- Create a new issue if you encounter problems
- Read the troubleshooting section above

Happy habit tracking! 🎯
