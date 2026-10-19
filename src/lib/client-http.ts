export async function requestJson(url: string, method: string, body?: unknown): Promise<{ message?: string; redirect?: string }> {
  const response = await fetch(url, {
    method, headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({ error: "Unexpected response. Please try again." }));
  if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data;
}
