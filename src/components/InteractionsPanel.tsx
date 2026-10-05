import React from 'react';
import { AlertTriangle, Flame, ShieldAlert, Coffee, Wine, Apple, ArrowRight } from 'lucide-react';
import { DrugInteraction } from '../types/prescription';

interface InteractionsPanelProps {
  interactions: DrugInteraction[];
  generalPrecautions: string[];
  whenToContactDoctor: string[];
}

export const InteractionsPanel: React.FC<InteractionsPanelProps> = ({
  interactions,
  generalPrecautions,
  whenToContactDoctor,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Major Drug Interactions & Conflicts to Avoid
          </h2>
          <p className="text-xs text-slate-500">
            Prevent harmful drug-on-drug conflicts, food blockers, and adverse reactions.
          </p>
        </div>
      </div>

      {/* Drug-Drug Interactions */}
      {interactions.length > 0 ? (
        <div className="space-y-3 mb-6">
          {interactions.map((interaction, idx) => {
            const isCritical = interaction.severity === 'critical';
            const isHigh = interaction.severity === 'high';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  isCritical
                    ? 'bg-rose-50/60 border-rose-200'
                    : isHigh
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-rose-600 text-white'
                          : isHigh
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {interaction.severity} Conflict
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      {interaction.drugsInvolved.map((drug, dIdx) => (
                        <React.Fragment key={dIdx}>
                          <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                            {drug}
                          </span>
                          {dIdx < interaction.drugsInvolved.length - 1 && (
                            <span className="text-rose-500 font-bold">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {interaction.riskTitle}
                </h4>

                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {interaction.description}
                </p>

                <div className="bg-white rounded-lg p-2.5 border border-slate-200/80 flex items-start gap-2 text-xs">
                  <ShieldAlert className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">What to do: </span>
                    <span className="text-slate-700">{interaction.actionToTake}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 mb-6 text-xs text-emerald-800 flex items-center gap-2.5">
          <ShieldAlert className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>No direct adverse drug-to-drug interactions detected between the entered medications.</span>
        </div>
      )}

      {/* Common Everyday Precautions Grid (Food, Drink, Sunlight) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Food & Drink Warnings */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-2">
            <Wine className="h-4 w-4 text-purple-600" />
            Everyday Diet & Lifestyle Interactions
          </h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
              <span>
                <strong className="text-slate-800">Alcohol:</strong> Avoid completely with antibiotics, painkillers, sedatives, and diabetes drugs to prevent liver toxicity and dizziness.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
              <span>
                <strong className="text-slate-800">Dairy & Calcium:</strong> Avoid milk or calcium-fortified juice within 2 hours of antibiotics (like Ciprofloxacin/Doxycycline) as it binds and blocks absorption.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
              <span>
                <strong className="text-slate-800">Grapefruit Juice:</strong> Avoid with cholesterol statins and certain blood pressure medications as it dangerously multiplies drug strength.
              </span>
            </li>
          </ul>
        </div>

        {/* When to Call Doctor Immediately */}
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2.5 flex items-center gap-2">
            <Flame className="h-4 w-4 text-rose-600" />
            When to Seek Immediate Medical Help
          </h4>
          <ul className="space-y-1.5 text-xs text-rose-900/80">
            {whenToContactDoctor && whenToContactDoctor.length > 0 ? (
              whenToContactDoctor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>Difficulty breathing, swelling of face/lips/tongue (severe allergic reaction).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>Severe skin blistering, peeling, or widespread rash.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>Signs of internal bleeding: black tarry stools or vomiting blood.</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
