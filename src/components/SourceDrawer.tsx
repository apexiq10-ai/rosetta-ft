"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { sources } from "@/src/content/content";
import { ui } from "@/src/content/ui";

type SourceDrawerContextValue = {
  openSource: (id: string) => void;
  openSourceId: string | null;
};

const SourceDrawerContext = createContext<SourceDrawerContextValue | null>(null);

export function useSourceDrawer(): SourceDrawerContextValue {
  const value = useContext(SourceDrawerContext);
  if (!value) {
    throw new Error("useSourceDrawer must be used inside SourceProvider");
  }
  return value;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Owns the single piece of drawer state for the whole artifact, lifted here so
 * any screen can raise a citation without threading callbacks through props.
 */
export function SourceProvider({ children }: { children: ReactNode }) {
  const [openSourceId, setOpenSourceId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const openSource = useCallback((id: string) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpenSourceId(id);
  }, []);

  const close = useCallback(() => {
    setOpenSourceId(null);
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger && document.contains(trigger)) {
      trigger.focus();
    }
  }, []);

  useEffect(() => {
    if (!openSourceId) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openSourceId, close]);

  const source = sources.find((item) => item.id === openSourceId) ?? null;
  const isOpen = source !== null;

  return (
    <SourceDrawerContext.Provider value={{ openSource, openSourceId }}>
      {children}

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-ink/25 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-drawer-title"
        inert={!isOpen}
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[80dvh] overflow-y-auto border-t border-hairline bg-paper transition-transform duration-200 ease-out md:inset-y-0 md:right-0 md:left-auto md:w-[26rem] md:max-h-none md:border-t-0 md:border-l ${
          isOpen
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <p
            id="source-drawer-title"
            className="font-mono text-xs tracking-wide text-slate uppercase"
          >
            {ui.drawerTitle}
            {source ? ` ${sources.indexOf(source) + 1}` : ""}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={ui.drawerClose}
            className="-mt-1 border border-hairline px-2 py-1 font-mono text-xs text-slate transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg
              viewBox="0 0 12 12"
              className="h-3 w-3"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        </div>

        {source ? (
          <div className="px-6 pt-6 pb-10">
            <p className="max-w-[65ch] font-body text-base leading-relaxed text-ink">
              {source.claim}
            </p>
            <p className="mt-6 font-mono text-xs tracking-wide text-slate uppercase">
              {source.publisher}
            </p>
            <p className="mt-1 font-mono text-xs tracking-wide text-slate uppercase">
              {source.date}
            </p>
            <a
              href={source.url}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block max-w-full break-all font-mono text-xs text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {source.url}
            </a>
          </div>
        ) : null}
      </div>
    </SourceDrawerContext.Provider>
  );
}
