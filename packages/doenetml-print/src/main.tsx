import ReactDom from "react-dom/client";

import "./style.css";
import { RenderingUi } from "./rendering-ui";

const App = () => {
    return <RenderingUi />;
};

const root = ReactDom.createRoot(document.getElementById("app")!);
root.render(<App />);
