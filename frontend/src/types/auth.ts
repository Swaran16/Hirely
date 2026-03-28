// Types for Authentication

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
}

// Register form data
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface AuthResponse {
  status: "success" | "error";
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}