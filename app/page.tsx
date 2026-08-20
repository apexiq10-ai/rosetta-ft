import Argument from "@/src/components/screens/Argument";
import Cascade from "@/src/components/screens/Cascade";
import Collisions from "@/src/components/screens/Collisions";
import MasterNarrative from "@/src/components/screens/MasterNarrative";
import Pillars from "@/src/components/screens/Pillars";

export default function Home() {
  return (
    <main className="h-dvh snap-y snap-proximity overflow-y-auto overscroll-y-none">
      <MasterNarrative />
      <Argument />
      <Pillars />
      <Collisions />
      <Cascade />
    </main>
  );
}
