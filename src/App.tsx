import './styles.css';
import { NavLink, Outlet } from 'react-router';

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

          <nav className="flex items-center gap-2">
            <NavLink
              to="/candidates"
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              Candidates
            </NavLink>
          </nav>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
