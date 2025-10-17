# 🔒 Security Guide - Habit Hero

This guide explains how to keep your API keys secure and how others can use your project safely.

## 🛡️ Protecting Your API Keys

### ✅ What's Already Protected

Your project is already configured to protect sensitive information:

1. **`.gitignore` is configured** - `.env` files are never committed to Git
2. **`.env.example` template** - Shows what variables are needed without exposing real values
3. **Environment variables** - Secrets are loaded from `.env`, not hardcoded

### 📝 Your `.env` File (Simplified)

You can remove the `DATABASE_URL` line since the app has smart defaults:

```env
# Environment Variables for Habit Hero
# DO NOT COMMIT THIS FILE TO GIT

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production

# Gemini AI API Key (Required for AI features)
GEMINI_API_KEY=AIzaSyAaJZ4TXuU67KKR9AO7ncupRqffRzBBuhU
```

**Why you can remove DATABASE_URL:**
- The app automatically creates a database at `backend/instance/habits.db`
- No configuration needed for local development
- Only specify DATABASE_URL if using PostgreSQL or custom location

## 👥 How Others Can Use Your Project

### For Public GitHub Repository

When you push to GitHub, others will:

1. **Clone your repository** (without your `.env` file)
2. **See `.env.example`** (template with instructions)
3. **Create their own `.env`** with their own API key
4. **Run the app** with their credentials

### Setup Instructions for Others

**Step 1: Clone the repository**
```bash
git clone https://github.com/yourusername/habit-hero.git
cd habit-hero
```

**Step 2: Backend setup**
```bash
cd backend

# Copy the example file
cp .env.example .env

# Edit .env and add your own API key
# (They get their own key from Google AI Studio)
```

**Step 3: Install and run**
```bash
pip install -r requirements.txt
python app.py
```

## 🔑 Getting a Gemini API Key

Users need to get their own free API key:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Paste into their `.env` file

**Free Tier Limits:**
- 60 requests per minute
- Perfect for personal use
- No credit card required

## 🚨 What NOT to Do

### ❌ Never Commit These Files
```
.env
.env.local
*.db
instance/
```

### ❌ Never Hardcode API Keys
```python
# BAD - Don't do this!
api_key = "AIzaSyAaJZ4TXuU67KKR9AO7ncupRqffRzBBuhU"

# GOOD - Use environment variables
api_key = os.environ.get('GEMINI_API_KEY')
```

### ❌ Never Share Your API Key
- Don't post it in issues
- Don't share it in Discord/Slack
- Don't include it in screenshots
- Don't email it to anyone

## 🔍 Checking If Your Key Is Exposed

### Before Pushing to GitHub

1. **Check what will be committed:**
```bash
git status
```

2. **Verify .env is ignored:**
```bash
git check-ignore .env
# Should output: .env
```

3. **Search for accidental key exposure:**
```bash
# Search all files for your API key pattern
grep -r "AIzaSy" --exclude-dir=node_modules --exclude-dir=.git
```

### If You Accidentally Exposed Your Key

**Immediate Actions:**

1. **Revoke the key immediately**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Delete the exposed key
   - Create a new one

2. **Remove from Git history** (if committed)
```bash
# Remove from latest commit
git reset HEAD~1
git add .
git commit -m "Remove sensitive data"

# If already pushed, force push (use with caution)
git push --force
```

3. **Update your `.env` with new key**

## 🌐 Deployment Security

### Environment Variables on Hosting Platforms

**Vercel/Netlify (Frontend):**
```
Settings → Environment Variables
Add: REACT_APP_API_URL=your-backend-url
```

**Railway/Heroku (Backend):**
```
Settings → Config Vars
Add: 
  GEMINI_API_KEY=your-key
  SECRET_KEY=random-secure-key
  FLASK_ENV=production
```

### Generate Secure SECRET_KEY

```python
# Run this in Python to generate a secure key
import secrets
print(secrets.token_hex(32))
```

## 📋 Security Checklist

Before making your repository public:

- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` exists with placeholder values
- [ ] No API keys in code files
- [ ] No API keys in commit history
- [ ] `SECRET_KEY` is randomly generated
- [ ] Database files are ignored
- [ ] README explains how to get API keys
- [ ] Security guide is included

## 🤝 For Contributors

If you're contributing to this project:

1. **Never commit your `.env` file**
2. **Use `.env.example` as reference**
3. **Don't include API keys in pull requests**
4. **Test with your own API key**
5. **Report security issues privately**

## 📧 Reporting Security Issues

If you find a security vulnerability:

1. **Don't open a public issue**
2. **Email the maintainer directly**
3. **Provide details about the vulnerability**
4. **Wait for a response before disclosing**

## 🔐 Best Practices Summary

### ✅ DO
- Use environment variables for secrets
- Keep `.env` in `.gitignore`
- Provide `.env.example` template
- Generate strong SECRET_KEY
- Rotate keys periodically
- Use different keys for dev/prod

### ❌ DON'T
- Commit `.env` files
- Hardcode API keys
- Share your API keys
- Use default SECRET_KEY in production
- Expose keys in screenshots
- Include keys in documentation

## 📚 Additional Resources

- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Google AI Studio](https://makersuite.google.com/app/apikey)

---

**Remember:** Your API key is like a password. Treat it with the same level of security! 🔒
