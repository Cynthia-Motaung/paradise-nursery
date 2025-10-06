import React, { useState, Suspense, lazy } from 'react';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import './styles/globals.css';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Products = lazy(() => import('./pages/Products/Products'));
const Cart = lazy(() => import('./pages/Cart/Cart'));

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
    <ErrorBoundary>
      <CartProvider>
        <div className="App">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <main>
            <Suspense fallback={<LoadingSpinner />}>
              {renderPage()}
            </Suspense>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;