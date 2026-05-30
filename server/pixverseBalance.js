export const PIXVERSE_BALANCE_URL = "https://app-api.pixverse.ai/openapi/v2/account/balance";

function createTraceId() {
  return globalThis.crypto?.randomUUID?.() || `trace-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readCredit(value, field) {
  const credit = Number(value);
  if (!Number.isFinite(credit) || credit < 0) {
    throw new Error(`Invalid PixVerse balance response: ${field}`);
  }
  return credit;
}

export function normalizePixVerseBalanceResponse(payload, { fetchedAt = new Date().toISOString() } = {}) {
  if (!payload || typeof payload !== "object") {
    throw new Error("PixVerse returned an empty balance response");
  }

  if (payload.ErrCode !== 0) {
    throw new Error(payload.ErrMsg || "PixVerse rejected the balance request");
  }

  if (!payload.Resp || typeof payload.Resp !== "object") {
    throw new Error("PixVerse returned a balance response without Resp");
  }

  const creditMonthly = readCredit(payload.Resp.credit_monthly, "credit_monthly");
  const creditPackage = readCredit(payload.Resp.credit_package, "credit_package");

  return {
    accountId: payload.Resp.account_id,
    creditMonthly,
    creditPackage,
    fetchedAt,
    source: "pixverse-api",
    totalCredits: creditMonthly + creditPackage,
  };
}

export async function fetchPixVerseBalance({
  apiKey = process.env.PIXVERSE_API_KEY,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  traceId = createTraceId(),
} = {}) {
  const trimmedKey = apiKey?.trim();
  if (!trimmedKey) {
    throw new Error("PIXVERSE_API_KEY is not configured");
  }

  if (typeof fetchImpl !== "function") {
    throw new Error("fetch is not available in this runtime");
  }

  const response = await fetchImpl(PIXVERSE_BALANCE_URL, {
    headers: {
      "API-KEY": trimmedKey,
      "Ai-trace-id": traceId,
      Accept: "application/json",
    },
    method: "GET",
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("PixVerse returned a non-JSON balance response");
  }

  if (!response.ok) {
    throw new Error(payload?.ErrMsg || `PixVerse balance request failed with HTTP ${response.status}`);
  }

  return normalizePixVerseBalanceResponse(payload, { fetchedAt: now().toISOString() });
}
