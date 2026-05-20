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

// shared-loading.js
document.write(`
  <!-- Loading Screen -->
  <div id="loading-screen">
    <canvas id="particle-canvas"></canvas>
    <img class="loading-logo" src="https://www.khelogy.com/loading-logo.png" alt="Khelogy Logo" />
    <div class="loading-bar-container">
      <div class="loading-bar-fill" id="loading-bar"></div>
    </div>
    <div class="loading-text" id="loading-text">Loading...</div>
  </div>
`);