export const APP_ROUTES = Object.freeze({
  home: "/",
  editor: "/editor",
  aiPeople: "/ai-people",
  props: "/props",
  storyboard: "/storyboard",
  wizard: "/wizard",
  cast: "/cast",
  localEditor: "/local-editor",
});

export const LEGACY_ROUTE_REDIRECTS = Object.freeze({
  "/campaign": APP_ROUTES.editor,
  "/people": APP_ROUTES.aiPeople,
});

export const WORKSPACE_PAGE_PATHS = Object.freeze({
  editor: APP_ROUTES.editor,
  people: APP_ROUTES.aiPeople,
  props: APP_ROUTES.props,
  storyboard: APP_ROUTES.storyboard,
});

const WORKSPACE_PATH_PAGES = Object.freeze(
  Object.fromEntries(
    Object.entries(WORKSPACE_PAGE_PATHS).map(([pageId, path]) => [path, pageId]),
  ),
);

export function getWorkspacePath(pageId) {
  return WORKSPACE_PAGE_PATHS[pageId] || APP_ROUTES.editor;
}

export function getWorkspacePageFromPath(pathname) {
  return WORKSPACE_PATH_PAGES[pathname] || null;
}

export function getLegacyRouteRedirect(pathname) {
  return LEGACY_ROUTE_REDIRECTS[pathname] || null;
}

export function getLegacyWorkspaceQueryRedirect(search) {
  const workspace = new URLSearchParams(search).get("workspace");

  if (workspace === "local-nle") {
    return APP_ROUTES.localEditor;
  }

  if (workspace === "wizard") {
    return APP_ROUTES.wizard;
  }

  return null;
}
