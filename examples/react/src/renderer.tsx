import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root")!);

export const renderer = (html: React.ReactElement) => {
  root.render(<React.StrictMode>{html}</React.StrictMode>);
};
