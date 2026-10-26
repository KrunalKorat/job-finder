/**
 * Typed API Client for Job Finder FastAPI Backend
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  id: number;
  user_id: number;
  name?: string | null;
  professional_headline?: string | null;
  location?: string | null;
  portfolio_url?: string | null;
  linkedin_url?: string | null;
  profile_completion_status: "incomplete" | "in_progress" | "complete";
  created_at: string;
  updated_at: string;
}

export interface CareerPreference {
  id: number;
  user_id: number;
  desired_job_titles: string[];
  skills: string[];
  preferred_locations: string[];
  work_arrangements: string[];
  employment_types: string[];
  min_salary?: number | null;
  salary_currency: string;
  preferred_industries: string[];
  work_authorization_status: string;
  sponsorship_required: boolean;
  excluded_employers: string[];
  matching_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface AutomationSetting {
  id: number;
  user_id: number;
  automation_enabled: boolean;
  automation_mode: "manual_review" | "semi_autonomous" | "full_autonomous";
  min_match_score: number;
  max_applications_per_day: number;
  max_applications_per_week: number;
  approved_providers: string[];
  excluded_employers: string[];
  require_approval: boolean;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  is_verified: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile | null;
  career_preference?: CareerPreference | null;
  automation_setting?: AutomationSetting | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  is_verified: boolean;
  name?: string | null;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Retrieve token from localStorage fallback if set
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jf_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Crucial for HttpOnly cookies
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMsg = "An unexpected error occurred.";
    if (isJson && data) {
      if (typeof data.detail === "string") {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMsg = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ");
      } else if (data.message) {
        errorMsg = data.message;
      }
    }
    throw new ApiError(response.status, errorMsg, data);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(payload: { email: string; password: string; name?: string }): Promise<AuthResponse> {
    const res = await request<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (typeof window !== "undefined" && res.access_token) {
      localStorage.setItem("jf_token", res.access_token);
    }
    return res;
  },

  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    const res = await request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (typeof window !== "undefined" && res.access_token) {
      localStorage.setItem("jf_token", res.access_token);
    }
    return res;
  },

  async logout(): Promise<{ message: string }> {
    try {
      return await request<{ message: string }>("/api/v1/auth/logout", {
        method: "POST",
      });
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("jf_token");
      }
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return request<{ message: string }>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, new_password: string): Promise<{ message: string }> {
    return request<{ message: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password }),
    });
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    return request<{ message: string }>("/api/v1/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  // User & Profile
  async getCurrentUser(): Promise<User> {
    return request<User>("/api/v1/users/me");
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    return request<UserProfile>("/api/v1/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Career Preferences
  async getCareerPreferences(): Promise<CareerPreference> {
    return request<CareerPreference>("/api/v1/preferences/career");
  },

  async updateCareerPreferences(payload: Partial<CareerPreference>): Promise<CareerPreference> {
    return request<CareerPreference>("/api/v1/preferences/career", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Automation Settings
  async getAutomationSettings(): Promise<AutomationSetting> {
    return request<AutomationSetting>("/api/v1/automation/settings");
  },

  async updateAutomationSettings(payload: Partial<AutomationSetting>): Promise<AutomationSetting> {
    return request<AutomationSetting>("/api/v1/automation/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Health
  async getHealthLive(): Promise<{ status: string; timestamp: string }> {
    return request<{ status: string; timestamp: string }>("/health/live");
  },

  async getHealthReady(): Promise<any> {
    return request<any>("/health/ready");
  },
};
