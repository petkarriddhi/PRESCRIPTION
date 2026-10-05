export interface InterpretedMedication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  frequency: string;
  doctorShorthandDecoded: string;
  timeOfAdministration: {
    recommendedTimes: string[];
    foodInstruction: string;
    specialTimingNote?: string;
  };
  duration: string;
  purpose: string;
  precautions: string[];
  commonSideEffects?: string[];
  missedDoseAdvice: string;
}

export interface DrugInteraction {
  severity: 'critical' | 'high' | 'moderate' | 'minor';
  drugsInvolved: string[];
  riskTitle: string;
  description: string;
  actionToTake: string;
}

export interface MedicationErrorAlert {
  type:
    | 'dosage_overdose'
    | 'duplicate_therapy'
    | 'conflicting_combination'
    | 'contraindication'
    | 'missing_instruction'
    | 'ambiguous_abbreviation';
  severity: 'critical' | 'warning' | 'caution';
  medicationName: string;
  issue: string;
  explanation: string;
  recommendedAction: string;
}

export interface ReminderScheduleItem {
  timeLabel: string;
  medications: Array<{
    name: string;
    dose: string;
    instructions: string;
  }>;
  suggestedReminderText: string;
}

export interface GeneratedReminders {
  schedule: ReminderScheduleItem[];
  patientFriendlySummary: string;
  quickCopyMessages: {
    smsStyle: string;
    whatsappCaregiver: string;
    dailyChecklist: string;
  };
}

export interface PrescriptionInterpretation {
  summary: string;
  rawTranscribedText?: string;
  confidenceScore: 'high' | 'moderate' | 'low';
  unclearOrIllegibleParts?: string[];
  medications: InterpretedMedication[];
  drugInteractions: DrugInteraction[];
  medicationErrorAlerts: MedicationErrorAlert[];
  reminders: GeneratedReminders;
  generalSafetyPrecautions: string[];
  whenToContactDoctorImmediately: string[];
  _fallbackNotice?: string;
}

export interface PatientProfile {
  age?: string;
  allergies?: string;
  conditions?: string;
  isPregnantOrNursing?: boolean;
}
