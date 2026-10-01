import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  children,
  defaultOpen = true,
  badge
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200 mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between bg-white hover:bg-slate-50/80 transition text-left select-none"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-blue-700 bg-blue-50 p-2 rounded-lg">{icon}</span>
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
          {badge !== undefined && (
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <div className="text-slate-400 p-1 hover:text-slate-600 rounded">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && <div className="p-5 border-t border-slate-100 space-y-4">{children}</div>}
    </div>
  );
};
