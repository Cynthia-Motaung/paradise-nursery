
/**
 * Production configuration
 */

export const productionConfig = {
  // Auth0 configuration
  auth0: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    redirectUri: window.location.origin,
    logoutRedirectUri: process.env.REACT_APP_LOGOUT_REDIRECT_URI || window.location.origin
  },

  // API configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.paradise-nursery.com',
    timeout: 30000,
    retryAttempts: 3
  },

  // Feature flags
  features: {
    wishlist: process.env.REACT_APP_ENABLE_WISHLIST === 'true',
    reviews: process.env.REACT_APP_ENABLE_REVIEWS === 'true',
    analytics: true,
    errorTracking: true
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.REACT_APP_GA_ID,
    hotjarId: process.env.REACT_APP_HOTJAR_ID
  },

  // Error tracking
  errorTracking: {
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    logRocketId: process.env.REACT_APP_LOGROCKET_ID
  },

  // Performance
  performance: {
    enableWebVitals: true,
    enableLazyLoading: true,
    enableCaching: true
  }
};

// Validate required environment variables
export const validateEnvironment = () => {
  const required = [
    'REACT_APP_AUTH0_DOMAIN',
    'REACT_APP_AUTH0_CLIENT_ID'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  return true;
};

// Check if we're in production
export const isProduction = process.env.NODE_ENV === 'production';

// Check if we're in development
export const isDevelopment = process.env.NODE_ENV === 'development';
