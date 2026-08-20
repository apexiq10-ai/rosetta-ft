import type { ReactNode } from "react";

type ScreenBackground = "canvas" | "paper" | "shade" | "accent";

const backgrounds: Record<ScreenBackground, string> = {
  canvas: "bg-canvas",
  paper: "bg-paper",
  shade: "bg-shade",
  accent: "bg-accent",
};

type ScreenShellProps = {
  children: ReactNode;
  bg?: ScreenBackground;
  id?: string;
  className?: string;
  /**
   * Forces the section to fill the viewport. Reserved for screens whose whole
   * point is the full-bleed pause, not applied by default: sizing to content
   * keeps shorter sections from opening up dead space below the fold.
   */
  fill?: boolean;
};

/**
 * Shared scroll-snap section. Every screen in the artifact is one of these,
 * which is what makes the scroll read as distinct screens rather than a
 * continuous page.
 */
export default function ScreenShell({
  children,
  bg = "canvas",
  id,
  className = "",
  fill = false,
}: ScreenShellProps) {
  // The extra bottom padding on filled sections keeps the compliance bar off
  // the content it would otherwise sit on top of.
  const height = fill
    ? "min-h-dvh py-20 pb-28 md:pb-24"
    : "py-16 pb-20 md:py-20 md:pb-24";

  return (
    <section
      id={id}
      className={`flex w-full snap-start flex-col justify-center px-6 md:px-12 ${height} ${backgrounds[bg]} ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}
