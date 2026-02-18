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

    // reset state each open
    setEmail("");
    setErr(null);
    setDone(false);
    setLoading(false);

    // focus
    setTimeout(() => inputRef.current?.focus(), 0);

    // lock scroll
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
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
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="landing-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Get notified"
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
            <div className="landing-modalSuccess">
              <span className="landing-modalSuccessIcon" aria-hidden>
                ✓
              </span>
              <div>
                <div className="landing-modalSuccessTitle">
                  You&apos;re on the list!
                </div>
                <div className="landing-modalSuccessDesc">
                  We’ll notify you at{" "}
                  <span className="landing-modalEmail">{email.trim()}</span>.
                </div>
              </div>
            </div>
          ) : (
            <>
              <label className="landing-modalLabel" htmlFor="notify-email">
                Email address
              </label>

              <input
                id="notify-email"
                ref={inputRef}
                className="landing-modalInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
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
