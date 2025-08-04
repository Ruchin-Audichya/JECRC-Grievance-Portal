import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export function useFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file: File): Promise<FileUpload | null> => {
    setIsUploading(true);

    try {
      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 10MB.',
          variant: 'destructive',
        });
        return null;
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/quicktime',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Unsupported file type',
          description: 'Please upload images, videos, PDFs, or documents only.',
          variant: 'destructive',
        });
        return null;
      }

      // Simulate file upload (in real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Create a mock URL (in real app, this would come from the server)
      const mockUrl = URL.createObjectURL(file);

      const uploadedFile: FileUpload = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: mockUrl,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);

      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been uploaded.`,
      });

      return uploadedFile;
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const uploadMultipleFiles = useCallback(async (files: FileList): Promise<FileUpload[]> => {
    const results = await Promise.all(
      Array.from(files).map(file => uploadFile(file))
    );
    return results.filter(Boolean) as FileUpload[];
  }, [uploadFile]);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const clearFiles = useCallback(() => {
    uploadedFiles.forEach(file => {
      if (file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    });
    setUploadedFiles([]);
  }, [uploadedFiles]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type === 'application/pdf') return '📄';
    if (type.startsWith('text/')) return '📝';
    return '📎';
  };

  return {
    uploadedFiles,
    isUploading,
    uploadFile,
    uploadMultipleFiles,
    removeFile,
    clearFiles,
    formatFileSize,
    getFileIcon,
  };
}