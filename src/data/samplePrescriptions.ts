export interface SamplePrescription {
  id: string;
  title: string;
  tag: string;
  description: string;
  text: string;
  patientNotes?: {
    age?: string;
    allergies?: string;
    conditions?: string;
    isPregnantOrNursing?: boolean;
  };
}

export const SAMPLE_PRESCRIPTIONS: SamplePrescription[] = [
  {
    id: 'bacterial-infection',
    title: 'Acute Respiratory Infection (Antibiotic Regimen)',
    tag: 'Standard Rx',
    description: 'Typical outpatient antibiotic + symptom relief with Latin timing instructions (TID pc, SOS q6h, OD ac)',
    text: `Dr. Sarah Jenkins, MD - Internal Medicine
Rx:
1. Tab Augmentin (Amoxicillin + Clavulanate) 625mg - 1 tab PO TID pc x 7 days
2. Tab Paracetamol (Calpol) 650mg - 1 tab PO SOS / PRN q6h for fever/bodyache (Max 4 tabs/24h)
3. Cap Omeprazole 20mg - 1 cap PO OD ac (30 mins before breakfast) x 7 days
4. Syrup Levocetirizine 5mg/5ml - 10ml PO QHS x 5 days

Notes: Drink plenty of warm fluids. Complete antibiotic course.`,
    patientNotes: {
      age: '34 years',
      allergies: 'None',
      conditions: 'Upper respiratory infection',
      isPregnantOrNursing: false
    }
  },
  {
    id: 'conflicting-interaction',
    title: '⚠️ Dangerous Combination: Blood Thinner + NSAID',
    tag: 'Severe Conflict',
    description: 'Doctor co-prescribed Warfarin with Aspirin and high-dose Ibuprofen, triggering a critical bleeding alert',
    text: `Clinic Prescription - Cardiology & Ortho follow-up
Patient: Robert Miller (Age 68)

Rx:
1. Tab Warfarin Sodium 5mg - 1 tab PO OD at 6:00 PM (HS)
2. Tab Aspirin (Ecosprin) 75mg - 1 tab PO OD pc
3. Tab Ibuprofen 400mg - 1 tab PO TID for severe knee pain
4. Tab Atorvastatin 20mg - 1 tab PO OD HS

Follow-up INR in 2 weeks.`,
    patientNotes: {
      age: '68 years',
      allergies: 'None known',
      conditions: 'Atrial fibrillation, Knee osteoarthritis',
      isPregnantOrNursing: false
    }
  },
  {
    id: 'dosage-overdose-error',
    title: '🚨 Medication Error: Paracetamol Overdose Alert',
    tag: 'Dosage Mistake',
    description: 'Accidental prescription of 1000mg Paracetamol 4 times daily PLUS cold syrup containing 500mg Paracetamol, exceeding safe 4g limit',
    text: `Urgent Care Slip
Rx:
1. Tab Paracetamol 1000mg - 1 tab PO QID (every 6 hours) x 5 days
2. Cold & Flu Relief Night Syrup (contains Acetaminophen 500mg per 15ml) - 15ml PO Q4H PRN
3. Tab Ciprofloxacin 500mg - 1 tab PO BD cc x 5 days

Take with milk or antacid for heartburn if needed.`,
    patientNotes: {
      age: '42 years',
      allergies: 'Sulfa drugs',
      conditions: 'Severe flu, mild gastritis',
      isPregnantOrNursing: false
    }
  },
  {
    id: 'chronic-care',
    title: 'Chronic Management (Diabetes & Hypertension)',
    tag: 'Daily Routine',
    description: 'Multi-drug daily maintenance schedule with fasting and evening timing requirements',
    text: `Endocrinology Clinic
Patient: Margaret Chen (Age 62)

Rx:
1. Tab Metformin HCl 500mg - 1 tab PO BD cc (with breakfast and dinner)
2. Tab Glimepiride 1mg - 1 tab PO OD ac (15 mins before breakfast)
3. Tab Telmisartan 40mg - 1 tab PO OD mane (morning)
4. Tab Rosuvastatin 10mg - 1 tab PO OD nocte (bedtime)

Diet: Low sodium, diabetic diet. Monitor fasting blood sugars.`,
    patientNotes: {
      age: '62 years',
      allergies: 'Penicillin (hives)',
      conditions: 'Type 2 Diabetes, Hypertension, Dyslipidemia',
      isPregnantOrNursing: false
    }
  },
  {
    id: 'pediatric-dosing',
    title: 'Pediatric Ear Infection (Weight-Based Dosage)',
    tag: 'Pediatric Care',
    description: 'Liquid antibiotic suspension and fever drop directions for a child',
    text: `Pediatric Clinic - Dr. Emily Ross, MD
Patient: Leo Vance (Age 4 years, Weight: 16 kg)

Rx:
1. Amoxicillin Oral Suspension (250mg / 5ml) - 7.5 ml PO TID x 10 days
2. Ibuprofen Pediatric Suspension (100mg / 5ml) - 7.5 ml PO PRN q6h for earache/fever > 38.5C (Give with food/milk)
3. Saline Nasal Drops - 2 drops in each nostril TID PRN

Warning: Shake suspension well before each dose. Keep refrigerated.`,
    patientNotes: {
      age: '4 years (16 kg)',
      allergies: 'None',
      conditions: 'Acute Otitis Media',
      isPregnantOrNursing: false
    }
  }
];
