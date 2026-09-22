// Sample data for the MedSimplify interface phase.
// Replace with real backend data when the backend is switched on.

export const patient = {
  name: "Rajesh Kumar",
  firstName: "Rajesh",
  email: "rajesh@email.com",
  phone: "+91-9876543210",
  age: "38M",
  bloodGroup: "B+",
  allergies: "None known",
  emergencyContact: "Wife: +91-9876543210",
};

export type ReportType = "Lab" | "X-ray" | "Rx" | "Discharge";

export interface ReportItem {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  month: string;
  time: string;
  keyFinding: string;
  abnormal?: string;
}

export const reports: ReportItem[] = [
  {
    id: "r1",
    title: "CBC with Platelets",
    type: "Lab",
    date: "14-Sep-2026",
    month: "September 2026",
    time: "11:00 AM",
    keyFinding: "Dengue NS1: Positive",
    abnormal: "Platelets: 80,000 (Low)",
  },
  {
    id: "r2",
    title: "CBC with Platelets",
    type: "Lab",
    date: "13-Sep-2026",
    month: "September 2026",
    time: "10:30 AM",
    keyFinding: "Platelets: 120,000 (Normal)",
  },
  {
    id: "r3",
    title: "Chest X-ray",
    type: "X-ray",
    date: "02-Sep-2026",
    month: "September 2026",
    time: "04:15 PM",
    keyFinding: "No active lung disease",
  },
  {
    id: "r4",
    title: "Fever Prescription",
    type: "Rx",
    date: "28-Aug-2026",
    month: "August 2026",
    time: "06:00 PM",
    keyFinding: "Paracetamol, ORS, rest advised",
  },
  {
    id: "r5",
    title: "Discharge Summary",
    type: "Discharge",
    date: "12-Aug-2026",
    month: "August 2026",
    time: "01:20 PM",
    keyFinding: "Viral fever, recovered",
  },
];

export const analysisSteps = [
  "Extracting text from image...",
  "Analyzing medical content...",
  "Simplifying medical terms...",
  "Generating your summary...",
];

export const importantFindings = [
  {
    title: "Dengue Test: POSITIVE",
    lines: ["You have DENGUE FEVER"],
    tone: "danger" as const,
  },
  {
    title: "Platelets: 80,000 (LOW)",
    lines: ["Normal: 150,000 - 450,000", "Risk: Bleeding if it drops further"],
    tone: "warning" as const,
  },
  {
    title: "Haemoglobin: 13.8 g/dL",
    lines: ["This is in the normal range"],
    tone: "good" as const,
  },
];

export const whatToDo = [
  "Drink 3-4 litres of fluids every day (water, ORS, coconut water)",
  "Take complete bed rest until the fever settles",
  "Take Paracetamol for fever — never take Aspirin or Ibuprofen",
  "Repeat the platelet test after 24 hours",
  "Eat light, home-cooked food in small portions",
];

export const warningSigns = [
  "Bleeding from nose or gums",
  "Black or bloody stools, or vomiting blood",
  "Severe stomach pain or continuous vomiting",
  "Cold, clammy skin or feeling faint",
  "Very little urine for 6 hours or more",
];

export const fullReportRows = [
  { test: "Haemoglobin", value: "13.8 g/dL", range: "13.0 - 17.0", flag: "Normal" },
  { test: "Platelet Count", value: "80,000 /µL", range: "150,000 - 450,000", flag: "Low" },
  { test: "WBC Count", value: "3,200 /µL", range: "4,000 - 11,000", flag: "Low" },
  { test: "Haematocrit", value: "46%", range: "40 - 50", flag: "Normal" },
  { test: "Dengue NS1 Antigen", value: "Positive", range: "Negative", flag: "High" },
];

export const plateletTrend = [
  { date: "11-Sep", value: 210000 },
  { date: "12-Sep", value: 165000 },
  { date: "13-Sep", value: 120000 },
  { date: "14-Sep", value: 80000 },
];

export const comparisonRows = [
  { test: "Platelets", a: "120,000", b: "80,000", change: -33, direction: "down" as const },
  { test: "WBC", a: "3,800", b: "3,200", change: -16, direction: "down" as const },
  { test: "Haemoglobin", a: "13.5", b: "13.8", change: 2, direction: "up" as const },
  { test: "Haematocrit", a: "44%", b: "46%", change: 5, direction: "up" as const },
];

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  dayOf: number;
  totalDays: number;
  next: string;
  active: boolean;
  completed?: boolean;
  purpose: string;
}

export const medicines: Medicine[] = [
  {
    id: "m1",
    name: "Paracetamol 500mg",
    dosage: "1 tablet every 6 hours",
    timing: "After food",
    dayOf: 3,
    totalDays: 5,
    next: "Today, 2:00 PM",
    active: true,
    purpose: "For fever and body pain",
  },
  {
    id: "m2",
    name: "ORS Sachet",
    dosage: "1 sachet in 1 litre water",
    timing: "Sip through the day",
    dayOf: 3,
    totalDays: 7,
    next: "Today, 4:00 PM",
    active: true,
    purpose: "To prevent dehydration",
  },
  {
    id: "m3",
    name: "Pantoprazole 40mg",
    dosage: "1 tablet daily",
    timing: "Empty stomach",
    dayOf: 5,
    totalDays: 5,
    next: "Course finished",
    active: false,
    completed: true,
    purpose: "To protect the stomach",
  },
];

