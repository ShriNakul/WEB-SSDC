import React, { useState } from "react";
import styles from "./FileCleanser.module.css";
import DeletedSection from "./DeletedSection";

/**
 * Enhanced FileCleanser UI Component
 */
const FileCleanser = ({
  isFirstTime = true,
  file = null,
  onSelectFolder,
  onKeep,
  onDelete,
  version = "1.2",
}) => {
  const [deletedList, setDeletedList] = useState([]);
  const [showTrash, setShowTrash] = useState(false);

  // Helper to slice the top section of code
  const getCodeSnippet = (content, lines = 20) => {
    if (!content) return "Code preview unavailable";
    return content.split("\n").slice(0, lines).join("\n");
  };

  // Helper to render the correct preview based on file type
  const renderPreview = () => {
    if (!file) {
      return (
        <div
          style={{ color: "#ffffff", fontSize: "1.1rem", textAlign: "center" }}
        >
          All files reviewed!
        </div>
      );
    }

    switch (file.typeHint) {
      case "image":
        return (
          <img src={file.url} alt={file.name} className={styles.mediaPreview} />
        );
      case "video":
        return (
          <video src={file.url} controls className={styles.mediaPreview} />
        );
      case "audio":
        return (
          <div className={styles.audioWrapper}>
            <svg viewBox="0 0 24 24" className={styles.audioIcon}>
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <audio src={file.url} controls className={styles.audioPlayer} />
          </div>
        );
      case "code":
        return (
          <pre className={styles.codePreview}>
            <code>{getCodeSnippet(file.content)}</code>
          </pre>
        );
      default:
        return (
          <div className={styles.genericFile}>
            <svg viewBox="0 0 24 24" className={styles.genericFileIcon}>
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
        );
    }
  };

  // Handle file deletion - add to trash instead of permanent delete
  const handleDelete = (deletedFile) => {
    if (onDelete) {
      onDelete(deletedFile);
    }
    // Add file to trash
    setDeletedList([...deletedList, deletedFile]);
  };

  // Restore file from trash
  const handleRestoreItem = (index) => {
    const restoredFile = deletedList[index];
    // Remove from trash
    setDeletedList(deletedList.filter((_, i) => i !== index));
    // Optionally notify parent of restoration
    if (onKeep) {
      onKeep(restoredFile);
    }
  };

  // Permanently delete file
  const handlePermanentDeleteItem = (index) => {
    const permanentlyDeletedFile = deletedList[index];
    // Remove from trash
    setDeletedList(deletedList.filter((_, i) => i !== index));
    // Call backend to permanently delete
    // await api.permanentlyDeleteFile(permanentlyDeletedFile);
  };

  // Empty entire trash
  const handleEmptyTrash = async () => {
    // Call backend API to permanently delete all trash files
    // await api.deleteAllTrash(deletedList);

    // Clear the local state
    setDeletedList([]);
  };

  if (showTrash) {
    return (
      <DeletedSection
        deletedList={deletedList}
        onRestoreItem={handleRestoreItem}
        onPermanentDeleteItem={handlePermanentDeleteItem}
        onEmptyTrash={handleEmptyTrash}
        onClose={() => setShowTrash(false)}
      />
    );
  }

  return (
    <div className={styles.appContainer}>
      {/* Top Right Info */}
      <header className={styles.topRightInfo}>
        <h2 className={styles.title}>File cleanser</h2>
        <p className={styles.subtitle}>Temp & Cache Wipe (coming soon)</p>
        <p className={styles.subtitle}>File manager (coming soon)</p>

        {/* Trash Button */}
        {deletedList.length > 0 && (
          <button
            onClick={() => setShowTrash(true)}
            style={{
              marginTop: "1rem",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            🗑️ Trash ({deletedList.length})
          </button>
        )}
      </header>

      {/* Main Workspace */}
      <main className={styles.workspace}>
        {/* Left Action: Keep */}
        <button
          className={styles.actionBtn}
          onClick={onKeep}
          disabled={isFirstTime || !file}
          aria-label="Keep File"
        >
          <div className={styles.shieldWrapper}>
            <svg viewBox="0 0 24 24" className={styles.iconShield}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span className={styles.shieldText}>Keep</span>
          </div>
          <svg viewBox="0 0 24 24" className={styles.arrowLeft}>
            <polygon points="15.41,16.59 10.83,12 15.41,7.41 14,6 8,12 14,18" />
          </svg>
        </button>

        {/* Center Preview Card */}
        <div className={styles.previewCard}>
          <div className={styles.previewContent}>
            {isFirstTime ? (
              <div className={styles.emptyState}>
                <button
                  className={styles.selectFolderBtn}
                  onClick={onSelectFolder}
                >
                  Select Folder
                </button>
              </div>
            ) : (
              renderPreview()
            )}
          </div>

          <div className={styles.fileName}>
            {file ? file.name : isFirstTime ? "File name" : "Done!"}
          </div>
        </div>

        {/* Right Action: Delete (Moves to Trash) */}
        <button
          className={styles.actionBtn}
          onClick={() => file && handleDelete(file)}
          disabled={isFirstTime || !file}
          aria-label="Trash File"
        >
          <svg viewBox="0 0 24 24" className={styles.arrowRight}>
            <polygon points="8.59,16.59 13.17,12 8.59,7.41 10,6 16,12 10,18" />
          </svg>
          <svg viewBox="0 0 24 24" className={styles.iconTrash}>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </main>

      {/* Bottom Right Footer */}
      <footer className={styles.bottomRightVersion}>V {version}</footer>
    </div>
  );
};

export default FileCleanser;
