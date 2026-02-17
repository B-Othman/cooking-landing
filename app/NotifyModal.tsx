"use client";

import { useEffect, useRef, useState } from "react";

export default function NotifyModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;

    setErr(null);
    setDone(false);
    setLoading(false);

    setTimeout(() => inputRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const submit = async () => {
    const v = email.trim();
    if (!isValidEmail(v)) {
      setErr("Please enter a valid email.");
      return;
    }

    try {
      setErr(null);
      setLoading(true);
      await onSubmit?.(v);
      setDone(true);
    } catch {
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="landing-modalOverlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="landing-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Notify me modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="landing-modalTop">
          <div className="landing-modalTitle">Get Notified</div>

          <button
            type="button"
            className="landing-modalClose"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="landing-modalBody">
          {done ? (
            <div style={{ fontWeight: 700, color: "#111" }}>
              ✅ Thanks! We’ll notify you at <span>{email.trim()}</span>.
            </div>
          ) : (
            <>
              <div className="landing-modalLabel">Email address</div>
              <input
                ref={inputRef}
                className="landing-modalInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />

              {err ? <div className="landing-modalError">{err}</div> : null}

              <div className="landing-modalActions">
                <button
                  type="button"
                  className="landing-modalBtn landing-modalBtnGhost"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="landing-modalBtn landing-modalBtnPrimary"
                  onClick={submit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
