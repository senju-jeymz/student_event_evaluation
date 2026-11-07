import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, max = 5, size = 6, label = '', disabled = false }) {
  const [hoverValue, setHoverValue] = useState(0);

  const starLabels = {
    1: 'Poor / Unsatisfactory',
    2: 'Fair / Needs Improvement',
    3: 'Satisfactory / Average',
    4: 'Very Good / Exceeded Expectations',
    5: 'Outstanding / Exceptional'
  };

  const activeValue = hoverValue || value;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <div className="flex items-center gap-1.5">
        {[...Array(max)].map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= activeValue;

          return (
            <button
              type="button"
              key={index}
              disabled={disabled}
              onClick={() => onChange && onChange(starNumber)}
              onMouseEnter={() => !disabled && setHoverValue(starNumber)}
              onMouseLeave={() => !disabled && setHoverValue(0)}
              className={`p-1 rounded-lg transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                disabled ? 'cursor-default' : 'hover:scale-110 active:scale-95 cursor-pointer'
              }`}
              title={`${starNumber} Star${starNumber > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-${size} h-${size} transition-colors ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                    : 'text-slate-300 stroke-[1.5]'
                }`}
              />
            </button>
          );
        })}
        {activeValue > 0 && (
          <span className="text-xs font-medium text-slate-500 ml-2 animate-fade-in">
            {starLabels[activeValue] || `${activeValue} / ${max}`}
          </span>
        )}
      </div>
    </div>
  );
}
