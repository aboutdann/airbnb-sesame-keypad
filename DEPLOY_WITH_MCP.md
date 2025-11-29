# 🚀 Deploy Using Render MCP Server

## ✅ Render MCP Server Configured!

The Render MCP server has been added to your Cursor configuration. This allows you to deploy and manage your Render services directly from Cursor using natural language prompts.

## 📋 What's Configured

- **MCP Server URL**: `https://mcp.render.com/mcp`
- **API Key**: Configured with your Render API key
- **Location**: `~/.cursor/mcp.json`

## 🎯 How to Use

### Step 1: Set Your Render Workspace

First, tell Cursor which Render workspace to use:

```
Set my Render workspace to [WORKSPACE_NAME]
```

Or Cursor will prompt you when you ask to deploy.

### Step 2: Deploy Your Service

You can now use natural language prompts like:

```
Create a new web service named airbnb-sesame-keypad using the GitHub repository https://github.com/aboutdann/airbnb-sesame-keypad
```

Or:

```
Deploy my airbnb-sesame-keypad app to Render with Node.js runtime, build command "npm install", and start command "npm start"
```

### Step 3: Configure Environment Variables

After the service is created, you can update environment variables:

```
Update environment variables for airbnb-sesame-keypad service with PORT=8080, NODE_ENV=production, ADMIN_PIN=123456
```

## 📝 Example Prompts

Here are some example prompts you can use with the Render MCP server:

### Service Management
- "List all my Render services"
- "Show me details about airbnb-sesame-keypad service"
- "What's the status of my airbnb-sesame-keypad deployment?"

### Environment Variables
- "Update environment variables for airbnb-sesame-keypad"
- "Add SESAME_API_KEY to my service environment variables"

### Logs & Monitoring
- "Show me the latest logs for airbnb-sesame-keypad"
- "What errors occurred in my service today?"
- "Show me the deployment history for airbnb-sesame-keypad"

### Metrics
- "What's the CPU usage for my service?"
- "Show me response times for airbnb-sesame-keypad"

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually via dashboard:

1. Go to: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo: `airbnb-sesame-keypad`
4. Configure as shown in `DEPLOYMENT_COMPLETE.md`

## 📚 Reference

- [Render MCP Server Documentation](https://render.com/docs/mcp-server)
- [Supported Actions](https://render.com/docs/mcp-server#supported-actions)

## ⚠️ Important Notes

- The MCP server supports creating web services and static sites
- Free instances are not supported via MCP (use dashboard for free tier)
- Environment variables can be updated via MCP
- Service deletion/modification (except env vars) must be done via dashboard or API

## 🎉 Next Steps

1. **Set your workspace**: Tell Cursor your Render workspace name
2. **Deploy**: Use a natural language prompt to create the service
3. **Configure**: Add environment variables via MCP or dashboard
4. **Monitor**: Use MCP to check logs and metrics

Your service will be available at: `https://airbnb-sesame-keypad.onrender.com`

