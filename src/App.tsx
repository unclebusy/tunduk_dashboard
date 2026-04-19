import './styles.css';
import { Link, Outlet, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import logo from './assets/logo.svg';

function App() {
  const { pathname, search } = useLocation();
  const isCandidateDetailPage = pathname.startsWith('/candidate/');
  const candidatesLink = {
    pathname: '/candidates',
    search,
  };

  return (
    <div className="min-h-screen bg-[--color-page] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="Логотип Тундук"
                className="h-9 w-9 shrink-0 object-contain"
              />
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Тундук
              </h1>
            </div>
            <p className="mt-1 text-sm font-medium tracking-[0.24em] text-slate-500 sm:text-base">
              Панель управления кандидатами
            </p>
          </div>

          {isCandidateDetailPage ? (
            <nav className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                to={candidatesLink}
                className="cursor-pointer rounded-lg bg-[#1560BD] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f4a92]"
              >
                ← Кандидаты
              </Link>
            </nav>
          ) : (
            <div className="self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 sm:self-auto">
              Раздел: Кандидаты
            </div>
          )}
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster
        position="top-right"
        richColors
        expand={false}
        closeButton
        toastOptions={{
          classNames: {
            toast: 'border border-slate-200 shadow-lg',
            title: 'text-sm font-medium',
          },
        }}
      />
    </div>
  );
}

export default App;
