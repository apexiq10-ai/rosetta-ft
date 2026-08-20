import ScreenShell from "../ScreenShell";
import SourceChip from "../SourceChip";
import { argument } from "@/src/content/content";

export default function Argument() {
  return (
    <ScreenShell id="argument" bg="paper">
      {/* Two columns on desktop so the section fills the width without
          stretching the line length past a readable measure. */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-20">
        <h2 className="font-sans text-3xl leading-tight font-semibold text-ink md:text-5xl">
          {argument.heading}
        </h2>

        <div>
          <div className="space-y-6">
            {argument.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="font-body text-base leading-relaxed text-slate md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <SourceChip sourceIds={argument.sourceIds} className="mt-10" />
        </div>
      </div>
    </ScreenShell>
  );
}
