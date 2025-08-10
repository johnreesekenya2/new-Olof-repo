import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { sendVerificationEmail, sendWelcomeEmail } from "./services/email";
import { insertUserSchema, loginSchema, verificationSchema, profileSetupSchema, insertPostSchema, insertCommentSchema } from "@shared/schema";
import { eq, desc, and, ne } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as fs from "fs-extra";
import { users, posts, gallery, notifications, comments, conversations, messages } from "../shared/schema.js";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "olof-alumni-secret";

// Multer configuration for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
    }
  }
});

// WebSocket connections map
const wsConnections = new Map<string, WebSocket>();

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const token = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('token');

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        wsConnections.set(decoded.userId, ws);

        ws.on('close', () => {
          wsConnections.delete(decoded.userId);
        });

        ws.on('message', async (data) => {
          try {
            const message = JSON.parse(data.toString());
            if (message.type === 'chat_message') {
              // Handle real-time message
              const { conversationId, content, fileUrl, fileType, recipientId } = message;

              const newMessage = await storage.createMessage({
                conversationId,
                content,
                fileUrl,
                fileType,
                senderId: decoded.userId
              });

              // Send to recipient if online
              const recipientWs = wsConnections.get(recipientId);
              if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
                recipientWs.send(JSON.stringify({
                  type: 'new_message',
                  message: newMessage
                }));
              }

              // Confirm to sender
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'message_sent',
                  message: newMessage
                }));
              }
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        });
      } catch (error) {
        ws.close();
      }
    } else {
      ws.close();
    }
  });

  // Authentication middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  };

  // Health check endpoint - test route
  app.get('/api/health', (req, res) => {
    console.log('Health check accessed');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  });

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const { name, email } = userData;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Generate verification code
      const verificationCode = generateVerificationCode();

      // Create user
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Set verification code
      await storage.setVerificationCode(userData.email, verificationCode);

      // Send verification email
      await sendVerificationEmail(userData.email, userData.name, verificationCode);

      // Create notification for new user registration
      await createNotification(
        "user_registered",
        "New Alumni Joined",
        `${name} just joined the OLOF Alumni community!`,
        newUser.id
      );

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification code.',
        email: userData.email
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  });

  app.post('/api/auth/verify', async (req, res) => {
    try {
      const { email, code } = verificationSchema.parse(req.body);

      const isValid = await storage.verifyUser(email, code);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }

      // Send welcome email
      const user = await storage.getUserByEmail(email);
      if (user) {
        await sendWelcomeEmail(user.email, user.name);
      }

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Verification failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user || !user.isVerified) {
        return res.status(401).json({ message: 'Invalid credentials or unverified account' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          coverPhoto: user.coverPhoto,
          bio: user.bio,
          gender: user.gender,
          yearOfCompletion: user.yearOfCompletion,
          streamClan: user.streamClan
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
  });

  app.post('/api/auth/profile-setup', authenticateToken, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]), async (req: any, res) => {
    try {
      const { bio } = profileSetupSchema.parse(req.body);
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const updates: any = { bio };

      if (files?.profilePicture?.[0]) {
        updates.profilePicture = `/uploads/${files.profilePicture[0].filename}`;
      }

      if (files?.coverPhoto?.[0]) {
        updates.coverPhoto = `/uploads/${files.coverPhoto[0].filename}`;
      }

      const updatedUser = await storage.updateUser(req.user.userId, updates);

      res.json({
        message: 'Profile setup completed',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
          coverPhoto: updatedUser.coverPhoto,
          bio: updatedUser.bio,
          gender: updatedUser.gender,
          yearOfCompletion: updatedUser.yearOfCompletion,
          streamClan: updatedUser.streamClan
        }
      });
    } catch (error) {
      console.error('Profile setup error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Profile setup failed' });
    }
  });

  // User routes
  app.get('/api/users', authenticateToken, async (req: any, res) => {
    try {
      const usersList = await storage.getAllUsers();
      res.json(usersList.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        yearOfCompletion: user.yearOfCompletion,
        streamClan: user.streamClan,
        bio: user.bio
      })));
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.get('/api/users/:id', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        bio: user.bio,
        yearOfCompletion: user.yearOfCompletion,
        streamClan: user.streamClan,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Post routes
  app.get('/api/posts', authenticateToken, async (req: any, res) => {
    try {
      const postsList = await storage.getPosts();
      res.json(postsList);
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  app.post('/api/posts', authenticateToken, upload.single('file'), async (req: any, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const userId = req.user!.userId; // Corrected to use userId from decoded token

      let fileUrl = null;
      let fileType = null;

      if (req.file) {
        fileUrl = `/uploads/${req.file.filename}`;
        fileType = req.file.mimetype;
      }

      const newPost = await storage.createPost({
        ...postData,
        userId: userId,
        fileUrl: fileUrl,
        fileType: fileType
      });

      // Create notification for new post
      await createNotification(
        "new_post",
        "New Post Shared",
        `${req.user!.name} shared a new post`,
        userId
      );

      res.json({
        ...newPost,
        user: { name: req.user!.name, profilePicture: req.user!.profilePicture },
        fileUrl: fileUrl || null,
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create post' });
    }
  });

  app.post('/api/posts/:id/reactions', authenticateToken, async (req: any, res) => {
    try {
      const { reaction } = req.body;
      // Implementation for reactions would go here
      res.json({ message: 'Reaction updated' });
    } catch (error) {
      console.error('Update reaction error:', error);
      res.status(400).json({ message: 'Failed to update reaction' });
    }
  });

  app.post('/api/posts/:id/comments', authenticateToken, async (req: any, res) => {
    try {
      const { content } = req.body;
      const comment = await storage.createComment({
        postId: req.params.id,
        userId: req.user.userId, // Corrected to use userId from decoded token
        content
      });

      res.status(201).json(comment);
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(400).json({ message: 'Failed to create comment' });
    }
  });

  // Message routes
  app.get('/api/conversations', authenticateToken, async (req: any, res) => {
    try {
      const conversations = await storage.getConversations(req.user.userId);
      res.json(conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  });

  app.post('/api/conversations', authenticateToken, async (req: any, res) => {
    try {
      const { participantId } = req.body;

      // Check if conversation already exists
      let conversation = await storage.getConversation(req.user.userId, participantId); // Corrected to use userId from decoded token

      if (!conversation) {
        conversation = await storage.createConversation(req.user.userId, participantId); // Corrected to use userId from decoded token
      }

      res.json(conversation);
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(400).json({ message: 'Failed to create conversation' });
    }
  });

  app.get('/api/conversations/:id/messages', authenticateToken, async (req: any, res) => {
    try {
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  app.post('/api/conversations/:id/messages', authenticateToken, upload.single('file'), async (req: any, res) => {
    try {
      const { content } = req.body;
      const conversationId = req.params.id;
      const userId = req.user.userId;

      let fileUrl = null;
      let fileType = null;

      if (req.file) {
        fileUrl = `/uploads/${req.file.filename}`;
        fileType = req.file.mimetype;
      }

      const message = await storage.createMessage({
        conversationId,
        content: content || null,
        fileUrl,
        fileType,
        senderId: userId
      });

      res.json(message);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(400).json({ message: 'Failed to send message' });
    }
  });

  app.get('/api/conversations/:id', authenticateToken, async (req: any, res) => {
    try {
      const conversations = await storage.getConversations(req.user.userId);
      const conversation = conversations.find(c => c.id === req.params.id);

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      res.json(conversation);
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ message: 'Failed to fetch conversation' });
    }
  });

  // Delete post
  app.delete("/api/posts/:id", authenticateToken, async (req: any, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.userId;

      const [post] = await db
        .select()
        .from(posts)
        .where(and(eq(posts.id, postId), eq(posts.userId, userId)));

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      await db.delete(posts).where(eq(posts.id, postId));

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", authenticateToken, async (req: any, res) => {
    try {
      const galleryPhotos = await db
        .select({
          id: gallery.id,
          userId: gallery.userId,
          filename: gallery.filename,
          originalName: gallery.originalName,
          mimeType: gallery.mimeType,
          size: gallery.size,
          caption: gallery.caption,
          createdAt: gallery.createdAt,
          user: {
            id: users.id,
            name: users.name,
            profilePicture: users.profilePicture,
            yearOfCompletion: users.yearOfCompletion,
            streamClan: users.streamClan,
          }
        })
        .from(gallery)
        .leftJoin(users, eq(gallery.userId, users.id))
        .orderBy(desc(gallery.createdAt));

      const photosWithUrls = galleryPhotos.map(photo => ({
        ...photo,
        url: `/uploads/gallery/${photo.filename}`
      }));

      res.json(photosWithUrls);
    } catch (error) {
      console.error("Get gallery error:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.post("/api/gallery", authenticateToken, upload.single("file"), async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const caption = req.body.caption || "";

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Move file to gallery directory
      const galleryDir = path.join(process.cwd(), "uploads", "gallery");
      await fs.ensureDir(galleryDir);

      const newFilename = `${Date.now()}-${req.file.originalname}`;
      const newPath = path.join(galleryDir, newFilename);
      await fs.move(req.file.path, newPath);

      const [photo] = await db
        .insert(gallery)
        .values({
          id: randomUUID(),
          userId,
          filename: newFilename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          caption: caption || null,
        })
        .returning();

      // Get user info for notification
      const user = await storage.getUser(userId);

      // Create notification for new photo
      await createNotification(
        "new_photo",
        "New Photo Shared",
        `${user?.name || 'Someone'} shared a new photo in the gallery`,
        userId
      );

      res.json({
        ...photo,
        url: `/uploads/gallery/${photo.filename}`
      });
    } catch (error) {
      console.error("Upload gallery photo error:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", authenticateToken, async (req: any, res) => {
    try {
      const userNotifications = await db
        .select({
          id: notifications.id,
          type: notifications.type,
          title: notifications.title,
          message: notifications.message,
          isRead: notifications.isRead,
          createdAt: notifications.createdAt,
          relatedUserId: notifications.relatedUserId,
          relatedUser: {
            id: users.id,
            name: users.name,
            profilePicture: users.profilePicture,
          }
        })
        .from(notifications)
        .leftJoin(users, eq(notifications.relatedUserId, users.id))
        .where(eq(notifications.userId, req.user.userId))
        .orderBy(desc(notifications.createdAt));

      res.json(userNotifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", authenticateToken, async (req: any, res) => {
    try {
      const notificationId = req.params.id;
      const userId = req.user.userId;

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        ));

      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/mark-all-read", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));

      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  app.delete("/api/notifications/:id", authenticateToken, async (req: any, res) => {
    try {
      const notificationId = req.params.id;
      const userId = req.user.userId;

      await db
        .delete(notifications)
        .where(and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        ));

      res.json({ message: "Notification deleted" });
    } catch (error) {
      console.error("Delete notification error:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  // Report routes
  app.post("/api/reports", authenticateToken, async (req: any, res) => {
    try {
      const { reportedUserId, reason, description } = req.body;
      const reporterId = req.user.userId;

      if (!reportedUserId || !reason) {
        return res.status(400).json({ message: "Reported user ID and reason are required" });
      }

      // In a real application, you would save this to the database
      console.log("Report submitted:", {
        reporterId,
        reportedUserId,
        reason,
        description: description || "No description provided",
        timestamp: new Date().toISOString()
      });

      // Create a notification for moderation team or admin
      await createNotification(
        "user_reported",
        "User Reported",
        `A user has been reported by ${req.user.name}. Reason: ${reason}`,
        reportedUserId // Optionally link to the reported user
      );

      res.status(201).json({ message: "Report submitted successfully. It will be reviewed by the moderation team." });
    } catch (error) {
      console.error('Report submission error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to submit report' });
    }
  });

  // Feedback routes
  app.get("/api/feedback", authenticateToken, async (req: any, res) => {
    try {
      // Mock feedback data for now. In a real app, fetch from DB.
      const mockFeedback = await db
        .select({
          id: posts.id, // Using posts.id as a placeholder for feedback ID
          userId: users.id,
          userName: users.name,
          profilePicture: users.profilePicture,
          rating: posts.createdAt, // Using posts.createdAt as a placeholder for rating
          message: posts.content, // Using posts.content as a placeholder for message
          createdAt: posts.createdAt,
          likes: posts.id.length // Placeholder for likes, will need a separate table or logic
        })
        .from(posts) // Using posts table as a placeholder, ideally a dedicated feedback table
        .leftJoin(users, eq(posts.userId, users.id)) // Joining with users table
        .orderBy(desc(posts.createdAt))
        .limit(10); // Limiting to 10 for mock data

      // Map mock data to the expected format if necessary or return as is if structure matches
      const formattedFeedback = mockFeedback.map(item => ({
        id: item.id,
        userId: item.userId,
        userName: item.userName,
        profilePicture: item.profilePicture,
        rating: Number(item.rating) || Math.floor(Math.random() * 5) + 1, // Placeholder rating
        message: item.message || "This is a sample feedback message.", // Placeholder message
        createdAt: item.createdAt.toISOString(),
        likes: item.likes || Math.floor(Math.random() * 20) // Placeholder likes
      }));

      res.json(formattedFeedback);
    } catch (error) {
      console.error('Feedback fetch error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch feedback' });
    }
  });


  app.post("/api/feedback", authenticateToken, async (req: any, res) => {
    try {
      const { rating, message } = req.body;
      const userId = req.user.userId;

      if (rating === undefined || !message) {
        return res.status(400).json({ message: "Rating and message are required" });
      }

      // In a real application, you would save this to the database in a 'feedback' table
      console.log("Feedback submitted:", {
        userId,
        rating,
        message,
        timestamp: new Date().toISOString()
      });

      // Optionally, create a notification for admin/moderation
      await createNotification(
        "new_feedback",
        "New Feedback Received",
        `${req.user.name} submitted feedback with rating ${rating}.`,
        userId // Link to the user who submitted feedback
      );

      res.status(201).json({ message: "Feedback submitted successfully. Thank you!" });
    } catch (error) {
      console.error('Feedback submission error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to submit feedback' });
    }
  });

  app.post("/api/feedback/:id/like", authenticateToken, async (req: any, res) => {
    try {
      const feedbackId = req.params.id;
      const userId = req.user.userId;

      // In a real application, you would update a 'likes' count in the feedback table
      // or in a separate 'feedback_likes' table.
      console.log("Feedback liked:", { feedbackId, userId, timestamp: new Date().toISOString() });

      res.json({ message: "Feedback liked successfully" });
    } catch (error) {
      console.error('Like feedback error:', error);
      res.status(500).json({ message: 'Failed to like feedback' });
    }
  });


  // Helper function to create notifications
  async function createNotification(
    type: string,
    title: string,
    message: string,
    relatedUserId?: string
  ) {
    try {
      // Get all users except the one who triggered the notification
      const allUsers = await db
        .select({ id: users.id })
        .from(users)
        .where(relatedUserId ? ne(users.id, relatedUserId) : undefined);

      const notificationPromises = allUsers.map(user =>
        db.insert(notifications).values({
          id: randomUUID(),
          userId: user.id,
          type,
          title,
          message,
          relatedUserId,
          isRead: false,
        })
      );

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error("Create notification error:", error);
    }
  }

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  return httpServer;
}