# DeepSeek Clone - AI Chatbot

A sophisticated AI chatbot that mimics DeepSeek functionality using Meta's LLaMA API for intelligent responses with real-time message rendering and persistent chat history.

## 🚀 Live Demo
- **App:** https://deepseek-umber.vercel.app/

## 📦 Repository
- **GitHub:** https://github.com/Umanghere/DeepSeek

## 📸 Screenshots

### 💬 User Interface without Login
![User Interface Without Login](https://github.com/Umanghere/DeepSeek/blob/main/assets/images/Screenshot%202025-08-19%20113619.png?raw=true)

![No Chat History when Logged out](https://github.com/Umanghere/DeepSeek/blob/main/assets/images/Screenshot%202025-08-19%20113629.png?raw=true)

### 🔐 Authentication using Clerks
![User Authentication using Clerks](https://github.com/Umanghere/DeepSeek/blob/main/assets/images/Screenshot%202025-08-19%20113649.png?raw=true)

### 💬 User Interface after Login
![User Interface after Login](https://github.com/Umanghere/DeepSeek/blob/main/assets/images/Screenshot%202025-08-19%20113717.png?raw=true)

![Chat with AI](https://github.com/Umanghere/DeepSeek/blob/main/assets/images/Screenshot%202025-08-19%20113756.png?raw=true)

## ✨ Features
- 🤖 **AI-Powered Responses** - Integration with Meta's LLaMA API
- 🔐 **Secure Authentication** - Clerk-based user authentication and management
- ⚡ **Real-time Messaging** - Instant message rendering and streaming
- 💾 **Persistent Chat History** - User-specific conversations saved across sessions
- 🎨 **Modern UI/UX** - Clean, DeepSeek-inspired interface
- 📱 **Responsive Design** - Works seamlessly on all devices
- 👤 **User Profiles** - Personalized user experience with Clerk
- 🔄 **Session Management** - Maintain conversation context per user

## 🛠️ Tech Stack
**Frontend:** 
- React.js
- CSS3
- JavaScript (ES6+)
**Backend:** 
- Node.js
- Express.js
**Authentication:** 
- Clerk (User Management & Auth)
**AI Integration:** 
- Meta LLaMA API
**Other:**
- REST APIs, Session Management

## 📁 Project Structure
```
deepseek-clone/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── README.md
```

## ⚙️ Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
LLAMA_API_KEY=your_llama_api_key_here
LLAMA_API_URL=your_llama_api_endpoint
```

Create `.env.local` file in frontend directory:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- LLaMA API access
- Clerk account for authentication

### Installation

1. **Clone the repository**
```bash
- git clone https://github.com/Umanghere/DeepSeek-Clone
- cd DeepSeek-Clone
```

2. **Install dependencies**
```bash
# Install backend dependencies
- cd backend
- npm install

# Install frontend dependencies
- cd ../frontend
- npm install
```

3. **Set up environment variables**
```bash
# Create .env file in backend directory
- cp .env.example .env
# Add your LLaMA API credentials
```

4. **Run the application**
```bash
# Start backend server (Terminal 1)
- cd backend
- npm run dev

# Start frontend (Terminal 2)
- cd frontend
- npm start
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🔧 Scripts

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

#### Frontend  
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## 🌟 Key Highlights

- **LLaMA API Integration** - Successfully integrated Meta's LLaMA API for intelligent, context-aware responses
- **Real-time Communication** - Implemented streaming responses for natural conversation flow
- **Persistent Storage** - Chat history maintained across browser sessions
- **Clerk Authentication Integration** - Implemented secure user authentication with Clerk, enabling user-specific chat sessions, profile management, and seamless sign-in/sign-up experience with social providers support
- **Performance Optimized** - Efficient API calls and response caching
- **Professional UI** - Clean, modern interface inspired by leading AI platforms

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Multiple chat sessions/threads
- [ ] Export chat functionality
- [ ] Dark/light theme toggle
- [ ] Voice input integration
- [ ] Mobile app version

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

