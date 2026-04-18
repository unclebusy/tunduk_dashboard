import './styles.css';
import { NavLink, Outlet } from 'react-router';

function App() {
  return (
    <div className="min-h-screen bg-[--color-page] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Тундук
            </h1>
            <p className="text-lg font-medium tracking-[0.4em] text-slate-500">
              Панель управления кандидатами
            </p>
            <p className="text-sm font-medium tracking-[0.04em] text-slate-400">
              создал Unclebusy
            </p>
          </div>

          <nav className="flex items-center gap-2 self-start sm:self-auto">
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
              Кандидаты
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
