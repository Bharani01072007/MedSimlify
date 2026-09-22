const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname) {
    return `http://${window.location.hostname}:8000/api`;
  }
  return "http://localhost:8000/api";
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Helper to make API requests with json or fallback
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const token = typeof localStorage !== "undefined" ? localStorage.getItem("medsimplify_token") : null;
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// 1. Report Endpoints
export async function uploadReportApi(formData: FormData): Promise<any> {
  return fetchApi("/reports/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getReportsApi(patientId: number = 1): Promise<any[]> {
  return fetchApi(`/reports/?patient_id=${patientId}`);
}

export async function getReportTrendsApi(ids: string = "1"): Promise<any> {
  return fetchApi(`/reports/compare/trends?ids=${ids}`);
}

// 2. Auth Endpoints
export async function loginApi(email: string, password: string): Promise<any> {
  return fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(userData: {
  email: string;
  password: string;
  full_name?: string;
  name?: string;
  user_type?: string;
  role?: string;
}): Promise<any> {
  return fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// 3. Medicine Endpoints
export async function getMedicinesApi(patientId: number = 1): Promise<any[]> {
  return fetchApi(`/medicines/?patient_id=${patientId}`);
}

export async function addMedicineApi(medData: {
  medicine_name: string;
  dosage: string;
  reminder_time: string;
  frequency?: string;
  timing?: string;
}, patientId: number = 1): Promise<any> {
  return fetchApi(`/medicines/?patient_id=${patientId}`, {
    method: "POST",
    body: JSON.stringify(medData),
  });
}

export async function logMedicineTakenApi(reminderId: number, status: string = "taken"): Promise<any> {
  return fetchApi(`/medicines/${reminderId}/log-taken?status=${status}`, {
    method: "POST",
  });
}

export async function getAdherenceApi(patientId: number = 1): Promise<any> {
  return fetchApi(`/medicines/adherence?patient_id=${patientId}`);
}

// 4. Appointment & Telemedicine Endpoints
export async function getAppointmentsApi(patientId: number = 1): Promise<any[]> {
  return fetchApi(`/appointments/?patient_id=${patientId}`);
}

export async function scheduleAppointmentApi(patientId: number = 1, doctorId: number = 1, reason: string = "General Consultation"): Promise<any> {
  return fetchApi(`/appointments/?doctor_id=${doctorId}&patient_id=${patientId}&reason=${encodeURIComponent(reason)}`, {
    method: "POST",
  });
}

export async function startTelemedInviteApi(patientName: string = "Rajesh Kumar"): Promise<any> {
  return fetchApi(`/appointments/telemed/invite?patient_name=${encodeURIComponent(patientName)}`, {
    method: "POST",
  });
}

// 5. Symptom Tracker Endpoints
export async function logSymptomApi(symptomData: {
  symptoms_list: string[];
  fever_temperature?: number | undefined;
  pain_level?: string | undefined;
  energy_level?: string | undefined;
  notes?: string | undefined;
}, patientId: number = 1): Promise<any> {
  return fetchApi(`/symptoms/?patient_id=${patientId}`, {
    method: "POST",
    body: JSON.stringify(symptomData),
  });
}

export async function getSymptomTrendsApi(patientId: number = 1): Promise<any> {
  return fetchApi(`/symptoms/trends?patient_id=${patientId}`);
}

// 6. AI Chat & Assistant Endpoints
export async function askAiAssistantApi(question: string, language: string = "en", reportIds?: number[]): Promise<any> {
  return fetchApi("/chat/ai/ask", {
    method: "POST",
    body: JSON.stringify({
      question,
      language,
      report_ids: reportIds && reportIds.length > 0 ? reportIds : undefined
    }),
  });
}


// 7. Prescription Endpoints
export async function createPrescriptionApi(rxData: {
  patient_id: number;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
    timing?: string;
    time?: string;
    [key: string]: any;
  }>;
  advice?: string;
  notes?: string;
  follow_up_date?: string;
  [key: string]: any;
}, doctorId: number = 1): Promise<any> {
  return fetchApi(`/prescriptions/?doctor_id=${doctorId}`, {
    method: "POST",
    body: JSON.stringify(rxData),
  });
}

// 8. Chat Messages (bidirectional)
export async function getChatMessagesApi(chatId: number = 1, sinceId: number = 0): Promise<any[]> {
  return fetchApi(`/chat/messages?chat_id=${chatId}&since_id=${sinceId}`);
}

export async function getAllChatMessagesApi(chatId: number = 1): Promise<any[]> {
  return fetchApi(`/chat/messages/all?chat_id=${chatId}`);
}

export async function sendChatMessageApi(
  message: string,
  sender: "patient" | "doctor" = "patient",
  senderName: string = "Rajesh Kumar",
  chatId: number = 1
): Promise<any> {
  return fetchApi(
    `/chat/messages?message=${encodeURIComponent(message)}&sender=${sender}&sender_name=${encodeURIComponent(senderName)}&chat_id=${chatId}`,
    { method: "POST" }
  );
}

export async function getDoctorChatThreadsApi(): Promise<any[]> {
  return fetchApi("/chat/threads");
}

// 9. Telemedicine / Video Call
export async function startVideoCallApi(doctorName: string = "Dr. Priya Sharma", patientName: string = "Rajesh Kumar"): Promise<any> {
  return fetchApi(
    `/chat/telemed/start?doctor_name=${encodeURIComponent(doctorName)}&patient_name=${encodeURIComponent(patientName)}`,
    { method: "POST" }
  );
}

export async function getActiveVideoSessionApi(): Promise<any> {
  return fetchApi("/chat/telemed/active");
}

export async function endVideoCallApi(): Promise<any> {
  return fetchApi("/chat/telemed/end", { method: "POST" });
}

// 10. Family Members Endpoints
export async function getFamilyMembersApi(patientId: number = 1): Promise<any[]> {
  return fetchApi(`/family/?patient_id=${patientId}`);
}

export async function addFamilyMemberApi(memberData: {
  name: string;
  relationship: string;
  age?: string;
  gender?: string;
  blood_group?: string;
}, patientId: number = 1): Promise<any> {
  return fetchApi(`/family/?patient_id=${patientId}`, {
    method: "POST",
    body: JSON.stringify(memberData),
  });
}

// 11. Profile Endpoints
export async function getPatientProfileApi(patientId: number = 1): Promise<any> {
  return fetchApi(`/auth/patient/profile?patient_id=${patientId}`);
}

export async function getDoctorProfileApi(doctorId: number = 1): Promise<any> {
  return fetchApi(`/auth/doctor/profile?doctor_id=${doctorId}`);
}

export async function getDoctorPatientsApi(): Promise<any[]> {
  return fetchApi("/auth/doctor/patients");
}

