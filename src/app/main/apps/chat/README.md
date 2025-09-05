# 🚀 Chat App - Message Types Demo

This chat application now supports multiple message types based on your API structure. Here's what's been implemented:

## 📋 Message Types Supported

### 1. **Template Messages** (`messageType: "template"`)
- **Text Headers**: Beautiful cards with text headers
- **Media Headers**: Support for video and image headers
- **Action Buttons**: Interactive buttons that link to external URLs
- **Footer Text**: Customizable footer messages
- **Sender Info**: Displays sender avatar and name

### 2. **System Messages** (`messageType: "system_message_v2"`)
- **Agent Assignment**: When conversations are assigned to agents
- **Bot Actions**: Messages sent by bots
- **API Calls**: System notifications for API operations
- **Tag Operations**: When tags are added/modified
- **Different Icons**: Each action type has its own icon and color

### 3. **URL Messages** (`messageType: "text" with URLs)
- **Automatic Detection**: Automatically detects URLs in text messages
- **Link Previews**: Creates beautiful link previews
- **Clickable Buttons**: Users can click to open links
- **Domain Display**: Shows the website domain

### 4. **Regular Text Messages** (`messageType: "text"`)
- **Standard Chat**: Normal text messages
- **Rich Formatting**: Supports line breaks and emojis
- **Status Indicators**: Shows read/delivered status

## 🎯 How to View the Demo

1. **Navigate to Chat App**: Go to `/apps/chat` in your application
2. **Click Demo Button**: Look for the "Demo" button in the left sidebar
3. **View All Types**: The demo page shows all message types with their styling

## 🔧 API Structure

Your API should return messages in this format:

```json
{
  "messages": [
    {
      "id": "unique-id",
      "message": {
        "messageType": "template|system_message_v2|text",
        "templateMessage": { /* template structure */ },
        "text": "message text",
        "actionType": "ASSIGN_AGENT|SEND_MESSAGE|API_CALL|SET_TAGS",
        "actorType": "USER|BOT|SYSTEM"
      },
      "messageOriginType": "USER|CUSTOMER|SYSTEM",
      "dateCreated": "ISO date string",
      "senderUser": { /* user info */ },
      "messageMetadata": { "status": "delivered|read" }
    }
  ]
}
```

## 🎨 Styling Features

- **Responsive Design**: Works on all screen sizes
- **Theme Integration**: Uses your existing Material-UI theme
- **Hover Effects**: Smooth animations and interactions
- **Modern UI**: Clean, professional appearance
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Getting Started

1. The demo is automatically available at `/apps/chat/demo`
2. All message types are rendered with proper styling
3. Interactive elements (buttons, links) are fully functional
4. The chat interface automatically detects and renders the correct message type

## 🔍 Testing Different Types

To test different message types, modify the mock API data in:
```
src/@mock-api/api/chat-api.js
```

The demo page shows exactly how each message type will appear in your actual chat interface!










