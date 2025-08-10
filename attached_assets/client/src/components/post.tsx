import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getAuthHeaders } from "@/lib/auth";
import { Heart, MessageCircle, Share, MoreHorizontal, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profilePicture?: string;
  };
}

interface User {
  id: string;
  name: string;
  profilePicture?: string;
  yearOfCompletion: number;
  streamClan: string;
}

interface PostData {
  id: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  reactions: Record<string, number>;
  createdAt: string;
  user: User;
  comments: Comment[];
}

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setNewComment("");
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add comment",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleReaction = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Post reactions will be available soon.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Feature Coming Soon", 
      description: "Post sharing will be available soon.",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate(newComment);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <div className="bg-dark-bg rounded-lg p-6 border border-dark-border">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
            {post.user.profilePicture ? (
              <img
                src={post.user.profilePicture}
                alt={post.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {getUserInitials(post.user.name)}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-white font-semibold">{post.user.name}</h4>
            <p className="text-gray-400 text-sm">
              {post.user.yearOfCompletion} {post.user.streamClan} • {formatTime(post.createdAt)}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      {post.content && (
        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.content}</p>
      )}

      {/* Post Media */}
      {post.fileUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.fileType?.startsWith('image/') ? (
            <img
              src={post.fileUrl}
              alt="Post attachment"
              className="w-full max-h-96 object-cover"
            />
          ) : post.fileType?.startsWith('video/') ? (
            <video
              src={post.fileUrl}
              controls
              className="w-full max-h-96"
            />
          ) : (
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-300">📎 File attachment</p>
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between text-gray-400 border-t border-gray-700 pt-4">
        <div className="flex space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReaction}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <Heart className="w-4 h-4 mr-2" />
            <span className="text-sm">Like</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">Comment</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            <Share className="w-4 h-4 mr-2" />
            <span className="text-sm">Share</span>
          </Button>
        </div>
        <span className="text-sm">
          {Object.values(post.reactions || {}).reduce((a, b) => a + b, 0)} likes • {post.comments.length} comments
        </span>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          {/* Add Comment */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center overflow-hidden">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-xs">
                  {getUserInitials(user?.name || '')}
                </span>
              )}
            </div>
            <div className="flex-1 flex items-end space-x-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white text-sm resize-none"
                rows={2}
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={createCommentMutation.isPending || !newComment.trim()}
                className="bg-primary-blue hover:bg-primary-blue/80 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                    {comment.user.profilePicture ? (
                      <img
                        src={comment.user.profilePicture}
                        alt={comment.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-xs">
                        {getUserInitials(comment.user.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <h5 className="text-white font-semibold text-sm mb-1">
                        {comment.user.name}
                      </h5>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 ml-3">
                      {formatTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
