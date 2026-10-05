import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Share2,
  MessageSquare,
  Smartphone,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { GeneratedReminders, ReminderScheduleItem } from '../types/prescription';

interface RemindersPanelProps {
  reminders: GeneratedReminders;
}

export const RemindersPanel: React.FC<RemindersPanelProps> = ({ reminders }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'sms' | 'checklist'>('whatsapp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checkedDoses, setCheckedDoses] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showSimulatedNotification, setShowSimulatedNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const toggleCheckDose = (id: string) => {
    setCheckedDoses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleTriggerSimulatedAlarm = (scheduleItem: ReminderScheduleItem) => {
    setNotificationMessage(scheduleItem.suggestedReminderText);
    setShowSimulatedNotification(true);

    // Audio chime sound effect using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.0, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      // AudioContext may be restricted before user gesture
    }

    setTimeout(() => {
      setShowSimulatedNotification(false);
    }, 6000);
  };

  const currentMessageText =
    activeTab === 'whatsapp'
      ? reminders.quickCopyMessages.whatsappCaregiver
      : activeTab === 'sms'
      ? reminders.quickCopyMessages.smsStyle
      : reminders.quickCopyMessages.dailyChecklist;

  const allDosesSpeechScript = `Here is your daily medication plan: ${reminders.patientFriendlySummary}. Scheduled times: ${reminders.schedule
    .map(
      (s) =>
        `${s.timeLabel}: Take ${s.medications.map((m) => `${m.name}, ${m.dose}`).join(' and ')}. ${s.suggestedReminderText}`
    )
    .join('. ')}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-8 relative">
      {/* Simulated Floating Notification Banner */}
      {showSimulatedNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 animate-bounce">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Bell className="h-5 w-5 animate-spin" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-400">MEDICATION ALARM NOW</span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <p className="text-xs text-slate-100 font-medium">{notificationMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Daily Administration Schedule & Reminder Generator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-formatted reminder messages ready to send via WhatsApp, SMS, or print as a fridge checklist.
          </p>
        </div>

        {/* Voice Read Aloud Button */}
        <button
          onClick={() => handleSpeak(allDosesSpeechScript)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all self-start sm:self-auto ${
            isSpeaking
              ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
          }`}
          title="Read schedule aloud for elderly or vision-impaired patients"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="h-4 w-4 text-rose-600" />
              <span>Stop Voice Reading</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-emerald-600" />
              <span>Listen to Schedule (Audio)</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-xs text-slate-700 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900">Patient Guidance Summary: </strong>
          <span>{reminders.patientFriendlySummary}</span>
        </div>
      </div>

      {/* Interactive Time Schedule Cards */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
          <span>Clock Schedule Timeline</span>
          <span className="text-[11px] font-normal text-slate-400">Click checkboxes to track doses</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reminders.schedule.map((item, idx) => {
            const isChecked = Boolean(checkedDoses[`dose-${idx}`]);

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      {item.timeLabel}
                    </span>

                    <button
                      onClick={() => toggleCheckDose(`dose-${idx}`)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      {isChecked ? 'Taken' : 'Mark Taken'}
                    </button>
                  </div>

                  {/* Medicines for this slot */}
                  <div className="space-y-1.5 mb-3">
                    {item.medications.map((med, mIdx) => (
                      <div key={mIdx} className="bg-slate-50 p-2 rounded-lg text-xs">
                        <div className="font-semibold text-slate-900">{med.name}</div>
                        <div className="text-[11px] text-slate-600 flex items-center justify-between mt-0.5">
                          <span>Dose: {med.dose}</span>
                          <span className="text-emerald-700 font-medium">{med.instructions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTriggerSimulatedAlarm(item)}
                    className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    title="Simulate alarm for this time slot"
                  >
                    <Bell className="h-3 w-3" /> Test Alarm
                  </button>

                  <button
                    onClick={() => handleCopy(item.suggestedReminderText, `slot-${idx}`)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    title="Copy reminder text for this time"
                  >
                    {copiedKey === `slot-${idx}` ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                        <Check className="h-3 w-3" /> Copied!
                      </span>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Text
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reminder Message Generator Tabs */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Tabs Bar */}
        <div className="bg-slate-50 p-1 flex items-center justify-between border-b border-slate-200 gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'whatsapp'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp / Caregiver Format</span>
            </button>

            <button
              onClick={() => setActiveTab('sms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'sms'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
              <span>SMS / Alarm Text</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'checklist'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Daily Checklist</span>
            </button>
          </div>

          <button
            onClick={() => handleCopy(currentMessageText, 'tab-message')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            {copiedKey === 'tab-message' ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Message</span>
              </>
            )}
          </button>
        </div>

        {/* Message Content Box */}
        <div className="p-4 bg-white">
          <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
            {currentMessageText}
          </pre>
        </div>
      </div>
    </div>
  );
};
