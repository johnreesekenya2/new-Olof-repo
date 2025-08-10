import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import { Image, Video, FileText, Send, Heart, MessageCircle, Share } from "lucide-react";
import Post from "@/components/post";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; file?: File }) => {
      const formData = new FormData();
      if (data.content) formData.append("content", data.content);
      if (data.file) formData.append("file", data.file);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setPostContent("");
      setSelectedFile(null);
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create post",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmitPost = () => {
    if (!postContent.trim() && !selectedFile) {
      toast({
        title: "Empty post",
        description: "Please add some content or a file to your post.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content: postContent,
      file: selectedFile || undefined,
    });
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-dark-card rounded-xl p-6 border border-dark-border">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 rounded-3xl p-6 mb-6 shadow-2xl shadow-blue-500/10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">Home</h2>
          
          {/* Post Creation */}
          <div className="bg-gray-900/50 rounded-2xl p-6 mb-6 border border-blue-500/20">
            <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="flex-1 bg-gray-800/50 text-white border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl resize-none transition-all duration-300"
              rows={3}
            />
          </div>
          
          {selectedFile && (
            <div className="mb-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm">
                Selected file: {selectedFile.name}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white"
              >
                Remove
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
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
                  className="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <Image size={20} />
                  <span className="text-sm">Photo</span>
                </label>
              </div>
              
              <div>
                <input
                  type="file"
                  accept="video/*"
                  id="video-upload"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <Video size={20} />
                  <span className="text-sm">Video</span>
                </label>
              </div>
              
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <FileText size={20} />
                  <span className="text-sm">File</span>
                </label>
              </div>
            </div>
            
            <Button
              onClick={handleSubmitPost}
              disabled={createPostMutation.isPending}
              className="bg-primary-blue hover:bg-primary-blue/80 text-white"
            >
              {createPostMutation.isPending ? (
                "Posting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
            </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post: any) => <Post key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
