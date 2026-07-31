// src/app/env/electron-bridge.js

/**
 * Modern Electron Context Isolation standard.
 * We rely on checking for specific APIs exposed via the ContextBridge.
 */
export const isDesktopApp = () => {
  // Safe check that works in browser and desktop renderer without errors
  return (
    typeof window !== "undefined" && typeof window.electronAPI !== "undefined"
  );
};

/**
 * Returns the electronAPI exposed via ContextBridge in the preload script.
 */
export const getDesktopAPI = () => {
  if (isDesktopApp()) {
    return window.electronAPI;
  }
  return null;
};
