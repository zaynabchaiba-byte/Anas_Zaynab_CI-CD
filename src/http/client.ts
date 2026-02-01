import { HttpError } from "../utils/errors";

export type Vehicle = {
  id: number;
  shortcode: string;
  battery: number;
  latitude: number;
  longitude: number;
};

export type CreateVehiclePayload = {
  shortcode: string;
  battery: number;
  latitude: number;
  longitude: number;
};

function normalizeBaseUrl(address: string): string {
  if (address.startsWith("http://") || address.startsWith("https://")) return address;
  return `http://${address}`;
}

async function readBody(resp: Response): Promise<string> {
  try {
    return await resp.text();
  } catch {
    return "";
  }
}

export class VehicleClient {
  private baseUrl: string;

  constructor(address: string) {
    this.baseUrl = normalizeBaseUrl(address).replace(/\/+$/, "");
  }

  async listVehicles(): Promise<Vehicle[]> {
    const resp = await fetch(`${this.baseUrl}/vehicles`);
    if (!resp.ok) {
      const body = await readBody(resp);
      throw new HttpError(resp.status, resp.statusText ?? "HTTP error", body);
    }
    return (await resp.json()) as Vehicle[];
  }

  async createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    const resp = await fetch(`${this.baseUrl}/vehicles`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const body = await readBody(resp);
      throw new HttpError(resp.status, resp.statusText ?? "HTTP error", body);
    }
    return (await resp.json()) as Vehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    const resp = await fetch(
      `${this.baseUrl}/vehicles/${encodeURIComponent(String(id))}`,
      { method: "DELETE" }
    );
    if (!resp.ok) {
      const body = await readBody(resp);
      throw new HttpError(resp.status, resp.statusText ?? "HTTP error", body);
    }
  }
}
