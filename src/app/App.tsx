import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { WaitingApproval } from "./components/WaitingApproval";
import { LecturerDashboard } from "./components/LecturerDashboard";

type Screen = "welcome" | "login" | "register" | "waiting" | "lecturer";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");

  return (
    <div className="size-full">
      {screen === "welcome" && (
        <WelcomeScreen
          onLogin={() => setScreen("login")}
          onSignUp={() => setScreen("register")}
        />
      )}
      {screen === "login" && (
        <LoginScreen
          onBack={() => setScreen("welcome")}
          onLoginSuccess={() => setScreen("lecturer")}
          onGoRegister={() => setScreen("register")}
        />
      )}
      {screen === "register" && (
        <RegisterScreen
          onBack={() => setScreen("welcome")}
          onRegisterSuccess={() => setScreen("waiting")}
          onGoLogin={() => setScreen("login")}
        />
      )}
      {screen === "waiting" && (
        <WaitingApproval
          onGoBack={() => setScreen("register")}
          onBackToLogin={() => setScreen("login")}
        />
      )}
      {screen === "lecturer" && (
        <LecturerDashboard onLogout={() => setScreen("welcome")} />
      )}
    </div>
  );
}
