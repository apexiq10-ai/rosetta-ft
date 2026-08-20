import Argument from "@/src/components/screens/Argument";
import MasterNarrative from "@/src/components/screens/MasterNarrative";
import Pillars from "@/src/components/screens/Pillars";

export default function Home() {
  return (
    <main className="h-dvh snap-y snap-proximity overflow-y-auto overscroll-y-none">
      <MasterNarrative />
      <Argument />
      <Pillars />
    </main>
  );
}
