const AUTH_STORAGE_KEY = 'genai-auth';

export const saveAuth = (user, token) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
};

export const getStoredAuth = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return { user: null, token: '' };

  try {
    return JSON.parse(stored);
  } catch {
    return { user: null, token: '' };
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
