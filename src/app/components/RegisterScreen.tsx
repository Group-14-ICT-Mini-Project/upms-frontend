import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ChevronDown, ArrowRight } from "lucide-react";

const FONT = "'Google Sans Flex', sans-serif";
const NAVY = "#0a1628";
const GOLD = "#F59E0B";
const GOLD_DARK = "#D97706";

const ROLES = [
  "Lecturer",
  "Head of Department",
  "Dean",
  "Faculty Bursar",
  "Bursar",
  "Vice Chancellor",
  "Registrar",
  "Supplier Division Clerk",
];

interface RegisterScreenProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
  onGoLogin: () => void;
}

export function RegisterScreen({ onBack, onRegisterSuccess, onGoLogin }: RegisterScreenProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "At least 8 characters";
    if (!form.role) errs.role = "Please select your role";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess();
    }, 1400);
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    background: "white",
    border: `1px solid ${hasError ? "#EF4444" : "#e7e5e4"}`,
    color: NAVY,
    fontFamily: FONT,
    fontSize: "0.9rem",
  });

  return (
    <div
      className="relative min-h-screen w-full flex p-4 sm:p-6"
      style={{
        background: "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)",
        fontFamily: FONT,
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 w-full h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD} 30%, ${GOLD} 70%, transparent)` }}
      />

      {/* Left testimonial / branding card */}
      <motion.aside
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col w-[420px] shrink-0 rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)",
          border: "1px solid #e7e5e4",
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid #e7e5e4",
            color: "#57534e",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          ← Back
        </button>

        {/* Request Access content */}
        <div className="flex-1 flex flex-col justify-center px-10 pt-20 pb-8">
          {/* Header */}
          <div className="mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
              style={{ background: `rgba(245,158,11,0.12)`, border: `1px solid rgba(245,158,11,0.25)` }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              <span style={{ color: GOLD_DARK, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em" }}>
                REQUEST ACCESS
              </span>
            </div>
            <h2
              style={{
                color: NAVY,
                fontSize: "1.55rem",
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
              }}
            >
              Register your details<br />to request access.
            </h2>
            <p
              className="mt-3"
              style={{ color: "#78716c", fontSize: "0.875rem", lineHeight: 1.55 }}
            >
              Your application will be reviewed by the system administrator.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-0">
            {[
              { num: "01", label: "Fill in your details" },
              { num: "02", label: "Submit registration" },
              { num: "03", label: "Await admin approval" },
              { num: "04", label: "Access granted via email" },
            ].map((step, i, arr) => (
              <div key={step.num} className="flex items-start gap-4">
                {/* Step indicator column */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: i === 0
                        ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`
                        : "white",
                      border: i === 0 ? "none" : "1.5px solid #e7e5e4",
                      color: i === 0 ? NAVY : "#a8a29e",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {step.num}
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{
                        background: i === 0
                          ? `linear-gradient(180deg, ${GOLD_DARK}, #e7e5e4)`
                          : "#e7e5e4",
                        minHeight: "28px",
                      }}
                    />
                  )}
                </div>
                {/* Label */}
                <div className="pt-1.5 pb-6">
                  <span
                    style={{
                      color: i === 0 ? NAVY : "#57534e",
                      fontSize: "0.9rem",
                      fontWeight: i === 0 ? 600 : 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-between py-8 px-4 sm:px-12 relative">
        {/* Mobile back */}
        <button
          onClick={onBack}
          className="lg:hidden self-start flex items-center gap-2 mb-6"
          style={{ color: "#57534e", fontSize: "0.85rem", fontWeight: 500 }}
        >
          ← Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-[400px] flex-1 flex flex-col justify-center"
        >
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1
            className="text-center"
            style={{
              color: NAVY,
              fontSize: "1.7rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Create an Account
          </h1>
          <p
            className="text-center mt-1.5 mb-6"
            style={{ color: "#78716c", fontSize: "0.88rem" }}
          >
            Sign up to get started
          </p>

          {/* SSO */}
          <button
            type="button"
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 mb-2.5 transition-all"
            style={{
              background: "white",
              border: "1px solid #e7e5e4",
              color: NAVY,
              fontWeight: 500,
              fontSize: "0.88rem",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "#a8a29e")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "#e7e5e4")}
          >
            <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            Continue with Microsoft Outlook
          </button>
          
        
          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "#e7e5e4" }} />
            <span style={{ color: "#a8a29e", fontSize: "0.78rem" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "#e7e5e4" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  className="block mb-1"
                  style={{ color: NAVY, fontSize: "0.78rem", fontWeight: 600 }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="Kasun"
                  className="w-full px-3 py-2.5 rounded-lg outline-none"
                  style={inputStyle(!!errors.firstName)}
                />
                {errors.firstName && (
                  <p className="mt-1 text-red-500" style={{ fontSize: "0.72rem" }}>
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block mb-1"
                  style={{ color: NAVY, fontSize: "0.78rem", fontWeight: 600 }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Perera"
                  className="w-full px-3 py-2.5 rounded-lg outline-none"
                  style={inputStyle(!!errors.lastName)}
                />
                {errors.lastName && (
                  <p className="mt-1 text-red-500" style={{ fontSize: "0.72rem" }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="block mb-1"
                style={{ color: NAVY, fontSize: "0.78rem", fontWeight: 600 }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#a8a29e" }}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="name@sjp.ac.lk"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg outline-none"
                  style={inputStyle(!!errors.email)}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-red-500" style={{ fontSize: "0.72rem" }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className="block mb-1"
                style={{ color: NAVY, fontSize: "0.78rem", fontWeight: 600 }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#a8a29e" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 8 characters"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg outline-none"
                  style={inputStyle(!!errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#a8a29e" }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-500" style={{ fontSize: "0.72rem" }}>
                  {errors.password}
                </p>
              )}
              {form.password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full"
                      style={{
                        background:
                          form.password.length >= i * 3
                            ? i <= 1
                              ? "#EF4444"
                              : i <= 2
                              ? GOLD
                              : i <= 3
                              ? "#3B82F6"
                              : "#10B981"
                            : "#e7e5e4",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                className="block mb-1"
                style={{ color: NAVY, fontSize: "0.78rem", fontWeight: 600 }}
              >
                Applied Role
              </label>
              <div className="relative">
                <select
                  value={form.role}
                  onChange={set("role")}
                  className="w-full px-3 py-2.5 rounded-lg outline-none appearance-none cursor-pointer"
                  style={{
                    ...inputStyle(!!errors.role),
                    color: form.role ? NAVY : "#a8a29e",
                  }}
                >
                  <option value="" disabled>
                    Select your role…
                  </option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#a8a29e" }}
                />
              </div>
              {errors.role && (
                <p className="mt-1 text-red-500" style={{ fontSize: "0.72rem" }}>
                  {errors.role}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 mt-1 transition-all"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                color: NAVY,
                fontWeight: 600,
                fontSize: "0.92rem",
                boxShadow: "0 6px 20px rgba(245,158,11,0.3)",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Submitting…" : (
                <>
                  Submit Your Request 
                  <ArrowRight size={15} strokeWidth={2.4} />
                </>
              )}
            </button>
          </form>

          <p
            className="text-center mt-5"
            style={{ color: "#78716c", fontSize: "0.85rem" }}
          >
            Already have an account?{" "}
            <button
              onClick={onGoLogin}
              style={{ color: GOLD_DARK, fontWeight: 600 }}
            >
              Sign in
            </button>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="flex items-center gap-6 mt-6" style={{ color: "#a8a29e", fontSize: "0.78rem" }}>
          <button className="hover:text-stone-700 transition-colors">Privacy</button>
          <button className="hover:text-stone-700 transition-colors">Terms</button>
          <button className="hover:text-stone-700 transition-colors">Cookies</button>
        </div>
      </div>
    </div>
  );
}
