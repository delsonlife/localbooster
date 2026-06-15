"use client";

import { useState } from "react";

interface StarRatingProps {
  onSelect: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRating({ onSelect, disabled }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const handleSelect = (value: number) => {
    if (disabled) return;
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {[1, 2, 3, 4, 5].map((value) => {
        const isActive = (hovered || selected) >= value;

        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
            onClick={() => handleSelect(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            className="rounded-full p-1 transition-transform duration-150 ease-out hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`h-9 w-9 transition-colors duration-150 sm:h-10 sm:w-10 ${
                isActive ? "text-amber-400" : "text-gray-200"
              }`}
            >
              <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.6l-5.9 3.08 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
