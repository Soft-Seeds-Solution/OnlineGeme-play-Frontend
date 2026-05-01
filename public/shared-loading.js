// Inject robots meta tag globally
(function () {
  function addRobotsMeta() {
    if (!document.querySelector('meta[name="robots"]')) {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, nofollow";
      document.head.appendChild(meta);
    }
  }

  if (document.head) {
    addRobotsMeta();
  } else {
    document.addEventListener("DOMContentLoaded", addRobotsMeta);
  }
})();

// ✅ Detect domain and set logo
(function () {
  const hostname = window.location.hostname;

  let logoUrl = "";

  if (hostname.includes("sourceplunge")) {
    logoUrl = "https://www.khelogy.com/sourceplunge-loading-logo.png";
  } else if (hostname.includes("khelogy")) {
    logoUrl = "https://www.khelogy.com/loading-logo.png";
  } else {
    // fallback
    logoUrl = "https://www.khelogy.com/loading-logo.png";
  }

  // Inject loader
  document.write(`
    <div id="loading-screen">
      <canvas id="particle-canvas"></canvas>
      <img class="loading-logo" src="${logoUrl}" alt="Logo" />
      <div class="loading-bar-container">
        <div class="loading-bar-fill" id="loading-bar"></div>
      </div>
      <div class="loading-text" id="loading-text">Loading...</div>
    </div>
  `);
})();