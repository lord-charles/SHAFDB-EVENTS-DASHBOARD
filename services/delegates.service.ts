"use server";

import { cookies } from "next/headers";
import { Delegate } from "@/types/delegate";
import { EmailPayload, PushPayload } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/shaf/api";

const getHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return {
    accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export async function getEventYears(): Promise<number[]> {
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
}

export async function getDelegatesByYear(year: number): Promise<Delegate[]> {
  const headers = await getHeaders();
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
    throw new Error(`Failed to fetch delegates for year ${year}: ${response.statusText}`);
  }

  return response.json();
}

export async function getDelegateStatistics(year?: number): Promise<any> {
  const queryParams = year ? `?year=${year}` : "";
  const headers = await getHeaders();
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
    throw new Error(`Failed to fetch delegate statistics: ${response.statusText}`);
  }

  return response.json();
}

export async function getDelegateById(id: string): Promise<Delegate> {
  const headers = await getHeaders();
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
}

export async function createDelegate(delegateData: any): Promise<Delegate> {
  const headers = await getHeaders();
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
}

export async function updateDelegate(id: string, delegateData: any): Promise<Delegate> {
  const headers = await getHeaders();
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
}

export async function deleteDelegate(id: string): Promise<any> {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE_URL}/delegates/delete-account/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete delegate: ${errorText || response.statusText}`);
  }

  return response.json();
}

export async function sendEmailToAll(payload: EmailPayload): Promise<any> {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE_URL}/notifications/email/all`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email to all delegates: ${response.statusText}`);
  }

  return response.json();
}

export async function sendEmailToDelegate(delegateId: string, payload: EmailPayload): Promise<any> {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE_URL}/notifications/email/delegate/${delegateId}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email to delegate ${delegateId}: ${response.statusText}`);
  }

  return response.json();
}

export async function sendPushToAll(payload: PushPayload): Promise<any> {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE_URL}/notifications/push/all`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send push notification to all delegates: ${response.statusText}`);
  }

  return response.json();
}

export async function sendPushToDelegate(delegateId: string, payload: PushPayload): Promise<any> {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE_URL}/notifications/push/delegate/${delegateId}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send push notification to delegate ${delegateId}: ${response.statusText}`);
  }

  return response.json();
}
