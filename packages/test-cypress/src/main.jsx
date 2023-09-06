import React from "react";
import { createRoot } from "react-dom/client";
import { CypressTest } from "./CypressTest.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@doenet/doenetml/style.css";

const root = createRoot(document.getElementById("root"));
root.render(
    <Router>
        <Routes>
            <Route path="*" element={<CypressTest />} />
        </Routes>
    </Router>,
);
