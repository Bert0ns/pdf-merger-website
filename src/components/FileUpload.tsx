
import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFilesUpload: (files: File[]) => void;
  maxFiles: number;
  currentCount: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesUpload, 
  maxFiles, 
  currentCount 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF file.`,
          variant: "destructive"
        });
        continue;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 50MB.`,
          variant: "destructive"
        });
        continue;
      }
      
      validFiles.push(file);
    }
    
    return validFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onFilesUpload(validFiles);
    }
  }, [onFilesUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onFilesUpload(validFiles);
    }
    
    // Reset input
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const remainingSlots = maxFiles - currentCount;
  const isAtLimit = remainingSlots <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : isAtLimit 
              ? 'border-slate-200 bg-slate-50' 
              : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isAtLimit}
        />
        
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            isAtLimit ? 'bg-slate-200' : 'bg-blue-100'
          }`}>
            {isAtLimit ? (
              <AlertCircle className="w-8 h-8 text-slate-400" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isAtLimit ? 'text-slate-400' : 'text-slate-700'
            }`}>
              {isAtLimit ? 'Maximum files reached' : 'Upload PDF Files'}
            </h3>
            
            {!isAtLimit && (
              <>
                <p className="text-slate-500 mb-4">
                  Drag and drop your PDF files here, or click to browse
                </p>
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Choose Files
                </label>
              </>
            )}
          </div>
          
          <div className="text-sm text-slate-500 space-y-1">
            <p>• Maximum 50 files ({remainingSlots} remaining)</p>
            <p>• PDF files only</p>
            <p>• Maximum file size: 50MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};
