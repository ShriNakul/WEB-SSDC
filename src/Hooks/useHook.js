import { useState, useEffect } from "react";

export function useDetectOS() {
  const [deviceInfo, setDeviceInfo] = useState({
    os: "Windows",
    browser: "Browser",
  });

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;

    // Detect OS
    let detectedOS = "Windows";
    if (/Mac|iPod|iPhone|iPad/.test(platform) || /Macintosh/.test(userAgent)) {
      detectedOS = "macOS";
    } else if (/Linux/.test(platform) || /Linux/.test(userAgent)) {
      detectedOS = "Linux";
    } else if (/Win/.test(platform) || /Windows/.test(userAgent)) {
      detectedOS = "Windows";
    }

    // Detect Browser
    let detectedBrowser = "Browser";
    if (navigator.brave && typeof navigator.brave.isBrave === "function") {
      detectedBrowser = "Brave";
    } else if (userAgent.includes("Edg")) {
      detectedBrowser = "Edge";
    } else if (userAgent.includes("Chrome")) {
      detectedBrowser = "Chrome";
    } else if (userAgent.includes("Firefox")) {
      detectedBrowser = "Firefox";
    } else if (userAgent.includes("Safari")) {
      detectedBrowser = "Safari";
    }

    setDeviceInfo({ os: detectedOS, browser: detectedBrowser });
  }, []);

  return deviceInfo;
}
