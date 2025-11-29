#!/bin/bash

# Render Deployment Script
# This script creates a Render web service via API

set -e

RENDER_API_KEY="rnd_pQNpUB1CVUkLMAFGfQKJvu0mbHtT"
OWNER_ID="tea-d4le4n49c44c73fffqmg"
SERVICE_NAME="airbnb-sesame-keypad"
GITHUB_REPO="https://github.com/aboutdann/airbnb-sesame-keypad"

echo "🚀 Deploying to Render..."
echo ""

# Create the service
echo "Creating Render web service..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"web_service\",
    \"name\": \"$SERVICE_NAME\",
    \"ownerId\": \"$OWNER_ID\",
    \"repo\": \"$GITHUB_REPO\",
    \"branch\": \"main\",
    \"buildCommand\": \"npm install\",
    \"startCommand\": \"npm start\",
    \"serviceDetails\": {
      \"envVars\": [
        {\"key\": \"PORT\", \"value\": \"8080\"},
        {\"key\": \"NODE_ENV\", \"value\": \"production\"},
        {\"key\": \"ADMIN_PIN\", \"value\": \"123456\"}
      ]
    },
    \"planId\": \"starter\"
  }" \
  https://api.render.com/v1/services)

echo "Response: $RESPONSE"

# Check if service was created
if echo "$RESPONSE" | grep -q "id"; then
  SERVICE_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo ""
  echo "✅ Service created! ID: $SERVICE_ID"
  echo "🌐 Your service will be available at: https://$SERVICE_NAME.onrender.com"
  echo ""
  echo "⚠️  IMPORTANT: Add remaining environment variables in Render dashboard:"
  echo "   - SESAME_API_KEY"
  echo "   - SESAME_DEVICE_UUID"
  echo "   - IGMS_CLIENT_ID"
  echo "   - IGMS_CLIENT_SECRET"
  echo "   - KEPAD_URL"
  echo "   - IGMS_REDIRECT_URI"
  echo "   - MORNING_MESSAGE_HOUR"
  echo "   - MORNING_MESSAGE_MINUTE"
else
  echo ""
  echo "⚠️  API deployment had issues. Please deploy via Render dashboard:"
  echo "   1. Go to: https://dashboard.render.com"
  echo "   2. Click 'New +' → 'Web Service'"
  echo "   3. Connect GitHub repo: $GITHUB_REPO"
  echo "   4. Configure as shown in QUICK_DEPLOY.md"
fi

