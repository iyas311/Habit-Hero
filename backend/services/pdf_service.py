"""
PDF Report Generation Service for Habit Hero
Generates comprehensive habit progress reports in PDF format
"""

from datetime import datetime, timedelta
from io import BytesIO
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.platypus import Image as RLImage
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics import renderPDF
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import os

class PDFReportService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom styles for the PDF report"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=HexColor('#667eea')
        ))
        
        # Section heading style
        self.styles.add(ParagraphStyle(
            name='CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            textColor=HexColor('#2c3e50')
        ))
        
        # Subheading style
        self.styles.add(ParagraphStyle(
            name='CustomSubHeading',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=8,
            textColor=HexColor('#34495e')
        ))
        
        # Body text style
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_LEFT
        ))
        
        # Stats style
        self.styles.add(ParagraphStyle(
            name='StatsText',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=4,
            alignment=TA_LEFT,
            textColor=HexColor('#27ae60')
        ))

    def generate_habit_report(self, habits_data, checkins_data, analytics_data, date_range=None):
        """
        Generate a comprehensive habit progress report
        
        Args:
            habits_data: List of habit objects
            checkins_data: List of check-in objects
            analytics_data: Overall analytics data
            date_range: Tuple of (start_date, end_date) or None for all time
            
        Returns:
            BytesIO object containing the PDF
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)
        
        # Build the PDF content
        story = []
        
        # Add title page
        story.extend(self._create_title_page(analytics_data, date_range))
        story.append(PageBreak())
        
        # Add executive summary
        story.extend(self._create_executive_summary(habits_data, analytics_data))
        story.append(PageBreak())
        
        # Add habit performance section
        story.extend(self._create_habit_performance(habits_data, checkins_data))
        story.append(PageBreak())
        
        # Add streak analysis
        story.extend(self._create_streak_analysis(habits_data, checkins_data))
        story.append(PageBreak())
        
        # Add timeline and notes
        story.extend(self._create_timeline_notes(habits_data, checkins_data, date_range))
        
        # Build PDF
        doc.build(story)
        
        # Get PDF content
        buffer.seek(0)
        return buffer

    def _create_title_page(self, analytics_data, date_range):
        """Create the title page of the report"""
        elements = []
        
        # Main title
        title = Paragraph("Habit Hero Progress Report", self.styles['CustomTitle'])
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        # Report date
        report_date = datetime.now().strftime("%B %d, %Y")
        date_para = Paragraph(f"Generated on: {report_date}", self.styles['CustomBody'])
        elements.append(date_para)
        elements.append(Spacer(1, 10))
        
        # Date range if specified
        if date_range:
            start_date, end_date = date_range
            range_para = Paragraph(f"Report Period: {start_date} to {end_date}", self.styles['CustomBody'])
            elements.append(range_para)
            elements.append(Spacer(1, 20))
        else:
            elements.append(Spacer(1, 20))
        
        # Quick stats box
        stats_data = [
            ['Total Habits', str(analytics_data.get('total_habits', 0))],
            ['Total Check-ins', str(analytics_data.get('total_completed', 0))],
            ['Success Rate', f"{analytics_data.get('overall_success_rate', 0)}%"],
            ['Current Streak', f"{analytics_data.get('current_streak', 0)} days"]
        ]
        
        stats_table = Table(stats_data, colWidths=[2*inch, 1.5*inch])
        stats_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), HexColor('#f8f9ff')),
            ('TEXTCOLOR', (0, 0), (-1, -1), black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (0, 0), (0, -1), HexColor('#667eea')),
            ('TEXTCOLOR', (0, 0), (0, -1), white),
            ('GRID', (0, 0), (-1, -1), 1, black)
        ]))
        
        elements.append(stats_table)
        elements.append(Spacer(1, 30))
        
        return elements

    def _create_executive_summary(self, habits_data, analytics_data):
        """Create executive summary section"""
        elements = []
        
        # Section title
        title = Paragraph("Executive Summary", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Summary content
        total_habits = len(habits_data)
        total_completed = analytics_data.get('total_completed', 0)
        success_rate = analytics_data.get('overall_success_rate', 0)
        current_streak = analytics_data.get('current_streak', 0)
        
        summary_text = f"""
        This report provides a comprehensive overview of your habit tracking progress. 
        You are currently tracking <b>{total_habits} habits</b> with an overall success rate of 
        <b>{success_rate}%</b>. Your current streak stands at <b>{current_streak} days</b>, 
        demonstrating your commitment to building better habits.
        """
        
        summary_para = Paragraph(summary_text, self.styles['CustomBody'])
        elements.append(summary_para)
        elements.append(Spacer(1, 20))
        
        # Category breakdown
        categories = {}
        for habit in habits_data:
            category = habit.get('category', 'Uncategorized')
            categories[category] = categories.get(category, 0) + 1
        
        if categories:
            cat_title = Paragraph("Habits by Category", self.styles['CustomSubHeading'])
            elements.append(cat_title)
            elements.append(Spacer(1, 8))
            
            cat_data = [['Category', 'Count', 'Percentage']]
            for category, count in categories.items():
                percentage = round((count / total_habits) * 100, 1)
                cat_data.append([category, str(count), f"{percentage}%"])
            
            cat_table = Table(cat_data, colWidths=[2*inch, 1*inch, 1*inch])
            cat_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#667eea')),
                ('TEXTCOLOR', (0, 0), (-1, 0), white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, black)
            ]))
            
            elements.append(cat_table)
        
        return elements

    def _create_habit_performance(self, habits_data, checkins_data):
        """Create habit performance section"""
        elements = []
        
        # Section title
        title = Paragraph("Habit Performance", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Calculate performance for each habit
        performance_data = [['Habit Name', 'Category', 'Frequency', 'Success Rate', 'Current Streak']]
        
        for habit in habits_data:
            habit_id = habit['id']
            habit_checkins = [c for c in checkins_data if c['habit_id'] == habit_id]
            
            if habit_checkins:
                total_checkins = len(habit_checkins)
                completed_checkins = len([c for c in habit_checkins if c['completed']])
                success_rate = round((completed_checkins / total_checkins) * 100, 1)
            else:
                success_rate = 0
            
            # Calculate current streak (simplified)
            current_streak = self._calculate_current_streak(habit_checkins)
            
            performance_data.append([
                habit['name'],
                habit['category'],
                habit['frequency'],
                f"{success_rate}%",
                f"{current_streak} days"
            ])
        
        # Create performance table
        perf_table = Table(performance_data, colWidths=[2*inch, 1.2*inch, 0.8*inch, 1*inch, 1*inch])
        perf_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#667eea')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
        ]))
        
        elements.append(perf_table)
        
        return elements

    def _create_streak_analysis(self, habits_data, checkins_data):
        """Create streak analysis section"""
        elements = []
        
        # Section title
        title = Paragraph("Streak Analysis", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Analyze streaks for each habit
        streak_data = [['Habit Name', 'Current Streak', 'Longest Streak', 'Streak Status']]
        
        for habit in habits_data:
            habit_id = habit['id']
            habit_checkins = [c for c in checkins_data if c['habit_id'] == habit_id and c['completed']]
            
            if habit_checkins:
                current_streak = self._calculate_current_streak(habit_checkins)
                longest_streak = self._calculate_longest_streak(habit_checkins)
                
                # Determine streak status
                if current_streak >= 7:
                    status = "🔥 On Fire"
                elif current_streak >= 3:
                    status = "📈 Building"
                elif current_streak > 0:
                    status = "🌱 Starting"
                else:
                    status = "⏸️ Needs Attention"
            else:
                current_streak = 0
                longest_streak = 0
                status = "🆕 New Habit"
            
            streak_data.append([
                habit['name'],
                f"{current_streak} days",
                f"{longest_streak} days",
                status
            ])
        
        # Create streak table
        streak_table = Table(streak_data, colWidths=[2.5*inch, 1.2*inch, 1.2*inch, 1.5*inch])
        streak_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#667eea')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
        ]))
        
        elements.append(streak_table)
        
        return elements

    def _create_timeline_notes(self, habits_data, checkins_data, date_range):
        """Create timeline and notes section with table format"""
        elements = []
        
        # Section title
        title = Paragraph("Recent Activity & Notes", self.styles['CustomHeading'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Create habit lookup dictionary
        habit_lookup = {habit['id']: habit['name'] for habit in habits_data}
        
        # Sort all check-ins by date (most recent first)
        sorted_checkins = sorted(checkins_data, key=lambda x: x['date'], reverse=True)
        
        if sorted_checkins:
            # Prepare table data - show last 15 activities
            table_data = [['Date', 'Habit', 'Status', 'Notes']]
            
            for checkin in sorted_checkins[:15]:
                # Format date
                date_str = datetime.strptime(checkin['date'], '%Y-%m-%d').strftime('%m/%d/%Y')
                
                # Get habit name
                habit_name = habit_lookup.get(checkin['habit_id'], 'Unknown Habit')
                
                # Status
                status = "✅ Completed" if checkin['completed'] else "❌ Missed"
                
                # Notes (truncate if too long)
                notes = checkin.get('notes', '').strip()
                if len(notes) > 50:
                    notes = notes[:47] + "..."
                if not notes:
                    notes = "-"
                
                table_data.append([date_str, habit_name, status, notes])
            
            # Create table
            activity_table = Table(table_data, colWidths=[1*inch, 2*inch, 1.2*inch, 2.3*inch])
            activity_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#667eea')),
                ('TEXTCOLOR', (0, 0), (-1, 0), white),
                ('ALIGN', (0, 0), (2, -1), 'CENTER'),  # Center align date, habit, status
                ('ALIGN', (3, 1), (3, -1), 'LEFT'),    # Left align notes column
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, HexColor('#e0e0e0')),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#f8f9ff'), white]),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 8)
            ]))
            
            elements.append(activity_table)
        else:
            no_activity = Paragraph("No activity recorded yet.", self.styles['CustomBody'])
            elements.append(no_activity)
        
        return elements

    def _calculate_current_streak(self, checkins_data):
        """Calculate current streak from check-ins"""
        if not checkins_data:
            return 0
        
        # Sort check-ins by date (most recent first)
        sorted_checkins = sorted(checkins_data, key=lambda x: x['date'], reverse=True)
        
        today = datetime.now().date()
        current_date = today
        streak_count = 0
        
        # Check consecutive days backwards from today
        for checkin in sorted_checkins:
            checkin_date = datetime.strptime(checkin['date'], '%Y-%m-%d').date()
            if checkin_date == current_date:
                streak_count += 1
                current_date -= timedelta(days=1)
            elif checkin_date < current_date:
                break
        
        return streak_count

    def _calculate_longest_streak(self, checkins_data):
        """Calculate longest streak from check-ins"""
        if not checkins_data:
            return 0
        
        # Sort check-ins by date
        sorted_checkins = sorted(checkins_data, key=lambda x: x['date'])
        
        longest_streak = 0
        current_streak = 0
        last_date = None
        
        for checkin in sorted_checkins:
            checkin_date = datetime.strptime(checkin['date'], '%Y-%m-%d').date()
            
            if last_date is None:
                current_streak = 1
                last_date = checkin_date
            else:
                days_diff = (checkin_date - last_date).days
                if days_diff == 1:  # Consecutive day
                    current_streak += 1
                else:  # Gap in dates
                    longest_streak = max(longest_streak, current_streak)
                    current_streak = 1
                last_date = checkin_date
        
        return max(longest_streak, current_streak)
