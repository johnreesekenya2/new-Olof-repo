import { 
  users, posts, comments, conversations, messages,
  type User, type InsertUser, type Post, type InsertPost, 
  type Comment, type InsertComment, type Conversation, type Message, type InsertMessage 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, and, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  setVerificationCode(email: string, code: string): Promise<void>;
  verifyUser(email: string, code: string): Promise<boolean>;
  
  // Post operations
  createPost(post: InsertPost & { userId: string }): Promise<Post>;
  getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[]; })[]>;
  updatePostReactions(postId: string, reactions: Record<string, number>): Promise<void>;
  
  // Comment operations
  createComment(comment: InsertComment & { userId: string }): Promise<Comment>;
  
  // Message operations
  getConversations(userId: string): Promise<(Conversation & { 
    participant1: User; 
    participant2: User; 
    lastMessage?: Message; 
  })[]>;
  getConversation(participant1Id: string, participant2Id: string): Promise<Conversation | undefined>;
  createConversation(participant1Id: string, participant2Id: string): Promise<Conversation>;
  getMessages(conversationId: string): Promise<(Message & { sender: User })[]>;
  createMessage(message: InsertMessage & { senderId: string }): Promise<Message>;
  updateConversationLastMessage(conversationId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isVerified, true)).orderBy(asc(users.name));
  }

  async setVerificationCode(email: string, code: string): Promise<void> {
    await db
      .update(users)
      .set({ verificationCode: code })
      .where(eq(users.email, email));
  }

  async verifyUser(email: string, code: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.verificationCode, code)));

    if (user) {
      await db
        .update(users)
        .set({ isVerified: true, verificationCode: null })
        .where(eq(users.email, email));
      return true;
    }
    return false;
  }

  async createPost(post: InsertPost & { userId: string }): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values(post)
      .returning();
    return newPost;
  }

  async getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[]; })[]> {
    const allPosts = await db
      .select()
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt));

    const result = [];
    for (const postData of allPosts) {
      const postComments = await db
        .select()
        .from(comments)
        .innerJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.postId, postData.posts.id))
        .orderBy(asc(comments.createdAt));

      result.push({
        ...postData.posts,
        user: postData.users,
        comments: postComments.map(c => ({ ...c.comments, user: c.users }))
      });
    }

    return result;
  }

  async updatePostReactions(postId: string, reactions: Record<string, number>): Promise<void> {
    await db
      .update(posts)
      .set({ reactions })
      .where(eq(posts.id, postId));
  }

  async createComment(comment: InsertComment & { userId: string }): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }

  async getConversations(userId: string): Promise<(Conversation & { 
    participant1: User; 
    participant2: User; 
    lastMessage?: Message; 
  })[]> {
    const userConversations = await db
      .select()
      .from(conversations)
      .innerJoin(users, or(
        eq(conversations.participant1Id, users.id),
        eq(conversations.participant2Id, users.id)
      ))
      .where(or(
        eq(conversations.participant1Id, userId),
        eq(conversations.participant2Id, userId)
      ))
      .orderBy(desc(conversations.lastMessageAt));

    const result = [];
    for (const conv of userConversations) {
      const [participant1] = await db.select().from(users).where(eq(users.id, conv.conversations.participant1Id));
      const [participant2] = await db.select().from(users).where(eq(users.id, conv.conversations.participant2Id));
      
      const [lastMessage] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conv.conversations.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      result.push({
        ...conv.conversations,
        participant1,
        participant2,
        lastMessage
      });
    }

    return result;
  }

  async getConversation(participant1Id: string, participant2Id: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        or(
          and(eq(conversations.participant1Id, participant1Id), eq(conversations.participant2Id, participant2Id)),
          and(eq(conversations.participant1Id, participant2Id), eq(conversations.participant2Id, participant1Id))
        )
      );
    return conversation || undefined;
  }

  async createConversation(participant1Id: string, participant2Id: string): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({ participant1Id, participant2Id })
      .returning();
    return conversation;
  }

  async getMessages(conversationId: string): Promise<(Message & { sender: User })[]> {
    const messagesWithSender = await db
      .select()
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    return messagesWithSender.map(m => ({ ...m.messages, sender: m.users }));
  }

  async createMessage(message: InsertMessage & { senderId: string }): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    
    // Update conversation's last message timestamp
    await this.updateConversationLastMessage(message.conversationId);
    
    return newMessage;
  }

  async updateConversationLastMessage(conversationId: string): Promise<void> {
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));
  }
}

export const storage = new DatabaseStorage();
