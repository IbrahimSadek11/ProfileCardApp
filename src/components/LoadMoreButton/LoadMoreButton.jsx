import "./LoadMoreButton.css";

function LoadMoreButton({ onClick, disabled, message }) {
  return (
    <button className="load-more-btn" onClick={onClick} disabled={disabled}>
      {message}
    </button>
  );
}

export default LoadMoreButton;
