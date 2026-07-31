import React, { useEffect, useState } from "react";
import { useDetectOS } from "../../Hooks/useHook.js";
import styles from "./Hero.module.css";
import useVideo from "./Use.mp4";

function InstallationHero() {
  const { os } = useDetectOS();
  const isPortComing = os === "Linux" || os === "macOS";

  const [latestRelease, setLatestRelease] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch latest release from GitHub
  useEffect(() => {
    fetch("https://api.github.com/repos/ShriNakul/SSDC/releases/latest")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch release");
        return res.json();
      })
      .then((data) => {
        setLatestRelease(data);

        // Find Windows .exe asset
        const windowsAsset = data.assets?.find((asset) =>
          asset.name.toLowerCase().endsWith(".exe"),
        );

        if (windowsAsset) {
          setDownloadUrl(windowsAsset.browser_download_url);
        } else {
          // Fallback to release page if .exe not found
          setDownloadUrl(
            `https://github.com/ShriNakul/SSDC/releases/tag/${data.tag_name}`,
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch release:", err);
        // Fallback to hardcoded URL
        setDownloadUrl(
          "https://github.com/ShriNakul/SSDC/releases/download/v1.1.2/File.Cleanser.Setup.1.1.2.exe",
        );
        setLoading(false);
      });
  }, []);

  // Dynamic OS Logo display
  const renderOSLogo = () => {
    if (os === "macOS") {
      return (
        <svg className={styles.brandIcon} viewBox="0 0 16 16" title="macOS">
          <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
        </svg>
      );
    }
    if (os === "Linux") {
      return (
        <svg className={styles.brandIcon} viewBox="0 0 16 16" title="Linux">
          <path d="M8.996 4.497c.104-.076.1-.168.186-.158s.022.102-.098.207c-.12.104-.308.243-.46.323-.291.152-.631.336-.993.336s-.647-.167-.853-.33c-.102-.082-.186-.162-.248-.221-.11-.086-.096-.207-.052-.204.075.01.087.109.134.153.064.06.144.137.241.214.195.154.454.304.778.304s.702-.19.932-.32c.13-.073.297-.204.433-.304M7.34 3.781c.055-.02.123-.031.174-.003.011.006.024.021.02.034-.012.038-.074.032-.11.05-.032.017-.057.052-.093.054-.034 0-.086-.012-.09-.046-.007-.044.058-.072.1-.089m.581-.003c.05-.028.119-.018.173.003.041.017.106.045.1.09-.004.033-.057.046-.09.045-.036-.002-.062-.037-.093-.053-.036-.019-.098-.013-.11-.051-.004-.013.008-.028.02-.034" />
        </svg>
      );
    }
    // Default: Windows
    return (
      <svg className={styles.brandIcon} viewBox="0 0 16 16" title="Windows">
        <path d="M7.462 0H0v7.19h7.462zM16 0H8.538v7.19H16zM7.462 8.211H0V16h7.462zm8.538 0H8.538V16H16z" />
      </svg>
    );
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        {/* Left Column */}
        <div className={styles.heroContent}>
          <div className={styles.brandHeading}>
            <span>Install for {os}</span>
            {renderOSLogo()}
          </div>

          <h2 className={styles.heroDescription}>
            {isPortComing
              ? "Port coming in a later version, sorry."
              : "Ready to clean your drive?"}
          </h2>

          {!isPortComing && (
            <>
              <div className={styles.buttonGroup}>
                {loading ? (
                  <button className={styles.btnPrimary} disabled>
                    <span>Loading...</span>
                  </button>
                ) : (
                  <a
                    href={downloadUrl}
                    className={styles.btnPrimary}
                    target={
                      downloadUrl?.includes("releases/tag")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      downloadUrl?.includes("releases/tag")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <span>
                      Install {latestRelease ? `${latestRelease.tag_name}` : ""}
                    </span>
                    <span className={styles.arrowIcon}>➤</span>
                  </a>
                )}
              </div>

              <div className={styles.githubLink}>
                Didn't work or Windows throwing an issue? Install from github
                here:{" "}
                <a
                  href={`https://github.com/ShriNakul/SSDC/releases/tag/${latestRelease?.tag_name || "v1.1.2"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  (link)
                </a>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Media Box */}
        <div className={styles.mediaWrapper}>
          {isPortComing ? (
            <div
              className={styles.videoPlaceholder}
              style={{ fontSize: "3rem" }}
            >
              🎬❌
            </div>
          ) : (
            <video
              className={styles.videoPlaceholder}
              controls
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={useVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>

      <div className={styles.heroFooterTagline}>
        100% Free & Open Source • No Ads • Runs 100% Locally
      </div>
    </section>
  );
}

export default InstallationHero;
