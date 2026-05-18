import { create } from 'zustand';

// Define the shape of logged in user
interface AuthUser{
    id: string;
    email: string;
    role: 'admin' | 'customer';
}

//Define the shape of our global Auth Store
interface AuthStore{
    user: AuthUser | null;
    token: string | null;
    setAuth: (user: AuthUser, token: string) => void;
    logout: () => void;
}

//Helper functions to safely read from localStorage on initial load 
const getSavedToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

const getSavedUser = (): AuthUser | null => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    }
    return null;
}

// 3. Create the global store using Zustand

export const useAuthStore = create<AuthStore>((set) => ({
  // Set initial state from localStorage (keeps user logged in on page refresh)
  user: getSavedUser(),
  token: getSavedToken(),
  // Action to log in and save credentials
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token });
  },
  // Action to log out and clear credentials
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null });
    },
  
}));