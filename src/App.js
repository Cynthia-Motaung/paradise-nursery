import React, { useState } from 'react';
import Header from './components/Header';
import Landing from './pages/Landing';
import Products from './pages/Products';
import Cart from './pages/Cart';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={setCurrentPage} />;
      case 'products':
        return <Products />;
      case 'cart':
        return <Cart onNavigate={setCurrentPage} />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;