import ScreenShell from "../ScreenShell";
import SourceChip from "../SourceChip";
import { argument } from "@/src/content/content";

export default function Argument() {
  return (
    <ScreenShell id="argument" bg="paper">
      <h2 className="max-w-3xl font-sans text-3xl leading-tight font-semibold text-ink md:text-4xl">
        {argument.heading}
      </h2>

      <div className="mt-10 max-w-2xl space-y-6">
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
    </ScreenShell>
  );
}
