import type { EmailPayload, ApiResponse, PushPayload, Delegate } from "./types"; // Assuming these types are declared in a separate file

const API_BASE_URL = "https://shafdb.cognitron.co.ke/shaf/api";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODRhN2E3ZDc4MjJkNDNjODhhMmQ4YmYiLCJlbWFpbCI6ImphbmUud2FuamlrdUBjb21wYW55LmNvbSIsInJvbGVzIjpbImVtcGxveWVlIl0sImlhdCI6MTc1MTg3NDEwMywiZXhwIjoxNzgzNDEwMTAzfQ.W5J2odzgV26AjViHTk1fiW-mHA8-oJfxp4evQRW89CA";

const apiHeaders = {
  accept: "application/json",
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

export const apiService = {
  // Email APIs
  async sendEmailToAll(payload: EmailPayload): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notifications/email/all`, {
      method: "POST",
      headers: apiHeaders,
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
    payload: EmailPayload
  ): Promise<ApiResponse> {
    const response = await fetch(
      `${API_BASE_URL}/notifications/email/delegate/${delegateId}`,
      {
        method: "POST",
        headers: apiHeaders,
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
  async sendPushToAll(payload: PushPayload): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notifications/push/all`, {
      method: "POST",
      headers: apiHeaders,
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
    payload: PushPayload
  ): Promise<ApiResponse> {
    const response = await fetch(
      `${API_BASE_URL}/notifications/push/delegate/${delegateId}`,
      {
        method: "POST",
        headers: apiHeaders,
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

  // Delegates API
  async getDelegatesByYear(year: number): Promise<Delegate[]> {
    const response = await fetch(
      `${API_BASE_URL}/delegates?year=${year}&page=1&limit=1000`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
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
};
