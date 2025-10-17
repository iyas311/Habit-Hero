# Habit Hero - Frontend

Modern React + TypeScript frontend for the Habit Hero application.

## Overview

A beautiful, responsive web application for tracking habits, viewing analytics, and getting AI-powered suggestions. Built with React 19, TypeScript, and modern CSS.

## Tech Stack

- **React 19.2.0** - UI library with hooks
- **TypeScript 4.9.5** - Type-safe development
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

## Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure API endpoint (optional):**

The app connects to `http://127.0.0.1:5000` by default. To change this, edit `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://your-backend-url:port';
```

3. **Start development server:**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/                # Static files
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── AddHabitForm.tsx
│   │   ├── AISuggestions.tsx
│   │   ├── AnalyticsOverview.tsx
│   │   ├── CheckInModal.tsx
│   │   ├── HabitAnalytics.tsx
│   │   ├── HabitCalendar.tsx
│   │   ├── HabitCard.tsx
│   │   ├── HabitList.tsx
│   │   ├── Layout.tsx
│   │   ├── QuickStats.tsx
│   │   ├── Sidebar.tsx
│   │   └── TodayHabits.tsx
│   ├── pages/             # Page components
│   │   ├── AnalyticsPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── Dashboard.tsx
│   │   └── HabitsPage.tsx
│   ├── services/          # API services
│   │   ├── ai.ts          # AI service
│   │   ├── api.ts         # Main API client
│   │   └── reports.ts     # PDF reports
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── App.css            # Global styles
│   └── index.tsx          # Entry point
└── package.json           # Dependencies
```

## Features

### Dashboard
- Today's habits overview
- Quick statistics
- Motivational quotes
- Quick check-in functionality

### Habits Management
- Create, edit, and delete habits
- Daily and weekly frequency options
- Category organization
- Smart filtering

### Calendar View
- Visual progress tracking
- Month/year navigation
- Habit-specific views
- Edit past check-ins

### Analytics
- Detailed statistics
- Streak tracking
- Success rates
- Category breakdown
- PDF report generation

### AI Features
- Smart habit suggestions
- Goal-based recommendations
- Pattern analysis
- Category suggestions

## Design System

### Colors
```css
--primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--secondary: #f8f9ff;
--success: #27ae60;
--warning: #f39c12;
--error: #e74c3c;
--text: #2c3e50;
```

### Components
- Rounded corners (8-12px)
- Subtle shadows
- Smooth transitions
- Hover effects
- Responsive design

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build/` folder

### `npm run eject`
⚠️ **One-way operation!** Ejects from Create React App

## API Integration

The frontend communicates with the backend API through services:

```typescript
// Example: Fetching habits
import api from './services/api';

const habits = await api.get('/habits');
```

### API Services

- **api.ts** - Base Axios configuration
- **ai.ts** - AI-powered features
- **reports.ts** - PDF report generation

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Building for Production

1. **Build the app:**
```bash
npm run build
```

2. **Test the build locally:**
```bash
npx serve -s build
```

3. **Deploy:**
- Upload `build/` folder to your hosting service
- Configure environment variables
- Set up routing for SPA

### Deployment platforms
- **Vercel** - Automatic deployments
- **Netlify** - Easy setup with CI/CD
- **GitHub Pages** - Free hosting
- **AWS S3** - Scalable hosting

## Component Guidelines

### Functional Components
```typescript
interface Props {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  return <div>{title}</div>;
};

export default MyComponent;
```

### Hooks Usage
- `useState` - Component state
- `useEffect` - Side effects
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized values

### Styling
- Component-specific CSS files
- BEM naming convention
- CSS variables for theming
- Mobile-first approach

## Common Issues

**Issue: Port 3000 already in use**
```bash
PORT=3001 npm start
```

**Issue: Cannot connect to backend**
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API_BASE_URL in api.ts

**Issue: Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Additional Documentation

- [Main README](../README.md) - Project overview
- [Setup Guide](../docs/SETUP.md) - Detailed setup
- [API Documentation](../docs/API.md) - API reference
- [Contributing](../docs/CONTRIBUTING.md) - Development guidelines

## Contributing

See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for development guidelines.

## License

MIT License - See [LICENSE](../LICENSE) for details
