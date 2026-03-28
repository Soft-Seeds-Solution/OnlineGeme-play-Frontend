export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="ring"></div>
        <div className="ring ring-delay"></div>
        <h4 className="loading-text">Loading</h4>
      </div>
    </div>
  );
}