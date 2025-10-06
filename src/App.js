import React, { useState, Suspense, lazy } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import './styles/globals.css';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Products = lazy(() => import('./pages/Products/Products'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

// Get the current origin for redirects
const redirectUri = window.location.origin;

// Simple Auth0 configuration
const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: redirectUri,
  },
  cacheLocation: 'localstorage'
};

// Remove audience and scope for now to simplify
const simpleAuth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: redirectUri,
  },
  cacheLocation: 'localstorage'
};

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
      case 'profile':
        return <Profile onNavigate={setCurrentPage} />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  // If Auth0 is not configured, show a warning but still render the app
  if (!simpleAuth0Config.domain || !simpleAuth0Config.clientId) {
    console.warn('Auth0 not configured. Authentication will not work.');
    return (
      <CartProvider>
        <ErrorBoundary>
          <div className="App">
            <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', textAlign: 'center' }}>
              ⚠️ Auth0 not configured. Please check your environment variables.
            </div>
            <Header currentPage={currentPage} onNavigate={setCurrentPage} />
            <main>
              <Suspense fallback={<LoadingSpinner />}>
                {renderPage()}
              </Suspense>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </CartProvider>
    );
  }

  return (
    <Auth0Provider {...simpleAuth0Config}>
      <AuthProvider>
        <CartProvider>
          <ErrorBoundary>
            <div className="App">
              <Header currentPage={currentPage} onNavigate={setCurrentPage} />
              <main>
                <Suspense fallback={<LoadingSpinner />}>
                  {renderPage()}
                </Suspense>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </Auth0Provider>
  );
}

export default App;