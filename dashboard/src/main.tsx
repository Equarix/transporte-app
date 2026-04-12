import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "./components/providers/Providers.tsx";
import AuthProvider from "./components/providers/AuthContext.tsx";

const query = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <QueryClientProvider client={query}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </Providers>
  </StrictMode>,
);
