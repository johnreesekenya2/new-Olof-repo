export interface ChatMessage {
  type: 'chat_message';
  conversationId: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  recipientId: string;
}

export interface WebSocketMessage {
  type: 'new_message' | 'message_sent' | 'user_online' | 'user_offline';
  message?: any;
  userId?: string;
  data?: any;
}
