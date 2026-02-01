import { HttpError, parseJsonSafe } from "../utils/errors";

export type Vehicle = Record<string, unknown>;

function normalizeBaseUrl(address: string): string {
  return address.replace(/\/+$/, "");
}

async function request<T>(address: string, path: string, init?: RequestInit): Promise<T> {
  const baseUrl = normalizeBaseUrl(address);
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const body = await parseJsonSafe(res);

  if (!res.ok) {
    throw new HttpError(res.status, `HTTP ${res.status} ${res.statusText}`, body);
  }

  return body as T;
}

export async function listVehicles(address: string): Promise<Vehicle[]> {
  return request<Vehicle[]>(address, "/vehicles", { method: "GET" });
}

export async function createVehicle(address: string, payload: Vehicle): Promise<Vehicle> {
  return request<Vehicle>(address, "/vehicles", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function deleteVehicle(address: string, id: string): Promise<{ ok: true }> {
  await request<unknown>(address, `/vehicles/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
  return { ok: true };
}
