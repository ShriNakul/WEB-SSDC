import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router-dom";

import Header from "./Components/HeaderComponents/Header.jsx";
import Home from "./Pages/Home.jsx";
import Installation from "./Pages/Installation.jsx";

// Import without the extension, so the bundler automatically grabs index.jsx
import FileCleanserApp from "./App/index";
import Donate from "./Pages/Donate.jsx";

function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/WEB-SSDC/" element={<Home />} />
        <Route path="/WEB-SSDC/installation" element={<Installation />} />
        <Route path="/WEB-SSDC/donate" element={<Donate />} />
        <Route path="/WEB-SSDC/app/*" element={<FileCleanserApp />} />
      </Routes>
    </div>
  );
}

export default App;
