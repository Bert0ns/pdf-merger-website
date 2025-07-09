
import React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, Loader2, Merge } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface MergeButtonProps {
  files: UploadedFile[];
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const MergeButton: React.FC<MergeButtonProps> = ({
  files,
  isProcessing,
  setIsProcessing
}) => {
  const mergePDFs = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Process each file
      for (const fileInfo of files) {
        const arrayBuffer = await fileInfo.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Copy pages from current PDF to merged PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      // Serialize the merged PDF
      const pdfBytes = await mergedPdf.save();
      
      // Create download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged-pdf-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF merged successfully!",
        description: "Your merged PDF has been downloaded."
      });
      
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast({
        title: "Error merging PDFs",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="text-center space-y-4">
      <div className="text-sm text-slate-600">
        <p>Total size: {formatFileSize(getTotalSize())}</p>
        <p>{files.length} file{files.length !== 1 ? 's' : ''} ready to merge</p>
      </div>
      
      <button
        onClick={mergePDFs}
        disabled={files.length === 0 || isProcessing}
        className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold text-white transition-all ${
          files.length === 0 || isProcessing
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Merge & Download PDF
          </>
        )}
      </button>
    </div>
  );
};
