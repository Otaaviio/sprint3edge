import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    // Usando classes do Tailwind CDN para o layout
    <div className="bg-gray-900 min-h-screen text-white p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Painel de Monitoramento</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;