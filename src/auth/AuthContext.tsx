import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type User = {
  email: string;
  name?: string;
};

export type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("google_token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (newToken: string) => {
    localStorage.setItem("google_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("google_token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        if (Date.now() > exp) {
          logout();
        } else {
          setUser({
            email: payload.email,
            name: payload.name || `${payload.given_name ?? ""} ${payload.family_name ?? ""}`.trim()
          });
        }
      } catch (err) {
        console.error("Invalid token format:", err);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};5

