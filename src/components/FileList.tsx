
import React from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { SortableFileItem } from './SortableFileItem';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface FileListProps {
  files: UploadedFile[];
  onFileRemove: (fileId: string) => void;
  onFileReorder: (files: UploadedFile[]) => void;
}

export const FileList: React.FC<FileListProps> = ({ 
  files, 
  onFileRemove, 
  onFileReorder 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex(file => file.id === active.id);
      const newIndex = files.findIndex(file => file.id === over?.id);
      
      const newFiles = arrayMove(files, oldIndex, newIndex);
      onFileReorder(newFiles);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-500 mb-4">
        Drag and drop files to reorder them. The merged PDF will follow this order.
      </p>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
          {files.map((file, index) => (
            <SortableFileItem
              key={file.id}
              file={file}
              index={index}
              onRemove={() => onFileRemove(file.id)}
              formatFileSize={formatFileSize}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
