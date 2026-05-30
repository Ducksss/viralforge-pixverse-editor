import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fetchPixVerseBalance } from "./server/pixverseBalance.js";

function writeJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

function pixVerseBalanceProxy(apiKey) {
  return {
    name: "viralforge-pixverse-balance-proxy",
    configureServer(server) {
      server.middlewares.use("/api/pixverse/balance", async (request, response) => {
        if (request.method !== "GET") {
          writeJson(response, 405, { error: "Method not allowed" });
          return;
        }

        try {
          const balance = await fetchPixVerseBalance({ apiKey });
          writeJson(response, 200, balance);
        } catch (error) {
          const statusCode = error.message === "PIXVERSE_API_KEY is not configured" ? 500 : 502;
          writeJson(response, statusCode, {
            error: error.message || "Unable to fetch PixVerse balance",
          });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), pixVerseBalanceProxy(env.PIXVERSE_API_KEY || process.env.PIXVERSE_API_KEY)],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js",
      testTimeout: 15000,
    },
  };
});
