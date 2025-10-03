export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  models: `${API_BASE_URL}/api/models`,
  voices: (modelId: string) => `${API_BASE_URL}/api/models/${modelId}/voices`,
  settings: (modelId: string) => `${API_BASE_URL}/api/models/${modelId}/settings`,
  generate: `${API_BASE_URL}/api/generate`,
  extract: `${API_BASE_URL}/api/extract`,
  audio: (filename: string) => `${API_BASE_URL}/api/audio/${filename}`,
  health: `${API_BASE_URL}/health`,
};

