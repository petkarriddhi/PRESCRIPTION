export interface MedicalAbbreviation {
  abbr: string;
  latinOrigin: string;
  meaning: string;
  patientGuidance: string;
  category: 'Frequency' | 'Timing / Food' | 'Route' | 'Dosage / Condition';
}

export const MEDICAL_ABBREVIATIONS: MedicalAbbreviation[] = [
  {
    abbr: 'PO',
    latinOrigin: 'Per os',
    meaning: 'By mouth / Oral',
    patientGuidance: 'Swallow with water unless specified as chewable or sublingual.',
    category: 'Route'
  },
  {
    abbr: 'OD / QD',
    latinOrigin: 'Omni die / Quaque die',
    meaning: 'Once daily',
    patientGuidance: 'Take once every 24 hours, ideally at the same time each day.',
    category: 'Frequency'
  },
  {
    abbr: 'BD / BID',
    latinOrigin: 'Bis in die',
    meaning: 'Twice daily',
    patientGuidance: 'Take 2 times a day, spaced roughly 10-12 hours apart (e.g., 8:00 AM and 8:00 PM).',
    category: 'Frequency'
  },
  {
    abbr: 'TID / TDS',
    latinOrigin: 'Ter in die',
    meaning: 'Three times daily',
    patientGuidance: 'Take 3 times a day, spaced roughly 6-8 hours apart (e.g., 8:00 AM, 2:00 PM, 8:00 PM).',
    category: 'Frequency'
  },
  {
    abbr: 'QID / QDS',
    latinOrigin: 'Quater in die',
    meaning: 'Four times daily',
    patientGuidance: 'Take 4 times a day during waking hours (e.g., breakfast, lunch, dinner, bedtime).',
    category: 'Frequency'
  },
  {
    abbr: 'AC',
    latinOrigin: 'Ante cibum',
    meaning: 'Before meals / On an empty stomach',
    patientGuidance: 'Take 30 to 60 minutes before eating food or breakfast.',
    category: 'Timing / Food'
  },
  {
    abbr: 'PC',
    latinOrigin: 'Post cibum',
    meaning: 'After meals',
    patientGuidance: 'Take within 15-30 minutes after completing a meal to prevent stomach upset.',
    category: 'Timing / Food'
  },
  {
    abbr: 'CC',
    latinOrigin: 'Cum cibo',
    meaning: 'With food / With meal',
    patientGuidance: 'Take right in the middle of eating your meal.',
    category: 'Timing / Food'
  },
  {
    abbr: 'HS / QHS',
    latinOrigin: 'Hora somni',
    meaning: 'At bedtime',
    patientGuidance: 'Take right before going to sleep at night.',
    category: 'Timing / Food'
  },
  {
    abbr: 'PRN',
    latinOrigin: 'Pro re nata',
    meaning: 'As needed / When necessary',
    patientGuidance: 'Only take if you experience the specific symptom (e.g. fever or pain). Observe maximum daily limit.',
    category: 'Frequency'
  },
  {
    abbr: 'SOS',
    latinOrigin: 'Si opus sit',
    meaning: 'In an emergency / If needed',
    patientGuidance: 'Take only when the emergency distress symptom occurs.',
    category: 'Frequency'
  },
  {
    abbr: 'STAT',
    latinOrigin: 'Statim',
    meaning: 'Immediately / Right now',
    patientGuidance: 'Take the first dose immediately without delay.',
    category: 'Timing / Food'
  },
  {
    abbr: 'q4h / q6h / q8h',
    latinOrigin: 'Quaque hora',
    meaning: 'Every 4 / 6 / 8 hours',
    patientGuidance: 'Strictly space doses by this number of hours to maintain steady medicine levels in the bloodstream.',
    category: 'Frequency'
  },
  {
    abbr: 'Mane',
    latinOrigin: 'Mane',
    meaning: 'In the morning',
    patientGuidance: 'Take after waking up in the morning.',
    category: 'Timing / Food'
  },
  {
    abbr: 'Nocte',
    latinOrigin: 'Nocte',
    meaning: 'At night',
    patientGuidance: 'Take in the night hours.',
    category: 'Timing / Food'
  },
  {
    abbr: 'Tab',
    latinOrigin: 'Tabella',
    meaning: 'Tablet',
    patientGuidance: 'Solid compressed pill.',
    category: 'Route'
  },
  {
    abbr: 'Cap',
    latinOrigin: 'Capsula',
    meaning: 'Capsule',
    patientGuidance: 'Gelatin shell containing medicine. Do not open or crush unless instructed.',
    category: 'Route'
  },
  {
    abbr: 'Syr',
    latinOrigin: 'Syrupus',
    meaning: 'Syrup / Liquid',
    patientGuidance: 'Liquid medicine. Always use a medical measuring cup or syringe, not a kitchen teaspoon.',
    category: 'Route'
  },
  {
    abbr: 'Gtt',
    latinOrigin: 'Guttae',
    meaning: 'Drops (Eye, Ear, or Oral)',
    patientGuidance: 'Count exact drops into target eye, ear, or mouth.',
    category: 'Route'
  },
  {
    abbr: 'MDU',
    latinOrigin: 'More dicto utendus',
    meaning: 'Use as directed',
    patientGuidance: 'Follow the specific verbal instructions given by your doctor.',
    category: 'Dosage / Condition'
  },
  {
    abbr: 'NPO',
    latinOrigin: 'Nil per os',
    meaning: 'Nothing by mouth',
    patientGuidance: 'Do not eat or drink anything, usually prior to blood tests or surgery.',
    category: 'Dosage / Condition'
  }
];
