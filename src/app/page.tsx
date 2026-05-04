import Image from "next/image";
import Link from "next/link";
import { loadAllBeltLevels } from "@/curriculum/loader";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

const BELT_DISPLAY_NAMES: Record<string, string> = {
  white: "White Belt",
  "white-yellow-tag": "White Belt with Yellow Tag",
  yellow: "Yellow Belt",
  "yellow-green-tag": "Yellow Belt with Green Tag",
  green: "Green Belt",
  "green-blue-tag": "Green Belt with Blue Tag",
  blue: "Blue Belt",
  "blue-red-tag": "Blue Belt with Red Tag",
  red: "Red Belt",
  "red-black-tag": "Red Belt with Black Tag",
  black: "Black Belt",
};

function beltDisplayName(colour: string): string {
  return (
    BELT_DISPLAY_NAMES[colour] ??
    colour
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") + " Belt"
  );
}

function beltSwatchColor(colour: string): string {
  const base = colour.split("-")[0];
  const map: Record<string, string> = {
    white: "#f1f5f9",
    yellow: "#eab308",
    green: "#22c55e",
    blue: "#3b82f6",
    red: "#ef4444",
    black: "#111827",
  };
  return map[base] ?? "#e5e7eb";
}

export default async function Home() {
  const belts = loadAllBeltLevels();

  return (
    <main className="flex-1 w-full max-w-lg mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <Image
          src="/logo.jpg"
          alt="TKD App logo"
          width={80}
          height={80}
          className="mx-auto mb-4 rounded-xl"
        />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Taekwondo Training
        </h1>
        <p className="mt-2 text-base text-gray-500">
          Select your belt level to view curriculum and drills.
        </p>
      </header>

      <ul className="space-y-3" role="list">
        {belts.map((belt) => (
          <li key={belt.id}>
            <Link
              href={`/belts/${belt.id}`}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-200 bg-white min-h-[64px] hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition-all"
            >
              <span
                className="inline-block w-3 h-9 rounded-sm border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: beltSwatchColor(belt.colour) }}
                aria-hidden
              />
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-gray-900 leading-tight">
                  {beltDisplayName(belt.colour)}
                </span>
                <span className="block text-sm text-gray-500 mt-0.5">
                  {ordinal(belt.rank)} Kup &middot; {belt.koreanName}
                </span>
              </span>
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
