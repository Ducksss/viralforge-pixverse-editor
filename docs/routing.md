# App Routing

ViralForge uses React Router for browser-local SPA routes. Vite serves the same
`index.html` entry point for each page, and the React route map selects the
workspace view after hydration.

## Routes

| Path | View |
| --- | --- |
| `/` | Redirects to `/editor` |
| `/editor` | Main campaign editor workspace |
| `/ai-people` | AI People casting, consent, and audition workflow |
| `/wizard` | Guided campaign setup flow |
| `/local-editor` | Standalone DaVinci-style local NLE regression surface |

## Compatibility Redirects

Older entry points remain supported while keeping the visible URL clean:

| Legacy entry | Redirects to |
| --- | --- |
| `/campaign` | `/editor` |
| `/people` | `/ai-people` |
| `/?workspace=local-nle` | `/local-editor` |
| `/?workspace=wizard` | `/wizard` |

## Adding A Workspace Page

1. Add the page path to `APP_ROUTES` in `src/routes.js`.
2. Add a workspace page id to `WORKSPACE_PAGE_PATHS` when it belongs in the
   campaign sidebar.
3. Add or update the route element in `src/App.jsx`.
4. Pass the page id into `CampaignWorkspaceApp` and render the page-specific
   workspace body there.
5. Add a direct-link test and a sidebar navigation test.

Production hosting must rewrite unknown app paths back to `index.html` so a hard
refresh on `/editor` or `/ai-people` still loads the Vite SPA.
