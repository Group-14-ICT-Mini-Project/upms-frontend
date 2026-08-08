import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import { AuthProvider } from "./app/auth/AuthContext";
import { ProcurementProvider } from "./app/dashboard/ProcurementContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ProcurementProvider>
        <App />
      </ProcurementProvider>
    </AuthProvider>
  </BrowserRouter>
);
