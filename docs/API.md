# 📡 API Documentation - Habit Hero

Complete API reference for the Habit Hero backend.

## Base URL

```
http://127.0.0.1:5000
```

## Response Format

All responses are in JSON format with appropriate HTTP status codes.

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Endpoints

---

## 📋 Habits

### Get All Habits

```http
GET /habits
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Morning Exercise",
    "description": "30 minutes of cardio",
    "frequency": "daily",
    "category": "Health",
    "start_date": "2025-01-01",
    "created_at": "2025-01-01T00:00:00"
  }
]
```

### Get Single Habit

```http
GET /habits/{id}
```

**Parameters:**
- `id` (path) - Habit ID

**Response:**
```json
{
  "id": 1,
  "name": "Morning Exercise",
  "description": "30 minutes of cardio",
  "frequency": "daily",
  "category": "Health",
  "start_date": "2025-01-01"
}
```

### Create Habit

```http
POST /habits
```

**Request Body:**
```json
{
  "name": "Morning Exercise",
  "description": "30 minutes of cardio",
  "frequency": "daily",
  "category": "Health",
  "start_date": "2025-01-01"
}
```

**Required Fields:**
- `name` (string) - Habit name
- `frequency` (string) - "daily" or "weekly"
- `category` (string) - Habit category
- `start_date` (string) - ISO date format (YYYY-MM-DD)

**Optional Fields:**
- `description` (string) - Habit description

**Response:**
```json
{
  "id": 1,
  "name": "Morning Exercise",
  "message": "Habit created successfully"
}
```

### Update Habit

```http
PUT /habits/{id}
```

**Parameters:**
- `id` (path) - Habit ID

**Request Body:**
```json
{
  "name": "Evening Exercise",
  "description": "45 minutes of cardio",
  "frequency": "daily",
  "category": "Health"
}
```

**Response:**
```json
{
  "message": "Habit updated successfully"
}
```

### Delete Habit

```http
DELETE /habits/{id}
```

**Parameters:**
- `id` (path) - Habit ID

**Response:**
```json
{
  "message": "Habit deleted successfully"
}
```

---

## ✅ Check-ins

### Get Habit Check-ins

```http
GET /habits/{id}/checkins?limit=100
```

