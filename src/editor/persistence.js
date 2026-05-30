import {
  createInitialTimelineProject,
  deserializeTimelineProject,
  serializeTimelineProject,
} from "./timeline.js";

export const TIMELINE_PROJECT_STORAGE_KEY = "viralforge.timelineProject.v1";

function getDefaultStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function saveTimelineProject(project, storage = getDefaultStorage()) {
  if (!storage) {
    return;
  }

  storage.setItem(TIMELINE_PROJECT_STORAGE_KEY, JSON.stringify(serializeTimelineProject(project)));
}

export function loadTimelineProject(storage = getDefaultStorage()) {
  if (!storage) {
    return createInitialTimelineProject();
  }

  const saved = storage.getItem(TIMELINE_PROJECT_STORAGE_KEY);
  if (!saved) {
    return createInitialTimelineProject();
  }

  try {
    return deserializeTimelineProject(saved);
  } catch {
    return createInitialTimelineProject();
  }
}

export function clearTimelineProject(storage = getDefaultStorage()) {
  storage?.removeItem(TIMELINE_PROJECT_STORAGE_KEY);
}
