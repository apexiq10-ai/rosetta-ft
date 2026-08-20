import type { ReactNode } from "react";

type ScreenBackground = "canvas" | "paper" | "shade";

const backgrounds: Record<ScreenBackground, string> = {
  canvas: "bg-canvas",
  paper: "bg-paper",
  shade: "bg-shade",
};

type ScreenShellProps = {
  children: ReactNode;
  bg?: ScreenBackground;
  id?: string;
  className?: string;
};

/**
 * Full-viewport scroll-snap section. Every screen in the artifact is one of
 * these, which is what makes the scroll read as distinct screens rather than
 * a continuous page.
 */
export default function ScreenShell({
  children,
  bg = "canvas",
  id,
  className = "",
}: ScreenShellProps) {
  return (
    <section
      id={id}
      className={`flex min-h-dvh w-full snap-start flex-col justify-center px-6 pt-20 pb-28 md:px-12 md:pb-24 ${backgrounds[bg]} ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}
