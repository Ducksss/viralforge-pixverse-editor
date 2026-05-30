export const PIXVERSE_BALANCE_ENDPOINT = "/api/pixverse/balance";

function readNumber(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`Invalid PixVerse balance snapshot: ${field}`);
  }
  return number;
}

export async function fetchPixVerseBalanceSnapshot({
  endpoint = PIXVERSE_BALANCE_ENDPOINT,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new Error("fetch is not available in this browser");
  }

  const response = await fetchImpl(endpoint, {
    headers: { Accept: "application/json" },
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("PixVerse balance endpoint returned non-JSON data");
  }

  if (!response.ok) {
    throw new Error(payload?.error || `PixVerse balance endpoint failed with HTTP ${response.status}`);
  }

  const creditMonthly = readNumber(payload.creditMonthly, "creditMonthly");
  const creditPackage = readNumber(payload.creditPackage, "creditPackage");
  const totalCredits = readNumber(payload.totalCredits, "totalCredits");

  return {
    accountId: payload.accountId,
    creditMonthly,
    creditPackage,
    fetchedAt: payload.fetchedAt,
    source: payload.source || "pixverse-api",
    totalCredits,
  };
}
