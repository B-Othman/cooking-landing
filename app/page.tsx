"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import NotifyModal from "./NotifyModal";

export default function Page() {
  const [open, setOpen] = useState(false);

  // ✅ detect mobile/tablet
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

  const [handleW, setHandleW] = useState(76);
  useEffect(() => {
    const el = handleRef.current;
    if (!el) return;
    const update = () => setHandleW(el.clientWidth || 76);
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
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isMobile) return;

    const maxX = getMaxX();
    if (!maxX) return;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
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

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const fillW = Math.max(0, INSET + handleW + x);

  return (
    <main className="landing-viewport">
      <section className="landing-card">
        <div className="landing-inner">
          {/* LEFT */}
          <div className="landing-left">
            <div className="landing-kicker">We Are</div>

            <h1 className="landing-title">
              {/* Desktop */}
              <span className="title-desktop">
                Elevating Our <br />
                Digital Experience
              </span>

              {/* Mobile */}
              <span className="title-mobile">
                Elevating <br />
                Our Digital Experience
              </span>
            </h1>

            <p className="landing-desc">
              ICS Aviation is preparing a renewed digital platform designed to
              better serve aviation professionals, institutions, and partners.
              Our upcoming website will provide improved access to our training
              portfolio, advisory capabilities, and international cooperation
              initiatives. Stay connected as we prepare to launch.
            </p>

            {/* ✅ MOBILE: HERO ABOVE SLIDER + SOCIALS */}
            {isMobile ? (
              <div className="landing-mobileHero">
                <div className="landing-heroWrap">
                  <Image
                    src="/pilots.png"
                    alt="Pilots"
                    fill
                    priority
                    sizes="(max-width: 1100px) 520px, 695px"
                    className="landing-heroImg"
                  />
                </div>

                <div className="landing-caption">
                  Advancing aviation expertise through knowledge, partnership,
                  and professionalism.
                </div>
              </div>
            ) : null}

            {/* SLIDER */}
            <div
              ref={trackRef}
              className={`landing-slide ${
                dragging || animating ? "is-dragging" : ""
              }`}
              aria-label="Notify me"
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
                className="landing-slideFill"
                style={{ width: fillW }}
                aria-hidden
              />
              <div className="landing-slideText">Stay Informed</div>

              <div className="landing-slideArrow" aria-hidden>
                <FiChevronRight />
              </div>

              <button
                ref={handleRef}
                type="button"
                className="landing-slideHandle"
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
                <MdEmail className="landing-slideMail" />
              </button>
            </div>

            <div className="landing-socials">
              <a className="landing-socialBtn" href="#" aria-label="Facebook">
                <FaFacebookF className="landing-socialIcon" />
              </a>
              <a className="landing-socialBtn" href="#" aria-label="LinkedIn">
                <FaLinkedinIn className="landing-socialIcon" />
              </a>
              <a className="landing-socialBtn" href="#" aria-label="Instagram">
                <FaInstagram className="landing-socialIcon" />
              </a>
              <a className="landing-socialBtn" href="#" aria-label="YouTube">
                <FaYoutube className="landing-socialIcon" />
              </a>
            </div>
          </div>

          {/* ✅ DESKTOP ONLY RIGHT */}
          {!isMobile ? (
            <div className="landing-right">
              <div className="landing-heroWrap">
                <Image
                  src="/pilots.png"
                  alt="Pilots"
                  fill
                  priority
                  sizes="(max-width: 1100px) 520px, 695px"
                  className="landing-heroImg"
                />
              </div>

              <div className="landing-caption">
                Advancing aviation expertise through knowledge, partnership, and
                professionalism.
              </div>
            </div>
          ) : null}
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
