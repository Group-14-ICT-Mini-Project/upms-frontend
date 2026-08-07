import type { UserContext } from "../types";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}

interface WelcomeBannerProps {
  user: UserContext;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  return (
    <div
      style={{
        marginBottom: 28,
        paddingBottom: 20,
        borderBottom: "1px solid #F0F2F5",
      }}
    >
      {/* Greeting line */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: "#9CA3AF",
          margin: 0,
          marginBottom: 4,
          letterSpacing: "0.01em",
        }}
      >
        {getGreeting()}
      </p>

      {/* Name — bold hero text */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1A2332",
          margin: 0,
          marginBottom: 5,
          letterSpacing: "-0.4px",
          lineHeight: 1.2,
        }}
      >
        {user.name}
      </h1>

      {/* Faculty · Department */}
      {(user.faculty || user.department) && (
        <p
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "#9CA3AF",
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          {[user.faculty, user.department].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}
