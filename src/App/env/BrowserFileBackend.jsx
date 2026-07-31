// src/app/env/BrowserFileBackend.jsx

import React, { useState, Suspense, lazy } from "react";
import FileCleanser from "../ui/FileCleanser";

const DeletedSection = lazy(() => import("../ui/DeletedSection"));

function BrowserFileBackend() {
  const [directoryHandle, setDirectoryHandle] = useState(null);

  const [scannedFiles, setScannedFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentFileContent, setCurrentFileContent] = useState(null);

  const [deletedList, setDeletedList] = useState([]);
  const [showDeletedSection, setShowDeletedSection] = useState(false);

  // -----------------------------
  // Folder selection + scanning
  // -----------------------------

  const handleSelectFolder = async () => {
    try {
      const handle = await window.showDirectoryPicker({
        mode: "readwrite",
      });

      setDirectoryHandle(handle);

      const files = [];

      const recursiveScan = async (currentHandle, path = "") => {
        for await (const entry of currentHandle.values()) {
          const entryPath = path ? `${path}/${entry.name}` : entry.name;

          if (entry.kind === "directory") {
            await recursiveScan(entry, entryPath);
            continue;
          }

          const fileData = await entry.getFile();

          let typeHint = "other";

          if (fileData.type.startsWith("image/")) {
            typeHint = "image";
          } else if (fileData.type.startsWith("video/")) {
            typeHint = "video";
          } else if (fileData.type.startsWith("audio/")) {
            typeHint = "audio";
          } else if (
            fileData.type.includes("javascript") ||
            /\.(js|jsx|ts|tsx|css|html|json|md|txt)$/i.test(fileData.name)
          ) {
            typeHint = "code";
          }

          files.push({
            name: entry.name,

            relativePath: entryPath,

            typeHint,

            mimeType: fileData.type,

            lastModified: fileData.lastModified,

            fileHandle: entry,

            url: ["image", "video", "audio"].includes(typeHint)
              ? URL.createObjectURL(fileData)
              : null,
          });
        }
      };

      await recursiveScan(handle);

      setScannedFiles(files);
      setCurrentIndex(0);

      loadFileContent(files[0]);
    } catch (err) {
      console.error("[SSDC] Folder selection cancelled", err);
    }
  };

  // -----------------------------
  // File preview
  // -----------------------------

  const loadFileContent = async (file) => {
    if (file && file.typeHint === "code") {
      const data = await file.fileHandle.getFile();

      const text = await data.text();

      setCurrentFileContent(text);
    } else {
      setCurrentFileContent(null);
    }
  };

  // -----------------------------
  // Navigation
  // -----------------------------

  const nextFile = () => {
    const next = currentIndex + 1;

    setCurrentIndex(next);

    loadFileContent(scannedFiles[next]);
  };

  const handleKeep = () => {
    nextFile();
  };

  // -----------------------------
  // Virtual trash
  // -----------------------------

  const handleVirtualTrash = () => {
    const file = scannedFiles[currentIndex];

    if (!file) return;

    setDeletedList((prev) => [...prev, file]);

    const remaining = scannedFiles.filter((_, i) => i !== currentIndex);

    setScannedFiles(remaining);

    if (currentIndex >= remaining.length) {
      setCurrentIndex(Math.max(0, remaining.length - 1));
    }
  };

  // -----------------------------
  // Restore
  // -----------------------------

  const handleRestoreFromTrash = (index) => {
    const file = deletedList[index];

    setDeletedList((prev) => prev.filter((_, i) => i !== index));

    setScannedFiles((prev) => [...prev, file]);
  };

  // -----------------------------
  // Real filesystem delete helper
  // -----------------------------

  const deleteFile = async (root, relativePath) => {
    const parts = relativePath.split("/");

    let current = root;

    while (parts.length > 1) {
      const folder = parts.shift();

      current = await current.getDirectoryHandle(folder);
    }

    await current.removeEntry(parts[0]);
  };

  // -----------------------------
  // Permanent delete
  // -----------------------------

  const handlePermanentWebDelete = async (index) => {
    const file = deletedList[index];

    try {
      await deleteFile(directoryHandle, file.relativePath);

      setDeletedList((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Delete failed", err);

      alert("Unable to delete file");
    }
  };

  // -----------------------------
  // Empty trash
  // -----------------------------

  const handleEmptyTrash = async () => {
    for (const file of deletedList) {
      try {
        await deleteFile(directoryHandle, file.relativePath);
      } catch (err) {
        console.error(err);
      }
    }

    setDeletedList([]);
  };

  const currentFile = scannedFiles[currentIndex] || null;

  const isFirstTime = !directoryHandle || scannedFiles.length === 0;

  return (
    <>
      <FileCleanser
        isFirstTime={isFirstTime}
        file={currentFile}
        onSelectFolder={handleSelectFolder}
        onKeep={handleKeep}
        onDelete={handleVirtualTrash}
        deletedList={deletedList}
        openTrash={() => setShowDeletedSection(true)}
        version="1.2-WebFS"
      />

      {showDeletedSection && (
        <Suspense fallback={<div>Loading Trash...</div>}>
          <DeletedSection
            deletedList={deletedList}
            onRestoreItem={handleRestoreFromTrash}
            onPermanentDeleteItem={handlePermanentWebDelete}
            onEmptyTrash={handleEmptyTrash}
            onClose={() => setShowDeletedSection(false)}
          />
        </Suspense>
      )}
    </>
  );
}

export default BrowserFileBackend;
