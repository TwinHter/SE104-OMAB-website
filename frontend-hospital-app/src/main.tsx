import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// NEW: Import QueryClient and QueryClientProvider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Optionally, import ReactQueryDevtools for debugging in development
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";

// NEW: Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {/* NEW: Wrap your App with QueryClientProvider */}
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
            {/* Optional: Add ReactQueryDevtools for development */}
            <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
    </StrictMode>
);
