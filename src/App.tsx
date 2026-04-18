import './styles.css';

function App() {
  return (
    <div className="min-h-screen bg-[--color-page] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-8">
        <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Frontend Test
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Tunduk Dashboard
            </h1>
          </div>
        </header>

        <main className="flex-1">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Project baseline is ready
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Tailwind CSS is configured with a minimal global theme for a
                clean dashboard foundation. Business logic and task-specific UI
                can be added incrementally.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
