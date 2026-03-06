const BASE_URL = "http://localhost:3000/api/v1";

export const endpoints = {
  logs: {
    base: `${BASE_URL}/logs`,
    getAll: () => `${BASE_URL}/logs`,
    getById: (id: number | string) => `${BASE_URL}/logs/${id}`,
    create: () => `${BASE_URL}/logs`,
    update: (id: number | string) => `${BASE_URL}/logs/${id}`,
    delete: (id: number | string) => `${BASE_URL}/logs/${id}`,
  },
  vocabulary: {
    base: `${BASE_URL}/vocabulary`,
    getAll: () => `${BASE_URL}/vocabulary`,
    getById: (id: number | string) => `${BASE_URL}/vocabulary/${id}`,
    create: () => `${BASE_URL}/vocabulary`,
    update: (id: number | string) => `${BASE_URL}/vocabulary/${id}`,
    delete: (id: number | string) => `${BASE_URL}/vocabulary/${id}`,
  },
  mistakes: {
    base: `${BASE_URL}/mistakes`,
    getAll: () => `${BASE_URL}/mistakes`,
    getById: (id: number | string) => `${BASE_URL}/mistakes/${id}`,
    create: () => `${BASE_URL}/mistakes`,
    update: (id: number | string) => `${BASE_URL}/mistakes/${id}`,
    delete: (id: number | string) => `${BASE_URL}/mistakes/${id}`,
  },
  recommendations: {
    base: `${BASE_URL}/recommendations`,
    getAll: () => `${BASE_URL}/recommendations`,
    getById: (id: number | string) => `${BASE_URL}/recommendations/${id}`,
    create: () => `${BASE_URL}/recommendations`,
    update: (id: number | string) => `${BASE_URL}/recommendations/${id}`,
    delete: (id: number | string) => `${BASE_URL}/recommendations/${id}`,
  },
};

export const buildUrl = (base: string, params?: Record<string, string | number>): string => {
  if (!params) return base;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
};

export default BASE_URL;
