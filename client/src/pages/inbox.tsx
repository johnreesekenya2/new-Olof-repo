import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { Plus, Search, MessageSquare, User, Clock, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  yearOfCompletion: number;
  streamClan: string;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount?: number;
}

export default function Inbox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await fetch("/api/conversations", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          return [];
        }
        throw new Error("Failed to fetch conversations");
      }
      return response.json();
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          return [];
        }
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleStartChat = async (user: User) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participantId: user.id }),
      });

      if (!response.ok) throw new Error("Failed to create conversation");

      const conversation = await response.json();
      setIsNewChatOpen(false);

      // Navigate to chat page with conversation ID
      setLocation(`/chat/${conversation.id}`);

      toast({
        title: "Chat Started",
        description: `Started a conversation with ${user.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "from-blue-500 to-purple-500",
      "from-green-500 to-teal-500",
      "from-pink-500 to-red-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-blue-500",
      "from-purple-500 to-pink-500",
    ];
    return gradients[index % gradients.length];
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      return date.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <Card className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent flex items-center">
                <MessageSquare className="w-8 h-8 mr-4 text-blue-400" />
                Messages
              </h2>
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                  <Plus className="w-5 h-5 mr-2" />
                  New Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/90 backdrop-blur-lg border-2 border-blue-500/20 text-white rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Start New Chat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="bg-dark-bg text-white border-dark-border pl-10"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredUsers.map((user: User, index: number) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-3 bg-dark-bg rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => handleStartChat(user)}
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${getGradientClass(index)} rounded-full flex items-center justify-center overflow-hidden`}>
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold text-sm">
                              {getUserInitials(user.name)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{user.name}</h4>
                          <p className="text-gray-400 text-sm">
                            {user.yearOfCompletion} {user.streamClan}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-bg text-white border-dark-border pl-10"
            />
          </div>

          {/* Conversations List */}
          {filteredConversations.length > 0 ? (
            <div className="space-y-3">
              {filteredConversations.map((conversation: Conversation, index: number) => {
                const otherParticipant = conversation.participants.find(p => p.id !== "current-user-id") || conversation.participants[0];
                return (
                  <div
                    key={conversation.id}
                    className="flex items-center space-x-4 p-4 bg-dark-bg rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors border border-dark-border"
                    onClick={() => setLocation(`/chat/${conversation.id}`)}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-full flex items-center justify-center overflow-hidden`}>
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

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium truncate">{otherParticipant.name}</h4>
                        {conversation.lastMessage && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                            {conversation.unreadCount && conversation.unreadCount > 0 && (
                              <div className="w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                  {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <p className="text-gray-400 text-sm truncate flex-1">
                          {conversation.lastMessage ? conversation.lastMessage.content : "No messages yet"}
                        </p>
                        {conversation.lastMessage && (
                          <CheckCircle2 className="w-4 h-4 text-primary-blue flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No conversations yet</h3>
              <p className="text-gray-400 mb-6">
                Start a conversation with fellow alumni. Click the "New Chat" button to begin.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}