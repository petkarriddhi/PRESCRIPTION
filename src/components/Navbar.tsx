import React from 'react';
import { Pill, BookOpen, Printer, AlertTriangle, ShieldCheck, Languages } from 'lucide-react';

interface NavbarProps {
  onOpenGlossary: () => void;
  onPrint: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  hasResult: boolean;
}

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Spanish', label: 'Español' },
  { code: 'French', label: 'Français' },
  { code: 'Hindi', label: 'हिन्दी' },
  { code: 'German', label: 'Deutsch' },
  { code: 'Arabic', label: 'العربية' },
  { code: 'Portuguese', label: 'Português' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGlossary,
  onPrint,
  selectedLanguage,
  onLanguageChange,
  hasResult,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Rx<span className="text-emerald-600">Translate</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3 w-3" /> Safety Sentinel
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Doctor Prescription Interpreter & Medication Safety Guide
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Languages className="h-4 w-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg pl-8 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-colors"
              title="Select interpretation language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Abbreviation Glossary */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
            title="Decode Latin & Medical Abbreviations"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Rx Shorthand Decoder</span>
            <span className="sm:hidden">Rx Decoder</span>
          </button>

          {/* Print Button */}
          {hasResult && (
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
              title="Print Medication Guide for Patient or Fridge"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print Guide</span>
            </button>
          )}

          {/* Emergency note badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>Emergency? Call 911 / Local EMS</span>
          </div>
        </div>
      </div>
    </header>
  );
};