export const feverTrend = [
  { date: "08-Sep", temp: 103.4, pain: 4, energy: 1 },
  { date: "09-Sep", temp: 103.0, pain: 4, energy: 1 },
  { date: "10-Sep", temp: 102.6, pain: 3, energy: 2 },
  { date: "11-Sep", temp: 102.0, pain: 3, energy: 2 },
  { date: "12-Sep", temp: 101.6, pain: 2, energy: 3 },
  { date: "13-Sep", temp: 101.2, pain: 2, energy: 3 },
  { date: "14-Sep", temp: 100.4, pain: 1, energy: 4 },
];

export const appointments = {
  upcoming: [
    {
      id: "a1",
      doctor: "Dr. Priya Sharma",
      specialty: "General Medicine",
      when: "Tomorrow, 10:00 AM",
      location: "City Hospital, Room 205",
      type: "Follow-up (Dengue recovery)",
      prep: "Bring all lab reports",
    },
  ],
  past: [
    { id: "a2", doctor: "Dr. Priya Sharma", when: "13-Sep-2026", note: "Started dengue treatment" },
    { id: "a3", doctor: "Dr. Anil Mehta", when: "28-Aug-2026", note: "Viral fever consultation" },
  ],
};

export const doctorChat = [
  { from: "doctor" as const, text: "Hello Rajesh, how is the fever today?", time: "9:02 AM" },
  { from: "patient" as const, text: "Still around 101°F in the evening.", time: "9:05 AM" },
  {
    from: "doctor" as const,
    text: "That is expected on day 3. Keep up the fluids and repeat the platelet test tomorrow morning.",
    time: "9:07 AM",
  },
];

export const chatSuggestions = [
  "My fever is still 101°F",
  "Should I continue medicines?",
  "When to repeat the test?",
];

export const assistantQuickQuestions = [
  "COVID-19 precautions",
  "What to eat in dengue?",
  "Fever management tips",
  "How to manage high BP?",
  "When to repeat test?",
];

export const assistantAnswer = `🥗 **Food that helps in dengue**

• Fluids first: water, ORS, coconut water, fresh lime — aim for 3-4 litres a day
• Papaya leaf juice and pomegranate are commonly advised locally; they are safe but not a replacement for fluids
• Light meals: khichdi, dal rice, curd, soups, boiled vegetables
• Protein: eggs, paneer, dal to help recovery
• Avoid: oily, spicy and outside food while the fever lasts

Sources: WHO dengue guidance, ICMR patient advisory.

⚠️ Follow your doctor's advice — this is general information only.`;

export const familyMembers = [
  { id: "f1", name: "Priya Kumar", relation: "Wife", age: "32F", reports: 3 },
  { id: "f2", name: "Rohan Kumar", relation: "Son", age: "8M", reports: 1 },
  { id: "f3", name: "Savitri Kumar", relation: "Mother", age: "64F", reports: 5 },
];

export const emergencyConditions = [
  {
    name: "Dengue warning signs",
    signs: ["Bleeding gums or nose", "Severe stomach pain", "Vomiting blood", "Cold clammy skin"],
  },
  {
    name: "Heart attack signs",
    signs: ["Chest pressure or pain", "Pain in left arm or jaw", "Cold sweat", "Breathlessness"],
  },
  {
    name: "Stroke signs",
    signs: ["Face drooping on one side", "Arm weakness", "Slurred speech", "Sudden confusion"],
  },
];

/* ---------- Doctor app ---------- */

export const doctor = { name: "Dr. Priya Sharma", specialty: "General Medicine" };

export const doctorStats = [
  { label: "Today's patients", value: "12" },
  { label: "Pending reports", value: "5" },
  { label: "Earnings", value: "₹8,500" },
];

export const doctorSchedule = [
  { time: "09:30 AM", patient: "Rajesh Kumar", reason: "Dengue follow-up" },
  { time: "10:00 AM", patient: "Meena Iyer", reason: "Diabetes review" },
  { time: "10:30 AM", patient: "Sunil Rao", reason: "Chest pain" },
  { time: "11:00 AM", patient: "Farah Khan", reason: "Antenatal check" },
];

export const doctorPatients = [
  { id: "p1", name: "Rajesh Kumar", age: "38M", lastVisit: "13-Sep-2026", condition: "Dengue fever" },
  { id: "p2", name: "Meena Iyer", age: "56F", lastVisit: "12-Sep-2026", condition: "Type 2 diabetes" },
  { id: "p3", name: "Sunil Rao", age: "61M", lastVisit: "10-Sep-2026", condition: "Hypertension" },
  { id: "p4", name: "Farah Khan", age: "29F", lastVisit: "08-Sep-2026", condition: "Pregnancy, 22 weeks" },
];

export const revenueByMonth = [
  { month: "Apr", revenue: 182000 },
  { month: "May", revenue: 205000 },
  { month: "Jun", revenue: 194000 },
  { month: "Jul", revenue: 231000 },
  { month: "Aug", revenue: 248000 },
  { month: "Sep", revenue: 176000 },
];

export const commonDiagnoses = [
  { name: "Viral fever", count: 84 },
  { name: "Dengue", count: 41 },
  { name: "Hypertension", count: 37 },
  { name: "Diabetes", count: 29 },
  { name: "Gastritis", count: 18 },
];
