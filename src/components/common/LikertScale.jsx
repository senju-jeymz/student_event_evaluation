import React from 'react';

const SCALE_OPTIONS = [
  { value: 1, label: '1 - Strongly Disagree', short: '1' },
  { value: 2, label: '2 - Disagree', short: '2' },
  { value: 3, label: '3 - Neutral', short: '3' },
  { value: 4, label: '4 - Agree', short: '4' },
  { value: 5, label: '5 - Strongly Agree', short: '5' }
];

export default function LikertScale({ statement, value, onChange, description, required = true }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 transition-all shadow-xs">
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800 leading-snug">
            {statement}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </p>
        </div>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {SCALE_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white font-semibold shadow-sm ring-2 ring-indigo-200'
                  : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name={statement}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className="text-base sm:text-lg font-bold">{opt.short}</span>
              <span className={`text-[10px] sm:text-xs mt-0.5 line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {opt.value === 1 ? 'Strongly Disagree' : opt.value === 5 ? 'Strongly Agree' : opt.value === 3 ? 'Neutral' : opt.value === 2 ? 'Disagree' : 'Agree'}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
