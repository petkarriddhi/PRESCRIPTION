import React, { useState } from 'react';
import {
  Pill,
  Clock,
  Utensils,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { InterpretedMedication } from '../types/prescription';

interface MedicationCardProps {
  medication: InterpretedMedication;
  index: number;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, index }) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden">
      {/* Top Banner with Medicine Name and Form */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Drug #{index + 1}
              </span>
              <h3 className="text-base font-bold text-slate-900">{medication.name}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active ingredient: <span className="font-semibold text-slate-700">{medication.genericName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            {medication.dosage}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
            {medication.form}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-1"
            title={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {expanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Shorthand Decoded & Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Decoded Doctor Shorthand */}
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Doctor's Shorthand Translated
              </span>
              <p className="text-xs font-medium text-emerald-950 leading-relaxed">
                {medication.doctorShorthandDecoded || `${medication.frequency} (${medication.form})`}
              </p>
            </div>

            {/* Purpose */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-1">
                <Info className="h-3.5 w-3.5 text-slate-500" />
                What This Medicine Does
              </span>
              <p className="text-xs font-medium text-slate-800 leading-relaxed">
                {medication.purpose}
              </p>
            </div>
          </div>

          {/* Time of Administration & Food Instruction */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              How & When to Administer
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Timing */}
              <div>
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Recommended Times:</span>
                <div className="flex flex-wrap gap-1.5">
                  {medication.timeOfAdministration.recommendedTimes && medication.timeOfAdministration.recommendedTimes.length > 0 ? (
                    medication.timeOfAdministration.recommendedTimes.map((time, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-800 border border-emerald-200"
                      >
                        {time}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-700">{medication.frequency}</span>
                  )}
                </div>
              </div>

              {/* Food Instruction */}
              <div>
                <span className="text-[11px] font-medium text-slate-500 block mb-1 flex items-center gap-1">
                  <Utensils className="h-3 w-3 text-amber-500" /> Food Instruction:
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {medication.timeOfAdministration.foodInstruction}
                </p>
              </div>

              {/* Duration */}
              <div>
                <span className="text-[11px] font-medium text-slate-500 block mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-blue-500" /> Duration of Course:
                </span>
                <p className="text-xs font-semibold text-slate-800">
                  {medication.duration}
                </p>
              </div>
            </div>

            {medication.timeOfAdministration.specialTimingNote && (
              <p className="text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-slate-200/60">
                <strong className="text-slate-700">Special Note:</strong> {medication.timeOfAdministration.specialTimingNote}
              </p>
            )}
          </div>

          {/* Precautions, Side Effects & Missed Dose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Precautions */}
            <div className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/30">
              <span className="font-bold text-amber-900 block mb-1.5 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                Key Precautions & Warnings:
              </span>
              <ul className="space-y-1 text-slate-700">
                {medication.precautions.map((prec, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                    <span>{prec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missed Dose Advice & Side Effects */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                  What If You Miss a Dose?
                </span>
                <p className="text-slate-600 leading-relaxed mb-2">
                  {medication.missedDoseAdvice ||
                    'Take it as soon as you remember, unless it is close to your next dose. Never take a double dose to make up.'}
                </p>
              </div>

              {medication.commonSideEffects && medication.commonSideEffects.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    Common mild side effects:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {medication.commonSideEffects.map((side, sIdx) => (
                      <span key={sIdx} className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                        {side}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
