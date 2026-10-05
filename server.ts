import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const isRealApiKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10;

let ai: GoogleGenAI | null = null;
if (isRealApiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Built-in intelligent sample fallback generator when Gemini API key is missing or offline
function generateFallbackInterpretation(prescriptionText: string, hadImage: boolean = false) {
  const lower = prescriptionText.toLowerCase();
  
  const isHeartBlood = lower.includes('warfarin') || lower.includes('aspirin') || lower.includes('atorvastatin') || lower.includes('lisinopril');
  const isAntibiotic = hadImage || lower.includes('amox') || lower.includes('augmentin') || lower.includes('cipro') || lower.includes('azithromycin');
  const isDiabetes = lower.includes('metformin') || lower.includes('glipizide') || lower.includes('insulin');
  const hasHighParacetamol = lower.includes('paracetamol 1000mg qds') || lower.includes('paracetamol 1000mg qid') || lower.includes('acetaminophen 1000mg qid') || lower.includes('5000mg') || lower.includes('6000mg');
  const hasWarfarinAspirin = (lower.includes('warfarin') && lower.includes('aspirin')) || (lower.includes('warfarin') && lower.includes('ibuprofen'));

  const medications = [];
  const drugInteractions = [];
  const medicationErrorAlerts = [];

  const transcribed = hadImage && (!prescriptionText || prescriptionText === 'General Prescription')
    ? `Dr. S. Sharma, MD (Internal Medicine)\nRx:\n1. Tab Augmentin 625mg (Amox-Clav) - 1 tab PO TID pc x 7d\n2. Tab Paracetamol 650mg - 1 tab PO PRN q6h for fever\n3. Cap Omeprazole 20mg - 1 cap PO OD ac (before breakfast)`
    : (prescriptionText || 'General Prescription');

  if (isAntibiotic || (!isHeartBlood && !isDiabetes)) {
    medications.push({
      id: 'med-1',
      name: 'Augmentin (Amoxicillin + Clavulanic Acid) 625mg',
      genericName: 'Amoxicillin / Potassium Clavulanate',
      dosage: '625 mg (500mg Amoxicillin + 125mg Clavulanate)',
      form: 'Oral Tablet',
      frequency: '3 times daily (every 8 hours)',
      doctorShorthandDecoded: '1 tab PO TID pc x 7d = Take 1 tablet by mouth three times daily after meals for 7 days',
      timeOfAdministration: {
        recommendedTimes: ['08:00 AM (Breakfast)', '02:00 PM (Lunch)', '08:00 PM (Dinner)'],
        foodInstruction: 'Take at the start of or immediately after a meal to reduce stomach irritation and enhance absorption.',
        specialTimingNote: 'Keep doses evenly spaced 8 hours apart so antibiotic blood levels remain constant.'
      },
      duration: '7 full days (complete entire course even if symptoms resolve)',
      purpose: 'Broad-spectrum antibiotic to kill bacterial infection and prevent antibiotic resistance.',
      precautions: [
        'Complete the full 7-day course even if fever or pain subsides.',
        'Drink plenty of fluids throughout the day.',
        'Use backup contraception if taking oral birth control pills as antibiotics may reduce pill efficacy.'
      ],
      commonSideEffects: ['Mild nausea or stomach rumble', 'Soft stools / mild diarrhea', 'Fungal yeast overgrowth'],
      missedDoseAdvice: 'Take the missed dose as soon as remembered. If it is almost time for the next scheduled dose, skip it. Never take two tablets at once.'
    });
  }

  if (isHeartBlood || lower.includes('warfarin')) {
    medications.push({
      id: 'med-2',
      name: 'Warfarin Sodium 5mg',
      genericName: 'Warfarin Sodium',
      dosage: '5 mg',
      form: 'Oral Tablet',
      frequency: 'Once daily at bedtime',
      doctorShorthandDecoded: '5mg PO QHS / OD = Take 5 milligrams by mouth once daily at bedtime',
      timeOfAdministration: {
        recommendedTimes: ['06:00 PM (Consistent Evening Time)'],
        foodInstruction: 'Can be taken with or without food. Maintain consistent dietary intake of vitamin K (spinach, kale, green leafy veggies).',
        specialTimingNote: 'Take at the exact same hour every evening to ensure smooth anticoagulant effect.'
      },
      duration: 'Ongoing as monitored by INR blood tests',
      purpose: 'Blood thinner (anticoagulant) to prevent harmful blood clots, deep vein thrombosis, or stroke.',
      precautions: [
        'Requires regular PT/INR blood testing as ordered by your doctor.',
        'Avoid sudden major changes in consumption of green leafy vegetables high in Vitamin K.',
        'Avoid contact sports and handle sharp objects with extra care.'
      ],
      commonSideEffects: ['Easy bruising', 'Bleeding gums when brushing', 'Slightly longer nosebleeds'],
      missedDoseAdvice: 'Take the missed dose as soon as you remember on that same day. If remembered the next morning, skip and take usual evening dose. Never take a double dose.'
    });
  }

  if (isHeartBlood || lower.includes('aspirin')) {
    medications.push({
      id: 'med-3',
      name: 'Aspirin (Ecosprin / Bayer) 75mg',
      genericName: 'Acetylsalicylic Acid (Low-Dose)',
      dosage: '75 mg to 100 mg',
      form: 'Enteric-Coated Tablet',
      frequency: 'Once daily after breakfast',
      doctorShorthandDecoded: '75mg PO OD pc = Take 75 milligrams by mouth once daily after morning meal',
      timeOfAdministration: {
        recommendedTimes: ['08:30 AM (After Breakfast)'],
        foodInstruction: 'Always take after food or with a glass of water to shield the stomach lining.',
        specialTimingNote: 'Do not crush enteric-coated tablets.'
      },
      duration: 'Long-term cardiovascular prevention under physician supervision',
      purpose: 'Antiplatelet agent to prevent sticky platelets from forming arterial clots in heart or brain.',
      precautions: [
        'Report any black/tarry stools or vomiting blood immediately.',
        'Inform any dentist or surgeon that you take daily aspirin.'
      ],
      commonSideEffects: ['Mild indigestion', 'Heartburn', 'Slightly prolonged bleeding from paper cuts'],
      missedDoseAdvice: 'Take with food when you remember. If it is already the following morning, skip the missed dose.'
    });
  }

  if (isDiabetes || lower.includes('metformin')) {
    medications.push({
      id: 'med-4',
      name: 'Metformin Hydrochloride 500mg',
      genericName: 'Metformin HCl',
      dosage: '500 mg',
      form: 'Oral Tablet',
      frequency: 'Twice daily with meals',
      doctorShorthandDecoded: '500mg PO BD cc = Take 500mg by mouth twice daily with meals',
      timeOfAdministration: {
        recommendedTimes: ['08:00 AM (Breakfast)', '07:30 PM (Dinner)'],
        foodInstruction: 'Take strictly with the main meal to avoid stomach cramps and nausea.',
        specialTimingNote: 'Do not crush extended-release (XR) formulations.'
      },
      duration: 'Ongoing chronic management',
      purpose: 'Controls blood glucose levels by decreasing liver glucose production and increasing insulin sensitivity.',
      precautions: [
        'Avoid heavy alcohol consumption as it elevates risk of rare lactic acidosis.',
        'Stay well hydrated.'
      ],
      commonSideEffects: ['Metallic taste in mouth', 'Stomach bloating or loose stools initially'],
      missedDoseAdvice: 'Take with food when remembered. Never take two doses together.'
    });
  }

  // Interventions & Alerts
  if (hasWarfarinAspirin) {
    drugInteractions.push({
      severity: 'critical',
      drugsInvolved: ['Warfarin', 'Aspirin'],
      riskTitle: 'High-Risk Synergistic Bleeding & Hemorrhage Alert',
      description: 'Concurrent use of Warfarin (an anticoagulant) and Aspirin (an antiplatelet agent) significantly compounds the risk of major internal gastrointestinal bleeding and intracranial hemorrhage. Unless prescribed under strict specialist protocol (e.g. mechanical heart valve), combining these requires immediate review.',
      actionToTake: 'Hold medication and contact your prescribing physician or cardiologist immediately to confirm if dual antithrombotic therapy is intended and verify dosage.'
    });

    medicationErrorAlerts.push({
      type: 'conflicting_combination',
      severity: 'critical',
      medicationName: 'Warfarin + Aspirin',
      issue: 'Co-prescription of two potent blood-thinning agents without explicit gastro-protective agent (e.g., PPI) or specified indication.',
      explanation: 'Both medications prevent clot formation via different pathways. Taking both without strict monitoring greatly elevates fatal bleeding risk.',
      recommendedAction: 'Immediate pharmacist/physician consultation recommended before taking together.'
    });
  }

  if (hasHighParacetamol) {
    medicationErrorAlerts.push({
      type: 'dosage_overdose',
      severity: 'critical',
      medicationName: 'Paracetamol / Acetaminophen',
      issue: 'Prescription instruction risks exceeding 4000mg (4 grams) daily ceiling for adults.',
      explanation: 'Consuming over 4,000 mg of Paracetamol in 24 hours causes severe hepatotoxicity (acute liver necrosis) which can be life-threatening.',
      recommendedAction: 'Limit daily intake to a maximum of 3000-4000mg. Space doses at least 4 to 6 hours apart and never combine with OTC cold/flu syrups that also contain Paracetamol.'
    });
  }

  return {
    summary: 'Prescription translated into simplified, patient-safe administration guidelines with decoded Latin abbreviations and timing schedules.',
    rawTranscribedText: transcribed,
    confidenceScore: 'high',
    unclearOrIllegibleParts: [],
    medications,
    drugInteractions,
    medicationErrorAlerts,
    reminders: {
      schedule: [
        {
          timeLabel: '08:00 AM - Morning',
          medications: medications.filter(m => m.timeOfAdministration.recommendedTimes.some(t => t.includes('08:00') || t.includes('Morning'))).map(m => ({
            name: m.name,
            dose: m.dosage,
            instructions: m.timeOfAdministration.foodInstruction
          })),
          suggestedReminderText: '⏰ 8:00 AM Morning Medicine: Take with breakfast as scheduled. Have a glass of water.'
        },
        {
          timeLabel: '02:00 PM - Afternoon',
          medications: medications.filter(m => m.timeOfAdministration.recommendedTimes.some(t => t.includes('02:00') || t.includes('Lunch'))).map(m => ({
            name: m.name,
            dose: m.dosage,
            instructions: m.timeOfAdministration.foodInstruction
          })),
          suggestedReminderText: '⏰ 2:00 PM Afternoon Medicine: Take right after lunch. Do not skip.'
        },
        {
          timeLabel: '08:00 PM - Evening / Night',
          medications: medications.filter(m => m.timeOfAdministration.recommendedTimes.some(t => t.includes('06:00') || t.includes('07:30') || t.includes('08:00') || t.includes('Evening') || t.includes('Night'))).map(m => ({
            name: m.name,
            dose: m.dosage,
            instructions: m.timeOfAdministration.foodInstruction
          })),
          suggestedReminderText: '⏰ 8:00 PM Evening Medicine: Take with dinner or before bed. Check off on your tracker.'
        }
      ].filter(s => s.medications.length > 0),
      patientFriendlySummary: 'Stay consistent with your doses. Set phone alarms for 8:00 AM and 8:00 PM. Always take after meals where noted.',
      quickCopyMessages: {
        smsStyle: `Medication Reminder for Today:\n` + medications.map(m => `• ${m.name} (${m.frequency}) - ${m.timeOfAdministration.foodInstruction}`).join('\n'),
        whatsappCaregiver: `Hello! Here is today's medication plan:\n` + medications.map(m => `💊 *${m.name}*: Take at ${m.timeOfAdministration.recommendedTimes.join(', ')}. ${m.timeOfAdministration.foodInstruction}`).join('\n\n') + `\n⚠️ *Precautions*: Always keep water handy and do not take extra pills if missed.`,
        dailyChecklist: `📋 DAILY MEDICATION CHECKLIST\n` + medications.map(m => `[ ] ${m.name} - ${m.dosage} [${m.timeOfAdministration.recommendedTimes.join(' | ')}]`).join('\n')
      }
    },
    generalSafetyPrecautions: [
      'Store all medications in a cool, dry place away from direct sunlight and out of reach of children.',
      'Never share prescription drugs with others even if they report identical symptoms.',
      'Check expiry dates on all blister packs or bottles before administration.',
      'Avoid drinking alcoholic beverages while on antibiotic or blood-thinning therapies.'
    ],
    whenToContactDoctorImmediately: [
      'Sudden severe allergic reaction: swelling of lips, tongue, face, or difficulty breathing.',
      'Severe unexpected skin rash, blistering, or hives.',
      'Signs of severe internal bleeding: black tarry stools, coffee-ground vomit, or unexplained severe bruising.',
      'Persistent severe diarrhea or vomiting that prevents keeping medicine down.'
    ]
  };
}

const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];

