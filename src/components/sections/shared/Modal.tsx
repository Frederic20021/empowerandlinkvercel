"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

type ModalProps = {
  /** Heading text (also names the dialog). */
  title: string;
  /** Use the `.bk-h` booking heading style instead of `.modal-h`. */
  booking?: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Accessible modal dialog (`.modal`): portal to <body>, role=dialog + aria-modal, focus moves in,
 * Tab is trapped, Esc / backdrop / close button dismiss, focus returns to the opener, page scroll locked.
 * Render it only while open.
 */
export function Modal({ title, booking, onClose, children }: ModalProps) {
  const id = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;
      const els = Array.from(cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hidden);
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (!cardRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  return createPortal(
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}>
      <div className="modal-back" onClick={onClose} />
      <div className="modal-card" ref={cardRef}>
        <button ref={closeRef} className="modal-x" type="button" onClick={onClose} aria-label="閉じる">
          <Icon name="x" />
        </button>
        {booking ? (
          <h3 className="bk-h" id={`${id}-t`}>
            {title}
          </h3>
        ) : (
          <h2 className="modal-h" id={`${id}-t`}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
