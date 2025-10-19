# 🎯 Habit Hero

A modern, full-stack habit tracking application built with React and Flask. Track your daily and weekly habits, visualize your progress, and build better routines with beautiful analytics and PDF reports.

![Habit Hero](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.3-green)
![Python](https://img.shields.io/badge/Python-3.12+-yellow)

## ✨ Features

### 🏠 **Dashboard**
- **Today's Habits**: See what habits you need to complete today
- **Quick Stats**: Overview of your progress at a glance
- **Motivational Quotes**: Daily inspiration to keep you going

### 📋 **Habit Management**
- **Create Habits**: Add daily or weekly habits with categories
- **Edit & Delete**: Full CRUD operations for habit management
- **Smart Filtering**: Weekly habits only appear on their scheduled days
- **Category Organization**: Organize habits by health, personal, work, etc.

### 📅 **Calendar View**
- **Visual Progress**: See your habit completion in a calendar format
- **Habit Selection**: Choose which habit to view in the calendar
- **Date Navigation**: Browse through your progress over time
- **Check-in Editing**: Update past check-ins directly from the calendar

### 📊 **Analytics**
- **Progress Tracking**: Detailed statistics for each habit
- **Streak Analysis**: Current and longest streaks with status indicators
- **Success Rates**: See which habits you're excelling at
- **Category Breakdown**: Performance by habit category
- **PDF Reports**: Generate and download comprehensive progress reports

### 🤖 **AI-Powered Features**
- **Smart Habit Suggestions**: AI generates personalized habit recommendations based on your existing habits
- **Powered by Google Gemini**: Uses advanced AI for intelligent recommendations

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Gradients**: Modern purple-blue gradient theme
- **Smooth Animations**: Hover effects and transitions throughout
- **Intuitive Navigation**: Clean sidebar navigation with icons
- **Professional Typography**: Consistent, readable font hierarchy

## 🏗️ Architecture

### **Frontend (React + TypeScript)**
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AddHabitForm.tsx     # Modal form for creating habits
│   │   ├── AISuggestions.tsx    # AI-powered habit suggestions
│   │   ├── AnalyticsOverview.tsx # Overall analytics dashboard
│   │   ├── CheckInModal.tsx     # Modal for habit check-ins
│   │   ├── HabitAnalytics.tsx   # Individual habit analytics
│   │   ├── HabitCalendar.tsx    # Calendar view component
│   │   ├── HabitCard.tsx        # Individual habit display
│   │   ├── HabitList.tsx        # List of all habits
│   │   ├── Layout.tsx           # Main app layout wrapper
│   │   ├── QuickStats.tsx       # Dashboard statistics
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── TodayHabits.tsx      # Today's habit list
│   ├── pages/               # Page-level components
│   │   ├── AnalyticsPage.tsx    # Analytics page
│   │   ├── CalendarPage.tsx     # Calendar page
│   │   ├── CategoriesPage.tsx   # Categories page
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   └── HabitsPage.tsx       # Habits management page
│   ├── services/            # API communication
│   │   ├── ai.ts               # AI service for suggestions
│   │   ├── api.ts              # Main API service
│   │   └── reports.ts          # PDF report service
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts            # All data models and interfaces
│   └── utils/               # Utility functions
```

### **Backend (Flask + SQLAlchemy)**
```
backend/
├── routes/                 # API endpoints
│   ├── ai.py                  # AI-powered features
│   ├── analytics.py           # Analytics and statistics
│   ├── categories.py          # Category management
│   ├── checkins.py            # Check-in operations
│   ├── habits.py              # Habit CRUD operations
│   └── reports.py             # PDF report generation
├── services/               # Business logic
│   ├── ai_service.py          # AI service with Google Gemini
│   └── pdf_service.py         # PDF generation service
├── models.py               # Database models
├── database.py             # Database configuration
├── config.py               # App configuration
└── app.py                  # Flask application entry point
```

## 🚀 Getting Started

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/habit-hero.git
cd habit-hero
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
# Create .env file with GEMINI_API_KEY
python app.py
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

📚 **For detailed setup instructions, see [docs/SETUP.md](docs/SETUP.md)**

🔒 **For API key security, see [docs/SECURITY.md](docs/SECURITY.md)**

## 🛠️ Technology Stack

### **Frontend**
- **React 19.2.0**: Modern React with hooks and functional components
- **TypeScript 4.9.5**: Type-safe development with full type coverage
- **React Router DOM**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **CSS3**: Modern styling with gradients, animations, and responsive design

### **Backend**
- **Flask**: Lightweight Python web framework
- **SQLAlchemy**: Database ORM for data modeling
- **Flask-CORS**: Cross-origin resource sharing
- **ReportLab**: PDF generation for progress reports
- **Pillow**: Image processing for PDF reports
- **Google Gemini AI**: AI-powered habit suggestions and analysis

### **Database**
- **SQLite**: Lightweight, file-based database (development)
- **PostgreSQL**: Production-ready database option

## 📱 Usage

### **Creating a Habit**
1. Navigate to the "Habits" page
2. Click "➕ Add New Habit"
3. Fill in the habit details:
   - Name and description
   - Frequency (daily or weekly)
   - Category (Health, Personal, Work, etc.)
   - Start date
4. Click "Create Habit"

### **Checking In**
1. Go to the "Dashboard" to see today's habits
2. Click the check-in button (○) next to any habit
3. Add notes about your progress (optional)
4. Mark as completed or missed
5. Click "Check In"

### **Viewing Progress**
1. **Calendar**: Visual calendar showing your progress over time
2. **Analytics**: Detailed statistics and streak analysis
3. **PDF Reports**: Download comprehensive progress reports

## 🎨 Design System

### **Color Palette**
- **Primary**: Purple gradient (`#667eea` to `#764ba2`)
- **Secondary**: Light blue (`#f8f9ff`)
- **Success**: Green (`#27ae60`)
- **Warning**: Orange (`#f39c12`)
- **Error**: Red (`#e74c3c`)
- **Text**: Dark gray (`#2c3e50`)

### **Typography**
- **Headings**: Bold, gradient text with background-clip
- **Body**: Clean, readable sans-serif fonts
- **Code**: Monospace for technical content

### **Components**
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Modals**: Backdrop blur, centered positioning
- **Forms**: Clean inputs with validation states

## 📊 API Overview

The backend provides RESTful APIs for:
- **Habits** - CRUD operations
- **Check-ins** - Track daily/weekly progress
- **Analytics** - Statistics and insights
- **AI Features** - Smart suggestions and analysis
- **Reports** - PDF generation

📚 **For complete API documentation, see [docs/API.md](docs/API.md)**

## 🧪 Testing

### **Frontend Testing**
```bash
cd frontend
npm test
```

### **Backend Testing**
```bash
cd backend
python -m pytest
```

## 🚀 Deployment

### **Frontend **
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Set environment variables for API endpoints

### **Backend **
1. Create `Procfile`: `web: gunicorn app:app`
2. Add production database configuration
3. Deploy with your preferred platform

