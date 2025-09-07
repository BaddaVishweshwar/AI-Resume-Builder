import { useState, useEffect, useRef } from 'react';
import { FiEdit2 } from 'react-icons/fi';

interface ResumeHeaderProps {
  title: string;
  onUpdateTitle: (title: string) => void;
}

export default function ResumeHeader({ title, onUpdateTitle }: ResumeHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when title prop changes
  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  const saveTitle = () => {
    const trimmedTitle = editedTitle.trim();
    if (trimmedTitle && trimmedTitle !== title) {
      onUpdateTitle(trimmedTitle);
    } else if (!trimmedTitle) {
      setEditedTitle(title);
    }
    setIsEditing(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            onBlur={saveTitle}
            className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-700 w-full"
          />
        ) : (
          <div className="group flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Edit title"
            >
              <FiEdit2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
