# Project Documentation

## Overview

This is a React-based school management and alumni networking application called "OLOF ALUMNI" with Express.js backend. The project is a full-stack social platform that allows alumni to connect, share posts, manage galleries, and communicate through messaging. It features user authentication, profile management, real-time messaging, and a comprehensive admin panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: React 18 with TypeScript, Vite for bundling
- **State Management**: TanStack React Query for server state, React Context for authentication
- **Routing**: Wouter for client-side routing
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Custom CSS variables for dark theme
  - Radix UI for accessible component primitives
  - shadcn/ui component library
- **Real-time Features**: WebSocket integration for live messaging and notifications

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Authentication**: JWT tokens with bcrypt for password hashing
- **File Upload**: Multer for handling media uploads
- **Email Service**: Nodemailer for verification emails

### File Structure
```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/               # Express backend
│   ├── services/         # Business logic services
│   └── routes.ts         # API endpoints
├── shared/               # Shared types and schemas
└── database migrations/  # Drizzle schema definitions

### Key Features
- **User Management**: Registration, verification, profile setup
- **Social Features**: Posts with media, comments, reactions
- **Messaging**: Real-time chat conversations
- **Gallery**: Photo sharing and management
- **Notifications**: Real-time alerts for user interactions

### Design Patterns
- **Component Architecture**: Reusable UI components with consistent theming
- **Authentication Flow**: JWT-based auth with refresh tokens
- **Real-time Communication**: WebSocket connections for live updates
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## External Dependencies

### Database Dependencies
- **PostgreSQL**: Primary database for all application data
- **Connection Pool**: @neondatabase/serverless for database connections

### Email Dependencies
- **SMTP Service**: Configured for user verification emails
- **Templates**: HTML email templates for user communications

### Storage Dependencies
- **File System**: Local file storage for uploaded media
- **File Types**: Support for images, videos, and documents