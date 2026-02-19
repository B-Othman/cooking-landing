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

    setEmail("");
    setErr(null);
    setDone(false);
    setLoading(false);

    setTimeout(() => inputRef.current?.focus(), 0);

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
      className="fixed inset-0 z-[9999] grid place-items-center p-[18px] backdrop-blur-[6px] bg-[color:var(--overlay)]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-[var(--modal-w)] shadow-[var(--shadow-modal)] border border-solid border-[color:var(--border-subtle)] p-[18px] rounded-[20px] bg-white max-[520px]:p-4 max-[520px]:rounded-[18px]"
        role="dialog"
        aria-modal="true"
        aria-label="Get notified"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="font-extrabold text-xl tracking-[-0.01em] text-[#0b1220]">
            Get Notified
          </div>

          <button
            type="button"
            className="w-10 h-10 cursor-pointer grid place-items-center text-lg text-[#0b1220] rounded-xl border-0 hover:-translate-y-px bg-black/5 hover:bg-black/10 transition-[transform,background] duration-150"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-3.5">
          {done ? (
            <div className="flex gap-3 items-start border border-solid border-[color:var(--brand-border)] p-3 rounded-2xl bg-[color:var(--brand-bg)]">
              <span className="w-[34px] h-[34px] text-white grid place-items-center font-black rounded-xl bg-[color:var(--brand-blue)]">
                ✓
              </span>
              <div>
                <div className="font-black text-[#0b1220] tracking-[-0.01em]">
                  You&apos;re on the list!
                </div>
                <div className="text-[color:var(--muted)] font-semibold text-sm mt-0.5">
                  We’ll notify you at{" "}
                  <span className="text-[#0b1220] font-extrabold">
                    {email.trim()}
                  </span>
                  .
                </div>
              </div>
            </div>
          ) : (
            <>
              <label
                className="block font-bold text-sm text-gray-900"
                htmlFor="notify-email"
              >
                Email address
              </label>

              <input
                id="notify-email"
                ref={inputRef}
                className="w-full h-[46px] border border-solid border-[color:var(--border-soft)] text-[15px] text-[#0b1220] mt-2 px-3.5 rounded-[14px] bg-white outline-none focus:shadow-[var(--shadow-focus)] focus:border-[color:var(--brand-blue)] placeholder:text-[color:var(--placeholder)]"
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

              {err ? (
                <div className="text-[#b42318] font-semibold text-[13px] mt-2.5">
                  {err}
                </div>
              ) : null}

              <div className="flex gap-2.5 justify-end mt-4 max-[520px]:flex-col-reverse">
                <button
                  type="button"
                  className="h-11 cursor-pointer font-extrabold text-sm px-3.5 rounded-[14px] border-0 bg-black/5 text-[#0b1220] disabled:opacity-60 disabled:cursor-not-allowed max-[520px]:w-full"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="h-11 cursor-pointer font-extrabold text-sm px-3.5 rounded-[14px] border-0 text-white bg-[color:var(--brand-blue)] hover:brightness-[0.98] disabled:opacity-60 disabled:cursor-not-allowed max-[520px]:w-full"
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
