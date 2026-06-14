import { motion } from "motion/react";

const FONT = "'Google Sans Flex', sans-serif";
const GOLD = "#F59E0B";
const GOLD_DARK = "#D97706";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const TEXT_MUTED = "#9CA3AF";
const BORDER = "#E5E7EB";

interface WaitingApprovalProps {
  onBackToLogin: () => void;
  onGoBack?: () => void;
}

export function WaitingApproval({ onBackToLogin, onGoBack }: WaitingApprovalProps) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-6 py-12"
      style={{ background: "#FFFFFF", fontFamily: FONT }}
    >
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left — text content */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-lg"
        >
          {/* Label */}
          <p
            className="mb-4"
            style={{ color: GOLD_DARK, fontSize: "0.875rem", fontWeight: 600 }}
          >
            Application submitted
          </p>

          {/* Heading */}
          <h1
            className="mb-5"
            style={{
              color: TEXT_PRIMARY,
              fontSize: "clamp(2.2rem, 5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Waiting for<br />Approval
          </h1>

          {/* Description */}
          <p
            className="mb-8 leading-relaxed"
            style={{ color: TEXT_SECONDARY, fontSize: "1rem" }}
          >
            Your registration request has been submitted successfully. The system administrator will review your application and notify you via email once it has been approved.
          </p>

          {/* Helpful info line */}
          <p
            className="mb-8"
            style={{ color: TEXT_MUTED, fontSize: "0.9rem" }}
          >
            Here are some helpful links:
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onGoBack ?? onBackToLogin}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all"
              style={{
                background: "white",
                border: `1px solid ${BORDER}`,
                color: TEXT_PRIMARY,
                fontWeight: 500,
                fontSize: "0.9rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Go back
            </button>

            <button
              onClick={onBackToLogin}
              className="px-5 py-2.5 rounded-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.9rem",
                boxShadow: `0 6px 20px rgba(245,158,11,0.3)`,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px rgba(245,158,11,0.4)`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px rgba(245,158,11,0.3)`; }}
            >
              Return to login
            </button>
          </div>
        </motion.div>

        {/* Right — mail illustration */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="relative w-[340px] h-[340px]">
            {/* Scattered small circles */}
            <div className="absolute w-5 h-5 rounded-full" style={{ background: "#E5E7EB", top: "8%", left: "20%" }} />
            <div className="absolute w-3 h-3 rounded-full" style={{ background: "#F3F4F6", top: "15%", right: "10%" }} />
            <div className="absolute w-4 h-4 rounded-full" style={{ background: "#E5E7EB", bottom: "12%", left: "8%" }} />
            <div className="absolute w-2.5 h-2.5 rounded-full" style={{ background: "#F3F4F6", bottom: "20%", right: "18%" }} />

            {/* Large background circle */}
            <div
              className="absolute rounded-full"
              style={{
                width: "260px",
                height: "260px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -52%)",
                background: "linear-gradient(145deg, #F9FAFB 0%, #F3F4F6 100%)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
              }}
            />

            {/* Second overlapping circle (offset top-right) */}
            <div
              className="absolute rounded-full"
              style={{
                width: "190px",
                height: "190px",
                top: "4%",
                right: "4%",
                background: "linear-gradient(145deg, #FFFFFF 0%, #F3F4F6 100%)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
              }}
            />

            {/* Mail icon circle — bottom center, matches the search circle style */}
            <motion.div
              className="absolute rounded-full flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px",
                bottom: "6%",
                left: "50%",
                transform: "translateX(-50%)",
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
                boxShadow: `0 8px 28px rgba(245,158,11,0.35)`,
                zIndex: 10,
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

            {/* Envelope body — centered in the main circle */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                width: "130px",
                height: "95px",
                top: "50%",
                left: "50%",
                transform: "translate(-60%, -58%)",
                zIndex: 5,
              }}
            >
              <svg viewBox="0 0 130 95" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                {/* Envelope shadow/body */}
                <rect x="4" y="8" width="122" height="80" rx="10" fill="#E5E7EB" />
                <rect x="0" y="4" width="122" height="80" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
                {/* Envelope flap lines */}
                <path d="M0 14 L61 48 L122 14" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Lines suggesting text inside */}
                <rect x="18" y="56" width="50" height="5" rx="2.5" fill="#F3F4F6" />
                <rect x="18" y="67" width="36" height="5" rx="2.5" fill="#F3F4F6" />
              </svg>
            </div>

            {/* Pulsing ring around mail circle */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: "80px",
                height: "80px",
                bottom: "6%",
                left: "50%",
                transform: "translateX(-50%)",
                border: `2px solid ${GOLD}`,
                zIndex: 9,
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
