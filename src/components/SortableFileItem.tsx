
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, GripVertical, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface SortableFileItemProps {
  file: UploadedFile;
  index: number;
  onRemove: () => void;
  formatFileSize: (bytes: number) => string;
}

export const SortableFileItem: React.FC<SortableFileItemProps> = ({
  file,
  index,
  onRemove,
  formatFileSize
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-4 bg-slate-50 rounded-lg border transition-all ${
        isDragging 
          ? 'border-blue-500 shadow-lg bg-white' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div
        className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-slate-600 mr-3"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mr-4">
        <FileText className="w-5 h-5 text-red-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-slate-700 bg-slate-200 px-2 py-1 rounded">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-slate-800 truncate">
            {file.name}
          </p>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {formatFileSize(file.size)}
        </p>
      </div>
      
      <button
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
