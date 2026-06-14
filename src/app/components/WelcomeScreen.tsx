import { motion } from "motion/react";
import {
  ArrowRight,
  FileText,
  ShoppingCart,
  Package,
  PenLine,
  Check,
} from "lucide-react";

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const FONT = "'Google Sans Flex', sans-serif";
const NAVY = "#0a1628";
const GOLD = "#F59E0B";
const GOLD_DARK = "#D97706";

export function WelcomeScreen({
  onLogin,
  onSignUp,
}: WelcomeScreenProps) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)",
        fontFamily: FONT,
      }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-10 pt-7 pb-2"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5z"
                fill="white"
              />
              <path
                d="M2 17l10 5 10-5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                color: NAVY,
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              UPMS
            </div>
            <div
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ color: "#78716c" }}
            >
              University of Sri Jayewardenepura
            </div>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs tracking-widest uppercase"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: GOLD_DARK,
          }}
        >
          UPMS v2.0
        </div>
      </motion.header>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center"
        >
          <div
            className="text-xs tracking-[0.2em] uppercase mb-5"
            style={{ color: GOLD_DARK, fontWeight: 600 }}
          >
            Procurement Management System
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="text-center"
          style={{
            color: NAVY,
            fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: "900px",
          }}
        >
          Streamlined University
          <br />
          <span style={{ color: GOLD_DARK }}>Procurement</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center mt-6 max-w-xl"
          style={{
            color: "#57534e",
            fontSize: "1.05rem",
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          A unified digital platform for managing university
          procurement — from requisition to delivery, with
          approvals across every level.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-9"
        >
          <button
            onClick={onSignUp}
            className="group relative overflow-hidden px-7 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
              color: NAVY,
              fontWeight: 600,
              fontSize: "0.95rem",
              letterSpacing: "0.02em",
              minWidth: "170px",
              boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
            }}
          >
            Create Account
            <ArrowRight
              size={16}
              strokeWidth={2.4}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
          <button
            onClick={onLogin}
            className="px-7 py-3 rounded-lg transition-all duration-200 bg-[#00000000]"
            style={{
              background: "white",
              border: "1px solid #d6d3d1",
              color: NAVY,
              fontWeight: 500,
              fontSize: "0.95rem",
              letterSpacing: "0.02em",
              minWidth: "170px",
            }}
            onMouseEnter={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.borderColor = NAVY;
              (
                e.currentTarget as HTMLButtonElement
              ).style.background = "#fafaf9";
            }}
            onMouseLeave={(e) => {
              (
                e.currentTarget as HTMLButtonElement
              ).style.borderColor = "#d6d3d1";
              (
                e.currentTarget as HTMLButtonElement
              ).style.background = "white";
            }}
          >
            Sign In
          </button>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative w-full max-w-5xl mt-16"
        >
          {/* Grid background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-70"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="welcome-grid"
                width="56"
                height="56"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 56 0 L 0 0 0 56"
                  fill="none"
                  stroke="#78716c"
                  strokeWidth="0.9"
                  strokeDasharray="3 3"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#welcome-grid)"
            />
          </svg>

          <div className="relative flex items-center justify-between gap-4 py-10 px-4 sm:px-8">
            {/* Step 1: Requisition cards stack */}
            <div className="relative flex-1 flex justify-center">
              <div
                className="relative"
                style={{ width: "180px", height: "210px" }}
              >
                {[
                  {
                    label: "Stationery",
                    icon: <FileText size={14} />,
                    color: "#000",
                    offset: 0,
                    rot: -8,
                  },
                  {
                    label: "Lab Equipment",
                    icon: <Package size={14} />,
                    color: "#10B981",
                    offset: 18,
                    rot: -2,
                  },
                  {
                    label: "IT Hardware",
                    icon: <ShoppingCart size={14} />,
                    color: GOLD,
                    offset: 36,
                    rot: 6,
                  },
                ].map((c, i) => (
                  <div
                    key={c.label}
                    className="absolute bg-white rounded-xl p-3 shadow-md"
                    style={{
                      width: "130px",
                      height: "175px",
                      left: `${c.offset}px`,
                      top: `${i * 6}px`,
                      transform: `rotate(${c.rot}deg)`,
                      border: "1px solid #e7e5e4",
                      zIndex: i + 1,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: NAVY,
                          lineHeight: 1.15,
                        }}
                      >
                        Requisition
                        <br />
                        {c.label}
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: `${c.color}1a`,
                          color: c.color,
                        }}
                      >
                        {c.icon}
                      </div>
                    </div>
                    <div className="space-y-1.5 mt-3">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          background: "#e7e5e4",
                          width: "90%",
                        }}
                      />
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          background: "#e7e5e4",
                          width: "70%",
                        }}
                      />
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          background: "#e7e5e4",
                          width: "80%",
                        }}
                      />
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          background: "#e7e5e4",
                          width: "55%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex-shrink-0">
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{
                  background: "white",
                  border: "1px solid #e7e5e4",
                }}
              >
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  style={{ color: "#a8a29e" }}
                />
              </div>
            </div>

            {/* Step 2: Approval / signature */}
            <div className="flex-1 flex justify-center">
              <div
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center"
                style={{
                  width: "230px",
                  height: "230px",
                  border: "1px solid #e7e5e4",
                }}
              >
                <div className="relative w-full h-[110px] flex items-center justify-center">
                  <div
                    className="absolute inset-x-4 top-4 bottom-4 rounded-md"
                    style={{ border: `1.5px dashed ${GOLD}` }}
                  />
                  <svg
                    width="160"
                    height="70"
                    viewBox="0 0 160 70"
                    fill="none"
                  >
                    <path
                      d="M10 50 Q 20 20, 35 35 T 60 40 Q 75 20, 90 45 T 120 35 Q 135 20, 150 40"
                      stroke={NAVY}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M40 55 L 90 55"
                      stroke={NAVY}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="w-full border-t border-stone-200 mt-2 pt-3 text-center">
                  <div
                    style={{
                      color: NAVY,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    Dr. R. Perera
                  </div>
                  <div
                    style={{
                      color: GOLD_DARK,
                      fontSize: "0.7rem",
                    }}
                  >
                    Head of Department
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="flex-shrink-0">
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{
                  background: "white",
                  border: "1px solid #e7e5e4",
                }}
              >
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  style={{ color: "#a8a29e" }}
                />
              </div>
            </div>

            {/* Step 3: Purchase Order */}
            <div className="flex-1 flex justify-center">
              <div
                className="bg-white rounded-xl shadow-md p-5"
                style={{
                  width: "230px",
                  height: "230px",
                  border: "1px solid #e7e5e4",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{
                      background: `${GOLD}1a`,
                      color: GOLD_DARK,
                    }}
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <PenLine
                    size={14}
                    style={{ color: "#a8a29e" }}
                  />
                </div>
                <div
                  style={{
                    color: "#78716c",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  PO-2026-0042
                </div>
                <div
                  style={{
                    color: NAVY,
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    marginTop: "2px",
                  }}
                >
                  LKR 284,342
                </div>
                <div
                  style={{
                    color: "#78716c",
                    fontSize: "0.7rem",
                    marginTop: "2px",
                  }}
                >
                  Due in 15 days
                </div>
                <div className="mt-4 space-y-2">
                  {["Vendor", "Dept", "Approver"].map((k) => (
                    <div
                      key={k}
                      className="flex items-center gap-2"
                    >
                      <div
                        style={{
                          color: "#a8a29e",
                          fontSize: "0.65rem",
                          width: "44px",
                        }}
                      >
                        {k}
                      </div>
                      <div
                        className="flex-1 h-1.5 rounded-full"
                        style={{ background: "#e7e5e4" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-6 text-xs"
          style={{ color: "#a8a29e" }}
        >
          Authorized personnel only · University of Sri
          Jayewardenepura
        </motion.p>
      </div>

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 w-full h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD} 30%, ${GOLD} 70%, transparent)`,
        }}
      />
    </div>
  );
}