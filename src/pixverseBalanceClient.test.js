import { describe, expect, it, vi } from "vitest";
import {
  PIXVERSE_BALANCE_ENDPOINT,
  fetchPixVerseBalanceSnapshot,
} from "./pixverseBalanceClient.js";

describe("PixVerse balance browser client", () => {
  it("loads the normalized balance from the local API endpoint", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        accountId: 42,
        creditMonthly: 100,
        creditPackage: 25,
        fetchedAt: "2026-05-30T05:22:00.000Z",
        source: "pixverse-api",
        totalCredits: 125,
      }),
    );

    await expect(fetchPixVerseBalanceSnapshot({ fetchImpl })).resolves.toEqual({
      accountId: 42,
      creditMonthly: 100,
      creditPackage: 25,
      fetchedAt: "2026-05-30T05:22:00.000Z",
      source: "pixverse-api",
      totalCredits: 125,
    });
    expect(fetchImpl).toHaveBeenCalledWith(PIXVERSE_BALANCE_ENDPOINT, {
      headers: { Accept: "application/json" },
    });
  });

  it("surfaces local API errors without exposing provider secrets", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json(
        { error: "PixVerse rejected the balance request" },
        { status: 401 },
      ),
    );

    await expect(fetchPixVerseBalanceSnapshot({ fetchImpl })).rejects.toThrow(
      "PixVerse rejected the balance request",
    );
  });
});
