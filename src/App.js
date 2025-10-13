import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import { productionConfig, validateEnvironment, isProduction } from './config/production';
import { logger } from './utils/logger';
import './styles/globals.css';
import { analyticsService } from './services/analyticsService';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Products = lazy(() => import('./pages/Products/Products'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout')); // Added missing import

// Validate environment in production
if (isProduction) {
  const isValid = validateEnvironment();
  if (!isValid) {
    logger.auth.error('Invalid environment configuration');
  }
}

// Auth0 configuration
const auth0Config = {
  domain: productionConfig.auth0.domain,
  clientId: productionConfig.auth0.clientId,
  authorizationParams: {
    redirect_uri: productionConfig.auth0.redirectUri,
    audience: productionConfig.auth0.audience
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  // Initialize analytics
  useEffect(() => {
    analyticsService.init();
  }, []);

  // Track page views
  useEffect(() => {
    const pageTitles = {
      landing: 'Home - Paradise Nursery',
      products: 'Plants - Paradise Nursery',
      cart: 'Shopping Cart - Paradise Nursery',
      profile: 'Profile - Paradise Nursery',
      checkout: 'Checkout - Paradise Nursery'
    };

    analyticsService.trackPageView(currentPage, pageTitles[currentPage] || 'Paradise Nursery');
  }, [currentPage]);

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
      case 'checkout': // Added missing case
        return <Checkout onNavigate={setCurrentPage} />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  // Enhanced Auth0 configuration check
  const isAuth0Configured = productionConfig.auth0.domain && productionConfig.auth0.clientId;

  // Create the main app content
  const appContent = (
    <div className="App">
      {!isAuth0Configured && (
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '10px', 
          textAlign: 'center',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          margin: '10px'
        }}>
          ⚠️ Auth0 not configured. Please check your environment variables.
        </div>
      )}
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        <Suspense fallback={<LoadingSpinner text="Loading application..." />}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer />
    </div>
  );

  // Wrap with providers based on Auth0 configuration
  if (!isAuth0Configured) {
    const errorMessage = 'Auth0 not configured. Please check your environment variables.';
    
    if (isProduction) {
      logger.auth.error(errorMessage);
    } else {
      console.warn(errorMessage);
    }

    return (
      <CartProvider>
        <ErrorBoundary>
          {appContent}
        </ErrorBoundary>
      </CartProvider>
    );
  }

  return (
    <Auth0Provider {...auth0Config}>
      <AuthProvider>
        <CartProvider>
          <ErrorBoundary>
            {appContent}
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </Auth0Provider>
  );
}

export default App;