import { HttpError, parseJsonSafe } from "../utils/errors";

export type Vehicle = Record<string, unknown>;

function normalizeBaseUrl(address: string): string {
feature/cli-http-refactor
  if (address.startsWith("http://") || address.startsWith("https://")) return address;
  return `http://${address}`;
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

feature/cli-http-refactor
  async createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
    const resp = await fetch(`${this.baseUrl}/vehicles`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) throw new HttpError(resp.status, await readBody(resp));
    return (await resp.json()) as Vehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    const resp = await fetch(`${this.baseUrl}/vehicles/${encodeURIComponent(String(id))}`, {
      method: "DELETE"
    });

    if (!resp.ok) throw new HttpError(resp.status, await readBody(resp));
  }
}
