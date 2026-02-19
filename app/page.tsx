"use client";

import type React from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import NotifyModal from "./NotifyModal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function HeroBlock() {
  return (
    <>
      <div
        className="w-full grid place-items-center relative max-[1100px]:w-[var(--hero-frame-w-m)]"
        aria-hidden
      >
        <Image
          src="/pilots.png"
          alt="Pilots"
          width={840}
          height={634}
          priority
          className="w-[var(--hero-img-w)] max-[1100px]:w-[var(--hero-img-w-m)] h-auto block -translate-y-1.5 max-[1100px]:-translate-y-1 [filter:var(--drop)]"
        />
      </div>

      <div className="text-[length:var(--caption-size)] italic font-semibold text-[color:var(--landing-text)] text-center max-w-[48ch] mt-1.5">
        Advancing aviation expertise through knowledge, partnership, and
        professionalism.
      </div>
    </>
  );
}

export default function Page() {
  const [open, setOpen] = useState(false);

  // detect mobile/tablet
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1100px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Slider
  const trackRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);

  const [x, setX] = useState(0);
  const xRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [handleW, setHandleW] = useState(56);
  useEffect(() => {
    const el = handleRef.current;
    if (!el) return;

    const update = () => setHandleW(el.clientWidth || 56);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const INSET = 10;

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));

  const getMaxX = () => {
    const track = trackRef.current;
    const handle = handleRef.current;
    if (!track || !handle) return 0;
    return Math.max(0, track.clientWidth - handle.clientWidth - INSET * 2);
  };

  const reset = () => {
    xRef.current = 0;
    setX(0);
  };

  const openModal = () => setOpen(true);

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  // Desktop click -> animate slide then open modal
  const slideToEndAndOpen = () => {
    const max = getMaxX();
    if (!max) return openModal();
    if (animating) return;

    setAnimating(true);

    const from = xRef.current;
    const to = max;

    const duration = 320;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = clamp((now - start) / duration, 0, 1);
      const next = from + (to - from) * easeOut(t);

      xRef.current = next;
      setX(next);

      if (t < 1) requestAnimationFrame(tick);
      else {
        xRef.current = to;
        setX(to);
        setAnimating(false);
        setTimeout(openModal, 120);
      }
    };

    requestAnimationFrame(tick);
  };

  // Mobile drag only
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isMobile) return;

    const maxX = getMaxX();
    if (!maxX) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);

    const startClientX = e.clientX;
    const startX = xRef.current;

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      const dx = ev.clientX - startClientX;
      const next = clamp(startX + dx, 0, maxX);
      xRef.current = next;
      setX(next);
    };

    const up = () => {
      setDragging(false);

      const max = getMaxX();
      const current = xRef.current;
      const done = max > 0 && current >= max * 0.92;

      if (done) {
        xRef.current = max;
        setX(max);
        setTimeout(openModal, 150);
      } else {
        reset();
      }

      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const fillW = Math.max(0, INSET + handleW + x);

  return (
    <main
      className={[
        jakarta.className,
        // viewport (desktop + mobile)
        "min-h-[100dvh] grid place-items-center justify-center overflow-hidden",
        "p-[var(--vp-pad)] max-[1100px]:p-[var(--vp-pad-m)]",
        "bg-[color:var(--landing-blue)]",
      ].join(" ")}
    >
      <section
        className={[
          "w-[var(--card-w)] h-[var(--card-h)] rounded-[var(--card-radius)]",
          "shadow-[var(--shadow-card)] overflow-hidden bg-white",
          // mobile: keep equal blue frame + scroll inside card
          "max-[1100px]:max-h-[var(--card-max-h-m)] max-[1100px]:overflow-y-auto",
          "max-[1100px]:[-webkit-overflow-scrolling:touch]",
        ].join(" ")}
      >
        <div
          className={[
            "w-full h-full p-[var(--card-pad)]",
            "grid grid-cols-[var(--landing-cols)] items-center gap-[var(--col-gap)]",
            "content-center justify-center",
            "max-[1100px]:h-auto max-[1100px]:grid-cols-1 max-[1100px]:gap-[22px]",
          ].join(" ")}
        >
          {/* LEFT */}
          <div className="min-w-0 flex flex-col items-start max-[1100px]:items-center max-[1100px]:text-center">
            <div className="text-[color:var(--landing-text)] font-bold text-[length:var(--kicker)] leading-[1.15]">
              We Are
            </div>

            <h1 className="text-[color:var(--landing-title)] font-extrabold text-[length:var(--title)] leading-[1.03] tracking-[-0.02em] mt-2.5 mb-0 mx-0">
              {/* Desktop */}
              <span className="inline max-[1100px]:hidden">
                Elevating Our <br />
                Digital Experience
              </span>

              {/* Mobile */}
              <span className="hidden max-[1100px]:inline">
                Elevating <br />
                Our Digital Experience
              </span>
            </h1>

            <p className="text-[color:var(--landing-text)] font-medium text-[length:var(--desc)] leading-[1.45] max-w-[56ch] mt-4 mb-0 mx-0 max-[1100px]:mx-auto">
              ICS Aviation is preparing a renewed digital platform designed to
              better serve aviation professionals, institutions, and partners.
              Our upcoming website will provide improved access to our training
              portfolio, advisory capabilities, and international cooperation
              initiatives. Stay connected as we prepare to launch.
            </p>

            {/* MOBILE HERO */}
            <div className="hidden max-[1100px]:block -translate-y-2 mt-[var(--hero-slot-mt)]">
              <HeroBlock />
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-[var(--actions-gap)] mt-[var(--actions-mt)]">
              {/* Slider */}
              <div
                ref={trackRef}
                className="w-[var(--slide-w)] h-[var(--slide-h)] shadow-[var(--shadow-slider)] relative overflow-hidden select-none touch-pan-y cursor-pointer rounded-full mx-auto bg-[#333]"
                aria-label="Stay informed"
                role={!isMobile ? "button" : undefined}
                tabIndex={!isMobile ? 0 : undefined}
                onClick={() => {
                  if (!isMobile) slideToEndAndOpen();
                }}
                onKeyDown={(e) => {
                  if (!isMobile && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    slideToEndAndOpen();
                  }
                }}
              >
                <div
                  className={[
                    "absolute left-0 inset-y-0 w-0 rounded-full",
                    "transition-[width] duration-[220ms] ease-out",
                    dragging || animating ? "transition-none" : "",
                  ].join(" ")}
                  style={{ width: fillW, background: "var(--slide-fill)" }}
                  aria-hidden
                />

                <div className="absolute inset-0 grid place-items-center text-white font-bold text-[length:var(--slide-text)] tracking-[-0.01em] pointer-events-none">
                  Stay Informed
                </div>

                <div className="absolute right-[18px] top-1/2 -translate-y-1/2 text-white pointer-events-none grid place-items-center text-[length:var(--slide-arrow)]">
                  <FiChevronRight />
                </div>

                <button
                  ref={handleRef}
                  type="button"
                  className="absolute left-[var(--slide-inset)] top-1/2 w-[var(--handle)] h-[var(--handle)] grid place-items-center cursor-grab active:cursor-grabbing will-change-transform touch-none shadow-[var(--shadow-handle)] p-0 rounded-full border-0 bg-white"
                  onPointerDown={onPointerDown}
                  onClick={(e) => {
                    if (!isMobile) {
                      e.preventDefault();
                      e.stopPropagation();
                      slideToEndAndOpen();
                    }
                  }}
                  aria-label={isMobile ? "Drag to open" : "Click to open"}
                  style={{
                    transform: `translate3d(${x}px, -50%, 0)`,
                    transition:
                      dragging || animating ? "none" : "transform 220ms ease",
                  }}
                >
                  <MdEmail className="text-[length:var(--slide-mail)] text-[color:var(--brand-blue)]" />
                </button>
              </div>

              {/* Socials */}
              <div className="flex gap-[var(--social-gap)] flex-wrap justify-center w-full">
                <a
                  className="w-[var(--social)] h-[var(--social)] shadow-[var(--shadow-social)] grid place-items-center no-underline transition-transform duration-150 ease-out rounded-full border border-solid border-[color:var(--border-soft)] hover:-translate-y-0.5 bg-white"
                  href="https://www.facebook.com/ICS1Aviation"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebookF className="text-[length:var(--social-icon)] text-[#555]" />
                </a>

                <a
                  className="w-[var(--social)] h-[var(--social)] shadow-[var(--shadow-social)] grid place-items-center no-underline transition-transform duration-150 ease-out rounded-full border border-solid border-[color:var(--border-soft)] hover:-translate-y-0.5 bg-white"
                  href="https://www.linkedin.com/company/ics-aviation/"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedinIn className="text-[length:var(--social-icon)] text-[#555]" />
                </a>

                <a
                  className="w-[var(--social)] h-[var(--social)] shadow-[var(--shadow-social)] grid place-items-center no-underline transition-transform duration-150 ease-out rounded-full border border-solid border-[color:var(--border-soft)] hover:-translate-y-0.5 bg-white"
                  href="https://www.instagram.com/ics_aviation/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram className="text-[length:var(--social-icon)] text-[#555]" />
                </a>

                <a
                  className="w-[var(--social)] h-[var(--social)] shadow-[var(--shadow-social)] grid place-items-center no-underline transition-transform duration-150 ease-out rounded-full border border-solid border-[color:var(--border-soft)] hover:-translate-y-0.5 bg-white"
                  href="https://www.youtube.com/@ICSAviation-TrainingSolutions"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaYoutube className="text-[length:var(--social-icon)] text-[#555]" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT (desktop hero) */}
          <div className="min-w-0 flex flex-col items-center justify-center max-[1100px]:hidden">
            <div className="block -translate-y-3.5">
              <HeroBlock />
            </div>
          </div>
        </div>
      </section>

      <NotifyModal
        open={open}
        onClose={closeModal}
        onSubmit={async (email) => {
          const res = await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          if (!res.ok) throw new Error("Failed to submit");
        }}
      />
    </main>
  );
}
