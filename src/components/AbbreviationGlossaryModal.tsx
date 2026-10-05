import React, { useState } from 'react';
import { X, Search, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { MEDICAL_ABBREVIATIONS, MedicalAbbreviation } from '../data/medicalAbbreviations';

interface AbbreviationGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AbbreviationGlossaryModal: React.FC<AbbreviationGlossaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Frequency', 'Timing / Food', 'Route', 'Dosage / Condition'];

  const filtered = MEDICAL_ABBREVIATIONS.filter((item) => {
    const matchesSearch =
      item.abbr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientGuidance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.latinOrigin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Doctor Shorthand & Latin Abbreviation Decoder
              </h3>
              <p className="text-xs text-slate-500">
                Common prescription acronyms deciphered into plain English
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search abbreviations e.g. TID, ac, pc, PRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Abbreviations List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.abbr}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {item.meaning}
                    </span>
                    <span className="text-[10px] text-slate-400 italic">
                      ({item.latinOrigin})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.patientGuidance}</p>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 self-start sm:self-auto shrink-0">
                  {item.category}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching abbreviations found for "{searchTerm}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} abbreviations listed</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
