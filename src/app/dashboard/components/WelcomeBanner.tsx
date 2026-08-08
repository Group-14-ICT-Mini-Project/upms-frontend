import type { UserContext } from "../types";


interface WelcomeBannerProps {
  user: UserContext;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #7A0C0C 0%, #5C0808 100%)",
        borderRadius: 10,
        padding: "24px 28px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle decorative circle */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -20,
          right: 80,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          pointerEvents: "none",
        }}
      />

      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#F59E0B",
          margin: 0,
          marginBottom: 4,
          letterSpacing: "-0.01em",
        }}
      >
        Welcome, {user.name}
      </h1>
      <p style={{ fontSize: 13, color: "#FCA5A5", margin: 0, marginBottom: 2, fontWeight: 500 }}>
        {user.title}
      </p>
      {(user.faculty || user.department) && (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0 }}>
          {[user.faculty, user.department].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}
