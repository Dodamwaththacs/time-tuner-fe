import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { employeeAPI } from "../api/employee";

export type UserRole = "admin" | "manager" | "employee";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider?: "email" | "google"; // Track how user signed up
  organizationId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    organizationId: string
  ) => Promise<boolean>;
  googleSignIn: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user database - in a real app, this would be in your backend
const mockUsers: Array<User & { password?: string }> = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    provider: "email",
    password: "password",
  },
  {
    id: "2",
    email: "manager@example.com",
    name: "Manager User",
    role: "manager",
    provider: "email",
    password: "password",
  },
  {
    id: "3",
    email: "employee@example.com",
    name: "Employee User",
    role: "employee",
    provider: "email",
    password: "password",
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., token in localStorage)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
          // In a real app, you would validate the token with your backend
          const user = JSON.parse(userData);
          setUser(user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // API call to login endpoint
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Login failed:", errorData);
        return false;
      }

      const loginData = await response.json();
      console.log("Login successful:", loginData);

      // Map API response to user object
      const userData = {
        id: loginData.id,
        email: loginData.email,
        name: loginData.name,
        role: loginData.role.toLowerCase() as UserRole, // Convert "ADMIN" to "admin"
        organizationId: loginData.organizationId,
        employeeId: loginData.userId, // This will be null, which is fine
        departmentId: loginData.departmentId, // Add this field
        provider:
          loginData.provider === "keycloak"
            ? ("email" as const)
            : (loginData.provider as "email" | "google"),
      };

      setUser(userData);

      localStorage.setItem("authToken", loginData.token);
      localStorage.setItem("userData", JSON.stringify(userData));
      // Handle null userId gracefully
      if (loginData.userId) {
        localStorage.setItem("userId", loginData.userId);
      }
      localStorage.setItem("organizationId", loginData.organizationId);
      // Add departmentId if it exists
      if (loginData.departmentId) {
        localStorage.setItem("departmentId", loginData.departmentId);
      }
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    organizationId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // API call to create user endpoint
      const response = await fetch("http://localhost:8080/api/appUsers", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          displayName: fullName,
          userType: role.toUpperCase(), // Convert to uppercase (ADMIN, MANAGER, EMPLOYEE)
          status: true,
          organization: organizationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Signup failed:", errorData);
        return false;
      }
      // if signup is successful, navigate to login

      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock Google Sign-In
      // In a real app, you would use Google's OAuth library

      // Simulate Google OAuth flow delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock Google user data
      const googleUser = {
        id: "google-" + Date.now().toString(),
        email: "user@gmail.com",
        name: "Google User",
        role: "employee" as UserRole, // Default role for Google sign-ins
        provider: "google" as const,
      };

      // Check if user exists in our system
      let existingUser = mockUsers.find((u) => u.email === googleUser.email);

      if (!existingUser) {
        // Create new user from Google account
        const newUser = {
          ...googleUser,
          password: undefined, // Google users don't have passwords in our system
        };
        mockUsers.push(newUser);
        existingUser = newUser;
      }

      const userWithoutPassword = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        provider: existingUser.provider || "google",
      };

      setUser(userWithoutPassword);
      localStorage.setItem("authToken", "mock-jwt-token");
      localStorage.setItem("userData", JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error("Google sign-in failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  const value = {
    user,
    login,
    signup,
    googleSignIn,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
