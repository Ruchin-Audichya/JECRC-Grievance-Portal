import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Upload, File, Image, Video, FileText } from 'lucide-react';
import { useFileUpload, FileUpload } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFilesUploaded?: (files: FileUpload[]) => void;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export default function FileUploadZone({ 
  onFilesUploaded, 
  maxFiles = 5, 
  className,
  disabled = false 
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    uploadedFiles, 
    isUploading, 
    uploadMultipleFiles, 
    removeFile, 
    formatFileSize, 
    getFileIcon 
  } = useFileUpload();

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const remainingSlots = maxFiles - uploadedFiles.length;
      const filesToUpload = Math.min(files.length, remainingSlots);
      
      if (filesToUpload < files.length) {
        // Show warning about file limit
      }

      const fileList = new DataTransfer();
      for (let i = 0; i < filesToUpload; i++) {
        fileList.items.add(files[i]);
      }

      const uploadedFileResults = await uploadMultipleFiles(fileList.files);
      onFilesUploaded?.(uploadedFileResults);
    }
  }, [disabled, isUploading, maxFiles, uploadedFiles.length, uploadMultipleFiles, onFilesUploaded]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const uploadedFileResults = await uploadMultipleFiles(files);
      onFilesUploaded?.(uploadedFileResults);
    }
    // Reset input
    e.target.value = '';
  }, [uploadMultipleFiles, onFilesUploaded]);

  const openFileDialog = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (type === 'application/pdf') return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-border",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50",
          isUploading && "pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !isUploading) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              isDragOver ? "bg-primary/20" : "bg-muted"
            )}>
              <Upload className={cn(
                "h-8 w-8",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {isUploading ? 'Uploading files...' : 'Upload files'}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports images, videos, PDFs, and documents (Max 10MB each)
              </p>
              <p className="text-xs text-muted-foreground">
                {uploadedFiles.length}/{maxFiles} files uploaded
              </p>
            </div>

            {isUploading && (
              <div className="w-full max-w-xs">
                <Progress value={66} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Uploading...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileInput}
        disabled={disabled || isUploading}
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-foreground">Uploaded Files ({uploadedFiles.length})</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="text-muted-foreground">
                      {getFileTypeIcon(file.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}