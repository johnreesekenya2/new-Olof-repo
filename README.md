# OLOF Alumni App

A comprehensive school management and alumni networking application built with React and Express.js.

## Features

- 🔐 User authentication and authorization
- 👥 Alumni networking and profiles
- 📝 Social posting and interactions
- 💬 Real-time messaging
- 📸 Photo gallery
- 📊 Admin dashboard
- 🌙 Dark theme support

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for bundling
- TanStack React Query for state management
- Tailwind CSS + shadcn/ui components
- Wouter for routing

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- JWT authentication
- WebSocket for real-time features
- Multer for file uploads

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

## Environment Variables

Create a `.env` file with:

```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## Deployment

This app is configured for deployment on Render with PostgreSQL database.

## License

MIT License
