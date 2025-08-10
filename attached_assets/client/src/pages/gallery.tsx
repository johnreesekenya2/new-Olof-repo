
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getAuthHeaders } from "@/lib/auth";
import { Image, Upload, Grid3X3, List, Heart, MessageCircle, Eye, X } from "lucide-react";

interface Photo {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  caption?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profilePicture?: string;
    yearOfCompletion: number;
    streamClan: string;
  };
}

export default function Gallery() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const response = await fetch("/api/gallery", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch photos");
      return response.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; caption: string }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      if (data.caption) formData.append("caption", data.caption);

      const response = await fetch("/api/gallery", {
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
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      setIsUploadOpen(false);
      setSelectedFile(null);
      setCaption("");
      toast({
        title: "Photo uploaded!",
        description: "Your photo has been shared in the gallery.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      caption: caption,
    });
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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-600 rounded w-48 mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-600 rounded-lg"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Card className="bg-dark-card border-dark-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Image className="w-6 h-6 mr-3" />
              Gallery
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <List className="w-4 h-4" />
              </Button>
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-primary-blue hover:bg-primary-blue/80 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-dark-border text-white">
                  <DialogHeader>
                    <DialogTitle>Upload Photo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary-blue transition-colors"
                      >
                        {selectedFile ? (
                          <div className="text-center">
                            <Image className="w-8 h-8 mx-auto mb-2 text-primary-blue" />
                            <p className="text-sm text-gray-300">{selectedFile.name}</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-400">Click to select a photo</p>
                          </div>
                        )}
                      </label>
                    </div>
                    <Input
                      type="text"
                      placeholder="Add a caption (optional)"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="bg-dark-bg text-white border-dark-border"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsUploadOpen(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={uploadMutation.isPending || !selectedFile}
                        className="bg-primary-blue hover:bg-primary-blue/80 text-white"
                      >
                        {uploadMutation.isPending ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No photos yet</h3>
              <p className="text-gray-400 mb-6">
                Share memorable moments from your OLOF journey and connect with fellow alumni through photos.
              </p>
              <Button 
                onClick={() => setIsUploadOpen(true)}
                className="bg-primary-blue hover:bg-primary-blue/80 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Photo
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-400">
                  {photos.length} photo{photos.length !== 1 ? 's' : ''} in gallery
                </p>
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo: Photo, index: number) => (
                    <div
                      key={photo.id}
                      className="aspect-square bg-dark-bg rounded-lg border border-dark-border hover:border-primary-blue/50 transition-colors cursor-pointer overflow-hidden group"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || photo.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {photos.map((photo: Photo, index: number) => (
                    <Card key={photo.id} className="bg-dark-bg border-dark-border">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getGradientClass(index)} rounded-full flex items-center justify-center overflow-hidden`}>
                            {photo.user.profilePicture ? (
                              <img
                                src={photo.user.profilePicture}
                                alt={photo.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold text-sm">
                                {getUserInitials(photo.user.name)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{photo.user.name}</h4>
                            <p className="text-gray-400 text-sm">
                              {photo.user.yearOfCompletion} {photo.user.streamClan}
                            </p>
                          </div>
                          <p className="text-gray-500 text-sm">
                            {new Date(photo.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div 
                          className="w-full h-64 rounded-lg overflow-hidden mb-4 cursor-pointer"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption || photo.originalName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        {photo.caption && (
                          <p className="text-gray-300 mb-4">{photo.caption}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Photo Modal */}
          {selectedPhoto && (
            <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
              <DialogContent className="bg-dark-card border-dark-border text-white max-w-4xl">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                        {selectedPhoto.user.profilePicture ? (
                          <img
                            src={selectedPhoto.user.profilePicture}
                            alt={selectedPhoto.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-semibold text-sm">
                            {getUserInitials(selectedPhoto.user.name)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{selectedPhoto.user.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {selectedPhoto.user.yearOfCompletion} {selectedPhoto.user.streamClan}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPhoto(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="w-full max-h-96 rounded-lg overflow-hidden">
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.caption || selectedPhoto.originalName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {selectedPhoto.caption && (
                    <p className="text-gray-300">{selectedPhoto.caption}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    Uploaded on {new Date(selectedPhoto.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
