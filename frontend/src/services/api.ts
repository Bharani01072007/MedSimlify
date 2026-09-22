import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:8000/api`;
  }
  return 'http://localhost:8000/api';
};

const BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Auth
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),

  // Reports
  uploadReport: (formData: any) => apiClient.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getReports: (patientId: number = 1) => apiClient.get(`/reports/?patient_id=${patientId}`),
  getReportById: (id: number) => apiClient.get(`/reports/${id}`),
  getReportComparison: () => apiClient.get('/reports/compare/trends'),

  // Medicines
  getMedicines: (patientId: number = 1) => apiClient.get(`/medicines/?patient_id=${patientId}`),
  addMedicine: (data: any) => apiClient.post('/medicines/', data),
  logMedicineTaken: (reminderId: number) => apiClient.post(`/medicines/${reminderId}/log-taken`),

  // Symptoms
  logSymptom: (data: any) => apiClient.post('/symptoms/', data),
  getSymptomTrends: () => apiClient.get('/symptoms/trends'),

  // Prescriptions
  createPrescription: (data: any) => apiClient.post('/prescriptions/', data),
  getPrescriptions: (patientId: number = 1) => apiClient.get(`/prescriptions/?patient_id=${patientId}`),

  // Chat & AI Assistant
  askAIAssistant: (question: string, language: string = 'en') => apiClient.post('/chat/ai/ask', { question, language }),
  getChatMessages: () => apiClient.get('/chat/messages'),
  sendChatMessage: (messageText: string) => apiClient.post('/chat/messages', { message_text: messageText })
};
