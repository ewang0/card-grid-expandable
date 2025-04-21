import ExpandingCardGrid from "./components/expanding-card-grid";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-neutral-950 text-white flex items-center justify-center">
      <div className="max-w-7xl w-full">
        <ExpandingCardGrid />
      </div>
    </main>
  );
}
