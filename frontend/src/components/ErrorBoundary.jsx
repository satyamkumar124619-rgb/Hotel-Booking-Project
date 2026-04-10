import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#0E0F0D',
          fontFamily: "'DM Sans', sans-serif",
          padding: '24px',
        }}>
          <div style={{
            background: '#161714',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '48px',
            textAlign: 'center',
            borderRadius: '8px',
            maxWidth: '500px',
          }}>
            <h1 style={{ color: '#C6A264', marginBottom: '16px', fontSize: '48px' }}>⚠️</h1>
            <h2 style={{ color: '#F0EDE6', marginBottom: '12px', fontSize: '24px' }}>Oops! Something went wrong</h2>
            <p style={{ color: 'rgba(240,237,230,0.62)', marginBottom: '28px', fontSize: '14px', lineHeight: '1.6' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 32px',
                background: '#C6A264',
                border: 'none',
                color: '#0E0F0D',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.background = '#D4B97E'}
              onMouseLeave={(e) => e.target.style.background = '#C6A264'}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
