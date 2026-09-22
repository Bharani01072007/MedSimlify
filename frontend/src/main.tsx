import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import "./styles.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  if (rootElement.hasChildNodes()) {
    startTransition(() => {
      hydrateRoot(
        rootElement,
        <StrictMode>
          <StartClient />
        </StrictMode>
      );
    });
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <StartClient />
      </StrictMode>
    );
  }
}
