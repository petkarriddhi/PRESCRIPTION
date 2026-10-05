import React from 'react';
import { AlertOctagon, AlertTriangle, Info, ShieldAlert, CheckCircle, PhoneCall } from 'lucide-react';
import { MedicationErrorAlert } from '../types/prescription';

interface ErrorAlertsBannerProps {
  alerts: MedicationErrorAlert[];
}

export const ErrorAlertsBanner: React.FC<ErrorAlertsBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
        <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
          <CheckCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
            No Critical Medication Errors Detected
          </h3>
          <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
            Dosages and frequencies appear within standard adult therapeutic limits based on prescription details. Always double-check with your dispensing pharmacist.
          </p>
        </div>
      </div>
    );
  }

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-6 mb-8 transition-all shadow-sm ${
        criticalCount > 0
          ? 'bg-rose-50/80 border-rose-200 ring-2 ring-rose-500/20'
          : 'bg-amber-50/80 border-amber-200 ring-2 ring-amber-500/10'
      }`}
    >
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-200/60 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
              criticalCount > 0 ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' : 'bg-amber-600 text-white'
            }`}
          >
            {criticalCount > 0 ? <AlertOctagon className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-base font-bold ${
                  criticalCount > 0 ? 'text-rose-950' : 'text-amber-950'
                }`}
              >
                Medication Error & Safety Alert
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  criticalCount > 0
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {criticalCount > 0 ? `${criticalCount} High Risk Alert(s)` : `${warningCount} Warning(s)`}
              </span>
            </div>
            <p className="text-xs text-rose-800/80 mt-0.5">
              Potential dangerous dosage mistakes or hazardous drug overlaps detected in this prescription.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 bg-white/80 px-3 py-1.5 rounded-lg border border-rose-200 self-start sm:self-auto">
          <PhoneCall className="h-3.5 w-3.5 text-rose-600 shrink-0" />
          <span>Consult Pharmacist / Doctor Before Ingesting</span>
        </div>
      </div>

      {/* List of Error Alerts */}
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const isCritical = alert.severity === 'critical';
          const isWarning = alert.severity === 'warning';

          return (
            <div
              key={index}
              className={`p-3.5 sm:p-4 rounded-xl border bg-white shadow-xs ${
                isCritical
                  ? 'border-rose-300 ring-1 ring-rose-500/10'
                  : isWarning
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isCritical
                        ? 'bg-rose-600 text-white'
                        : isWarning
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-600 text-white'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {alert.medicationName}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 capitalize">
                  Issue: {alert.type.replace('_', ' ')}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-rose-900 mb-1">
                {alert.issue}
              </h4>

              <p className="text-xs text-slate-700 leading-relaxed mb-2.5">
                {alert.explanation}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start gap-2 text-xs">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Recommended Patient Action: </span>
                  <span className="text-slate-700">{alert.recommendedAction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
