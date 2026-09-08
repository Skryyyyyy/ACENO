import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('THUMP React Runtime Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#060708',
          color: '#FFFFFF',
          padding: '40px 20px',
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            backgroundColor: '#14171d',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
            padding: '30px'
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#EF4444', marginBottom: '10px' }}>
              ⚠️ THUMP Runtime Error
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>
              {this.state.error?.toString()}
            </p>
            <pre style={{
              backgroundColor: '#000000',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '11px',
              overflowX: 'auto',
              color: '#F87171'
            }}>
              {this.state.errorInfo?.componentStack || 'No stack trace'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Reload Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
