import { useState } from "react";
import { motion } from "motion/react";

const FONT = "'Google Sans Flex', sans-serif";
const NAVY = "#0a1628";
const GOLD = "#F59E0B";
const GOLD_DARK = "#D97706";

// Light theme tokens
const PAGE_BG = "#F3F4F6";
const CARD_BG = "#FFFFFF";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const TEXT_MUTED = "#9CA3AF";
const BORDER = "#E5E7EB";
const INPUT_BG = "#FFFFFF";

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onGoRegister: () => void;
}

export function LoginScreen({ onBack, onLoginSuccess, onGoRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [forgotSent, setForgotSent] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onLoginSuccess(); }, 1200);
  };

  const inputBase: React.CSSProperties = {
    background: INPUT_BG,
    border: `1px solid ${BORDER}`,
    color: TEXT_PRIMARY,
    fontFamily: FONT,
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4"
      style={{ background: PAGE_BG, fontFamily: FONT }}
    >
      {/* Back button — top left */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
        style={{
          background: CARD_BG,
          border: `1px solid ${BORDER}`,
          color: TEXT_SECONDARY,
          fontSize: "0.8rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = TEXT_PRIMARY; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = TEXT_SECONDARY; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] rounded-2xl p-8"
        style={{
          background: CARD_BG,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
              boxShadow: `0 8px 24px rgba(245,158,11,0.35)`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1
            className="mb-1.5"
            style={{ color: TEXT_PRIMARY, fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            Sign In
          </h1>
          <p style={{ color: TEXT_SECONDARY, fontSize: "0.875rem" }}>
            Enter your institutional credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1.5" style={{ color: TEXT_PRIMARY, fontSize: "0.8rem", fontWeight: 500 }}>
              Institutional Email
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="name@sjp.ac.lk"
                className="w-full pl-10 pr-4 py-3 rounded-xl"
                style={{
                  ...inputBase,
                  border: `1px solid ${errors.email ? "#EF4444" : BORDER}`,
                }}
                onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = GOLD; }}
                onBlur={(e) => { if (!errors.email) e.currentTarget.style.borderColor = BORDER; }}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-red-400" style={{ fontSize: "0.75rem" }}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label style={{ color: TEXT_PRIMARY, fontSize: "0.8rem", fontWeight: 500 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!email) { setErrors((p) => ({ ...p, email: "Enter your email first" })); return; }
                  setForgotSent(true);
                  setTimeout(() => setForgotSent(false), 4000);
                }}
                style={{ color: GOLD, fontSize: "0.78rem", fontWeight: 500 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#FCD34D"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl"
                style={{
                  ...inputBase,
                  border: `1px solid ${errors.password ? "#EF4444" : BORDER}`,
                }}
                onFocus={(e) => { if (!errors.password) e.currentTarget.style.borderColor = GOLD; }}
                onBlur={(e) => { if (!errors.password) e.currentTarget.style.borderColor = BORDER; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: TEXT_MUTED }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = TEXT_SECONDARY; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = TEXT_MUTED; }}
              >
                {showPassword ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" />
                    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-red-400" style={{ fontSize: "0.75rem" }}>{errors.password}</p>
            )}
          </div>

          {/* Remember for 30 days */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none" style={{ color: TEXT_SECONDARY, fontSize: "0.82rem" }}>
            <div
              className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
              style={{
                background: remember ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` : "transparent",
                border: remember ? "none" : `1.5px solid ${BORDER}`,
              }}
              onClick={() => setRemember((p) => !p)}
            >
              {remember && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            Remember for 30 days
          </label>

          {/* Sign In button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full transition-all duration-200 flex items-center justify-center gap-2 mt-1"
            style={{
              background: isLoading ? `rgba(245,158,11,0.6)` : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
              color: NAVY,
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "0.01em",
              boxShadow: isLoading ? "none" : `0 8px 28px rgba(245,158,11,0.35)`,
            }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3" />
                  <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                </svg>
                Signing in...
              </>
            ) : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: BORDER }} />
          <span style={{ color: TEXT_MUTED, fontSize: "0.75rem", letterSpacing: "0.08em" }}>OR</span>
          <div className="flex-1 h-px" style={{ background: BORDER }} />
        </div>

        {/* Microsoft Outlook SSO */}
        <button
          type="button"
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all"
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            color: TEXT_PRIMARY,
            fontWeight: 500,
            fontSize: "0.88rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#D1D5DB";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = CARD_BG;
            (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER;
          }}
        >
          <svg width="17" height="17" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
            <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
          </svg>
          Continue with Microsoft Outlook
        </button>

        {/* Register link */}
        <p className="text-center mt-6" style={{ color: TEXT_SECONDARY, fontSize: "0.85rem" }}>
          Don't have an account?{" "}
          <button
            onClick={onGoRegister}
            style={{ color: GOLD, fontWeight: 600 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#FCD34D"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
          >
            Request access
          </button>
        </p>

        {/* Forgot password toast */}
        {forgotSent && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#10B981",
              fontSize: "0.8rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
              <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Password reset link sent to <strong>{email}</strong>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
