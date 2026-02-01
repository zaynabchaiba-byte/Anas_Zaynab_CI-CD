import { describe, it, expect, vi, beforeEach } from "vitest";
import { VehicleClient } from "../src/http/client";
import { HttpError } from "../src/utils/errors";

describe("VehicleClient.createVehicle", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns created vehicle when server responds ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue(""),
      json: vi.fn().mockResolvedValue({
        id: 34,
        shortcode: "abcd",
        battery: 12,
        latitude: 30.0,
        longitude: 20.0,
      }),
    });

    // @ts-expect-error override fetch for test
    globalThis.fetch = fetchMock;

    const client = new VehicleClient("http://localhost:8080");
    const created = await client.createVehicle({
      shortcode: "abcd",
      battery: 12,
      latitude: 30.0,
      longitude: 20.0,
    });

    expect(created.id).toBe(34);
    expect(created.shortcode).toBe("abcd");
  });

  it("throws HttpError with body when server responds error", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: vi.fn().mockResolvedValue("Shortcode must be only 4 characters long"),
      json: vi.fn(),
    });

    // @ts-expect-error override fetch for test
    globalThis.fetch = fetchMock;

    const client = new VehicleClient("http://localhost:8080");

    await expect(
      client.createVehicle({
        shortcode: "abcdef",
        battery: 12,
        latitude: 30.0,
        longitude: 20.0,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });
});
