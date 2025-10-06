import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ProtectedRoute = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return fallback || (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Authentication Required</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

export default ProtectedRoute;