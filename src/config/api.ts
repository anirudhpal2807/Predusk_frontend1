// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  // In development, use empty string (works with Vite proxy)
  // In production, use full URL from environment variable
  BASE_URL: import.meta.env.DEV 
    ? '' 
    : (import.meta.env.VITE_API_URL || 'https://predusk-backend1.vercel.app'),
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      VERIFY: '/api/auth/verify'
    },
    PROFILE: {
      GET: '/api/profile',
      UPDATE: '/api/profile',
      WORK: '/api/profile/work',
      SKILLS: '/api/profile/skills',
      PROJECTS: '/api/profile/projects',
      LINKS: '/api/profile/links'
    },
    PROJECTS: {
      GET_ALL: '/api/projects',
      GET_BY_ID: '/api/projects/:id',
      CREATE: '/api/projects',
      UPDATE: '/api/projects/:id',
      DELETE: '/api/projects/:id'
    },
    SKILLS: {
      GET_ALL: '/api/skills',
      GET_BY_ID: '/api/skills/:id',
      CREATE: '/api/skills',
      UPDATE: '/api/skills/:id',
      DELETE: '/api/skills/:id'
    },
    SEARCH: {
      SEARCH: '/api/search',
      SUGGESTIONS: '/api/search/suggestions'
    }
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    TIMEOUT: 10000,
    HEADERS: {
      'Content-Type': 'application/json'
    }
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get endpoint with parameters
export const getEndpoint = (baseEndpoint: string, params: Record<string, string> = {}): string => {
  let endpoint = baseEndpoint;
  
  Object.keys(params).forEach(key => {
    endpoint = endpoint.replace(`:${key}`, params[key]);
  });
  
  return endpoint;
};
