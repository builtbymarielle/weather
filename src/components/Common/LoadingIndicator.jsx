/**
 * LoadingIndicator
 *
 * Displays a centered Bootstrap loading spinner and message.
 */
export default function LoadingIndicator({
    message = "Loading weather..."
  }) {
    return (
      <div className="loading-overlay">
        <div className="spinner-border text-light" role="status" />
        <p className="mt-3 text-white">{message}</p>
      </div>
    );
  }