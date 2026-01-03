import { Component, type ReactNode } from 'react'
import { clientConfig } from '../client.config'
import { captureException } from '../lib/errorReporting'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Report error to error reporting service
    captureException(error, {
      componentStack: errorInfo.componentStack ?? undefined,
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconWrapper}>
              <svg
                style={styles.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>
              We're sorry, but something unexpected happened. Please try again.
            </p>
            {this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Technical details</summary>
                <pre style={styles.errorText}>{this.state.error.message}</pre>
              </details>
            )}
            <div style={styles.actions}>
              <button onClick={this.handleRetry} style={styles.primaryButton}>
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={styles.secondaryButton}
              >
                Go Home
              </button>
            </div>
            <p style={styles.contact}>
              If this keeps happening, please contact us at{' '}
              <a href={`mailto:${clientConfig.contact.email}`} style={styles.link}>
                {clientConfig.contact.email}
              </a>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: 'var(--color-neutral-50)',
  },
  card: {
    maxWidth: '28rem',
    width: '100%',
    textAlign: 'center',
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  icon: {
    width: '4rem',
    height: '4rem',
    color: 'var(--color-brand-accent)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--color-neutral-900)',
    marginBottom: '0.75rem',
  },
  message: {
    color: 'var(--color-neutral-600)',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  details: {
    textAlign: 'left',
    marginBottom: '1.5rem',
    padding: '0.75rem',
    backgroundColor: 'var(--color-neutral-100)',
    borderRadius: '0.5rem',
  },
  summary: {
    cursor: 'pointer',
    color: 'var(--color-neutral-600)',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  errorText: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--color-neutral-800)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  primaryButton: {
    padding: '0.625rem 1.25rem',
    backgroundColor: 'var(--color-brand-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  secondaryButton: {
    padding: '0.625rem 1.25rem',
    backgroundColor: 'transparent',
    color: 'var(--color-neutral-600)',
    border: '1px solid var(--color-neutral-200)',
    borderRadius: '0.5rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  contact: {
    fontSize: '0.875rem',
    color: 'var(--color-neutral-600)',
  },
  link: {
    color: 'var(--color-brand-primary)',
    textDecoration: 'underline',
  },
}
