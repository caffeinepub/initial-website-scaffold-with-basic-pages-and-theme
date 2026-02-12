import { useState } from 'react';
import type { PhotographyWork } from '../backend';

interface WorkThumbnailHoverInfoProps {
  work: PhotographyWork;
  categoryName: string;
}

export default function WorkThumbnailHoverInfo({
  work,
  categoryName,
}: WorkThumbnailHoverInfoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showOverlay = isHovered || isFocused;

  return (
    <div
      className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${work.title}`}
    >
      {/* Thumbnail Image */}
      <img
        src={work.imageUrl}
        alt={work.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Hover/Focus Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          showOverlay ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-2">
          <h4 className="font-semibold text-lg leading-tight">{work.title}</h4>
          <p className="text-sm text-white/90">{categoryName}</p>
          {work.description && (
            <p className="text-sm text-white/80 line-clamp-3 leading-snug">
              {work.description}
            </p>
          )}
        </div>
      </div>

      {/* Focus Ring */}
      <div
        className={`absolute inset-0 ring-2 ring-primary ring-offset-2 rounded-lg pointer-events-none transition-opacity ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