// API endpoint to interpret doctor prescription
app.post('/api/interpret-prescription', async (req, res) => {
  try {
    const { prescriptionText, imageBase64, imageMimeType, patientProfile, preferredLanguage } = req.body;

    if (!prescriptionText && !imageBase64) {
      return res.status(400).json({ error: 'Please provide either prescription text or an image of the prescription.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'AI service unavailable',
        message: 'The AI service is not initialized. Please ensure the API key is configured.',
      });
    }

    const targetLang = preferredLanguage || 'English';

    const systemPrompt = `You are a world-class Clinical Pharmacologist, Patient Safety Expert, and Medical Prescription Interpreter.

CRITICAL MANDATE - STRICT FIDELITY TO USER'S ACTUAL PRESCRIPTION:
- You must ONLY interpret the EXACT medications, dosages, and instructions present in the user's provided prescription text or attached prescription image.
- NEVER hallucinate, invent, or substitute placeholder or sample medications (such as Augmentin, Paracetamol, Warfarin, or Metformin) unless they are ACTUALLY written in the user's input.
- If the user provides a prescription with only 1 drug, output ONLY that 1 drug in the 'medications' array.
- If the user provides a prescription with 5 drugs, output exactly those 5 drugs.
- Transcribe the exact raw text or handwriting lines deciphered into 'rawTranscribedText'.
- If any handwriting or text is illegible or uncertain, DO NOT guess a random drug name. List it explicitly in 'unclearOrIllegibleParts' and recommend that the patient consult the dispensing pharmacist.

RESPONSIBILITIES:
1. Decode each medication from the user's prescription:
   - Identify active ingredient (genericName) and brand name.
   - Decode shorthand (e.g. TID pc, BID ac, OD HS, SOS q6h).
   - Provide recommended clock hours (e.g. 8:00 AM, 8:00 PM) and food instruction (after meal, before meal, with water).
   - Plain English purpose and what to do if a dose is missed.
2. Safety Sentinel & Medication Errors:
   - Flag excessive dosages, duplicate therapies, or dangerous combinations.
3. Interactions:
   - Flag conflicting drug-drug or drug-food/alcohol interactions between the prescribed drugs.
4. Reminder Messages:
   - Generate simple daily reminder copy in ${targetLang}.

Ensure output is strictly valid JSON matching the specified schema.`;

    let promptText = `Analyze this exact prescription provided by the patient/doctor:
PATIENT PROFILE (if provided):
- Age/Sex: ${patientProfile?.age || 'Not specified'}
- Allergies: ${patientProfile?.allergies || 'None declared'}
- Existing conditions: ${patientProfile?.conditions || 'None declared'}
- Pregnant or breastfeeding: ${patientProfile?.isPregnantOrNursing ? 'YES' : 'NO / Unknown'}

PRESCRIPTION INPUT:
${prescriptionText ? `Prescription Text:\n"""\n${prescriptionText}\n"""` : '(Handwritten prescription image attached)'}

Please carefully decipher and interpret ONLY what is written in this prescription. Transcribe the raw text into 'rawTranscribedText', identify the exact medications, decode timing and food rules, check for interactions, and generate reminder messages.`;

    const parts: any[] = [];
    if (imageBase64) {
      let rawBase64 = '';
      let detectedMime = (imageMimeType || 'image/jpeg').toLowerCase();

      if (imageBase64.includes(';base64,')) {
        const split = imageBase64.split(';base64,');
        rawBase64 = split[1].trim().replace(/\s/g, '');
        const match = split[0].match(/data:([^;]+)/);
        if (match && match[1]) {
          detectedMime = match[1].toLowerCase();
        }
      } else if (imageBase64.includes('base64,')) {
        const split = imageBase64.split('base64,');
        rawBase64 = split[1].trim().replace(/\s/g, '');
      } else if (imageBase64.startsWith('data:')) {
        const commaIdx = imageBase64.indexOf(',');
        const meta = imageBase64.slice(0, commaIdx);
        const dataPart = imageBase64.slice(commaIdx + 1);
        const match = meta.match(/data:([^;]+)/);
        if (match && match[1]) {
          detectedMime = match[1].toLowerCase();
        }
        try {
          const decoded = decodeURIComponent(dataPart);
          rawBase64 = Buffer.from(decoded).toString('base64');
        } catch {
          rawBase64 = Buffer.from(dataPart).toString('base64');
        }
      } else {
        rawBase64 = imageBase64.trim().replace(/\s/g, '');
      }

      // Check if the input is SVG (XML-based)
      if (detectedMime.includes('svg') || imageBase64.includes('<svg') || imageBase64.includes('%3Csvg')) {
        let svgString = '';
        try {
          if (imageBase64.includes('%3C') || imageBase64.includes('%20')) {
            svgString = decodeURIComponent(imageBase64);
          } else if (rawBase64) {
            svgString = Buffer.from(rawBase64, 'base64').toString('utf8');
          } else {
            svgString = imageBase64;
          }
        } catch {
          svgString = imageBase64;
        }

        const textMatches = svgString.match(/<text[^>]*>([\s\S]*?)<\/text>/gi);
        let extractedFromSvg = '';
        if (textMatches) {
          extractedFromSvg = textMatches
            .map((t) => t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
            .filter(Boolean)
            .join('\n');
        }

        promptText += `\n\nPrescription Content from Document:\n"""\n${extractedFromSvg || svgString.slice(0, 1500)}\n"""`;
      } else {
        // Supported raster image for Gemini Vision
        let standardMime = 'image/jpeg';
        if (detectedMime.includes('png')) standardMime = 'image/png';
        else if (detectedMime.includes('webp')) standardMime = 'image/webp';
        else if (detectedMime.includes('gif')) standardMime = 'image/gif';

        if (rawBase64 && rawBase64.length > 20) {
          parts.push({
            inlineData: {
              mimeType: standardMime,
              data: rawBase64,
            },
          });
        }
      }
    }
    parts.push({ text: promptText });

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: 'Clear, patient-friendly summary of what this prescription is for.',
        },
        rawTranscribedText: {
          type: Type.STRING,
          description: 'Line-by-line verbatim transcription of the text read from the doctor prescription or image.',
        },
        confidenceScore: {
          type: Type.STRING,
          enum: ['high', 'moderate', 'low'],
          description: 'Confidence in reading and interpreting the prescription.',
        },
        unclearOrIllegibleParts: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Any doctor handwriting or shorthand that appears ambiguous or requires doctor verification.',
        },
        medications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING, description: 'Brand and full drug name' },
              genericName: { type: Type.STRING, description: 'Active pharmaceutical ingredient' },
              dosage: { type: Type.STRING, description: 'Strength, e.g. 500mg, 10ml' },
              form: { type: Type.STRING, description: 'Tablet, Capsule, Liquid syrup, Inhaler, Drops, etc.' },
              frequency: { type: Type.STRING, description: 'How often in simple terms, e.g. 2 times a day' },
              doctorShorthandDecoded: { type: Type.STRING, description: 'Doctor Latin/medical abbreviation deciphered' },
              timeOfAdministration: {
                type: Type.OBJECT,
                properties: {
                  recommendedTimes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Specific clock times e.g. 8:00 AM, 8:00 PM',
                  },
                  foodInstruction: { type: Type.STRING, description: 'Take after meals, empty stomach, with food, etc.' },
                  specialTimingNote: { type: Type.STRING, description: 'e.g. Space 8 hours apart, take at bedtime' },
                },
                required: ['recommendedTimes', 'foodInstruction'],
              },
              duration: { type: Type.STRING, description: 'How many days or months to take' },
              purpose: { type: Type.STRING, description: 'What this medicine treats in plain terms' },
              precautions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Important dos and don’ts for this drug',
              },
              commonSideEffects: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Mild expected effects',
              },
              missedDoseAdvice: { type: Type.STRING, description: 'What to do if a dose is skipped or forgotten' },
            },
            required: ['id', 'name', 'genericName', 'dosage', 'form', 'frequency', 'doctorShorthandDecoded', 'timeOfAdministration', 'duration', 'purpose', 'precautions'],
          },
        },
        drugInteractions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ['critical', 'high', 'moderate', 'minor'] },
              drugsInvolved: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskTitle: { type: Type.STRING },
              description: { type: Type.STRING, description: 'Simple explanation of what could happen' },
              actionToTake: { type: Type.STRING, description: 'Action for patient and doctor conversation' },
            },
            required: ['severity', 'drugsInvolved', 'riskTitle', 'description', 'actionToTake'],
          },
        },
        medicationErrorAlerts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                enum: ['dosage_overdose', 'duplicate_therapy', 'conflicting_combination', 'contraindication', 'missing_instruction', 'ambiguous_abbreviation'],
              },
              severity: { type: Type.STRING, enum: ['critical', 'warning', 'caution'] },
              medicationName: { type: Type.STRING },
              issue: { type: Type.STRING },
              explanation: { type: Type.STRING },
              recommendedAction: { type: Type.STRING },
            },
            required: ['type', 'severity', 'medicationName', 'issue', 'explanation', 'recommendedAction'],
          },
        },
        reminders: {
          type: Type.OBJECT,
          properties: {
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeLabel: { type: Type.STRING },
                  medications: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        dose: { type: Type.STRING },
                        instructions: { type: Type.STRING },
                      },
                      required: ['name', 'dose', 'instructions'],
                    },
                  },
                  suggestedReminderText: { type: Type.STRING },
                },
                required: ['timeLabel', 'medications', 'suggestedReminderText'],
              },
            },
            patientFriendlySummary: { type: Type.STRING },
            quickCopyMessages: {
              type: Type.OBJECT,
              properties: {
                smsStyle: { type: Type.STRING },
                whatsappCaregiver: { type: Type.STRING },
                dailyChecklist: { type: Type.STRING },
              },
              required: ['smsStyle', 'whatsappCaregiver', 'dailyChecklist'],
            },
          },
          required: ['schedule', 'patientFriendlySummary', 'quickCopyMessages'],
        },
        generalSafetyPrecautions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        whenToContactDoctorImmediately: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        'summary',
        'confidenceScore',
        'medications',
        'drugInteractions',
        'medicationErrorAlerts',
        'reminders',
        'generalSafetyPrecautions',
        'whenToContactDoctorImmediately',
      ],
    };

    // Try candidate models in order to avoid transient 503 high-demand errors
    let lastError: any = null;
    let parsed: any = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`Calling Gemini with model: ${modelName}`);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on model ${modelName} (35s)`)), 35000)
        );

        const response: any = await Promise.race([
          ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema,
            },
          }),
          timeoutPromise,
        ]);

        if (response && response.text) {
          parsed = JSON.parse(response.text.trim());
          console.log(`Successfully generated interpretation with model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} encountered issue:`, err.message || err);
        lastError = err;
        // Continue to next candidate model
      }
    }

    if (!parsed) {
      throw lastError || new Error('All candidate models failed to respond.');
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/interpret-prescription:', error);
    return res.status(500).json({
      error: 'Interpretation failed',
      message: error?.message || 'Could not interpret prescription. Please try again or rephrase the text.',
    });
  }
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`RxTranslate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
