import { describe, expect, it } from "vitest";
import {
  APP_ROUTES,
  getLegacyRouteRedirect,
  getLegacyWorkspaceQueryRedirect,
  getWorkspacePageFromPath,
  getWorkspacePath,
} from "./routes.js";

describe("app routes", () => {
  it("maps workspace page ids to clean page paths", () => {
    expect(getWorkspacePath("editor")).toBe(APP_ROUTES.editor);
    expect(getWorkspacePath("people")).toBe(APP_ROUTES.aiPeople);
    expect(getWorkspacePath("missing")).toBe(APP_ROUTES.editor);
  });

  it("maps clean page paths back to workspace page ids", () => {
    expect(getWorkspacePageFromPath("/editor")).toBe("editor");
    expect(getWorkspacePageFromPath("/ai-people")).toBe("people");
    expect(getWorkspacePageFromPath("/campaign")).toBeNull();
  });

  it("keeps old workspace entry points as canonical redirects", () => {
    expect(getLegacyRouteRedirect("/campaign")).toBe(APP_ROUTES.editor);
    expect(getLegacyRouteRedirect("/people")).toBe(APP_ROUTES.aiPeople);
    expect(getLegacyRouteRedirect("/editor")).toBeNull();
    expect(getLegacyWorkspaceQueryRedirect("?workspace=local-nle")).toBe(APP_ROUTES.localEditor);
    expect(getLegacyWorkspaceQueryRedirect("?workspace=wizard")).toBe(APP_ROUTES.wizard);
    expect(getLegacyWorkspaceQueryRedirect("?workspace=editor")).toBeNull();
  });
});
