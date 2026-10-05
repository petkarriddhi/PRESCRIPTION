import React from 'react';
import { Pill, Clock, AlertTriangle, ShieldCheck, PhoneCall } from 'lucide-react';
import { PrescriptionInterpretation } from '../types/prescription';

interface PrintableViewProps {
  data: PrescriptionInterpretation;
}

export const PrintableView: React.FC<PrintableViewProps> = ({ data }) => {
  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 max-w-4xl mx-auto font-sans">
      {/* Print Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            PATIENT MEDICATION ADMINISTRATION GUIDE
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Decoded Doctor Prescription & Safe Timing Instructions
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>Printed: {new Date().toLocaleDateString()}</p>
          <p className="font-semibold text-emerald-800">RxTranslate Patient Sheet</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-100 p-4 rounded-lg mb-6 text-sm border border-slate-300">
        <h2 className="font-bold text-slate-900 mb-1">Prescription Summary:</h2>
        <p className="text-slate-700">{data.summary}</p>
      </div>

      {/* Critical Alerts if any */}
      {data.medicationErrorAlerts && data.medicationErrorAlerts.length > 0 && (
        <div className="border-2 border-red-600 p-4 rounded-lg mb-6 bg-red-50 text-red-950">
          <h2 className="font-black text-red-900 text-sm mb-2 flex items-center gap-2">
            ⚠️ IMPORTANT MEDICATION WARNINGS & DOSAGE ALERTS:
          </h2>
          <ul className="space-y-1 text-xs list-disc pl-5">
            {data.medicationErrorAlerts.map((alert, idx) => (
              <li key={idx}>
                <strong>{alert.medicationName} ({alert.issue}):</strong> {alert.explanation}{' '}
                <em>(Action: {alert.recommendedAction})</em>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Drug Interactions */}
      {data.drugInteractions && data.drugInteractions.length > 0 && (
        <div className="border border-amber-400 p-3 rounded-lg mb-6 bg-amber-50 text-amber-950 text-xs">
          <h2 className="font-bold text-amber-900 mb-1">Drug Interactions to Avoid:</h2>
          <ul className="space-y-1 list-disc pl-5">
            {data.drugInteractions.map((item, idx) => (
              <li key={idx}>
                <strong>{item.drugsInvolved.join(' + ')}:</strong> {item.riskTitle} - {item.actionToTake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medications Table */}
      <h2 className="text-base font-bold text-slate-900 mb-2">Medications & Administration Timing</h2>
      <table className="w-full text-left text-xs border border-slate-300 mb-6">
        <thead className="bg-slate-200 text-slate-800">
          <tr>
            <th className="p-2 border border-slate-300">Medication</th>
            <th className="p-2 border border-slate-300">Dose & Form</th>
            <th className="p-2 border border-slate-300">When to Take (Clock Hours)</th>
            <th className="p-2 border border-slate-300">Food Instruction</th>
            <th className="p-2 border border-slate-300">Duration</th>
          </tr>
        </thead>
        <tbody>
          {data.medications.map((med, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="p-2 border border-slate-300 font-bold">
                {med.name}
                <div className="text-[10px] text-slate-500 font-normal">{med.genericName}</div>
              </td>
              <td className="p-2 border border-slate-300">
                {med.dosage} ({med.form})
              </td>
              <td className="p-2 border border-slate-300 font-semibold text-emerald-800">
                {med.timeOfAdministration.recommendedTimes.join(', ')}
              </td>
              <td className="p-2 border border-slate-300">{med.timeOfAdministration.foodInstruction}</td>
              <td className="p-2 border border-slate-300">{med.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Daily Checklist Format */}
      <h2 className="text-base font-bold text-slate-900 mb-2">Daily Dose Checklist (Post on Refrigerator)</h2>
      <div className="border border-slate-300 rounded-lg p-3 mb-6 bg-slate-50 text-xs">
        <pre className="font-mono whitespace-pre-wrap">{data.reminders.quickCopyMessages.dailyChecklist}</pre>
      </div>

      {/* Safety Notice Footer */}
      <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 flex justify-between">
        <span>Prescription interpretation generated for patient educational assistance.</span>
        <span>Always consult your licensed physician or pharmacist for medical emergencies.</span>
      </div>
    </div>
  );
};
