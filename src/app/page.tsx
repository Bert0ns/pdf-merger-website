'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { FileList } from '@/components/FileList';
import { MergeButton } from '@/components/MergeButton';
import { Header } from '@/components/Header';
import { toast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

const IndexPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleFilesUpload = (newFiles: File[]) => {
    const totalFiles = files.length + newFiles.length;
    if (totalFiles > 50) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 50 PDF files.",
        variant: "destructive"
      });
      return;
    }
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} PDF file(s) added successfully.`
    });
  };
  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File removed",
      description: "File has been removed from the list."
    });
  };
  const handleFileReorder = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
  };
  const handleClearAll = () => {
    setFiles([]);
    toast({
      title: "All files cleared",
      description: "All files have been removed from the list."
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        
        <div className="space-y-8">
          <FileUpload onFilesUploadAction={handleFilesUpload} maxFiles={50} currentCount={files.length} />

          {files.length > 0 && <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">
                  Uploaded Files ({files.length}/50)
                </h2>
                <button onClick={handleClearAll} className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                  Clear All
                </button>
              </div>
              
              <FileList files={files} onFileRemoveAction={handleFileRemove} onFileReorderAction={handleFileReorder} />
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <MergeButton files={files} isProcessing={isProcessing} setIsProcessingAction={setIsProcessing} />
              </div>
            </div>}

          {files.length === 0 && <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500 text-lg">Upload PDF files to get started</p>
            </div>}
        </div>
      </div>
    </div>;
};

export default IndexPage;