import React, { useState } from "react";
import styles from "./FileCleanser.module.css";

const DeletedSection = ({
  deletedList = [],
  onRestoreItem,
  onPermanentDeleteItem,
  onEmptyTrash,
  onClose,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmptyTrash = () => {
    setShowConfirm(true);
  };

  const confirmEmptyTrash = () => {
    setShowConfirm(false);
    onEmptyTrash(); // Call parent handler to clear backend + state
  };

  return (
    <div className={styles.appContainer} style={{ zIndex: 100 }}>
      <header className={styles.topRightInfo}>
        <h2 className={styles.title}>Deleted Section</h2>
        <p className={styles.subtitle}>Items have a second chance</p>
        <button
          onClick={onClose}
          className={styles.selectFolderBtn}
          style={{
            textDecoration: "none",
            fontSize: "2rem",
            marginTop: "1rem",
            color: "black",
          }}
        >
          ↖ Close
        </button>
      </header>

      <main
        className={styles.workspace}
        style={{
          flexDirection: "column",
          padding: "100px 20px",
          gap: "1rem",
          maxWidth: "800px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "#000",
              margin: 0,
            }}
          >
            Trash
          </h1>
          {deletedList.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Empty Trash
            </button>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                textAlign: "center",
                maxWidth: "400px",
              }}
            >
              <h3 style={{ margin: "0 0 1rem 0", color: "#000" }}>
                Permanently Delete All Items?
              </h3>
              <p style={{ color: "#666", marginBottom: "2rem" }}>
                This action cannot be undone. All {deletedList.length} item(s)
                will be permanently deleted.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "#e0e0e0",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEmptyTrash}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}

        {deletedList.length === 0 ? (
          <div
            style={{ marginTop: "2rem", color: "#666", fontStyle: "italic" }}
          >
            Trash is empty.
          </div>
        ) : (
          <div style={{ width: "100%", marginTop: "1rem" }}>
            {deletedList.map((item, index) => (
              <div
                key={item.absolutePath || item.relativePath}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px 20px",
                  background: "#f4f4f4",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "#333",
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#777",
                      fontFamily: "monospace",
                    }}
                  >
                    Derive Mime: {item.mimeType}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => onRestoreItem(index)}
                    style={{
                      padding: "8px 15px",
                      borderRadius: "5px",
                      background: "#22c55e",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Restore
                  </button>

                  <button
                    onClick={() => onPermanentDeleteItem(index)}
                    style={{
                      padding: "8px 15px",
                      borderRadius: "5px",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Permanently Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeletedSection;
