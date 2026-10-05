/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PrescriptionInput } from './components/PrescriptionInput';
import { MedicationCard } from './components/MedicationCard';
import { ErrorAlertsBanner } from './components/ErrorAlertsBanner';
import { InteractionsPanel } from './components/InteractionsPanel';
import { RemindersPanel } from './components/RemindersPanel';
import { AbbreviationGlossaryModal } from './components/AbbreviationGlossaryModal';
import { PrintableView } from './components/PrintableView';
import { SAMPLE_PRESCRIPTIONS, SamplePrescription } from './data/samplePrescriptions';
import { PrescriptionInterpretation, PatientProfile } from './types/prescription';
import {
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  FileText,
  Search,
  CheckCircle,
  Sparkles,
  HeartPulse,
  Clock,
  Pill,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Edit3,
  Calendar,
} from 'lucide-react';

export default function App() {
  const [prescriptionText, setPrescriptionText] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({});
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [interpretation, setInterpretation] = useState<PrescriptionInterpretation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'schedule' | 'medications' | 'safety' | 'reminders'>('schedule');

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);

  const handleSelectSample = (sample: SamplePrescription) => {
    setPrescriptionText(sample.text);
    setImageBase64(null);
    setPatientProfile(sample.patientNotes || {});
    setActiveSampleId(sample.id);
    setInterpretation(null);
    setErrorMessage(null);
  };

  const handleInterpret = async () => {
    if (!prescriptionText.trim() && !imageBase64) {
      setErrorMessage('Please either upload a photo/image of a prescription or type in the medicine text.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/interpret-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionText,
          imageBase64,
          imageMimeType,
          patientProfile,
          preferredLanguage: selectedLanguage,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || data.error || `Server error (${response.status})`);
      }

      setInterpretation(data);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('interpretation-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      console.error('Failed to interpret prescription:', err);
      setErrorMessage(
        err.message || 'Unable to process prescription at this time. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakSummary = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!interpretation) return;

    window.speechSynthesis.cancel();
    const textToRead = `${interpretation.summary}. You have ${interpretation.medications.length} medicines. ${interpretation.reminders.patientFriendlySummary}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyTranscript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const hasCriticalWarning = interpretation?.medicationErrorAlerts?.some(a => a.severity === 'critical') || interpretation?.drugInteractions?.some(i => i.severity === 'critical');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onPrint={handlePrint}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(lang) => setSelectedLanguage(lang)}
        hasResult={Boolean(interpretation)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 print:hidden">
        {/* Simple Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold mb-2">
            <HeartPulse className="h-3.5 w-3.5 text-emerald-600" />
            Simple & Patient-Friendly Prescription Reader
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
            Read Doctor Prescription & Medication Guide
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Upload a handwritten doctor note, clinic slip, or type prescription shorthand to get simple daily times, food rules, and safety alerts.
          </p>
        </div>

        {/* Prescription Input (Photo or Text) */}
        <PrescriptionInput
          prescriptionText={prescriptionText}
          setPrescriptionText={(text) => {
            setPrescriptionText(text);
            setActiveSampleId(null);
          }}
          imageBase64={imageBase64}
          setImageBase64={setImageBase64}
          imageMimeType={imageMimeType}
          setImageMimeType={setImageMimeType}
          patientProfile={patientProfile}
          setPatientProfile={setPatientProfile}
          onInterpret={handleInterpret}
          isLoading={isLoading}
          onSelectSample={handleSelectSample}
          activeSampleId={activeSampleId}
        />

        {/* Error notification */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* INTERPRETATION RESULTS - SIMPLIFIED INTERFACE */}
        {interpretation && (
          <div id="interpretation-results" className="space-y-5 animate-in fade-in duration-200">
            {/* Top Summary Card with Audio Voice Reader */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Prescription Decoded Successfully
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {interpretation.summary}
                    </p>
                  </div>
                </div>

                {/* Voice Narration Button */}
                <button
                  type="button"
                  onClick={handleSpeakSummary}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors border ${
                    isSpeaking
                      ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                  title="Listen to summary"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-4 w-4 text-rose-600" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 text-emerald-600" />
                      <span>🔊 Listen (Voice)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Deciphered Handwriting Transcript Drawer */}
              {interpretation.rawTranscribedText && (
                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                      Deciphered Text from Doctor's Prescription:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyTranscript(interpretation.rawTranscribedText!)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                    >
                      {copiedTranscript ? (
                        <span className="text-emerald-600 flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Copied
                        </span>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy Text
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60">
                    {interpretation.rawTranscribedText}
                  </pre>
                </div>
              )}
            </div>

            {/* Critical Medication Warning Callout (only if critical errors/interactions exist) */}
            {hasCriticalWarning && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-rose-950 shadow-xs">
                <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-rose-950">
                    ⚠️ Urgent Medication Conflict or Dosage Warning Detected
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5">
                    A dangerous interaction or high dosage was identified. Please review the <strong>"Safety & Warnings"</strong> tab below before administering this medication.
                  </p>
                </div>
              </div>
            )}

            {/* Simplified View Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveResultTab('schedule')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeResultTab === 'schedule'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>Daily Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveResultTab('medications')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeResultTab === 'medications'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Pill className="h-4 w-4 text-emerald-600" />
                <span>My Medicines ({interpretation.medications.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveResultTab('safety')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
                  activeResultTab === 'safety'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className={`h-4 w-4 ${hasCriticalWarning ? 'text-rose-600' : 'text-amber-500'}`} />
                <span>Safety & Warnings</span>
                {hasCriticalWarning && (
                  <span className="h-2 w-2 rounded-full bg-rose-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveResultTab('reminders')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeResultTab === 'reminders'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="h-4 w-4 text-teal-600" />
                <span>Reminder Messages</span>
              </button>
            </div>

            {/* TAB CONTENT: 1. DAILY SCHEDULE */}
            {activeResultTab === 'schedule' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      When to Take Your Medicine Today
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {interpretation.reminders.patientFriendlySummary}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {interpretation.reminders.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md inline-block mb-2">
                          {item.timeLabel}
                        </span>

                        <div className="space-y-2 mt-1">
                          {item.medications.map((m, mIdx) => (
                            <div key={mIdx} className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                              <div className="text-xs font-bold text-slate-900">{m.name}</div>
                              <div className="text-[11px] text-slate-600 mt-0.5 flex justify-between">
                                <span>Dose: <strong>{m.dose}</strong></span>
                              </div>
                              <div className="text-[11px] text-emerald-700 font-medium mt-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {m.instructions}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 italic mt-3 pt-2 border-t border-emerald-200/50">
                        {item.suggestedReminderText}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. MY MEDICINES */}
            {activeResultTab === 'medications' && (
              <div className="space-y-3">
                {interpretation.medications.map((med, index) => (
                  <MedicationCard key={med.id || index} medication={med} index={index} />
                ))}
              </div>
            )}

            {/* TAB CONTENT: 3. SAFETY & WARNINGS */}
            {activeResultTab === 'safety' && (
              <div className="space-y-4">
                <ErrorAlertsBanner alerts={interpretation.medicationErrorAlerts} />
                <InteractionsPanel
                  interactions={interpretation.drugInteractions}
                  generalPrecautions={interpretation.generalSafetyPrecautions}
                  whenToContactDoctor={interpretation.whenToContactDoctorImmediately}
                />
              </div>
            )}

            {/* TAB CONTENT: 4. REMINDER MESSAGES */}
            {activeResultTab === 'reminders' && (
              <RemindersPanel reminders={interpretation.reminders} />
            )}
          </div>
        )}
      </main>

      {/* Printable Sheet for Fridge / PDF */}
      {interpretation && <PrintableView data={interpretation} />}

      {/* Latin & Medical Abbreviation Glossary Modal */}
      <AbbreviationGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-auto print:hidden text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span className="font-semibold text-slate-800">
            RxTranslate • Patient Prescription Guide & Safety Sentinel
          </span>
          <p className="text-[11px] text-slate-400">
            For medical emergencies or unclear dosages, always consult your physician or pharmacist.
          </p>
        </div>
      </footer>
    </div>
  );
}
