import CSVGenerator from "./components/CSVGenerator";

export default function App() {
  return (
    <div className="min-h-screen p-4 grid grid-cols-1 place-items-center bg-gradient-to-br from-lime-100 via-lime-50-100 to-emerald-100">
      <CSVGenerator />
    </div>
  );
}
