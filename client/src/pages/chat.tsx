import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthHeaders } from "@/lib/auth";
import { useSocket } from "@/hooks/use-socket";
import { Send, ArrowLeft, MoreVertical, Phone, Video, Smile, Paperclip, Check, CheckCheck } from "lucide-react";
import { useLocation } from "wouter";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  senderName: string;
  delivered?: boolean;
  read?: boolean;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    profilePicture?: string;
  }>;
}

export default function Chat() {
  const params = useParams();
  const conversationId = params.id;
  const [message, setMessage] = useState("");
  const [, setLocation] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
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
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: !!conversationId,
    refetchInterval: 2000, // Poll every 2 seconds for new messages
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setMessage("");
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket listeners for real-time messages
  useEffect(() => {
    if (socket && conversationId) {
      socket.emit("join-conversation", conversationId);

      socket.on("new-message", (newMessage: Message) => {
        queryClient.setQueryData(["messages", conversationId], (oldMessages: Message[] = []) => [
          ...oldMessages,
          newMessage,
        ]);
      });

      return () => {
        socket.off("new-message");
        socket.emit("leave-conversation", conversationId);
      };
    }
  }, [socket, conversationId, queryClient]);

  if (!conversation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  const otherParticipant = conversation.participants.find(
    (p: any) => p.id !== "current-user-id" // Replace with actual current user ID
  ) || conversation.participants[0];

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Card className="bg-dark-card border-dark-border h-[700px] flex flex-col shadow-2xl">
        {/* Chat Header */}
        <CardHeader className="border-b border-dark-border bg-gradient-to-r from-dark-card to-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/inbox")}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full"
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center overflow-hidden ring-2 ring-primary-blue/20">
                  {otherParticipant.profilePicture ? (
                    <img
                      src={otherParticipant.profilePicture}
                      alt={otherParticipant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {getUserInitials(otherParticipant.name)}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-card"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{otherParticipant.name}</h3>
                <p className="text-sm text-green-400 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Active now
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full">
                <Phone size={18} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full">
                <Video size={18} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full">
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-dark-bg to-gray-900/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center mb-4 opacity-50">
                <span className="text-white font-bold text-xl">
                  {getUserInitials(otherParticipant.name)}
                </span>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">Start your conversation</h3>
              <p className="text-gray-400 text-sm">Send a message to {otherParticipant.name}</p>
            </div>
          ) : (
            messages.map((msg: Message, index: number) => {
              const isCurrentUser = msg.senderId === "current-user-id";
              const showAvatar = !isCurrentUser && (index === 0 || messages[index - 1]?.senderId !== msg.senderId);

              return (
                <div
                  key={msg.id}
                  className={`flex items-end space-x-2 ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  {showAvatar && !isCurrentUser && (
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {getUserInitials(otherParticipant.name)}
                      </span>
                    </div>
                  )}

                  <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-md ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-primary-blue to-blue-600 text-white rounded-br-md"
                          : "bg-dark-card text-white border border-dark-border rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>

                    <div className={`flex items-center space-x-1 mt-1 px-2 ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <span className="text-xs text-gray-400">
                        {formatMessageTime(msg.timestamp)}
                      </span>
                      {isCurrentUser && (
                        <div className="flex items-center space-x-1">
                          {msg.read ? (
                            <CheckCheck size={12} className="text-primary-blue" />
                          ) : msg.delivered ? (
                            <CheckCheck size={12} className="text-gray-400" />
                          ) : (
                            <Check size={12} className="text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!showAvatar && !isCurrentUser && <div className="w-8"></div>}
                  {isCurrentUser && <div className="w-8"></div>}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Message Input */}
        <div className="border-t border-dark-border p-4 bg-dark-card">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full"
            >
              <Paperclip size={18} />
            </Button>

            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-dark-bg text-white border-dark-border rounded-full pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white rounded-full"
              >
                <Smile size={18} />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="bg-gradient-to-r from-primary-blue to-blue-600 hover:from-primary-blue/80 hover:to-blue-600/80 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}