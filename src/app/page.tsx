export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-full max-w-sm">
        <p className="mb-2 text-5xl" aria-hidden>
          🥋
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
          Hello, Taekwondo
        </h1>
        <p className="text-base leading-7 text-gray-600">
          A free, mobile-first training companion for students of every belt
          level. Curriculum and drill tracker — coming soon.
        </p>
      </div>
    </main>
  );
}
