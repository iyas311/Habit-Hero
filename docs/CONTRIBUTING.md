# 🤝 Contributing to Habit Hero

Thank you for considering contributing to Habit Hero! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. Read the [README.md](README.md)
2. Completed the [SETUP.md](SETUP.md) instructions
3. Familiarized yourself with the codebase
4. Checked existing issues and pull requests

### Finding Issues to Work On

- Look for issues labeled `good first issue` for beginners
- Check issues labeled `help wanted` for areas needing contribution
- Review the project roadmap for planned features

### Reporting Bugs

Before creating a bug report:

1. Check if the bug has already been reported
2. Verify you're using the latest version
3. Test with a clean installation

**Bug Report Template:**

```markdown
**Description:**
A clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Python Version: [e.g., 3.12]
- Node Version: [e.g., 18.0]

**Screenshots:**
If applicable
```

### Suggesting Features

**Feature Request Template:**

```markdown
**Feature Description:**
Clear description of the feature

**Use Case:**
Why this feature would be useful

**Proposed Implementation:**
How you think it could be implemented

**Alternatives Considered:**
Other approaches you've thought about
```

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/habit-hero.git
cd habit-hero

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/habit-hero.git
```

### 2. Create a Branch

```bash
# Update your local main
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 3. Make Changes

- Write clean, readable code
- Follow the coding standards below
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test

# Manual testing
# Run both servers and test in browser
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) below.

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### Python (Backend)

**Style Guide:**
- Follow [PEP 8](https://pep8.org/)
- Use 4 spaces for indentation
- Maximum line length: 100 characters
- Use descriptive variable names

**Example:**
```python
def calculate_streak(checkins: List[CheckIn]) -> int:
    """
    Calculate the current streak from check-ins.
    
    Args:
        checkins: List of CheckIn objects
        
    Returns:
        Current streak count
    """
    if not checkins:
        return 0
    
    streak = 0
    # Implementation...
    return streak
```

**Imports:**
```python
# Standard library imports
import os
import json

# Third-party imports
from flask import Flask, jsonify

# Local imports
from models import Habit
from services.ai_service import AIService
```

### TypeScript/React (Frontend)

**Style Guide:**
- Use 2 spaces for indentation
- Use functional components with hooks
- Use TypeScript for type safety
- Use meaningful component and variable names

**Example:**
```typescript
interface HabitCardProps {
  habit: Habit;
  onCheckIn: (habitId: number) => void;
  onEdit: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onCheckIn, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="habit-card">
      {/* Component content */}
    </div>
  );
};

export default HabitCard;
```

**File Organization:**
```typescript
// Imports
import React, { useState } from 'react';
import './HabitCard.css';

// Types/Interfaces
interface Props { ... }

// Component
const Component: React.FC<Props> = () => { ... };

// Export
export default Component;
```

### CSS

**Style Guide:**
- Use BEM naming convention
- Group related properties
- Use CSS variables for colors
- Mobile-first responsive design

**Example:**
```css
.habit-card {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Box model */
  padding: 1.5rem;
  margin: 1rem 0;
  
  /* Visual */
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* Animation */
  transition: transform 0.2s ease;
}

.habit-card:hover {
  transform: translateY(-2px);
}

.habit-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(ai): add personalized habit suggestions

Implemented AI-powered habit suggestions using Google Gemini.
Users can now get personalized recommendations based on their goals.

Closes #123

---

fix(calendar): correct date calculation for weekly habits

Fixed an issue where weekly habits were showing on incorrect days.

---

docs(readme): update setup instructions

Added instructions for obtaining Gemini API key.
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow guidelines
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots
If applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## Testing

### Backend Tests

```bash
cd backend
python -m pytest tests/
```

**Writing Tests:**
```python
def test_create_habit():
    """Test habit creation"""
    habit = Habit(
        name="Test Habit",
        frequency="daily",
        category="Health"
    )
    assert habit.name == "Test Habit"
```

### Frontend Tests

```bash
cd frontend
npm test
```

**Writing Tests:**
```typescript
import { render, screen } from '@testing-library/react';
import HabitCard from './HabitCard';

test('renders habit name', () => {
  const habit = { name: 'Test Habit', ... };
  render(<HabitCard habit={habit} />);
  expect(screen.getByText('Test Habit')).toBeInTheDocument();
});
```

## Documentation

### Code Comments

- Write clear, concise comments
- Explain "why" not "what"
- Document complex algorithms
- Add JSDoc/docstrings for functions

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Modifying architecture
- Adding dependencies

### API Documentation

Update API.md when:
- Adding new endpoints
- Changing request/response formats
- Modifying parameters

## Questions?

- Open an issue for questions
- Join our discussions
- Contact maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

Thank you for contributing to Habit Hero! 🎯
