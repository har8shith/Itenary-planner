// API Configuration for Spring Boot Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name: string, email: string, password: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Trip endpoints
  async getTrips() {
    return this.request('/trips');
  }

  async getTrip(id: string) {
    return this.request(`/trips/${id}`);
  }

  async createTrip(tripData: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
  }) {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async updateTrip(id: string, tripData: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
  }) {
    return this.request(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(id: string) {
    return this.request(`/trips/${id}`, {
      method: 'DELETE',
    });
  }

  // Destination endpoints
  async getDestinations(tripId: string) {
    return this.request(`/trips/${tripId}/destinations`);
  }

  async createDestination(tripId: string, destinationData: {
    name: string;
    description?: string;
    date: string;
    time?: string;
    notes?: string;
    address?: string;
  }) {
    return this.request(`/trips/${tripId}/destinations`, {
      method: 'POST',
      body: JSON.stringify(destinationData),
    });
  }

  async updateDestination(tripId: string, destinationId: string, destinationData: {
    name: string;
    description?: string;
    date: string;
    time?: string;
    notes?: string;
    address?: string;
  }) {
    return this.request(`/trips/${tripId}/destinations/${destinationId}`, {
      method: 'PUT',
      body: JSON.stringify(destinationData),
    });
  }

  async deleteDestination(tripId: string, destinationId: string) {
    return this.request(`/trips/${tripId}/destinations/${destinationId}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Helper function to handle API responses
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data as T;
} 