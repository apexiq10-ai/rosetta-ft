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
          {/* Four short beats, not paragraphs. The last carries the thesis, so
              it is set in ink at full weight. */}
          <div className="space-y-5">
            {argument.paragraphs.map((line, index) => {
              const last = index === argument.paragraphs.length - 1;
              return (
                <p
                  key={index}
                  className={`font-body text-lg leading-snug md:text-2xl ${
                    last ? "font-semibold text-ink" : "text-slate"
                  }`}
                >
                  {line}
                </p>
              );
            })}
          </div>

          <SourceChip sourceIds={argument.sourceIds} className="mt-10" />
        </div>
      </div>
    </ScreenShell>
  );
}
