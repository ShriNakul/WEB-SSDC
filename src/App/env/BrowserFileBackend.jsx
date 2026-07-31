// src/app/env/BrowserFileBackend.jsx
import React, { useState, useCallback, Suspense, lazy } from "react";
import FileCleanser from "../ui/FileCleanser";

// Lazy load the new Deleted Section UI
const DeletedSection = lazy(() => import("../ui/DeletedSection"));

function BrowserFileBackend() {
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const [scannedFiles, setScannedFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFileContent, setCurrentFileContent] = useState(null);

  // Requirement 2: Virtual Trash State
  const [deletedList, setDeletedList] = useState([]);
  const [showDeletedSection, setShowDeletedSection] = useState(false);

  // Directory Scanning: derived MIME updated to 'typeHint'
  const handleSelectFolder = async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      setDirectoryHandle(handle);

      const files = [];
      const recursiveScan = async (currentHandle, path = "") => {
        for await (const entry of currentHandle.values()) {
          const entryPath = path ? `${path}/${entry.name}` : entry.name;

          if (entry.kind === "file") {
            const fileData = await entry.getFile();

            let typeHint = "other";
            if (fileData.type.startsWith("image/")) typeHint = "image";
            else if (fileData.type.startsWith("video/")) typeHint = "video";
            else if (fileData.type.startsWith("audio/")) typeHint = "audio";
            else if (
              fileData.type.includes("javascript") ||
              fileData.name.match(/\.(js|css|html|json|md|txt|jsx|tsx)$/)
            )
              typeHint = "code";

            files.push({
              name: entry.name,
              relativePath: entryPath, // Important for hard delete later
              typeHint: typeHint,
              mimeType: fileData.type,
              lastModified: fileData.lastModified,
              fileHandle: entry, // Standard logic: keep handle
              url: ["image", "video", "audio"].includes(typeHint)
                ? URL.createObjectURL(fileData)
                : null,
            });
          }
        }
      };

      await recursiveScan(handle);
      setScannedFiles(files);
      setCurrentIndex(0);
      loadFileContent(files[0]);
    } catch (err) {
      console.error("[SSDC] Web Folder picker aborted.", err);
    }
  };

  const loadFileContent = async (fileObject) => {
    if (fileObject && fileObject.typeHint === "code") {
      const fileData = await fileObject.fileHandle.getFile();
      const content = await fileData.text();
      setCurrentFileContent(content);
    } else {
      setCurrentFileContent(null);
    }
  };

  const handleKeep = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    loadFileContent(scannedFiles[nextIndex]);
  };

  // --- Requirement 2: REVISED Delete (Moves to Virtual Trash) ---
  const handleVirtualTrash = () => {
    if (scannedFiles.length === 0) return;

    const fileToTrash = scannedFiles[currentIndex];
    console.log(
      `[SSDC] Moving ${fileToTrash.name} to Virtual Trash (Not Deleted from OS)`,
    );

    // Add to Deleted List State
    setDeletedList((prev) => [...prev, fileToTrash]);

    // Remove from Scanned List State
    setScannedFiles((prev) => prev.filter((_, i) => i !== currentIndex));

    // Handle view indexing immediately
    // loadFileContent will naturally fail gracefully or load the *new* item at currentIndex
  };

  // --- Requirement 2: Dynamic Restoration Action ---
  const handleRestoreFromTrash = (trashIndex) => {
    const itemToRestore = deletedList[trashIndex];
    console.log(`[SSDC] Restoring ${itemToRestore.name} to Active Scan List`);

    // Remove from Deleted List
    setDeletedList((prev) => prev.filter((_, i) => i !== trashIndex));

    // Restore to Scanned List (append to end)
    setScannedFiles((prev) => [...prev, itemToRestore]);
  };

  // --- Requirement 2: Dynamic HARD PERMANENT DELETE Action ---
  const handlePermanentWebDelete = async (trashIndex) => {
    if (!directoryHandle) return;

    const itemToHardDelete = deletedList[trashIndex];
    console.log(
      `[SSDC] Attempting Web Hard Delete (Real removeEntry): ${itemToHardDelete.relativePath}`,
    );

    try {
      // Modern Web API: Hard hard deletion required here.
      // Assumes flat scanning/deletion handled as per v1 example limitation
      if (!itemToHardDelete.relativePath.includes("/")) {
        await directoryHandle.removeEntry(itemToHardDelete.name);
        console.log("[SSDC] Permanent Web Deletion successful.");

        // Remove from Deleted List State
        setDeletedList((prev) => prev.filter((_, i) => i !== trashIndex));
      } else {
        alert(
          "Deletion inside subfolders not supported in current flat scan example backend.",
        );
      }
    } catch (err) {
      console.error("[SSDC] Web Permanent Deletion failed.", err);
      alert("Hard deletion operation failed. Permission lost or file locked.");
    }
  };

  // Environment State derivation
  const isFirstTime = !directoryHandle || scannedFiles.length === 0;
  const currentFileEntry = scannedFiles[currentIndex] || null;

  // Render main dumb component with revised logical handler
  return (
    <>
      <FileCleanser
        isFirstTime={isFirstTime}
        file={currentFileEntry}
        onSelectFolder={handleSelectFolder}
        onKeep={handleKeep}
        onDelete={handleVirtualTrash} // Revise Handler
        version="1.1-WebFileSystemAccess"
      />

      {/* Conditional Rendering of Trash Bin UI */}
      {showDeletedSection && (
        <Suspense fallback={<div>Loading Bin...</div>}>
          <DeletedSection
            deletedList={deletedList}
            onRestoreItem={handleRestoreFromTrash}
            onPermanentDeleteItem={handlePermanentWebDelete}
            onClose={() => setShowDeletedSection(false)}
          />
        </Suspense>
      )}
    </>
  );
}

export default BrowserFileBackend;
