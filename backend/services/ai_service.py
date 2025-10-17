"""
AI Service for Habit Suggestions using Google Gemini
Provides intelligent habit recommendations based on user's existing habits and goals
"""

import os
from google import genai
from google.genai import types
from typing import List, Dict, Any
import json
import logging

class AIService:
    def __init__(self):
        """Initialize the AI service with Gemini API"""
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        # Configure logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Initialize the new Gemini client
        try:
            self.client = genai.Client(api_key=api_key)
            self.model_name = 'gemini-2.5-flash'
            self.logger.info(f"AI service initialized successfully with {self.model_name}")
        except Exception as e:
            self.logger.error(f"Failed to initialize Gemini client: {str(e)}")
            raise ValueError(f"Could not initialize Gemini client. Error: {str(e)}")
    
    def generate_habit_suggestions(self, existing_habits: List[Dict[str, Any]], user_goals: str = None) -> List[Dict[str, str]]:
        """
        Generate AI-powered habit suggestions based on existing habits and user goals
        
        Args:
            existing_habits: List of existing habit dictionaries
            user_goals: Optional user goals or preferences
            
        Returns:
            List of suggested habits with name, description, category, and frequency
        """
        try:
            # Prepare context about existing habits
            habits_context = self._prepare_habits_context(existing_habits)
            
            # Create the prompt for Gemini
            prompt = self._create_suggestion_prompt(habits_context, user_goals)
            
            # Generate response from Gemini using new client API
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            # Parse and return suggestions
            suggestions = self._parse_ai_response(response.text)
            
            self.logger.info(f"Generated {len(suggestions)} habit suggestions")
            return suggestions
            
        except Exception as e:
            self.logger.error(f"Error generating habit suggestions: {str(e)}")
            return self._get_fallback_suggestions()
    
    def _prepare_habits_context(self, habits: List[Dict[str, Any]]) -> str:
        """Prepare context string from existing habits"""
        if not habits:
            return "User has no existing habits yet."
        
        context_parts = []
        categories = {}
        
        for habit in habits:
            category = habit.get('category', 'Uncategorized')
            categories[category] = categories.get(category, 0) + 1
            
            context_parts.append(
                f"- {habit.get('name', 'Unknown')} ({habit.get('frequency', 'daily')}, {category})"
            )
        
        context = "Existing habits:\n" + "\n".join(context_parts)
        
        # Add category summary
        if categories:
            category_summary = ", ".join([f"{cat}: {count}" for cat, count in categories.items()])
            context += f"\n\nCategories: {category_summary}"
        
        return context
    
    def _create_suggestion_prompt(self, habits_context: str, user_goals: str) -> str:
        """Create the prompt for Gemini AI"""
        prompt = f"""
You are a habit formation expert and personal development coach. Based on the user's existing habits, suggest 1 new habit that would complement their current routine and help them build a more balanced lifestyle.

{habits_context}

User Goals: {user_goals or "General personal improvement"}

Please suggest 1 new habit that:
1. Complements their existing habits (don't duplicate)
2. Fills gaps in their routine (e.g., if they only have health habits, suggest personal development)
3. Is realistic and achievable
4. Covers an important life area (health, personal, productivity, relationships, learning)

For each suggestion, provide:
- A catchy, motivating name
- A clear, actionable description
- An appropriate category (Health, Personal, Productivity, Learning, Relationships, Finance, etc.)
- Frequency (daily or weekly)

Format your response as a JSON array with this exact structure:
[
  {{
    "name": "Habit Name",
    "description": "Clear description of what to do",
    "category": "Category Name",
    "frequency": "daily or weekly",
    "reason": "Why this habit would be beneficial for them"
  }}
]

Make the suggestions specific, actionable, and personalized to their current habit profile.
"""
        return prompt
    
    def _parse_ai_response(self, response_text: str) -> List[Dict[str, str]]:
        """Parse the AI response and extract habit suggestions"""
        try:
            # Try to extract JSON from the response
            import re
            
            # Look for JSON array in the response
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                suggestions = json.loads(json_str)
                
                # Validate and clean the suggestions
                cleaned_suggestions = []
                for suggestion in suggestions:
                    if self._validate_suggestion(suggestion):
                        cleaned_suggestions.append({
                            'name': suggestion.get('name', '').strip(),
                            'description': suggestion.get('description', '').strip(),
                            'category': suggestion.get('category', 'Personal').strip(),
                            'frequency': suggestion.get('frequency', 'daily').strip().lower(),
                            'reason': suggestion.get('reason', '').strip()
                        })
                
                return cleaned_suggestions[:1]  # Limit to 1 suggestion
            
            # If no JSON found, return fallback suggestions
            self.logger.warning("No valid JSON found in AI response, using fallback suggestions")
            return self._get_fallback_suggestions()
            
        except (json.JSONDecodeError, Exception) as e:
            self.logger.error(f"Error parsing AI response: {str(e)}")
            return self._get_fallback_suggestions()
    
    def _validate_suggestion(self, suggestion: Dict) -> bool:
        """Validate that a suggestion has required fields"""
        required_fields = ['name', 'description', 'category', 'frequency']
        return all(field in suggestion and suggestion[field] for field in required_fields)
    
    def _get_fallback_suggestions(self) -> List[Dict[str, str]]:
        """Provide fallback suggestions if AI fails"""
        return [
            {
                'name': 'Morning Meditation',
                'description': 'Spend 10 minutes meditating or practicing mindfulness each morning',
                'category': 'Personal',
                'frequency': 'daily',
                'reason': 'Helps reduce stress and improve focus throughout the day'
            }
        ]
    
    def analyze_habit_patterns(self, habits: List[Dict[str, Any]], checkins: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze user's habit patterns and provide insights
        
        Args:
            habits: List of user's habits
            checkins: List of check-in records
            
        Returns:
            Dictionary with insights and recommendations
        """
        try:
            # Prepare data for analysis
            analysis_context = self._prepare_analysis_context(habits, checkins)
            
            prompt = f"""
You are a habit analyst. Based on the user's habit data, provide insights and recommendations.

{analysis_context}

Please analyze their habits and provide:
1. Overall performance assessment
2. Strengths (what they're doing well)
3. Areas for improvement
4. Specific recommendations for better habit formation

Format as JSON:
{{
  "performance_score": "number between 1-10",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}}
"""
            
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return self._parse_analysis_response(response.text)
            
        except Exception as e:
            self.logger.error(f"Error analyzing habit patterns: {str(e)}")
            return self._get_fallback_analysis()
    
    def _prepare_analysis_context(self, habits: List[Dict], checkins: List[Dict]) -> str:
        """Prepare context for habit analysis"""
        # Count habits by category
        categories = {}
        for habit in habits:
            cat = habit.get('category', 'Uncategorized')
            categories[cat] = categories.get(cat, 0) + 1
        
        # Calculate success rates
        habit_stats = {}
        for checkin in checkins:
            habit_id = checkin.get('habit_id')
            if habit_id not in habit_stats:
                habit_stats[habit_id] = {'total': 0, 'completed': 0}
            
            habit_stats[habit_id]['total'] += 1
            if checkin.get('completed'):
                habit_stats[habit_id]['completed'] += 1
        
        context = f"User has {len(habits)} habits across {len(categories)} categories.\n"
        context += f"Categories: {', '.join(categories.keys())}\n"
        
        if habit_stats:
            avg_success_rate = sum(
                stats['completed'] / stats['total'] if stats['total'] > 0 else 0 
                for stats in habit_stats.values()
            ) / len(habit_stats) * 100
            
            context += f"Average success rate: {avg_success_rate:.1f}%"
        
        return context
    
    def _parse_analysis_response(self, response_text: str) -> Dict[str, Any]:
        """Parse analysis response from AI"""
        try:
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except Exception as e:
            self.logger.error(f"Error parsing analysis response: {str(e)}")
        
        return self._get_fallback_analysis()
    
    def _get_fallback_analysis(self) -> Dict[str, Any]:
        """Fallback analysis if AI fails"""
        return {
            "performance_score": 7,
            "strengths": [
                "Consistent habit tracking",
                "Diverse habit categories",
                "Good habit variety"
            ],
            "improvements": [
                "Increase completion rates",
                "Add more specific goals",
                "Improve habit timing"
            ],
            "recommendations": [
                "Set specific, measurable goals for each habit",
                "Try habit stacking - link new habits to existing ones",
                "Focus on consistency over perfection"
            ]
        }

