// src/app/index.js

import React, { lazy, Suspense } from "react";

const BrowserFileBackend = lazy(() => import("./env/BrowserFileBackend"));

const AppIndex = (props) => {
  console.log("[SSDC] FileCleanser starting in WEB context.");

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
      <BrowserFileBackend {...props} />
    </Suspense>
  );
};

export default AppIndex;
