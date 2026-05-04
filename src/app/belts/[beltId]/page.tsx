import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadCurriculum, loadAllBeltLevels } from "@/curriculum/loader";
import { BeltViewTracker } from "@/components/belt-view-tracker";
import type { Technique } from "@/curriculum/types";

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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CATEGORY_LABELS: Record<string, string> = {
  stance: "Stances",
  block: "Blocks",
  attack: "Attacks",
  kick: "Kicks",
  defence: "Defence",
};

const CATEGORY_ORDER = ["stance", "block", "attack", "kick", "defence"];

export async function generateStaticParams() {
  return loadAllBeltLevels().map((belt) => ({ beltId: belt.id }));
}

type BeltParams = { params: Promise<{ beltId: string }> };

export async function generateMetadata({
  params,
}: BeltParams): Promise<Metadata> {
  const { beltId } = await params;
  try {
    const { beltLevel } = loadCurriculum(beltId);
    return {
      title: `${beltDisplayName(beltLevel.colour)} | Taekwondo Training`,
      description: `${ordinal(beltLevel.rank)} Kup curriculum — tul, techniques, theory, and sparring for TAGB/ITF Taekwondo.`,
    };
  } catch {
    return { title: "Taekwondo Training" };
  }
}

export default async function BeltPage({ params }: BeltParams) {
  const { beltId } = await params;

  const curriculum = (() => {
    try {
      return loadCurriculum(beltId);
    } catch {
      notFound();
    }
  })();

  const { beltLevel, tul, techniques, oneStepSparring, theory } = curriculum;

  const techniquesByCategory = techniques.reduce<Record<string, Technique[]>>(
    (acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    },
    {}
  );

  const orderedCategories = CATEGORY_ORDER.filter(
    (cat) => techniquesByCategory[cat]
  );

  return (
    <>
      <BeltViewTracker belt={beltId} />
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-8">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 min-h-[44px] mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All belt levels
        </Link>

        {/* Belt header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {beltDisplayName(beltLevel.colour)}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {ordinal(beltLevel.rank)} Kup &middot; {beltLevel.koreanName}
          </p>
        </header>

        {/* Tul */}
        {tul.length > 0 && (
          <section className="mb-10" aria-labelledby="tul-heading">
            <h2
              id="tul-heading"
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
            >
              Tul — Pattern{tul.length !== 1 ? "s" : ""}
            </h2>
            <div className="space-y-3">
              {tul.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.koreanName}</p>
                    </div>
                    <span className="flex-shrink-0 rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {t.movements} moves
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-700">
                    {t.meaning}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Techniques */}
        {techniques.length > 0 && (
          <section className="mb-10" aria-labelledby="techniques-heading">
            <h2
              id="techniques-heading"
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
            >
              Techniques
            </h2>
            <div className="space-y-5">
              {orderedCategories.map((cat) => (
                <div key={cat}>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">
                    {CATEGORY_LABELS[cat] ?? capitalize(cat)}
                  </h3>
                  <ul className="space-y-2">
                    {techniquesByCategory[cat].map((tech) => (
                      <li
                        key={tech.id}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {tech.englishName}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {tech.koreanName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {tech.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* One-step sparring */}
        {oneStepSparring.length > 0 && (
          <section className="mb-10" aria-labelledby="sparring-heading">
            <h2
              id="sparring-heading"
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
            >
              Il-Su Sik — One-Step Sparring
            </h2>
            <div className="space-y-3">
              {oneStepSparring.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="text-xs font-semibold text-gray-400 mb-3">
                    Step {s.number}
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Attack
                      </p>
                      <p className="text-sm text-gray-800">{s.attack}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Defence
                      </p>
                      <p className="text-sm text-gray-800">{s.defence}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Theory */}
        {theory.length > 0 && (
          <section className="mb-10" aria-labelledby="theory-heading">
            <h2
              id="theory-heading"
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
            >
              Theory
            </h2>
            <div className="space-y-3">
              {theory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="font-medium text-gray-900 text-sm">
                    {item.question}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
