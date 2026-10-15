import React, { createContext, useContext } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  allergyInfo?: string;
}

// Authentication is intentionally unavailable in the public showcase.
// Never restore demo identities or medical details from browser storage.
const guest = {
  user: null as UserProfile | null,
  isAuthenticated: false,
  signIn: async (_email: string, _password?: string) => false,
  signUp: async (_name: string, _email: string, _phone: string) => false,
  signOut: () => {},
  updateProfile: (_updated: Partial<UserProfile>) => {},
};
const AuthContext = createContext(guest);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={guest}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
