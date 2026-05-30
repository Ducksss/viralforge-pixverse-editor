import { describe, expect, it, vi } from "vitest";
import {
  PIXVERSE_BALANCE_URL,
  fetchPixVerseBalance,
  normalizePixVerseBalanceResponse,
} from "./pixverseBalance.js";

describe("PixVerse balance server helper", () => {
  it("normalizes monthly and package credits into a display-ready balance", () => {
    expect(
      normalizePixVerseBalanceResponse(
        {
          ErrCode: 0,
          ErrMsg: "success",
          Resp: {
            account_id: 42,
            credit_monthly: 1000,
            credit_package: 250,
          },
        },
        { fetchedAt: "2026-05-30T05:20:00.000Z" },
      ),
    ).toEqual({
      accountId: 42,
      creditMonthly: 1000,
      creditPackage: 250,
      fetchedAt: "2026-05-30T05:20:00.000Z",
      source: "pixverse-api",
      totalCredits: 1250,
    });
  });

  it("calls the PixVerse account balance endpoint with the API key and trace id", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        ErrCode: 0,
        ErrMsg: "success",
        Resp: {
          account_id: 99,
          credit_monthly: 120,
          credit_package: 30,
        },
      }),
    );

    const balance = await fetchPixVerseBalance({
      apiKey: "test-pixverse-key",
      fetchImpl,
      now: () => new Date("2026-05-30T05:21:00.000Z"),
      traceId: "trace-id-123",
    });

    expect(fetchImpl).toHaveBeenCalledWith(PIXVERSE_BALANCE_URL, {
      headers: {
        "API-KEY": "test-pixverse-key",
        "Ai-trace-id": "trace-id-123",
        Accept: "application/json",
      },
      method: "GET",
    });
    expect(balance).toMatchObject({
      accountId: 99,
      creditMonthly: 120,
      creditPackage: 30,
      totalCredits: 150,
    });
  });

  it("rejects missing API keys before making a network request", async () => {
    const fetchImpl = vi.fn();

    await expect(
      fetchPixVerseBalance({
        apiKey: "",
        fetchImpl,
        traceId: "trace-id-123",
      }),
    ).rejects.toThrow("PIXVERSE_API_KEY is not configured");
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
