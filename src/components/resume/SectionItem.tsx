import { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';

type DragItem = {
  id: string;
  index: number;
};
import { FiMenu, FiX, FiEye, FiEyeOff, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Section } from '@/types/resume';

interface SectionItemProps {
  section: Section;
  index: number;
  isActive: boolean;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onClick: () => void;
}

export default function SectionItem({
  section,
  index,
  isActive,
  onUpdate,
  onMove,
  onClick,
}: SectionItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: 'SECTION',
    item: () => ({ id: section.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem, void, unknown>({
    accept: 'SECTION',
    hover: (item: DragItem, monitor: DropTargetMonitor<DragItem, void>) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(section.id, { isVisible: !section.isVisible });
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      onMove(index, index - 1);
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMove(index, index + 1);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this section?')) {
      onUpdate(section.id, { isDeleted: true });
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-lg shadow overflow-hidden border',
        isActive ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200',
        isDragging && 'opacity-50',
      )}
      style={{ opacity }}
      onClick={onClick}
    >
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <FiMenu className="w-4 h-4 text-gray-400" />
          </button>
          <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={handleToggleVisibility}
            title={section.isVisible ? 'Hide section' : 'Show section'}
          >
            {section.isVisible ? (
              <FiEye className="h-4 w-4" />
            ) : (
              <FiEyeOff className="h-4 w-4" />
            )}
          </button>
          <div className="flex flex-col">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={handleMoveUp}
              disabled={index === 0}
              title="Move up"
            >
              <FiChevronUp
                className={cn('h-4 w-4', index === 0 && 'opacity-30')}
              />
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none -mt-1"
              onClick={handleMoveDown}
              title="Move down"
            >
              <FiChevronDown className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-red-500 focus:outline-none"
            onClick={handleRemove}
            title="Remove section"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {section.type === 'profile' && (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        )}
        {section.type === 'experience' && (
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="h-10 w-10 bg-gray-200 rounded mr-3 mt-1"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}
        {section.type === 'education' && (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        )}
        {section.type === 'skills' && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {['Skill 1', 'Skill 2', 'Skill 3'].map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {!['profile', 'experience', 'education', 'skills'].includes(section.type) && (
          <div className="text-sm text-gray-500 italic">
            {section.type} section preview
          </div>
        )}
      </div>
    </div>
  );
}
