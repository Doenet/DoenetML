import React from "react";
import { createRoot } from "react-dom/client";
import { CypressTest } from "./CypressTest";
import "@doenet/doenetml/style.css";

const root = createRoot(document.getElementById("root"));
root.render(<CypressTest />);
