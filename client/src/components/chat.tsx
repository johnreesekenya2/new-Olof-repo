import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { getAuthHeaders } from "@/lib/auth";
import { Send, Paperclip, Image, Smile } from "lucide-react";

interface Message {
  id: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profilePicture?: string;
  };
}

interface Conversation {
  id: string;
  participant1: { id: string; name: string; profilePicture?: string; yearOfCompletion: number; streamClan: string; };
  participant2: { id: string; name: string; profilePicture?: string; yearOfCompletion: number; streamClan: string; };
}

interface ChatProps {
  conversationId: string;
}

export default function Chat({ conversationId }: ChatProps) {
  const { user } = useAuth();
  const { sendMessage, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: conversation } = useQuery({
    queryKey: ["/api/conversations", conversationId],
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch conversation");
      return response.json();
    },
    enabled: !!conversationId,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/conversations", conversationId, "messages"],
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content?: string; file?: File }) => {
      if (data.file) {
        const formData = new FormData();
        formData.append('file', data.file);
        if (data.content) formData.append('content', data.content);

        const response = await fetch(`/api/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
      } else {
        // Send via WebSocket for real-time messaging
        const otherParticipant = conversation?.participant1.id === user?.id 
          ? conversation.participant2 
          : conversation?.participant1;

        if (isConnected && otherParticipant) {
          sendMessage({
            type: 'chat_message',
            conversationId,
            content: data.content,
            recipientId: otherParticipant.id,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
      setNewMessage("");
      setSelectedFile(null);
    },
  });

  // Listen for real-time messages
  useEffect(() => {
    const handleWebSocketMessage = (event: any) => {
      const message = event.detail;
      if (message.type === 'new_message' || message.type === 'message_sent') {
        queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
      }
    };

    window.addEventListener('websocket-message', handleWebSocketMessage);
    return () => window.removeEventListener('websocket-message', handleWebSocketMessage);
  }, [conversationId, queryClient]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedFile) return;
    
    sendMessageMutation.mutate({
      content: newMessage.trim() || undefined,
      file: selectedFile || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const otherParticipant = conversation?.participant1.id === user?.id 
    ? conversation.participant2 
    : conversation?.participant1;

  if (!conversation || !otherParticipant) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Header */}
      <div className="border-b border-dark-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
            {otherParticipant.profilePicture ? (
              <img
                src={otherParticipant.profilePicture}
                alt={otherParticipant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {getUserInitials(otherParticipant.name)}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-white font-semibold">{otherParticipant.name}</h4>
            <p className="text-gray-400 text-sm">
              {otherParticipant.yearOfCompletion} {otherParticipant.streamClan}
            </p>
          </div>
          {isConnected && (
            <div className="ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: Message) => {
              const isOwn = message.sender.id === user?.id;
              
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-xs lg:max-w-md">
                    {!isOwn && (
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                          {message.sender.profilePicture ? (
                            <img
                              src={message.sender.profilePicture}
                              alt={message.sender.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-xs">
                              {getUserInitials(message.sender.name)}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400 text-xs">{message.sender.name}</span>
                      </div>
                    )}
                    
                    <div className={`rounded-lg p-3 ${
                      isOwn 
                        ? 'bg-primary-blue text-white' 
                        : 'bg-gray-700 text-white'
                    }`}>
                      {message.content && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      
                      {message.fileUrl && (
                        <div className="mt-2">
                          {message.fileType?.startsWith('image/') ? (
                            <img
                              src={message.fileUrl}
                              alt="Attachment"
                              className="max-w-full h-auto rounded"
                            />
                          ) : (
                            <div className="bg-black/20 p-2 rounded">
                              <p className="text-xs">📎 File attachment</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <span className={`text-xs mt-2 block ${
                        isOwn ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="px-4 py-2 border-t border-dark-border bg-dark-bg">
          <div className="flex items-center justify-between bg-gray-700 rounded p-2">
            <span className="text-gray-300 text-sm">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-dark-border p-4">
        <div className="flex items-end space-x-3">
          <div className="flex space-x-2">
            <div>
              <input
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                id="file-upload"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </label>
            </div>
            
            <div>
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white cursor-pointer"
              >
                <Image className="w-4 h-4" />
              </label>
            </div>
          </div>
          
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-dark-bg text-white border-dark-border"
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || (!newMessage.trim() && !selectedFile)}
            className="bg-primary-blue hover:bg-primary-blue/80 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
