import './styles.css';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-badge">Frontend Test</span>
        <h1>Tunduk Dashboard</h1>
        <p>A minimal React 18 + TypeScript starter built with Vite.</p>
      </header>

      <main className="app-content">
        <section className="app-card">
          <h2>Project Ready</h2>
          <p>
            Core project structure is in place. Business logic, routing, and UI
            components can be added incrementally.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
