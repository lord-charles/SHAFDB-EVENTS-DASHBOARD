import { getSession } from "next-auth/react";
import type { EmailPayload, ApiResponse, PushPayload, Delegate } from "./types";

const API_BASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/shaf/api"
    : "http://localhost:4000/shaf/api";

// Dynamically fetch auth headers using the logged in NextAuth session
const getHeaders = async (customToken?: string) => {
  let token = customToken;
  if (!token && typeof window !== "undefined") {
    const session = await getSession();
    token = (session?.user as any)?.token;
  }
  return {
    accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export const apiService = {
  // Email APIs
  async sendEmailToAll(payload: EmailPayload, token?: string): Promise<ApiResponse> {
    const headers = await getHeaders(token);
    const response = await fetch(`${API_BASE_URL}/notifications/email/all`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to send email to all delegates: ${response.statusText}`
      );
    }

    return response.json();
  },

  async sendEmailToDelegate(
    delegateId: string,
    payload: EmailPayload,
    token?: string
  ): Promise<ApiResponse> {
    const headers = await getHeaders(token);
    const response = await fetch(
      `${API_BASE_URL}/notifications/email/delegate/${delegateId}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to send email to delegate ${delegateId}: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Push Notification APIs
  async sendPushToAll(payload: PushPayload, token?: string): Promise<ApiResponse> {
    const headers = await getHeaders(token);
    const response = await fetch(`${API_BASE_URL}/notifications/push/all`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to send push notification to all delegates: ${response.statusText}`
      );
    }

    return response.json();
  },

  async sendPushToDelegate(
    delegateId: string,
    payload: PushPayload,
    token?: string
  ): Promise<ApiResponse> {
    const headers = await getHeaders(token);
    const response = await fetch(
      `${API_BASE_URL}/notifications/push/delegate/${delegateId}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to send push notification to delegate ${delegateId}: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Delegates API (Read)
  async getDelegatesByYear(year: number, token?: string): Promise<Delegate[]> {
    const headers = await getHeaders(token);
    const response = await fetch(
      `${API_BASE_URL}/delegates?year=${year}&page=1&limit=1000`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: headers.Authorization,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch delegates for year ${year}: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Get distinct event years registered in system
  async getEventYears(): Promise<number[]> {
    const response = await fetch(`${API_BASE_URL}/events/years`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event years: ${response.statusText}`);
    }

    return response.json();
  },

  // Get delegate statistics from server (year-specific or global)
  async getDelegateStatistics(year?: number, token?: string): Promise<any> {
    const queryParams = year ? `?year=${year}` : "";
    const headers = await getHeaders(token);
    const response = await fetch(
      `${API_BASE_URL}/delegates/statistics${queryParams}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: headers.Authorization,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch delegate statistics: ${response.statusText}`
      );
    }

    return response.json();
  },

  // Create Delegate
  async createDelegate(delegateData: any, token?: string): Promise<Delegate> {
    const headers = await getHeaders(token);
    const response = await fetch(`${API_BASE_URL}/delegates`, {
      method: "POST",
      headers,
      body: JSON.stringify(delegateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create delegate: ${errorText || response.statusText}`);
    }

    return response.json();
  },

  // Update Delegate
  async updateDelegate(id: string, delegateData: any, token?: string): Promise<Delegate> {
    const headers = await getHeaders(token);
    const response = await fetch(`${API_BASE_URL}/delegates/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(delegateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update delegate: ${errorText || response.statusText}`);
    }

    return response.json();
  },

  // Delete Delegate
  async deleteDelegate(id: string, token?: string): Promise<any> {
    const headers = await getHeaders(token);
    const response = await fetch(`${API_BASE_URL}/delegates/delete-account/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete delegate: ${errorText || response.statusText}`);
    }

    return response.json();
  },

  // Get Delegate By ID
  async getDelegateById(id: string, token?: string): Promise<Delegate> {
    const headers = await getHeaders(token);
    const response = await fetch(`${API_BASE_URL}/delegates/${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: headers.Authorization,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch delegate details: ${errorText || response.statusText}`);
    }

    return response.json();
  },
};
