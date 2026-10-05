import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  FileText,
  X,
  Sparkles,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Image as ImageIcon,
  RotateCw,
  Eye,
} from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS, SamplePrescription } from '../data/samplePrescriptions';
import { createHandwrittenPrescriptionImage } from '../utils/prescriptionImages';
import { PatientProfile } from '../types/prescription';

interface PrescriptionInputProps {
  prescriptionText: string;
  setPrescriptionText: (text: string) => void;
  imageBase64: string | null;
  setImageBase64: (base64: string | null) => void;
  imageMimeType: string;
  setImageMimeType: (mime: string) => void;
  patientProfile: PatientProfile;
  setPatientProfile: React.Dispatch<React.SetStateAction<PatientProfile>>;
  onInterpret: () => void;
  isLoading: boolean;
  onSelectSample: (sample: SamplePrescription) => void;
  activeSampleId: string | null;
}

export const PrescriptionInput: React.FC<PrescriptionInputProps> = ({
  prescriptionText,
  setPrescriptionText,
  imageBase64,
  setImageBase64,
  imageMimeType,
  setImageMimeType,
  patientProfile,
  setPatientProfile,
  onInterpret,
  isLoading,
  onSelectSample,
  activeSampleId,
}) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'text'>(imageBase64 ? 'photo' : 'photo');
  const [showPatientNotes, setShowPatientNotes] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
      setActiveTab('photo');
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClearImage = () => {
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSelectSampleHandwritten = (variant: 'infection' | 'cardiac' | 'pain') => {
    const dataUrl = createHandwrittenPrescriptionImage(variant);
    setImageBase64(dataUrl);
    setImageMimeType('image/jpeg');
    setActiveTab('photo');
    // Clear plain text so model focuses on handwriting image
    setPrescriptionText('');
  };

  const hasInput = Boolean(imageBase64 || prescriptionText.trim());

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 mb-8 transition-all">
      {/* Top Tab Mode Switcher - Simplified */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'photo'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="h-4 w-4 text-emerald-600" />
            <span>Scan Photo / Doctor's Handwriting</span>
            {imageBase64 && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4 text-emerald-600" />
            <span>Type / Paste Prescription</span>
            {prescriptionText.trim() && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {hasInput && (
          <button
            onClick={() => {
              handleClearImage();
              setPrescriptionText('');
            }}
            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 self-end sm:self-auto transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Clear input
          </button>
        )}
      </div>

      {/* PHOTO / CAMERA TAB */}
      {activeTab === 'photo' && (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />

          {imageBase64 ? (
            /* Image Preview Card */
            <div className="relative rounded-2xl border-2 border-emerald-300 bg-emerald-50/30 p-3 sm:p-4 flex flex-col items-center">
              <div className="relative max-h-72 w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/5 p-2">
                <img
                  src={imageBase64}
                  alt="Doctor Prescription Note"
                  className="max-h-64 max-w-full object-contain rounded-lg shadow-sm"
                />
              </div>

              <div className="w-full flex items-center justify-between mt-3 pt-3 border-t border-emerald-200/60 text-xs">
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Prescription image ready for handwriting OCR
                </span>
                <button
                  onClick={handleClearImage}
                  className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg font-medium transition-colors"
                >
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            /* Upload / Camera Dropzone */
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-3">
                <div
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-xs"
                  title="Take photo with camera"
                >
                  <Camera className="h-6 w-6" />
                </div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 w-12 rounded-2xl bg-teal-100 text-teal-700 hover:bg-teal-200 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-xs"
                  title="Upload from gallery or computer"
                >
                  <Upload className="h-6 w-6" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Upload or Snap a Photo of Your Doctor's Prescription
              </h3>
              <p className="text-xs text-slate-500 max-w-md mb-4">
                Works with handwritten doctor clinic pads, paper Rx slips, cursive handwriting notes, and medicine labels.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Camera className="h-3.5 w-3.5" /> Take Photo
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </button>
              </div>

              {/* Sample Handwriting Test Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-200/60 w-full max-w-lg">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Or test with sample handwritten doctor slips:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectSampleHandwritten('infection')}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    📝 Sample Rx Pad: Antibiotic Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSampleHandwritten('cardiac')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    ⚠️ Sample Rx Pad: Blood Thinner Note
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSampleHandwritten('pain')}
                    className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    💊 Sample Rx Pad: Diabetes Slip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TEXT TAB */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Type or Paste Prescription Lines
            </label>
            <span className="text-[11px] text-slate-400">
              e.g. Tab Augmentin 625mg TID pc x 7d
            </span>
          </div>

          <textarea
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
            placeholder="Type doctor's notes here...&#10;Example:&#10;1. Tab Augmentin 625mg - 1 tab PO TID pc x 7d&#10;2. Tab Paracetamol 650mg - 1 tab SOS q6h&#10;3. Cap Omeprazole 20mg - 1 cap OD ac"
            rows={5}
            className="w-full text-sm font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 bg-slate-50/40 resize-y"
          />

          {/* Quick preset chips */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Quick test presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PRESCRIPTIONS.slice(0, 4).map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onSelectSample(sample)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    activeSampleId === sample.id
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {sample.tag}: {sample.title.split(':')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Optional Patient Context (Collapsed by default to keep UI simple) */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowPatientNotes(!showPatientNotes)}
          className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1.5 font-medium transition-colors"
        >
          <User className="h-3.5 w-3.5 text-emerald-600" />
          <span>Patient Context (Age, Allergies, Pregnancy)</span>
          {showPatientNotes ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {showPatientNotes && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs animate-in fade-in duration-150">
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-0.5">
                Patient Age / Weight
              </label>
              <input
                type="text"
                placeholder="e.g. 35 yrs / 65 kg"
                value={patientProfile.age || ''}
                onChange={(e) => setPatientProfile((prev) => ({ ...prev, age: e.target.value }))}
                className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-0.5">
                Known Drug Allergies
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa"
                value={patientProfile.allergies || ''}
                onChange={(e) => setPatientProfile((prev) => ({ ...prev, allergies: e.target.value }))}
                className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center pt-3 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={patientProfile.isPregnantOrNursing || false}
                  onChange={(e) =>
                    setPatientProfile((prev) => ({ ...prev, isPregnantOrNursing: e.target.checked }))
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300"
                />
                <span className="text-slate-700 text-xs font-medium">
                  Pregnant or Nursing
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="mt-5">
        <button
          type="button"
          onClick={onInterpret}
          disabled={!hasInput || isLoading}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            !hasInput || isLoading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Deciphering Doctor's Handwriting & Checking Safety...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>
                {imageBase64
                  ? 'Read Prescription Photo & Explain Medications'
                  : 'Interpret Prescription & Explain Medications'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
