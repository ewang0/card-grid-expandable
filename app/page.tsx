import ExpandingCardGrid from "./components/expanding-card-grid";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prediction Markets</h1>
      <ExpandingCardGrid />
    </div>
  </main>
  );
}