**Parameters:**
- `id` (path) - Habit ID
- `limit` (query, optional) - Number of check-ins to return (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "habit_id": 1,
    "date": "2025-01-15",
    "completed": true,
    "notes": "Felt great today!",
    "created_at": "2025-01-15T08:30:00"
  }
]
```

### Create Check-in

```http
POST /habits/{id}/checkin
```

**Parameters:**
- `id` (path) - Habit ID

**Request Body:**
```json
{
  "date": "2025-01-15",
  "completed": true,
  "notes": "Felt great today!"
}
```

**Required Fields:**
- `date` (string) - ISO date format (YYYY-MM-DD)
- `completed` (boolean) - Check-in status

**Optional Fields:**
- `notes` (string) - Additional notes

**Response:**
```json
{
  "id": 1,
  "message": "Check-in recorded successfully"
}
```

### Update Check-in

```http
PUT /checkins/{id}
```

**Parameters:**
- `id` (path) - Check-in ID

**Request Body:**
```json
{
  "completed": false,
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "message": "Check-in updated successfully"
}
```

### Delete Check-in

```http
DELETE /checkins/{id}
```

**Parameters:**
- `id` (path) - Check-in ID

**Response:**
```json
{
  "message": "Check-in deleted successfully"
}
```

---

## 📊 Analytics

### Get Overall Analytics

```http
GET /habits/analytics
```

**Response:**
```json
{
  "total_habits": 5,
  "active_habits": 4,
  "total_checkins": 150,
  "completion_rate": 85.5,
  "current_streak": 7,
  "longest_streak": 21,
  "habits_by_category": {
    "Health": 2,
    "Personal": 2,
    "Productivity": 1
  }
}
```

### Get Habit Statistics

```http
GET /habits/{id}/stats
```

**Parameters:**
- `id` (path) - Habit ID

**Response:**
```json
{
  "total_checkins": 30,
  "completed_checkins": 25,
  "completion_rate": 83.3,
  "current_streak": 5,
  "longest_streak": 12,
  "last_checkin": "2025-01-15"
}
```

### Get Habit Streak

```http
GET /habits/{id}/streak
```

**Parameters:**
- `id` (path) - Habit ID

**Response:**
```json
{
  "current_streak": 5,
  "longest_streak": 12,
  "streak_status": "active"
}
```

### Get Calendar Data

```http
GET /habits/{id}/calendar?year=2025&month=1
```

**Parameters:**
- `id` (path) - Habit ID
- `year` (query, optional) - Year (default: current year)
- `month` (query, optional) - Month (1-12) (default: current month)

**Response:**
```json
{
  "2025-01-01": true,
  "2025-01-02": true,
  "2025-01-03": false,
  "2025-01-04": true
}
```

---

## 📄 Reports

### Generate PDF Report

```http
GET /habits/pdf
```

**Response:**
- Content-Type: `application/pdf`
- Binary PDF file download

---

## 🤖 AI Features

### Get AI Suggestions

```http
GET /ai/suggestions
```

**Response:**
```json
{
  "suggestions": [
    {
      "name": "Morning Meditation",
      "description": "Spend 10 minutes meditating each morning",
      "category": "Personal",
      "frequency": "daily",
      "reason": "Helps reduce stress and improve focus"
    }
  ],
  "message": "Generated 1 personalized habit suggestion"
}
```

### Get Personalized AI Suggestions

```http
POST /ai/suggestions
```

**Request Body:**
```json
{
  "goals": "I want to improve my fitness and learn new skills",
  "exclude_categories": ["Finance"]
}
```

**Optional Fields:**
- `goals` (string) - User's goals for personalized suggestions
- `exclude_categories` (array) - Categories to exclude

**Response:**
```json
{
  "suggestions": [
    {
      "name": "Morning Run",
      "description": "30-minute jog to improve cardiovascular health",
      "category": "Health",
      "frequency": "daily",
      "reason": "Aligns with your fitness goals"
    }
  ],
  "message": "Generated 1 personalized habit suggestion"
}
```

### Get AI Analysis

```http
GET /ai/analysis
```

**Response:**
```json
{
  "analysis": {
    "performance_score": 8,
    "strengths": [
      "Consistent habit tracking",
      "Good variety of habits",
      "High completion rates"
    ],
    "improvements": [
      "Add more weekly habits",
      "Focus on evening routines"
    ],
    "recommendations": [
      "Try habit stacking",
      "Set specific time blocks",
      "Celebrate small wins"
    ]
  },
  "message": "Habit analysis completed successfully"
}
```

### Check AI Health

```http
GET /ai/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "AI service is working properly",
  "api_configured": true,
  "test_suggestions_count": 1
}
```

### Get AI Categories

```http
GET /ai/categories
```

**Response:**
```json
{
  "categories": [
    "Health",
    "Personal",
    "Productivity",
    "Learning",
    "Relationships",
    "Finance",
    "Spiritual",
    "Creative"
  ],
  "message": "Available habit categories"
}
```

---

## 📁 Categories

### Get All Categories

```http
GET /categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Health",
    "description": "Physical and mental health habits",
    "color": "#27ae60"
  }
]
```

### Create Category

```http
POST /categories
```

**Request Body:**
```json
{
  "name": "Health",
  "description": "Physical and mental health habits",
  "color": "#27ae60"
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Category created successfully"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |
| 503 | Service Unavailable - AI service down |

---

## Rate Limiting

Currently, there are no rate limits. This may change in production.

---

## Authentication

Currently, the API does not require authentication. This is suitable for local/personal use. For production deployment, implement authentication using JWT or OAuth.

---

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

## Examples

### Using cURL

**Create a habit:**
```bash
curl -X POST http://127.0.0.1:5000/habits \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Exercise",
    "description": "30 minutes of cardio",
    "frequency": "daily",
    "category": "Health",
    "start_date": "2025-01-01"
  }'
```

**Get AI suggestions:**
```bash
curl -X POST http://127.0.0.1:5000/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "goals": "Improve fitness and productivity"
  }'
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

// Create a habit
const createHabit = async () => {
  const response = await axios.post('http://127.0.0.1:5000/habits', {
    name: 'Morning Exercise',
    description: '30 minutes of cardio',
    frequency: 'daily',
    category: 'Health',
    start_date: '2025-01-01'
  });
  console.log(response.data);
};

// Get AI suggestions
const getAISuggestions = async () => {
  const response = await axios.post('http://127.0.0.1:5000/ai/suggestions', {
    goals: 'Improve fitness and productivity'
  });
  console.log(response.data);
};
```

---

## Notes

- All dates should be in ISO format (YYYY-MM-DD)
- Timestamps are in ISO 8601 format
- The AI service requires a valid `GEMINI_API_KEY` in the `.env` file
- PDF reports are generated on-demand and may take a few seconds

---

For more information, see [README.md](README.md) and [SETUP.md](SETUP.md).
