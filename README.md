# Sigma GPT — AI-Powered Conversational Assistant

Sigma GPT is a full-stack AI-powered conversational assistant designed to provide an interactive chat experience. It combines a React frontend with a Node.js and Express backend, MongoDB for persistent data storage, and an AI integration for generating responses.

## Features

- **AI-Powered Conversations:** Interact with an AI assistant through a chat interface.
- **User Authentication:** Register and log in to your account.
- **Secure Authorization:** JWT-based authentication for protected routes.
- **Password Security:** Password hashing using bcrypt.
- **Chat History:** Save and retrieve previous conversations.
- **Thread Management:** Organize conversations into separate threads.
- **Responsive Interface:** A clean, interactive frontend built with React.
- **Persistent Storage:** Store user and conversation data using MongoDB.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML, CSS |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| AI Integration | Ollama utility (`Backend/utils/ollama.js`) |
| Development Tools | npm, Git, GitHub, VS Code |

## Project Structure

```text
SIGMAGPT/
├── Backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Thread.js
│   │   └── User.js
│   ├── routes/
│   │   ├── chat.js
│   │   └── user.js
│   ├── utils/
│   │   └── ollama.js
│   ├── Server.js
│   ├── package.json
│   └── package-lock.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── Chat.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MyContext.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Application Architecture

The application follows a frontend-backend architecture.

1. **Frontend:** React renders the user interface and handles user interactions.
2. **API Communication:** The frontend sends HTTP requests to the Express backend.
3. **Authentication:** The backend verifies user credentials and protects authorized routes using JWT.
4. **AI Processing:** The backend's AI utility communicates with the configured AI service to generate responses.
5. **Database:** MongoDB stores user information and conversation threads.
6. **Response Rendering:** The frontend displays the AI response and conversation history.

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB or a MongoDB Atlas account
- Git
- The AI service or local model runtime configured by the project

### 1. Clone the repository

```bash
git clone https://github.com/Himanshu9189/SigmaGPT--AI-Powered-Conservational-Assistant.git
cd SigmaGPT--AI-Powered-Conservational-Assistant
```

### 2. Configure the backend

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory.

Configure the environment variables required by your backend. For example:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
```

Replace the example values with your actual configuration. Check `Backend/Server.js` and `Backend/utils/ollama.js` for any additional variables required by your implementation.

**Security:** Never commit `.env` files, database credentials, JWT secrets, or private API keys to GitHub.

### 3. Start the backend

From the `Backend` directory, run the start command defined in `Backend/package.json`. If its script is named `start`, use:

```bash
npm start
```

If it uses a development script, use the corresponding command defined in `package.json`.

### 4. Configure and start the frontend

Open a second terminal from the project root:

```bash
cd Frontend
npm install
npm run dev
```

Vite will display the local development URL in the terminal. Open that URL in your browser.

Ensure that the frontend API URL matches the backend address and that the configured AI service is running and accessible.




## Security Considerations

- Store credentials and secrets in environment variables.
- Never expose private API keys in frontend code.
- Validate and authenticate requests to protected backend routes.
- Use strong JWT secrets and appropriate token expiration.
- Keep dependencies updated and review security advisories.
- Configure CORS appropriately for your deployment environment.

## Future Enhancements

- Streaming AI responses.
- Markdown rendering and code syntax highlighting.
- Conversation search and improved organization.
- Support for multiple AI models.
- Deployment with a production database and secure environment configuration.
- Additional user interface and accessibility improvements.

## Learning Outcomes

Developing Sigma GPT provides practical experience with:

- Full-stack web development using React and Node.js.
- REST API design and frontend-backend integration.
- Authentication and authorization.
- MongoDB data modeling and persistence.
- Integrating an AI service into a web application.
- Version control and project collaboration using Git and GitHub.
