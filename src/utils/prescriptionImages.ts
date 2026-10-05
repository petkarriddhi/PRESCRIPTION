/**
 * Utility to generate realistic doctor prescription pad images (as Data URLs)
 * with authentic cursive doctor handwriting styling, medical letterhead, Rx symbol, and doctor signature.
 * Renders directly to a JPEG Canvas Data URL (image/jpeg;base64,...) fully compatible with Gemini Vision.
 */

export function createHandwrittenPrescriptionImage(variant: 'infection' | 'cardiac' | 'pain'): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 650;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Paper Background with vintage prescription cream tint
  ctx.fillStyle = '#fbf9f4';
  ctx.fillRect(0, 0, 650, 680);

  // Pad Border
  ctx.strokeStyle = '#e2d8c3';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, 630, 660);

  // 2. Clinic Header Band (Dark Teal)
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(10, 10, 630, 100);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('ST. JUDE COMMUNITY MEDICAL CENTER', 35, 45);

  ctx.fillStyle = '#ccfbf1';
  ctx.font = '13px sans-serif';
  ctx.fillText('Dr. Jennifer Hayes, MD (Lic. #MD-84920) • Internal Medicine', 35, 70);

  ctx.fillStyle = '#99f6e4';
  ctx.font = '11px sans-serif';
  ctx.fillText('450 Medical Boulevard, Suite 300 • Emergency: (555) 019-2831', 35, 90);

  // Patient Info Bar
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 140);
  ctx.lineTo(620, 140);
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Patient: Jane Doe (Age: 38)', 35, 132);
  ctx.fillText('Date: 04-Oct-2026', 440, 132);

  // Large Rx Symbol
  ctx.fillStyle = '#0f766e';
  ctx.font = 'bold italic 36px serif';
  ctx.fillText('℞', 35, 185);

  // Handwritten lines (Blue fountain pen ink #1e3a8a, cursive look)
  ctx.fillStyle = '#1e3a8a';

  if (variant === 'infection') {
    ctx.font = 'italic bold 22px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('1. Tab. Augmentin 625mg (Amox-Clav)', 60, 225);
    ctx.font = 'italic 19px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('- 1 tab PO TID pc x 7 days', 90, 260);

    ctx.font = 'italic bold 22px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('2. Tab. Paracetamol 650mg', 60, 315);
    ctx.font = 'italic 19px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('- 1 tab SOS / PRN q6h for fever', 90, 350);

    ctx.font = 'italic bold 22px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('3. Cap. Omeprazole 20mg', 60, 405);
    ctx.font = 'italic 19px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('- 1 cap PO OD ac (30m before breakfast)', 90, 440);

    ctx.font = 'italic 17px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('Drink warm water. Rest for 3 days. Complete antibiotic course.', 60, 505);
  } else if (variant === 'cardiac') {
    ctx.font = 'italic bold 22px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('1. Tab. Warfarin 5mg - 1 OD HS (6:00 PM)', 60, 225);
    ctx.fillText('2. Tab. Aspirin 75mg - 1 OD pc (after breakfast)', 60, 280);
    ctx.fillText('3. Tab. Ibuprofen 400mg - 1 TID PRN for knee pain', 60, 335);
    ctx.fillText('4. Tab. Atorvastatin 20mg - 1 OD nocte', 60, 390);

    ctx.font = 'italic 17px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('* Check PT / INR in 14 days. Avoid high Vitamin K foods.', 60, 460);
  } else {
    ctx.font = 'italic bold 22px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('1. Tab. Metformin 500mg - 1 BD cc (with meals)', 60, 225);
    ctx.fillText('2. Tab. Glimepiride 1mg - 1 OD ac (15m before breakfast)', 60, 280);
    ctx.fillText('3. Tab. Telmisartan 40mg - 1 OD mane (morning)', 60, 335);
    ctx.fillText('4. Tab. Rosuvastatin 10mg - 1 OD HS (bedtime)', 60, 390);

    ctx.font = 'italic 17px "Caveat", "Brush Script MT", "Segoe Script", cursive, sans-serif';
    ctx.fillText('Follow diabetic diet. Low sodium. Fasting glucose log weekly.', 60, 460);
  }

  // Doctor signature line
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(380, 595);
  ctx.lineTo(590, 595);
  ctx.stroke();

  // Signature scribble
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(400, 590);
  ctx.bezierCurveTo(430, 540, 460, 615, 500, 565);
  ctx.bezierCurveTo(520, 545, 545, 595, 580, 580);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '11px sans-serif';
  ctx.fillText("Doctor's Signature & Stamp", 410, 615);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  ctx.fillText('Prescription valid for 30 days • Substitution permissible unless DAW marked', 40, 640);

  return canvas.toDataURL('image/jpeg', 0.92);
}
