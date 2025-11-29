#!/bin/bash

# Deployment script for Airbnb Sesame Keypad
# This script helps push to GitHub and prepare for Render deployment

set -e

echo "🚀 Airbnb Sesame Keypad - Deployment Helper"
echo "=============================================="
echo ""

# Check if git remote exists
if git remote -v | grep -q "origin"; then
    echo "✅ Git remote 'origin' already configured"
    git remote -v
else
    echo "⚠️  Git remote 'origin' not found"
    echo ""
    echo "Please create a GitHub repository first:"
    echo "1. Go to https://github.com/new"
    echo "2. Create repository: airbnb-sesame-keypad (PUBLIC)"
    echo "3. Then run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/airbnb-sesame-keypad.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo ""
echo "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Renaming branch to 'main'..."
    git branch -M main
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo ""
    echo "⚠️  You have uncommitted changes. Committing them..."
    git add .
    git commit -m "Prepare for deployment"
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "Next steps:"
echo "1. Go to https://render.com"
echo "2. Create new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Configure environment variables (see DEPLOYMENT.md)"
echo "5. Deploy!"
echo ""
echo "Your Render URL will be: https://airbnb-sesame-keypad.onrender.com"
echo ""

