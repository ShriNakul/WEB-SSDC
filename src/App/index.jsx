// src/app/index.js
import React, { lazy, Suspense } from "react";
import { isDesktopApp } from "./env/electron-bridge";

// Lazy load the backends based on context for better performance
const BrowserFileBackend = lazy(() => import("./env/BrowserFileBackend"));

/**
 * Smart Container Detector
 * It renders the real functional logic layer (the backend wrappers)
 * appropriate for the context (Web or Desktop) while maintaining the
 * UI appearance from image_cadb33.png.
 */
const AppIndex = (props) => {
  const isDesktop = isDesktopApp();

  console.log(
    `[SSDC] FileCleanser starting in ${isDesktop ? "DESKTOP" : "WEB"} context.`,
  );

  // Standard loading placeholder for lazy loading
  const Loading = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "#fff",
        background: "#121214",
      }}
    >
      Loading File Cleanser...
    </div>
  );

  return (
    <Suspense fallback={<Loading />}>
      {isDesktop ? (
        // The logical wrapper for native file access (real recycling, native dialogs)
        <ElectronFileBackend {...props} />
      ) : (
        // The logical wrapper for browser File System Access API (real reading/deleting once permission granted)
        <BrowserFileBackend {...props} />
      )}
    </Suspense>
  );
};

export default AppIndex;
