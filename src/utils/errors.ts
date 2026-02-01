export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

export async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Extrait des messages d'erreur lisibles depuis une réponse serveur.
 */
export function extractErrorLines(body: unknown): string[] {
  if (body == null) return ["No response body"];

  if (typeof body === "string") {
    return body.split("\n").filter(Boolean);
  }

  if (typeof body === "object") {
    if (
      "message" in body &&
      typeof (body as { message?: unknown }).message === "string"
    ) {
      return [(body as { message: string }).message];
    }

    if (
      "errors" in body &&
      Array.isArray((body as { errors?: unknown }).errors)
    ) {
      return (body as { errors: unknown[] }).errors.map((err) => {
        if (typeof err === "string") return err;

        if (
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as { message?: unknown }).message === "string"
        ) {
          return (err as { message: string }).message;
        }

        return JSON.stringify(err);
      });
    }
  }

  return [JSON.stringify(body, null, 2)];
}

export function formatServerError(body: unknown): string {
  return extractErrorLines(body).join("\n");
}
