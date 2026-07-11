// src/components/contact/ContactForm.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { submitContactMessage } from "../../api/contactApi";
import type { ContactMessagePayload } from "../../types/contact";
import { useTilt } from "../../hooks/useTilt";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_FORM: ContactMessagePayload = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const fieldWrapClasses = "relative";
const inputBaseClasses =
  "w-full bg-[#0A0F1E] border border-[#00B4D8]/15 rounded-lg px-4 pt-5 pb-2 text-white text-sm outline-none transition-all duration-300 focus:border-[#00B4D8] focus:shadow-[0_0_0_3px_rgba(0,180,216,0.15)]";

function floatingLabelClasses(active: boolean) {
  return `absolute left-4 pointer-events-none transition-all duration-200 origin-left ${
    active
      ? "top-1.5 text-[10px] text-[#00B4D8] scale-100"
      : "top-3.5 text-sm text-slate-500 scale-100"
  }`;
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactMessagePayload>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const tilt = useTilt(6);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      await submitContactMessage(form);
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Contact form submission failed", err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email us directly.");
    }
  };

  const isActive = (field: string, value: string) => focused === field || value.length > 0;

  return (
    // Outer wrapper holds the animated gradient-glow "border". The glow is a
    // blurred rotating gradient sitting BEHIND the real card, peeking out
    // around the edges — a common trick for a glowing-border effect that
    // doesn't fight with rounded corners or actual border styling.
    <div className="relative p-[2px] rounded-2xl overflow-hidden">
      <div className="absolute inset-[-50%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,#00B4D8_15%,transparent_30%,transparent_70%,#00F5FF_85%,transparent_100%)] opacity-70" />

      <motion.div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="relative bg-[#0D1B2A] rounded-2xl p-8 overflow-hidden will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#00B4D8]/10 blur-[80px] pointer-events-none" />

        {/* Ambient bubbles drifting inside the card itself, always running */}
        {[...Array(4)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#00B4D8]/30 pointer-events-none"
            style={{
              width: `${3 + (i % 2) * 2}px`,
              height: `${3 + (i % 2) * 2}px`,
              left: `${20 + i * 22}%`,
              bottom: "4%",
            }}
            animate={{ y: [0, -340], opacity: [0, 0.7, 0] }}
            transition={{ duration: 5 + i * 0.8, repeat: Infinity, delay: i * 1.1, ease: "easeIn" }}
          />
        ))}

        <div className="relative z-10 flex items-center gap-3 mb-1">
          {/* Small animated icon badge next to the heading */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-9 h-9 rounded-lg bg-[#00B4D8]/15 border border-[#00B4D8]/30 flex items-center justify-center flex-shrink-0"
          >
            <MessageCircle size={16} className="text-[#00B4D8]" />
          </motion.div>
          <h2 className="font-heading font-semibold text-2xl text-white">
            Send us a message
          </h2>
        </div>
        <p className="text-slate-500 text-sm mb-6 relative z-10 ml-12">
          We typically respond within 1-2 business days.
        </p>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center py-10 relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
            >
              <CheckCircle2 className="text-[#00B4D8] mb-4" size={48} />
            </motion.div>
            <h3 className="font-heading font-semibold text-white text-lg mb-2">
              Message sent
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Thanks for reaching out — we'll get back to you soon.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-[#00B4D8] text-sm font-medium hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={fieldWrapClasses}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className={inputBaseClasses}
                />
                <label htmlFor="name" className={floatingLabelClasses(isActive("name", form.name))}>
                  Your name
                </label>
              </div>

              <div className={fieldWrapClasses}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  maxLength={100}
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className={inputBaseClasses}
                />
                <label htmlFor="email" className={floatingLabelClasses(isActive("email", form.email))}>
                  Email address
                </label>
              </div>
            </div>

            <div className={fieldWrapClasses}>
              <input
                type="text"
                name="subject"
                id="subject"
                required
                maxLength={150}
                value={form.subject}
                onChange={handleChange}
                onFocus={() => setFocused("subject")}
                onBlur={() => setFocused(null)}
                className={inputBaseClasses}
              />
              <label htmlFor="subject" className={floatingLabelClasses(isActive("subject", form.subject))}>
                What's this about?
              </label>
            </div>

            <div className={fieldWrapClasses}>
              <textarea
                name="message"
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                className={`${inputBaseClasses} resize-none`}
              />
              <label htmlFor="message" className={floatingLabelClasses(isActive("message", form.message))}>
                Tell us a bit more...
              </label>
            </div>

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3"
              >
                <AlertCircle size={16} />
                {errorMsg}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={status === "submitting"}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(0,180,216,0.4)",
                  "0 0 22px rgba(0,180,216,0.55)",
                  "0 0 0px rgba(0,180,216,0.4)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: status === "submitting" ? 1 : 1.015 }}
              whileTap={{ scale: status === "submitting" ? 1 : 0.98 }}
              className="relative w-full inline-flex items-center justify-center gap-2 bg-[#00B4D8] hover:bg-[#00F5FF] disabled:opacity-50 disabled:cursor-not-allowed text-[#0A0F1E] font-semibold px-6 py-3 rounded-xl transition-colors duration-300 overflow-hidden group"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative z-10 inline-flex items-center gap-2">
                {status === "submitting" ? (
                  "Sending..."
                ) : (
                  <>
                    Send message <Send size={16} />
                  </>
                )}
              </span>
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}