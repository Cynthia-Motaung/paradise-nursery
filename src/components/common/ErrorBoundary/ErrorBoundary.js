
import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorBoundary.module.css';
import { errorBoundaryLogger } from '../../../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error with context
    errorBoundaryLogger.error('Error caught by boundary', error, {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  handleReset = () => {
    errorBoundaryLogger.info('Error boundary reset by user');
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    errorBoundaryLogger.info('Page reload initiated from error boundary');
    window.location.reload();
  };

  handleReport = () => {
    const { error, errorInfo } = this.state;
    
    errorBoundaryLogger.info('Error reported by user', null, {
      error: error?.toString(),
      componentStack: errorInfo?.componentStack
    });

    // TODO: Send error report to backend
    alert('Thank you for reporting the issue! We will look into it.');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container} role="alert">
          <div className={styles.content}>
            <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className={styles.details}>
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            
            <div className={styles.actions}>
              <button 
                className="btn btn--secondary" 
                onClick={this.handleReset}
              >
                Try Again
              </button>
              <button 
                className="btn btn--secondary" 
                onClick={this.handleReport}
              >
                Report Issue
              </button>
              <button 
                className="btn" 
                onClick={this.handleReload}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

export default ErrorBoundary;
